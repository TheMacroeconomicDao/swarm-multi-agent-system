// 💰 COST OPTIMIZER - Advanced Cost Management and Optimization System
// Intelligent cost optimization for API usage and resource management

export interface CostMetrics {
  totalCost: number;
  costPerToken: number;
  tokensUsed: number;
  apiCalls: number;
  averageCostPerCall: number;
  costByModel: Record<string, number>;
  costByAgent: Record<string, number>;
  costByTask: Record<string, number>;
  dailyCost: number;
  monthlyCost: number;
  costEfficiency: number; // 0-100
}

export interface OptimizationStrategy {
  id: string;
  name: string;
  description: string;
  type: 'context_compression' | 'model_selection' | 'batch_processing' | 'caching' | 'fallback';
  priority: number;
  estimatedSavings: number; // percentage
  implementation: () => Promise<void>;
}

export interface ModelConfig {
  name: string;
  costPerToken: number;
  maxTokens: number;
  capabilities: string[];
  quality: number; // 0-100
  speed: number; // 0-100
  contextWindow: number;
}

export interface CostThresholds {
  daily: number;
  monthly: number;
  perTask: number;
  perAgent: number;
  warning: number; // percentage of limit
  critical: number; // percentage of limit
}

export class CostOptimizer {
  private costMetrics: CostMetrics;
  private optimizationStrategies: Map<string, OptimizationStrategy> = new Map();
  private modelConfigs: Map<string, ModelConfig> = new Map();
  private costThresholds: CostThresholds;
  private costHistory: Array<{ date: Date; cost: number; tokens: number }> = [];
  private cache: Map<string, { result: any; cost: number; timestamp: Date }> = new Map();
  private batchQueue: Array<{ task: any; resolve: Function; reject: Function }> = [];
  private batchTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.costMetrics = {
      totalCost: 0,
      costPerToken: 0.0001, // Default OpenAI pricing
      tokensUsed: 0,
      apiCalls: 0,
      averageCostPerCall: 0,
      costByModel: {},
      costByAgent: {},
      costByTask: {},
      dailyCost: 0,
      monthlyCost: 0,
      costEfficiency: 100
    };

    this.costThresholds = {
      daily: 50, // $50 per day
      monthly: 1000, // $1000 per month
      perTask: 5, // $5 per task
      perAgent: 10, // $10 per agent per day
      warning: 80, // 80% of limit
      critical: 95 // 95% of limit
    };

