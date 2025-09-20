// 🐝 SWARM SPECIALIZED AGENTS - Production-Ready Specialized Swarm Agents
// Advanced specialized agents for different development domains

import { SwarmAgent } from '@/lib/swarm/swarm-agent';
import { AgentRole, Task, AgentResponse } from '@/types/agents';
import { SwarmTask, SwarmAgentCapabilities } from '@/lib/swarm/swarm-agent';
import { OpenAIClient } from '@/lib/ai/openai-client';
import { openaiConfig } from '@/config/environment';

// 🏗️ Frontend Swarm Agent
export class FrontendSwarmAgent extends SwarmAgent {
  private openaiClient: OpenAIClient;

  constructor(id: string = 'frontend_swarm_01') {
    const capabilities: SwarmAgentCapabilities = {
      canCoordinate: false,
      canExecuteCode: true,
      canAnalyzeRequirements: true,
      canReview: true,
      canOptimize: true,
      canTest: false,
      canDocument: true,
      canDeploy: false,
      specializedSkills: ['component-design', 'state-management', 'routing', 'styling'],
      domains: ['frontend', 'ui', 'ux', 'web'],
      languages: ['typescript', 'javascript', 'css', 'html'],
      frameworks: ['react', 'vue', 'angular', 'svelte', 'nextjs', 'nuxt'],
      tools: ['vite', 'webpack', 'esbuild', 'tailwind', 'styled-components'],
      maxComplexity: 8,
      parallelTasks: 3,
      specialization: ['component-design', 'state-management', 'routing', 'styling'],
      collaborationStyle: 'collaborative'
    };

    super(id, AgentRole.DEVELOPER, capabilities);
    this.openaiClient = new OpenAIClient({
      ...openaiConfig,
      fallbackModels: ['gpt-3.5-turbo', 'gpt-4-turbo-preview']
    });
  }

  public async initializeAgent(): Promise<void> {
    // Call parent initializeAgent first to ensure proper setup
    if (this.swarmContext) {
      this.updateContext('specialty', 'Frontend Development & UI/UX Implementation');
      this.updateContext('expertise', ['React', 'TypeScript', 'Tailwind CSS', 'Component Architecture']);
      this.updateContext('focus_areas', ['user-interface', 'user-experience', 'performance', 'accessibility']);
      
      this.swarmContext.set('current_framework', 'react');
      this.swarmContext.set('styling_approach', 'tailwind');
      this.swarmContext.set('state_management', 'context');
    }
  }

  public async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    console.log(`🎨 Frontend Swarm Agent processing: ${task.title}`);
    
