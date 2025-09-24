// 🐝 SWARM SYSTEM TYPES - Unified Type Definitions
// Centralized type definitions for the swarm multi-agent system

export interface SwarmTask {
  id: string;
  title: string;
  description: string;
  complexity: number; // 1-10
  domain: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedAgent?: string;
  estimatedTime: number; // minutes
  dependencies: string[];
  subtasks: SwarmTask[];
  context: Record<string, any>;
  requirements: {
    codeQuality: number; // 1-10
    performance: number; // 1-10
    security: number; // 1-10
    maintainability: number; // 1-10
  };
  constraints: string[];
  successCriteria: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SwarmAgentCapabilities {
  canCoordinate: boolean;
  canExecuteCode: boolean;
  canAnalyzeRequirements: boolean;
  canReview: boolean;
  canOptimize: boolean;
  canTest: boolean;
  canDocument: boolean;
  canDeploy: boolean;
  specializedSkills: string[];
  domains?: string[];
  languages?: string[];
  frameworks?: string[];
  tools?: string[];
  maxComplexity?: number;
  parallelTasks?: number;
  specialization?: string[];
  collaborationStyle?: string;
}

export interface SwarmAgentMetrics {
  tasksCompleted: number;
  successRate: number;
  averageCompletionTime: number;
  averageResponseTime: number;
  collaborationRating: number;
  collaborationScore: number;
  qualityScore?: number;
  innovationScore?: number;
  costEfficiency?: number;
  specializationScore: Record<string, number>;
  lastActive: Date;
  currentWorkload: number; // 0-100
}

export interface SwarmExecution {
  id: string;
  taskId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  executionType: 'sequential' | 'parallel' | 'hybrid';
  assignedAgents: string[];
  parallelExecutions: SwarmExecution[];
  startTime: Date;
  startedAt: Date;
  endTime?: Date;
  completedAt?: Date;
  duration: number;
  results: any[];
  success: boolean;
  error?: string;
  qualityScore: number;
  cost: number;
  metrics: {
    totalCost: number;
    qualityScore: number;
    efficiency: number;
    agentUtilization: Record<string, number>;
  };
}

export interface SwarmContext {
  sessionId: string;
  taskId: string;
  agentId: string;
  sharedMemory: Map<string, any>;
  communicationHistory: any[];
  collaborationState: Record<string, any>;
  performanceMetrics: SwarmAgentMetrics;
}

export interface SwarmConfiguration {
  maxAgents: number;
  maxParallelTasks: number;
  qualityThreshold: number;
  costLimit: number;
  timeoutMs: number;
  retryAttempts: number;
  consensusAlgorithm: 'simple' | 'raft' | 'paxos';
  communicationProtocol: 'event-driven' | 'gossip' | 'broadcast';
}

export interface SwarmEvent {
  type: 'task_created' | 'task_assigned' | 'task_completed' | 'task_failed' | 'agent_joined' | 'agent_left' | 'collaboration_requested';
  timestamp: Date;
  source: string;
  target?: string;
  payload: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SwarmConsensus {
  proposalId: string;
  proposer: string;
  value: any;
  votes: Map<string, 'accept' | 'reject'>;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: Date;
  timeout: number;
}

export interface SwarmLearning {
  experience: any[];
  patterns: Map<string, any>;
  adaptations: any[];
  performanceHistory: any[];
  lastLearning: Date;
  learningRate: number;
}
