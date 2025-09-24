// 🔍 QUALITY VALIDATOR - Advanced Quality Assurance and Validation System
// Comprehensive quality validation for swarm-generated code and solutions

export interface QualityMetrics {
  codeQuality: number; // 0-100
  performance: number; // 0-100
  security: number; // 0-100
  maintainability: number; // 0-100
  testability: number; // 0-100
  documentation: number; // 0-100
  overall: number; // 0-100
}

export interface ValidationResult {
  isValid: boolean;
  qualityScore: number;
  metrics: QualityMetrics;
  issues: ValidationIssue[];
  suggestions: string[];
  confidence: number;
  timestamp: Date;
}

export interface ValidationIssue {
  type: 'error' | 'warning' | 'suggestion';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'syntax' | 'logic' | 'performance' | 'security' | 'style' | 'best_practices';
  message: string;
  line?: number;
  column?: number;
  suggestion?: string;
  code?: string;
}

export interface CodeAnalysis {
  language: string;
  complexity: number;
  linesOfCode: number;
  functions: number;
  classes: number;
  imports: string[];
  dependencies: string[];
  patterns: string[];
  smells: string[];
}

export class QualityValidator {
  private validationRules: Map<string, ValidationRule[]> = new Map();
  private qualityThresholds: QualityThresholds;
  private performanceBaselines: Map<string, number> = new Map();

  constructor() {
    this.qualityThresholds = {
      minimum: 60,
      good: 75,
      excellent: 90,
      critical: 50
    };
    
    this.initializeValidationRules();
    this.initializePerformanceBaselines();
  }

  // 🔍 Main Validation Methods
  public async validateResult(result: any): Promise<any> {
    const validationResult: ValidationResult = {
      isValid: true,
      qualityScore: 0,
      metrics: {
        codeQuality: 0,
        performance: 0,
        security: 0,
        maintainability: 0,
        testability: 0,
        documentation: 0,
        overall: 0
      },
      issues: [],
      suggestions: [],
      confidence: result.response?.confidence || 0,
      timestamp: new Date()
    };

    try {
      // Extract code from result
      const codeContent = this.extractCodeContent(result);
      
      if (codeContent) {
        // Analyze code quality
        const codeAnalysis = await this.analyzeCode(codeContent);
        
        // Validate against rules
        const issues = await this.validateCode(codeContent, codeAnalysis);
        validationResult.issues = issues;
        
        // Calculate quality metrics
        validationResult.metrics = await this.calculateQualityMetrics(codeContent, codeAnalysis, issues);
        validationResult.qualityScore = validationResult.metrics.overall;
        
        // Generate suggestions
        validationResult.suggestions = this.generateSuggestions(issues, codeAnalysis);
        
        // Determine validity
        validationResult.isValid = this.determineValidity(validationResult);
      } else {
        // For non-code results, validate content quality
        validationResult.metrics = await this.validateContentQuality(result);
        validationResult.qualityScore = validationResult.metrics.overall;
        validationResult.isValid = validationResult.qualityScore >= this.qualityThresholds.minimum;
      }

      // Add quality score to result
      result.qualityScore = validationResult.qualityScore;
      result.validationResult = validationResult;

      return result;
      
    } catch (error) {
      console.error('Validation error:', error);
      validationResult.isValid = false;
      validationResult.issues.push({
        type: 'error',
        severity: 'critical',
        category: 'logic',
        message: `Validation failed: ${error.message}`
      });
      
      result.qualityScore = 0;
      result.validationResult = validationResult;
      return result;
    }
  }

  public async validateCode(code: string, analysis?: CodeAnalysis): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    if (!analysis) {
      analysis = await this.analyzeCode(code);
    }

    // Validate syntax
    issues.push(...await this.validateSyntax(code, analysis));
    
    // Validate logic
    issues.push(...await this.validateLogic(code, analysis));
    
    // Validate performance
    issues.push(...await this.validatePerformance(code, analysis));
    
    // Validate security
    issues.push(...await this.validateSecurity(code, analysis));
    
    // Validate best practices
    issues.push(...await this.validateBestPractices(code, analysis));
    
    // Validate style
    issues.push(...await this.validateStyle(code, analysis));

