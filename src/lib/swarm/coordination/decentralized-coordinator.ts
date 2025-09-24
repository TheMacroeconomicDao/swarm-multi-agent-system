// 🌐 DECENTRALIZED SWARM COORDINATION
// Peer-to-peer coordination without central authority

import { SwarmTask, SwarmAgentCapabilities, SwarmEvent, SwarmConsensus } from '../types';
import { SwarmAgent } from '../swarm-agent';
import { EventBus } from '@/lib/events/event-bus';
import { EventFactory } from '@/lib/events/event-factory';
import { AgentEventType } from '@/types/events';

export interface PeerNode {
  id: string;
  agent: SwarmAgent;
  capabilities: SwarmAgentCapabilities;
  workload: number;
  neighbors: Set<string>;
  reputation: number;
  lastSeen: Date;
  isActive: boolean;
}

export interface DecentralizedMessage {
  id: string;
  type: 'task_proposal' | 'task_accept' | 'task_reject' | 'collaboration_request' | 'consensus_vote' | 'gossip_update';
  sender: string;
  target?: string;
  broadcast: boolean;
  payload: any;
  timestamp: Date;
  ttl: number; // Time to live
  signature?: string;
}

export interface TaskProposal {
  taskId: string;
  proposer: string;
  requiredCapabilities: string[];
  estimatedTime: number;
  priority: number;
  deadline?: Date;
  reward: number;
}

export interface CollaborationRequest {
  requestId: string;
  requester: string;
  taskId: string;
  requiredSkills: string[];
  collaborationType: 'parallel' | 'sequential' | 'review' | 'consultation';
  expectedDuration: number;
  compensation: number;
}

export interface GossipUpdate {
  nodeId: string;
  updateType: 'capability_change' | 'workload_change' | 'reputation_change' | 'task_completion';
  data: any;
  version: number;
}

export class DecentralizedSwarmCoordinator {
  private nodes: Map<string, PeerNode> = new Map();
  private messageQueue: DecentralizedMessage[] = [];
  private consensusProposals: Map<string, SwarmConsensus> = new Map();
  private gossipState: Map<string, any> = new Map();
  private eventBus: EventBus;
  private nodeId: string;
  private maxNeighbors: number = 5;
  private gossipInterval: number = 5000; // 5 seconds
  private consensusTimeout: number = 10000; // 10 seconds

  constructor(nodeId: string, eventBus: EventBus) {
    this.nodeId = nodeId;
    this.eventBus = eventBus;
    this.startGossipProtocol();
    this.startMessageProcessing();
  }

  /**
   * Register a new agent node in the decentralized network
   */
  public registerNode(agent: SwarmAgent): void {
    const node: PeerNode = {
      id: agent.getId(),
      agent: agent,
      capabilities: agent.getCapabilities(),
      workload: agent.getCurrentWorkload(),
      neighbors: new Set(),
      reputation: 1.0,
      lastSeen: new Date(),
      isActive: true
    };

    this.nodes.set(node.id, node);
    this.connectToNetwork(node);
    
    console.log(`🌐 Node registered: ${node.id} with ${node.neighbors.size} neighbors`);
  }

  /**
   * Connect node to the network using peer discovery
   */
  private connectToNetwork(node: PeerNode): void {
    // Find best neighbors based on capability complementarity
    const candidates = Array.from(this.nodes.values())
      .filter(n => n.id !== node.id && n.isActive)
      .sort((a, b) => this.calculateConnectionScore(node, b) - this.calculateConnectionScore(node, a));

    // Connect to top candidates
    for (let i = 0; i < Math.min(this.maxNeighbors, candidates.length); i++) {
      const neighbor = candidates[i];
      node.neighbors.add(neighbor.id);
      neighbor.neighbors.add(node.id);
    }
  }

  /**
   * Calculate connection score between two nodes
   */
  private calculateConnectionScore(node1: PeerNode, node2: PeerNode): number {
    // Capability complementarity
    const capabilityScore = this.calculateCapabilityComplementarity(node1.capabilities, node2.capabilities);
    
    // Reputation score
    const reputationScore = node2.reputation;
    
    // Workload balance
    const workloadScore = 1 - Math.abs(node1.workload - node2.workload) / 100;
    
    // Distance (simplified - in real implementation would use network topology)
    const distanceScore = 1.0; // Assume all nodes are equally distant
    
    return capabilityScore * 0.4 + reputationScore * 0.3 + workloadScore * 0.2 + distanceScore * 0.1;
  }

