// 🚀 ENHANCED PUTER AI PROVIDER - Full Multi-Model AI System
// Полная интеграция с Puter.js для доступа к 400+ AI моделям без API ключей
// Based on: https://developer.puter.com/tutorials/free-unlimited-ai-api/

import PuterDemoProvider from './puter-demo-provider';

export enum AIModel {
  // OpenAI Models
  GPT_4_1_NANO = 'gpt-4.1-nano',
  GPT_4_1_MINI = 'gpt-4.1-mini',
  GPT_4_TURBO = 'gpt-4-turbo',
  GPT_4 = 'gpt-4',
  GPT_3_5_TURBO = 'gpt-3.5-turbo',
  
  // Claude Models (Anthropic)
  CLAUDE_SONNET_4 = 'claude-sonnet-4',
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet-20241022',
  CLAUDE_3_OPUS = 'claude-3-opus-20240229',
  CLAUDE_3_SONNET = 'claude-3-sonnet-20240229',
  CLAUDE_3_HAIKU = 'claude-3-haiku-20240307',
  CLAUDE_INSTANT = 'claude-instant-1.2',
  
  // Google Gemini Models
  GEMINI_2_5_FLASH = 'google/gemini-2.5-flash',
  GEMINI_1_5_PRO = 'google/gemini-1.5-pro',
  GEMINI_1_5_FLASH = 'google/gemini-1.5-flash',
  GEMINI_1_0_PRO = 'google/gemini-1.0-pro',
  
  // Meta Llama Models
  LLAMA_3_1_405B = 'meta-llama/llama-3.1-405b-instruct',
  LLAMA_3_1_70B = 'meta-llama/llama-3.1-70b-instruct',
  LLAMA_3_1_8B = 'meta-llama/llama-3.1-8b-instruct',
  LLAMA_3_2_90B = 'meta-llama/llama-3.2-90b-vision-instruct',
  LLAMA_3_2_11B = 'meta-llama/llama-3.2-11b-vision-instruct',
  
  // Mistral Models
  MISTRAL_LARGE = 'mistral/mistral-large-2407',
  MISTRAL_MEDIUM = 'mistral/mistral-medium',
  MISTRAL_SMALL = 'mistral/mistral-small',
  MIXTRAL_8X7B = 'mistral/mixtral-8x7b-instruct',
  
  // Cohere Models
  COHERE_COMMAND_R_PLUS = 'cohere/command-r-plus',
  COHERE_COMMAND_R = 'cohere/command-r',
  COHERE_COMMAND = 'cohere/command',
  
  // Perplexity Models
  PERPLEXITY_LLAMA_3_1_SONAR_LARGE = 'perplexity/llama-3.1-sonar-large-128k-online',
  PERPLEXITY_LLAMA_3_1_SONAR_SMALL = 'perplexity/llama-3.1-sonar-small-128k-online',
  
  // DeepSeek Models
  DEEPSEEK_CHAT = 'deepseek/deepseek-chat',
  DEEPSEEK_CODER = 'deepseek/deepseek-coder',
  
  // Qwen Models (Alibaba)
  QWEN_2_5_72B = 'qwen/qwen-2.5-72b-instruct',
  QWEN_2_5_32B = 'qwen/qwen-2.5-32b-instruct',
  QWEN_2_5_CODER = 'qwen/qwen-2.5-coder-32b-instruct',
  
  // Speciality Models
  O1_PREVIEW = 'openai/o1-preview',           // Advanced reasoning
  O1_MINI = 'openai/o1-mini',                 // Fast reasoning
  CODESTRAL = 'mistral/codestral-latest',     // Code generation
  PIXTRAL = 'mistral/pixtral-12b-2409',      // Vision model
}

export interface ModelCapabilities {
  textGeneration: boolean;
  codeGeneration: boolean;
  reasoning: boolean;
  vision: boolean;
  streaming: boolean;
  functionCalling: boolean;
  multimodal: boolean;
  contextLength: number;
  costTier: 'free' | 'low' | 'medium' | 'high';
  speedTier: 'slow' | 'medium' | 'fast' | 'instant';
  qualityTier: 'basic' | 'good' | 'excellent' | 'premium';
  specialties: string[];
}

