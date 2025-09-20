// 🐝 SWARM AGENT - Advanced Swarm-Based Agent Implementation
// Specialized agents designed for swarm coordination and parallel execution

import { BaseAgent } from '@/lib/agents/base-agent';
import { AgentRole, Task, AgentResponse, AgentContext } from '@/types/agents';
import { SwarmTask } from './swarm-coordinator';
import { ContextManager } from './context-manager';
import { QualityValidator } from './quality-validator';

export interface SwarmAgentCapabilities {
  domains: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  maxComplexity: number;
  parallelTasks: number;
  specialization: string[];
  collaborationStyle: 'independent' | 'collaborative' | 'leadership';
}

export interface SwarmAgentMetrics {
  tasksCompleted: number;
  averageQuality: number;
  averageDuration: number;
  successRate: number;
  collaborationRating: number;
  domainExpertise: Record<string, number>;
  lastActive: Date;
  currentWorkload: number;
  costEfficiency: number;
}

export abstract class SwarmAgent extends BaseAgent {
  protected capabilities: SwarmAgentCapabilities;
  protected metrics: SwarmAgentMetrics;
  protected contextManager: ContextManager;
  protected qualityValidator: QualityValidator;
  protected swarmContext: Map<string, any>;
  protected collaborationHistory: Map<string, AgentResponse[]>;

  constructor(
    id: string, 
    role: AgentRole, 
    capabilities: SwarmAgentCapabilities,
    initialContext: Partial<AgentContext> = {}
  ) {
    super(id, role, initialContext);
    
    this.capabilities = capabilities;
    this.contextManager = new ContextManager();
    this.qualityValidator = new QualityValidator();
    
    this.metrics = {
      tasksCompleted: 0,
      averageQuality: 0,
      averageDuration: 0,
      successRate: 0,
      collaborationRating: 0,
      domainExpertise: {},
      lastActive: new Date(),
      currentWorkload: 0,
      costEfficiency: 0
    };

    // Swarm agent initialization will be done in initializeAgent()
  }

  protected initializeAgent(): void {
    // Initialize swarm context first
    this.swarmContext = new Map();
    this.collaborationHistory = new Map();
    
    this.initializeSwarmCapabilities();
    this.setupSwarmContext();
    console.log(`🐝 Swarm Agent initialized: ${this.role} (${this.id})`);
  }

  protected abstract initializeSwarmCapabilities(): void;
  protected abstract setupSwarmContext(): void;
  protected abstract processSwarmTask(task: SwarmTask): Promise<AgentResponse>;

  // 🐝 Swarm-Specific Methods
  public async executeSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    this.isActive = true;
    this.metrics.currentWorkload += 10;
    this.metrics.lastActive = new Date();
    
    const startTime = Date.now();
    