    try {
      const requirements = this.analyzeFrontendRequirements(task);
      const codeResult = await this.generateFrontendCode(task, requirements);
      const validation = await this.validateFrontendCode(codeResult.code);
      
      return {
        agentId: this.id,
        taskId: task.id,
        response: {
          type: 'code',
          content: this.formatFrontendResponse(codeResult, validation),
          confidence: codeResult.confidence,
          reasoning: `Generated ${requirements.type} component with ${requirements.framework}`
        },
        nextActions: ['Review code', 'Test component', 'Deploy if approved']
      };
      
    } catch (error) {
      console.error('Frontend task processing failed:', error);
      throw error;
    }
  }

  public async validateSwarmOutput(output: any): Promise<boolean> {
    if (!output || typeof output !== 'object') return false;
    if (!output.code || typeof output.code !== 'string') return false;
    
    // Basic validation for frontend code
    const hasReactImport = output.code.includes('import React') || output.code.includes('from "react"');
    const hasExport = output.code.includes('export');
    
    return hasReactImport && hasExport;
  }

  public async processTask(task: Task): Promise<AgentResponse> {
    const swarmTask = this.convertToSwarmTask(task);
    return this.processSwarmTask(swarmTask);
  }

  public async generateResponse(input: string, context: any): Promise<string> {
    const frontendContext = this.extractFrontendContext(input, context);
    return this.generateFrontendGuidance(frontendContext);
  }

  private analyzeFrontendRequirements(task: SwarmTask): {
    type: 'component' | 'page' | 'hook' | 'utility';
    framework: string;
    styling: string;
    stateManagement: string;
    features: string[];
  } {
    const description = task.description.toLowerCase();
    
    let type: 'component' | 'page' | 'hook' | 'utility' = 'component';
    if (description.includes('page') || description.includes('route')) type = 'page';
    if (description.includes('hook') || description.includes('custom hook')) type = 'hook';
    if (description.includes('utility') || description.includes('helper')) type = 'utility';
    
    const framework = this.detectFramework(description);
    const styling = this.detectStylingApproach(description);
    const stateManagement = this.detectStateManagement(description);
    const features = this.extractFeatures(description);
    
    return { type, framework, styling, stateManagement, features };
  }

  private async generateFrontendCode(task: SwarmTask, requirements: any): Promise<{
    code: string;
    explanation: string;
    confidence: number;
    tokens: number;
    cost: number;
  }> {
    const prompt = this.buildFrontendPrompt(task, requirements);
    const context = this.buildFrontendContext(requirements);
    
    return await this.openaiClient.generateCode(prompt, context, {
      language: 'typescript',
      framework: requirements.framework,
      complexity: task.complexity || 5
    });
  }

  private async validateFrontendCode(code: string): Promise<{
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!code.includes('export')) {
      issues.push('Missing export statement');
    }
    
    if (code.includes('any')) {
      suggestions.push('Consider using specific types instead of any');
    }
    
    if (!code.includes('React.FC') && code.includes('function')) {
      suggestions.push('Consider using React.FC for better type safety');
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }

  private buildFrontendPrompt(task: SwarmTask, requirements: any): string {
    return `Create a ${requirements.type} for: ${task.title}

Description: ${task.description}

Requirements:
- Framework: ${requirements.framework}
- Styling: ${requirements.styling}
- State Management: ${requirements.stateManagement}
- Features: ${requirements.features.join(', ')}

Please generate production-ready code that follows best practices.`;
  }

  private buildFrontendContext(requirements: any): string {
    return `Current project setup:
- Framework: ${requirements.framework}
- Styling: ${requirements.styling}
- State Management: ${requirements.stateManagement}
- TypeScript enabled
- Modern React patterns preferred`;
  }

  private formatFrontendResponse(codeResult: any, validation: any): string {
    return `
🎨 **Frontend Component Generated**

\`\`\`typescript
${codeResult.code}
\`\`\`

**Explanation:**
${codeResult.explanation}

**Validation Results:**
- Valid: ${validation.isValid ? '✅' : '❌'}
${validation.issues.length > 0 ? `- Issues: ${validation.issues.join(', ')}` : ''}
${validation.suggestions.length > 0 ? `- Suggestions: ${validation.suggestions.join(', ')}` : ''}

**Quality Metrics:**
- Confidence: ${(codeResult.confidence * 100).toFixed(1)}%
- Tokens Used: ${codeResult.tokens}
- Cost: $${codeResult.cost.toFixed(4)}
    `.trim();
  }

  // Helper methods
  private detectFramework(description: string): string {
    if (description.includes('vue')) return 'vue';
    if (description.includes('angular')) return 'angular';
    if (description.includes('svelte')) return 'svelte';
    if (description.includes('next')) return 'nextjs';
    if (description.includes('nuxt')) return 'nuxt';
    return 'react';
  }

  private detectStylingApproach(description: string): string {
    if (description.includes('tailwind')) return 'tailwind';
    if (description.includes('styled-components')) return 'styled-components';
    if (description.includes('emotion')) return 'emotion';
    if (description.includes('scss') || description.includes('sass')) return 'scss';
    return 'tailwind';
  }

  private detectStateManagement(description: string): string {
    if (description.includes('redux')) return 'redux';
    if (description.includes('zustand')) return 'zustand';
    if (description.includes('jotai')) return 'jotai';
    if (description.includes('recoil')) return 'recoil';
    return 'context';
  }

  private extractFeatures(description: string): string[] {
    const features = [];
    if (description.includes('form')) features.push('form-handling');
    if (description.includes('table')) features.push('data-table');
    if (description.includes('modal')) features.push('modal');
    if (description.includes('chart')) features.push('charts');
    if (description.includes('animation')) features.push('animations');
    if (description.includes('responsive')) features.push('responsive-design');
    return features;
  }

  private extractFrontendContext(input: string, context: any): any {
    return {
      input,
      context,
      framework: this.swarmContext.get('current_framework'),
      styling: this.swarmContext.get('styling_approach'),
      stateManagement: this.swarmContext.get('state_management')
    };
  }

  private generateFrontendGuidance(context: any): string {
    return `🎨 **Frontend Development Guidance**

Based on your request about "${context.input}", here's my recommendation:

**Framework:** ${context.framework}
**Styling:** ${context.styling}
**State Management:** ${context.stateManagement}

I can help you with:
- Component architecture and design patterns
- State management implementation
- Styling and responsive design
- Performance optimization
- Accessibility improvements
- Testing strategies

What specific aspect would you like me to focus on?`;
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
      complexity: task.estimatedComplexity,
      domain: ['frontend'],
      estimatedTime: task.estimatedComplexity * 5,
      subtasks: [],
      context: task.metadata || {},
      requirements: {
        codeQuality: 8,
        performance: 7,
        security: 6,
        maintainability: 8
      },
      constraints: task.metadata?.constraints || [],
      successCriteria: ['Component renders correctly', 'Follows design system', 'Responsive design'],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }
}

