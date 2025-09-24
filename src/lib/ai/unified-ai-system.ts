// 🧠 UNIFIED AI SYSTEM - Orchestrated Multi-Model AI for Swarm Intelligence
// Единая система управления всеми AI моделями для максимальной эффективности роя

import { EnhancedPuterAIProvider, AIModel, AIRequest, AIResponse } from './enhanced-puter-ai-provider';
import { EventBus } from '@/lib/events/event-bus';

export interface AITask {
  id: string;
  type: 'code_generation' | 'research' | 'analysis' | 'reasoning' | 'image_analysis' | 'creative' | 'translation' | 'optimization';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  complexity: number; // 1-10
  requirements: {
    needsVision?: boolean;
    needsCode?: boolean;
    needsReasoning?: boolean;
    needsSpeed?: boolean;
    needsQuality?: boolean;
    needsCurrentData?: boolean;
    budgetConstraint?: boolean;
    contextLength?: number;
    language?: string;
  };
  agentId: string;
  timestamp: Date;
}

export interface AITaskResult {
  taskId: string;
  success: boolean;
  response?: AIResponse;
  error?: string;
  executionTime: number;
  modelUsed: AIModel;
  confidence: number;
  alternatives?: AIResponse[];
}

export interface AILoadBalancer {
  distributeTask(task: AITask): Promise<AIModel>;
  getModelLoad(model: AIModel): number;
  getAvailableModels(): AIModel[];
}

export interface AIOptimizer {
  optimizeModelSelection(task: AITask): AIModel;
  adaptParameters(task: AITask, model: AIModel): any;
  learnFromResults(task: AITask, result: AITaskResult): void;
}

export interface AIMetrics {
  totalTasks: number;
  successRate: number;
  averageResponseTime: number;
  modelUsageDistribution: Map<AIModel, number>;
  taskTypeDistribution: Map<string, number>;
  costEfficiency: number;
  qualityScore: number;
}

export class UnifiedAISystem {
  private aiProvider: EnhancedPuterAIProvider;
  private eventBus: EventBus;
  private activeTasks: Map<string, AITask> = new Map();
  private taskHistory: AITaskResult[] = [];
  private modelLoadBalancer: AILoadBalancer;
  private aiOptimizer: AIOptimizer;
  
  // Performance tracking
  private metrics: AIMetrics = {
    totalTasks: 0,
    successRate: 0,
    averageResponseTime: 0,
    modelUsageDistribution: new Map(),
    taskTypeDistribution: new Map(),
    costEfficiency: 0,
    qualityScore: 0
  };
  
  // Real-time model performance tracking
  private modelPerformance: Map<AIModel, {
    successRate: number;
    avgResponseTime: number;
    qualityScore: number;
    errorCount: number;
    lastUsed: Date;
  }> = new Map();
  
  // Task queues by priority
  private taskQueues: Map<string, AITask[]> = new Map([
    ['critical', []],
    ['high', []],
    ['medium', []],
    ['low', []]
  ]);
  
  private processingInterval?: NodeJS.Timer;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.aiProvider = EnhancedPuterAIProvider.getInstance();
    this.modelLoadBalancer = new SmartLoadBalancer(this.aiProvider);
    this.aiOptimizer = new AdaptiveAIOptimizer();
    
