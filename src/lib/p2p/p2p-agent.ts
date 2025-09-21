// 🎯 P2P AGENT - Peer-to-Peer Agent Communication
// Advanced P2P agent that can communicate directly with other agents

import { BaseAgent } from '@/lib/agents/base-agent';
import { P2PNetwork, P2PMessage } from './p2p-network';
import { EventBus } from '@/lib/events/event-bus';
import { EventFactory } from '@/lib/events/event-factory';
import { AgentEventType } from '@/types/events';
import { Task, AgentResponse, AgentRole } from '@/types/agents';

export interface P2PAgentCapabilities {
  canCoordinate: boolean;
  canExecuteCode: boolean;
  canAnalyzeRequirements: boolean;
  canReview: boolean;
  canOptimize: boolean;
  canTest: boolean;
  canDocument: boolean;
  canDeploy: boolean;
  specializedSkills: string[];
  domains: string[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  maxComplexity: number;
  parallelTasks: number;
  collaborationStyle: 'analytical' | 'creative' | 'systematic' | 'adaptive';
}

export class P2PAgent extends BaseAgent {
  private p2pNetwork: P2PNetwork;
  private capabilities: P2PAgentCapabilities;
  private peerConnections = new Map<string, any>();
  private collaborationRequests = new Map<string, any>();

  constructor(
    id: string,
    role: AgentRole,
    capabilities: P2PAgentCapabilities,
    eventBus?: EventBus
  ) {
    super(id, role, {
      availableTools: capabilities.tools,
      skills: capabilities.specializedSkills.map(skill => ({
        name: skill,
        description: `Specialized in ${skill}`,
        confidence: 0.8,
        successRate: 0.85
      }))
    }, eventBus);

    this.capabilities = capabilities;
    this.p2pNetwork = new P2PNetwork(id);
    this.setupP2PHandlers();
  }

  // Initialize P2P network
  public async initializeP2P(): Promise<void> {
    await this.p2pNetwork.start();
    
    // Emit agent registered event
    if (this.eventBus) {
      const event = EventFactory.createAgentRegisteredEvent(
        this.id,
        this.role,
        this.capabilities.specializedSkills,
        this.id
      );
      await this.eventBus.publish(event);
    }
    
    console.log(`🌐 P2P Agent initialized: ${this.id}`);
  }

  // Stop P2P network
  public async stopP2P(): Promise<void> {
    await this.p2pNetwork.stop();
    console.log(`🌐 P2P Agent stopped: ${this.id}`);
  }

  // Connect to another P2P agent
  public async connectToPeer(peerId: string, address: string, port: number): Promise<boolean> {
    const success = await this.p2pNetwork.connect(peerId, address, port);
    
    if (success) {
      this.peerConnections.set(peerId, { address, port, connected: true });
      
      // Send capability announcement
      await this.announceCapabilities(peerId);
    }
    
    return success;
  }

  // Disconnect from peer
  public async disconnectFromPeer(peerId: string): Promise<void> {
    await this.p2pNetwork.disconnect(peerId);
    this.peerConnections.delete(peerId);
  }

  // Send direct message to peer
  public async sendToPeer(peerId: string, messageType: string, payload: any): Promise<boolean> {
    return await this.p2pNetwork.sendMessage(peerId, messageType, payload);
  }

  // Broadcast message to all peers
  public async broadcastToPeers(messageType: string, payload: any): Promise<number> {
    return await this.p2pNetwork.broadcast(messageType, payload);
  }

