// 🎯 TECH STACK MANAGER - Intelligent Technology Stack Management System
// Advanced system for managing, recommending, and initializing technology stacks

import { 
  TechStack, 
  TechCategory, 
  ProjectTemplate, 
  ProjectRequirements, 
  TechStackRecommendation,
  TechStackComparison,
  Language,
  Framework,
  Database,
  Tool,
  DeploymentOption
} from '@/types/tech-stack';

export class TechStackManager {
  private techStacks: Map<string, TechStack> = new Map();
  private templates: Map<string, ProjectTemplate> = new Map();
  private recommendations: Map<string, TechStackRecommendation[]> = new Map();

  constructor() {
    this.initializeTechStacks();
    this.initializeTemplates();
  }

  // 🚀 Core Tech Stack Management
  public getTechStack(id: string): TechStack | null {
    return this.techStacks.get(id) || null;
  }

  public getAllTechStacks(): TechStack[] {
    return Array.from(this.techStacks.values());
  }

  public getTechStacksByCategory(category: TechCategory): TechStack[] {
    return this.getAllTechStacks().filter(stack => stack.category === category);
  }

  public getTechStacksByComplexity(complexity: string): TechStack[] {
    return this.getAllTechStacks().filter(stack => stack.complexity === complexity);
  }

  // 🧠 Intelligent Recommendations
  public recommendTechStack(requirements: ProjectRequirements): TechStackRecommendation[] {
    const allStacks = this.getAllTechStacks();
    const recommendations: TechStackRecommendation[] = [];

    for (const stack of allStacks) {
      const score = this.calculateCompatibilityScore(stack, requirements);
      if (score > 0.3) { // Only recommend if compatibility > 30%
        recommendations.push({
          techStack: stack,
          score,
          reasoning: this.generateReasoning(stack, requirements),
          alternatives: this.findAlternatives(stack, requirements),
          considerations: this.generateConsiderations(stack, requirements)
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  // 🔍 Advanced Search and Filtering
  public searchTechStacks(query: string, filters: {
    category?: TechCategory;
    complexity?: string;
    languages?: string[];
    frameworks?: string[];
    enterprise?: boolean;
    openSource?: boolean;
  } = {}): TechStack[] {
    let results = this.getAllTechStacks();

    // Text search
    if (query) {
      const searchTerms = query.toLowerCase().split(' ');
      results = results.filter(stack => 
        searchTerms.some(term => 
          stack.name.toLowerCase().includes(term) ||
          stack.description.toLowerCase().includes(term) ||
          stack.tags.some(tag => tag.toLowerCase().includes(term)) ||
          stack.useCases.some(useCase => useCase.toLowerCase().includes(term))
        )
      );
    }

    // Apply filters
    if (filters.category) {
      results = results.filter(stack => stack.category === filters.category);
    }
    if (filters.complexity) {
      results = results.filter(stack => stack.complexity === filters.complexity);
    }
    if (filters.languages?.length) {
      results = results.filter(stack => 
        filters.languages!.some(lang => 
          stack.languages.some(stackLang => stackLang.name.toLowerCase().includes(lang.toLowerCase()))
        )
      );
    }
    if (filters.frameworks?.length) {
      results = results.filter(stack => 
        filters.frameworks!.some(fw => 
          stack.frameworks.some(stackFw => stackFw.name.toLowerCase().includes(fw.toLowerCase()))
        )
      );
    }
    if (filters.enterprise !== undefined) {
      results = results.filter(stack => stack.enterprise === filters.enterprise);
    }
    if (filters.openSource !== undefined) {
      results = results.filter(stack => stack.openSource === filters.openSource);
    }

    return results;
  }

  // 📊 Comparison System
  public compareTechStacks(stackIds: string[]): TechStackComparison {
    const stacks = stackIds.map(id => this.getTechStack(id)).filter(Boolean) as TechStack[];
    
    if (stacks.length < 2) {
      throw new Error('At least 2 tech stacks required for comparison');
    }

    const criteria = {
      performance: 25,
      learningCurve: 20,
      community: 15,
      enterprise: 15,
      cost: 10,
      scalability: 10,
      security: 5
    };

    const scores: Record<string, Record<string, number>> = {};
    let winner = '';
    let highestScore = 0;

    for (const stack of stacks) {
      scores[stack.id] = {
        performance: stack.performance,
        learningCurve: 100 - stack.learningCurve, // Invert so lower learning curve = higher score
        community: stack.community,
        enterprise: stack.enterprise ? 100 : 0,
        cost: stack.openSource ? 100 : 50, // Simplified cost scoring
        scalability: this.getScalabilityScore(stack.scalability),
        security: this.getSecurityScore(stack.security)
      };

      const totalScore = Object.entries(scores[stack.id]).reduce((sum, [key, value]) => 
        sum + (value * criteria[key as keyof typeof criteria] / 100), 0
      );

      if (totalScore > highestScore) {
        highestScore = totalScore;
        winner = stack.id;
      }
    }

    return {
      stacks,
      criteria,
      scores,
      winner,
      summary: this.generateComparisonSummary(stacks, winner)
    };
  }

  // 🏗️ Project Template Management
  public getTemplate(id: string): ProjectTemplate | null {
    return this.templates.get(id) || null;
  }

  public getTemplatesByTechStack(techStackId: string): ProjectTemplate[] {
    return Array.from(this.templates.values()).filter(template => 
      template.techStack.id === techStackId
    );
  }

  public getTemplatesByCategory(category: TechCategory): ProjectTemplate[] {
    return Array.from(this.templates.values()).filter(template => 
      template.category === category
    );
  }

  // 🎯 Smart Project Initialization
  public async initializeProject(
    templateId: string, 
    projectName: string, 
    customizations: {
      features?: string[];
      configurations?: Record<string, any>;
      integrations?: string[];
    } = {}
  ): Promise<{
    success: boolean;
    projectPath: string;
    files: any[];
    instructions: string[];
    nextSteps: string[];
  }> {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Generate project structure
    const projectStructure = this.generateProjectStructure(template, projectName, customizations);
    
    // Create setup instructions
    const instructions = this.generateSetupInstructions(template, customizations);
    
    // Generate next steps
    const nextSteps = this.generateNextSteps(template, customizations);

    return {
      success: true,
      projectPath: `./${projectName}`,
      files: projectStructure.files,
      instructions,
      nextSteps
    };
  }

  // 🔧 Private Helper Methods
  private calculateCompatibilityScore(stack: TechStack, requirements: ProjectRequirements): number {
    let score = 0;
    let totalWeight = 0;

    // Type compatibility
    const typeWeight = 30;
    totalWeight += typeWeight;
    if (this.isTypeCompatible(stack, requirements.type)) {
      score += typeWeight;
    }

    // Complexity compatibility
    const complexityWeight = 25;
    totalWeight += complexityWeight;
    if (this.isComplexityCompatible(stack, requirements.complexity)) {
      score += complexityWeight;
    }

    // Performance requirements
    const performanceWeight = 20;
    totalWeight += performanceWeight;
    score += (stack.performance / 100) * performanceWeight * this.getPerformanceWeight(requirements.performance);

    // Scalability requirements
    const scalabilityWeight = 15;
    totalWeight += scalabilityWeight;
    score += this.getScalabilityScore(stack.scalability) * scalabilityWeight * this.getScalabilityWeight(requirements.scalability);

    // Enterprise requirements
    const enterpriseWeight = 10;
    totalWeight += enterpriseWeight;
    if (requirements.teamSize === 'large' || requirements.budget === 'unlimited') {
      score += stack.enterprise ? enterpriseWeight : 0;
    } else {
      score += enterpriseWeight; // Non-enterprise stacks are fine for smaller teams
    }

    return score / totalWeight;
  }

  private isTypeCompatible(stack: TechStack, type: string): boolean {
    const typeMapping: Record<string, TechCategory[]> = {
      'web': [TechCategory.WEB_FRONTEND, TechCategory.WEB_BACKEND, TechCategory.FULLSTACK],
      'mobile': [TechCategory.MOBILE],
      'desktop': [TechCategory.DESKTOP],
      'api': [TechCategory.WEB_BACKEND, TechCategory.MICROSERVICES, TechCategory.SERVERLESS],
      'data': [TechCategory.DATA_SCIENCE],
      'ai': [TechCategory.AI_ML, TechCategory.DATA_SCIENCE],
      'game': [TechCategory.GAME_DEVELOPMENT],
      'blockchain': [TechCategory.BLOCKCHAIN]
    };

    return typeMapping[type]?.includes(stack.category) || false;
  }

  private isComplexityCompatible(stack: TechStack, complexity: string): boolean {
    const complexityLevels = ['simple', 'moderate', 'complex', 'enterprise'];
    const stackLevel = complexityLevels.indexOf(stack.complexity);
    const reqLevel = complexityLevels.indexOf(complexity);
    
    return stackLevel >= reqLevel; // Stack complexity should be >= required complexity
  }

  private getPerformanceWeight(performance: string): number {
    const weights = { 'basic': 0.5, 'good': 0.7, 'excellent': 0.9, 'enterprise': 1.0 };
    return weights[performance] || 0.5;
  }

  private getScalabilityScore(scalability: string): number {
    const scores = { 'low': 25, 'medium': 50, 'high': 75, 'enterprise': 100 };
    return scores[scalability] || 50;
  }

  private getScalabilityWeight(scalability: string): number {
    const weights = { 'low': 0.3, 'medium': 0.6, 'high': 0.8, 'enterprise': 1.0 };
    return weights[scalability] || 0.5;
  }

  private getSecurityScore(security: string): number {
    const scores = { 'basic': 25, 'good': 50, 'excellent': 75, 'enterprise': 100 };
    return scores[security] || 50;
  }

  private generateReasoning(stack: TechStack, requirements: ProjectRequirements): string {
    const reasons = [];
    
    if (this.isTypeCompatible(stack, requirements.type)) {
      reasons.push(`Perfect match for ${requirements.type} development`);
    }
    
    if (stack.performance > 80 && requirements.performance === 'excellent') {
      reasons.push('Excellent performance characteristics');
    }
    
    if (stack.enterprise && requirements.teamSize === 'large') {
      reasons.push('Enterprise-ready for large team collaboration');
    }
    
    if (stack.community > 80) {
      reasons.push('Strong community support and documentation');
    }
    
    return reasons.join('. ') || 'Good general-purpose solution';
  }

  private findAlternatives(stack: TechStack, requirements: ProjectRequirements): TechStack[] {
    return this.getAllTechStacks()
      .filter(s => s.id !== stack.id && s.category === stack.category)
      .slice(0, 3);
  }

  private generateConsiderations(stack: TechStack, requirements: ProjectRequirements): string[] {
    const considerations = [];
    
    if (stack.learningCurve > 70) {
      considerations.push('Steep learning curve - consider team expertise');
    }
    
    if (!stack.enterprise && requirements.teamSize === 'large') {
      considerations.push('May need additional enterprise features');
    }
    
    if (stack.maintenance === 'high') {
      considerations.push('Requires significant maintenance effort');
    }
    
    return considerations;
  }

  private generateComparisonSummary(stacks: TechStack[], winner: string): string {
    const winnerStack = stacks.find(s => s.id === winner);
    if (!winnerStack) return 'No clear winner identified';
    
    return `${winnerStack.name} emerges as the top choice based on overall compatibility, performance, and community support. Consider your specific requirements and team expertise when making the final decision.`;
  }

  private generateProjectStructure(template: ProjectTemplate, projectName: string, customizations: any): any {
    // This would generate the actual project structure
    return {
      files: template.structure.files.map(file => ({
        ...file,
        content: this.customizeFileContent(file.content, customizations)
      }))
    };
  }

  private customizeFileContent(content: string, customizations: any): string {
    // Apply customizations to file content
    let customizedContent = content;
    
    if (customizations.configurations) {
      Object.entries(customizations.configurations).forEach(([key, value]) => {
        customizedContent = customizedContent.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      });
    }
    
    return customizedContent;
  }

  private generateSetupInstructions(template: ProjectTemplate, customizations: any): string[] {
    return [
      ...template.setup.prerequisites,
      ...template.setup.installation,
      ...template.setup.configuration,
      ...template.setup.running
    ];
  }

  private generateNextSteps(template: ProjectTemplate, customizations: any): string[] {
    return [
      'Review generated code structure',
      'Install dependencies',
      'Configure environment variables',
      'Run initial tests',
      'Start development server',
      'Begin feature development'
    ];
  }

  // 🏗️ Initialize Tech Stacks
  private initializeTechStacks(): void {
    // React/TypeScript Stack
    this.techStacks.set('react-typescript', {
      id: 'react-typescript',
      name: 'React + TypeScript',
      description: 'Modern React development with TypeScript for type safety',
      category: TechCategory.WEB_FRONTEND,
      languages: [
        {
          id: 'typescript',
          name: 'TypeScript',
          version: '5.0+',
          type: 'compiled',
          paradigm: ['object-oriented', 'functional'],
          performance: 85,
          learningCurve: 60,
          community: 95,
          enterprise: true,
          syntax: 'c-like',
          features: ['Type Safety', 'Modern ES6+', 'Decorators', 'Generics'],
          ecosystem: ['React', 'Vue', 'Angular', 'Node.js']
        }
      ],
      frameworks: [
        {
          id: 'react',
          name: 'React',
          version: '18+',
          language: 'TypeScript',
          type: 'frontend',
          architecture: 'component-based',
          performance: 90,
          learningCurve: 50,
          community: 98,
          enterprise: true,
          features: ['Hooks', 'Suspense', 'Concurrent Mode', 'Server Components'],
          ecosystem: ['Next.js', 'Gatsby', 'Remix'],
          bundleSize: 45,
          ssr: true,
          spa: true,
          pwa: true
        }
      ],
      databases: [],
      tools: [
        {
          id: 'vite',
          name: 'Vite',
          category: 'bundler',
          language: 'TypeScript',
          type: 'cli',
          performance: 95,
          learningCurve: 30,
          community: 90,
          enterprise: true,
          features: ['Fast HMR', 'ES Modules', 'Plugin System'],
          integrations: ['React', 'Vue', 'Svelte']
        }
      ],
      deployment: [
        {
          id: 'vercel',
          name: 'Vercel',
          type: 'cloud',
          provider: 'Vercel',
          cost: 'low',
          scalability: 'auto',
          features: ['Edge Functions', 'CDN', 'Analytics'],
          regions: ['Global'],
          compliance: ['GDPR', 'SOC2']
        }
      ],
      complexity: 'intermediate',
      popularity: 95,
      performance: 90,
      learningCurve: 50,
      community: 98,
      enterprise: true,
      openSource: true,
      tags: ['frontend', 'react', 'typescript', 'modern', 'popular'],
      useCases: ['Web Applications', 'SPAs', 'Progressive Web Apps', 'Admin Dashboards'],
      pros: ['Excellent ecosystem', 'Strong community', 'Great performance', 'Type safety'],
      cons: ['Learning curve for beginners', 'Rapid changes', 'Bundle size concerns'],
      estimatedSetupTime: '15-30 minutes',
      maintenance: 'medium',
      scalability: 'high',
      security: 'good',
      documentation: 'excellent',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    });

    // Next.js Full-Stack
    this.techStacks.set('nextjs-fullstack', {
      id: 'nextjs-fullstack',
      name: 'Next.js Full-Stack',
      description: 'Full-stack React framework with SSR, API routes, and deployment',
      category: TechCategory.FULLSTACK,
      languages: [
        {
          id: 'typescript',
          name: 'TypeScript',
          version: '5.0+',
          type: 'compiled',
          paradigm: ['object-oriented', 'functional'],
          performance: 85,
          learningCurve: 60,
          community: 95,
          enterprise: true,
          syntax: 'c-like',
          features: ['Type Safety', 'Modern ES6+', 'Decorators', 'Generics'],
          ecosystem: ['React', 'Vue', 'Angular', 'Node.js']
        }
      ],
      frameworks: [
        {
          id: 'nextjs',
          name: 'Next.js',
          version: '14+',
          language: 'TypeScript',
          type: 'fullstack',
          architecture: 'component-based',
          performance: 95,
          learningCurve: 70,
          community: 95,
          enterprise: true,
          features: ['SSR', 'SSG', 'API Routes', 'Middleware', 'App Router'],
          ecosystem: ['React', 'Vercel', 'Turbopack'],
          bundleSize: 60,
          ssr: true,
          spa: true,
          pwa: true
        }
      ],
      databases: [
        {
          id: 'postgresql',
          name: 'PostgreSQL',
          type: 'relational',
          language: 'SQL',
          performance: 90,
          scalability: 85,
          consistency: 'strong',
          acid: true,
          distributed: false,
          cloud: true,
          features: ['ACID', 'JSON Support', 'Full-text Search', 'Extensions'],
          useCases: ['Web Applications', 'Analytics', 'Financial Systems']
        }
      ],
      tools: [
        {
          id: 'prisma',
          name: 'Prisma',
          category: 'build',
          language: 'TypeScript',
          type: 'cli',
          performance: 85,
          learningCurve: 60,
          community: 85,
          enterprise: true,
          features: ['Type-safe ORM', 'Migrations', 'Query Builder'],
          integrations: ['PostgreSQL', 'MySQL', 'SQLite', 'MongoDB']
        }
      ],
      deployment: [
        {
          id: 'vercel',
          name: 'Vercel',
          type: 'cloud',
          provider: 'Vercel',
          cost: 'low',
          scalability: 'auto',
          features: ['Edge Functions', 'CDN', 'Analytics', 'Database'],
          regions: ['Global'],
          compliance: ['GDPR', 'SOC2']
        }
      ],
      complexity: 'advanced',
      popularity: 90,
      performance: 95,
      learningCurve: 70,
      community: 95,
      enterprise: true,
      openSource: true,
      tags: ['fullstack', 'nextjs', 'react', 'ssr', 'api'],
      useCases: ['E-commerce', 'SaaS Applications', 'Marketing Sites', 'Web Apps'],
      pros: ['Full-stack solution', 'Excellent performance', 'Great DX', 'Built-in optimizations'],
      cons: ['Vendor lock-in to Vercel', 'Complex routing', 'Learning curve'],
      estimatedSetupTime: '30-45 minutes',
      maintenance: 'medium',
      scalability: 'high',
      security: 'excellent',
      documentation: 'excellent',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    });

    // Vue.js Stack
    this.techStacks.set('vue-nuxt', {
      id: 'vue-nuxt',
      name: 'Vue.js + Nuxt',
      description: 'Progressive Vue.js framework with Nuxt for full-stack development',
      category: TechCategory.FULLSTACK,
      languages: [
        {
          id: 'typescript',
          name: 'TypeScript',
          version: '5.0+',
          type: 'compiled',
          paradigm: ['object-oriented', 'functional'],
          performance: 85,
          learningCurve: 60,
          community: 95,
          enterprise: true,
          syntax: 'c-like',
          features: ['Type Safety', 'Modern ES6+', 'Decorators', 'Generics'],
          ecosystem: ['React', 'Vue', 'Angular', 'Node.js']
        }
      ],
      frameworks: [
        {
          id: 'vue',
          name: 'Vue.js',
          version: '3+',
          language: 'TypeScript',
          type: 'frontend',
          architecture: 'component-based',
          performance: 88,
          learningCurve: 40,
          community: 85,
          enterprise: true,
          features: ['Composition API', 'Reactivity', 'SFC', 'Teleport'],
          ecosystem: ['Nuxt', 'Vite', 'Pinia'],
          bundleSize: 35,
          ssr: true,
          spa: true,
          pwa: true
        },
        {
          id: 'nuxt',
          name: 'Nuxt',
          version: '3+',
          language: 'TypeScript',
          type: 'fullstack',
          architecture: 'component-based',
          performance: 90,
          learningCurve: 65,
          community: 80,
          enterprise: true,
          features: ['SSR', 'SSG', 'API Routes', 'Auto-imports', 'Modules'],
          ecosystem: ['Vue', 'Vite', 'Nitro'],
          bundleSize: 50,
          ssr: true,
          spa: true,
          pwa: true
        }
      ],
      databases: [
        {
          id: 'supabase',
          name: 'Supabase',
          type: 'relational',
          language: 'SQL',
          performance: 85,
          scalability: 80,
          consistency: 'strong',
          acid: true,
          distributed: false,
          cloud: true,
          features: ['PostgreSQL', 'Real-time', 'Auth', 'Storage'],
          useCases: ['Web Applications', 'Real-time Apps', 'Mobile Backend']
        }
      ],
      tools: [
        {
          id: 'pinia',
          name: 'Pinia',
          category: 'build',
          language: 'TypeScript',
          type: 'cli',
          performance: 90,
          learningCurve: 40,
          community: 80,
          enterprise: true,
          features: ['State Management', 'Type Safety', 'DevTools'],
          integrations: ['Vue', 'Nuxt']
        }
      ],
      deployment: [
        {
          id: 'netlify',
          name: 'Netlify',
          type: 'cloud',
          provider: 'Netlify',
          cost: 'low',
          scalability: 'auto',
          features: ['Edge Functions', 'CDN', 'Forms', 'Analytics'],
          regions: ['Global'],
          compliance: ['GDPR', 'SOC2']
        }
      ],
      complexity: 'intermediate',
      popularity: 75,
      performance: 88,
      learningCurve: 40,
      community: 85,
      enterprise: true,
      openSource: true,
      tags: ['vue', 'nuxt', 'fullstack', 'progressive', 'easy'],
      useCases: ['Web Applications', 'Marketing Sites', 'Admin Panels', 'SPAs'],
      pros: ['Easy to learn', 'Great performance', 'Progressive', 'Excellent DX'],
      cons: ['Smaller ecosystem', 'Less enterprise adoption', 'Limited mobile support'],
      estimatedSetupTime: '20-35 minutes',
      maintenance: 'low',
      scalability: 'high',
      security: 'good',
      documentation: 'excellent',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    });

    // Node.js Backend
    this.techStacks.set('nodejs-backend', {
      id: 'nodejs-backend',
      name: 'Node.js Backend',
      description: 'Scalable Node.js backend with Express and modern tooling',
      category: TechCategory.WEB_BACKEND,
      languages: [
        {
          id: 'typescript',
          name: 'TypeScript',
          version: '5.0+',
          type: 'compiled',
          paradigm: ['object-oriented', 'functional'],
          performance: 85,
          learningCurve: 60,
          community: 95,
          enterprise: true,
          syntax: 'c-like',
          features: ['Type Safety', 'Modern ES6+', 'Decorators', 'Generics'],
          ecosystem: ['React', 'Vue', 'Angular', 'Node.js']
        }
      ],
      frameworks: [
        {
          id: 'express',
          name: 'Express.js',
          version: '4+',
          language: 'TypeScript',
          type: 'backend',
          architecture: 'mvc',
          performance: 80,
          learningCurve: 45,
          community: 95,
          enterprise: true,
          features: ['Middleware', 'Routing', 'Templates', 'Static Files'],
          ecosystem: ['Node.js', 'MongoDB', 'PostgreSQL'],
          bundleSize: 0,
          ssr: false,
          spa: false,
          pwa: false
        }
      ],
      databases: [
        {
          id: 'mongodb',
          name: 'MongoDB',
          type: 'document',
          language: 'JavaScript',
          performance: 85,
          scalability: 90,
          consistency: 'eventual',
          acid: false,
          distributed: true,
          cloud: true,
          features: ['Document Store', 'Sharding', 'Replication', 'GridFS'],
          useCases: ['Web Applications', 'Content Management', 'Real-time Apps']
        }
      ],
      tools: [
        {
          id: 'mongoose',
          name: 'Mongoose',
          category: 'build',
          language: 'TypeScript',
          type: 'cli',
          performance: 80,
          learningCurve: 50,
          community: 90,
          enterprise: true,
          features: ['ODM', 'Schema Validation', 'Middleware', 'Plugins'],
          integrations: ['MongoDB', 'Express']
        }
      ],
      deployment: [
        {
          id: 'railway',
          name: 'Railway',
          type: 'cloud',
          provider: 'Railway',
          cost: 'low',
          scalability: 'auto',
          features: ['Database', 'Redis', 'Cron Jobs', 'Metrics'],
          regions: ['Global'],
          compliance: ['SOC2']
        }
      ],
      complexity: 'intermediate',
      popularity: 90,
      performance: 80,
      learningCurve: 45,
      community: 95,
      enterprise: true,
      openSource: true,
      tags: ['backend', 'nodejs', 'express', 'api', 'scalable'],
      useCases: ['REST APIs', 'Microservices', 'Real-time Apps', 'Web Services'],
      pros: ['Fast development', 'Large ecosystem', 'JSON native', 'Scalable'],
      cons: ['Single-threaded', 'Callback complexity', 'Memory usage'],
      estimatedSetupTime: '25-40 minutes',
      maintenance: 'medium',
      scalability: 'high',
      security: 'good',
      documentation: 'excellent',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    });

    // Python FastAPI
    this.techStacks.set('python-fastapi', {
      id: 'python-fastapi',
      name: 'Python FastAPI',
      description: 'High-performance Python API framework with automatic documentation',
      category: TechCategory.WEB_BACKEND,
      languages: [
        {
          id: 'python',
          name: 'Python',
          version: '3.11+',
          type: 'interpreted',
          paradigm: ['object-oriented', 'functional'],
          performance: 70,
          learningCurve: 30,
          community: 98,
          enterprise: true,
          syntax: 'python-like',
          features: ['Dynamic Typing', 'Rich Libraries', 'AI/ML Support', 'Async'],
          ecosystem: ['Django', 'Flask', 'FastAPI', 'Pandas', 'TensorFlow']
        }
      ],
      frameworks: [
        {
          id: 'fastapi',
          name: 'FastAPI',
          version: '0.100+',
          language: 'Python',
          type: 'backend',
          architecture: 'mvc',
          performance: 95,
          learningCurve: 60,
          community: 85,
          enterprise: true,
          features: ['Auto Documentation', 'Type Hints', 'Async Support', 'Validation'],
          ecosystem: ['Pydantic', 'Uvicorn', 'SQLAlchemy'],
          bundleSize: 0,
          ssr: false,
          spa: false,
          pwa: false
        }
      ],
      databases: [
        {
          id: 'postgresql',
          name: 'PostgreSQL',
          type: 'relational',
          language: 'SQL',
          performance: 90,
          scalability: 85,
          consistency: 'strong',
          acid: true,
          distributed: false,
          cloud: true,
          features: ['ACID', 'JSON Support', 'Full-text Search', 'Extensions'],
          useCases: ['Web Applications', 'Analytics', 'Financial Systems']
        }
      ],
      tools: [
        {
          id: 'sqlalchemy',
          name: 'SQLAlchemy',
          category: 'build',
          language: 'Python',
          type: 'cli',
          performance: 85,
          learningCurve: 70,
          community: 90,
          enterprise: true,
          features: ['ORM', 'Migrations', 'Connection Pooling'],
          integrations: ['PostgreSQL', 'MySQL', 'SQLite', 'Oracle']
        }
      ],
      deployment: [
        {
          id: 'heroku',
          name: 'Heroku',
          type: 'cloud',
          provider: 'Heroku',
          cost: 'medium',
          scalability: 'manual',
          features: ['Add-ons', 'Git Deploy', 'Metrics', 'Logs'],
          regions: ['US', 'EU'],
          compliance: ['SOC2', 'HIPAA']
        }
      ],
      complexity: 'intermediate',
      popularity: 80,
      performance: 95,
      learningCurve: 60,
      community: 85,
      enterprise: true,
      openSource: true,
      tags: ['python', 'fastapi', 'backend', 'api', 'performance'],
      useCases: ['REST APIs', 'Data APIs', 'ML Services', 'Microservices'],
      pros: ['High performance', 'Auto documentation', 'Type safety', 'Async support'],
      cons: ['Python ecosystem complexity', 'Deployment challenges', 'Learning curve'],
      estimatedSetupTime: '30-45 minutes',
      maintenance: 'medium',
      scalability: 'high',
      security: 'excellent',
      documentation: 'excellent',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    });

    // Flutter Mobile
    this.techStacks.set('flutter-mobile', {
      id: 'flutter-mobile',
      name: 'Flutter Mobile',
      description: 'Cross-platform mobile development with Flutter and Dart',
      category: TechCategory.MOBILE,
      languages: [
        {
          id: 'dart',
          name: 'Dart',
          version: '3.0+',
          type: 'compiled',
          paradigm: ['object-oriented', 'functional'],
          performance: 90,
          learningCurve: 55,
          community: 80,
          enterprise: true,
          syntax: 'c-like',
          features: ['Null Safety', 'Async/Await', 'Generics', 'Mixins'],
          ecosystem: ['Flutter', 'AngularDart', 'Server']
        }
      ],
      frameworks: [
        {
          id: 'flutter',
          name: 'Flutter',
          version: '3.0+',
          language: 'Dart',
          type: 'mobile',
          architecture: 'component-based',
          performance: 95,
          learningCurve: 65,
          community: 85,
          enterprise: true,
          features: ['Hot Reload', 'Custom Widgets', 'Platform Channels', 'Web Support'],
          ecosystem: ['Firebase', 'Provider', 'Bloc', 'GetX'],
          bundleSize: 0,
          ssr: false,
          spa: false,
          pwa: false
        }
      ],
      databases: [
        {
          id: 'firebase',
          name: 'Firebase',
          type: 'document',
          language: 'JavaScript',
          performance: 85,
          scalability: 95,
          consistency: 'eventual',
          acid: false,
          distributed: true,
          cloud: true,
          features: ['Real-time', 'Auth', 'Storage', 'Functions'],
          useCases: ['Mobile Apps', 'Web Apps', 'Real-time Apps']
        }
      ],
      tools: [
        {
          id: 'provider',
          name: 'Provider',
          category: 'build',
          language: 'Dart',
          type: 'cli',
          performance: 90,
          learningCurve: 40,
          community: 80,
          enterprise: true,
          features: ['State Management', 'Dependency Injection', 'Change Notifier'],
          integrations: ['Flutter', 'Firebase']
        }
      ],
      deployment: [
        {
          id: 'google-play',
          name: 'Google Play',
          type: 'cloud',
          provider: 'Google',
          cost: 'low',
          scalability: 'auto',
          features: ['App Store', 'Analytics', 'Testing', 'Distribution'],
          regions: ['Global'],
          compliance: ['GDPR', 'COPPA']
        }
      ],
      complexity: 'intermediate',
      popularity: 85,
      performance: 95,
      learningCurve: 65,
      community: 85,
      enterprise: true,
      openSource: true,
      tags: ['mobile', 'flutter', 'cross-platform', 'dart', 'ui'],
      useCases: ['Mobile Apps', 'Cross-platform Apps', 'Desktop Apps', 'Web Apps'],
      pros: ['Single codebase', 'Great performance', 'Rich UI', 'Google backing'],
      cons: ['Large app size', 'Platform limitations', 'Learning curve'],
      estimatedSetupTime: '45-60 minutes',
      maintenance: 'medium',
      scalability: 'high',
      security: 'good',
      documentation: 'excellent',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date()
    });
  }

  // 🏗️ Initialize Project Templates
  private initializeTemplates(): void {
    // React TypeScript Template
    this.templates.set('react-typescript-basic', {
      id: 'react-typescript-basic',
      name: 'React TypeScript Basic',
      description: 'Basic React application with TypeScript, Vite, and Tailwind CSS',
      techStack: this.techStacks.get('react-typescript')!,
      category: TechCategory.WEB_FRONTEND,
      complexity: 'simple',
      estimatedTime: '15-30 minutes',
      features: ['TypeScript', 'Vite', 'Tailwind CSS', 'ESLint', 'Prettier'],
      structure: {
        directories: [
          {
            name: 'src',
            path: './src',
            purpose: 'Source code directory',
            children: [
              { name: 'components', path: './src/components', purpose: 'React components' },
              { name: 'pages', path: './src/pages', purpose: 'Page components' },
              { name: 'hooks', path: './src/hooks', purpose: 'Custom React hooks' },
              { name: 'utils', path: './src/utils', purpose: 'Utility functions' },
              { name: 'types', path: './src/types', purpose: 'TypeScript type definitions' }
            ]
          },
          { name: 'public', path: './public', purpose: 'Static assets' }
        ],
        files: [
          {
            name: 'App.tsx',
            path: './src/App.tsx',
            content: `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to {{projectName}}
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                Start building your amazing application!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;`,
            language: 'typescript',
            purpose: 'Main application component',
            editable: true,
            generated: false
          },
          {
            name: 'main.tsx',
            path: './src/main.tsx',
            content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,
            language: 'typescript',
            purpose: 'Application entry point',
            editable: true,
            generated: false
          }
        ],
        configs: [
          {
            name: 'package.json',
            path: './package.json',
            content: `{
  "name": "{{projectName}}",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.2",
    "vite": "^5.0.8"
  }
}`,
            purpose: 'Project dependencies and scripts',
            environment: 'all'
          }
        ],
        scripts: [
          {
            name: 'dev',
            command: 'npm run dev',
            description: 'Start development server',
            category: 'dev'
          },
          {
            name: 'build',
            command: 'npm run build',
            description: 'Build for production',
            category: 'build'
          },
          {
            name: 'lint',
            command: 'npm run lint',
            description: 'Run ESLint',
            category: 'test'
          }
        ]
      },
      setup: {
        prerequisites: [
          'Node.js 18+ installed',
          'npm or yarn package manager'
        ],
        installation: [
          'npm install',
          'npm run dev'
        ],
        configuration: [
          'Configure Tailwind CSS in tailwind.config.js',
          'Set up ESLint rules in .eslintrc.js'
        ],
        running: [
          'npm run dev - Start development server',
          'npm run build - Build for production',
          'npm run preview - Preview production build'
        ],
        testing: [
          'npm run lint - Check code quality',
          'Add testing framework (Jest, Vitest)'
        ],
        deployment: [
          'Build the project: npm run build',
          'Deploy dist/ folder to your hosting provider',
          'Configure environment variables'
        ]
      },
      examples: [
        {
          name: 'Counter Component',
          description: 'Simple counter component with state',
          language: 'typescript',
          content: `import React, { useState } from 'react';

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Count: {count}</h2>
      <button
        onClick={() => setCount(count + 1)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Increment
      </button>
    </div>
  );
};`,
          category: 'basic'
        }
      ],
      documentation: 'https://react.dev/learn',
      community: 'https://github.com/facebook/react',
      license: 'MIT',
      maintainer: 'Facebook',
      lastUpdated: new Date(),
      downloads: 0,
      rating: 4.8,
      tags: ['react', 'typescript', 'vite', 'tailwind', 'basic']
    });
  }
}