    this.startTaskProcessor();
    this.initializeModelPerformance();
  }

  /**
   * Execute AI task with optimal model selection and load balancing
   */
  public async executeTask(task: AITask): Promise<AITaskResult> {
    console.log(`🧠 Executing AI task: ${task.description.substring(0, 50)}...`);
    
    const startTime = Date.now();
    this.activeTasks.set(task.id, task);
    
    try {
      // Add to appropriate priority queue
      this.taskQueues.get(task.priority)?.push(task);
      
      // Get optimal model
      const selectedModel = await this.selectOptimalModel(task);
      
      // Prepare AI request
      const aiRequest = this.prepareAIRequest(task, selectedModel);
      
      // Execute with selected model
      const response = await this.executeWithModel(aiRequest, selectedModel);
      
      // Calculate result metrics
      const executionTime = Date.now() - startTime;
      const confidence = this.calculateConfidence(response, task);
      
      const result: AITaskResult = {
        taskId: task.id,
        success: true,
        response,
        executionTime,
        modelUsed: selectedModel,
        confidence
      };
      
      // Update performance tracking
      this.updateModelPerformance(selectedModel, result);
      this.updateMetrics(result);
      
      // Learn from result
      this.aiOptimizer.learnFromResults(task, result);
      
      // Clean up
      this.activeTasks.delete(task.id);
      
      console.log(`✅ Task completed with ${selectedModel} in ${executionTime}ms`);
      
      return result;
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      
      const result: AITaskResult = {
        taskId: task.id,
        success: false,
        error: error.message,
        executionTime,
        modelUsed: AIModel.GPT_4_1_NANO, // Fallback
        confidence: 0
      };
      
      this.activeTasks.delete(task.id);
      this.updateMetrics(result);
      
      console.error(`❌ Task failed: ${error.message}`);
      
      return result;
    }
  }

  /**
   * Execute task with multiple models for comparison (ensemble)
   */
  public async executeEnsembleTask(
    task: AITask,
    modelCount: number = 3
  ): Promise<AITaskResult> {
    console.log(`🎭 Executing ensemble task with ${modelCount} models`);
    
    const startTime = Date.now();
    
    // Select top models for this task
    const candidates = this.getTopModelsForTask(task, modelCount);
    
    // Execute with multiple models
    const responses = await Promise.allSettled(
      candidates.map(model => {
        const request = this.prepareAIRequest(task, model);
        return this.executeWithModel(request, model).then(response => ({
          model,
          response
        }));
      })
    );
    
    // Collect successful responses
    const successfulResponses = responses
      .filter((result): result is PromiseFulfilledResult<{model: AIModel, response: AIResponse}> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
    
    if (successfulResponses.length === 0) {
      throw new Error('All ensemble models failed');
    }
    
    // Calculate consensus
    const consensus = await this.calculateEnsembleConsensus(successfulResponses, task);
    const executionTime = Date.now() - startTime;
    
    const result: AITaskResult = {
      taskId: task.id,
      success: true,
      response: consensus.primary,
      alternatives: successfulResponses.map(r => r.response),
      executionTime,
      modelUsed: consensus.primary.model,
      confidence: consensus.confidence
    };
    
    this.updateMetrics(result);
    
    return result;
  }

  /**
   * Specialized methods for different task types
   */
  public async generateCode(
    description: string,
    language: string = 'typescript',
    complexity: number = 5,
    agentId: string = 'system'
  ): Promise<AITaskResult> {
    const task: AITask = {
      id: `code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'code_generation',
      description,
      priority: 'medium',
      complexity,
      requirements: {
        needsCode: true,
        language,
        needsQuality: true
      },
      agentId,
      timestamp: new Date()
    };
    
    return this.executeTask(task);
  }

  public async performResearch(
    query: string,
    needsCurrentData: boolean = false,
    complexity: number = 6,
    agentId: string = 'system'
  ): Promise<AITaskResult> {
    const task: AITask = {
      id: `research_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'research',
      description: query,
      priority: 'medium',
      complexity,
      requirements: {
        needsReasoning: true,
        needsCurrentData,
        needsQuality: true
      },
      agentId,
      timestamp: new Date()
    };
    
    return this.executeTask(task);
  }

  public async analyzeImage(
    imageUrl: string,
    prompt: string = "Analyze this image",
    agentId: string = 'system'
  ): Promise<AITaskResult> {
    const task: AITask = {
      id: `vision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'image_analysis',
      description: prompt,
      priority: 'medium',
      complexity: 5,
      requirements: {
        needsVision: true,
        needsQuality: true
      },
      agentId,
      timestamp: new Date()
    };
    
    // Add image to description
    task.description += `\nImage URL: ${imageUrl}`;
    
    return this.executeTask(task);
  }

  public async solveComplexProblem(
    problem: string,
    complexity: number = 8,
    agentId: string = 'system'
  ): Promise<AITaskResult> {
    const task: AITask = {
      id: `reasoning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'reasoning',
      description: problem,
      priority: 'high',
      complexity,
      requirements: {
        needsReasoning: true,
        needsQuality: true
      },
      agentId,
      timestamp: new Date()
    };
    
    return this.executeEnsembleTask(task, 2); // Use ensemble for complex problems
  }

  /**
   * Private methods
   */
  private async selectOptimalModel(task: AITask): Promise<AIModel> {
    // Use AI optimizer for intelligent selection
    const optimizedModel = this.aiOptimizer.optimizeModelSelection(task);
    
    // Check load balancer for availability
    const balancedModel = await this.modelLoadBalancer.distributeTask(task);
    
    // Choose based on performance history
    const performanceModel = this.selectBasedOnPerformance(task);
    
    // Weighted decision
    const candidates = [optimizedModel, balancedModel, performanceModel];
    const scores = candidates.map(model => this.scoreModel(model, task));
    
    const bestIndex = scores.indexOf(Math.max(...scores));
    return candidates[bestIndex];
  }

  private prepareAIRequest(task: AITask, model: AIModel): AIRequest {
    const baseRequest: AIRequest = {
      prompt: task.description,
      model,
      options: this.aiOptimizer.adaptParameters(task, model)
    };
    
    // Add system prompt based on task type
    baseRequest.options = {
      ...baseRequest.options,
      system: this.getSystemPrompt(task),
      temperature: this.getOptimalTemperature(task),
      max_tokens: this.getOptimalMaxTokens(task)
    };
    
    return baseRequest;
  }

  private async executeWithModel(request: AIRequest, model: AIModel): Promise<AIResponse> {
    // Handle special cases
    if (request.prompt.includes('Image URL:')) {
      const imageMatch = request.prompt.match(/Image URL: (.+)/);
      if (imageMatch) {
        const imageUrl = imageMatch[1];
        const prompt = request.prompt.replace(/\nImage URL: .+/, '');
        return this.aiProvider.analyzeImage(imageUrl, prompt, model);
      }
    }
    
    // Regular text generation
    return this.aiProvider.generateText(request);
  }

  private getTopModelsForTask(task: AITask, count: number): AIModel[] {
    const allModels = this.aiProvider.getAvailableModels();
    
    // Score all models for this task
    const scoredModels = allModels.map(model => ({
      model,
      score: this.scoreModel(model, task)
    }));
    
    // Return top models
    return scoredModels
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(item => item.model);
  }

  private scoreModel(model: AIModel, task: AITask): number {
    const capabilities = this.aiProvider.getModelCapabilities(model);
    if (!capabilities) return 0;
    
    let score = 0;
    
    // Base capability scoring
    if (task.requirements.needsVision && capabilities.vision) score += 10;
    if (task.requirements.needsCode && capabilities.codeGeneration) score += 10;
    if (task.requirements.needsReasoning && capabilities.reasoning) score += 10;
    
    // Quality and speed scoring
    const qualityScores = { basic: 1, good: 3, excellent: 5, premium: 7 };
    const speedScores = { slow: 1, medium: 3, fast: 5, instant: 7 };
    
    score += qualityScores[capabilities.qualityTier];
    score += speedScores[capabilities.speedTier];
    
    // Performance history
    const performance = this.modelPerformance.get(model);
    if (performance) {
      score += performance.successRate * 5;
      score += (1 - performance.avgResponseTime / 10000) * 3; // Prefer faster models
      score += performance.qualityScore * 3;
    }
    
    // Priority and urgency adjustments
    if (task.priority === 'critical') {
      if (capabilities.speedTier === 'fast' || capabilities.speedTier === 'instant') {
        score += 5;
      }
    }
    
    return score;
  }

  private calculateConfidence(response: AIResponse, task: AITask): number {
    let confidence = 0.7; // Base confidence
    
    // Length indicates detail
    if (response.content.length > 500) confidence += 0.1;
    if (response.content.length > 1500) confidence += 0.1;
    
    // Response time indicates efficiency
    if (response.metadata?.responseTime && response.metadata.responseTime < 3000) {
      confidence += 0.1;
    }
    
    // Task complexity vs response quality
    if (task.complexity >= 7 && response.content.length > 1000) {
      confidence += 0.1;
    }
    
    return Math.min(1, confidence);
  }

  private async calculateEnsembleConsensus(
    responses: Array<{model: AIModel, response: AIResponse}>,
    task: AITask
  ): Promise<{primary: AIResponse, confidence: number}> {
    // Simple consensus: choose best quality model's response
    const bestResponse = responses.reduce((best, current) => {
      const bestCapabilities = this.aiProvider.getModelCapabilities(best.model);
      const currentCapabilities = this.aiProvider.getModelCapabilities(current.model);
      
      if (!bestCapabilities) return current;
      if (!currentCapabilities) return best;
      
      const qualityScores = { basic: 1, good: 2, excellent: 3, premium: 4 };
      
      return qualityScores[currentCapabilities.qualityTier] > qualityScores[bestCapabilities.qualityTier] 
        ? current 
        : best;
    });
    
    // Calculate consensus confidence
    const consensusConfidence = responses.length / 3; // More models = higher confidence
    
    return {
      primary: bestResponse.response,
      confidence: Math.min(1, consensusConfidence)
    };
  }

  private getSystemPrompt(task: AITask): string {
    const prompts = {
      code_generation: `You are an expert ${task.requirements.language || 'TypeScript'} developer. Generate clean, production-ready code with proper comments and error handling.`,
      research: 'You are a research expert. Provide comprehensive, well-sourced, and accurate information.',
      analysis: 'You are an analytical expert. Provide detailed, structured analysis with clear insights.',
      reasoning: 'You are a reasoning expert. Think step by step and provide logical, well-structured solutions.',
      image_analysis: 'You are a vision expert. Analyze images with detailed descriptions and insights.',
      creative: 'You are a creative expert. Generate original, engaging, and high-quality creative content.',
      translation: 'You are a translation expert. Provide accurate, contextual translations.',
      optimization: 'You are an optimization expert. Find efficient solutions and improvements.'
    };
    
    return prompts[task.type] || 'You are a helpful AI assistant. Provide accurate and useful responses.';
  }

  private getOptimalTemperature(task: AITask): number {
    if (task.type === 'code_generation') return 0.1;
    if (task.type === 'reasoning') return 0.2;
    if (task.type === 'creative') return 0.8;
    if (task.type === 'research') return 0.3;
    return 0.4; // Default
  }

  private getOptimalMaxTokens(task: AITask): number {
    if (task.complexity >= 8) return 4000;
    if (task.complexity >= 6) return 2000;
    if (task.complexity >= 4) return 1000;
    return 500;
  }

  private selectBasedOnPerformance(task: AITask): AIModel {
    const taskModels = this.getTopModelsForTask(task, 5);
    
    return taskModels.reduce((best, current) => {
      const bestPerf = this.modelPerformance.get(best);
      const currentPerf = this.modelPerformance.get(current);
      
      if (!bestPerf) return current;
      if (!currentPerf) return best;
      
      const bestScore = bestPerf.successRate * bestPerf.qualityScore;
      const currentScore = currentPerf.successRate * currentPerf.qualityScore;
      
      return currentScore > bestScore ? current : best;
    });
  }

  private updateModelPerformance(model: AIModel, result: AITaskResult): void {
    if (!this.modelPerformance.has(model)) {
      this.modelPerformance.set(model, {
        successRate: 0,
        avgResponseTime: 0,
        qualityScore: 0,
        errorCount: 0,
        lastUsed: new Date()
      });
    }
    
    const perf = this.modelPerformance.get(model)!;
    
    // Update success rate
    const totalRequests = perf.successRate * 100 + perf.errorCount;
    if (result.success) {
      perf.successRate = (perf.successRate * totalRequests + 1) / (totalRequests + 1);
    } else {
      perf.errorCount++;
      perf.successRate = (perf.successRate * totalRequests) / (totalRequests + 1);
    }
    
    // Update response time
    perf.avgResponseTime = (perf.avgResponseTime + result.executionTime) / 2;
    
    // Update quality score
    perf.qualityScore = (perf.qualityScore + result.confidence) / 2;
    
    perf.lastUsed = new Date();
  }

  private updateMetrics(result: AITaskResult): void {
    this.metrics.totalTasks++;
    
    // Update success rate
    const successCount = this.taskHistory.filter(r => r.success).length + (result.success ? 1 : 0);
    this.metrics.successRate = successCount / this.metrics.totalTasks;
    
    // Update average response time
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.totalTasks - 1) + result.executionTime) / 
      this.metrics.totalTasks;
    
    // Update model usage
    const currentUsage = this.metrics.modelUsageDistribution.get(result.modelUsed) || 0;
    this.metrics.modelUsageDistribution.set(result.modelUsed, currentUsage + 1);
    
    // Store result
    this.taskHistory.push(result);
    
    // Keep only recent results
    if (this.taskHistory.length > 1000) {
      this.taskHistory = this.taskHistory.slice(-1000);
    }
  }

  private initializeModelPerformance(): void {
    for (const model of this.aiProvider.getAvailableModels()) {
      this.modelPerformance.set(model, {
        successRate: 0.8, // Start with reasonable defaults
        avgResponseTime: 3000,
        qualityScore: 0.7,
        errorCount: 0,
        lastUsed: new Date()
      });
    }
  }

  private startTaskProcessor(): void {
    this.processingInterval = setInterval(() => {
      this.processTaskQueues();
    }, 1000); // Process every second
  }

  private processTaskQueues(): void {
    // Process high-priority tasks first
    const priorities = ['critical', 'high', 'medium', 'low'];
    
    for (const priority of priorities) {
      const queue = this.taskQueues.get(priority);
      if (queue && queue.length > 0) {
        // Process one task from this priority level
        const task = queue.shift();
        if (task) {
          // Tasks are already being processed by executeTask
          // This is just for queue management
        }
        break; // Process only one priority level per cycle
      }
    }
  }

  /**
   * Public API
   */
  public getMetrics(): AIMetrics {
    return { ...this.metrics };
  }

  public getModelPerformance(): Map<AIModel, any> {
    return new Map(this.modelPerformance);
  }

  public getActiveTaskCount(): number {
    return this.activeTasks.size;
  }

  public getQueueSizes(): Map<string, number> {
    return new Map(
      Array.from(this.taskQueues.entries()).map(([priority, queue]) => [priority, queue.length])
    );
  }

  public async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: any;
  }> {
    const activeModels = Array.from(this.modelPerformance.entries())
      .filter(([_, perf]) => perf.successRate > 0.5).length;
    
    const status = activeModels >= 5 ? 'healthy' : 
                  activeModels >= 2 ? 'degraded' : 'unhealthy';
    
    return {
      status,
      details: {
        activeModels,
        totalTasks: this.metrics.totalTasks,
        successRate: this.metrics.successRate,
        avgResponseTime: this.metrics.averageResponseTime
      }
    };
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    
    this.activeTasks.clear();
    this.taskHistory = [];
    
    console.log('🧠 Unified AI System destroyed');
  }
}

