// 🐝 ENHANCED SWARM SPECIALIZED AGENTS - Multi-Model Claude Integration
// Продвинутые специализированные агенты с адаптивным выбором моделей Claude

import { SwarmAgent } from '@/lib/swarm/swarm-agent';
import { AgentRole, Task, AgentResponse } from '@/types/agents';
import { SwarmTask, SwarmAgentCapabilities } from '@/lib/swarm/types';
import { 
  EnhancedPuterClaudeProvider, 
  ClaudeModel, 
  TaskContext,
  ModelSelectionResult 
} from '@/lib/ai/puter-claude-provider-enhanced';

// Export all specialized agents for easy importing
// Note: Enhanced versions contain all functionality from previous specialized agents

// 🏗️ Enhanced Frontend Swarm Agent
export class EnhancedFrontendSwarmAgent extends SwarmAgent {
  private modelPreferences: Map<string, ClaudeModel> = new Map([
    ['component-generation', ClaudeModel.CLAUDE_35_SONNET],
    ['ui-design', ClaudeModel.CLAUDE_35_SONNET],
    ['simple-styling', ClaudeModel.CLAUDE_3_HAIKU],
    ['state-management', ClaudeModel.CLAUDE_3_SONNET],
    ['performance-optimization', ClaudeModel.CLAUDE_3_OPUS]
  ]);

  constructor(id: string = 'enhanced_frontend_swarm_01') {
    const capabilities: SwarmAgentCapabilities = {
      canCoordinate: false,
      canExecuteCode: true,
      canAnalyzeRequirements: true,
      canReview: true,
      canOptimize: true,
      canTest: false,
      canDocument: true,
      canDeploy: false,
      specializedSkills: ['component-design', 'state-management', 'routing', 'styling', 'animations', 'accessibility'],
      domains: ['frontend', 'ui', 'ux', 'web', 'mobile-web'],
      languages: ['typescript', 'javascript', 'css', 'html', 'jsx', 'tsx'],
      frameworks: ['react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt', 'solid', 'qwik'],
      tools: ['vite', 'webpack', 'esbuild', 'tailwind', 'styled-components', 'emotion', 'framer-motion'],
      maxComplexity: 9,
      parallelTasks: 4,
      specialization: ['component-architecture', 'responsive-design', 'performance', 'accessibility'],
      collaborationStyle: 'creative'
    };

    super(id, AgentRole.DEVELOPER, capabilities);
    this.modelSelectionStrategy = 'adaptive';
  }

  public async initializeAgent(): Promise<void> {
    if (this.swarmContext) {
      this.updateContext('specialty', 'Advanced Frontend Development & UI/UX Implementation');
      this.updateContext('expertise', ['React', 'TypeScript', 'Tailwind CSS', 'Component Architecture', 'Performance']);
      this.updateContext('focus_areas', ['user-interface', 'user-experience', 'performance', 'accessibility', 'animations']);
      
      this.swarmContext.set('current_framework', 'react');
      this.swarmContext.set('styling_approach', 'tailwind');
      this.swarmContext.set('state_management', 'context');
      this.swarmContext.set('performance_budget', { fcp: 1500, lcp: 2500, cls: 0.1 });
    }
  }

  public async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    console.log(`🎨 Enhanced Frontend Swarm Agent processing: ${task.title}`);
    
