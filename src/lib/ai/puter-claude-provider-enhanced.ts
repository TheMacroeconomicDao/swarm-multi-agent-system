// 🟣 Enhanced Puter.js Multi-Model Claude AI Provider
// Адаптивный AI-провайдер с поддержкой всех моделей Claude для оптимизированных агентов

export enum ClaudeModel {
  // Claude 3.5 Series - Latest and most capable
  CLAUDE_35_SONNET = 'claude-3.5-sonnet',
  CLAUDE_35_HAIKU = 'claude-3.5-haiku', // Fast and efficient
  
  // Claude 3 Series - Balanced performance
  CLAUDE_3_OPUS = 'claude-3-opus',       // Most powerful
  CLAUDE_3_SONNET = 'claude-3-sonnet',   // Balanced
  CLAUDE_3_HAIKU = 'claude-3-haiku',     // Fast
  
  // Claude 2 Series - Legacy but stable
  CLAUDE_2_1 = 'claude-2.1',
  CLAUDE_2_0 = 'claude-2.0',
  
  // Claude Instant - Ultra-fast responses
  CLAUDE_INSTANT_1_2 = 'claude-instant-1.2',
  
  // Claude 4 Opus 
  CLAUDE_4_OPUS = 'claude-4-opus',
}

export interface ModelCapabilities {
  model: ClaudeModel;
  contextWindow: number;
  maxOutput: number;
  speed: 'ultra-fast' | 'fast' | 'medium' | 'slow';
  cost: 'low' | 'medium' | 'high' | 'premium';
  strengths: string[];
  bestFor: string[];
  temperature: { min: number; max: number; default: number };
}

export interface ClaudeProviderOptions {
  stream?: boolean;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  model?: ClaudeModel;
  retryAttempts?: number;
  timeout?: number;
  cacheEnabled?: boolean;
  adaptiveModelSelection?: boolean;
}

export interface TaskContext {
  type: 'code-generation' | 'analysis' | 'debugging' | 'documentation' | 'testing' | 
        'architecture' | 'review' | 'optimization' | 'research' | 'creative';
  complexity: 'low' | 'medium' | 'high' | 'extreme';
  urgency: 'low' | 'medium' | 'high';
  qualityRequirement: 'draft' | 'standard' | 'high' | 'perfect';
  domain?: string[];
  languages?: string[];
  frameworks?: string[];
}

export interface ModelSelectionResult {
  selectedModel: ClaudeModel;
  reasoning: string;
  confidence: number;
  alternativeModels: ClaudeModel[];
  estimatedCost: number;
  estimatedTime: number;
}

export class EnhancedPuterClaudeProvider {
  private static instance: EnhancedPuterClaudeProvider;
  private responseCache: Map<string, { response: string; timestamp: number }> = new Map();
  private modelUsageStats: Map<ClaudeModel, { count: number; totalTime: number; avgQuality: number }> = new Map();
  private readonly cacheTimeout = 300000; // 5 minutes
  