/**
 * Smart Load Balancer Implementation
 */
class SmartLoadBalancer implements AILoadBalancer {
  private modelLoads: Map<AIModel, number> = new Map();
  private aiProvider: EnhancedPuterAIProvider;

  constructor(aiProvider: EnhancedPuterAIProvider) {
    this.aiProvider = aiProvider;
    
    // Initialize model loads
    for (const model of aiProvider.getAvailableModels()) {
      this.modelLoads.set(model, 0);
    }
  }

  async distributeTask(task: AITask): Promise<AIModel> {
    const candidates = this.getAvailableModels().filter(model => {
      const capabilities = this.aiProvider.getModelCapabilities(model);
      if (!capabilities) return false;
      
      // Filter by requirements
      if (task.requirements.needsVision && !capabilities.vision) return false;
      if (task.requirements.needsCode && !capabilities.codeGeneration) return false;
      if (task.requirements.needsReasoning && !capabilities.reasoning) return false;
      
      return true;
    });
    
    // Find least loaded model
    return candidates.reduce((best, current) => {
      const bestLoad = this.getModelLoad(best);
      const currentLoad = this.getModelLoad(current);
      return currentLoad < bestLoad ? current : best;
    });
  }

  getModelLoad(model: AIModel): number {
    return this.modelLoads.get(model) || 0;
  }

