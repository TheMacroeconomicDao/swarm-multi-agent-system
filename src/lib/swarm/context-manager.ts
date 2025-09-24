// 🧠 CONTEXT MANAGER - Advanced Context Management and State Coordination
// Intelligent context management for swarm-based multi-agent systems

import { AgentContext, AgentMessage, AgentResponse, Task } from '@/types/agents';

export interface ContextData {
  id: string;
  type: 'session' | 'task' | 'agent' | 'project' | 'user';
  data: Record<string, any>;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    source: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    tags: string[];
    dependencies: string[];
  };
  access: {
    read: string[];
    write: string[];
    admin: string[];
  };
  lifecycle: {
    ttl?: number; // time to live in seconds
    maxSize?: number; // max size in bytes
    compression?: boolean;
    encryption?: boolean;
  };
}

export interface ContextQuery {
  id?: string;
  type?: string;
  tags?: string[];
  source?: string;
  priority?: string;
  timeRange?: {
    from: Date;
    to: Date;
  };
  size?: {
    min: number;
    max: number;
  };
  limit?: number;
  offset?: number;
}

export interface ContextMetrics {
  totalContexts: number;
  contextsByType: Record<string, number>;
  contextsByPriority: Record<string, number>;
  averageSize: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  compressionRatio: number;
  encryptionRatio: number;
  lastCleanup: Date;
  nextCleanup: Date;
}

export interface IContextManager {
  storeContext(context: Omit<ContextData, 'metadata'> & { metadata?: Partial<ContextData['metadata']> }): Promise<string>;
  getContext(id: string): Promise<ContextData | null>;
  updateContext(id: string, updates: Partial<ContextData>): Promise<boolean>;
  deleteContext(id: string): Promise<boolean>;
  queryContexts(query: ContextQuery): Promise<ContextData[]>;
  getSessionContext(sessionId: string, key: string): any;
  setSessionContext(sessionId: string, key: string, value: any): void;
  getTaskContext(taskId: string, key: string): any;
  setTaskContext(taskId: string, key: string, value: any): void;
  getAgentContext(agentId: string, key: string): any;
  setAgentContext(agentId: string, key: string, value: any): void;
  cleanupExpiredContexts(): Promise<number>;
  getMetrics(): ContextMetrics;
  reset(): Promise<void>;
  extractSwarmContext(input: string, context: any): any;
  synthesizeResults(results: any[]): Promise<any>;
  destroy(): void;
}

export class ContextManager implements IContextManager {
  private contexts: Map<string, ContextData> = new Map();
  private sessionContexts: Map<string, Map<string, any>> = new Map();
  private taskContexts: Map<string, Map<string, any>> = new Map();
  private agentContexts: Map<string, Map<string, any>> = new Map();
  private metrics: ContextMetrics;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.metrics = {
      totalContexts: 0,
      contextsByType: {},
      contextsByPriority: {},
      averageSize: 0,
      totalSize: 0,
      hitRate: 0,
      missRate: 0,
      compressionRatio: 0,
      encryptionRatio: 0,
      lastCleanup: new Date(),
      nextCleanup: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    this.startCleanupScheduler();
  }

  /**
   * Store context data with intelligent management
   */
  async storeContext(context: Omit<ContextData, 'metadata'> & { 
    metadata?: Partial<ContextData['metadata']> 
  }): Promise<string> {
    const now = new Date();
    const contextData: ContextData = {
      ...context,
      metadata: {
        createdAt: now,
        updatedAt: now,
        version: 1,
        source: 'swarm-coordinator',
        priority: 'medium',
        tags: [],
        dependencies: [],
        ...context.metadata
      }
    };

    // Apply lifecycle policies
    if (contextData.lifecycle.ttl) {
      setTimeout(() => {
        this.deleteContext(context.id);
      }, contextData.lifecycle.ttl * 1000);
    }

    // Check size limits
    if (contextData.lifecycle.maxSize) {
      const size = this.calculateSize(contextData);
      if (size > contextData.lifecycle.maxSize) {
        throw new Error(`Context size ${size} exceeds maximum ${contextData.lifecycle.maxSize}`);
      }
    }

    // Apply compression if enabled
    if (contextData.lifecycle.compression) {
      contextData.data = await this.compressData(contextData.data);
    }

    // Apply encryption if enabled
    if (contextData.lifecycle.encryption) {
      contextData.data = await this.encryptData(contextData.data);
    }

    this.contexts.set(context.id, contextData);
    this.updateMetrics();
    
    return context.id;
  }

