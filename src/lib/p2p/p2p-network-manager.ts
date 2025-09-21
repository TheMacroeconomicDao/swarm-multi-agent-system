// 🎯 P2P NETWORK MANAGER - Centralized P2P Network Coordination
// Advanced manager for coordinating P2P networks across multiple agents

import { P2PNetwork } from './p2p-network';
import { P2PAgent } from './p2p-agent';
import { EventBus } from '@/lib/events/event-bus';
import { EventFactory } from '@/lib/events/event-factory';
import { AgentEventType } from '@/types/events';
import { AgentRole } from '@/types/agents';

export interface NetworkTopology {
  nodes: Map<string, P2PAgent>;
  connections: Map<string, string[]>; // nodeId -> connected nodeIds
  clusters: Map<string, string[]>; // clusterId -> nodeIds
  bridges: Map<string, string[]>; // bridge nodeId -> connected clusterIds
}

export interface NetworkMetrics {
  totalNodes: number;
  activeConnections: number;
  averageLatency: number;
  networkHealth: number;
  clusterCount: number;
  bridgeCount: number;
  messageThroughput: number;
  errorRate: number;
}

export class P2PNetworkManager {
  private topology: NetworkTopology;
  private eventBus: EventBus;
  private isRunning = false;
  private metricsInterval: NodeJS.Timeout | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private networkMetrics: NetworkMetrics;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.topology = {
      nodes: new Map(),
      connections: new Map(),
      clusters: new Map(),
      bridges: new Map()
    };
    
    this.networkMetrics = {
      totalNodes: 0,
      activeConnections: 0,
      averageLatency: 0,
      networkHealth: 100,
      clusterCount: 0,
      bridgeCount: 0,
      messageThroughput: 0,
      errorRate: 0
    };