    return issues;
  }

  // 📊 Quality Metrics Calculation
  private async calculateQualityMetrics(
    code: string, 
    analysis: CodeAnalysis, 
    issues: ValidationIssue[]
  ): Promise<QualityMetrics> {
    const metrics: QualityMetrics = {
      codeQuality: 0,
      performance: 0,
      security: 0,
      maintainability: 0,
      testability: 0,
      documentation: 0,
      overall: 0
    };

    // Calculate code quality
    metrics.codeQuality = this.calculateCodeQuality(analysis, issues);
    
    // Calculate performance
    metrics.performance = this.calculatePerformance(analysis, issues);
    
    // Calculate security
    metrics.security = this.calculateSecurity(analysis, issues);
    
    // Calculate maintainability
    metrics.maintainability = this.calculateMaintainability(analysis, issues);
    
    // Calculate testability
    metrics.testability = this.calculateTestability(analysis, issues);
    
    // Calculate documentation
    metrics.documentation = this.calculateDocumentation(code, analysis);
    
    // Calculate overall score
    metrics.overall = this.calculateOverallScore(metrics);

    return metrics;
  }

  private calculateCodeQuality(analysis: CodeAnalysis, issues: ValidationIssue[]): number {
    let score = 100;
    
    // Deduct for complexity
    if (analysis.complexity > 10) score -= 20;
    else if (analysis.complexity > 5) score -= 10;
    
    // Deduct for code smells
    score -= analysis.smells.length * 5;
    
    // Deduct for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'critical': score -= 20; break;
        case 'high': score -= 10; break;
        case 'medium': score -= 5; break;
        case 'low': score -= 2; break;
      }
    });
    
    return Math.max(0, score);
  }

  private calculatePerformance(analysis: CodeAnalysis, issues: ValidationIssue[]): number {
    let score = 100;
    
    // Check for performance issues
    const performanceIssues = issues.filter(issue => issue.category === 'performance');
    score -= performanceIssues.length * 10;
    
    // Check for inefficient patterns
    const inefficientPatterns = analysis.patterns.filter(pattern => 
      ['nested_loops', 'recursive_calls', 'large_objects'].includes(pattern)
    );
    score -= inefficientPatterns.length * 5;
    
    return Math.max(0, score);
  }

  private calculateSecurity(analysis: CodeAnalysis, issues: ValidationIssue[]): number {
    let score = 100;
    
    // Check for security issues
    const securityIssues = issues.filter(issue => issue.category === 'security');
    score -= securityIssues.length * 15;
    
    // Check for dangerous patterns
    const dangerousPatterns = analysis.patterns.filter(pattern => 
      ['eval', 'innerHTML', 'dangerous_imports'].includes(pattern)
    );
    score -= dangerousPatterns.length * 10;
    
    return Math.max(0, score);
  }

  private calculateMaintainability(analysis: CodeAnalysis, issues: ValidationIssue[]): number {
    let score = 100;
    
    // Check code structure
    if (analysis.linesOfCode > 200) score -= 10;
    if (analysis.functions > 20) score -= 5;
    if (analysis.classes > 10) score -= 5;
    
    // Check for maintainability issues
    const maintainabilityIssues = issues.filter(issue => 
      issue.category === 'best_practices' || issue.category === 'style'
    );
    score -= maintainabilityIssues.length * 3;
    
    return Math.max(0, score);
  }

  private calculateTestability(analysis: CodeAnalysis, issues: ValidationIssue[]): number {
    let score = 100;
    
    // Check for testable patterns
    const testablePatterns = analysis.patterns.filter(pattern => 
      ['pure_functions', 'dependency_injection', 'mockable'].includes(pattern)
    );
    score += testablePatterns.length * 5;
    
    // Check for untestable patterns
    const untestablePatterns = analysis.patterns.filter(pattern => 
      ['static_methods', 'global_state', 'tight_coupling'].includes(pattern)
    );
    score -= untestablePatterns.length * 10;
    
    return Math.max(0, Math.min(100, score));
  }

  private calculateDocumentation(code: string, analysis: CodeAnalysis): number {
    let score = 0;
    
    // Check for comments
    const commentLines = (code.match(/\/\/.*|\/\*[\s\S]*?\*\//g) || []).length;
    const commentRatio = commentLines / analysis.linesOfCode;
    
    if (commentRatio > 0.2) score += 40;
    else if (commentRatio > 0.1) score += 20;
    else if (commentRatio > 0.05) score += 10;
    
    // Check for JSDoc/TypeDoc
    const docComments = (code.match(/\/\*\*[\s\S]*?\*\//g) || []).length;
    if (docComments > 0) score += 30;
    
    // Check for README or documentation files
    if (code.includes('README') || code.includes('documentation')) score += 30;
    
    return Math.min(100, score);
  }

  private calculateOverallScore(metrics: QualityMetrics): number {
    const weights = {
      codeQuality: 0.25,
      performance: 0.20,
      security: 0.20,
      maintainability: 0.15,
      testability: 0.10,
      documentation: 0.10
    };
    
    return Math.round(
      metrics.codeQuality * weights.codeQuality +
      metrics.performance * weights.performance +
      metrics.security * weights.security +
      metrics.maintainability * weights.maintainability +
      metrics.testability * weights.testability +
      metrics.documentation * weights.documentation
    );
  }

  // 🔍 Code Analysis
  private async analyzeCode(code: string): Promise<CodeAnalysis> {
    const analysis: CodeAnalysis = {
      language: this.detectLanguage(code),
      complexity: this.calculateComplexity(code),
      linesOfCode: this.countLinesOfCode(code),
      functions: this.countFunctions(code),
      classes: this.countClasses(code),
      imports: this.extractImports(code),
      dependencies: this.extractDependencies(code),
      patterns: this.detectPatterns(code),
      smells: this.detectCodeSmells(code)
    };

    return analysis;
  }

  private detectLanguage(code: string): string {
    if (code.includes('import React') || code.includes('from "react"')) return 'typescript';
    if (code.includes('function') && code.includes('=>')) return 'javascript';
    if (code.includes('class ') && code.includes('extends')) return 'typescript';
    if (code.includes('def ') || code.includes('import ')) return 'python';
    if (code.includes('package ') || code.includes('public class')) return 'java';
    return 'unknown';
  }

  private calculateComplexity(code: string): number {
    let complexity = 1;
    
    // Count control structures
    const controlStructures = ['if', 'else', 'for', 'while', 'switch', 'case', 'catch', 'try'];
    controlStructures.forEach(structure => {
      const matches = code.match(new RegExp(`\\b${structure}\\b`, 'g'));
      if (matches) complexity += matches.length;
    });
    
    // Count nested structures
    const nestedLevel = this.calculateNestingLevel(code);
    complexity += nestedLevel * 2;
    
    return complexity;
  }

  private calculateNestingLevel(code: string): number {
    let maxNesting = 0;
    let currentNesting = 0;
    
    for (const char of code) {
      if (char === '{' || char === '(') {
        currentNesting++;
        maxNesting = Math.max(maxNesting, currentNesting);
      } else if (char === '}' || char === ')') {
        currentNesting--;
      }
    }
    
    return maxNesting;
  }

  private countLinesOfCode(code: string): number {
    return code.split('\n').filter(line => line.trim().length > 0).length;
  }

  private countFunctions(code: string): number {
    const functionPatterns = [
      /function\s+\w+\s*\(/g,
      /const\s+\w+\s*=\s*\(/g,
      /=>\s*{/g,
      /def\s+\w+\s*\(/g
    ];
    
    let count = 0;
    functionPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) count += matches.length;
    });
    
    return count;
  }

  private countClasses(code: string): number {
    const classPatterns = [
      /class\s+\w+/g,
      /interface\s+\w+/g,
      /type\s+\w+\s*=/g
    ];
    
    let count = 0;
    classPatterns.forEach(pattern => {
      const matches = code.match(pattern);
      if (matches) count += matches.length;
    });
    
    return count;
  }

  private extractImports(code: string): string[] {
    const importPatterns = [
      /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
      /import\s+['"]([^'"]+)['"]/g,
      /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g
    ];
    
    const imports: string[] = [];
    importPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        imports.push(match[1]);
      }
    });
    
    return [...new Set(imports)];
  }

  private extractDependencies(code: string): string[] {
    // Extract package dependencies from imports
    return this.extractImports(code).filter(imp => 
      !imp.startsWith('.') && !imp.startsWith('/')
    );
  }

  private detectPatterns(code: string): string[] {
    const patterns: string[] = [];
    
    // Design patterns
    if (code.includes('new ') && code.includes('class')) patterns.push('factory');
    if (code.includes('extends') || code.includes('implements')) patterns.push('inheritance');
    if (code.includes('interface') && code.includes('implements')) patterns.push('strategy');
    if (code.includes('singleton') || code.includes('getInstance')) patterns.push('singleton');
    
    // Performance patterns
    if (code.includes('for (') && code.includes('for (')) patterns.push('nested_loops');
    if (code.includes('function ') && code.includes('function ')) patterns.push('recursive_calls');
    if (code.includes('new Array') || code.includes('new Object')) patterns.push('large_objects');
    
    // Security patterns
    if (code.includes('eval(')) patterns.push('eval');
    if (code.includes('innerHTML')) patterns.push('innerHTML');
    if (code.includes('dangerous_imports')) patterns.push('dangerous_imports');
    
    return patterns;
  }

  private detectCodeSmells(code: string): string[] {
    const smells: string[] = [];
    
    // Long methods
    const lines = code.split('\n');
    if (lines.length > 50) smells.push('long_method');
    
    // Large classes
    const classCount = this.countClasses(code);
    if (classCount > 10) smells.push('large_class');
    
    // Duplicate code
    const duplicateLines = this.findDuplicateLines(code);
    if (duplicateLines.length > 5) smells.push('duplicate_code');
    
    // Dead code
    if (code.includes('unused') || code.includes('deprecated')) smells.push('dead_code');
    
    return smells;
  }

  private findDuplicateLines(code: string): string[] {
    const lines = code.split('\n');
    const lineCounts = new Map<string, number>();
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.length > 10) {
        lineCounts.set(trimmed, (lineCounts.get(trimmed) || 0) + 1);
      }
    });
    
    return Array.from(lineCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([line, _]) => line);
  }

  // 🔍 Validation Methods
  private async validateSyntax(code: string, analysis: CodeAnalysis): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    // Check for basic syntax issues
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    
    if (openBraces !== closeBraces) {
      issues.push({
        type: 'error',
        severity: 'critical',
        category: 'syntax',
        message: 'Mismatched braces in code'
      });
    }
    
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    
    if (openParens !== closeParens) {
      issues.push({
        type: 'error',
        severity: 'critical',
        category: 'syntax',
        message: 'Mismatched parentheses in code'
      });
    }
    
    return issues;
  }

  private async validateLogic(code: string, analysis: CodeAnalysis): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    // Check for logical issues
    if (code.includes('== true') || code.includes('== false')) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        category: 'logic',
        message: 'Redundant boolean comparison',
        suggestion: 'Use direct boolean evaluation instead'
      });
    }
    
    if (code.includes('if (true)') || code.includes('if (false)')) {
      issues.push({
        type: 'warning',
        severity: 'high',
        category: 'logic',
        message: 'Dead code detected in conditional statement'
      });
    }
    
    return issues;
  }

  private async validatePerformance(code: string, analysis: CodeAnalysis): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    // Check for performance issues
    if (analysis.patterns.includes('nested_loops')) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        category: 'performance',
        message: 'Nested loops detected - consider optimization',
        suggestion: 'Use more efficient algorithms or data structures'
      });
    }
    
    if (code.includes('document.getElementById') && code.includes('for')) {
      issues.push({
        type: 'warning',
        severity: 'medium',
        category: 'performance',
        message: 'DOM queries in loop - consider caching',
        suggestion: 'Cache DOM elements outside the loop'
      });
    }
    
    return issues;
  }

  private async validateSecurity(code: string, analysis: CodeAnalysis): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    // Check for security issues
    if (code.includes('eval(')) {
      issues.push({
        type: 'error',
        severity: 'critical',
        category: 'security',
        message: 'Use of eval() is dangerous',
        suggestion: 'Use safer alternatives like JSON.parse() or Function constructor'
      });
    }
    
    if (code.includes('innerHTML') && code.includes('user')) {
      issues.push({
        type: 'error',
        severity: 'high',
        category: 'security',
        message: 'Potential XSS vulnerability with innerHTML',
        suggestion: 'Use textContent or sanitize input'
      });
    }
    
    return issues;
  }

  private async validateBestPractices(code: string, analysis: CodeAnalysis): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    // Check for best practices
    if (analysis.linesOfCode > 200) {
      issues.push({
        type: 'suggestion',
        severity: 'medium',
        category: 'best_practices',
        message: 'File is quite large - consider splitting into smaller modules'
      });
    }
    
    if (analysis.complexity > 10) {
      issues.push({
        type: 'suggestion',
        severity: 'medium',
        category: 'best_practices',
        message: 'High cyclomatic complexity - consider refactoring'
      });
    }
    
    return issues;
  }

  private async validateStyle(code: string, analysis: CodeAnalysis): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    
    // Check for style issues
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      if (line.length > 120) {
        issues.push({
          type: 'suggestion',
          severity: 'low',
          category: 'style',
          message: 'Line too long',
          line: index + 1,
          suggestion: 'Consider breaking into multiple lines'
        });
      }
    });
    
    return issues;
  }

  // 🛠️ Utility Methods
  private extractCodeContent(result: any): string | null {
    if (result.response?.content) {
      const content = result.response.content;
      
      // Try to extract code blocks
      const codeBlocks = content.match(/```[\s\S]*?```/g);
      if (codeBlocks) {
        return codeBlocks.map(block => 
          block.replace(/```\w*\n?/, '').replace(/```$/, '')
        ).join('\n');
      }
      
      // If no code blocks, return the content if it looks like code
      if (content.includes('function') || content.includes('class') || content.includes('import')) {
        return content;
      }
    }
    
    return null;
  }

  private async validateContentQuality(result: any): Promise<QualityMetrics> {
    const metrics: QualityMetrics = {
      codeQuality: 0,
      performance: 0,
      security: 0,
      maintainability: 0,
      testability: 0,
      documentation: 0,
      overall: 0
    };

    const content = result.response?.content || '';
    const confidence = result.response?.confidence || 0;
    
    // Base score on confidence
    const baseScore = confidence * 100;
    
    // Adjust based on content quality indicators
    let qualityScore = baseScore;
    
    if (content.includes('TODO') || content.includes('FIXME')) {
      qualityScore -= 10;
    }
    
    if (content.includes('error') || content.includes('bug')) {
      qualityScore -= 5;
    }
    
    if (content.length > 1000) {
      qualityScore += 5; // Longer content is usually better
    }
    
    metrics.codeQuality = Math.max(0, Math.min(100, qualityScore));
    metrics.overall = metrics.codeQuality;
    
    return metrics;
  }

  private generateSuggestions(issues: ValidationIssue[], analysis: CodeAnalysis): string[] {
    const suggestions: string[] = [];
    
    // Generate suggestions based on issues
    issues.forEach(issue => {
      if (issue.suggestion) {
        suggestions.push(issue.suggestion);
      }
    });
    
    // Generate suggestions based on analysis
    if (analysis.complexity > 10) {
      suggestions.push('Consider breaking down complex functions into smaller, more manageable pieces');
    }
    
    if (analysis.smells.includes('long_method')) {
      suggestions.push('Refactor long methods to improve readability and maintainability');
    }
    
    if (analysis.smells.includes('duplicate_code')) {
      suggestions.push('Extract common code into reusable functions or utilities');
    }
    
    return [...new Set(suggestions)]; // Remove duplicates
  }

  private determineValidity(validationResult: ValidationResult): boolean {
    // Check if there are critical errors
    const criticalErrors = validationResult.issues.filter(issue => 
      issue.type === 'error' && issue.severity === 'critical'
    );
    
    if (criticalErrors.length > 0) {
      return false;
    }
    
    // Check quality threshold
    return validationResult.qualityScore >= this.qualityThresholds.minimum;
  }

  private initializeValidationRules(): void {
    // Initialize validation rules for different languages
    this.validationRules.set('typescript', [
      { name: 'no-any', severity: 'medium', message: 'Avoid using any type' },
      { name: 'no-unused-vars', severity: 'low', message: 'Remove unused variables' },
      { name: 'prefer-const', severity: 'low', message: 'Use const for variables that are not reassigned' }
    ]);
    
    this.validationRules.set('javascript', [
      { name: 'no-var', severity: 'medium', message: 'Use let or const instead of var' },
      { name: 'no-console', severity: 'low', message: 'Remove console statements in production code' }
    ]);
  }

  private initializePerformanceBaselines(): void {
    // Initialize performance baselines for different operations
    this.performanceBaselines.set('dom_query', 100); // ms
    this.performanceBaselines.set('api_call', 500); // ms
    this.performanceBaselines.set('file_read', 50); // ms
  }

  // Public API
  public getQualityThresholds(): QualityThresholds {
    return { ...this.qualityThresholds };
  }

  public setQualityThresholds(thresholds: Partial<QualityThresholds>): void {
    this.qualityThresholds = { ...this.qualityThresholds, ...thresholds };
  }
}

interface ValidationRule {
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

interface QualityThresholds {
  minimum: number;
  good: number;
  excellent: number;
  critical: number;
}