  /**
   * Calculate how well two agents' capabilities complement each other
   */
  private calculateCapabilityComplementarity(cap1: SwarmAgentCapabilities, cap2: SwarmAgentCapabilities): number {
    let complementarity = 0;
    let total = 0;

    // Check for complementary skills
    if (cap1.specializedSkills && cap2.specializedSkills) {
      const uniqueSkills = new Set([...cap1.specializedSkills, ...cap2.specializedSkills]);
      const overlap = cap1.specializedSkills.length + cap2.specializedSkills.length - uniqueSkills.size;
      complementarity += overlap / Math.max(cap1.specializedSkills.length, cap2.specializedSkills.length);
      total += 1;
    }

    // Check for complementary domains
    if (cap1.domains && cap2.domains) {
      const uniqueDomains = new Set([...cap1.domains, ...cap2.domains]);
      const overlap = cap1.domains.length + cap2.domains.length - uniqueDomains.size;
      complementarity += overlap / Math.max(cap1.domains.length, cap2.domains.length);
      total += 1;
    }

    return total > 0 ? complementarity / total : 0;
  }

  /**
   * Propose a task to the network
   */
  public async proposeTask(task: SwarmTask): Promise<TaskProposal> {
    const proposal: TaskProposal = {
      taskId: task.id,
      proposer: this.nodeId,
      requiredCapabilities: task.domain,
      estimatedTime: task.estimatedTime,
      priority: this.calculateTaskPriority(task),
      deadline: new Date(Date.now() + task.estimatedTime * 60000), // Convert minutes to ms
      reward: this.calculateTaskReward(task)
    };

    // Broadcast task proposal to neighbors
    await this.broadcastMessage({
      id: `proposal_${Date.now()}`,
      type: 'task_proposal',
      sender: this.nodeId,
      broadcast: true,
      payload: proposal,
      timestamp: new Date(),
      ttl: 30 // 30 seconds
    });

    return proposal;
  }

  /**
   * Handle incoming task proposal
   */
  public async handleTaskProposal(proposal: TaskProposal, sender: string): Promise<boolean> {
    const node = this.nodes.get(this.nodeId);
    if (!node || !node.isActive) return false;

    // Check if we can handle this task
    const canHandle = this.canHandleTask(proposal, node);
    
    if (canHandle) {
      // Send acceptance
      await this.sendMessage({
        id: `accept_${Date.now()}`,
        type: 'task_accept',
        sender: this.nodeId,
        target: sender,
        broadcast: false,
        payload: { proposalId: proposal.taskId, estimatedTime: this.estimateTaskTime(proposal) },
        timestamp: new Date(),
        ttl: 10
      });
      return true;
    } else {
      // Forward to neighbors if we can't handle it
      await this.forwardTaskProposal(proposal, sender);
      return false;
    }
  }

  /**
   * Request collaboration from other agents
   */
  public async requestCollaboration(
    taskId: string,
    requiredSkills: string[],
    collaborationType: 'parallel' | 'sequential' | 'review' | 'consultation',
    expectedDuration: number
  ): Promise<CollaborationRequest> {
    const request: CollaborationRequest = {
      requestId: `collab_${Date.now()}`,
      requester: this.nodeId,
      taskId: taskId,
      requiredSkills: requiredSkills,
      collaborationType: collaborationType,
      expectedDuration: expectedDuration,
      compensation: this.calculateCollaborationCompensation(requiredSkills, expectedDuration)
    };

    // Broadcast collaboration request
    await this.broadcastMessage({
      id: request.requestId,
      type: 'collaboration_request',
      sender: this.nodeId,
      broadcast: true,
      payload: request,
      timestamp: new Date(),
      ttl: 20
    });

    return request;
  }

  /**
   * Start consensus process for important decisions
   */
  public async startConsensus(proposalId: string, value: any, timeout: number = this.consensusTimeout): Promise<boolean> {
    const consensus: SwarmConsensus = {
      proposalId: proposalId,
      proposer: this.nodeId,
      value: value,
      votes: new Map(),
      status: 'pending',
      timestamp: new Date(),
      timeout: timeout
    };

    this.consensusProposals.set(proposalId, consensus);

    // Broadcast consensus proposal
    await this.broadcastMessage({
      id: `consensus_${proposalId}`,
      type: 'consensus_vote',
      sender: this.nodeId,
      broadcast: true,
      payload: { proposalId, value, action: 'propose' },
      timestamp: new Date(),
      ttl: Math.ceil(timeout / 1000)
    });

    // Start timeout
    setTimeout(() => {
      this.finalizeConsensus(proposalId);
    }, timeout);

    return true;
  }