  // Request collaboration from peer
  public async requestCollaboration(
    peerId: string,
    requestType: 'help' | 'review' | 'delegation' | 'consultation',
    context: any
  ): Promise<boolean> {
    const collaborationId = `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const request = {
      collaborationId,
      requestingAgent: this.id,
      targetAgent: peerId,
      requestType,
      context,
      timestamp: Date.now()
    };

    // Store collaboration request
    this.collaborationRequests.set(collaborationId, {
      ...request,
      status: 'pending',
      responses: []
    });

    // Send request via P2P
    const success = await this.sendToPeer(peerId, 'collaboration_request', request);
    
    if (success && this.eventBus) {
      // Emit collaboration request event
      const event = EventFactory.createCustomEvent(
        AgentEventType.COLLABORATION_REQUEST,
        request,
        this.id,
        peerId
      );
      await this.eventBus.publish(event);
    }
    
    return success;
  }

  // Delegate task to peer
  public async delegateTask(peerId: string, task: Task): Promise<boolean> {
    const delegation = {
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description,
      priority: task.priority,
      complexity: task.estimatedComplexity,
      requirements: task.metadata?.requirements || [],
      constraints: task.metadata?.constraints || [],
      deadline: task.metadata?.deadline,
      timestamp: Date.now()
    };

    return await this.sendToPeer(peerId, 'task_delegation', delegation);
  }

  // Get peer information
  public getPeerInfo(peerId: string): any {
    return this.peerConnections.get(peerId);
  }

  // Get all connected peers
  public getConnectedPeers(): string[] {
    return this.p2pNetwork.getConnectedPeers();
  }

  // Get network statistics
  public getNetworkStats(): any {
    return this.p2pNetwork.getNetworkStats();
  }

  // Setup P2P message handlers
  private setupP2PHandlers(): void {
    // Handle collaboration requests
    this.p2pNetwork.onMessage('collaboration_request', async (message: P2PMessage) => {
      await this.handleCollaborationRequest(message);
    });

    // Handle collaboration responses
    this.p2pNetwork.onMessage('collaboration_response', async (message: P2PMessage) => {
      await this.handleCollaborationResponse(message);
    });

    // Handle task delegations
    this.p2pNetwork.onMessage('task_delegation', async (message: P2PMessage) => {
      await this.handleTaskDelegation(message);
    });

    // Handle capability announcements
    this.p2pNetwork.onMessage('capability_announcement', async (message: P2PMessage) => {
      await this.handleCapabilityAnnouncement(message);
    });

    // Handle heartbeat messages
    this.p2pNetwork.onMessage('heartbeat', async (message: P2PMessage) => {
      await this.handleHeartbeat(message);
    });

    // Handle discovery requests
    this.p2pNetwork.onMessage('discovery_request', async (message: P2PMessage) => {
      await this.handleDiscoveryRequest(message);
    });
  }

  // Handle collaboration request from peer
  private async handleCollaborationRequest(message: P2PMessage): Promise<void> {
    const { collaborationId, requestingAgent, requestType, context } = message.payload;
    
    console.log(`🤝 Collaboration request from ${requestingAgent}: ${requestType}`);
    
    // Evaluate if we can help
    const canHelp = this.evaluateCollaborationRequest(requestType, context);
    
    const response = {
      collaborationId,
      requestingAgent,
      respondingAgent: this.id,
      canHelp,
      response: canHelp ? 'accepted' : 'declined',
      capabilities: this.capabilities.specializedSkills,
      estimatedTime: canHelp ? this.estimateCollaborationTime(requestType, context) : 0,
      timestamp: Date.now()
    };

    // Send response back
    await this.sendToPeer(requestingAgent, 'collaboration_response', response);
    
    // If accepted, start collaboration
    if (canHelp) {
      await this.startCollaboration(collaborationId, requestingAgent, requestType, context);
    }
  }

  // Handle collaboration response from peer
  private async handleCollaborationResponse(message: P2PMessage): Promise<void> {
    const { collaborationId, respondingAgent, canHelp, response } = message.payload;
    
    const collaboration = this.collaborationRequests.get(collaborationId);
    if (collaboration) {
      collaboration.responses.push({
        agent: respondingAgent,
        canHelp,
        response,
        timestamp: Date.now()
      });
      
      if (response === 'accepted') {
        collaboration.status = 'accepted';
        console.log(`✅ Collaboration accepted by ${respondingAgent}`);
      }
    }
  }

  // Handle task delegation from peer
  private async handleTaskDelegation(message: P2PMessage): Promise<void> {
    const { taskId, taskTitle, taskDescription, priority, complexity, requirements } = message.payload;
    
    console.log(`📋 Task delegation received: ${taskTitle}`);
    
    // Create task object
    const task: Task = {
      id: taskId,
      title: taskTitle,
      description: taskDescription,
      status: 'pending',
      priority,
      dependencies: [],
      subtasks: [],
      estimatedComplexity: complexity,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {
        requirements,
        constraints: [],
        delegated: true,
        delegator: message.from
      }
    };

    // Execute task if we can handle it
    if (this.canHandleTask(task)) {
      try {
        await this.executeTask(task);
        
        // Send completion notification
        await this.sendToPeer(message.from, 'task_completed', {
          taskId,
          result: 'completed',
          timestamp: Date.now()
        });
      } catch (error) {
        // Send failure notification
        await this.sendToPeer(message.from, 'task_failed', {
          taskId,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        });
      }
    } else {
      // Decline task
      await this.sendToPeer(message.from, 'task_declined', {
        taskId,
        reason: 'Cannot handle this type of task',
        timestamp: Date.now()
      });
    }
  }

  // Handle capability announcement from peer
  private async handleCapabilityAnnouncement(message: P2PMessage): Promise<void> {
    const { capabilities, domains, languages, frameworks } = message.payload;
    
    console.log(`📢 Capability announcement from ${message.from}:`, {
      capabilities: capabilities.join(', '),
      domains: domains.join(', '),
      languages: languages.join(', ')
    });
    
    // Store peer capabilities for future reference
    this.updatePeerCapabilities(message.from, {
      capabilities,
      domains,
      languages,
      frameworks
    });
  }

  // Handle heartbeat from peer
  private async handleHeartbeat(message: P2PMessage): Promise<void> {
    const { nodeId, status, timestamp } = message.payload;
    
    // Update peer status
    const peer = this.peerConnections.get(nodeId);
    if (peer) {
      peer.lastSeen = new Date(timestamp);
      peer.status = status;
    }
  }

  // Handle discovery request from peer
  private async handleDiscoveryRequest(message: P2PMessage): Promise<void> {
    const { nodeId, capabilities } = message.payload;
    
    // Respond with our capabilities
    await this.sendToPeer(nodeId, 'discovery_response', {
      nodeId: this.id,
      capabilities: this.capabilities.specializedSkills,
      domains: this.capabilities.domains,
      languages: this.capabilities.languages,
      frameworks: this.capabilities.frameworks,
      status: 'online',
      timestamp: Date.now()
    });
  }

  // Announce capabilities to peer
  private async announceCapabilities(peerId: string): Promise<void> {
    await this.sendToPeer(peerId, 'capability_announcement', {
      capabilities: this.capabilities.specializedSkills,
      domains: this.capabilities.domains,
      languages: this.capabilities.languages,
      frameworks: this.capabilities.frameworks,
      maxComplexity: this.capabilities.maxComplexity,
      parallelTasks: this.capabilities.parallelTasks,
      collaborationStyle: this.capabilities.collaborationStyle
    });
  }

  // Evaluate if we can help with collaboration request
  private evaluateCollaborationRequest(requestType: string, context: any): boolean {
    // Simple evaluation logic - can be enhanced
    switch (requestType) {
      case 'help':
        return this.capabilities.specializedSkills.some(skill => 
          context.requiredSkills?.includes(skill)
        );
      case 'review':
        return this.capabilities.canReview;
      case 'delegation':
        return this.capabilities.canExecuteCode;
      case 'consultation':
        return this.capabilities.canAnalyzeRequirements;
      default:
        return false;
    }
  }

  // Estimate collaboration time
  private estimateCollaborationTime(requestType: string, context: any): number {
    // Simple estimation - can be enhanced with ML
    const baseTime = 30; // 30 minutes base
    const complexityMultiplier = context.complexity || 1;
    return baseTime * complexityMultiplier;
  }

  // Start collaboration
  private async startCollaboration(
    collaborationId: string,
    requestingAgent: string,
    requestType: string,
    context: any
  ): Promise<void> {
    console.log(`🚀 Starting collaboration: ${collaborationId}`);
    
    // Implement collaboration logic based on request type
    // This would be specific to each agent's capabilities
  }

  // Check if we can handle a task
  private canHandleTask(task: Task): boolean {
    return task.estimatedComplexity <= this.capabilities.maxComplexity &&
           this.capabilities.specializedSkills.some(skill => 
             task.title.toLowerCase().includes(skill.toLowerCase()) ||
             task.description.toLowerCase().includes(skill.toLowerCase())
           );
  }

  // Update peer capabilities
  private updatePeerCapabilities(peerId: string, capabilities: any): void {
    const peer = this.peerConnections.get(peerId);
    if (peer) {
      peer.capabilities = capabilities;
    }
  }

  // Override BaseAgent methods for P2P integration
  protected async processTask(task: Task): Promise<AgentResponse> {
    // Check if task should be delegated
    if (task.estimatedComplexity > this.capabilities.maxComplexity) {
      // Try to delegate to capable peers
      const capablePeers = this.findCapablePeers(task);
      if (capablePeers.length > 0) {
        const peerId = capablePeers[0];
        await this.delegateTask(peerId, task);
        
        return {
          agentId: this.id,
          taskId: task.id,
          response: {
            type: 'delegation',
            content: `Task delegated to ${peerId}`,
            confidence: 0.9,
            reasoning: 'Task complexity exceeds agent capabilities'
          },
          nextActions: [`Monitor delegation to ${peerId}`]
        };
      }
    }

    // Process task locally
    return await super.processTask(task);
  }

  // Find peers capable of handling a task
  private findCapablePeers(task: Task): string[] {
    const capablePeers: string[] = [];
    
    for (const [peerId, peer] of this.peerConnections.entries()) {
      if (peer.capabilities && peer.capabilities.maxComplexity >= task.estimatedComplexity) {
        capablePeers.push(peerId);
      }
    }
    
    return capablePeers;
  }
}