// 🔧 Backend Swarm Agent
export class BackendSwarmAgent extends SwarmAgent {
  private openaiClient: OpenAIClient;

  constructor(id: string = 'backend_swarm_01') {
    const capabilities: SwarmAgentCapabilities = {
      canCoordinate: false,
      canExecuteCode: true,
      canAnalyzeRequirements: true,
      canReview: true,
      canOptimize: true,
      canTest: false,
      canDocument: true,
      canDeploy: false,
      specializedSkills: ['api-design', 'database-design', 'authentication', 'performance'],
      domains: ['backend', 'api', 'database', 'server'],
      languages: ['typescript', 'javascript', 'python', 'sql'],
      frameworks: ['express', 'fastify', 'nestjs', 'fastapi', 'django'],
      tools: ['prisma', 'mongoose', 'typeorm', 'sequelize', 'postgresql', 'mongodb'],
      maxComplexity: 9,
      parallelTasks: 2,
      specialization: ['api-design', 'database-design', 'authentication', 'performance'],
      collaborationStyle: 'methodical'
    };

    super(id, AgentRole.ENGINEER, capabilities);
    this.openaiClient = new OpenAIClient({
      ...openaiConfig,
      fallbackModels: ['gpt-3.5-turbo', 'gpt-4-turbo-preview']
    });
  }