  /**
   * Vote on a consensus proposal
   */
  public async voteOnConsensus(proposalId: string, vote: 'accept' | 'reject'): Promise<void> {
    const consensus = this.consensusProposals.get(proposalId);
    if (!consensus) return;

    consensus.votes.set(this.nodeId, vote);

    // Broadcast vote
    await this.broadcastMessage({
      id: `vote_${proposalId}_${this.nodeId}`,
      type: 'consensus_vote',
      sender: this.nodeId,
      broadcast: true,
      payload: { proposalId, vote, action: 'vote' },
      timestamp: new Date(),
      ttl: 5
    });

    // Check if we have enough votes
    if (consensus.votes.size >= this.getMinimumVotes()) {
      this.finalizeConsensus(proposalId);
    }
  }

  /**
   * Finalize consensus based on votes
   */
  private finalizeConsensus(proposalId: string): void {
    const consensus = this.consensusProposals.get(proposalId);
    if (!consensus) return;

    const acceptVotes = Array.from(consensus.votes.values()).filter(v => v === 'accept').length;
    const totalVotes = consensus.votes.size;
    
    if (acceptVotes > totalVotes / 2) {
      consensus.status = 'accepted';
      console.log(`✅ Consensus accepted: ${proposalId} (${acceptVotes}/${totalVotes})`);
    } else {
      consensus.status = 'rejected';
      console.log(`❌ Consensus rejected: ${proposalId} (${acceptVotes}/${totalVotes})`);
    }

    // Broadcast final result
    this.broadcastMessage({
      id: `final_${proposalId}`,
      type: 'consensus_vote',
      sender: this.nodeId,
      broadcast: true,
      payload: { proposalId, status: consensus.status, action: 'finalize' },
      timestamp: new Date(),
      ttl: 10
    });
  }

  /**
   * Start gossip protocol for state synchronization
   */
  private startGossipProtocol(): void {
    setInterval(() => {
      this.performGossipRound();
    }, this.gossipInterval);
  }

  /**
   * Perform a gossip round to synchronize state
   */
  private async performGossipRound(): Promise<void> {
    const node = this.nodes.get(this.nodeId);
    if (!node || !node.isActive) return;

    // Create gossip update
    const update: GossipUpdate = {
      nodeId: this.nodeId,
      updateType: 'workload_change',
      data: { workload: node.workload, capabilities: node.capabilities },
      version: Date.now()
    };

    // Send to random neighbors
    const neighbors = Array.from(node.neighbors);
    const randomNeighbors = neighbors.sort(() => 0.5 - Math.random()).slice(0, Math.min(2, neighbors.length));

    for (const neighborId of randomNeighbors) {
      await this.sendMessage({
        id: `gossip_${Date.now()}`,
        type: 'gossip_update',
        sender: this.nodeId,
        target: neighborId,
        broadcast: false,
        payload: update,
        timestamp: new Date(),
        ttl: 5
      });
    }
  }

  /**
   * Start message processing loop
   */
  private startMessageProcessing(): void {
    setInterval(() => {
      this.processMessageQueue();
    }, 100); // Process every 100ms
  }

  /**
   * Process pending messages
   */
  private async processMessageQueue(): Promise<void> {
    const now = Date.now();
    const validMessages = this.messageQueue.filter(msg => 
      now - msg.timestamp.getTime() < msg.ttl * 1000
    );

    this.messageQueue = validMessages;

    for (const message of validMessages.slice(0, 10)) { // Process up to 10 messages per cycle
      await this.handleMessage(message);
    }
  }

  /**
   * Handle incoming message
   */
  private async handleMessage(message: DecentralizedMessage): Promise<void> {
    switch (message.type) {
      case 'task_proposal':
        await this.handleTaskProposal(message.payload, message.sender);
        break;
      case 'collaboration_request':
        await this.handleCollaborationRequest(message.payload, message.sender);
        break;
      case 'consensus_vote':
        await this.handleConsensusVote(message.payload, message.sender);
        break;
      case 'gossip_update':
        await this.handleGossipUpdate(message.payload, message.sender);
        break;
    }
  }

  /**
   * Broadcast message to all neighbors
   */
  private async broadcastMessage(message: DecentralizedMessage): Promise<void> {
    const node = this.nodes.get(this.nodeId);
    if (!node) return;

    for (const neighborId of node.neighbors) {
      await this.sendMessage({ ...message, target: neighborId, broadcast: false });
    }
  }