  // Model capabilities database
  private readonly modelCapabilities: Record<ClaudeModel, ModelCapabilities> = {
    [ClaudeModel.CLAUDE_35_SONNET]: {
      model: ClaudeModel.CLAUDE_35_SONNET,
      contextWindow: 200000,
      maxOutput: 4096,
      speed: 'medium',
      cost: 'high',
      strengths: ['complex reasoning', 'code generation', 'analysis', 'creative writing'],
      bestFor: ['architecture design', 'complex algorithms', 'system analysis', 'documentation'],
      temperature: { min: 0, max: 1, default: 0.3 }
    },
    [ClaudeModel.CLAUDE_35_HAIKU]: {
      model: ClaudeModel.CLAUDE_35_HAIKU,
      contextWindow: 200000,
      maxOutput: 4096,
      speed: 'fast',
      cost: 'medium',
      strengths: ['quick responses', 'simple tasks', 'data processing'],
      bestFor: ['code formatting', 'simple refactoring', 'data validation'],
      temperature: { min: 0, max: 1, default: 0.2 }
    },
    [ClaudeModel.CLAUDE_3_OPUS]: {
      model: ClaudeModel.CLAUDE_3_OPUS,
      contextWindow: 200000,
      maxOutput: 4096,
      speed: 'slow',
      cost: 'premium',
      strengths: ['deepest analysis', 'complex problem solving', 'research'],
      bestFor: ['algorithm design', 'security analysis', 'performance optimization'],
      temperature: { min: 0, max: 1, default: 0.4 }
    },
    [ClaudeModel.CLAUDE_3_SONNET]: {
      model: ClaudeModel.CLAUDE_3_SONNET,
      contextWindow: 200000,
      maxOutput: 4096,
      speed: 'medium',
      cost: 'medium',
      strengths: ['balanced performance', 'general tasks', 'code review'],
      bestFor: ['general development', 'bug fixing', 'code review'],
      temperature: { min: 0, max: 1, default: 0.3 }
    },
    [ClaudeModel.CLAUDE_3_HAIKU]: {
      model: ClaudeModel.CLAUDE_3_HAIKU,
      contextWindow: 200000,
      maxOutput: 4096,
      speed: 'ultra-fast',
      cost: 'low',
      strengths: ['speed', 'efficiency', 'simple tasks'],
      bestFor: ['syntax checking', 'formatting', 'simple queries'],
      temperature: { min: 0, max: 1, default: 0.1 }
    },
    [ClaudeModel.CLAUDE_INSTANT_1_2]: {
      model: ClaudeModel.CLAUDE_INSTANT_1_2,
      contextWindow: 100000,
      maxOutput: 4096,
      speed: 'ultra-fast',
      cost: 'low',
      strengths: ['instant responses', 'high throughput', 'basic tasks'],
      bestFor: ['autocompletion', 'syntax suggestions', 'quick fixes'],
      temperature: { min: 0, max: 1, default: 0.1 }
    },
    [ClaudeModel.CLAUDE_4_OPUS]: {
      model: ClaudeModel.CLAUDE_4_OPUS,
      contextWindow: 400000,
      maxOutput: 8192,
      speed: 'medium',
      cost: 'premium',
      strengths: ['next-gen capabilities', 'ultra-complex tasks', 'creative solutions'],
      bestFor: ['revolutionary architecture', 'AI system design', 'complex integrations'],
      temperature: { min: 0, max: 1, default: 0.5 }
    },
    [ClaudeModel.CLAUDE_2_1]: {
      model: ClaudeModel.CLAUDE_2_1,
      contextWindow: 100000,
      maxOutput: 4096,
      speed: 'medium',
      cost: 'medium',
      strengths: ['stable', 'proven', 'reliable'],
      bestFor: ['legacy support', 'standard tasks', 'documentation'],
      temperature: { min: 0, max: 1, default: 0.3 }
    },
    [ClaudeModel.CLAUDE_2_0]: {
      model: ClaudeModel.CLAUDE_2_0,
      contextWindow: 100000,
      maxOutput: 4096,
      speed: 'medium',
      cost: 'low',
      strengths: ['basic capabilities', 'cost-effective'],
      bestFor: ['simple queries', 'basic code generation'],
      temperature: { min: 0, max: 1, default: 0.3 }
    }
  };

  private constructor() {
    this.initializeModelStats();
  }

  public static getInstance(): EnhancedPuterClaudeProvider {
    if (!EnhancedPuterClaudeProvider.instance) {
      EnhancedPuterClaudeProvider.instance = new EnhancedPuterClaudeProvider();
    }
    return EnhancedPuterClaudeProvider.instance;
  }