    this.setupEventHandlers();
  }

  // Start network manager
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log('P2P Network Manager already running');
      return;
    }

    this.isRunning = true;
    
    // Start metrics collection
    this.startMetricsCollection();
    
    // Start health checks
    this.startHealthChecks();
    
    console.log('🌐 P2P Network Manager started');
    
    // Emit network started event
    if (this.eventBus) {
      const event = EventFactory.createCustomEvent(
        AgentEventType.SYSTEM_STARTUP,
        { component: 'p2p_network_manager', status: 'started' },
        'network_manager'
      );
      await this.eventBus.publish(event);
    }
  }

  // Stop network manager
  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    // Stop intervals
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    // Stop all P2P agents
    for (const [nodeId, agent] of this.topology.nodes.entries()) {
      await agent.stopP2P();
    }
    
    // Clear topology
    this.topology.nodes.clear();
    this.topology.connections.clear();
    this.topology.clusters.clear();
    this.topology.bridges.clear();
    
    console.log('🌐 P2P Network Manager stopped');
    
    // Emit network stopped event
    if (this.eventBus) {
      const event = EventFactory.createCustomEvent(
        AgentEventType.SYSTEM_SHUTDOWN,
        { component: 'p2p_network_manager', status: 'stopped' },
        'network_manager'
      );
      await this.eventBus.publish(event);
    }
  }

  // Register P2P agent
  public async registerAgent(agent: P2PAgent): Promise<void> {
    const nodeId = agent.getId();
    
    // Add to topology
    this.topology.nodes.set(nodeId, agent);
    this.topology.connections.set(nodeId, []);
    
    // Initialize P2P network for agent
    await agent.initializeP2P();
    
    // Try to connect to existing nodes
    await this.connectToExistingNodes(agent);
    
    // Update clusters
    await this.updateClusters();
    
    console.log(`🤖 P2P Agent registered: ${nodeId}`);
    
    // Emit agent registered event
    if (this.eventBus) {
      const event = EventFactory.createAgentRegisteredEvent(
        nodeId,
        agent.getRole(),
        agent.getContext().availableTools || [],
        'network_manager'
      );
      await this.eventBus.publish(event);
    }
  }

  // Unregister P2P agent
  public async unregisterAgent(nodeId: string): Promise<void> {
    const agent = this.topology.nodes.get(nodeId);
    if (!agent) {
      return;
    }

    // Stop P2P network
    await agent.stopP2P();
    
    // Remove from topology
    this.topology.nodes.delete(nodeId);
    this.topology.connections.delete(nodeId);
    
    // Remove from clusters
    for (const [clusterId, nodeIds] of this.topology.clusters.entries()) {
      const index = nodeIds.indexOf(nodeId);
      if (index !== -1) {
        nodeIds.splice(index, 1);
        if (nodeIds.length === 0) {
          this.topology.clusters.delete(clusterId);
        }
      }
    }
    
    // Update connections
    for (const [connectedNodeId, connections] of this.topology.connections.entries()) {
      const index = connections.indexOf(nodeId);
      if (index !== -1) {
        connections.splice(index, 1);
      }
    }
    
    console.log(`🤖 P2P Agent unregistered: ${nodeId}`);
  }

  // Connect agent to existing nodes
  private async connectToExistingNodes(newAgent: P2PAgent): Promise<void> {
    const newAgentId = newAgent.getId();
    const newAgentConnections: string[] = [];
    
    // Try to connect to a few existing nodes (limited connections for efficiency)
    const existingNodes = Array.from(this.topology.nodes.entries())
      .filter(([nodeId]) => nodeId !== newAgentId)
      .slice(0, 3); // Connect to max 3 existing nodes
    
    for (const [nodeId, existingAgent] of existingNodes) {
      try {
        // Get peer info (simplified - in real implementation would use discovery)
        const peerInfo = existingAgent.getPeerInfo(nodeId);
        if (peerInfo && peerInfo.address) {
          const success = await newAgent.connectToPeer(nodeId, peerInfo.address, peerInfo.port);
          if (success) {
            newAgentConnections.push(nodeId);
            
            // Add reverse connection
            const existingConnections = this.topology.connections.get(nodeId) || [];
            if (!existingConnections.includes(newAgentId)) {
              existingConnections.push(newAgentId);
            }
            this.topology.connections.set(nodeId, existingConnections);
          }
        }
      } catch (error) {
        console.error(`Failed to connect ${newAgentId} to ${nodeId}:`, error);
      }
    }
    
    this.topology.connections.set(newAgentId, newAgentConnections);
  }

  // Update network clusters
  private async updateClusters(): Promise<void> {
    const visited = new Set<string>();
    const clusters = new Map<string, string[]>();
    let clusterId = 0;
    
    // Find connected components (clusters)
    for (const [nodeId] of this.topology.nodes.entries()) {
      if (!visited.has(nodeId)) {
        const cluster = this.findConnectedComponent(nodeId, visited);
        if (cluster.length > 1) {
          clusters.set(`cluster_${clusterId++}`, cluster);
        }
      }
    }
    
    this.topology.clusters = clusters;
    
    // Identify bridge nodes (nodes that connect clusters)
    this.identifyBridgeNodes();
  }

  // Find connected component starting from a node
  private findConnectedComponent(startNode: string, visited: Set<string>): string[] {
    const component: string[] = [];
    const stack = [startNode];
    
    while (stack.length > 0) {
      const nodeId = stack.pop()!;
      if (visited.has(nodeId)) {
        continue;
      }
      
      visited.add(nodeId);
      component.push(nodeId);
      
      const connections = this.topology.connections.get(nodeId) || [];
      for (const connectedNode of connections) {
        if (!visited.has(connectedNode)) {
          stack.push(connectedNode);
        }
      }
    }
    
    return component;
  }

  // Identify bridge nodes that connect different clusters
  private identifyBridgeNodes(): void {
    this.topology.bridges.clear();
    
    for (const [nodeId, connections] of this.topology.connections.entries()) {
      const connectedClusters = new Set<string>();
      
      for (const connectedNode of connections) {
        for (const [clusterId, clusterNodes] of this.topology.clusters.entries()) {
          if (clusterNodes.includes(connectedNode)) {
            connectedClusters.add(clusterId);
          }
        }
      }
      
      if (connectedClusters.size > 1) {
        this.topology.bridges.set(nodeId, Array.from(connectedClusters));
      }
    }
  }

  // Start metrics collection
  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      this.updateNetworkMetrics();
    }, 10000); // Update every 10 seconds
  }

  // Start health checks
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.performHealthChecks();
    }, 30000); // Check every 30 seconds
  }

  // Update network metrics
  private updateNetworkMetrics(): void {
    const totalNodes = this.topology.nodes.size;
    let activeConnections = 0;
    let totalLatency = 0;
    let latencyCount = 0;
    
    for (const [nodeId, connections] of this.topology.connections.entries()) {
      activeConnections += connections.length;
      
      // Simulate latency measurement (in real implementation would measure actual latency)
      for (const connectedNode of connections) {
        totalLatency += Math.random() * 100; // 0-100ms simulated latency
        latencyCount++;
      }
    }
    
    this.networkMetrics = {
      totalNodes,
      activeConnections,
      averageLatency: latencyCount > 0 ? totalLatency / latencyCount : 0,
      networkHealth: this.calculateNetworkHealth(),
      clusterCount: this.topology.clusters.size,
      bridgeCount: this.topology.bridges.size,
      messageThroughput: this.calculateMessageThroughput(),
      errorRate: this.calculateErrorRate()
    };
    
    // Emit metrics event
    if (this.eventBus) {
      const event = EventFactory.createPerformanceMetricEvent(
        'p2p_network_manager',
        this.networkMetrics,
        'network_manager'
      );
      this.eventBus.publish(event);
    }
  }

  // Calculate network health score
  private calculateNetworkHealth(): number {
    const totalNodes = this.topology.nodes.size;
    if (totalNodes === 0) return 100;
    
    const averageConnections = this.networkMetrics.activeConnections / totalNodes;
    const clusterHealth = this.topology.clusters.size > 0 ? 100 : 50;
    const connectivityHealth = Math.min(100, (averageConnections / 3) * 100);
    
    return (clusterHealth + connectivityHealth) / 2;
  }

  // Calculate message throughput (simplified)
  private calculateMessageThroughput(): number {
    // In real implementation, would track actual message counts
    return this.networkMetrics.activeConnections * 10; // Simulated messages per second
  }

  // Calculate error rate (simplified)
  private calculateErrorRate(): number {
    // In real implementation, would track actual errors
    return Math.random() * 5; // 0-5% simulated error rate
  }

  // Perform health checks on all nodes
  private async performHealthChecks(): Promise<void> {
    const healthChecks = Array.from(this.topology.nodes.entries()).map(async ([nodeId, agent]) => {
      try {
        const stats = agent.getNetworkStats();
        if (!stats.isRunning) {
          console.warn(`⚠️ Node ${nodeId} is not running`);
          await this.handleUnhealthyNode(nodeId);
        }
      } catch (error) {
        console.error(`Health check failed for node ${nodeId}:`, error);
        await this.handleUnhealthyNode(nodeId);
      }
    });
    
    await Promise.allSettled(healthChecks);
  }

  // Handle unhealthy node
  private async handleUnhealthyNode(nodeId: string): Promise<void> {
    console.log(`🔧 Handling unhealthy node: ${nodeId}`);
    
    // Try to reconnect or remove node
    const agent = this.topology.nodes.get(nodeId);
    if (agent) {
      try {
        await agent.stopP2P();
        await agent.initializeP2P();
        console.log(`✅ Node ${nodeId} reconnected`);
      } catch (error) {
        console.error(`Failed to reconnect node ${nodeId}:`, error);
        await this.unregisterAgent(nodeId);
      }
    }
  }

  // Setup event handlers
  private setupEventHandlers(): void {
    // Handle agent lifecycle events
    if (this.eventBus) {
      this.eventBus.subscribe(
        AgentEventType.AGENT_REGISTERED,
        this.handleAgentRegistered.bind(this),
        { priority: 5 }
      );
      
      this.eventBus.subscribe(
        AgentEventType.AGENT_OFFLINE,
        this.handleAgentOffline.bind(this),
        { priority: 5 }
      );
    }
  }

  // Handle agent registered event
  private async handleAgentRegistered(event: any): Promise<void> {
    const { agentId } = event.payload;
    console.log(`📡 Agent registered event received: ${agentId}`);
    
    // Update topology if needed
    await this.updateClusters();
  }

  // Handle agent offline event
  private async handleAgentOffline(event: any): Promise<void> {
    const { agentId } = event.payload;
    console.log(`📡 Agent offline event received: ${agentId}`);
    
    // Remove from topology
    await this.unregisterAgent(agentId);
  }

  // Get network topology
  public getTopology(): NetworkTopology {
    return {
      nodes: new Map(this.topology.nodes),
      connections: new Map(this.topology.connections),
      clusters: new Map(this.topology.clusters),
      bridges: new Map(this.topology.bridges)
    };
  }

  // Get network metrics
  public getMetrics(): NetworkMetrics {
    return { ...this.networkMetrics };
  }

  // Get node information
  public getNodeInfo(nodeId: string): any {
    const agent = this.topology.nodes.get(nodeId);
    if (!agent) {
      return null;
    }
    
    return {
      id: nodeId,
      role: agent.getRole(),
      connections: this.topology.connections.get(nodeId) || [],
      networkStats: agent.getNetworkStats(),
      capabilities: agent.getContext().availableTools || []
    };
  }

  // Find best path between two nodes
  public findPath(fromNodeId: string, toNodeId: string): string[] | null {
    if (fromNodeId === toNodeId) {
      return [fromNodeId];
    }
    
    const visited = new Set<string>();
    const queue: { nodeId: string; path: string[] }[] = [{ nodeId: fromNodeId, path: [fromNodeId] }];
    
    while (queue.length > 0) {
      const { nodeId, path } = queue.shift()!;
      
      if (visited.has(nodeId)) {
        continue;
      }
      
      visited.add(nodeId);
      
      const connections = this.topology.connections.get(nodeId) || [];
      for (const connectedNode of connections) {
        if (connectedNode === toNodeId) {
          return [...path, connectedNode];
        }
        
        if (!visited.has(connectedNode)) {
          queue.push({ nodeId: connectedNode, path: [...path, connectedNode] });
        }
      }
    }
    
    return null; // No path found
  }

  // Broadcast message across entire network
  public async broadcastMessage(messageType: string, payload: any): Promise<number> {
    let totalSent = 0;
    
    for (const [nodeId, agent] of this.topology.nodes.entries()) {
      try {
        const sent = await agent.broadcastToPeers(messageType, payload);
        totalSent += sent;
      } catch (error) {
        console.error(`Failed to broadcast from node ${nodeId}:`, error);
      }
    }
    
    return totalSent;
  }
}