export interface AIRequest {
  prompt: string;
  model?: AIModel;
  options?: {
    stream?: boolean;
    temperature?: number;
    max_tokens?: number;
    system?: string;
    tools?: any[];
    images?: string[];
  };
}

export interface AIResponse {
  content: string;
  model: AIModel;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: {
    responseTime: number;
    requestId: string;
    cached: boolean;
  };
}

export interface StreamingResponse {
  content: AsyncGenerator<string>;
  model: AIModel;
  metadata: {
    requestId: string;
    startTime: number;
  };
}

export interface ImageAnalysisResult {
  description: string;
  objects: string[];
  confidence: number;
  model: AIModel;
}

export interface FunctionCall {
  name: string;
  arguments: any;
  result?: any;
}

export class EnhancedPuterAIProvider {
  private static instance: EnhancedPuterAIProvider;
  private modelCapabilities: Map<AIModel, ModelCapabilities> = new Map();
  private responseCache: Map<string, AIResponse> = new Map();
  private usageStats: Map<AIModel, { requests: number; tokens: number; errors: number }> = new Map();
  private demoProvider: PuterDemoProvider;
  
  // Model selection preferences by task type
  private taskModelPreferences: Map<string, AIModel[]> = new Map();
  
  private constructor() {
    this.demoProvider = PuterDemoProvider.getInstance();
    this.initializeModelCapabilities();
    this.initializeTaskPreferences();
    this.validatePuterAvailability();
  }

  public static getInstance(): EnhancedPuterAIProvider {
    if (!EnhancedPuterAIProvider.instance) {
      EnhancedPuterAIProvider.instance = new EnhancedPuterAIProvider();
    }
    return EnhancedPuterAIProvider.instance;
  }

  /**
   * Initialize model capabilities database
   */
  private initializeModelCapabilities(): void {
    // OpenAI Models
    this.modelCapabilities.set(AIModel.GPT_4_1_NANO, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: false,
      streaming: true, functionCalling: true, multimodal: false, contextLength: 128000,
      costTier: 'free', speedTier: 'fast', qualityTier: 'excellent',
      specialties: ['general', 'reasoning', 'analysis', 'coding']
    });