    try {
      // Validate task compatibility
      if (!this.canHandleTask(task)) {
        throw new Error(`Task ${task.id} is not compatible with agent ${this.id}`);
      }

      // Update swarm context
      this.updateSwarmContext(task);
      
      // Process the task
      const response = await this.processSwarmTask(task);
      
      // Validate response quality
      const validatedResponse = await this.qualityValidator.validateResult(response);
      
      // Update metrics
      const duration = Date.now() - startTime;
      this.updateMetrics(task, validatedResponse, duration, true);
      
      return validatedResponse;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.updateMetrics(task, null, duration, false);
      throw error;
    } finally {
      this.isActive = false;
      this.metrics.currentWorkload = Math.max(0, this.metrics.currentWorkload - 10);
    }
  }

  public canHandleTask(task: SwarmTask): boolean {
    // Check complexity
    if (task.complexity > this.capabilities.maxComplexity) {
      return false;
    }

    // Check domain expertise
    const hasDomainExpertise = task.domain.some(domain => 
      this.capabilities.domains.includes(domain) ||
      this.capabilities.specialization.includes(domain)
    );

    if (!hasDomainExpertise) {
      return false;
    }

    // Check current workload
    if (this.metrics.currentWorkload > 80) {
      return false;
    }

    return true;
  }

  public getCompatibilityScore(task: SwarmTask): number {
    let score = 0;
    let totalWeight = 0;

    // Domain expertise (40% weight)
    const domainWeight = 40;
    totalWeight += domainWeight;
    const domainMatch = task.domain.filter(domain => 
      this.capabilities.domains.includes(domain) ||
      this.capabilities.specialization.includes(domain)
    ).length;
    score += (domainMatch / task.domain.length) * domainWeight;

    // Complexity match (30% weight)
    const complexityWeight = 30;
    totalWeight += complexityWeight;
    const complexityScore = Math.max(0, 1 - Math.abs(task.complexity - this.capabilities.maxComplexity) / 10);
    score += complexityScore * complexityWeight;

    // Language/framework match (20% weight)
    const techWeight = 20;
    totalWeight += techWeight;
    const techMatch = this.calculateTechMatch(task);
    score += techMatch * techWeight;

    // Availability (10% weight)
    const availabilityWeight = 10;
    totalWeight += availabilityWeight;
    const availabilityScore = Math.max(0, 1 - this.metrics.currentWorkload / 100);
    score += availabilityScore * availabilityWeight;

    return score / totalWeight;
  }

  // 🤝 Swarm Collaboration
  public async collaborateWithSwarm(
    otherAgents: SwarmAgent[], 
    sharedTask: SwarmTask
  ): Promise<AgentResponse> {
    console.log(`🐝 ${this.id} collaborating with ${otherAgents.length} agents`);
    
    // Share context with other agents
    const sharedContext = this.createSharedContext(sharedTask);
    otherAgents.forEach(agent => agent.receiveSharedContext(sharedContext));
    
    // Process collaborative task
    const response = await this.processCollaborativeTask(sharedTask, otherAgents);
    
    // Update collaboration metrics
    this.updateCollaborationMetrics(otherAgents, response);
    
    return response;
  }

  public receiveSharedContext(context: any): void {
    this.swarmContext.set('shared', context);
  }

  protected async processCollaborativeTask(
    task: SwarmTask, 
    collaborators: SwarmAgent[]
  ): Promise<AgentResponse> {
    // Default collaborative processing - can be overridden by subclasses
    return this.processSwarmTask(task);
  }

  // 📊 Metrics and Performance
  public getMetrics(): SwarmAgentMetrics {
    return { ...this.metrics };
  }

  public getTasksCompleted(): number {
    return this.metrics.tasksCompleted;
  }

  public getAverageCompletionTime(): number {
    return this.metrics.averageDuration;
  }

  public getSuccessRate(): number {
    return this.metrics.successRate;
  }

  public getCollaborationRating(): number {
    return this.metrics.collaborationRating;
  }

  public getLastActive(): Date {
    return this.metrics.lastActive;
  }

  public getCurrentWorkload(): number {
    return this.metrics.currentWorkload;
  }

  public getCapabilities(): SwarmAgentCapabilities {
    return { ...this.capabilities };
  }

  // 🧠 Swarm Intelligence
  protected updateSwarmContext(task: SwarmTask): void {
    this.swarmContext.set('current_task', task);
    this.swarmContext.set('task_history', [
      ...(this.swarmContext.get('task_history') || []),
      { task: task.id, timestamp: new Date() }
    ]);
  }

  protected createSharedContext(task: SwarmTask): any {
    return {
      task: task,
      agent: {
        id: this.id,
        role: this.role,
        capabilities: this.capabilities,
        expertise: this.metrics.domainExpertise
      },
      context: this.swarmContext.get('current_task'),
      timestamp: new Date()
    };
  }

  protected updateMetrics(
    task: SwarmTask, 
    response: AgentResponse | null, 
    duration: number, 
    success: boolean
  ): void {
    this.metrics.tasksCompleted++;
    this.metrics.lastActive = new Date();
    
    if (response) {
      const quality = response.response.confidence * 100;
      this.metrics.averageQuality = 
        (this.metrics.averageQuality * (this.metrics.tasksCompleted - 1) + quality) / 
        this.metrics.tasksCompleted;
    }
    
    this.metrics.averageDuration = 
      (this.metrics.averageDuration * (this.metrics.tasksCompleted - 1) + duration) / 
      this.metrics.tasksCompleted;
    
    if (success) {
      this.metrics.successRate = 
        (this.metrics.successRate * (this.metrics.tasksCompleted - 1) + 1) / 
        this.metrics.tasksCompleted;
    } else {
      this.metrics.successRate = 
        (this.metrics.successRate * (this.metrics.tasksCompleted - 1)) / 
        this.metrics.tasksCompleted;
    }
    
    // Update domain expertise
    task.domain.forEach(domain => {
      const currentExpertise = this.metrics.domainExpertise[domain] || 0;
      this.metrics.domainExpertise[domain] = currentExpertise + (success ? 1 : -0.5);
    });
  }

  protected updateCollaborationMetrics(collaborators: SwarmAgent[], response: AgentResponse): void {
    const collaborationKey = collaborators.map(a => a.getId()).sort().join(',');
    const history = this.collaborationHistory.get(collaborationKey) || [];
    history.push(response);
    this.collaborationHistory.set(collaborationKey, history);
    
    // Update collaboration rating based on success
    const successCount = history.filter(r => r.response.confidence > 0.7).length;
    this.metrics.collaborationRating = successCount / history.length;
  }

  protected calculateTechMatch(task: SwarmTask): number {
    // This would analyze the task's technology requirements against agent capabilities
    // For now, return a simple score based on domain overlap
    const taskTechs = task.context.technologies || [];
    const agentTechs = [...this.capabilities.languages, ...this.capabilities.frameworks];
    
    if (taskTechs.length === 0) return 0.5; // Neutral if no tech specified
    
    const matches = taskTechs.filter(tech => agentTechs.includes(tech)).length;
    return matches / taskTechs.length;
  }

  // 🛠️ Utility Methods
  protected generateSwarmResponse(
    task: SwarmTask, 
    content: string, 
    confidence: number, 
    reasoning: string
  ): AgentResponse {
    return {
      agentId: this.id,
      taskId: task.id,
      response: {
        type: 'code',
        content,
        confidence,
        reasoning: `Swarm agent ${this.role}: ${reasoning}`,
        alternatives: this.generateAlternatives(task)
      },
      nextActions: this.generateNextActions(task),
      collaborationRequests: this.generateCollaborationRequests(task)
    };
  }

  protected generateAlternatives(task: SwarmTask): string[] {
    return [
      `Alternative approach using ${this.capabilities.frameworks[0] || 'different framework'}`,
      'Simplified implementation with reduced complexity',
      'Enhanced version with additional features',
      'Performance-optimized solution'
    ];
  }

  protected generateNextActions(task: SwarmTask): string[] {
    return [
      'Validate implementation with tests',
      'Optimize performance',
      'Add error handling',
      'Update documentation',
      'Deploy to staging environment'
    ];
  }

  protected generateCollaborationRequests(task: SwarmTask): any[] {
    const requests = [];
    
    // Request testing agent if task is complex
    if (task.complexity > 6) {
      requests.push({
        targetAgent: 'testing',
        reason: 'Complex task requires comprehensive testing',
        expectedInput: 'Test suite and validation results'
      });
    }
    
    // Request review agent for high-quality requirements
    if (task.requirements.codeQuality > 8) {
      requests.push({
        targetAgent: 'reviewer',
        reason: 'High quality requirements need expert review',
        expectedInput: 'Code review and optimization suggestions'
      });
    }
    
    return requests;
  }

  // Abstract methods to be implemented by subclasses
  protected abstract processTask(task: Task): Promise<AgentResponse>;
  protected abstract generateResponse(input: string, context: any): Promise<string>;
}
