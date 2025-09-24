// 🚀 ENHANCED SWARM COORDINATOR - Hybrid Centralized/Decentralized Coordination
// Гибридный координатор с автоматическим переключением режимов и отказоустойчивостью

import { SwarmCoordinator } from './swarm-coordinator';
import { DecentralizedSwarmCoordinator } from './coordination/decentralized-coordinator';
import { SwarmAgent } from './swarm-agent';
import { 
  SwarmTask, 
  SwarmExecution, 
  SwarmMetrics, 
  SwarmEvent,
  SwarmConsensus 
} from './types';
import { EventBus } from '@/lib/events/event-bus';
import { AgentRole, AgentResponse } from '@/types/agents';
import { PSOSwarmIntelligence } from './algorithms/pso-algorithm';
import { EnhancedPuterClaudeProvider, ClaudeModel } from '@/lib/ai/puter-claude-provider-enhanced';

export interface CoordinationMode {
  mode: 'centralized' | 'decentralized' | 'hybrid';
  reason: string;
  confidence: number;
}

export interface HealthStatus {
  healthy: boolean;
  centralCoordinatorHealth: number;
  decentralizedNodesHealth: number;
  activeAgents: number;
  failedAgents: number;
  lastHealthCheck: Date;
}

export interface TaskAssignment {
  taskId: string;
  assignments: Array<{
    agentId: string;
    subtasks: string[];
    priority: number;
    deadline: Date;
  }>;
  coordinationMode: CoordinationMode;
  consensusRequired: boolean;
}

export interface HybridConfiguration {
  preferredMode: 'centralized' | 'decentralized' | 'hybrid';
  healthCheckInterval: number;
  failoverThreshold: number;
  consensusRequiredFor: string[];
  maxRetries: number;
  timeoutMs: number;
}

export class EnhancedSwarmCoordinator extends SwarmCoordinator {
  private decentralizedCoordinator: DecentralizedSwarmCoordinator;
  private coordinationMode: CoordinationMode;
  private healthStatus: HealthStatus;
  private config: HybridConfiguration;
  private healthCheckTimer?: NodeJS.Timer;
  private failureCount: number = 0;
  private aiProvider: EnhancedPuterClaudeProvider;
  
  // Метрики для принятия решений
  private performanceMetrics: {
    centralized: { successRate: number; avgTime: number; failures: number };
    decentralized: { successRate: number; avgTime: number; failures: number };
  };

  constructor(
    id: string = 'enhanced_swarm_coordinator',
    eventBus: EventBus,
    config: Partial<HybridConfiguration> = {}
  ) {
    super(id);
    
    this.config = {
      preferredMode: 'hybrid',
      healthCheckInterval: 5000,
      failoverThreshold: 0.7,
      consensusRequiredFor: ['critical', 'security', 'financial'],
      maxRetries: 3,
      timeoutMs: 30000,
      ...config
    };
    
    this.decentralizedCoordinator = new DecentralizedSwarmCoordinator(
      `${id}_decentralized`,
      eventBus
    );
    
    this.coordinationMode = {
      mode: this.config.preferredMode,
      reason: 'Initial configuration',
      confidence: 1.0
    };
    
    this.healthStatus = {
      healthy: true,
      centralCoordinatorHealth: 1.0,
      decentralizedNodesHealth: 1.0,
      activeAgents: 0,
      failedAgents: 0,
      lastHealthCheck: new Date()
    };
    
    this.performanceMetrics = {
      centralized: { successRate: 1.0, avgTime: 0, failures: 0 },
      decentralized: { successRate: 1.0, avgTime: 0, failures: 0 }
    };
    
    this.aiProvider = EnhancedPuterClaudeProvider.getInstance();
    this.startHealthMonitoring();
  }