  /**
   * Send message to specific node
   */
  private async sendMessage(message: DecentralizedMessage): Promise<void> {
    // In a real implementation, this would use actual network communication
    // For now, we'll simulate by adding to the target node's message queue
    if (message.target) {
      const targetNode = this.nodes.get(message.target);
      if (targetNode && targetNode.isActive) {
        // Simulate network delay
        setTimeout(() => {
          // This would be handled by the target node's coordinator
          console.log(`📨 Message sent: ${message.type} from ${message.sender} to ${message.target}`);
        }, Math.random() * 100);
      }
    }
  }

  /**
   * Utility methods
   */
  private canHandleTask(proposal: TaskProposal, node: PeerNode): boolean {
    // Check workload capacity
    if (node.workload > 80) return false;

    // Check capability match
    const capabilityMatch = this.calculateCapabilityMatch(proposal.requiredCapabilities, node.capabilities);
    return capabilityMatch > 0.6;
  }

  private calculateCapabilityMatch(required: string[], capabilities: SwarmAgentCapabilities): number {
    if (!capabilities.specializedSkills) return 0;
    
    const matches = required.filter(req => 
      capabilities.specializedSkills!.some(skill => 
        skill.toLowerCase().includes(req.toLowerCase())
      )
    ).length;
    
    return matches / required.length;
  }

  private calculateTaskPriority(task: SwarmTask): number {
    const priorityMap = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorityMap[task.priority] || 2;
  }

  private calculateTaskReward(task: SwarmTask): number {
    return task.complexity * 10 + this.calculateTaskPriority(task) * 5;
  }

  private estimateTaskTime(proposal: TaskProposal): number {
    return proposal.estimatedTime * (1 + Math.random() * 0.2); // Add some variance
  }

  private calculateCollaborationCompensation(skills: string[], duration: number): number {
    return skills.length * 5 + duration * 2;
  }

  private getMinimumVotes(): number {
    return Math.max(2, Math.ceil(this.nodes.size * 0.5));
  }

  private async handleCollaborationRequest(request: CollaborationRequest, sender: string): Promise<void> {
    // Implementation for handling collaboration requests
    console.log(`🤝 Collaboration request from ${sender}: ${request.collaborationType}`);
  }

  private async handleConsensusVote(payload: any, sender: string): Promise<void> {
    // Implementation for handling consensus votes
    console.log(`🗳️ Consensus vote from ${sender}: ${payload.action}`);
  }

  private async handleGossipUpdate(update: GossipUpdate, sender: string): Promise<void> {
    // Update local state based on gossip
    this.gossipState.set(update.nodeId, update.data);
    console.log(`💬 Gossip update from ${sender}: ${update.updateType}`);
  }

  private async forwardTaskProposal(proposal: TaskProposal, originalSender: string): Promise<void> {
    // Forward task proposal to neighbors if we can't handle it
    const node = this.nodes.get(this.nodeId);
    if (!node) return;

    // Don't forward back to original sender
    const forwardNeighbors = Array.from(node.neighbors).filter(id => id !== originalSender);
    
    for (const neighborId of forwardNeighbors) {
      await this.sendMessage({
        id: `forward_${proposal.taskId}_${Date.now()}`,
        type: 'task_proposal',
        sender: this.nodeId,
        target: neighborId,
        broadcast: false,
        payload: proposal,
        timestamp: new Date(),
        ttl: 25 // Reduce TTL when forwarding
      });
    }
  }

  /**
   * Get network statistics
   */
  public getNetworkStats(): {
    totalNodes: number;
    activeNodes: number;
    averageReputation: number;
    averageWorkload: number;
    totalConnections: number;
  } {
    const activeNodes = Array.from(this.nodes.values()).filter(n => n.isActive);
    const totalConnections = activeNodes.reduce((sum, node) => sum + node.neighbors.size, 0);
    const averageReputation = activeNodes.reduce((sum, node) => sum + node.reputation, 0) / activeNodes.length;
    const averageWorkload = activeNodes.reduce((sum, node) => sum + node.workload, 0) / activeNodes.length;

    return {
      totalNodes: this.nodes.size,
      activeNodes: activeNodes.length,
      averageReputation: averageReputation || 0,
      averageWorkload: averageWorkload || 0,
      totalConnections: totalConnections
    };
  }

  /**
   * Cleanup and shutdown
   */
  public destroy(): void {
    this.nodes.clear();
    this.messageQueue = [];
    this.consensusProposals.clear();
    this.gossipState.clear();
    console.log('🌐 Decentralized coordinator destroyed');
  }
}