    this.modelCapabilities.set(AIModel.O1_PREVIEW, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: false,
      streaming: false, functionCalling: false, multimodal: false, contextLength: 128000,
      costTier: 'high', speedTier: 'slow', qualityTier: 'premium',
      specialties: ['complex-reasoning', 'math', 'science', 'research']
    });

    // Claude Models
    this.modelCapabilities.set(AIModel.CLAUDE_SONNET_4, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: true,
      streaming: true, functionCalling: true, multimodal: true, contextLength: 200000,
      costTier: 'medium', speedTier: 'fast', qualityTier: 'premium',
      specialties: ['analysis', 'writing', 'coding', 'reasoning', 'vision']
    });

    this.modelCapabilities.set(AIModel.CLAUDE_3_5_SONNET, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: true,
      streaming: true, functionCalling: true, multimodal: true, contextLength: 200000,
      costTier: 'medium', speedTier: 'fast', qualityTier: 'excellent',
      specialties: ['coding', 'analysis', 'writing', 'vision']
    });

    // Google Gemini Models
    this.modelCapabilities.set(AIModel.GEMINI_2_5_FLASH, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: true,
      streaming: true, functionCalling: true, multimodal: true, contextLength: 1000000,
      costTier: 'low', speedTier: 'instant', qualityTier: 'good',
      specialties: ['multimodal', 'vision', 'speed', 'long-context']
    });

    // Meta Llama Models
    this.modelCapabilities.set(AIModel.LLAMA_3_1_405B, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: false,
      streaming: true, functionCalling: true, multimodal: false, contextLength: 128000,
      costTier: 'high', speedTier: 'slow', qualityTier: 'premium',
      specialties: ['reasoning', 'general', 'large-scale']
    });

    this.modelCapabilities.set(AIModel.LLAMA_3_2_90B, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: true,
      streaming: true, functionCalling: true, multimodal: true, contextLength: 128000,
      costTier: 'medium', speedTier: 'medium', qualityTier: 'excellent',
      specialties: ['vision', 'multimodal', 'reasoning']
    });

    // Specialized Models
    this.modelCapabilities.set(AIModel.CODESTRAL, {
      textGeneration: true, codeGeneration: true, reasoning: false, vision: false,
      streaming: true, functionCalling: true, multimodal: false, contextLength: 32000,
      costTier: 'low', speedTier: 'fast', qualityTier: 'excellent',
      specialties: ['coding', 'programming', 'software-engineering']
    });

    this.modelCapabilities.set(AIModel.DEEPSEEK_CODER, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: false,
      streaming: true, functionCalling: true, multimodal: false, contextLength: 64000,
      costTier: 'low', speedTier: 'fast', qualityTier: 'excellent',
      specialties: ['coding', 'debugging', 'code-analysis']
    });

    this.modelCapabilities.set(AIModel.PERPLEXITY_LLAMA_3_1_SONAR_LARGE, {
      textGeneration: true, codeGeneration: false, reasoning: true, vision: false,
      streaming: true, functionCalling: false, multimodal: false, contextLength: 128000,
      costTier: 'medium', speedTier: 'medium', qualityTier: 'excellent',
      specialties: ['research', 'real-time-data', 'web-search', 'current-events']
    });

    // Add more models...
    this.addRemainingModels();
  }

  /**
   * Add remaining model capabilities
   */
  private addRemainingModels(): void {
    // Mistral Models
    this.modelCapabilities.set(AIModel.MISTRAL_LARGE, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: false,
      streaming: true, functionCalling: true, multimodal: false, contextLength: 32000,
      costTier: 'medium', speedTier: 'fast', qualityTier: 'excellent',
      specialties: ['multilingual', 'reasoning', 'general']
    });

    // Qwen Models
    this.modelCapabilities.set(AIModel.QWEN_2_5_CODER, {
      textGeneration: true, codeGeneration: true, reasoning: true, vision: false,
      streaming: true, functionCalling: true, multimodal: false, contextLength: 32000,
      costTier: 'low', speedTier: 'fast', qualityTier: 'good',
      specialties: ['coding', 'chinese', 'multilingual']
    });

    // Add more models as needed...
  }

  /**
   * Initialize task-specific model preferences
   */
  private initializeTaskPreferences(): void {
    this.taskModelPreferences.set('code_generation', [
      AIModel.CODESTRAL,
      AIModel.DEEPSEEK_CODER,
      AIModel.CLAUDE_3_5_SONNET,
      AIModel.GPT_4_1_NANO,
      AIModel.QWEN_2_5_CODER
    ]);

    this.taskModelPreferences.set('complex_reasoning', [
      AIModel.O1_PREVIEW,
      AIModel.O1_MINI,
      AIModel.CLAUDE_SONNET_4,
      AIModel.LLAMA_3_1_405B,
      AIModel.GPT_4_1_NANO
    ]);

    this.taskModelPreferences.set('image_analysis', [
      AIModel.CLAUDE_SONNET_4,
      AIModel.CLAUDE_3_5_SONNET,
      AIModel.GEMINI_2_5_FLASH,
      AIModel.LLAMA_3_2_90B,
      AIModel.PIXTRAL
    ]);

    this.taskModelPreferences.set('research', [
      AIModel.PERPLEXITY_LLAMA_3_1_SONAR_LARGE,
      AIModel.PERPLEXITY_LLAMA_3_1_SONAR_SMALL,
      AIModel.O1_PREVIEW,
      AIModel.CLAUDE_SONNET_4
    ]);

    this.taskModelPreferences.set('fast_response', [
      AIModel.GEMINI_2_5_FLASH,
      AIModel.GPT_4_1_NANO,
      AIModel.CLAUDE_3_HAIKU,
      AIModel.LLAMA_3_1_8B
    ]);

    this.taskModelPreferences.set('long_context', [
      AIModel.GEMINI_2_5_FLASH,
      AIModel.CLAUDE_SONNET_4,
      AIModel.CLAUDE_3_5_SONNET,
      AIModel.GPT_4_1_NANO
    ]);

    this.taskModelPreferences.set('creative_writing', [
      AIModel.CLAUDE_SONNET_4,
      AIModel.CLAUDE_3_5_SONNET,
      AIModel.GPT_4_1_NANO,
      AIModel.LLAMA_3_1_70B
    ]);

    this.taskModelPreferences.set('general', [
      AIModel.GPT_4_1_NANO,
      AIModel.CLAUDE_3_5_SONNET,
      AIModel.GEMINI_2_5_FLASH,
      AIModel.LLAMA_3_1_70B
    ]);
  }

  /**
   * Validate Puter.js availability
   */
  private validatePuterAvailability(): void {
    if (typeof window === 'undefined' || typeof (window as any).puter === 'undefined') {
      console.warn('⚠️ Puter.js not detected. Please include: <script src="https://js.puter.com/v2/"></script>');
    } else {
      console.log('✅ Puter.js detected - 400+ AI models available');
    }
  }

  /**
   * Intelligent model selection based on task requirements
   */
  public selectOptimalModel(
    taskType: string,
    complexity: number = 5,
    urgency: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    requirements: {
      needsVision?: boolean;
      needsCode?: boolean;
      needsReasoning?: boolean;
      needsSpeed?: boolean;
      needsQuality?: boolean;
      budgetConstraint?: boolean;
      contextLength?: number;
    } = {}
  ): AIModel {
    // Get task-specific preferences
    let candidates = this.taskModelPreferences.get(taskType) || this.taskModelPreferences.get('general')!;
    
    // Filter by requirements
    candidates = candidates.filter(model => {
      const capabilities = this.modelCapabilities.get(model);
      if (!capabilities) return false;
      
      if (requirements.needsVision && !capabilities.vision) return false;
      if (requirements.needsCode && !capabilities.codeGeneration) return false;
      if (requirements.needsReasoning && !capabilities.reasoning) return false;
      if (requirements.contextLength && capabilities.contextLength < requirements.contextLength) return false;
      if (requirements.budgetConstraint && capabilities.costTier === 'high') return false;
      
      return true;
    });
    
    // Score models based on requirements
    const scoredModels = candidates.map(model => {
      const capabilities = this.modelCapabilities.get(model)!;
      let score = 0;
      
      // Base quality score
      const qualityScores = { basic: 1, good: 2, excellent: 3, premium: 4 };
      score += qualityScores[capabilities.qualityTier] * 2;
      
      // Speed bonus for urgent tasks
      if (urgency === 'critical' || requirements.needsSpeed) {
        const speedScores = { slow: 0, medium: 1, fast: 2, instant: 3 };
        score += speedScores[capabilities.speedTier] * 2;
      }
      
      // Cost penalty for budget constraints
      if (requirements.budgetConstraint) {
        const costPenalty = { free: 0, low: -1, medium: -2, high: -4 };
        score += costPenalty[capabilities.costTier];
      }
      
      // Complexity adjustment
      if (complexity >= 8) {
        if (capabilities.qualityTier === 'premium') score += 3;
      } else if (complexity <= 3) {
        if (capabilities.speedTier === 'fast' || capabilities.speedTier === 'instant') score += 2;
      }
      
      return { model, score };
    });
    
    // Return highest scoring model
    scoredModels.sort((a, b) => b.score - a.score);
    return scoredModels[0]?.model || AIModel.GPT_4_1_NANO;
  }

  /**
   * Упрощенная генерация текста согласно документации Puter.js
   */
  public async generateText(request: AIRequest): Promise<AIResponse> {
    const startTime = Date.now();
    const requestId = this.generateRequestId();
    
    // Auto-select model if not specified
    const model = request.model || AIModel.GPT_4_1_NANO;
    
    try {
      const puter = (window as any).puter;
      if (!puter || !puter.ai) {
        console.warn('🎭 Puter.js не доступен - переходим в demo режим');
        return this.generateDemoResponse(request, model, startTime);
      }
      
      // Подготавливаем промпт согласно документации Puter.js
      let prompt = request.prompt;
      if (request.options?.system) {
        prompt = `${request.options.system}\n\n${request.prompt}`;
      }
      
      // Правильный API вызов согласно документации
      let response;
      if (request.options?.images && request.options.images.length > 0) {
        // Анализ изображений согласно документации
        response = await puter.ai.chat(
          prompt, 
          request.options.images[0],
          {
            model: model,
            temperature: request.options?.temperature || 0.7,
            max_tokens: request.options?.max_tokens || 1000
          }
        );
      } else {
        // Обычный текстовый запрос  
        response = await puter.ai.chat(prompt);
      }
      
      // Упрощенная обработка ответа
      let content = '';
      if (typeof response === 'string') {
        content = response;
      } else if (response?.message?.content) {
        if (Array.isArray(response.message.content)) {
          content = response.message.content[0]?.text || response.message.content[0] || '';
        } else {
          content = response.message.content;
        }
      } else {
        content = String(response || 'AI response received');
      }
      
      const result: AIResponse = {
        content,
        model,
        usage: {
          promptTokens: this.estimateTokens(prompt),
          completionTokens: this.estimateTokens(content),
          totalTokens: this.estimateTokens(prompt + content)
        },
        metadata: {
          responseTime: Date.now() - startTime,
          requestId,
          cached: false
        }
      };
      
      return result;
      
    } catch (error) {
      console.warn(`🔄 Ошибка Puter API, переходим в demo режим:`, error);
      return this.generateDemoResponse(request, model, startTime);
    }
  }

  /**
   * Стриминг ответов согласно документации Puter.js
   */
  public async generateStreamingText(request: AIRequest): Promise<StreamingResponse> {
    const model = request.model || AIModel.GPT_4_1_NANO;
    const requestId = this.generateRequestId();
    const startTime = Date.now();
    
    const puter = (window as any).puter;
    if (!puter || !puter.ai) {
      throw new Error('Puter.js не доступен для стриминга');
    }
    
    // Подготавливаем промпт для стриминга
    let prompt = request.prompt;
    if (request.options?.system) {
      prompt = `${request.options.system}\n\n${request.prompt}`;
    }
    
    // Правильный API вызов для стриминга согласно документации
        const response = await puter.ai.chat(prompt);
    
    const streamingContent = async function* () {
      for await (const part of response) {
        if (part?.text) {
          yield part.text;
        }
      }
    };
    
    return {
      content: streamingContent(),
      model,
      metadata: {
        requestId,
        startTime
      }
    };
  }

  /**
   * Analyze image with vision models
   */
  public async analyzeImage(
    imageUrl: string,
    prompt: string = "Describe this image in detail",
    model?: AIModel
  ): Promise<ImageAnalysisResult> {
    // Auto-select vision model if not specified
    const selectedModel = model || this.selectOptimalModel('image_analysis', 5, 'medium', { needsVision: true });
    
    const capabilities = this.modelCapabilities.get(selectedModel);
    if (!capabilities?.vision) {
      throw new Error(`Model ${selectedModel} does not support image analysis`);
    }
    
    const response = await this.generateText({
      prompt,
      model: selectedModel,
      options: { images: [imageUrl] }
    });
    
    // Extract objects and confidence (simplified)
    const objects = this.extractObjectsFromDescription(response.content);
    const confidence = this.calculateImageConfidence(response.content);
    
    return {
      description: response.content,
      objects,
      confidence,
      model: selectedModel
    };
  }

  /**
   * Function calling (Tool calling / Agentic AI)
   */
  public async callFunction(
    prompt: string,
    tools: any[],
    model?: AIModel
  ): Promise<{
    response: string;
    functionCalls: FunctionCall[];
  }> {
    const selectedModel = model || this.selectOptimalModel('general', 6, 'medium', { needsReasoning: true });
    
    const puter = (window as any).puter;
    if (!puter) {
      throw new Error('Puter.js not available');
    }
    
    // First request with tools
    const completion = await puter.ai.chat(prompt, { 
      model: selectedModel,
      tools 
    });
    
    const functionCalls: FunctionCall[] = [];
    
    // Check if AI wants to call functions
    if (completion.message?.tool_calls && completion.message.tool_calls.length > 0) {
      for (const toolCall of completion.message.tool_calls) {
        const functionCall: FunctionCall = {
          name: toolCall.function.name,
          arguments: JSON.parse(toolCall.function.arguments)
        };
        
        // Here you would execute the actual function
        // For now, we'll just record the call
        functionCalls.push(functionCall);
      }
      
      // Return with function calls for external execution
      return {
        response: completion.message.content || '',
        functionCalls
      };
    } else {
      // No function calls needed
      return {
        response: completion.message?.content || completion,
        functionCalls: []
      };
    }
  }

  /**
   * Multi-model ensemble for complex tasks
   */
  public async generateEnsembleResponse(
    request: AIRequest,
    ensembleModels?: AIModel[]
  ): Promise<{
    responses: AIResponse[];
    consensus: string;
    confidence: number;
  }> {
    const models = ensembleModels || [
      AIModel.GPT_4_1_NANO,
      AIModel.CLAUDE_3_5_SONNET,
      AIModel.GEMINI_2_5_FLASH
    ];
    
    // Generate responses from multiple models
    const responses = await Promise.all(
      models.map(model => 
        this.generateText({ ...request, model }).catch(error => {
          console.warn(`Model ${model} failed:`, error);
          return null;
        })
      )
    );
    
    const validResponses = responses.filter((r): r is AIResponse => r !== null);
    
    if (validResponses.length === 0) {
      throw new Error('All models in ensemble failed');
    }
    
    // Simple consensus: majority vote or best quality
    const consensus = this.calculateConsensus(validResponses);
    const confidence = validResponses.length / models.length;
    
    return {
      responses: validResponses,
      consensus,
      confidence
    };
  }

  /**
   * Utility methods
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCacheKey(prompt: string, model: AIModel, options?: any): string {
    return `${model}_${this.hashString(prompt)}_${this.hashString(JSON.stringify(options || {}))}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4); // Rough estimate
  }

  private updateUsageStats(model: AIModel, response: AIResponse): void {
    if (!this.usageStats.has(model)) {
      this.usageStats.set(model, { requests: 0, tokens: 0, errors: 0 });
    }
    
    const stats = this.usageStats.get(model)!;
    stats.requests++;
    stats.tokens += response.usage?.totalTokens || 0;
  }

  private updateErrorStats(model: AIModel): void {
    if (!this.usageStats.has(model)) {
      this.usageStats.set(model, { requests: 0, tokens: 0, errors: 0 });
    }
    
    const stats = this.usageStats.get(model)!;
    stats.errors++;
  }

  private extractObjectsFromDescription(description: string): string[] {
    // Simple object extraction (can be enhanced with NLP)
    const objectKeywords = [
      'person', 'people', 'man', 'woman', 'child', 'car', 'vehicle', 'building', 
      'tree', 'dog', 'cat', 'animal', 'house', 'road', 'sky', 'cloud', 'flower'
    ];
    
    const found: string[] = [];
    const lowerDesc = description.toLowerCase();
    
    for (const keyword of objectKeywords) {
      if (lowerDesc.includes(keyword)) {
        found.push(keyword);
      }
    }
    
    return found;
  }

  private calculateImageConfidence(description: string): number {
    // Simple confidence calculation based on description detail
    const detailWords = ['detailed', 'clear', 'visible', 'distinct', 'specific'];
    const uncertainWords = ['appears', 'seems', 'possibly', 'might', 'unclear'];
    
    let confidence = 0.7; // Base confidence
    
    const lowerDesc = description.toLowerCase();
    
    for (const word of detailWords) {
      if (lowerDesc.includes(word)) confidence += 0.1;
    }
    
    for (const word of uncertainWords) {
      if (lowerDesc.includes(word)) confidence -= 0.1;
    }
    
    return Math.max(0, Math.min(1, confidence));
  }

  private calculateConsensus(responses: AIResponse[]): string {
    // Simple consensus: return longest response (assuming more detail = better)
    return responses.reduce((best, current) => 
      current.content.length > best.content.length ? current : best
    ).content;
  }

  /**
   * Public API methods
   */
  public getAvailableModels(): AIModel[] {
    return Object.values(AIModel);
  }

  public getModelCapabilities(model: AIModel): ModelCapabilities | undefined {
    return this.modelCapabilities.get(model);
  }

  public getUsageStats(): Map<AIModel, { requests: number; tokens: number; errors: number }> {
    return new Map(this.usageStats);
  }

  public getTaskPreferences(): Map<string, AIModel[]> {
    return new Map(this.taskModelPreferences);
  }

  public clearCache(): void {
    this.responseCache.clear();
  }

  /**
   * Specialized convenience methods
   */
  public async generateCode(
    prompt: string,
    language: string = 'typescript',
    complexity: number = 5
  ): Promise<AIResponse> {
    const model = this.selectOptimalModel('code_generation', complexity, 'medium', { needsCode: true });
    
    return this.generateText({
      prompt,
      model,
      options: {
        system: `You are an expert ${language} developer. Generate clean, production-ready code with proper comments and error handling.`,
        temperature: 0.1
      }
    });
  }

  public async performResearch(
    query: string,
    needsCurrentData: boolean = false
  ): Promise<AIResponse> {
    const model = needsCurrentData 
      ? AIModel.PERPLEXITY_LLAMA_3_1_SONAR_LARGE 
      : this.selectOptimalModel('research', 7, 'medium', { needsReasoning: true });
    
    return this.generateText({
      prompt: query,
      model,
      options: {
        system: 'You are a research expert. Provide comprehensive, well-sourced information.',
        temperature: 0.3
      }
    });
  }

  public async solveComplexProblem(
    problem: string,
    requiresDeepReasoning: boolean = true
  ): Promise<AIResponse> {
    const model = requiresDeepReasoning 
      ? AIModel.O1_PREVIEW 
      : this.selectOptimalModel('complex_reasoning', 9, 'low', { needsReasoning: true });
    
    return this.generateText({
      prompt: problem,
      model,
      options: {
        system: 'Think step by step. Break down complex problems into manageable parts.',
        temperature: 0.2
      }
    });
  }

  /**
   * Generate demo response when Puter API is unavailable
   */
  private async generateDemoResponse(request: AIRequest, model: AIModel | string, startTime: number): Promise<AIResponse> {
    console.log('🎭 Generating demo response for model:', model);
    
    const demoResponse = await this.demoProvider.generateResponse(request.prompt, {
      model: model,
      context: request.context,
      options: request.options
    });

    return {
      content: demoResponse.content,
      model: model as AIModel,
      usage: demoResponse.usage,
      metadata: {
        requestId: this.generateRequestId(),
        timestamp: Date.now(),
        responseTime: Date.now() - startTime,
        cached: false,
        demo_mode: true,
        provider: 'puter_demo'
      }
    };
  }

  /**
   * Add generateResponse method for compatibility
   */
  public async generateResponse(prompt: string, options: any = {}): Promise<any> {
    const request: AIRequest = {
      prompt,
      model: options.model,
      options: {
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        topP: options.topP,
        stream: options.stream
      },
      context: options.context
    };

    const response = await this.generateText(request);
    return {
      content: response.content,
      usage: response.usage,
      model: response.model
    };
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.responseCache.clear();
    this.usageStats.clear();
    console.log('🚀 Enhanced Puter AI Provider destroyed');
  }
}
