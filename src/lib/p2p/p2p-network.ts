// 🎯 P2P NETWORK - Peer-to-Peer Communication Layer
// Advanced P2P networking for direct agent-to-agent communication

import { EventEmitter } from 'events';

export interface P2PNode {
  id: string;
  address: string;
  port: number;
  capabilities: string[];
  status: 'online' | 'offline' | 'busy';
  lastSeen: Date;
  metadata: Record<string, any>;
}

export interface P2PMessage {
  id: string;
  from: string;
  to: string;
  type: 'direct' | 'broadcast' | 'discovery' | 'heartbeat';
  payload: any;
  timestamp: number;
  signature?: string;
  ttl?: number;
}

export interface P2PConnection {
  nodeId: string;
  connection: any; // WebSocket or similar
  status: 'connecting' | 'connected' | 'disconnected';
  lastActivity: Date;
  messageQueue: P2PMessage[];
}

export class P2PNetwork extends EventEmitter {
  private nodeId: string;
  private connections = new Map<string, P2PConnection>();
  private knownNodes = new Map<string, P2PNode>();
  private messageHandlers = new Map<string, (message: P2PMessage) => Promise<void>>();
  private isRunning = false;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private discoveryInterval: NodeJS.Timeout | null = null;

  constructor(nodeId: string) {
    super();
    this.nodeId = nodeId;
  }

  // Start P2P network
  public async start(): Promise<void> {
    if (this.isRunning) {
      console.log('P2P Network already running');
      return;
    }

    this.isRunning = true;
    
    // Start heartbeat mechanism
    this.startHeartbeat();
    
    // Start node discovery
    this.startDiscovery();
    
    console.log(`🌐 P2P Network started for node: ${this.nodeId}`);
    this.emit('network_started', { nodeId: this.nodeId });
  }

  // Stop P2P network
  public async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    
    // Stop intervals
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    
    if (this.discoveryInterval) {
      clearInterval(this.discoveryInterval);
      this.discoveryInterval = null;
    }
    
    // Close all connections
    for (const [nodeId, connection] of this.connections.entries()) {
      await this.disconnect(nodeId);
    }
    
    this.connections.clear();
    this.knownNodes.clear();
    