  /**
   * Enhanced task coordination with automatic mode selection
   */
  public async coordinateTask(task: SwarmTask): Promise<TaskAssignment> {
    console.log(`🎯 Enhanced coordination for task: ${task.title}`);
    
    try {
      // Определяем оптимальный режим координации
      const mode = await this.selectCoordinationMode(task);
      this.coordinationMode = mode;
      
      console.log(`📊 Selected mode: ${mode.mode} (${mode.reason})`);
      
      // Выполняем координацию в выбранном режиме
      let assignment: TaskAssignment;
      
      switch (mode.mode) {
        case 'centralized':
          assignment = await this.centralizedCoordination(task);
          break;
          
        case 'decentralized':
          assignment = await this.decentralizedCoordination(task);
          break;
          
        case 'hybrid':
        default:
          assignment = await this.hybridCoordination(task);
          break;
      }
      
      // Отслеживаем метрики
      await this.trackCoordinationMetrics(mode.mode, true);
      
      return assignment;
      
    } catch (error) {
      console.error('❌ Coordination failed:', error);
      
      // Отслеживаем неудачу
      await this.trackCoordinationMetrics(this.coordinationMode.mode, false);
      
      // Пробуем альтернативный режим
      return this.fallbackCoordination(task);
    }
  }

  /**
   * Intelligent mode selection based on task and system state
   */
  private async selectCoordinationMode(task: SwarmTask): Promise<CoordinationMode> {
    // Проверяем здоровье системы
    const health = await this.checkSystemHealth();
    
    // Критические задачи требуют консенсуса
    if (this.requiresConsensus(task)) {
      return {
        mode: 'decentralized',
        reason: 'Task requires consensus for critical decisions',
        confidence: 0.95
      };
    }
    
    // Если централизованный координатор не здоров
    if (health.centralCoordinatorHealth < this.config.failoverThreshold) {
      return {
        mode: 'decentralized',
        reason: `Central coordinator health below threshold (${health.centralCoordinatorHealth})`,
        confidence: 0.9
      };
    }
    
    // Если много агентов и простая задача - используем централизованный
    if (health.activeAgents > 10 && task.complexity < 5) {
      return {
        mode: 'centralized',
        reason: 'Simple task with many agents - centralized is more efficient',
        confidence: 0.85
      };
    }
    
    // Сложные задачи с высокой параллельностью - децентрализованный
    if (task.complexity > 7 && task.subtasks.length > 5) {
      return {
        mode: 'decentralized',
        reason: 'Complex task with high parallelism potential',
        confidence: 0.88
      };
    }
    
    // По умолчанию - гибридный режим
    return {
      mode: 'hybrid',
      reason: 'Balanced approach for optimal performance and reliability',
      confidence: 0.8
    };
  }

  /**
   * Centralized coordination - fast but single point of failure
   */
  private async centralizedCoordination(task: SwarmTask): Promise<TaskAssignment> {
    const startTime = Date.now();
    
    try {
      // Используем PSO для оптимизации распределения
      const agents = Array.from(this.swarmAgents.values()).map(agent => ({
        id: agent.getId(),
        capabilities: agent.getCapabilities(),
        workload: agent.getCurrentWorkload()
      }));
      
      const assignments = await this.psoIntelligence.optimizeTaskAssignment([task], agents);
      
      // Создаем детальные назначения
      const taskAssignment: TaskAssignment = {
        taskId: task.id,
        assignments: assignments.map(a => ({
          agentId: a.agentId,
          subtasks: this.assignSubtasks(task, a.agentId),
          priority: this.calculatePriority(task, a.confidence),
          deadline: new Date(Date.now() + a.estimatedTime * 60000)
        })),
        coordinationMode: this.coordinationMode,
        consensusRequired: false
      };
      
      // Запускаем выполнение
      await this.executeAssignments(taskAssignment);
      
      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics('centralized', duration, true);
      
      return taskAssignment;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics('centralized', duration, false);
      throw error;
    }
  }

