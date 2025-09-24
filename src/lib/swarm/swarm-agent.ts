// 🤖 SWARM AGENT SYSTEM - Advanced Multi-Agent Collaboration Framework
// Based on principles from Agentic Swarm Coding article

import { AgentRole, AgentContext, AgentMessage, AgentResponse, Task } from '@/types/agents';
import { BaseAgent } from '@/lib/agents/base-agent';
import { SwarmTask, SwarmAgentCapabilities, SwarmAgentMetrics } from './types';
import { EnhancedPuterClaudeProvider, ClaudeModel, TaskContext } from '@/lib/ai/puter-claude-provider-enhanced';

export abstract class SwarmAgent extends BaseAgent {
  protected capabilities: SwarmAgentCapabilities;
  protected metrics: SwarmAgentMetrics;
  protected swarmContext: Map<string, any>;
  protected aiProvider: EnhancedPuterClaudeProvider;
  protected preferredModel?: ClaudeModel;
  protected modelSelectionStrategy: 'adaptive' | 'fixed' = 'adaptive';

  constructor(
    id: string, 
    role: AgentRole, 
    capabilities: SwarmAgentCapabilities,
    initialContext: Partial<AgentContext> = {}
  ) {
    const extendedContext = {
      ...initialContext,
      swarmCapabilities: capabilities
    };
    
    super(id, role, extendedContext);
    
    this.capabilities = capabilities;
    this.swarmContext = new Map();
    
    this.metrics = {
      tasksCompleted: 0,
      successRate: 0,
      averageCompletionTime: 0,
      averageResponseTime: 0,
      collaborationRating: 0,
      collaborationScore: 0,
      qualityScore: 0,
      innovationScore: 0,
      costEfficiency: 0,
      specializationScore: {},
      lastActive: new Date(),
      currentWorkload: 0
    };
    this.aiProvider = EnhancedPuterClaudeProvider.getInstance();
    
    // Set preferred model based on agent role
    this.setPreferredModelByRole(role);
  }

  // Set preferred model based on agent role
  private setPreferredModelByRole(role: AgentRole): void {
    switch (role) {
      case AgentRole.ARCHITECT:
        this.preferredModel = ClaudeModel.CLAUDE_3_OPUS;
        break;
      case AgentRole.DEVELOPER:
        this.preferredModel = ClaudeModel.CLAUDE_35_SONNET;
        break;
      case AgentRole.ANALYST:
        this.preferredModel = ClaudeModel.CLAUDE_35_SONNET;
        break;
      case AgentRole.TESTER:
        this.preferredModel = ClaudeModel.CLAUDE_3_SONNET;
        break;
      case AgentRole.COORDINATOR:
        this.preferredModel = ClaudeModel.CLAUDE_35_SONNET;
        break;
      default:
        this.preferredModel = ClaudeModel.CLAUDE_3_HAIKU; // Fast model for simple tasks
    }
  }

  // Convert SwarmTask to TaskContext for model selection
  protected convertToTaskContext(task: SwarmTask): TaskContext {
    return {
      type: this.inferTaskType(task),
      complexity: this.mapComplexity(task.complexity),
      urgency: task.priority === 'critical' ? 'high' : task.priority === 'high' ? 'medium' : 'low',
      qualityRequirement: this.inferQualityRequirement(task),
      domain: task.domain,
      languages: this.capabilities.languages,
      frameworks: this.capabilities.frameworks
    };
  }

  private inferTaskType(task: SwarmTask): TaskContext['type'] {
    const description = task.description.toLowerCase();
    if (description.includes('architecture') || description.includes('design')) return 'architecture';
    if (description.includes('test') || description.includes('testing')) return 'testing';
    if (description.includes('analyze') || description.includes('analysis')) return 'analysis';
    if (description.includes('debug') || description.includes('fix')) return 'debugging';
    if (description.includes('document') || description.includes('documentation')) return 'documentation';
    if (description.includes('optimize') || description.includes('performance')) return 'optimization';
    if (description.includes('review') || description.includes('code review')) return 'review';
    if (description.includes('research') || description.includes('investigate')) return 'research';
    return 'code-generation';
  }

