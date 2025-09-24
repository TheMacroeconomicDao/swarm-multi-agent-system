// 🎯 EVENT FACTORY - Event Creation and Management
// Factory for creating standardized events across the system

import { 
  AgentEvent, 
  AgentEventType, 
  TaskEventPayload,
  AgentLifecycleEventPayload,
  MessageEventPayload,
  CollaborationEventPayload,
  SystemEventPayload,
  SessionEventPayload,
  CodeEventPayload
} from '@/types/events';
import { Task } from '@/types/agents';

export class EventFactory {
  private static counter = 0; // Статический счетчик для уникальности

  private static generateId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 12); // Увеличена длина случайной части
    const counter = this.counter++;
    return `evt_${timestamp}_${counter}_${random}`;
  }

  private static generateCorrelationId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 12);
    return `corr_${timestamp}_${random}`;
  }

  // Task Events
  public static createTaskCreatedEvent(
    task: Task,
    source: string,
    correlationId?: string
  ): AgentEvent {
    const payload: TaskEventPayload = {
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description,
      priority: task.priority,
      complexity: task.estimatedComplexity,
      estimatedDuration: task.metadata?.estimatedDuration
    };

    return {
      id: this.generateId(),
      type: AgentEventType.TASK_CREATED,
      source,
      timestamp: Date.now(),
      correlationId: correlationId || this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  public static createTaskAssignedEvent(
    task: Task,
    assignedAgent: string,
    source: string,
    correlationId?: string
  ): AgentEvent {
    const payload: TaskEventPayload = {
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description,
      priority: task.priority,
      complexity: task.estimatedComplexity,
      assignedAgent,
      estimatedDuration: task.metadata?.estimatedDuration
    };

    return {
      id: this.generateId(),
      type: AgentEventType.TASK_ASSIGNED,
      source,
      target: assignedAgent,
      timestamp: Date.now(),
      correlationId: correlationId || this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  public static createTaskCompletedEvent(
    task: Task,
    result: any,
    actualDuration: number,
    source: string,
    correlationId?: string
  ): AgentEvent {
    const payload: TaskEventPayload = {
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description,
      priority: task.priority,
      complexity: task.estimatedComplexity,
      assignedAgent: task.assignedAgent,
      actualDuration,
      result
    };

    return {
      id: this.generateId(),
      type: AgentEventType.TASK_COMPLETED,
      source,
      timestamp: Date.now(),
      correlationId: correlationId || this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  public static createTaskFailedEvent(
    task: Task,
    error: string,
    source: string,
    correlationId?: string
  ): AgentEvent {
    const payload: TaskEventPayload = {
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description,
      priority: task.priority,
      complexity: task.estimatedComplexity,
      assignedAgent: task.assignedAgent,
      error
    };

    return {
      id: this.generateId(),
      type: AgentEventType.TASK_FAILED,
      source,
      timestamp: Date.now(),
      correlationId: correlationId || this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  // Agent Lifecycle Events
  public static createAgentRegisteredEvent(
    agentId: string,
    agentRole: string,
    capabilities: string[],
    source: string
  ): AgentEvent {
    const payload: AgentLifecycleEventPayload = {
      agentId,
      agentRole,
      capabilities,
      status: 'idle',
      workload: 0,
      performance: {
        tasksCompleted: 0,
        averageCompletionTime: 0,
        successRate: 0,
        collaborationRating: 0
      }
    };

    return {
      id: this.generateId(),
      type: AgentEventType.AGENT_REGISTERED,
      source,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  public static createAgentAvailableEvent(
    agentId: string,
    agentRole: string,
    capabilities: string[],
    workload: number,
    performance: any,
    source: string
  ): AgentEvent {
    const payload: AgentLifecycleEventPayload = {
      agentId,
      agentRole,
      capabilities,
      status: 'idle',
      workload,
      performance
    };

    return {
      id: this.generateId(),
      type: AgentEventType.AGENT_AVAILABLE,
      source,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  public static createAgentBusyEvent(
    agentId: string,
    agentRole: string,
    workload: number,
    currentTask?: string,
    source: string
  ): AgentEvent {
    const payload: AgentLifecycleEventPayload = {
      agentId,
      agentRole,
      capabilities: [],
      status: 'working',
      workload,
      performance: {
        tasksCompleted: 0,
        averageCompletionTime: 0,
        successRate: 0,
        collaborationRating: 0
      }
    };

    return {
      id: this.generateId(),
      type: AgentEventType.AGENT_BUSY,
      source,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  // Message Events
  public static createMessageSentEvent(
    messageId: string,
    content: string,
    messageType: 'command' | 'response' | 'collaboration' | 'status' | 'error',
    fromAgent: string,
    toAgent?: string,
    sessionId?: string,
    taskId?: string,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    tags?: string[]
  ): AgentEvent {
    const payload: MessageEventPayload = {
      messageId,
      content,
      messageType,
      sessionId,
      taskId,
      priority,
      tags
    };

    return {
      id: this.generateId(),
      type: AgentEventType.MESSAGE_SENT,
      source: fromAgent,
      target: toAgent,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  // Collaboration Events
  public static createCollaborationRequestEvent(
    collaborationId: string,
    requestingAgent: string,
    targetAgent: string,
    requestType: 'help' | 'review' | 'delegation' | 'consultation',
    context: any,
    source: string
  ): AgentEvent {
    const payload: CollaborationEventPayload = {
      collaborationId,
      requestingAgent,
      targetAgent,
      requestType,
      context,
      status: 'pending'
    };

    return {
      id: this.generateId(),
      type: AgentEventType.COLLABORATION_REQUEST,
      source,
      target: targetAgent,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  // System Events
  public static createErrorEvent(
    component: string,
    message: string,
    stackTrace?: string,
    level: 'warning' | 'error' | 'critical' = 'error',
    source: string = 'system'
  ): AgentEvent {
    const payload: SystemEventPayload = {
      component,
      level,
      message,
      stackTrace
    };

    return {
      id: this.generateId(),
      type: AgentEventType.ERROR_OCCURRED,
      source,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  public static createPerformanceMetricEvent(
    component: string,
    metrics: Record<string, number>,
    source: string = 'system'
  ): AgentEvent {
    const payload: SystemEventPayload = {
      component,
      level: 'info',
      message: 'Performance metrics updated',
      metrics
    };

    return {
      id: this.generateId(),
      type: AgentEventType.PERFORMANCE_METRIC,
      source,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  // Session Events
  public static createSessionCreatedEvent(
    sessionId: string,
    sessionTitle: string,
    sessionDescription: string,
    participants: string[],
    techStack: string[],
    source: string
  ): AgentEvent {
    const payload: SessionEventPayload = {
      sessionId,
      sessionTitle,
      sessionDescription,
      participants,
      status: 'active',
      techStack,
      vibeMetrics: {
        flowScore: 0,
        iterationVelocity: 0,
        codeQuality: 0,
        userSatisfaction: 0
      }
    };

    return {
      id: this.generateId(),
      type: AgentEventType.SESSION_CREATED,
      source,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  // Code Events
  public static createCodeFileUpdatedEvent(
    filePath: string,
    fileName: string,
    language: string,
    content: string,
    version: number,
    modifiedBy: string,
    changes?: { added: number; removed: number; modified: number },
    source: string
  ): AgentEvent {
    const payload: CodeEventPayload = {
      filePath,
      fileName,
      language,
      content,
      version,
      modifiedBy,
      changes
    };

    return {
      id: this.generateId(),
      type: AgentEventType.CODE_FILE_UPDATED,
      source,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  public static createCodeExecutionCompletedEvent(
    filePath: string,
    fileName: string,
    language: string,
    executionResult: any,
    executionError?: string,
    source: string
  ): AgentEvent {
    const payload: CodeEventPayload = {
      filePath,
      fileName,
      language,
      executionResult,
      executionError
    };

    return {
      id: this.generateId(),
      type: AgentEventType.CODE_EXECUTION_COMPLETED,
      source,
      timestamp: Date.now(),
      correlationId: this.generateCorrelationId(),
      version: 1,
      payload
    };
  }

  // Utility method to create custom events
  public static createCustomEvent(
    type: AgentEventType,
    payload: any,
    source: string,
    target?: string,
    correlationId?: string
  ): AgentEvent {
    return {
      id: this.generateId(),
      type,
      source,
      target,
      timestamp: Date.now(),
      correlationId: correlationId || this.generateCorrelationId(),
      version: 1,
      payload
    };
  }
}