  /**
   * Retrieve context data with intelligent caching
   */
  async getContext(id: string): Promise<ContextData | null> {
    const context = this.contexts.get(id);
    if (!context) {
      this.metrics.missRate++;
      return null;
    }

    this.metrics.hitRate++;

    // Check if context has expired
    if (context.lifecycle.ttl) {
      const age = Date.now() - context.metadata.updatedAt.getTime();
      if (age > context.lifecycle.ttl * 1000) {
        this.deleteContext(id);
        return null;
      }
    }

    // Decompress if needed
    if (context.lifecycle.compression) {
      context.data = await this.decompressData(context.data);
    }

    // Decrypt if needed
    if (context.lifecycle.encryption) {
      context.data = await this.decryptData(context.data);
    }

    return context;
  }

  /**
   * Update existing context data
   */
  async updateContext(id: string, updates: Partial<ContextData>): Promise<boolean> {
    const existing = this.contexts.get(id);
    if (!existing) {
      return false;
    }

    const updated: ContextData = {
      ...existing,
      ...updates,
      metadata: {
        ...existing.metadata,
        ...updates.metadata,
        updatedAt: new Date(),
        version: existing.metadata.version + 1
      }
    };

    this.contexts.set(id, updated);
    this.updateMetrics();
    
    return true;
  }

  /**
   * Delete context data
   */
  async deleteContext(id: string): Promise<boolean> {
    const deleted = this.contexts.delete(id);
    if (deleted) {
      this.updateMetrics();
    }
    return deleted;
  }

  /**
   * Query contexts with advanced filtering
   */
  async queryContexts(query: ContextQuery): Promise<ContextData[]> {
    let results = Array.from(this.contexts.values());

    // Apply filters
    if (query.id) {
      results = results.filter(ctx => ctx.id === query.id);
    }

    if (query.type) {
      results = results.filter(ctx => ctx.type === query.type);
    }

    if (query.tags && query.tags.length > 0) {
      results = results.filter(ctx => 
        query.tags!.some(tag => ctx.metadata.tags.includes(tag))
      );
    }

    if (query.source) {
      results = results.filter(ctx => ctx.metadata.source === query.source);
    }

    if (query.priority) {
      results = results.filter(ctx => ctx.metadata.priority === query.priority);
    }

    if (query.timeRange) {
      results = results.filter(ctx => 
        ctx.metadata.createdAt >= query.timeRange!.from &&
        ctx.metadata.createdAt <= query.timeRange!.to
      );
    }

    if (query.size) {
      results = results.filter(ctx => {
        const size = this.calculateSize(ctx);
        return size >= query.size!.min && size <= query.size!.max;
      });
    }

    // Apply pagination
    if (query.offset) {
      results = results.slice(query.offset);
    }

    if (query.limit) {
      results = results.slice(0, query.limit);
    }

    return results;
  }

  /**
   * Get session-specific context
   */
  getSessionContext(sessionId: string, key: string): any {
    const session = this.sessionContexts.get(sessionId);
    return session?.get(key);
  }

  /**
   * Set session-specific context
   */
  setSessionContext(sessionId: string, key: string, value: any): void {
    if (!this.sessionContexts.has(sessionId)) {
      this.sessionContexts.set(sessionId, new Map());
    }
    this.sessionContexts.get(sessionId)!.set(key, value);
  }

  /**
   * Get task-specific context
   */
  getTaskContext(taskId: string, key: string): any {
    const task = this.taskContexts.get(taskId);
    return task?.get(key);
  }

  /**
   * Set task-specific context
   */
  setTaskContext(taskId: string, key: string, value: any): void {
    if (!this.taskContexts.has(taskId)) {
      this.taskContexts.set(taskId, new Map());
    }
    this.taskContexts.get(taskId)!.set(key, value);
  }

  /**
   * Get agent-specific context
   */
  getAgentContext(agentId: string, key: string): any {
    const agent = this.agentContexts.get(agentId);
    return agent?.get(key);
  }

