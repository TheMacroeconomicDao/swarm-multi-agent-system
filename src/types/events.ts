// 🎯 EVENT-DRIVEN ARCHITECTURE TYPES
// Advanced event system for multi-agent communication

export interface BaseEvent {
  id: string;
  type: string;
  source: string;
  target?: string;
  timestamp: number;
  correlationId: string;
  version: number;
  metadata?: Record<string, any>;
}

export interface AgentEvent extends BaseEvent {
  type: AgentEventType;
  payload: AgentEventPayload;
}

export enum AgentEventType {
  // Task Management
  TASK_CREATED = 'task_created',
  TASK_ASSIGNED = 'task_assigned',
  TASK_STARTED = 'task_started',
  TASK_COMPLETED = 'task_completed',
  TASK_FAILED = 'task_failed',
  TASK_CANCELLED = 'task_cancelled',
  
  // Agent Lifecycle
  AGENT_REGISTERED = 'agent_registered',
  AGENT_AVAILABLE = 'agent_available',
  AGENT_BUSY = 'agent_busy',
  AGENT_OFFLINE = 'agent_offline',
  AGENT_HEARTBEAT = 'agent_heartbeat',
  
  // Communication
  MESSAGE_SENT = 'message_sent',
  MESSAGE_RECEIVED = 'message_received',
  COLLABORATION_REQUEST = 'collaboration_request',
  COLLABORATION_RESPONSE = 'collaboration_response',
  
  // System Events
  SYSTEM_STARTUP = 'system_startup',
  SYSTEM_SHUTDOWN = 'system_shutdown',
  ERROR_OCCURRED = 'error_occurred',
  PERFORMANCE_METRIC = 'performance_metric',
  
  // Session Management
  SESSION_CREATED = 'session_created',
  SESSION_UPDATED = 'session_updated',
  SESSION_CLOSED = 'session_closed',
  
  // Code Management
  CODE_FILE_CREATED = 'code_file_created',
  CODE_FILE_UPDATED = 'code_file_updated',
  CODE_FILE_DELETED = 'code_file_deleted',
  CODE_EXECUTION_STARTED = 'code_execution_started',
  CODE_EXECUTION_COMPLETED = 'code_execution_completed'
}

export interface AgentEventPayload {
  [key: string]: any;
}

export interface TaskEventPayload extends AgentEventPayload {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: number;
  assignedAgent?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  result?: any;
  error?: string;
}

export interface AgentLifecycleEventPayload extends AgentEventPayload {
  agentId: string;
  agentRole: string;
  capabilities: string[];
  status: 'idle' | 'thinking' | 'working' | 'waiting' | 'collaborating';
  workload: number;
  performance: {
    tasksCompleted: number;
    averageCompletionTime: number;
    successRate: number;
    collaborationRating: number;
  };
}

export interface MessageEventPayload extends AgentEventPayload {
  messageId: string;
  content: string;
  messageType: 'command' | 'response' | 'collaboration' | 'status' | 'error';
  sessionId?: string;
  taskId?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
}

export interface CollaborationEventPayload extends AgentEventPayload {
  collaborationId: string;
  requestingAgent: string;
  targetAgent: string;
  requestType: 'help' | 'review' | 'delegation' | 'consultation';
  context: any;
  response?: any;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

export interface SystemEventPayload extends AgentEventPayload {
  component: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  stackTrace?: string;
  metrics?: Record<string, number>;
}

export interface SessionEventPayload extends AgentEventPayload {
  sessionId: string;
  sessionTitle: string;
  sessionDescription: string;
  participants: string[];
  status: 'active' | 'paused' | 'completed' | 'archived';
  techStack: string[];
  vibeMetrics: {
    flowScore: number;
    iterationVelocity: number;
    codeQuality: number;
    userSatisfaction: number;
  };
}

export interface CodeEventPayload extends AgentEventPayload {
  filePath: string;
  fileName: string;
  language: string;
  content?: string;
  changes?: {
    added: number;
    removed: number;
    modified: number;
  };
  version: number;
  modifiedBy: string;
  executionResult?: any;
  executionError?: string;
}

// Event Handler Types
export type EventHandler<T extends AgentEvent = AgentEvent> = (event: T) => Promise<void> | void;

export interface EventSubscription {
  id: string;
  eventType: AgentEventType;
  handler: EventHandler;
  filter?: (event: AgentEvent) => boolean;
  priority: number;
  active: boolean;
}

// Event Bus Configuration
export interface EventBusConfig {
  maxRetries: number;
  retryDelay: number;
  batchSize: number;
  flushInterval: number;
  persistence: boolean;
  compression: boolean;
  encryption: boolean;
}

// Event Store Types
export interface EventStore {
  append(event: AgentEvent): Promise<void>;
  getEvents(filter: EventFilter): Promise<AgentEvent[]>;
  getEventById(id: string): Promise<AgentEvent | null>;
  getEventsByCorrelationId(correlationId: string): Promise<AgentEvent[]>;
  deleteEvents(olderThan: Date): Promise<number>;
}

export interface EventFilter {
  eventTypes?: AgentEventType[];
  source?: string;
  target?: string;
  correlationId?: string;
  fromTimestamp?: number;
  toTimestamp?: number;
  limit?: number;
  offset?: number;
}

// Event Replay Types
export interface EventReplay {
  replayId: string;
  fromTimestamp: number;
  toTimestamp: number;
  eventTypes?: AgentEventType[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  totalEvents: number;
  processedEvents: number;
  errors: string[];
}