    this.initializeModelConfigs();
    this.initializeOptimizationStrategies();
    this.startCostMonitoring();
  }

  // 💰 Cost Tracking
  public trackCost(
    agentId: string,
    taskId: string,
    model: string,
    tokensUsed: number,
    cost: number
  ): void {
    // Update total metrics
    this.costMetrics.totalCost += cost;
    this.costMetrics.tokensUsed += tokensUsed;
    this.costMetrics.apiCalls++;
    this.costMetrics.averageCostPerCall = this.costMetrics.totalCost / this.costMetrics.apiCalls;

    // Update by model
    this.costMetrics.costByModel[model] = (this.costMetrics.costByModel[model] || 0) + cost;

    // Update by agent
    this.costMetrics.costByAgent[agentId] = (this.costMetrics.costByAgent[agentId] || 0) + cost;

    // Update by task
    this.costMetrics.costByTask[taskId] = (this.costMetrics.costByTask[taskId] || 0) + cost;

    // Update daily cost
    const today = new Date().toDateString();
    const todayCost = this.costHistory
      .filter(entry => entry.date.toDateString() === today)
      .reduce((sum, entry) => sum + entry.cost, 0);
    
    this.costMetrics.dailyCost = todayCost + cost;

    // Add to history
    this.costHistory.push({
      date: new Date(),
      cost,
      tokens: tokensUsed
    });

    // Check thresholds
    this.checkCostThresholds();

    // Update cost efficiency
    this.updateCostEfficiency();
  }

  public getCostMetrics(): CostMetrics {
    return { ...this.costMetrics };
  }

  public getCostByAgent(agentId: string): number {
    return this.costMetrics.costByAgent[agentId] || 0;
  }

  public getCostByTask(taskId: string): number {
    return this.costMetrics.costByTask[taskId] || 0;
  }

  // 🎯 Cost Optimization
  public async optimizeCost(
    task: any,
    agentId: string,
    estimatedTokens: number
  ): Promise<{
    optimizedModel: string;
    estimatedCost: number;
    optimizationStrategies: string[];
    savings: number;
  }> {
    const strategies = await this.selectOptimizationStrategies(task, estimatedTokens);
    const optimizedModel = await this.selectOptimalModel(task, estimatedTokens);
    const estimatedCost = this.calculateCost(optimizedModel, estimatedTokens);
    const originalCost = this.calculateCost('gpt-4', estimatedTokens);
    const savings = originalCost - estimatedCost;

    return {
      optimizedModel,
      estimatedCost,
      optimizationStrategies: strategies.map(s => s.name),
      savings
    };
  }

  public async estimateExecutionCost(agentAssignments: any[]): Promise<number> {
    let totalCost = 0;

    for (const assignment of agentAssignments) {
      const estimatedTokens = this.estimateTaskTokens(assignment.subtask);
      const optimalModel = await this.selectOptimalModel(assignment.subtask, estimatedTokens);
      const cost = this.calculateCost(optimalModel, estimatedTokens);
      totalCost += cost;
    }

    return totalCost;
  }

  public calculateAgentCost(agentId: string, duration: number): number {
    // Calculate cost based on agent type and duration
    const baseCostPerMinute = 0.01; // $0.01 per minute
    const agentMultiplier = this.getAgentCostMultiplier(agentId);
    return baseCostPerMinute * duration * agentMultiplier;
  }

  // 🧠 Model Selection
  public async selectOptimalModel(task: any, estimatedTokens: number): Promise<string> {
    const availableModels = Array.from(this.modelConfigs.values());
    
    // Filter models by capability
    const suitableModels = availableModels.filter(model => 
      this.isModelSuitableForTask(model, task)
    );

    if (suitableModels.length === 0) {
      return 'gpt-3.5-turbo'; // Fallback
    }

    // Score models based on cost, quality, and speed
    const scoredModels = suitableModels.map(model => ({
      model: model.name,
      score: this.calculateModelScore(model, task, estimatedTokens)
    }));

    // Select best model
    scoredModels.sort((a, b) => b.score - a.score);
    return scoredModels[0].model;
  }

  private calculateModelScore(model: ModelConfig, task: any, estimatedTokens: number): number {
    const costScore = this.calculateCostScore(model, estimatedTokens);
    const qualityScore = model.quality / 100;
    const speedScore = model.speed / 100;
    const capabilityScore = this.calculateCapabilityScore(model, task);

    // Weighted scoring
    return (
      costScore * 0.4 +
      qualityScore * 0.3 +
      speedScore * 0.2 +
      capabilityScore * 0.1
    );
  }

  private calculateCostScore(model: ModelConfig, estimatedTokens: number): number {
    const cost = this.calculateCost(model.name, estimatedTokens);
    const maxCost = this.calculateCost('gpt-4', estimatedTokens);
    return Math.max(0, 1 - (cost / maxCost));
  }

  private calculateCapabilityScore(model: ModelConfig, task: any): number {
    const taskRequirements = this.extractTaskRequirements(task);
    const matchingCapabilities = taskRequirements.filter(req => 
      model.capabilities.includes(req)
    ).length;
    
    return matchingCapabilities / taskRequirements.length;
  }

  // 🗜️ Context Optimization
  public async optimizeContext(context: string, maxTokens: number): Promise<string> {
    const currentTokens = this.estimateTokenCount(context);
    
    if (currentTokens <= maxTokens) {
      return context;
    }

    // Apply compression strategies
    let optimizedContext = context;
    
    // Strategy 1: Remove low-importance content
    optimizedContext = this.removeLowImportanceContent(optimizedContext, maxTokens * 0.8);
    
    // Strategy 2: Compress repetitive content
    optimizedContext = this.compressRepetitiveContent(optimizedContext);
    
    // Strategy 3: Summarize long sections
    optimizedContext = this.summarizeLongSections(optimizedContext, maxTokens * 0.9);
    
    // Strategy 4: Extract key information
    optimizedContext = this.extractKeyInformation(optimizedContext, maxTokens);

    return optimizedContext;
  }

  // 📦 Batch Processing
  public async batchProcess(tasks: any[]): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // Add tasks to batch queue
      tasks.forEach(task => {
        this.batchQueue.push({
          task,
          resolve: (result: any) => resolve([result]),
          reject
        });
      });

      // Process batch if queue is full or timer expires
      if (this.batchQueue.length >= 5 || !this.batchTimer) {
        this.processBatch();
      } else if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this.processBatch();
        }, 5000); // 5 second batch window
      }
    });
  }

  private async processBatch(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    const batch = [...this.batchQueue];
    this.batchQueue = [];
    
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }

    try {
      // Process batch together for cost efficiency
      const results = await this.executeBatch(batch.map(item => item.task));
      
      // Resolve all promises
      batch.forEach((item, index) => {
        item.resolve(results[index]);
      });
    } catch (error) {
      // Reject all promises
      batch.forEach(item => {
        item.reject(error);
      });
    }
  }

  // 💾 Caching
  public async getCachedResult(key: string): Promise<any | null> {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if cache is still valid (1 hour TTL)
    const now = new Date();
    const cacheAge = now.getTime() - cached.timestamp.getTime();
    const maxAge = 60 * 60 * 1000; // 1 hour
    
    if (cacheAge > maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    // Track cache hit cost savings
    this.trackCost('cache', 'cache_hit', 'cache', 0, -cached.cost);
    
    return cached.result;
  }

  public async setCachedResult(key: string, result: any, cost: number): Promise<void> {
    this.cache.set(key, {
      result,
      cost,
      timestamp: new Date()
    });
  }

  // 🚨 Cost Monitoring
  private startCostMonitoring(): void {
    setInterval(() => {
      this.monitorCosts();
      this.cleanupCache();
      this.optimizeStrategies();
    }, 60000); // Every minute
  }

  private monitorCosts(): void {
    // Check daily limits
    if (this.costMetrics.dailyCost > this.costThresholds.daily) {
      console.warn(`⚠️ Daily cost limit exceeded: $${this.costMetrics.dailyCost}`);
      this.triggerCostOptimization();
    }

    // Check per-agent limits
    Object.entries(this.costMetrics.costByAgent).forEach(([agentId, cost]) => {
      if (cost > this.costThresholds.perAgent) {
        console.warn(`⚠️ Agent ${agentId} cost limit exceeded: $${cost}`);
        this.throttleAgent(agentId);
      }
    });
  }

  private triggerCostOptimization(): void {
    // Implement aggressive cost optimization
    this.optimizationStrategies.forEach(strategy => {
      if (strategy.type === 'model_selection' || strategy.type === 'context_compression') {
        strategy.implementation();
      }
    });
  }

  private throttleAgent(agentId: string): void {
    // Implement agent throttling
    console.log(`🐌 Throttling agent ${agentId} due to cost limits`);
  }

  // 🛠️ Utility Methods
  private initializeModelConfigs(): void {
    this.modelConfigs.set('gpt-4', {
      name: 'gpt-4',
      costPerToken: 0.00003,
      maxTokens: 8192,
      capabilities: ['reasoning', 'analysis', 'complex_tasks', 'high_quality'],
      quality: 95,
      speed: 70,
      contextWindow: 8192
    });

    this.modelConfigs.set('gpt-4-turbo', {
      name: 'gpt-4-turbo',
      costPerToken: 0.00001,
      maxTokens: 128000,
      capabilities: ['reasoning', 'analysis', 'complex_tasks', 'high_quality', 'large_context'],
      quality: 95,
      speed: 85,
      contextWindow: 128000
    });

    this.modelConfigs.set('gpt-3.5-turbo', {
      name: 'gpt-3.5-turbo',
      costPerToken: 0.0000015,
      maxTokens: 4096,
      capabilities: ['simple_tasks', 'fast_response', 'cost_effective'],
      quality: 80,
      speed: 95,
      contextWindow: 4096
    });

    this.modelConfigs.set('claude-3-opus', {
      name: 'claude-3-opus',
      costPerToken: 0.000015,
      maxTokens: 200000,
      capabilities: ['reasoning', 'analysis', 'complex_tasks', 'very_large_context'],
      quality: 98,
      speed: 60,
      contextWindow: 200000
    });

    this.modelConfigs.set('claude-3-sonnet', {
      name: 'claude-3-sonnet',
      costPerToken: 0.000003,
      maxTokens: 200000,
      capabilities: ['reasoning', 'analysis', 'balanced', 'large_context'],
      quality: 90,
      speed: 80,
      contextWindow: 200000
    });
  }

  private initializeOptimizationStrategies(): void {
    this.optimizationStrategies.set('context_compression', {
      id: 'context_compression',
      name: 'Context Compression',
      description: 'Compress context to reduce token usage',
      type: 'context_compression',
      priority: 1,
      estimatedSavings: 30,
      implementation: async () => {
        console.log('🗜️ Applying context compression strategy');
      }
    });

    this.optimizationStrategies.set('model_selection', {
      id: 'model_selection',
      name: 'Smart Model Selection',
      description: 'Select optimal model based on task complexity',
      type: 'model_selection',
      priority: 2,
      estimatedSavings: 50,
      implementation: async () => {
        console.log('🎯 Applying smart model selection strategy');
      }
    });

    this.optimizationStrategies.set('batch_processing', {
      id: 'batch_processing',
      name: 'Batch Processing',
      description: 'Process multiple tasks together',
      type: 'batch_processing',
      priority: 3,
      estimatedSavings: 20,
      implementation: async () => {
        console.log('📦 Applying batch processing strategy');
      }
    });

    this.optimizationStrategies.set('caching', {
      id: 'caching',
      name: 'Intelligent Caching',
      description: 'Cache results to avoid redundant API calls',
      type: 'caching',
      priority: 4,
      estimatedSavings: 40,
      implementation: async () => {
        console.log('💾 Applying intelligent caching strategy');
      }
    });

    this.optimizationStrategies.set('fallback', {
      id: 'fallback',
      name: 'Fallback Models',
      description: 'Use cheaper models for simple tasks',
      type: 'fallback',
      priority: 5,
      estimatedSavings: 60,
      implementation: async () => {
        console.log('🔄 Applying fallback model strategy');
      }
    });
  }

  private async selectOptimizationStrategies(task: any, estimatedTokens: number): Promise<OptimizationStrategy[]> {
    const strategies: OptimizationStrategy[] = [];
    
    // Always apply context compression for large contexts
    if (estimatedTokens > 2000) {
      strategies.push(this.optimizationStrategies.get('context_compression')!);
    }
    
    // Apply model selection for cost optimization
    if (this.costMetrics.dailyCost > this.costThresholds.daily * 0.5) {
      strategies.push(this.optimizationStrategies.get('model_selection')!);
    }
    
    // Apply caching for repeated tasks
    if (this.isTaskRepeatable(task)) {
      strategies.push(this.optimizationStrategies.get('caching')!);
    }
    
    // Apply fallback for simple tasks
    if (this.isSimpleTask(task)) {
      strategies.push(this.optimizationStrategies.get('fallback')!);
    }
    
    return strategies.sort((a, b) => a.priority - b.priority);
  }

  private calculateCost(model: string, tokens: number): number {
    const modelConfig = this.modelConfigs.get(model);
    if (!modelConfig) return tokens * 0.0001; // Default cost
    
    return tokens * modelConfig.costPerToken;
  }

  private estimateTokenCount(text: string): number {
    // More accurate token estimation
    const words = text.split(/\s+/).length;
    const chars = text.length;
    
    // Average of word-based and character-based estimation
    const wordEstimate = words * 1.3; // ~1.3 tokens per word
    const charEstimate = chars / 4; // ~4 characters per token
    
    return Math.ceil((wordEstimate + charEstimate) / 2);
  }

  private estimateTaskTokens(task: any): number {
    // Estimate tokens based on task complexity and description
    const baseTokens = 100;
    const descriptionTokens = this.estimateTokenCount(task.description || '');
    const complexityMultiplier = task.complexity || 1;
    
    return Math.ceil(baseTokens + descriptionTokens * complexityMultiplier);
  }

  private isModelSuitableForTask(model: ModelConfig, task: any): boolean {
    const taskRequirements = this.extractTaskRequirements(task);
    
    // Check if model has required capabilities
    return taskRequirements.every(req => model.capabilities.includes(req));
  }

  private extractTaskRequirements(task: any): string[] {
    const requirements = [];
    
    if (task.complexity > 7) requirements.push('complex_tasks');
    if (task.complexity > 5) requirements.push('reasoning');
    if (task.description?.includes('analysis')) requirements.push('analysis');
    if (task.description?.includes('code')) requirements.push('code_generation');
    if (task.estimatedTokens > 4000) requirements.push('large_context');
    
    return requirements;
  }

  private isTaskRepeatable(task: any): boolean {
    // Check if task is likely to be repeated
    return task.title?.includes('template') || 
           task.title?.includes('boilerplate') ||
           task.description?.includes('standard');
  }

  private isSimpleTask(task: any): boolean {
    return (task.complexity || 1) <= 3 && 
           (task.description?.length || 0) < 200;
  }

  private getAgentCostMultiplier(agentId: string): number {
    // Different agents have different cost multipliers
    const multipliers: Record<string, number> = {
      'coordinator': 1.5,
      'architect': 2.0,
      'developer': 1.0,
      'analyst': 1.2,
      'reviewer': 1.3,
      'testing': 0.8
    };
    
    return multipliers[agentId] || 1.0;
  }

  private removeLowImportanceContent(context: string, maxTokens: number): string {
    // Remove low-importance content to fit within token limit
    const lines = context.split('\n');
    const importantLines = lines.filter(line => {
      const importance = this.calculateLineImportance(line);
      return importance > 0.3;
    });
    
    let result = importantLines.join('\n');
    while (this.estimateTokenCount(result) > maxTokens && importantLines.length > 0) {
      importantLines.pop();
      result = importantLines.join('\n');
    }
    
    return result;
  }

  private compressRepetitiveContent(context: string): string {
    // Compress repetitive content
    const lines = context.split('\n');
    const compressedLines: string[] = [];
    const seenLines = new Set<string>();
    
    lines.forEach(line => {
      const normalized = line.trim().toLowerCase();
      if (!seenLines.has(normalized) || this.estimateTokenCount(line) < 10) {
        compressedLines.push(line);
        seenLines.add(normalized);
      }
    });
    
    return compressedLines.join('\n');
  }

  private summarizeLongSections(context: string, maxTokens: number): string {
    // Summarize long sections
    const sections = context.split('\n\n');
    const summarizedSections = sections.map(section => {
      if (this.estimateTokenCount(section) > 500) {
        return this.summarizeText(section);
      }
      return section;
    });
    
    return summarizedSections.join('\n\n');
  }

  private extractKeyInformation(context: string, maxTokens: number): string {
    // Extract only key information
    const sentences = context.split(/[.!?]+/);
    const importantSentences = sentences.filter(sentence => {
      const importance = this.calculateSentenceImportance(sentence);
      return importance > 0.5;
    });
    
    let result = importantSentences.join('. ');
    while (this.estimateTokenCount(result) > maxTokens && importantSentences.length > 0) {
      importantSentences.pop();
      result = importantSentences.join('. ');
    }
    
    return result;
  }

  private calculateLineImportance(line: string): number {
    // Calculate importance of a line based on keywords and structure
    const importantKeywords = ['error', 'warning', 'important', 'critical', 'TODO', 'FIXME'];
    const lowImportanceKeywords = ['comment', 'log', 'debug', 'console'];
    
    const lowerLine = line.toLowerCase();
    
    let importance = 0.5; // Base importance
    
    importantKeywords.forEach(keyword => {
      if (lowerLine.includes(keyword)) importance += 0.3;
    });
    
    lowImportanceKeywords.forEach(keyword => {
      if (lowerLine.includes(keyword)) importance -= 0.2;
    });
    
    // Code lines are more important than comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
      importance -= 0.3;
    }
    
    return Math.max(0, Math.min(1, importance));
  }

  private calculateSentenceImportance(sentence: string): number {
    // Calculate importance of a sentence
    const importantWords = ['error', 'warning', 'important', 'critical', 'must', 'should', 'need'];
    const lowerSentence = sentence.toLowerCase();
    
    let importance = 0.3; // Base importance
    
    importantWords.forEach(word => {
      if (lowerSentence.includes(word)) importance += 0.2;
    });
    
    // Longer sentences are usually more important
    if (sentence.length > 50) importance += 0.1;
    
    return Math.max(0, Math.min(1, importance));
  }

  private summarizeText(text: string): string {
    // Simple text summarization
    const sentences = text.split(/[.!?]+/);
    const importantSentences = sentences
      .map(sentence => ({
        sentence,
        importance: this.calculateSentenceImportance(sentence)
      }))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3)
      .map(item => item.sentence);
    
    return importantSentences.join('. ') + '...';
  }

  private async executeBatch(tasks: any[]): Promise<any[]> {
    // Execute batch of tasks together
    // This would integrate with the actual AI API
    return tasks.map(task => ({
      taskId: task.id,
      result: `Batch processed: ${task.title}`,
      cost: 0.01 // Reduced cost for batch processing
    }));
  }

  private checkCostThresholds(): void {
    const dailyPercentage = (this.costMetrics.dailyCost / this.costThresholds.daily) * 100;
    
    if (dailyPercentage >= this.costThresholds.critical) {
      console.error(`🚨 CRITICAL: Daily cost limit at ${dailyPercentage.toFixed(1)}%`);
      this.triggerEmergencyOptimization();
    } else if (dailyPercentage >= this.costThresholds.warning) {
      console.warn(`⚠️ WARNING: Daily cost limit at ${dailyPercentage.toFixed(1)}%`);
    }
  }

  private triggerEmergencyOptimization(): void {
    // Implement emergency cost optimization
    console.log('🚨 Triggering emergency cost optimization');
    
    // Switch to cheapest models
    this.optimizationStrategies.get('fallback')?.implementation();
    
    // Enable aggressive caching
    this.optimizationStrategies.get('caching')?.implementation();
    
    // Compress all contexts
    this.optimizationStrategies.get('context_compression')?.implementation();
  }

  private updateCostEfficiency(): void {
    // Calculate cost efficiency based on results quality vs cost
    const totalTasks = Object.keys(this.costMetrics.costByTask).length;
    const averageCostPerTask = this.costMetrics.totalCost / Math.max(totalTasks, 1);
    
    // Efficiency decreases as cost per task increases
    this.costMetrics.costEfficiency = Math.max(0, 100 - (averageCostPerTask * 10));
  }

  private cleanupCache(): void {
    // Remove expired cache entries
    const now = new Date();
    const maxAge = 60 * 60 * 1000; // 1 hour
    
    for (const [key, cached] of this.cache.entries()) {
      const age = now.getTime() - cached.timestamp.getTime();
      if (age > maxAge) {
        this.cache.delete(key);
      }
    }
  }

  private optimizeStrategies(): void {
    // Dynamically optimize strategies based on performance
    const strategies = Array.from(this.optimizationStrategies.values());
    
    strategies.forEach(strategy => {
      // Adjust strategy priority based on effectiveness
      if (strategy.estimatedSavings > 40) {
        strategy.priority = Math.max(1, strategy.priority - 1);
      } else if (strategy.estimatedSavings < 20) {
        strategy.priority = Math.min(5, strategy.priority + 1);
      }
    });
  }

  // Public API
  public setCostThresholds(thresholds: Partial<CostThresholds>): void {
    this.costThresholds = { ...this.costThresholds, ...thresholds };
  }

  public getCostThresholds(): CostThresholds {
    return { ...this.costThresholds };
  }

  public getCostHistory(): Array<{ date: Date; cost: number; tokens: number }> {
    return [...this.costHistory];
  }

  public clearCostHistory(): void {
    this.costHistory = [];
    this.costMetrics = {
      totalCost: 0,
      costPerToken: 0.0001,
      tokensUsed: 0,
      apiCalls: 0,
      averageCostPerCall: 0,
      costByModel: {},
      costByAgent: {},
      costByTask: {},
      dailyCost: 0,
      monthlyCost: 0,
      costEfficiency: 100
    };
  }
}