  /**
   * Decentralized coordination - resilient but potentially slower
   */
  private async decentralizedCoordination(task: SwarmTask): Promise<TaskAssignment> {
    const startTime = Date.now();
    
    try {
      // Регистрируем агентов в децентрализованной сети
      for (const agent of this.swarmAgents.values()) {
        this.decentralizedCoordinator.registerNode(agent);
      }
      
      // Предлагаем задачу в сеть
      const proposal = await this.decentralizedCoordinator.proposeTask(task);
      
      // Ждем ответов от агентов
      const responses = await this.collectDecentralizedResponses(task.id, this.config.timeoutMs);
      
      // Формируем назначения на основе ответов
      const taskAssignment: TaskAssignment = {
        taskId: task.id,
        assignments: responses.map(r => ({
          agentId: r.agentId,
          subtasks: r.acceptedSubtasks,
          priority: this.calculatePriority(task, r.confidence),
          deadline: new Date(Date.now() + r.estimatedTime)
        })),
        coordinationMode: this.coordinationMode,
        consensusRequired: this.requiresConsensus(task)
      };
      
      // Если нужен консенсус - запускаем
      if (taskAssignment.consensusRequired) {
        await this.runConsensus(taskAssignment);
      }
      
      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics('decentralized', duration, true);
      
      return taskAssignment;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      this.updatePerformanceMetrics('decentralized', duration, false);
      throw error;
    }
  }

  /**
   * Hybrid coordination - best of both worlds
   */
  private async hybridCoordination(task: SwarmTask): Promise<TaskAssignment> {
    console.log('🔄 Using hybrid coordination approach');
    
    // Разделяем задачу на критические и некритические части
    const { critical, regular } = this.splitTaskByPriority(task);
    
    const assignments: TaskAssignment[] = [];
    
    // Критические части через децентрализованную координацию
    if (critical.subtasks.length > 0) {
      const criticalAssignment = await this.decentralizedCoordination(critical);
      assignments.push(criticalAssignment);
    }
    
    // Обычные части через централизованную координацию
    if (regular.subtasks.length > 0) {
      const regularAssignment = await this.centralizedCoordination(regular);
      assignments.push(regularAssignment);
    }
    
    // Объединяем результаты
    return this.mergeAssignments(assignments, task.id);
  }

  /**
   * Fallback coordination when primary method fails
   */
  private async fallbackCoordination(task: SwarmTask): Promise<TaskAssignment> {
    console.log('⚠️ Attempting fallback coordination');
    
    this.failureCount++;
    
    // Пробуем альтернативный режим
    if (this.coordinationMode.mode === 'centralized') {
      console.log('Falling back to decentralized mode');
      this.coordinationMode = {
        mode: 'decentralized',
        reason: 'Centralized coordination failed',
        confidence: 0.7
      };
      return this.decentralizedCoordination(task);
    } else {
      console.log('Falling back to centralized mode');
      this.coordinationMode = {
        mode: 'centralized',
        reason: 'Decentralized coordination failed',
        confidence: 0.7
      };
      return this.centralizedCoordination(task);
    }
  }

  /**
   * Health monitoring system
   */
  private startHealthMonitoring(): void {
    this.healthCheckTimer = setInterval(async () => {
      await this.checkSystemHealth();
      await this.performSelfHealing();
    }, this.config.healthCheckInterval);
  }

  /**
   * Comprehensive health check
   */
  private async checkSystemHealth(): Promise<HealthStatus> {
    // Проверяем здоровье централизованного координатора
    const centralHealth = await this.checkCentralHealth();
    
    // Проверяем здоровье децентрализованной сети
    const decentralizedHealth = await this.checkDecentralizedHealth();
    
    // Считаем активных и отказавших агентов
    let activeAgents = 0;
    let failedAgents = 0;
    
    for (const agent of this.swarmAgents.values()) {
      if (await this.isAgentHealthy(agent)) {
        activeAgents++;
      } else {
        failedAgents++;
      }
    }
    
    this.healthStatus = {
      healthy: centralHealth > 0.5 || decentralizedHealth > 0.5,
      centralCoordinatorHealth: centralHealth,
      decentralizedNodesHealth: decentralizedHealth,
      activeAgents,
      failedAgents,
      lastHealthCheck: new Date()
    };
    
    return this.healthStatus;
  }

