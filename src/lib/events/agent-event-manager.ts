// 🎯 AGENT EVENT MANAGER - Event-Driven Agent Coordination
// Advanced event management for multi-agent system coordination

import { EventBus } from './event-bus';
import { EventFactory } from './event-factory';
import { InMemoryEventStore } from './event-store';
import { 
  AgentEvent, 
  AgentEventType, 
  EventHandler,
  EventFilter 
} from '@/types/events';
import { BaseAgent } from '@/lib/agents/base-agent';
import { Task, AgentRole } from '@/types/agents';

export class AgentEventManager {
  private eventBus: EventBus;
  private eventStore: InMemoryEventStore;
  private agents = new Map<string, BaseAgent>();
  private taskQueue: Task[] = [];
  private agentCapabilities = new Map<string, string[]>();
  private agentWorkloads = new Map<string, number>();

  constructor() {
    this.eventStore = new InMemoryEventStore();
    this.eventBus = new EventBus(this.eventStore, {
      maxRetries: 3,
      retryDelay: 1000,
      batchSize: 10,
      flushInterval: 100,
      persistence: true,
      compression: false,
      encryption: false
    });

    this.setupEventHandlers();
  }

  // Register agent with event system
  public registerAgent(agent: BaseAgent): void {
    this.agents.set(agent.getId(), agent);
    
    // Get agent capabilities
    const capabilities = agent.getAvailableTools();
    this.agentCapabilities.set(agent.getId(), capabilities);
    this.agentWorkloads.set(agent.getId(), 0);

    // Emit agent registered event
    const event = EventFactory.createAgentRegisteredEvent(
      agent.getId(),
      agent.getRole(),
      capabilities,
      'agent_manager'
    );
    
    this.eventBus.publish(event);
    console.log(`🤖 Agent registered: ${agent.getId()} (${agent.getRole()})`);
  }

  // Update agent capabilities
  public updateAgentCapabilities(agentId: string, capabilities: string[]): void {
    if (this.agents.has(agentId)) {
      this.agentCapabilities.set(agentId, capabilities);
      const agent = this.agents.get(agentId)!;
      agent.updateAvailableTools(capabilities);
      console.log(`🔄 Agent capabilities updated: ${agentId}`);
    }
  }

  // Submit task to the system
  public async submitTask(task: Task): Promise<void> {
    // Emit task created event
    const event = EventFactory.createTaskCreatedEvent(task, 'agent_manager');
    await this.eventBus.publish(event);

    // Add to task queue
    this.taskQueue.push(task);
    
    // Try to assign task immediately
    await this.assignTask(task);
    
    console.log(`📋 Task submitted: ${task.title}`);
  }

  // Assign task to best available agent
  private async assignTask(task: Task): Promise<void> {
    const availableAgents = this.getAvailableAgents();
    
    if (availableAgents.length === 0) {
      console.log(`⏳ No available agents for task: ${task.title}`);
      return;
    }

    // Find best agent based on capabilities and workload
    const bestAgent = this.findBestAgent(task, availableAgents);
    
    if (bestAgent) {
      task.assignedAgent = bestAgent.getId();
      
      // Emit task assigned event
      const event = EventFactory.createTaskAssignedEvent(
        task,
        bestAgent.getId(),
        'agent_manager'
      );
      await this.eventBus.publish(event);

      // Update agent workload
      const currentWorkload = this.agentWorkloads.get(bestAgent.getId()) || 0;
      this.agentWorkloads.set(bestAgent.getId(), currentWorkload + task.estimatedComplexity);

      // Execute task
      try {
        await bestAgent.executeTask(task);
      } catch (error) {
        console.error(`❌ Task execution failed: ${task.title}`, error);
      }
    }
  }

  // Get available agents
  private getAvailableAgents(): BaseAgent[] {
    return Array.from(this.agents.values()).filter(agent => {
      const workload = this.agentWorkloads.get(agent.getId()) || 0;
      return workload < 80; // Agents with less than 80% workload are available
    });
  }

  // Find best agent for task
  private findBestAgent(task: Task, availableAgents: BaseAgent[]): BaseAgent | null {
    if (availableAgents.length === 0) return null;

    // Score agents based on capabilities and workload
    const scoredAgents = availableAgents.map(agent => {
      const capabilities = this.agentCapabilities.get(agent.getId()) || [];
      const workload = this.agentWorkloads.get(agent.getId()) || 0;
      
      // Calculate capability match score
      const capabilityScore = this.calculateCapabilityScore(task, capabilities);
      
      // Calculate workload score (lower is better)
      const workloadScore = Math.max(0, 100 - workload);
      
      // Combined score
      const totalScore = capabilityScore * 0.7 + workloadScore * 0.3;
      
      return { agent, score: totalScore };
    });

    // Sort by score and return best agent
    scoredAgents.sort((a, b) => b.score - a.score);
    return scoredAgents[0].agent;
  }