  public async initializeAgent(): Promise<void> {
    if (this.swarmContext) {
      this.updateContext('specialty', 'Backend Development & API Design');
      this.updateContext('expertise', ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'MongoDB']);
      this.updateContext('focus_areas', ['api-design', 'database-optimization', 'security', 'scalability']);
      
      this.swarmContext.set('current_framework', 'express');
      this.swarmContext.set('database', 'postgresql');
      this.swarmContext.set('orm', 'prisma');
    }
  }

  public async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    console.log(`🔧 Backend Swarm Agent processing: ${task.title}`);
    
    try {
      const requirements = this.analyzeBackendRequirements(task);
      const codeResult = await this.generateBackendCode(task, requirements);
      const validation = await this.validateBackendCode(codeResult.code);
      
      return {
        agentId: this.id,
        taskId: task.id,
        response: {
          type: 'code',
          content: this.formatBackendResponse(codeResult, validation),
          confidence: codeResult.confidence,
          reasoning: `Generated ${requirements.type} with ${requirements.framework}`
        },
        nextActions: ['Review API', 'Test endpoints', 'Deploy if approved']
      };
      
    } catch (error) {
      console.error('Backend task processing failed:', error);
      throw error;
    }
  }

  public async validateSwarmOutput(output: any): Promise<boolean> {
    if (!output || typeof output !== 'object') return false;
    if (!output.code || typeof output.code !== 'string') return false;
    
    // Basic validation for backend code
    const hasExport = output.code.includes('export');
    const hasAsyncFunction = output.code.includes('async') || output.code.includes('function');
    
    return hasExport && hasAsyncFunction;
  }

  public async processTask(task: Task): Promise<AgentResponse> {
    const swarmTask = this.convertToSwarmTask(task);
    return this.processSwarmTask(swarmTask);
  }

  public async generateResponse(input: string, context: any): Promise<string> {
    return `🔧 **Backend Development Response**

I can help you with backend development including:
- API design and implementation
- Database schema design
- Authentication and authorization
- Performance optimization
- Security best practices

What specific backend functionality do you need?`;
  }

  private analyzeBackendRequirements(task: SwarmTask): {
    type: 'api' | 'service' | 'middleware' | 'model';
    framework: string;
    database: string;
    features: string[];
  } {
    const description = task.description.toLowerCase();
    
    let type: 'api' | 'service' | 'middleware' | 'model' = 'api';
    if (description.includes('service')) type = 'service';
    if (description.includes('middleware')) type = 'middleware';
    if (description.includes('model') || description.includes('schema')) type = 'model';
    
    const framework = this.detectBackendFramework(description);
    const database = this.detectDatabase(description);
    const features = this.extractBackendFeatures(description);
    
    return { type, framework, database, features };
  }

  private async generateBackendCode(task: SwarmTask, requirements: any): Promise<any> {
    const prompt = this.buildBackendPrompt(task, requirements);
    const context = this.buildBackendContext(requirements);
    
    return await this.openaiClient.generateCode(prompt, context, {
      language: 'typescript',
      framework: requirements.framework,
      complexity: task.complexity || 5
    });
  }

  private async validateBackendCode(code: string): Promise<any> {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!code.includes('try') && code.includes('async')) {
      suggestions.push('Consider adding error handling for async operations');
    }
    
    if (code.includes('password') && !code.includes('hash')) {
      issues.push('Password should be hashed before storage');
    }
    
    return { isValid: issues.length === 0, issues, suggestions };
  }

  private buildBackendPrompt(task: SwarmTask, requirements: any): string {
    return `Create a ${requirements.type} for: ${task.title}

Description: ${task.description}

Requirements:
- Framework: ${requirements.framework}
- Database: ${requirements.database}
- Features: ${requirements.features.join(', ')}

Please generate production-ready backend code with proper error handling and security.`;
  }

  private buildBackendContext(requirements: any): string {
    return `Backend setup:
- Framework: ${requirements.framework}
- Database: ${requirements.database}
- TypeScript enabled
- Security best practices required`;
  }

  private formatBackendResponse(codeResult: any, validation: any): string {
    return `
🔧 **Backend Code Generated**

\`\`\`typescript
${codeResult.code}
\`\`\`

**Explanation:**
${codeResult.explanation}

**Validation Results:**
- Valid: ${validation.isValid ? '✅' : '❌'}
${validation.issues.length > 0 ? `- Issues: ${validation.issues.join(', ')}` : ''}
${validation.suggestions.length > 0 ? `- Suggestions: ${validation.suggestions.join(', ')}` : ''}

**Quality Metrics:**
- Confidence: ${(codeResult.confidence * 100).toFixed(1)}%
- Tokens Used: ${codeResult.tokens}
- Cost: $${codeResult.cost.toFixed(4)}
    `.trim();
  }

  private detectBackendFramework(description: string): string {
    if (description.includes('fastapi')) return 'fastapi';
    if (description.includes('django')) return 'django';
    if (description.includes('nestjs')) return 'nestjs';
    if (description.includes('fastify')) return 'fastify';
    return 'express';
  }

  private detectDatabase(description: string): string {
    if (description.includes('mongodb')) return 'mongodb';
    if (description.includes('mysql')) return 'mysql';
    if (description.includes('sqlite')) return 'sqlite';
    return 'postgresql';
  }

  private extractBackendFeatures(description: string): string[] {
    const features = [];
    if (description.includes('auth')) features.push('authentication');
    if (description.includes('validation')) features.push('input-validation');
    if (description.includes('cache')) features.push('caching');
    if (description.includes('rate limit')) features.push('rate-limiting');
    if (description.includes('log')) features.push('logging');
    return features;
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
      complexity: task.estimatedComplexity,
      domain: ['backend'],
      estimatedTime: task.estimatedComplexity * 8,
      subtasks: [],
      context: task.metadata || {},
      requirements: {
        codeQuality: 9,
        performance: 8,
        security: 9,
        maintainability: 8
      },
      constraints: task.metadata?.constraints || [],
      successCriteria: ['API endpoints work correctly', 'Proper error handling', 'Security standards met'],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }
}