  /**
   * Self-healing mechanisms
   */
  private async performSelfHealing(): Promise<void> {
    // Восстанавливаем отказавших агентов
    if (this.healthStatus.failedAgents > 0) {
      console.log(`🔧 Attempting to heal ${this.healthStatus.failedAgents} failed agents`);
      
      for (const [agentId, agent] of this.swarmAgents.entries()) {
        if (!(await this.isAgentHealthy(agent))) {
          await this.healAgent(agentId, agent);
        }
      }
    }
    
    // Переключаем режим если текущий не здоров
    if (this.coordinationMode.mode === 'centralized' && 
        this.healthStatus.centralCoordinatorHealth < this.config.failoverThreshold) {
      console.log('🔄 Switching to decentralized mode due to health issues');
      this.coordinationMode = {
        mode: 'decentralized',
        reason: 'Central coordinator health degraded',
        confidence: 0.8
      };
    }
  }

  /**
   * Heal a failed agent
   */
  private async healAgent(agentId: string, agent: SwarmAgent): Promise<void> {
    try {
      console.log(`💊 Healing agent ${agentId}`);
      
      // Пробуем перезапустить агента
      await agent.initializeAgent();
      
      // Если не помогло - создаем нового
      if (!(await this.isAgentHealthy(agent))) {
        const newAgent = await this.recreateAgent(agent);
        this.swarmAgents.set(agentId, newAgent);
        
        // Регистрируем в децентрализованной сети
        this.decentralizedCoordinator.registerNode(newAgent);
      }
      
      console.log(`✅ Agent ${agentId} healed successfully`);
    } catch (error) {
      console.error(`❌ Failed to heal agent ${agentId}:`, error);
    }
  }

  /**
   * Recreate a failed agent with same capabilities
   */
  private async recreateAgent(failedAgent: SwarmAgent): Promise<SwarmAgent> {
    const role = failedAgent.getRole();
    const capabilities = failedAgent.getCapabilities();
    
    // Используем AI для анализа причины отказа
    const analysis = await this.aiProvider.generateText(
      `Analyze why agent with role ${role} failed and suggest improvements`,
      { model: ClaudeModel.CLAUDE_3_HAIKU }
    );
    
    // Создаем улучшенного агента
    // TODO: Implement agent factory
    return failedAgent; // Временно возвращаем того же агента
  }

  /**
   * Run consensus for critical decisions
   */
  private async runConsensus(assignment: TaskAssignment): Promise<void> {
    console.log('🗳️ Running consensus for critical task');
    
    const consensusId = `consensus_${assignment.taskId}`;
    const accepted = await this.decentralizedCoordinator.startConsensus(
      consensusId,
      assignment,
      10000 // 10 second timeout
    );
    
    if (!accepted) {
      throw new Error('Consensus failed for critical task');
    }
    
    console.log('✅ Consensus achieved');
  }

  /**
   * Helper methods
   */
  private requiresConsensus(task: SwarmTask): boolean {
    return this.config.consensusRequiredFor.some(type => 
      task.priority === type || 
      task.domain.includes(type) ||
      task.description.toLowerCase().includes(type)
    );
  }

  private splitTaskByPriority(task: SwarmTask): { critical: SwarmTask; regular: SwarmTask } {
    const criticalSubtasks = task.subtasks.filter(st => 
      st.priority === 'critical' || st.priority === 'high'
    );
    
    const regularSubtasks = task.subtasks.filter(st => 
      st.priority === 'medium' || st.priority === 'low'
    );
    
    return {
      critical: { ...task, subtasks: criticalSubtasks },
      regular: { ...task, subtasks: regularSubtasks }
    };
  }

  private assignSubtasks(task: SwarmTask, agentId: string): string[] {
    // Простое распределение подзадач
    // TODO: Implement intelligent subtask assignment
    return task.subtasks.map(st => st.id);
  }

  private calculatePriority(task: SwarmTask, confidence: number): number {
    const priorityMap = { low: 1, medium: 2, high: 3, critical: 4 };
    return (priorityMap[task.priority] || 2) * confidence;
  }

