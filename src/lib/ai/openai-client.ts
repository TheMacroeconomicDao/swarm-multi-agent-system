// 🤖 OPENAI CLIENT - Advanced OpenAI API Integration
// Production-ready OpenAI API client with intelligent optimization and error handling

export interface OpenAIConfig {
  apiKey: string;
  baseURL?: string;
  defaultModel: string;
  maxRetries: number;
  timeout: number;
  costOptimization: boolean;
  fallbackModels: string[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  name?: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  stop?: string[];
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIError {
  error: {
    message: string;
    type: string;
    code?: string;
  };
}

export class OpenAIClient {
  private config: OpenAIConfig;
  private requestQueue: Array<{
    request: ChatCompletionRequest;
    resolve: (response: ChatCompletionResponse) => void;
    reject: (error: Error) => void;
    timestamp: Date;
  }> = [];
  private isProcessing = false;
  private rateLimitDelay = 0;
  private requestCount = 0;
  private lastRequestTime = 0;

  constructor(config: OpenAIConfig) {
    this.config = {
      baseURL: 'https://api.openai.com/v1',
      defaultModel: 'gpt-3.5-turbo',
      maxRetries: 3,
      timeout: 30000,
      costOptimization: true,
      fallbackModels: ['gpt-3.5-turbo', 'gpt-4-turbo-preview'],
      ...config
    };

    this.validateConfig();
    this.startRequestProcessor();
  }

  // 🤖 Main API Methods
  public async chatCompletion(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    return new Promise((resolve, reject) => {
      // Add request to queue
      this.requestQueue.push({
        request: this.optimizeRequest(request),
        resolve,
        reject,
        timestamp: new Date()
      });

      // Process queue if not already processing
      if (!this.isProcessing) {
        this.processRequestQueue();
      }
    });
  }

  public async generateCode(
    prompt: string,
    context: string = '',
    options: {
      language?: string;
      framework?: string;
      complexity?: number;
      model?: string;
    } = {}
  ): Promise<{
    code: string;
    explanation: string;
    confidence: number;
    tokens: number;
    cost: number;
  }> {
    const systemPrompt = this.buildCodeGenerationPrompt(options);
    const userPrompt = this.buildUserPrompt(prompt, context, options);

    const request: ChatCompletionRequest = {
      model: options.model || this.selectOptimalModel(options),
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: this.calculateMaxTokens(options.complexity || 5),
      temperature: 0.1, // Low temperature for code generation
      top_p: 0.9
    };

    try {
      const response = await this.chatCompletion(request);
      const result = this.parseCodeResponse(response);
      
      // Track cost
      this.trackCost(response.usage.total_tokens, request.model);
      
      return result;
    } catch (error) {
      console.error('Code generation failed:', error);
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  public async analyzeCode(
    code: string,
    analysisType: 'quality' | 'security' | 'performance' | 'maintainability' = 'quality'
  ): Promise<{
    analysis: string;
    score: number;
    issues: string[];
    suggestions: string[];
    tokens: number;
    cost: number;
  }> {
    const systemPrompt = this.buildAnalysisPrompt(analysisType);
    const userPrompt = `Analyze the following code for ${analysisType}:\n\n\`\`\`\n${code}\n\`\`\``;

    const request: ChatCompletionRequest = {
      model: 'gpt-4', // Use GPT-4 for analysis
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 2000,
      temperature: 0.2
    };

    try {
      const response = await this.chatCompletion(request);
      const result = this.parseAnalysisResponse(response, analysisType);
      
      this.trackCost(response.usage.total_tokens, request.model);
      
      return result;
    } catch (error) {
      console.error('Code analysis failed:', error);
      throw new Error(`Code analysis failed: ${error.message}`);
    }
  }

  public async generateTests(
    code: string,
    testType: 'unit' | 'integration' | 'e2e' = 'unit',
    framework: string = 'jest'
  ): Promise<{
    tests: string;
    coverage: string;
    setup: string;
    tokens: number;
    cost: number;
  }> {
    const systemPrompt = this.buildTestGenerationPrompt(testType, framework);
    const userPrompt = `Generate ${testType} tests for the following code using ${framework}:\n\n\`\`\`\n${code}\n\`\`\``;

    const request: ChatCompletionRequest = {
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 3000,
      temperature: 0.1
    };

    try {
      const response = await this.chatCompletion(request);
      const result = this.parseTestResponse(response);
      
      this.trackCost(response.usage.total_tokens, request.model);
      
      return result;
    } catch (error) {
      console.error('Test generation failed:', error);
      throw new Error(`Test generation failed: ${error.message}`);
    }
  }

  // 🔄 Request Processing
  private async processRequestQueue(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) return;

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const { request, resolve, reject } = this.requestQueue.shift()!;

      try {
        // Apply rate limiting
        await this.applyRateLimit();

        // Make API request
        const response = await this.makeAPIRequest(request);
        resolve(response);

        // Update rate limiting
        this.updateRateLimit();

      } catch (error) {
        // Handle retries
        if (this.shouldRetry(error)) {
          this.requestQueue.unshift({ request, resolve, reject, timestamp: new Date() });
        } else {
          reject(error);
        }
      }

      // Small delay between requests
      await this.delay(100);
    }

    this.isProcessing = false;
  }

  private async makeAPIRequest(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(`${this.config.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: OpenAIError = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error.message}`);
      }

      const data: ChatCompletionResponse = await response.json();
      return data;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  // 🎯 Request Optimization
  private optimizeRequest(request: ChatCompletionRequest): ChatCompletionRequest {
    if (!this.config.costOptimization) return request;

    const optimized = { ...request };

    // Optimize model selection
    optimized.model = this.selectOptimalModelForRequest(request);

    // Optimize token usage
    if (optimized.max_tokens) {
      optimized.max_tokens = Math.min(optimized.max_tokens, this.getMaxTokensForModel(optimized.model));
    }

    // Optimize temperature for cost
    if (optimized.temperature && optimized.temperature > 0.7) {
      optimized.temperature = 0.7; // Cap temperature to reduce cost
    }

    return optimized;
  }

  private selectOptimalModelForRequest(request: ChatCompletionRequest): string {
    const promptTokens = this.estimateTokenCount(
      request.messages.map(m => m.content).join(' ')
    );

    // Use cheaper models for simple tasks
    if (promptTokens < 1000 && request.temperature && request.temperature < 0.3) {
      return 'gpt-3.5-turbo';
    }

    // Use GPT-4 for complex tasks
    if (promptTokens > 4000 || request.messages.some(m => m.content.includes('analyze'))) {
      return 'gpt-4';
    }

    return request.model || this.config.defaultModel;
  }

  private selectOptimalModel(options: any): string {
    if (options.complexity && options.complexity > 7) {
      return 'gpt-4';
    }
    
    if (options.language === 'python' && options.framework === 'django') {
      return 'gpt-4'; // Better for complex frameworks
    }
    
    return 'gpt-3.5-turbo';
  }

  // 📝 Prompt Building
  private buildCodeGenerationPrompt(options: any): string {
    const language = options.language || 'typescript';
    const framework = options.framework || 'react';
    
    return `You are an expert ${language} developer specializing in ${framework}. 
Generate high-quality, production-ready code that follows best practices.

Requirements:
- Write clean, readable, and maintainable code
- Follow ${language} best practices and conventions
- Include proper error handling
- Add meaningful comments for complex logic
- Ensure code is testable and modular
- Use modern ${framework} patterns and features

Format your response as:
\`\`\`${language}
[Generated code here]
\`\`\`

Explanation:
[Brief explanation of the code and its key features]`;
  }

  private buildUserPrompt(prompt: string, context: string, options: any): string {
    let userPrompt = prompt;
    
    if (context) {
      userPrompt = `Context: ${context}\n\nRequest: ${prompt}`;
    }
    
    if (options.language) {
      userPrompt += `\n\nLanguage: ${options.language}`;
    }
    
    if (options.framework) {
      userPrompt += `\nFramework: ${options.framework}`;
    }
    
    return userPrompt;
  }

  private buildAnalysisPrompt(analysisType: string): string {
    const prompts = {
      quality: `You are a senior code reviewer. Analyze the provided code for quality issues including:
- Code structure and organization
- Naming conventions
- Complexity and readability
- Best practices adherence
- Potential bugs or issues

Provide a quality score (0-100) and specific recommendations.`,
      
      security: `You are a security expert. Analyze the provided code for security vulnerabilities including:
- Input validation issues
- Authentication and authorization problems
- Data exposure risks
- Injection vulnerabilities
- Cryptographic issues

Provide a security score (0-100) and specific security recommendations.`,
      
      performance: `You are a performance optimization expert. Analyze the provided code for performance issues including:
- Algorithm efficiency
- Memory usage
- I/O operations
- Database queries
- Caching opportunities

Provide a performance score (0-100) and specific optimization recommendations.`,
      
      maintainability: `You are a software architect. Analyze the provided code for maintainability issues including:
- Code organization and structure
- Documentation quality
- Testability
- Modularity and reusability
- Technical debt indicators

Provide a maintainability score (0-100) and specific improvement recommendations.`
    };
    
    return prompts[analysisType] || prompts.quality;
  }

  private buildTestGenerationPrompt(testType: string, framework: string): string {
    return `You are a testing expert specializing in ${framework}. Generate comprehensive ${testType} tests that:

- Cover all major functionality and edge cases
- Follow ${framework} testing best practices
- Include proper setup and teardown
- Use descriptive test names and assertions
- Include both positive and negative test cases
- Ensure good test coverage

Format your response as:
\`\`\`${framework === 'jest' ? 'javascript' : 'typescript'}
[Generated tests here]
\`\`\`

Coverage Analysis:
[Brief analysis of test coverage and areas covered]`;
  }

  // 🔍 Response Parsing
  private parseCodeResponse(response: ChatCompletionResponse): any {
    const content = response.choices[0].message.content;
    const codeMatch = content.match(/```[\w]*\n([\s\S]*?)\n```/);
    const explanationMatch = content.match(/Explanation:\s*([\s\S]*?)(?:\n\n|$)/);
    
    return {
      code: codeMatch ? codeMatch[1].trim() : content,
      explanation: explanationMatch ? explanationMatch[1].trim() : 'No explanation provided',
      confidence: this.calculateConfidence(content),
      tokens: response.usage.total_tokens,
      cost: this.calculateCost(response.usage.total_tokens, response.model)
    };
  }

  private parseAnalysisResponse(response: ChatCompletionResponse, analysisType: string): any {
    const content = response.choices[0].message.content;
    
    // Extract score
    const scoreMatch = content.match(/(?:score|rating):\s*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;
    
    // Extract issues
    const issuesMatch = content.match(/issues?:\s*([\s\S]*?)(?:\n\n|suggestions?:|$)/i);
    const issues = issuesMatch ? this.parseList(issuesMatch[1]) : [];
    
    // Extract suggestions
    const suggestionsMatch = content.match(/suggestions?:\s*([\s\S]*?)$/i);
    const suggestions = suggestionsMatch ? this.parseList(suggestionsMatch[1]) : [];
    
    return {
      analysis: content,
      score,
      issues,
      suggestions,
      tokens: response.usage.total_tokens,
      cost: this.calculateCost(response.usage.total_tokens, response.model)
    };
  }

  private parseTestResponse(response: ChatCompletionResponse): any {
    const content = response.choices[0].message.content;
    const testMatch = content.match(/```[\w]*\n([\s\S]*?)\n```/);
    const coverageMatch = content.match(/Coverage Analysis:\s*([\s\S]*?)$/);
    
    return {
      tests: testMatch ? testMatch[1].trim() : content,
      coverage: coverageMatch ? coverageMatch[1].trim() : 'No coverage analysis provided',
      setup: this.extractTestSetup(testMatch ? testMatch[1] : ''),
      tokens: response.usage.total_tokens,
      cost: this.calculateCost(response.usage.total_tokens, response.model)
    };
  }

  // 🛠️ Utility Methods
  private validateConfig(): void {
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key is required');
    }
    
    if (!this.config.apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format');
    }
  }

  private estimateTokenCount(text: string): number {
    // More accurate token estimation
    const words = text.split(/\s+/).length;
    const chars = text.length;
    
    // Average of word-based and character-based estimation
    const wordEstimate = words * 1.3;
    const charEstimate = chars / 4;
    
    return Math.ceil((wordEstimate + charEstimate) / 2);
  }

  private calculateMaxTokens(complexity: number): number {
    // Calculate max tokens based on complexity
    const baseTokens = 1000;
    const complexityMultiplier = complexity * 200;
    return Math.min(baseTokens + complexityMultiplier, 4000);
  }

  private getMaxTokensForModel(model: string): number {
    const limits = {
      'gpt-3.5-turbo': 4096,
      'gpt-4': 8192,
      'gpt-4-turbo': 128000,
      'gpt-4-turbo-preview': 128000
    };
    
    return limits[model] || 4096;
  }

  private calculateConfidence(content: string): number {
    // Calculate confidence based on content quality indicators
    let confidence = 0.7; // Base confidence
    
    // Increase confidence for well-formatted code
    if (content.includes('```') && content.includes('```')) {
      confidence += 0.1;
    }
    
    // Increase confidence for explanations
    if (content.includes('Explanation:') || content.includes('explanation')) {
      confidence += 0.1;
    }
    
    // Decrease confidence for incomplete responses
    if (content.includes('...') || content.includes('TODO')) {
      confidence -= 0.1;
    }
    
    return Math.max(0, Math.min(1, confidence));
  }

  private calculateCost(tokens: number, model: string): number {
    const pricing = {
      'gpt-3.5-turbo': 0.0000015,
      'gpt-4': 0.00003,
      'gpt-4-turbo': 0.00001,
      'gpt-4-turbo-preview': 0.00001
    };
    
    return tokens * (pricing[model] || 0.0000015);
  }

  private parseList(text: string): string[] {
    return text
      .split(/[•\-\*]\s*/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  }

  private extractTestSetup(testCode: string): string {
    // Extract test setup code
    const setupMatch = testCode.match(/(?:beforeEach|beforeAll|setup)\s*\([^)]*\)\s*{[\s\S]*?}/);
    return setupMatch ? setupMatch[0] : '';
  }

  private shouldRetry(error: Error): boolean {
    // Determine if request should be retried
    const retryableErrors = [
      'rate limit',
      'timeout',
      'network',
      'server error',
      'temporary'
    ];
    
    return retryableErrors.some(keyword => 
      error.message.toLowerCase().includes(keyword)
    );
  }

  private async applyRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      await this.delay(this.rateLimitDelay - timeSinceLastRequest);
    }
  }

  private updateRateLimit(): void {
    this.requestCount++;
    this.lastRequestTime = Date.now();
    
    // Increase delay if we're making too many requests
    if (this.requestCount > 10) {
      this.rateLimitDelay = Math.min(this.rateLimitDelay + 100, 1000);
    }
  }

  private trackCost(tokens: number, model: string): void {
    const cost = this.calculateCost(tokens, model);
    console.log(`💰 API Cost: $${cost.toFixed(4)} (${tokens} tokens, ${model})`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private startRequestProcessor(): void {
    // Start processing requests
    setInterval(() => {
      if (!this.isProcessing && this.requestQueue.length > 0) {
        this.processRequestQueue();
      }
    }, 100);
  }

  // Public API
  public getRequestQueueLength(): number {
    return this.requestQueue.length;
  }

  public getRequestCount(): number {
    return this.requestCount;
  }

  public clearRequestQueue(): void {
    this.requestQueue = [];
  }

  public updateConfig(newConfig: Partial<OpenAIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.validateConfig();
  }
}