  /**
   * Intelligent model selection based on task context
   */
  public selectOptimalModel(context: TaskContext): ModelSelectionResult {
    const candidates: Array<{ model: ClaudeModel; score: number; reasons: string[] }> = [];

    for (const [model, capabilities] of Object.entries(this.modelCapabilities)) {
      let score = 0;
      const reasons: string[] = [];

      // Score based on complexity match
      if (context.complexity === 'extreme' && capabilities.strengths.includes('complex problem solving')) {
        score += 30;
        reasons.push('Excellent for extreme complexity');
      } else if (context.complexity === 'high' && capabilities.speed !== 'ultra-fast') {
        score += 20;
        reasons.push('Good for high complexity');
      } else if (context.complexity === 'low' && capabilities.speed === 'ultra-fast') {
        score += 25;
        reasons.push('Perfect for simple tasks');
      }

      // Score based on task type
      if (capabilities.bestFor.some(task => context.type.includes(task))) {
        score += 25;
        reasons.push(`Optimized for ${context.type}`);
      }

      // Score based on urgency vs speed
      if (context.urgency === 'high' && (capabilities.speed === 'ultra-fast' || capabilities.speed === 'fast')) {
        score += 20;
        reasons.push('Fast response for urgent task');
      }

      // Score based on quality requirements vs capabilities
      if (context.qualityRequirement === 'perfect' && capabilities.cost === 'premium') {
        score += 15;
        reasons.push('Premium quality for perfect requirements');
      } else if (context.qualityRequirement === 'draft' && capabilities.cost === 'low') {
        score += 10;
        reasons.push('Cost-effective for draft quality');
      }

      // Domain-specific scoring
      if (context.domain && context.type === 'code-generation') {
        if (capabilities.strengths.includes('code generation')) {
          score += 15;
          reasons.push('Specialized in code generation');
        }
      }

      // Historical performance bonus
      const stats = this.modelUsageStats.get(model as ClaudeModel);
      if (stats && stats.avgQuality > 0.8) {
        score += 10;
        reasons.push(`High historical performance (${(stats.avgQuality * 100).toFixed(0)}%)`);
      }

      candidates.push({ model: model as ClaudeModel, score, reasons });
    }

    // Sort by score
    candidates.sort((a, b) => b.score - a.score);

    const selected = candidates[0];
    const alternatives = candidates.slice(1, 4).map(c => c.model);

    return {
      selectedModel: selected.model,
      reasoning: selected.reasons.join('; '),
      confidence: Math.min(selected.score / 100, 1),
      alternativeModels: alternatives,
      estimatedCost: this.estimateCost(selected.model, context),
      estimatedTime: this.estimateTime(selected.model, context)
    };
  }

  /**
   * Generate text with automatic model selection
   */
  public async generateText(
    prompt: string, 
    options: ClaudeProviderOptions = {},
    taskContext?: TaskContext
  ): Promise<string> {
    if (typeof window === 'undefined' || typeof (window as any).puter === 'undefined') {
      throw new Error('Puter.js is not loaded. Make sure <script src="https://js.puter.com/v2/"></script> is in your index.html');
    }

    // Select optimal model if not specified
    let selectedModel = options.model;
    if (!selectedModel && options.adaptiveModelSelection && taskContext) {
      const selection = this.selectOptimalModel(taskContext);
      selectedModel = selection.selectedModel;
      console.log(`🤖 Selected model: ${selectedModel} (${selection.reasoning})`);
    } else if (!selectedModel) {
      selectedModel = ClaudeModel.CLAUDE_35_SONNET; // Default
    }

    // Check cache if enabled
    if (options.cacheEnabled) {
      const cacheKey = this.generateCacheKey(prompt, selectedModel, options);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.log('📦 Returning cached response');
        return cached;
      }
    }

    const startTime = Date.now();
    const puter = (window as any).puter;
    