  /**
   * Set agent-specific context
   */
  setAgentContext(agentId: string, key: string, value: any): void {
    if (!this.agentContexts.has(agentId)) {
      this.agentContexts.set(agentId, new Map());
    }
    this.agentContexts.get(agentId)!.set(key, value);
  }

  /**
   * Clear expired contexts
   */
  async cleanupExpiredContexts(): Promise<number> {
    let cleaned = 0;
    const now = Date.now();

    for (const [id, context] of this.contexts.entries()) {
      if (context.lifecycle.ttl) {
        const age = now - context.metadata.updatedAt.getTime();
        if (age > context.lifecycle.ttl * 1000) {
          this.contexts.delete(id);
          cleaned++;
        }
      }
    }

    this.metrics.lastCleanup = new Date();
    this.metrics.nextCleanup = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    return cleaned;
  }

  /**
   * Get context metrics
   */
  getMetrics(): ContextMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset all contexts (use with caution)
   */
  async reset(): Promise<void> {
    this.contexts.clear();
    this.sessionContexts.clear();
    this.taskContexts.clear();
    this.agentContexts.clear();
    this.updateMetrics();
  }

  // Private helper methods

  private calculateSize(context: ContextData): number {
    return JSON.stringify(context).length;
  }

  private async compressData(data: any): Promise<any> {
    // Simple compression simulation - in real implementation use actual compression
    return { compressed: true, data: JSON.stringify(data) };
  }

  private async decompressData(data: any): Promise<any> {
    // Simple decompression simulation
    if (data.compressed) {
      return JSON.parse(data.data);
    }
    return data;
  }

  private async encryptData(data: any): Promise<any> {
    // Simple encryption simulation - in real implementation use actual encryption
    return { encrypted: true, data: JSON.stringify(data) };
  }

  private async decryptData(data: any): Promise<any> {
    // Simple decryption simulation
    if (data.encrypted) {
      return JSON.parse(data.data);
    }
    return data;
  }

  private updateMetrics(): void {
    const contexts = Array.from(this.contexts.values());
    
    this.metrics.totalContexts = contexts.length;
    this.metrics.contextsByType = {};
    this.metrics.contextsByPriority = {};
    this.metrics.totalSize = 0;

    for (const context of contexts) {
      // Count by type
      this.metrics.contextsByType[context.type] = 
        (this.metrics.contextsByType[context.type] || 0) + 1;
      
      // Count by priority
      this.metrics.contextsByPriority[context.metadata.priority] = 
        (this.metrics.contextsByPriority[context.metadata.priority] || 0) + 1;
      
      // Calculate total size
      this.metrics.totalSize += this.calculateSize(context);
    }

    this.metrics.averageSize = this.metrics.totalContexts > 0 
      ? this.metrics.totalSize / this.metrics.totalContexts 
      : 0;

    // Calculate compression and encryption ratios
    const compressed = contexts.filter(c => c.lifecycle.compression).length;
    const encrypted = contexts.filter(c => c.lifecycle.encryption).length;
    
    this.metrics.compressionRatio = this.metrics.totalContexts > 0 
      ? (compressed / this.metrics.totalContexts) * 100 
      : 0;
    
    this.metrics.encryptionRatio = this.metrics.totalContexts > 0 
      ? (encrypted / this.metrics.totalContexts) * 100 
      : 0;
  }

  private startCleanupScheduler(): void {
    this.cleanupInterval = setInterval(async () => {
      await this.cleanupExpiredContexts();
    }, 60 * 60 * 1000); // Run every hour
  }

  /**
   * Extract swarm-specific context from input and general context
   */
  extractSwarmContext(input: string, context: any): any {
    const swarmContext = {
      input: input,
      timestamp: new Date(),
      sessionId: context?.sessionId || 'default',
      taskId: context?.taskId || null,
      agentId: context?.agentId || null,
      swarmState: {
        activeAgents: context?.activeAgents || [],
        completedTasks: context?.completedTasks || [],
        pendingTasks: context?.pendingTasks || [],
        swarmMetrics: context?.swarmMetrics || {}
      },
      extractedData: {
        keywords: this.extractKeywords(input),
        intent: this.detectIntent(input),
        complexity: this.assessComplexity(input),
        domain: this.identifyDomain(input),
        priority: this.determinePriority(input, context)
      },
      contextHistory: this.getRelevantHistory(context),
      swarmInsights: this.generateSwarmInsights(input, context)
    };

    return swarmContext;
  }