  // Calculate capability match score
  private calculateCapabilityScore(task: Task, capabilities: string[]): number {
    if (capabilities.length === 0) return 0;
    
    // Simple scoring based on task requirements and agent capabilities
    // This could be enhanced with more sophisticated matching
    const taskKeywords = task.title.toLowerCase().split(' ');
    const capabilityKeywords = capabilities.join(' ').toLowerCase();
    
    let matches = 0;
    for (const keyword of taskKeywords) {
      if (capabilityKeywords.includes(keyword)) {
        matches++;
      }
    }
    
    return (matches / taskKeywords.length) * 100;
  }

  // Setup event handlers
  private setupEventHandlers(): void {
    // Handle task completion events
    this.eventBus.subscribe(
      AgentEventType.TASK_COMPLETED,
      this.handleTaskCompleted.bind(this),
      { priority: 10 }
    );

    // Handle task failed events
    this.eventBus.subscribe(
      AgentEventType.TASK_FAILED,
      this.handleTaskFailed.bind(this),
      { priority: 10 }
    );

    // Handle agent available events
    this.eventBus.subscribe(
      AgentEventType.AGENT_AVAILABLE,
      this.handleAgentAvailable.bind(this),
      { priority: 5 }
    );

    // Handle agent busy events
    this.eventBus.subscribe(
      AgentEventType.AGENT_BUSY,
      this.handleAgentBusy.bind(this),
      { priority: 5 }
    );

    // Handle collaboration requests
    this.eventBus.subscribe(
      AgentEventType.COLLABORATION_REQUEST,
      this.handleCollaborationRequest.bind(this),
      { priority: 8 }
    );
  }

  // Event handlers
  private async handleTaskCompleted(event: AgentEvent): Promise<void> {
    const { taskId, assignedAgent } = event.payload;
    
    if (assignedAgent) {
      // Update agent workload
      const currentWorkload = this.agentWorkloads.get(assignedAgent) || 0;
      this.agentWorkloads.set(assignedAgent, Math.max(0, currentWorkload - 10));
      
      // Remove task from queue
      this.taskQueue = this.taskQueue.filter(task => task.id !== taskId);
      
      console.log(`✅ Task completed: ${taskId} by ${assignedAgent}`);
      
      // Try to assign next task
      await this.processTaskQueue();
    }
  }

  private async handleTaskFailed(event: AgentEvent): Promise<void> {
    const { taskId, assignedAgent, error } = event.payload;
    
    if (assignedAgent) {
      // Update agent workload
      const currentWorkload = this.agentWorkloads.get(assignedAgent) || 0;
      this.agentWorkloads.set(assignedAgent, Math.max(0, currentWorkload - 5));
      
      console.log(`❌ Task failed: ${taskId} by ${assignedAgent} - ${error}`);
      
      // Try to reassign task or assign to different agent
      const task = this.taskQueue.find(t => t.id === taskId);
      if (task) {
        task.assignedAgent = undefined;
        await this.assignTask(task);
      }
    }
  }

  private async handleAgentAvailable(event: AgentEvent): Promise<void> {
    const { agentId } = event.payload;
    
    console.log(`🟢 Agent available: ${agentId}`);
    
    // Try to assign pending tasks
    await this.processTaskQueue();
  }

  private async handleAgentBusy(event: AgentEvent): Promise<void> {
    const { agentId, workload } = event.payload;
    
    this.agentWorkloads.set(agentId, workload);
    console.log(`🟡 Agent busy: ${agentId} (${workload}% workload)`);
  }

  private async handleCollaborationRequest(event: AgentEvent): Promise<void> {
    const { collaborationId, requestingAgent, targetAgent, requestType, context } = event.payload;
    
    console.log(`🤝 Collaboration request: ${requestingAgent} -> ${targetAgent} (${requestType})`);
    
    // Handle collaboration logic here
    // This could involve routing the request to the target agent
    // or implementing collaboration protocols
  }

  // Process pending task queue
  private async processTaskQueue(): Promise<void> {
    const unassignedTasks = this.taskQueue.filter(task => !task.assignedAgent);
    
    for (const task of unassignedTasks) {
      await this.assignTask(task);
    }
  }

  // Get system statistics
  public getSystemStats(): {
    totalAgents: number;
    availableAgents: number;
    totalTasks: number;
    pendingTasks: number;
    agentWorkloads: Record<string, number>;
    eventStats: any;
  } {
    const availableAgents = this.getAvailableAgents().length;
    const pendingTasks = this.taskQueue.filter(task => !task.assignedAgent).length;
    
    const agentWorkloads: Record<string, number> = {};
    for (const [agentId, workload] of this.agentWorkloads.entries()) {
      agentWorkloads[agentId] = workload;
    }

    return {
      totalAgents: this.agents.size,
      availableAgents,
      totalTasks: this.taskQueue.length,
      pendingTasks,
      agentWorkloads,
      eventStats: this.eventBus.getStats()
    };
  }

  // Get events for monitoring
  public async getEvents(filter: EventFilter): Promise<AgentEvent[]> {
    return this.eventBus.getEvents(filter);
  }

  // Cleanup
  public destroy(): void {
    this.eventBus.destroy();
    this.agents.clear();
    this.taskQueue = [];
    this.agentCapabilities.clear();
    this.agentWorkloads.clear();
    
    console.log('🧹 AgentEventManager destroyed');
  }
}