    try {
      // Prepare the request with model-specific optimizations
      const capabilities = this.modelCapabilities[selectedModel];
      const temperature = options.temperature ?? capabilities.temperature.default;
      
      const systemPrompt = this.buildSystemPrompt(options.system, selectedModel, taskContext);
      
      const response = await this.makeRequestWithRetry(
        async () => {
          return await puter.ai.chat(prompt, {
            model: selectedModel,
            system: systemPrompt,
            temperature,
            max_tokens: options.maxTokens ?? capabilities.maxOutput,
            top_p: options.topP,
            stop: options.stopSequences,
            stream: false
          });
        },
        options.retryAttempts ?? 3,
        options.timeout ?? 30000
      );

      // Extract text from response
      const text = this.extractTextFromResponse(response);
      
      // Update statistics
      const duration = Date.now() - startTime;
      this.updateModelStats(selectedModel, duration, this.evaluateResponseQuality(text, prompt));
      
      // Cache if enabled
      if (options.cacheEnabled) {
        const cacheKey = this.generateCacheKey(prompt, selectedModel, options);
        this.addToCache(cacheKey, text);
      }
      
      return text;
    } catch (error) {
      console.error(`❌ Error with model ${selectedModel}:`, error);
      
      // Try fallback model
      if (options.adaptiveModelSelection && taskContext) {
        const alternatives = this.selectOptimalModel(taskContext).alternativeModels;
        if (alternatives.length > 0) {
          console.log(`🔄 Trying fallback model: ${alternatives[0]}`);
          return this.generateText(prompt, { ...options, model: alternatives[0] }, taskContext);
        }
      }
      
      throw error;
    }
  }

  /**
   * Stream text generation with model selection
   */
  public async *generateTextStream(
    prompt: string,
    options: ClaudeProviderOptions = {},
    taskContext?: TaskContext
  ): AsyncGenerator<string> {
    if (typeof window === 'undefined' || typeof (window as any).puter === 'undefined') {
      throw new Error('Puter.js is not loaded');
    }

    // Select optimal model
    let selectedModel = options.model;
    if (!selectedModel && options.adaptiveModelSelection && taskContext) {
      const selection = this.selectOptimalModel(taskContext);
      selectedModel = selection.selectedModel;
    } else if (!selectedModel) {
      selectedModel = ClaudeModel.CLAUDE_35_SONNET;
    }

    const puter = (window as any).puter;
    const capabilities = this.modelCapabilities[selectedModel];
    const systemPrompt = this.buildSystemPrompt(options.system, selectedModel, taskContext);
    
    try {
      const response = await puter.ai.chat(prompt, {
        model: selectedModel,
        system: systemPrompt,
        temperature: options.temperature ?? capabilities.temperature.default,
        max_tokens: options.maxTokens ?? capabilities.maxOutput,
        stream: true
      });

      for await (const part of response) {
        if (part?.text) yield part.text;
      }
    } catch (error) {
      console.error(`❌ Stream error with model ${selectedModel}:`, error);
      throw error;
    }
  }

  /**
   * Specialized methods for different agent types
   */
  public async generateForArchitectAgent(prompt: string, context: any): Promise<string> {
    const taskContext: TaskContext = {
      type: 'architecture',
      complexity: 'high',
      urgency: 'medium',
      qualityRequirement: 'high',
      domain: context.domains
    };

    return this.generateText(prompt, {
      adaptiveModelSelection: true,
      cacheEnabled: true,
      temperature: 0.4
    }, taskContext);
  }

  public async generateForDeveloperAgent(prompt: string, context: any): Promise<string> {
    const taskContext: TaskContext = {
      type: 'code-generation',
      complexity: context.complexity || 'medium',
      urgency: 'medium',
      qualityRequirement: 'standard',
      languages: context.languages,
      frameworks: context.frameworks
    };

    return this.generateText(prompt, {
      adaptiveModelSelection: true,
      cacheEnabled: true,
      temperature: 0.2
    }, taskContext);
  }

  public async generateForTestingAgent(prompt: string, context: any): Promise<string> {
    const taskContext: TaskContext = {
      type: 'testing',
      complexity: 'medium',
      urgency: 'high',
      qualityRequirement: 'high'
    };

    return this.generateText(prompt, {
      adaptiveModelSelection: true,
      temperature: 0.1, // Low temperature for precise test generation
      maxTokens: 4000
    }, taskContext);
  }

  public async generateForReviewAgent(prompt: string, context: any): Promise<string> {
    const taskContext: TaskContext = {
      type: 'review',
      complexity: 'high',
      urgency: 'medium',
      qualityRequirement: 'perfect'
    };

    // Use most capable model for reviews
    return this.generateText(prompt, {
      model: ClaudeModel.CLAUDE_3_OPUS,
      temperature: 0.3,
      maxTokens: 6000
    }, taskContext);
  }

  /**
   * Utility methods
   */
  private buildSystemPrompt(base: string | undefined, model: ClaudeModel, context?: TaskContext): string {
    const capabilities = this.modelCapabilities[model];
    let prompt = base || '';

    // Add model-specific instructions
    if (capabilities.strengths.includes('code generation')) {
      prompt += '\nYou are an expert programmer with deep knowledge of software architecture and best practices.';
    }

    if (context) {
      if (context.type === 'architecture') {
        prompt += '\nFocus on scalability, maintainability, and following SOLID principles.';
      } else if (context.type === 'testing') {
        prompt += '\nEnsure comprehensive test coverage including edge cases and error scenarios.';
      } else if (context.type === 'optimization') {
        prompt += '\nPrioritize performance, efficiency, and resource utilization.';
      }
    }

    return prompt;
  }

  private async makeRequestWithRetry(
    requestFn: () => Promise<any>,
    maxRetries: number,
    timeout: number
  ): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), timeout);
        });

        const result = await Promise.race([requestFn(), timeoutPromise]);
        return result;
      } catch (error) {
        lastError = error as Error;
        console.warn(`Attempt ${attempt + 1} failed:`, error);
        
        if (attempt < maxRetries - 1) {
          await this.delay(Math.pow(2, attempt) * 1000); // Exponential backoff
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }

  private extractTextFromResponse(response: any): string {
    // Handle different response formats from Puter API
    if (typeof response === 'string') return response;
    if (response?.message?.content?.[0]?.text) return response.message.content[0].text;
    if (response?.text) return response.text;
    if (response?.content) return response.content;
    
    console.warn('Unexpected response format:', response);
    return JSON.stringify(response);
  }

  private generateCacheKey(prompt: string, model: ClaudeModel, options: ClaudeProviderOptions): string {
    const key = `${model}:${prompt}:${options.temperature}:${options.system}`;
    return this.hashString(key);
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  private getFromCache(key: string): string | null {
    const cached = this.responseCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.response;
    }
    this.responseCache.delete(key);
    return null;
  }

  private addToCache(key: string, response: string): void {
    this.responseCache.set(key, { response, timestamp: Date.now() });
    
    // Cleanup old cache entries
    if (this.responseCache.size > 100) {
      const entries = Array.from(this.responseCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      for (let i = 0; i < 20; i++) {
        this.responseCache.delete(entries[i][0]);
      }
    }
  }

  private initializeModelStats(): void {
    for (const model of Object.values(ClaudeModel)) {
      this.modelUsageStats.set(model, { count: 0, totalTime: 0, avgQuality: 0 });
    }
  }

  private updateModelStats(model: ClaudeModel, duration: number, quality: number): void {
    const stats = this.modelUsageStats.get(model)!;
    stats.count++;
    stats.totalTime += duration;
    stats.avgQuality = (stats.avgQuality * (stats.count - 1) + quality) / stats.count;
  }

  private evaluateResponseQuality(response: string, prompt: string): number {
    // Simple quality evaluation - can be enhanced with more sophisticated metrics
    let quality = 0.7; // Base quality

    // Check response length relative to prompt
    if (response.length > prompt.length * 0.5) quality += 0.1;
    
    // Check for code blocks if code-related
    if (prompt.toLowerCase().includes('code') && response.includes('```')) quality += 0.1;
    
    // Check for structured response
    if (response.includes('\n') && response.includes(':')) quality += 0.05;
    
    // Penalize very short responses
    if (response.length < 50) quality -= 0.2;
    
    // Penalize error messages
    if (response.toLowerCase().includes('error') || response.toLowerCase().includes('sorry')) quality -= 0.1;
    
    return Math.max(0, Math.min(1, quality));
  }

  private estimateCost(model: ClaudeModel, context: TaskContext): number {
    const baseCosts = {
      'low': 0.001,
      'medium': 0.01,
      'high': 0.05,
      'premium': 0.1
    };

    const capabilities = this.modelCapabilities[model];
    let cost = baseCosts[capabilities.cost];

    // Adjust based on complexity
    if (context.complexity === 'extreme') cost *= 2;
    else if (context.complexity === 'high') cost *= 1.5;
    
    return cost;
  }

  private estimateTime(model: ClaudeModel, context: TaskContext): number {
    const baseTime = {
      'ultra-fast': 500,
      'fast': 1000,
      'medium': 2000,
      'slow': 4000
    };

    const capabilities = this.modelCapabilities[model];
    let time = baseTime[capabilities.speed];

    // Adjust based on complexity
    if (context.complexity === 'extreme') time *= 3;
    else if (context.complexity === 'high') time *= 2;
    else if (context.complexity === 'low') time *= 0.7;
    
    return time;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get model recommendations for specific use case
   */
  public getModelRecommendations(useCase: string): ClaudeModel[] {
    const recommendations: ClaudeModel[] = [];
    
    for (const [model, capabilities] of Object.entries(this.modelCapabilities)) {
      if (capabilities.bestFor.some(task => task.toLowerCase().includes(useCase.toLowerCase()))) {
        recommendations.push(model as ClaudeModel);
      }
    }
    
    return recommendations.length > 0 ? recommendations : [ClaudeModel.CLAUDE_35_SONNET];
  }

  /**
   * Get usage statistics
   */
  public getUsageStatistics(): Map<ClaudeModel, any> {
    return new Map(this.modelUsageStats);
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.responseCache.clear();
    console.log('🧹 Response cache cleared');
  }
}

// Export singleton instance
export const puterClaudeProvider = EnhancedPuterClaudeProvider.getInstance();