    console.log(`🌐 P2P Network stopped for node: ${this.nodeId}`);
    this.emit('network_stopped', { nodeId: this.nodeId });
  }

  // Connect to a peer node
  public async connect(nodeId: string, address: string, port: number): Promise<boolean> {
    if (this.connections.has(nodeId)) {
      console.log(`Already connected to node: ${nodeId}`);
      return true;
    }

    try {
      // Create WebSocket connection (simplified for demo)
      const connection = await this.createConnection(address, port);
      
      const p2pConnection: P2PConnection = {
        nodeId,
        connection,
        status: 'connected',
        lastActivity: new Date(),
        messageQueue: []
      };
      
      this.connections.set(nodeId, p2pConnection);
      
      // Setup message handling
      this.setupConnectionHandlers(p2pConnection);
      
      console.log(`🔗 Connected to peer: ${nodeId} at ${address}:${port}`);
      this.emit('peer_connected', { nodeId, address, port });
      
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${nodeId}:`, error);
      this.emit('connection_failed', { nodeId, error });
      return false;
    }
  }

  // Disconnect from a peer node
  public async disconnect(nodeId: string): Promise<void> {
    const connection = this.connections.get(nodeId);
    if (!connection) {
      return;
    }

    try {
      // Close connection
      if (connection.connection && connection.connection.close) {
        connection.connection.close();
      }
      
      this.connections.delete(nodeId);
      
      console.log(`🔌 Disconnected from peer: ${nodeId}`);
      this.emit('peer_disconnected', { nodeId });
    } catch (error) {
      console.error(`Error disconnecting from ${nodeId}:`, error);
    }
  }

  // Send message to specific peer
  public async sendMessage(to: string, type: string, payload: any): Promise<boolean> {
    const message: P2PMessage = {
      id: this.generateMessageId(),
      from: this.nodeId,
      to,
      type: 'direct',
      payload: { type, data: payload },
      timestamp: Date.now(),
      ttl: 300 // 5 minutes TTL
    };

    const connection = this.connections.get(to);
    if (!connection || connection.status !== 'connected') {
      console.error(`No connection to peer: ${to}`);
      return false;
    }

    try {
      await this.sendMessageToConnection(connection, message);
      console.log(`📤 Message sent to ${to}: ${type}`);
      return true;
    } catch (error) {
      console.error(`Failed to send message to ${to}:`, error);
      return false;
    }
  }

  // Broadcast message to all connected peers
  public async broadcast(type: string, payload: any): Promise<number> {
    const message: P2PMessage = {
      id: this.generateMessageId(),
      from: this.nodeId,
      to: 'broadcast',
      type: 'broadcast',
      payload: { type, data: payload },
      timestamp: Date.now(),
      ttl: 300
    };

    let sentCount = 0;
    const promises = Array.from(this.connections.values()).map(async (connection) => {
      if (connection.status === 'connected') {
        try {
          await this.sendMessageToConnection(connection, message);
          sentCount++;
        } catch (error) {
          console.error(`Failed to broadcast to ${connection.nodeId}:`, error);
        }
      }
    });

    await Promise.allSettled(promises);
    
    console.log(`📢 Broadcast sent to ${sentCount} peers: ${type}`);
    return sentCount;
  }

  // Register message handler
  public onMessage(type: string, handler: (message: P2PMessage) => Promise<void>): void {
    this.messageHandlers.set(type, handler);
    console.log(`📝 Message handler registered for type: ${type}`);
  }

  // Get connected peers
  public getConnectedPeers(): string[] {
    return Array.from(this.connections.keys()).filter(nodeId => {
      const connection = this.connections.get(nodeId);
      return connection && connection.status === 'connected';
    });
  }

  // Get known nodes
  public getKnownNodes(): P2PNode[] {
    return Array.from(this.knownNodes.values());
  }

  // Get network statistics
  public getNetworkStats(): {
    nodeId: string;
    connectedPeers: number;
    knownNodes: number;
    totalMessages: number;
    isRunning: boolean;
  } {
    const connectedPeers = this.getConnectedPeers().length;
    const knownNodes = this.knownNodes.size;
    
    return {
      nodeId: this.nodeId,
      connectedPeers,
      knownNodes,
      totalMessages: 0, // Would track this in real implementation
      isRunning: this.isRunning
    };
  }

  // Private methods
  private async createConnection(address: string, port: number): Promise<any> {
    // Simplified connection creation - in real implementation would use WebSocket
    return {
      address,
      port,
      close: () => {},
      send: (data: string) => {
        console.log(`Sending to ${address}:${port}:`, data);
      }
    };
  }

  private setupConnectionHandlers(connection: P2PConnection): void {
    // Setup message handlers for the connection
    // In real implementation, would listen to WebSocket events
    console.log(`Setting up handlers for connection: ${connection.nodeId}`);
  }

  private async sendMessageToConnection(connection: P2PConnection, message: P2PMessage): Promise<void> {
    if (connection.connection && connection.connection.send) {
      connection.connection.send(JSON.stringify(message));
      connection.lastActivity = new Date();
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.broadcast('heartbeat', {
        nodeId: this.nodeId,
        timestamp: Date.now(),
        status: 'online'
      });
    }, 30000); // Send heartbeat every 30 seconds
  }

  private startDiscovery(): void {
    this.discoveryInterval = setInterval(() => {
      this.broadcast('discovery_request', {
        nodeId: this.nodeId,
        capabilities: ['agent', 'task_processing'],
        timestamp: Date.now()
      });
    }, 60000); // Send discovery request every minute
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Handle incoming messages
  private async handleIncomingMessage(connection: P2PConnection, rawMessage: string): Promise<void> {
    try {
      const message: P2PMessage = JSON.parse(rawMessage);
      
      // Update connection activity
      connection.lastActivity = new Date();
      
      // Handle different message types
      switch (message.type) {
        case 'direct':
          await this.handleDirectMessage(message);
          break;
        case 'broadcast':
          await this.handleBroadcastMessage(message);
          break;
        case 'discovery':
          await this.handleDiscoveryMessage(message);
          break;
        case 'heartbeat':
          await this.handleHeartbeatMessage(message);
          break;
        default:
          console.log(`Unknown message type: ${message.type}`);
      }
      
      this.emit('message_received', { message, from: connection.nodeId });
    } catch (error) {
      console.error('Error handling incoming message:', error);
    }
  }

  private async handleDirectMessage(message: P2PMessage): Promise<void> {
    const { type, data } = message.payload;
    const handler = this.messageHandlers.get(type);
    
    if (handler) {
      await handler(message);
    } else {
      console.log(`No handler for message type: ${type}`);
    }
  }

  private async handleBroadcastMessage(message: P2PMessage): Promise<void> {
    // Don't rebroadcast our own messages
    if (message.from === this.nodeId) {
      return;
    }
    
    const { type, data } = message.payload;
    const handler = this.messageHandlers.get(type);
    
    if (handler) {
      await handler(message);
    }
  }

  private async handleDiscoveryMessage(message: P2PMessage): Promise<void> {
    const { nodeId, capabilities, timestamp } = message.payload;
    
    // Update known nodes
    this.knownNodes.set(nodeId, {
      id: nodeId,
      address: 'unknown', // Would get from connection
      port: 0,
      capabilities,
      status: 'online',
      lastSeen: new Date(timestamp),
      metadata: {}
    });
    
    console.log(`🔍 Discovered peer: ${nodeId} with capabilities: ${capabilities.join(', ')}`);
  }

  private async handleHeartbeatMessage(message: P2PMessage): Promise<void> {
    const { nodeId, timestamp, status } = message.payload;
    
    // Update node status
    const node = this.knownNodes.get(nodeId);
    if (node) {
      node.status = status;
      node.lastSeen = new Date(timestamp);
    }
  }
}