// 🧪 Testing Swarm Agent
export class TestingSwarmAgent extends SwarmAgent {
  private openaiClient: OpenAIClient;

  constructor(id: string = 'testing_swarm_01') {
    const capabilities: SwarmAgentCapabilities = {
      canCoordinate: false,
      canExecuteCode: false,
      canAnalyzeRequirements: true,
      canReview: true,
      canOptimize: false,
      canTest: true,
      canDocument: true,
      canDeploy: false,
      specializedSkills: ['unit-testing', 'integration-testing', 'e2e-testing', 'test-automation'],
      domains: ['testing', 'quality-assurance', 'validation'],
      languages: ['typescript', 'javascript'],
      frameworks: ['jest', 'vitest', 'cypress', 'playwright', 'testing-library'],
      tools: ['jest', 'vitest', 'cypress', 'playwright', 'supertest'],
      maxComplexity: 7,
      parallelTasks: 4,
      specialization: ['test-design', 'test-automation', 'coverage-analysis', 'ci-cd-integration'],
      collaborationStyle: 'analytical'
    };

    super(id, AgentRole.TESTING, capabilities);
    this.openaiClient = new OpenAIClient({
      ...openaiConfig,
      fallbackModels: ['gpt-3.5-turbo', 'gpt-4-turbo-preview']
    });
  }

  public async initializeAgent(): Promise<void> {
    if (this.swarmContext) {
      this.updateContext('specialty', 'Software Testing & Quality Assurance');
      this.updateContext('expertise', ['Jest', 'Testing Library', 'Cypress', 'Playwright', 'Test Automation']);
      this.updateContext('focus_areas', ['test-coverage', 'quality-assurance', 'automation', 'performance-testing']);
      
      this.swarmContext.set('testing_framework', 'jest');
      this.swarmContext.set('e2e_framework', 'playwright');
      this.swarmContext.set('coverage_target', 80);
    }
  }

  public async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    console.log(`🧪 Testing Swarm Agent processing: ${task.title}`);
    