  getAvailableModels(): AIModel[] {
    return this.aiProvider.getAvailableModels();
  }
}

/**
 * Adaptive AI Optimizer Implementation
 */
class AdaptiveAIOptimizer implements AIOptimizer {
  private learningHistory: Map<string, AITaskResult[]> = new Map();
  private parameterOptimization: Map<AIModel, any> = new Map();

  optimizeModelSelection(task: AITask): AIModel {
    const taskKey = `${task.type}_${task.complexity}`;
    const history = this.learningHistory.get(taskKey) || [];
    
    if (history.length === 0) {
      // No history, use default selection
      return this.getDefaultModel(task);
    }
    
    // Find best performing model for this task type
    const modelPerformance = new Map<AIModel, number>();
    
    for (const result of history) {
      const current = modelPerformance.get(result.modelUsed) || 0;
      const score = result.success ? result.confidence : 0;
      modelPerformance.set(result.modelUsed, current + score);
    }
    
    // Return best model
    return Array.from(modelPerformance.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || this.getDefaultModel(task);
  }

  adaptParameters(task: AITask, model: AIModel): any {
    const optimized = this.parameterOptimization.get(model) || {};
    
    return {
      temperature: optimized.temperature || this.getDefaultTemperature(task),
      max_tokens: optimized.max_tokens || this.getDefaultMaxTokens(task),
      ...optimized
    };
  }

  learnFromResults(task: AITask, result: AITaskResult): void {
    const taskKey = `${task.type}_${task.complexity}`;
    
    if (!this.learningHistory.has(taskKey)) {
      this.learningHistory.set(taskKey, []);
    }
    
    const history = this.learningHistory.get(taskKey)!;
    history.push(result);
    
    // Keep only recent results
    if (history.length > 100) {
      history.splice(0, history.length - 100);
    }
    
    // Optimize parameters based on results
    this.optimizeParameters(result);
  }

  private getDefaultModel(task: AITask): AIModel {
    if (task.requirements.needsCode) return AIModel.CODESTRAL;
    if (task.requirements.needsVision) return AIModel.CLAUDE_SONNET_4;
    if (task.requirements.needsReasoning) return AIModel.O1_PREVIEW;
    if (task.requirements.needsCurrentData) return AIModel.PERPLEXITY_LLAMA_3_1_SONAR_LARGE;
    return AIModel.GPT_4_1_NANO;
  }

  private getDefaultTemperature(task: AITask): number {
    const tempMap = {
      code_generation: 0.1,
      reasoning: 0.2,
      research: 0.3,
      analysis: 0.3,
      creative: 0.8,
      translation: 0.2,
      optimization: 0.2,
      image_analysis: 0.3
    };
    return tempMap[task.type] || 0.4;
  }

  private getDefaultMaxTokens(task: AITask): number {
    return Math.min(4000, 500 + task.complexity * 200);
  }

  private optimizeParameters(result: AITaskResult): void {
    // Simple parameter optimization based on results
    if (!this.parameterOptimization.has(result.modelUsed)) {
      this.parameterOptimization.set(result.modelUsed, {});
    }
    
    const params = this.parameterOptimization.get(result.modelUsed)!;
    
    // Adjust based on success and confidence
    if (result.success && result.confidence > 0.8) {
      // Good result, keep similar parameters
    } else if (!result.success || result.confidence < 0.5) {
      // Poor result, adjust parameters slightly
      params.temperature = (params.temperature || 0.4) * 0.9;
    }
  }
}