  /**
   * Synthesize multiple results into a coherent response
   */
  async synthesizeResults(results: any[]): Promise<any> {
    if (!results || results.length === 0) {
      return {
        synthesis: 'No results to synthesize',
        confidence: 0,
        recommendations: []
      };
    }

    const synthesis = {
      summary: this.createSummary(results),
      insights: this.extractInsights(results),
      conflicts: this.identifyConflicts(results),
      consensus: this.findConsensus(results),
      recommendations: this.generateRecommendations(results),
      confidence: this.calculateConfidence(results),
      metadata: {
        resultCount: results.length,
        synthesisTimestamp: new Date(),
        qualityScore: this.assessQuality(results)
      }
    };

    return synthesis;
  }

  // Private helper methods for swarm context extraction

  private extractKeywords(input: string): string[] {
    // Simple keyword extraction - in real implementation use NLP
    const words = input.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
    
    return [...new Set(words)].slice(0, 10);
  }

  private detectIntent(input: string): string {
    // Simple intent detection - in real implementation use ML
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('create') || lowerInput.includes('build')) return 'create';
    if (lowerInput.includes('fix') || lowerInput.includes('debug')) return 'fix';
    if (lowerInput.includes('optimize') || lowerInput.includes('improve')) return 'optimize';
    if (lowerInput.includes('analyze') || lowerInput.includes('review')) return 'analyze';
    if (lowerInput.includes('test') || lowerInput.includes('validate')) return 'test';
    