    try {
      const requirements = this.analyzeTestingRequirements(task);
      const testResult = await this.generateTests(task, requirements);
      const validation = await this.validateTests(testResult.tests);
      
      return {
        agentId: this.id,
        taskId: task.id,
        response: {
          type: 'code',
          content: this.formatTestingResponse(testResult, validation),
          confidence: testResult.confidence,
          reasoning: `Generated ${requirements.type} tests with ${requirements.framework}`
        },
        nextActions: ['Review tests', 'Run test suite', 'Check coverage']
      };
      
    } catch (error) {
      console.error('Testing task processing failed:', error);
      throw error;
    }
  }

  public async validateSwarmOutput(output: any): Promise<boolean> {
    if (!output || typeof output !== 'object') return false;
    if (!output.tests || typeof output.tests !== 'string') return false;
    
    // Basic validation for test code
    const hasTestFramework = output.tests.includes('describe') || output.tests.includes('test') || output.tests.includes('it');
    const hasAssertions = output.tests.includes('expect') || output.tests.includes('assert');
    
    return hasTestFramework && hasAssertions;
  }

  public async processTask(task: Task): Promise<AgentResponse> {
    const swarmTask = this.convertToSwarmTask(task);
    return this.processSwarmTask(swarmTask);
  }

  public async generateResponse(input: string, context: any): Promise<string> {
    return `🧪 **Testing & Quality Assurance Response**

I can help you with software testing including:
- Unit test generation and optimization
- Integration test design
- End-to-end test automation
- Test coverage analysis
- Performance testing strategies
- CI/CD integration

What specific testing needs do you have?`;
  }

  private analyzeTestingRequirements(task: SwarmTask): {
    type: 'unit' | 'integration' | 'e2e' | 'performance';
    framework: string;
    coverage: number;
    features: string[];
  } {
    const description = task.description.toLowerCase();
    
    let type: 'unit' | 'integration' | 'e2e' | 'performance' = 'unit';
    if (description.includes('integration')) type = 'integration';
    if (description.includes('e2e') || description.includes('end-to-end')) type = 'e2e';
    if (description.includes('performance') || description.includes('load')) type = 'performance';
    
    const framework = this.detectTestingFramework(description);
    const coverage = this.extractCoverageTarget(description);
    const features = this.extractTestingFeatures(description);
    
    return { type, framework, coverage, features };
  }

  private async generateTests(task: SwarmTask, requirements: any): Promise<any> {
    const prompt = this.buildTestingPrompt(task, requirements);
    const context = this.buildTestingContext(requirements);
    
    return await this.openaiClient.generateTests(
      prompt,
      requirements.type,
      requirements.framework
    );
  }

  private async validateTests(tests: string): Promise<any> {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    if (!tests.includes('describe') && !tests.includes('test')) {
      issues.push('Missing test structure (describe/test blocks)');
    }
    
    if (!tests.includes('expect')) {
      issues.push('Missing assertions');
    }
    
    if (tests.includes('only')) {
      suggestions.push('Remove .only from tests before committing');
    }
    
    return { isValid: issues.length === 0, issues, suggestions };
  }

  private buildTestingPrompt(task: SwarmTask, requirements: any): string {
    return `Generate ${requirements.type} tests for: ${task.title}

Description: ${task.description}

Requirements:
- Test Type: ${requirements.type}
- Framework: ${requirements.framework}
- Coverage Target: ${requirements.coverage}%
- Features: ${requirements.features.join(', ')}

Please generate comprehensive tests with good coverage and clear assertions.`;
  }

  private buildTestingContext(requirements: any): string {
    return `Testing setup:
- Framework: ${requirements.framework}
- Test Type: ${requirements.type}
- Coverage Target: ${requirements.coverage}%
- TypeScript enabled
- Modern testing patterns preferred`;
  }

  private formatTestingResponse(testResult: any, validation: any): string {
    return `
🧪 **Test Suite Generated**

\`\`\`typescript
${testResult.tests}
\`\`\`

**Coverage Analysis:**
${testResult.coverage}

**Validation Results:**
- Valid: ${validation.isValid ? '✅' : '❌'}
${validation.issues.length > 0 ? `- Issues: ${validation.issues.join(', ')}` : ''}
${validation.suggestions.length > 0 ? `- Suggestions: ${validation.suggestions.join(', ')}` : ''}

**Quality Metrics:**
- Confidence: ${(testResult.confidence * 100).toFixed(1)}%
- Tokens Used: ${testResult.tokens}
- Cost: $${testResult.cost.toFixed(4)}
    `.trim();
  }

  private detectTestingFramework(description: string): string {
    if (description.includes('vitest')) return 'vitest';
    if (description.includes('cypress')) return 'cypress';
    if (description.includes('playwright')) return 'playwright';
    if (description.includes('mocha')) return 'mocha';
    return 'jest';
  }

  private extractCoverageTarget(description: string): number {
    const match = description.match(/(\d+)%?\s*coverage/);
    return match ? parseInt(match[1]) : 80;
  }

  private extractTestingFeatures(description: string): string[] {
    const features = [];
    if (description.includes('mock')) features.push('mocking');
    if (description.includes('snapshot')) features.push('snapshot-testing');
    if (description.includes('async')) features.push('async-testing');
    if (description.includes('component')) features.push('component-testing');
    if (description.includes('api')) features.push('api-testing');
    return features;
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
      complexity: task.estimatedComplexity,
      domain: ['testing'],
      estimatedTime: task.estimatedComplexity * 3,
      subtasks: [],
      context: task.metadata || {},
      requirements: {
        codeQuality: 9,
        performance: 6,
        security: 7,
        maintainability: 8
      },
      constraints: task.metadata?.constraints || [],
      successCriteria: ['Tests pass consistently', 'Good coverage achieved', 'Clear test structure'],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };
  }
}