  private mapComplexity(complexity: number): TaskContext['complexity'] {
    if (complexity <= 3) return 'low';
    if (complexity <= 6) return 'medium';
    if (complexity <= 8) return 'high';
    return 'extreme';
  }

  private inferQualityRequirement(task: SwarmTask): TaskContext['qualityRequirement'] {
    const avgRequirement = (task.requirements.codeQuality + task.requirements.performance + 
                           task.requirements.security + task.requirements.maintainability) / 4;
    if (avgRequirement >= 9) return 'perfect';
    if (avgRequirement >= 7) return 'high';
    if (avgRequirement >= 5) return 'standard';
    return 'draft';
  }

  // Abstract methods for swarm functionality
  public abstract processSwarmTask(task: SwarmTask): Promise<AgentResponse>;
  public abstract validateSwarmOutput(output: any): Promise<boolean>;
  
  // Required abstract methods from BaseAgent
  protected abstract processTask(task: Task): Promise<AgentResponse>;
  protected abstract generateResponse(input: string, context: any): Promise<string>;
  
  protected initializeAgent(): void {
    // Base initialization - swarm agents will override this safely
    if (this.swarmContext) {
      console.log(`🐝 Swarm Agent ${this.id} initialized with role ${this.role}`);
    }
  }

  /**
   * Генерация reasoning/анализа через Claude Opus 4
   */
  protected async aiReasoning(prompt: string, system?: string): Promise<string> {
    return this.aiProvider.generateText(prompt, { system });
  }

  /**
   * Генерация кода через Claude Opus 4
   */
  protected async aiCodeGeneration(prompt: string, system?: string): Promise<string> {
    // Можно добавить system prompt для code generation
    return this.aiProvider.generateText(prompt, { system });
  }

  /**
   * Анализ кода/результата через Claude Opus 4
   */
  protected async aiAnalysis(prompt: string, system?: string): Promise<string> {
    return this.aiProvider.generateText(prompt, { system });
  }

  // Swarm-specific capabilities
  public async shareContext(targetAgentId: string, context: any): Promise<void> {
    this.swarmContext.set(`shared_with_${targetAgentId}`, {
      data: context,
      timestamp: new Date(),
      from: this.id
    });
  }

  public async getSharedContext(fromAgentId: string): Promise<any> {
    return this.swarmContext.get(`shared_with_${this.id}_from_${fromAgentId}`);
  }

  public getCapabilities(): SwarmAgentCapabilities {
    return { ...this.capabilities };
  }

  public getMetrics(): SwarmAgentMetrics {
    return { ...this.metrics };
  }

  public getTasksCompleted(): number {
    return this.metrics.tasksCompleted;
  }

  public getAverageCompletionTime(): number {
    return this.metrics.averageResponseTime;
  }

  public getSuccessRate(): number {
    return this.metrics.successRate;
  }

  public getCollaborationRating(): number {
    return this.metrics.collaborationScore;
  }

  public getLastActive(): Date {
    return new Date(); // Simplified for now
  }

  public getCurrentWorkload(): number {
    return Math.random() * 100; // Simplified for now
  }

  public updateMetrics(result: any): void {
    this.metrics.tasksCompleted++;
    if (result.success) {
      this.metrics.successRate = ((this.metrics.successRate * (this.metrics.tasksCompleted - 1)) + 1) / this.metrics.tasksCompleted;
    }
  }

  // Swarm coordination
  public canAcceptTask(task: SwarmTask): boolean {
    const requiredSkills = task.metadata?.requiredSkills || [];
    return requiredSkills.every((skill: string) => 
      this.capabilities.specializedSkills.includes(skill)
    );
  }

  public getHealthStatus(): any {
    return {
      id: this.id,
      role: this.role,
      metrics: this.metrics,
      contextSize: this.swarmContext.size
    };
  }
}