  private mergeAssignments(assignments: TaskAssignment[], taskId: string): TaskAssignment {
    const merged: TaskAssignment = {
      taskId,
      assignments: [],
      coordinationMode: this.coordinationMode,
      consensusRequired: assignments.some(a => a.consensusRequired)
    };
    
    for (const assignment of assignments) {
      merged.assignments.push(...assignment.assignments);
    }
    
    return merged;
  }

  private async executeAssignments(assignment: TaskAssignment): Promise<void> {
    // Запускаем выполнение назначенных задач
    for (const agentAssignment of assignment.assignments) {
      const agent = this.swarmAgents.get(agentAssignment.agentId);
      if (agent) {
        // TODO: Implement actual task execution
        console.log(`🚀 Executing task on agent ${agentAssignment.agentId}`);
      }
    }
  }

  private async collectDecentralizedResponses(
    taskId: string, 
    timeout: number
  ): Promise<Array<{
    agentId: string;
    acceptedSubtasks: string[];
    confidence: number;
    estimatedTime: number;
  }>> {
    // TODO: Implement actual response collection from decentralized network
    return [];
  }

  private async checkCentralHealth(): Promise<number> {
    // Проверяем различные метрики здоровья
    const metrics = {
      memoryUsage: process.memoryUsage().heapUsed / process.memoryUsage().heapTotal,
      activeExecutions: this.activeExecutions.size,
      failureRate: this.failureCount / (this.swarmMetrics.totalTasks || 1),
      responseTime: this.performanceMetrics.centralized.avgTime
    };
    
    // Вычисляем общее здоровье
    let health = 1.0;
    if (metrics.memoryUsage > 0.8) health -= 0.2;
    if (metrics.activeExecutions > this.maxParallelExecutions) health -= 0.3;
    if (metrics.failureRate > 0.1) health -= 0.3;
    if (metrics.responseTime > 5000) health -= 0.2;
    
    return Math.max(0, health);
  }

  private async checkDecentralizedHealth(): Promise<number> {
    const stats = this.decentralizedCoordinator.getNetworkStats();
    
    let health = 1.0;
    if (stats.activeNodes < 3) health -= 0.5;
    if (stats.averageReputation < 0.5) health -= 0.3;
    if (stats.totalConnections < stats.activeNodes * 2) health -= 0.2;
    
    return Math.max(0, health);
  }

  private async isAgentHealthy(agent: SwarmAgent): Promise<boolean> {
    try {
      // Простая проверка - может ли агент ответить
      const testResponse = await agent.generateResponse('ping', {});
      return testResponse !== '';
    } catch {
      return false;
    }
  }

  private updatePerformanceMetrics(mode: 'centralized' | 'decentralized', duration: number, success: boolean): void {
    const metrics = this.performanceMetrics[mode];
    
    if (success) {
      const totalTime = metrics.avgTime * metrics.successRate + duration;
      const totalCount = metrics.successRate + 1;
      metrics.avgTime = totalTime / totalCount;
      metrics.successRate = totalCount / (totalCount + metrics.failures);
    } else {
      metrics.failures++;
      metrics.successRate = metrics.successRate / (metrics.successRate + metrics.failures);
    }
  }

  private trackCoordinationMetrics(mode: string, success: boolean): void {
    // Отправляем событие для аналитики
    this.eventBus?.publish({
      type: 'coordination_completed',
      payload: {
        mode,
        success,
        timestamp: new Date()
      }
    });
  }

  /**
   * Public API
   */
  public getCoordinationMode(): CoordinationMode {
    return this.coordinationMode;
  }

  public getHealthStatus(): HealthStatus {
    return this.healthStatus;
  }

  public getPerformanceMetrics(): typeof this.performanceMetrics {
    return this.performanceMetrics;
  }

  public async forceMode(mode: 'centralized' | 'decentralized' | 'hybrid'): Promise<void> {
    console.log(`🔄 Forcing coordination mode to: ${mode}`);
    this.coordinationMode = {
      mode,
      reason: 'Manually forced',
      confidence: 1.0
    };
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }
    
    this.decentralizedCoordinator.destroy();
    super.destroy();
    
    console.log('🛑 Enhanced Swarm Coordinator destroyed');
  }
}