    try {
      const taskContext = this.convertToTaskContext(task);
      const modelSelection = await this.selectOptimalModel(task, taskContext);
      
      console.log(`🤖 Selected model: ${modelSelection.selectedModel} (${modelSelection.reasoning})`);
      
      const requirements = this.analyzeFrontendRequirements(task);
      const codeResult = await this.generateFrontendCode(task, requirements, modelSelection.selectedModel);
      const validation = await this.validateFrontendCode(codeResult.code);
      const optimization = await this.optimizeFrontendCode(codeResult.code, requirements);
      
      return {
        agentId: this.id,
        taskId: task.id,
        response: {
          type: 'code',
          content: this.formatEnhancedFrontendResponse(codeResult, validation, optimization, modelSelection),
          confidence: codeResult.confidence * modelSelection.confidence,
          reasoning: `Generated ${requirements.type} component with ${requirements.framework} using ${modelSelection.selectedModel}`
        },
        nextActions: ['Review code', 'Test component', 'Check accessibility', 'Measure performance', 'Deploy if approved']
      };
      
    } catch (error) {
      console.error('Enhanced frontend task processing failed:', error);
      throw error;
    }
  }

  private async selectOptimalModel(task: SwarmTask, context: TaskContext): Promise<ModelSelectionResult> {
    // Check if we have a specific preference for this task type
    const taskType = this.inferFrontendTaskType(task);
    const preferredModel = this.modelPreferences.get(taskType);
    
    if (preferredModel && !context.urgency) {
      return {
        selectedModel: preferredModel,
        reasoning: `Preferred model for ${taskType} tasks`,
        confidence: 0.9,
        alternativeModels: [ClaudeModel.CLAUDE_35_SONNET],
        estimatedCost: 0.01,
        estimatedTime: 2000
      };
    }
    
    // Otherwise use adaptive selection
    return this.aiProvider.selectOptimalModel(context);
  }

  private inferFrontendTaskType(task: SwarmTask): string {
    const description = task.description.toLowerCase();
    if (description.includes('component') || description.includes('create')) return 'component-generation';
    if (description.includes('design') || description.includes('ui')) return 'ui-design';
    if (description.includes('style') || description.includes('css')) return 'simple-styling';
    if (description.includes('state') || description.includes('redux')) return 'state-management';
    if (description.includes('performance') || description.includes('optimize')) return 'performance-optimization';
    return 'component-generation';
  }

  private analyzeFrontendRequirements(task: SwarmTask): {
    type: 'component' | 'page' | 'hook' | 'utility' | 'layout';
    framework: string;
    styling: string;
    stateManagement: string;
    features: string[];
    accessibility: boolean;
    responsive: boolean;
    animations: boolean;
  } {
    const description = task.description.toLowerCase();
    
    let type: 'component' | 'page' | 'hook' | 'utility' | 'layout' = 'component';
    if (description.includes('page') || description.includes('route')) type = 'page';
    if (description.includes('hook') || description.includes('custom hook')) type = 'hook';
    if (description.includes('utility') || description.includes('helper')) type = 'utility';
    if (description.includes('layout') || description.includes('template')) type = 'layout';
    
    const framework = this.detectFramework(description);
    const styling = this.detectStylingApproach(description);
    const stateManagement = this.detectStateManagement(description);
    const features = this.extractFeatures(description);
    const accessibility = description.includes('accessible') || description.includes('a11y');
    const responsive = description.includes('responsive') || description.includes('mobile');
    const animations = description.includes('animation') || description.includes('transition');
    
    return { type, framework, styling, stateManagement, features, accessibility, responsive, animations };
  }

  private async generateFrontendCode(
    task: SwarmTask, 
    requirements: any, 
    model: ClaudeModel
  ): Promise<{
    code: string;
    explanation: string;
    confidence: number;
    suggestions: string[];
  }> {
    const prompt = this.buildEnhancedFrontendPrompt(task, requirements);
    
    const response = await this.aiProvider.generateForDeveloperAgent(prompt, {
      complexity: task.complexity,
      languages: ['typescript', 'tsx'],
      frameworks: [requirements.framework]
    });
    
    // Parse response to extract code and metadata
    const codeMatch = response.match(/```(?:typescript|tsx|jsx)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1] : response;
    
            return {
      code,
      explanation: this.extractExplanation(response),
      confidence: 0.85,
      suggestions: this.extractSuggestions(response)
    };
  }

  private async validateFrontendCode(code: string): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
    score: number;
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;
    
    // Basic validation
    if (!code.includes('export')) {
      issues.push('Missing export statement');
      score -= 10;
    }
    
    if (code.includes('any')) {
      suggestions.push('Consider using specific types instead of any');
      score -= 5;
    }
    
    // React-specific validations
    if (code.includes('useState') && !code.includes('import')) {
      issues.push('Missing React import for hooks');
      score -= 15;
    }
    
    // Accessibility checks
    if (code.includes('<img') && !code.includes('alt=')) {
      issues.push('Images missing alt attributes for accessibility');
      score -= 10;
    }
    
    if (code.includes('onClick') && !code.includes('onKeyDown')) {
      suggestions.push('Consider adding keyboard handlers for better accessibility');
      score -= 5;
    }
    
    // Performance checks
    if (code.includes('useEffect') && !code.includes('dependencies')) {
      suggestions.push('Ensure useEffect has proper dependencies');
      score -= 5;
    }

      return {
      isValid: issues.length === 0,
      issues,
      suggestions,
      score: Math.max(0, score)
    };
  }

  private async optimizeFrontendCode(code: string, requirements: any): Promise<{
    optimizations: string[];
    performanceScore: number;
    bundleImpact: string;
  }> {
    const optimizations: string[] = [];
    let performanceScore = 80;
    
    // Check for optimization opportunities
    if (code.includes('map') && code.includes('key=')) {
      optimizations.push('Good: Using keys in list rendering');
      performanceScore += 5;
    }
    
    if (code.includes('useMemo') || code.includes('useCallback')) {
      optimizations.push('Good: Using memoization for performance');
      performanceScore += 10;
    }
    
    if (code.includes('lazy') || code.includes('Suspense')) {
      optimizations.push('Good: Using code splitting');
      performanceScore += 10;
    }
    
    // Bundle size estimation
    const lines = code.split('\n').length;
    const imports = (code.match(/import/g) || []).length;
    const bundleImpact = lines < 50 ? 'minimal' : lines < 150 ? 'moderate' : 'significant';
    
    return {
      optimizations,
      performanceScore: Math.min(100, performanceScore),
      bundleImpact
    };
  }

  private buildEnhancedFrontendPrompt(task: SwarmTask, requirements: any): string {
    return `Create a ${requirements.type} for: ${task.title}

Description: ${task.description}

Requirements:
- Framework: ${requirements.framework}
- Styling: ${requirements.styling}
- State Management: ${requirements.stateManagement}
- Features: ${requirements.features.join(', ')}
${requirements.accessibility ? '- Accessibility: WCAG 2.1 AA compliant' : ''}
${requirements.responsive ? '- Responsive: Mobile-first design' : ''}
${requirements.animations ? '- Animations: Smooth and performant' : ''}

Technical Requirements:
- Use TypeScript with strict typing
- Follow React best practices and hooks guidelines
- Implement proper error boundaries
- Ensure component is reusable and testable
- Add comprehensive JSDoc comments
- Use semantic HTML elements
- Implement proper loading and error states

Performance Requirements:
- Minimize re-renders
- Use proper memoization where needed
- Lazy load heavy dependencies
- Keep bundle size minimal

Please generate production-ready code that follows all modern best practices.`;
  }

  private formatEnhancedFrontendResponse(
    codeResult: any, 
    validation: any, 
    optimization: any,
    modelSelection: ModelSelectionResult
  ): string {
    return `
🎨 **Enhanced Frontend Component Generated**

**Model Used:** ${modelSelection.selectedModel}
**Selection Reasoning:** ${modelSelection.reasoning}

\`\`\`typescript
${codeResult.code}
\`\`\`

**Explanation:**
${codeResult.explanation}

**Validation Results:**
- Valid: ${validation.isValid ? '✅' : '❌'}
- Quality Score: ${validation.score}/100
${validation.issues.length > 0 ? `- Issues: ${validation.issues.join(', ')}` : ''}
${validation.suggestions.length > 0 ? `- Suggestions: ${validation.suggestions.join(', ')}` : ''}

**Performance Analysis:**
- Performance Score: ${optimization.performanceScore}/100
- Bundle Impact: ${optimization.bundleImpact}
${optimization.optimizations.length > 0 ? `- Optimizations: ${optimization.optimizations.join(', ')}` : ''}

**Code Suggestions:**
${codeResult.suggestions ? codeResult.suggestions.join('\n') : 'None'}

**Quality Metrics:**
- Confidence: ${(codeResult.confidence * modelSelection.confidence * 100).toFixed(1)}%
- Estimated Cost: $${modelSelection.estimatedCost.toFixed(4)}
- Generation Time: ${modelSelection.estimatedTime}ms
    `.trim();
  }

  // Helper methods remain similar but enhanced
  private detectFramework(description: string): string {
    const frameworks = {
      'vue': 'vue',
      'angular': 'angular',
      'svelte': 'svelte',
      'next': 'nextjs',
      'nuxt': 'nuxt',
      'solid': 'solid',
      'qwik': 'qwik',
      'remix': 'remix'
    };
    
    for (const [key, value] of Object.entries(frameworks)) {
      if (description.includes(key)) return value;
    }
    return 'react';
  }

  private detectStylingApproach(description: string): string {
    const approaches = {
      'tailwind': 'tailwind',
      'styled-components': 'styled-components',
      'emotion': 'emotion',
      'scss': 'scss',
      'sass': 'sass',
      'css modules': 'css-modules',
      'vanilla extract': 'vanilla-extract'
    };
    
    for (const [key, value] of Object.entries(approaches)) {
      if (description.includes(key)) return value;
    }
    return 'tailwind';
  }

  private detectStateManagement(description: string): string {
    const solutions = {
      'redux': 'redux',
      'zustand': 'zustand',
      'jotai': 'jotai',
      'recoil': 'recoil',
      'mobx': 'mobx',
      'valtio': 'valtio',
      'xstate': 'xstate'
    };
    
    for (const [key, value] of Object.entries(solutions)) {
      if (description.includes(key)) return value;
    }
    return 'context';
  }

  private extractFeatures(description: string): string[] {
    const features = [];
    const featureMap = {
      'form': 'form-handling',
      'table': 'data-table',
      'modal': 'modal',
      'chart': 'charts',
      'animation': 'animations',
      'responsive': 'responsive-design',
      'drag': 'drag-and-drop',
      'infinite scroll': 'infinite-scroll',
      'virtual': 'virtualization',
      'search': 'search-functionality',
      'filter': 'filtering',
      'sort': 'sorting',
      'pagination': 'pagination'
    };
    
    for (const [key, value] of Object.entries(featureMap)) {
      if (description.includes(key)) features.push(value);
    }
    return features;
  }

  private extractExplanation(response: string): string {
    const explanationMatch = response.match(/\*\*Explanation:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
    return explanationMatch ? explanationMatch[1].trim() : 'Component generated successfully';
  }

  private extractSuggestions(response: string): string[] {
    const suggestionsMatch = response.match(/\*\*Suggestions:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
    if (!suggestionsMatch) return [];
    
    return suggestionsMatch[1]
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.startsWith('-') || s.startsWith('•'))
      .map(s => s.replace(/^[-•]\s*/, ''));
  }

  public async validateSwarmOutput(output: any): Promise<boolean> {
    if (!output || typeof output !== 'object') return false;
    if (!output.code || typeof output.code !== 'string') return false;
    
    const validation = await this.validateFrontendCode(output.code);
    return validation.isValid && validation.score >= 70;
  }

  // Convert generic Task to SwarmTask
  private convertToSwarmTask(task: Task): SwarmTask {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: 'pending',
      dependencies: task.dependencies,
      metadata: task.metadata,
      complexity: task.estimatedComplexity || 5,
      domain: ['frontend'],
      estimatedTime: (task.estimatedComplexity || 5) * 5,
      subtasks: [],
      context: task.metadata || {},
      requirements: {
        codeQuality: 9,
        performance: 8,
        security: 7,
        maintainability: 9
      },
      constraints: task.metadata?.constraints || [],
      successCriteria: ['Component renders correctly', 'Follows design system', 'Responsive design', 'Accessible'],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }

  public async processTask(task: Task): Promise<AgentResponse> {
    const swarmTask = this.convertToSwarmTask(task);
    return this.processSwarmTask(swarmTask);
  }

  public async generateResponse(input: string, context: any): Promise<string> {
    const taskContext: TaskContext = {
      type: 'code-generation',
      complexity: 'medium',
      urgency: 'medium',
      qualityRequirement: 'high',
      domain: ['frontend'],
      languages: this.capabilities.languages,
      frameworks: this.capabilities.frameworks
    };

    return this.aiProvider.generateText(
      `Frontend Development Assistant: ${input}`,
      {
        adaptiveModelSelection: true,
        temperature: 0.3
      },
      taskContext
    );
  }
}

// 🔧 Enhanced Backend Swarm Agent
export class EnhancedBackendSwarmAgent extends SwarmAgent {
  private modelPreferences: Map<string, ClaudeModel> = new Map([
    ['api-design', ClaudeModel.CLAUDE_3_OPUS],
    ['database-design', ClaudeModel.CLAUDE_3_OPUS],
    ['simple-crud', ClaudeModel.CLAUDE_3_HAIKU],
    ['authentication', ClaudeModel.CLAUDE_35_SONNET],
    ['optimization', ClaudeModel.CLAUDE_3_OPUS],
    ['microservices', ClaudeModel.CLAUDE_35_SONNET]
  ]);

  constructor(id: string = 'enhanced_backend_swarm_01') {
    const capabilities: SwarmAgentCapabilities = {
      canCoordinate: false,
      canExecuteCode: true,
      canAnalyzeRequirements: true,
      canReview: true,
      canOptimize: true,
      canTest: false,
      canDocument: true,
      canDeploy: true,
      specializedSkills: ['api-design', 'database-design', 'authentication', 'performance', 'microservices', 'graphql'],
      domains: ['backend', 'api', 'database', 'server', 'cloud', 'devops'],
      languages: ['typescript', 'javascript', 'python', 'go', 'rust', 'sql'],
      frameworks: ['express', 'fastify', 'nestjs', 'fastapi', 'django', 'gin', 'actix'],
      tools: ['prisma', 'mongoose', 'typeorm', 'sequelize', 'postgresql', 'mongodb', 'redis', 'kafka'],
      maxComplexity: 10,
      parallelTasks: 3,
      specialization: ['scalability', 'security', 'distributed-systems', 'event-driven'],
      collaborationStyle: 'systematic'
    };

    super(id, AgentRole.ENGINEER, capabilities);
    this.modelSelectionStrategy = 'adaptive';
  }

  public async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    console.log(`🔧 Enhanced Backend Swarm Agent processing: ${task.title}`);
    
    try {
      const taskContext = this.convertToTaskContext(task);
      const modelSelection = await this.selectOptimalModel(task, taskContext);
      
      console.log(`🤖 Selected model: ${modelSelection.selectedModel} for backend task`);
      
      const requirements = this.analyzeBackendRequirements(task);
      const architecture = await this.designArchitecture(task, requirements);
      const codeResult = await this.generateBackendCode(task, requirements, architecture, modelSelection.selectedModel);
      const validation = await this.validateBackendCode(codeResult.code);
      const security = await this.performSecurityAnalysis(codeResult.code);
      
      return {
        agentId: this.id,
        taskId: task.id,
        response: {
          type: 'code',
          content: this.formatEnhancedBackendResponse(codeResult, validation, security, architecture, modelSelection),
          confidence: codeResult.confidence * modelSelection.confidence,
          reasoning: `Designed and implemented ${requirements.type} with ${requirements.framework} using ${modelSelection.selectedModel}`
        },
        nextActions: ['Review architecture', 'Security audit', 'Performance testing', 'Deploy to staging']
      };
    } catch (error) {
      console.error('Enhanced backend task processing failed:', error);
      throw error;
    }
  }

  private async selectOptimalModel(task: SwarmTask, context: TaskContext): Promise<ModelSelectionResult> {
    const taskType = this.inferBackendTaskType(task);
    const preferredModel = this.modelPreferences.get(taskType);
    
    if (preferredModel) {
      return {
        selectedModel: preferredModel,
        reasoning: `Specialized model for ${taskType} tasks`,
        confidence: 0.95,
        alternativeModels: [ClaudeModel.CLAUDE_35_SONNET, ClaudeModel.CLAUDE_3_SONNET],
        estimatedCost: 0.02,
        estimatedTime: 3000
      };
    }
    
    return this.aiProvider.selectOptimalModel(context);
  }

  private inferBackendTaskType(task: SwarmTask): string {
    const description = task.description.toLowerCase();
    if (description.includes('api') || description.includes('endpoint')) return 'api-design';
    if (description.includes('database') || description.includes('schema')) return 'database-design';
    if (description.includes('crud') || description.includes('basic')) return 'simple-crud';
    if (description.includes('auth') || description.includes('security')) return 'authentication';
    if (description.includes('optimize') || description.includes('performance')) return 'optimization';
    if (description.includes('microservice') || description.includes('distributed')) return 'microservices';
    return 'api-design';
  }

  private analyzeBackendRequirements(task: SwarmTask): {
    type: 'api' | 'service' | 'middleware' | 'model' | 'microservice';
    framework: string;
    database: string;
    features: string[];
    scalability: 'monolithic' | 'modular' | 'microservices';
    security: string[];
    patterns: string[];
  } {
    const description = task.description.toLowerCase();
    
    let type: 'api' | 'service' | 'middleware' | 'model' | 'microservice' = 'api';
    if (description.includes('service')) type = 'service';
    if (description.includes('middleware')) type = 'middleware';
    if (description.includes('model') || description.includes('schema')) type = 'model';
    if (description.includes('microservice')) type = 'microservice';
    
    const framework = this.detectBackendFramework(description);
    const database = this.detectDatabase(description);
    const features = this.extractBackendFeatures(description);
    const scalability = this.determineScalability(description);
    const security = this.extractSecurityRequirements(description);
    const patterns = this.extractDesignPatterns(description);
    
    return { type, framework, database, features, scalability, security, patterns };
  }

  private async designArchitecture(task: SwarmTask, requirements: any): Promise<{
    pattern: string;
    layers: string[];
    components: string[];
    dataFlow: string;
  }> {
    const pattern = requirements.scalability === 'microservices' ? 'microservices' :
                   requirements.scalability === 'modular' ? 'hexagonal' : 'layered';
    
    const layers = pattern === 'microservices' ? 
      ['API Gateway', 'Service Layer', 'Data Layer', 'Message Bus'] :
      ['Presentation', 'Business Logic', 'Data Access', 'Database'];
    
    const components = this.identifyComponents(requirements);
    const dataFlow = this.designDataFlow(pattern, components);
    
    return { pattern, layers, components, dataFlow };
  }

  private async generateBackendCode(
    task: SwarmTask, 
    requirements: any, 
    architecture: any,
    model: ClaudeModel
  ): Promise<{
    code: string;
    explanation: string;
    confidence: number;
    tests: string;
    documentation: string;
  }> {
    const prompt = this.buildEnhancedBackendPrompt(task, requirements, architecture);
    
    const response = await this.aiProvider.generateText(prompt, {
      model,
      temperature: 0.2,
      maxTokens: 8000,
      adaptiveModelSelection: false
    });
    
    // Parse response to extract different sections
    const codeMatch = response.match(/```(?:typescript|javascript|python)?\n([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1] : response;
    
    // Generate tests separately if needed
    const testsPrompt = `Generate comprehensive tests for the following backend code:\n${code}`;
    const tests = await this.aiProvider.generateForTestingAgent(testsPrompt, { complexity: requirements.complexity });
      
      return {
      code,
      explanation: this.extractExplanation(response),
      confidence: 0.9,
      tests,
      documentation: this.generateDocumentation(code, requirements)
    };
  }

  private async validateBackendCode(code: string): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
    score: number;
    securityScore: number;
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;
    let securityScore = 100;
    
    // Error handling checks
    if (!code.includes('try') && code.includes('async')) {
      issues.push('Missing error handling for async operations');
      score -= 15;
    }
    
    // Security checks
    if (code.includes('password') && !code.includes('hash')) {
      issues.push('Passwords must be hashed');
      securityScore -= 30;
    }
    
    if (code.includes('query') && !code.includes('prepared')) {
      suggestions.push('Use prepared statements to prevent SQL injection');
      securityScore -= 20;
    }
    
    // Best practices
    if (!code.includes('logger') && !code.includes('console.log')) {
      suggestions.push('Add proper logging for production');
      score -= 5;
    }
    
    if (code.includes('env') && !code.includes('validation')) {
      suggestions.push('Validate environment variables');
      score -= 10;
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
      score: Math.max(0, score),
      securityScore: Math.max(0, securityScore)
    };
  }

  private async performSecurityAnalysis(code: string): Promise<{
    vulnerabilities: string[];
    recommendations: string[];
    securityLevel: 'low' | 'medium' | 'high';
  }> {
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];
    
    // Check for common vulnerabilities
    if (code.includes('eval(') || code.includes('exec(')) {
      vulnerabilities.push('Potential code injection vulnerability');
    }
    
    if (!code.includes('helmet') && code.includes('express')) {
      recommendations.push('Use helmet middleware for security headers');
    }
    
    if (!code.includes('rate') && code.includes('api')) {
      recommendations.push('Implement rate limiting');
    }
    
    if (!code.includes('cors') && code.includes('api')) {
      recommendations.push('Configure CORS properly');
    }
    
    const securityLevel = vulnerabilities.length === 0 ? 'high' :
                         vulnerabilities.length <= 2 ? 'medium' : 'low';
    
    return { vulnerabilities, recommendations, securityLevel };
  }

  private buildEnhancedBackendPrompt(task: SwarmTask, requirements: any, architecture: any): string {
    return `Design and implement a ${requirements.type} for: ${task.title}

Description: ${task.description}

Architecture Pattern: ${architecture.pattern}
Layers: ${architecture.layers.join(', ')}

Requirements:
- Framework: ${requirements.framework}
- Database: ${requirements.database}
- Features: ${requirements.features.join(', ')}
- Scalability: ${requirements.scalability}
- Security: ${requirements.security.join(', ')}
- Design Patterns: ${requirements.patterns.join(', ')}

Technical Requirements:
- Use TypeScript with strict typing
- Implement proper error handling and logging
- Follow RESTful API best practices
- Include input validation and sanitization
- Implement authentication and authorization
- Use environment variables for configuration
- Add comprehensive error messages
- Include database transactions where needed
- Implement proper connection pooling
- Add health check endpoints

Performance Requirements:
- Response time < 200ms for read operations
- Support concurrent requests
- Implement caching where appropriate
- Use database indexing strategies

Security Requirements:
- Implement rate limiting
- Use prepared statements
- Hash passwords with bcrypt
- Validate all inputs
- Implement CORS properly
- Use HTTPS in production

Please generate production-ready, secure, and scalable backend code.`;
  }

  private formatEnhancedBackendResponse(
    codeResult: any,
    validation: any,
    security: any,
    architecture: any,
    modelSelection: ModelSelectionResult
  ): string {
    return `
🔧 **Enhanced Backend Implementation**

**Model Used:** ${modelSelection.selectedModel}
**Architecture Pattern:** ${architecture.pattern}

\`\`\`typescript
${codeResult.code}
\`\`\`

**Architecture Overview:**
- Pattern: ${architecture.pattern}
- Layers: ${architecture.layers.join(' → ')}
- Components: ${architecture.components.join(', ')}

**Explanation:**
${codeResult.explanation}

**Validation Results:**
- Valid: ${validation.isValid ? '✅' : '❌'}
- Code Quality Score: ${validation.score}/100
- Security Score: ${validation.securityScore}/100
${validation.issues.length > 0 ? `- Issues: ${validation.issues.join(', ')}` : ''}
${validation.suggestions.length > 0 ? `- Suggestions: ${validation.suggestions.join(', ')}` : ''}

**Security Analysis:**
- Security Level: ${security.securityLevel.toUpperCase()}
${security.vulnerabilities.length > 0 ? `- Vulnerabilities: ${security.vulnerabilities.join(', ')}` : '- No vulnerabilities detected'}
${security.recommendations.length > 0 ? `- Recommendations: ${security.recommendations.join(', ')}` : ''}

**Test Coverage:**
\`\`\`typescript
${codeResult.tests.substring(0, 500)}...
\`\`\`

**Documentation:**
${codeResult.documentation}

**Quality Metrics:**
- Confidence: ${(codeResult.confidence * modelSelection.confidence * 100).toFixed(1)}%
- Estimated Cost: $${modelSelection.estimatedCost.toFixed(4)}
- Generation Time: ${modelSelection.estimatedTime}ms
    `.trim();
  }

  // Additional helper methods
  private detectBackendFramework(description: string): string {
    const frameworks = {
      'fastapi': 'fastapi',
      'django': 'django',
      'flask': 'flask',
      'nestjs': 'nestjs',
      'nest': 'nestjs',
      'fastify': 'fastify',
      'koa': 'koa',
      'hapi': 'hapi',
      'gin': 'gin',
      'fiber': 'fiber',
      'actix': 'actix',
      'rocket': 'rocket'
    };
    
    for (const [key, value] of Object.entries(frameworks)) {
      if (description.includes(key)) return value;
    }
    return 'express';
  }

  private detectDatabase(description: string): string {
    const databases = {
      'mongodb': 'mongodb',
      'mongo': 'mongodb',
      'mysql': 'mysql',
      'mariadb': 'mariadb',
      'sqlite': 'sqlite',
      'redis': 'redis',
      'dynamodb': 'dynamodb',
      'cassandra': 'cassandra',
      'neo4j': 'neo4j',
      'elasticsearch': 'elasticsearch'
    };
    
    for (const [key, value] of Object.entries(databases)) {
      if (description.includes(key)) return value;
    }
    return 'postgresql';
  }

  private extractBackendFeatures(description: string): string[] {
    const features = [];
    const featureMap = {
      'auth': 'authentication',
      'validation': 'input-validation',
      'cache': 'caching',
      'rate limit': 'rate-limiting',
      'log': 'logging',
      'websocket': 'websockets',
      'graphql': 'graphql',
      'rest': 'rest-api',
      'grpc': 'grpc',
      'queue': 'message-queue',
      'event': 'event-driven',
      'stream': 'streaming',
      'batch': 'batch-processing',
      'cron': 'scheduled-jobs'
    };
    
    for (const [key, value] of Object.entries(featureMap)) {
      if (description.includes(key)) features.push(value);
    }
    return features;
  }

  private determineScalability(description: string): 'monolithic' | 'modular' | 'microservices' {
    if (description.includes('microservice') || description.includes('distributed')) return 'microservices';
    if (description.includes('modular') || description.includes('hexagonal')) return 'modular';
    return 'monolithic';
  }

  private extractSecurityRequirements(description: string): string[] {
    const security = [];
    const securityMap = {
      'oauth': 'OAuth2',
      'jwt': 'JWT',
      'session': 'Session-based',
      'api key': 'API Key',
      'rbac': 'Role-Based Access Control',
      'encryption': 'Encryption',
      'tls': 'TLS/SSL',
      'cors': 'CORS',
      'csrf': 'CSRF Protection',
      'xss': 'XSS Protection'
    };
    
    for (const [key, value] of Object.entries(securityMap)) {
      if (description.includes(key)) security.push(value);
    }
    return security;
  }

  private extractDesignPatterns(description: string): string[] {
    const patterns = [];
    const patternMap = {
      'repository': 'Repository Pattern',
      'factory': 'Factory Pattern',
      'singleton': 'Singleton Pattern',
      'observer': 'Observer Pattern',
      'strategy': 'Strategy Pattern',
      'adapter': 'Adapter Pattern',
      'facade': 'Facade Pattern',
      'decorator': 'Decorator Pattern',
      'cqrs': 'CQRS',
      'event sourcing': 'Event Sourcing',
      'saga': 'Saga Pattern',
      'circuit breaker': 'Circuit Breaker'
    };
    
    for (const [key, value] of Object.entries(patternMap)) {
      if (description.includes(key)) patterns.push(value);
    }
    return patterns;
  }

  private identifyComponents(requirements: any): string[] {
    const components = ['API Gateway'];
    
    if (requirements.features.includes('authentication')) {
      components.push('Auth Service');
    }
    if (requirements.features.includes('caching')) {
      components.push('Cache Layer');
    }
    if (requirements.features.includes('message-queue')) {
      components.push('Message Broker');
    }
    if (requirements.database) {
      components.push('Data Service');
    }
    if (requirements.features.includes('logging')) {
      components.push('Logging Service');
    }
    
    return components;
  }

  private designDataFlow(pattern: string, components: string[]): string {
    if (pattern === 'microservices') {
      return 'Client → API Gateway → Service Discovery → Microservice → Database';
    } else if (pattern === 'hexagonal') {
      return 'Client → Adapter → Port → Domain → Port → Adapter → Database';
    } else {
      return 'Client → Controller → Service → Repository → Database';
    }
  }

  private generateDocumentation(code: string, requirements: any): string {
    return `
## API Documentation

### Overview
This ${requirements.type} implementation provides ${requirements.features.join(', ')} functionality.

### Architecture
- Framework: ${requirements.framework}
- Database: ${requirements.database}
- Pattern: ${requirements.scalability}

### Endpoints
[Auto-generated from code analysis]

### Authentication
${requirements.security.includes('JWT') ? 'JWT-based authentication' : 'Session-based authentication'}

### Error Handling
Standardized error responses with appropriate HTTP status codes.

### Rate Limiting
Configured based on endpoint sensitivity and expected load.
`;
  }

  private extractExplanation(response: string): string {
    const explanationMatch = response.match(/\*\*Explanation:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/);
    return explanationMatch ? explanationMatch[1].trim() : 'Backend implementation completed successfully';
  }

  // Task conversion and other interface methods
  public async validateSwarmOutput(output: any): Promise<boolean> {
    if (!output || typeof output !== 'object') return false;
    if (!output.code || typeof output.code !== 'string') return false;
    
    const validation = await this.validateBackendCode(output.code);
    return validation.isValid && validation.score >= 70 && validation.securityScore >= 70;
  }

  private convertToSwarmTask(task: Task): SwarmTask {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: 'pending',
      dependencies: task.dependencies,
      metadata: task.metadata,
      complexity: task.estimatedComplexity || 6,
      domain: ['backend'],
      estimatedTime: (task.estimatedComplexity || 6) * 8,
      subtasks: [],
      context: task.metadata || {},
      requirements: {
        codeQuality: 9,
        performance: 9,
        security: 10,
        maintainability: 9
      },
      constraints: task.metadata?.constraints || [],
      successCriteria: ['API endpoints functional', 'Security standards met', 'Performance targets achieved'],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }

  public async processTask(task: Task): Promise<AgentResponse> {
    const swarmTask = this.convertToSwarmTask(task);
    return this.processSwarmTask(swarmTask);
  }

  public async generateResponse(input: string, context: any): Promise<string> {
    const taskContext: TaskContext = {
      type: 'architecture',
      complexity: 'high',
      urgency: 'medium',
      qualityRequirement: 'high',
      domain: ['backend'],
      languages: this.capabilities.languages,
      frameworks: this.capabilities.frameworks
    };

    return this.aiProvider.generateText(
      `Backend Architecture Assistant: ${input}`,
      {
        adaptiveModelSelection: true,
        temperature: 0.2
      },
      taskContext
    );
  }
}

// 🧪 Enhanced Testing Swarm Agent
export class EnhancedTestingSwarmAgent extends SwarmAgent {
  private modelPreferences: Map<string, ClaudeModel> = new Map([
    ['unit-test', ClaudeModel.CLAUDE_3_HAIKU],
    ['integration-test', ClaudeModel.CLAUDE_3_SONNET],
    ['e2e-test', ClaudeModel.CLAUDE_35_SONNET],
    ['performance-test', ClaudeModel.CLAUDE_3_OPUS],
    ['security-test', ClaudeModel.CLAUDE_3_OPUS],
    ['test-strategy', ClaudeModel.CLAUDE_35_SONNET]
  ]);

  constructor(id: string = 'enhanced_testing_swarm_01') {
    const capabilities: SwarmAgentCapabilities = {
      canCoordinate: false,
      canExecuteCode: false,
      canAnalyzeRequirements: true,
      canReview: true,
      canOptimize: true,
      canTest: true,
      canDocument: true,
      canDeploy: false,
      specializedSkills: [
        'unit-testing', 'integration-testing', 'e2e-testing', 
        'performance-testing', 'security-testing', 'test-automation',
        'tdd', 'bdd', 'property-based-testing', 'mutation-testing'
      ],
      domains: ['testing', 'quality-assurance', 'validation', 'verification'],
      languages: ['typescript', 'javascript', 'python', 'go'],
      frameworks: [
        'jest', 'vitest', 'mocha', 'cypress', 'playwright', 
        'testing-library', 'supertest', 'k6', 'artillery', 
        'selenium', 'puppeteer', 'detox'
      ],
      tools: ['coverage', 'stryker', 'sonarqube', 'lighthouse', 'webhint'],
      maxComplexity: 8,
      parallelTasks: 5,
      specialization: ['test-strategy', 'coverage-optimization', 'ci-cd-integration', 'test-data-generation'],
      collaborationStyle: 'meticulous'
    };

    super(id, AgentRole.TESTING, capabilities);
    this.modelSelectionStrategy = 'adaptive';
  }

  public async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    console.log(`🧪 Enhanced Testing Swarm Agent processing: ${task.title}`);
    
    try {
      const taskContext = this.convertToTaskContext(task);
      const modelSelection = await this.selectOptimalModel(task, taskContext);
      
      console.log(`🤖 Selected model: ${modelSelection.selectedModel} for testing task`);
      
      const requirements = this.analyzeTestingRequirements(task);
      const strategy = await this.designTestStrategy(task, requirements);
      const testResult = await this.generateTests(task, requirements, strategy, modelSelection.selectedModel);
      const validation = await this.validateTests(testResult.tests);
      const coverage = await this.analyzeCoverage(testResult.tests, requirements);
      
      return {
        agentId: this.id,
        taskId: task.id,
        response: {
          type: 'code',
          content: this.formatEnhancedTestingResponse(testResult, validation, coverage, strategy, modelSelection),
          confidence: testResult.confidence * modelSelection.confidence,
          reasoning: `Generated ${requirements.type} tests with ${requirements.framework} using ${modelSelection.selectedModel}`
        },
        nextActions: ['Run test suite', 'Check coverage', 'Setup CI/CD', 'Performance baseline']
      };
    } catch (error) {
      console.error('Enhanced testing task processing failed:', error);
      throw error;
    }
  }

  private async selectOptimalModel(task: SwarmTask, context: TaskContext): Promise<ModelSelectionResult> {
    const testType = this.inferTestType(task);
    const preferredModel = this.modelPreferences.get(testType);
    
    if (preferredModel) {
      return {
        selectedModel: preferredModel,
        reasoning: `Optimized model for ${testType}`,
        confidence: 0.92,
        alternativeModels: [ClaudeModel.CLAUDE_3_SONNET],
        estimatedCost: 0.01,
        estimatedTime: 2500
      };
    }
    
    return this.aiProvider.selectOptimalModel(context);
  }

  private inferTestType(task: SwarmTask): string {
    const description = task.description.toLowerCase();
    if (description.includes('unit')) return 'unit-test';
    if (description.includes('integration')) return 'integration-test';
    if (description.includes('e2e') || description.includes('end-to-end')) return 'e2e-test';
    if (description.includes('performance') || description.includes('load')) return 'performance-test';
    if (description.includes('security') || description.includes('vulnerability')) return 'security-test';
    if (description.includes('strategy') || description.includes('plan')) return 'test-strategy';
    return 'unit-test';
  }

  private analyzeTestingRequirements(task: SwarmTask): {
    type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security' | 'contract';
    framework: string;
    coverage: number;
    features: string[];
    methodology: 'tdd' | 'bdd' | 'atdd' | 'traditional';
    testData: 'static' | 'dynamic' | 'generated';
    parallelization: boolean;
  } {
    const description = task.description.toLowerCase();
    
    let type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security' | 'contract' = 'unit';
    if (description.includes('integration')) type = 'integration';
    if (description.includes('e2e') || description.includes('end-to-end')) type = 'e2e';
    if (description.includes('performance') || description.includes('load')) type = 'performance';
    if (description.includes('security')) type = 'security';
    if (description.includes('contract') || description.includes('api')) type = 'contract';
    
    const framework = this.detectTestingFramework(description);
    const coverage = this.extractCoverageTarget(description);
    const features = this.extractTestingFeatures(description);
    const methodology = this.detectMethodology(description);
    const testData = this.detectTestDataApproach(description);
    const parallelization = description.includes('parallel') || description.includes('concurrent');
    
    return { type, framework, coverage, features, methodology, testData, parallelization };
  }

  private async designTestStrategy(task: SwarmTask, requirements: any): Promise<{
    approach: string;
    layers: string[];
    priorities: string[];
    riskAreas: string[];
    testPyramid: { unit: number; integration: number; e2e: number };
  }> {
    const approach = requirements.methodology === 'tdd' ? 'Test-First Development' :
                    requirements.methodology === 'bdd' ? 'Behavior-Driven Development' :
                    'Risk-Based Testing';
    
    const layers = this.defineTestLayers(requirements);
    const priorities = this.defineTestPriorities(task, requirements);
    const riskAreas = this.identifyRiskAreas(task);
    const testPyramid = this.calculateTestPyramid(requirements);
    
    return { approach, layers, priorities, riskAreas, testPyramid };
  }

  private async generateTests(
    task: SwarmTask,
    requirements: any,
    strategy: any,
    model: ClaudeModel
  ): Promise<{
    tests: string;
    setup: string;
    helpers: string;
    fixtures: string;
    confidence: number;
    coverage: string;
  }> {
    const prompt = this.buildEnhancedTestingPrompt(task, requirements, strategy);
    
    const response = await this.aiProvider.generateText(prompt, {
      model,
      temperature: 0.1, // Low temperature for precise test generation
      maxTokens: 6000
    });
    
    // Generate test helpers and fixtures
    const helpersPrompt = `Generate test helpers and utilities for: ${task.description}`;
    const helpers = await this.aiProvider.generateText(helpersPrompt, {
      model: ClaudeModel.CLAUDE_3_HAIKU,
      temperature: 0.1
    });
    
    const fixturesPrompt = `Generate test fixtures and mock data for: ${task.description}`;
    const fixtures = await this.aiProvider.generateText(fixturesPrompt, {
      model: ClaudeModel.CLAUDE_3_HAIKU,
      temperature: 0.2
    });
      
      return {
      tests: this.extractCode(response),
      setup: this.extractSetup(response),
      helpers: this.extractCode(helpers),
      fixtures: this.extractCode(fixtures),
      confidence: 0.88,
      coverage: this.estimateCoverage(response)
    };
  }

  private async validateTests(tests: string): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
    score: number;
    bestPractices: string[];
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];
    const bestPractices: string[] = [];
    let score = 100;
    
    // Structure validation
    if (!tests.includes('describe') && !tests.includes('test') && !tests.includes('it')) {
      issues.push('Missing test structure');
      score -= 20;
    }
    
    // Assertion validation
    if (!tests.includes('expect') && !tests.includes('assert')) {
      issues.push('Missing assertions');
      score -= 25;
    }
    
    // Best practices
    if (tests.includes('.only')) {
      issues.push('Remove .only before committing');
      score -= 10;
    }
    
    if (!tests.includes('beforeEach') && !tests.includes('beforeAll')) {
      suggestions.push('Consider adding setup/teardown');
    }
    
    if (tests.includes('async') && !tests.includes('await')) {
      issues.push('Async tests missing await');
      score -= 15;
    }
    
    // Positive practices
    if (tests.includes('describe.each') || tests.includes('test.each')) {
      bestPractices.push('Good: Using parameterized tests');
      score += 5;
    }
    
    if (tests.includes('mock') || tests.includes('spy')) {
      bestPractices.push('Good: Using mocks/spies');
    }
    
    if (tests.includes('cleanup') || tests.includes('restore')) {
      bestPractices.push('Good: Proper cleanup');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions,
      score: Math.max(0, Math.min(100, score)),
      bestPractices
    };
  }

  private async analyzeCoverage(tests: string, requirements: any): Promise<{
    estimated: number;
    branches: number;
    functions: number;
    lines: number;
    uncovered: string[];
    suggestions: string[];
  }> {
    // Estimate coverage based on test content
    const testCount = (tests.match(/test\(|it\(|describe\(/g) || []).length;
    const assertionCount = (tests.match(/expect\(|assert/g) || []).length;
    
    const estimated = Math.min(requirements.coverage, testCount * 5);
    const branches = estimated * 0.85;
    const functions = estimated * 0.9;
    const lines = estimated;
    
    const uncovered = this.identifyUncoveredAreas(tests);
    const suggestions = this.generateCoverageSuggestions(estimated, requirements.coverage);
    
    return { estimated, branches, functions, lines, uncovered, suggestions };
  }

  private buildEnhancedTestingPrompt(task: SwarmTask, requirements: any, strategy: any): string {
    return `Generate comprehensive ${requirements.type} tests for: ${task.title}

Description: ${task.description}

Test Strategy: ${strategy.approach}
Test Layers: ${strategy.layers.join(', ')}
Priority Areas: ${strategy.priorities.join(', ')}

Requirements:
- Test Type: ${requirements.type}
- Framework: ${requirements.framework}
- Coverage Target: ${requirements.coverage}%
- Methodology: ${requirements.methodology}
- Features: ${requirements.features.join(', ')}
${requirements.parallelization ? '- Parallel Execution: Enabled' : ''}

Technical Requirements:
- Write clear, descriptive test names
- Include positive and negative test cases
- Test edge cases and error scenarios
- Use proper setup and teardown
- Mock external dependencies
- Include performance assertions where relevant
- Add accessibility tests for UI components
- Test data validation and sanitization
- Include security-related test cases
- Use data-driven testing where appropriate

Quality Requirements:
- Tests should be maintainable and DRY
- Each test should test one thing
- Tests should be independent
- Use meaningful assertions
- Include helpful error messages
- Tests should run quickly

Coverage Requirements:
- Statement coverage: >${requirements.coverage}%
- Branch coverage: >${requirements.coverage * 0.9}%
- Function coverage: >${requirements.coverage * 0.95}%

Please generate production-ready test code with excellent coverage.`;
  }

  private formatEnhancedTestingResponse(
    testResult: any,
    validation: any,
    coverage: any,
    strategy: any,
    modelSelection: ModelSelectionResult
  ): string {
    return `
🧪 **Enhanced Test Suite Generated**

**Model Used:** ${modelSelection.selectedModel}
**Test Strategy:** ${strategy.approach}

**Test Code:**
\`\`\`typescript
${testResult.tests}
\`\`\`

**Test Setup:**
\`\`\`typescript
${testResult.setup}
\`\`\`

**Test Helpers:**
\`\`\`typescript
${testResult.helpers.substring(0, 300)}...
\`\`\`

**Test Strategy Overview:**
- Approach: ${strategy.approach}
- Test Pyramid: Unit (${strategy.testPyramid.unit}%), Integration (${strategy.testPyramid.integration}%), E2E (${strategy.testPyramid.e2e}%)
- Priority Areas: ${strategy.priorities.join(', ')}
- Risk Areas: ${strategy.riskAreas.join(', ')}

**Validation Results:**
- Valid: ${validation.isValid ? '✅' : '❌'}
- Quality Score: ${validation.score}/100
${validation.issues.length > 0 ? `- Issues: ${validation.issues.join(', ')}` : ''}
${validation.suggestions.length > 0 ? `- Suggestions: ${validation.suggestions.join(', ')}` : ''}
${validation.bestPractices.length > 0 ? `- Best Practices Found: ${validation.bestPractices.join(', ')}` : ''}

**Coverage Analysis:**
- Estimated Coverage: ${coverage.estimated}%
- Statement Coverage: ${coverage.lines}%
- Branch Coverage: ${coverage.branches}%
- Function Coverage: ${coverage.functions}%
${coverage.uncovered.length > 0 ? `- Uncovered Areas: ${coverage.uncovered.join(', ')}` : ''}
${coverage.suggestions.length > 0 ? `- Coverage Suggestions: ${coverage.suggestions.join(', ')}` : ''}

**Quality Metrics:**
- Confidence: ${(testResult.confidence * modelSelection.confidence * 100).toFixed(1)}%
- Estimated Cost: $${modelSelection.estimatedCost.toFixed(4)}
- Generation Time: ${modelSelection.estimatedTime}ms
    `.trim();
  }

  // Additional helper methods
  private detectTestingFramework(description: string): string {
    const frameworks = {
      'vitest': 'vitest',
      'cypress': 'cypress',
      'playwright': 'playwright',
      'mocha': 'mocha',
      'jasmine': 'jasmine',
      'k6': 'k6',
      'artillery': 'artillery',
      'puppeteer': 'puppeteer',
      'selenium': 'selenium',
      'detox': 'detox'
    };
    
    for (const [key, value] of Object.entries(frameworks)) {
      if (description.includes(key)) return value;
    }
    return 'jest';
  }

  private extractCoverageTarget(description: string): number {
    const match = description.match(/(\d+)%?\s*coverage/);
    return match ? parseInt(match[1]) : 80;
  }

  private extractTestingFeatures(description: string): string[] {
    const features = [];
    const featureMap = {
      'mock': 'mocking',
      'stub': 'stubbing',
      'spy': 'spying',
      'snapshot': 'snapshot-testing',
      'visual': 'visual-regression',
      'async': 'async-testing',
      'component': 'component-testing',
      'api': 'api-testing',
      'database': 'database-testing',
      'websocket': 'websocket-testing',
      'accessibility': 'a11y-testing',
      'performance': 'performance-testing',
      'security': 'security-testing',
      'mutation': 'mutation-testing',
      'property': 'property-based-testing',
      'contract': 'contract-testing',
      'smoke': 'smoke-testing',
      'regression': 'regression-testing'
    };
    
    for (const [key, value] of Object.entries(featureMap)) {
      if (description.includes(key)) features.push(value);
    }
    return features;
  }

  private detectMethodology(description: string): 'tdd' | 'bdd' | 'atdd' | 'traditional' {
    if (description.includes('tdd') || description.includes('test-driven')) return 'tdd';
    if (description.includes('bdd') || description.includes('behavior')) return 'bdd';
    if (description.includes('atdd') || description.includes('acceptance')) return 'atdd';
    return 'traditional';
  }

  private detectTestDataApproach(description: string): 'static' | 'dynamic' | 'generated' {
    if (description.includes('generated') || description.includes('faker')) return 'generated';
    if (description.includes('dynamic') || description.includes('random')) return 'dynamic';
    return 'static';
  }

  private defineTestLayers(requirements: any): string[] {
    const layers = [];
    
    if (requirements.type === 'unit') {
      layers.push('Component Tests', 'Function Tests', 'Class Tests');
    } else if (requirements.type === 'integration') {
      layers.push('API Tests', 'Database Tests', 'Service Tests');
    } else if (requirements.type === 'e2e') {
      layers.push('User Journey Tests', 'Cross-Browser Tests', 'Mobile Tests');
    } else if (requirements.type === 'performance') {
      layers.push('Load Tests', 'Stress Tests', 'Spike Tests', 'Soak Tests');
    }
    
    return layers;
  }

  private defineTestPriorities(task: SwarmTask, requirements: any): string[] {
    const priorities = [];
    
    if (task.priority === 'critical') {
      priorities.push('Critical Path Testing', 'Security Testing', 'Data Integrity');
    }
    
    if (requirements.features.includes('authentication')) {
      priorities.push('Authentication Flow', 'Authorization Checks');
    }
    
    if (requirements.features.includes('payment')) {
      priorities.push('Payment Processing', 'Transaction Integrity');
    }
    
    priorities.push('Happy Path', 'Error Handling', 'Edge Cases');
    
    return priorities;
  }

  private identifyRiskAreas(task: SwarmTask): string[] {
    const risks = [];
    const description = task.description.toLowerCase();
    
    if (description.includes('payment') || description.includes('financial')) {
      risks.push('Financial Calculations', 'Transaction Processing');
    }
    
    if (description.includes('user data') || description.includes('personal')) {
      risks.push('Data Privacy', 'PII Handling');
    }
    
    if (description.includes('third-party') || description.includes('integration')) {
      risks.push('External Dependencies', 'API Reliability');
    }
    
    if (description.includes('performance') || description.includes('scale')) {
      risks.push('Scalability', 'Resource Usage');
    }
    
    return risks;
  }

  private calculateTestPyramid(requirements: any): { unit: number; integration: number; e2e: number } {
    if (requirements.type === 'unit') {
      return { unit: 70, integration: 20, e2e: 10 };
    } else if (requirements.type === 'integration') {
      return { unit: 50, integration: 35, e2e: 15 };
    } else if (requirements.type === 'e2e') {
      return { unit: 40, integration: 30, e2e: 30 };
    }
    return { unit: 60, integration: 25, e2e: 15 };
  }

  private extractCode(response: string): string {
    const codeMatch = response.match(/```(?:typescript|javascript)?\n([\s\S]*?)```/);
    return codeMatch ? codeMatch[1] : response;
  }

  private extractSetup(response: string): string {
    const setupMatch = response.match(/(?:beforeEach|beforeAll|setup)\s*\([^)]*\)\s*(?:=>)?\s*{[\s\S]*?}/);
    return setupMatch ? setupMatch[0] : '';
  }

  private estimateCoverage(response: string): string {
    const testCount = (response.match(/test\(|it\(/g) || []).length;
    const coverage = Math.min(95, testCount * 5 + 50);
    return `Estimated ${coverage}% based on ${testCount} test cases`;
  }

  private identifyUncoveredAreas(tests: string): string[] {
    const uncovered = [];
    
    if (!tests.includes('error') && !tests.includes('catch')) {
      uncovered.push('Error handling');
    }
    
    if (!tests.includes('edge') && !tests.includes('boundary')) {
      uncovered.push('Edge cases');
    }
    
    if (!tests.includes('null') && !tests.includes('undefined')) {
      uncovered.push('Null/undefined handling');
    }
    
    return uncovered;
  }

  private generateCoverageSuggestions(current: number, target: number): string[] {
    const suggestions = [];
    
    if (current < target) {
      const gap = target - current;
      if (gap > 20) {
        suggestions.push('Add more test cases for edge scenarios');
        suggestions.push('Include negative test cases');
      }
      if (gap > 10) {
        suggestions.push('Test error handling paths');
        suggestions.push('Add boundary value tests');
      }
      suggestions.push(`Need ${Math.ceil(gap / 5)} more test cases to reach target`);
    }
    
    return suggestions;
  }

  // Interface implementations
  public async validateSwarmOutput(output: any): Promise<boolean> {
    if (!output || typeof output !== 'object') return false;
    if (!output.tests || typeof output.tests !== 'string') return false;
    
    const validation = await this.validateTests(output.tests);
    return validation.isValid && validation.score >= 75;
  }

  private convertToSwarmTask(task: Task): SwarmTask {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: 'pending',
      dependencies: task.dependencies,
      metadata: task.metadata,
      complexity: task.estimatedComplexity || 5,
      domain: ['testing'],
      estimatedTime: (task.estimatedComplexity || 5) * 3,
      subtasks: [],
      context: task.metadata || {},
      requirements: {
        codeQuality: 10,
        performance: 7,
        security: 8,
        maintainability: 9
      },
      constraints: task.metadata?.constraints || [],
      successCriteria: ['All tests pass', 'Coverage target met', 'No flaky tests'],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }

  public async processTask(task: Task): Promise<AgentResponse> {
    const swarmTask = this.convertToSwarmTask(task);
    return this.processSwarmTask(swarmTask);
  }

  public async generateResponse(input: string, context: any): Promise<string> {
    const taskContext: TaskContext = {
      type: 'testing',
      complexity: 'medium',
      urgency: 'high',
      qualityRequirement: 'perfect',
      domain: ['testing'],
      languages: this.capabilities.languages,
      frameworks: this.capabilities.frameworks
    };

    return this.aiProvider.generateText(
      `Testing Expert Assistant: ${input}`,
      {
        adaptiveModelSelection: true,
        temperature: 0.1
      },
      taskContext
    );
  }
}

// Export all enhanced agents
export {
  EnhancedFrontendSwarmAgent as FrontendSwarmAgent,
  EnhancedBackendSwarmAgent as BackendSwarmAgent,
  EnhancedTestingSwarmAgent as TestingSwarmAgent
};