    return 'general';
  }

  private assessComplexity(input: string): number {
    // Simple complexity assessment - in real implementation use more sophisticated analysis
    const complexity = Math.min(10, Math.max(1, 
      (input.length / 100) + 
      (input.split(' ').length / 20) +
      (input.split('\n').length / 5)
    ));
    
    return Math.round(complexity);
  }

  private identifyDomain(input: string): string[] {
    // Simple domain identification - in real implementation use domain-specific analysis
    const domains = [];
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('react') || lowerInput.includes('component')) domains.push('frontend');
    if (lowerInput.includes('api') || lowerInput.includes('server')) domains.push('backend');
    if (lowerInput.includes('database') || lowerInput.includes('sql')) domains.push('database');
    if (lowerInput.includes('test') || lowerInput.includes('spec')) domains.push('testing');
    if (lowerInput.includes('deploy') || lowerInput.includes('ci/cd')) domains.push('devops');
    if (lowerInput.includes('ui') || lowerInput.includes('design')) domains.push('ui/ux');
    
    return domains.length > 0 ? domains : ['general'];
  }

  private determinePriority(input: string, context: any): 'low' | 'medium' | 'high' | 'critical' {
    // Simple priority determination
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('urgent') || lowerInput.includes('critical') || lowerInput.includes('asap')) {
      return 'critical';
    }
    
    if (lowerInput.includes('important') || lowerInput.includes('priority') || context?.priority === 'high') {
      return 'high';
    }
    
    if (lowerInput.includes('low') || context?.priority === 'low') {
      return 'low';
    }
    
    return 'medium';
  }

  private getRelevantHistory(context: any): any[] {
    // Get relevant context history
    if (!context?.history) return [];
    
    return context.history
      .filter((item: any) => item.timestamp > Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
      .slice(-10); // Last 10 items
  }

  private generateSwarmInsights(input: string, context: any): any {
    return {
      swarmReadiness: this.assessSwarmReadiness(context),
      optimalAgentCount: this.calculateOptimalAgentCount(input, context),
      estimatedDuration: this.estimateDuration(input, context),
      resourceRequirements: this.assessResourceRequirements(input, context),
      riskFactors: this.identifyRiskFactors(input, context)
    };
  }

  private assessSwarmReadiness(context: any): number {
    // Assess if swarm is ready for the task
    const activeAgents = context?.activeAgents?.length || 0;
    const availableResources = context?.availableResources || 0;
    
    return Math.min(100, (activeAgents * 20) + (availableResources * 10));
  }

  private calculateOptimalAgentCount(input: string, context: any): number {
    const complexity = this.assessComplexity(input);
    const domainCount = this.identifyDomain(input).length;
    
    return Math.min(10, Math.max(1, Math.ceil(complexity / 2) + domainCount));
  }

  private estimateDuration(input: string, context: any): number {
    const complexity = this.assessComplexity(input);
    const domainCount = this.identifyDomain(input).length;
    
    return Math.max(5, complexity * domainCount * 2); // minutes
  }

  private assessResourceRequirements(input: string, context: any): any {
    return {
      cpu: this.assessComplexity(input) * 10,
      memory: this.assessComplexity(input) * 50,
      network: this.identifyDomain(input).length * 5,
      storage: this.assessComplexity(input) * 20
    };
  }

  private identifyRiskFactors(input: string, context: any): string[] {
    const risks = [];
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('security') || lowerInput.includes('auth')) risks.push('security');
    if (lowerInput.includes('performance') || lowerInput.includes('optimize')) risks.push('performance');
    if (lowerInput.includes('database') || lowerInput.includes('data')) risks.push('data-integrity');
    if (lowerInput.includes('deploy') || lowerInput.includes('production')) risks.push('deployment');
    
    return risks;
  }

  // Private helper methods for result synthesis

  private createSummary(results: any[]): string {
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    return `${successCount}/${totalCount} operations completed successfully`;
  }

  private extractInsights(results: any[]): string[] {
    const insights = [];
    
    if (results.length > 1) {
      insights.push(`Multiple agents collaborated on this task`);
    }
    
    const avgQuality = results.reduce((sum, r) => sum + (r.quality || 0), 0) / results.length;
    if (avgQuality > 8) {
      insights.push(`High quality results achieved (${avgQuality.toFixed(1)}/10)`);
    }
    
    return insights;
  }

  private identifyConflicts(results: any[]): any[] {
    const conflicts = [];
    
    // Simple conflict detection - in real implementation use more sophisticated analysis
    for (let i = 0; i < results.length; i++) {
      for (let j = i + 1; j < results.length; j++) {
        if (results[i].output && results[j].output && 
            results[i].output !== results[j].output) {
          conflicts.push({
            type: 'output_conflict',
            agents: [results[i].agentId, results[j].agentId],
            description: 'Conflicting outputs detected'
          });
        }
      }
    }
    
    return conflicts;
  }

  private findConsensus(results: any[]): any {
    const consensus = {
      agreement: 0,
      commonElements: [],
      divergentElements: []
    };
    
    if (results.length === 1) {
      consensus.agreement = 100;
      consensus.commonElements = [results[0].output];
      return consensus;
    }
    
    // Simple consensus finding - in real implementation use more sophisticated analysis
    const outputs = results.map(r => r.output).filter(Boolean);
    const uniqueOutputs = [...new Set(outputs)];
    
    consensus.agreement = ((outputs.length - uniqueOutputs.length) / outputs.length) * 100;
    consensus.commonElements = uniqueOutputs;
    
    return consensus;
  }

  private generateRecommendations(results: any[]): string[] {
    const recommendations = [];
    
    const successRate = results.filter(r => r.success).length / results.length;
    
    if (successRate < 0.8) {
      recommendations.push('Consider increasing agent coordination for better success rate');
    }
    
    if (results.length > 5) {
      recommendations.push('Large swarm detected - consider task decomposition');
    }
    
    const avgTime = results.reduce((sum, r) => sum + (r.duration || 0), 0) / results.length;
    if (avgTime > 300) { // 5 minutes
      recommendations.push('Long execution time - consider optimization strategies');
    }
    
    return recommendations;
  }

  private calculateConfidence(results: any[]): number {
    if (results.length === 0) return 0;
    
    const successRate = results.filter(r => r.success).length / results.length;
    const avgQuality = results.reduce((sum, r) => sum + (r.quality || 0), 0) / results.length;
    const consensus = this.findConsensus(results);
    
    return Math.round((successRate * 40) + (avgQuality * 0.4) + (consensus.agreement * 0.2));
  }

  private assessQuality(results: any[]): number {
    if (results.length === 0) return 0;
    
    const avgQuality = results.reduce((sum, r) => sum + (r.quality || 0), 0) / results.length;
    const completeness = results.filter(r => r.complete).length / results.length;
    
    return Math.round((avgQuality * 0.7) + (completeness * 30));
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}