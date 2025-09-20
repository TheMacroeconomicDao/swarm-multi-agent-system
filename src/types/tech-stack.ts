// 🚀 ADVANCED TECH STACK SYSTEM - Comprehensive Technology Stack Management
// Revolutionary multi-framework, multi-language support with intelligent recommendations

export interface TechStack {
  id: string;
  name: string;
  description: string;
  category: TechCategory;
  languages: Language[];
  frameworks: Framework[];
  databases: Database[];
  tools: Tool[];
  deployment: DeploymentOption[];
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  popularity: number; // 0-100
  performance: number; // 0-100
  learningCurve: number; // 0-100 (higher = steeper)
  community: number; // 0-100
  enterprise: boolean;
  openSource: boolean;
  tags: string[];
  useCases: string[];
  pros: string[];
  cons: string[];
  estimatedSetupTime: string;
  maintenance: 'low' | 'medium' | 'high';
  scalability: 'low' | 'medium' | 'high' | 'enterprise';
  security: 'basic' | 'good' | 'excellent' | 'enterprise';
  documentation: 'poor' | 'fair' | 'good' | 'excellent';
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  id: string;
  name: string;
  version: string;
  type: 'compiled' | 'interpreted' | 'hybrid';
  paradigm: ('object-oriented' | 'functional' | 'procedural' | 'declarative')[];
  performance: number;
  learningCurve: number;
  community: number;
  enterprise: boolean;
  syntax: 'c-like' | 'python-like' | 'lisp-like' | 'unique';
  features: string[];
  ecosystem: string[];
}

export interface Framework {
  id: string;
  name: string;
  version: string;
  language: string;
  type: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'desktop' | 'cli';
  architecture: 'mvc' | 'mvp' | 'mvvm' | 'component-based' | 'microservices' | 'serverless';
  performance: number;
  learningCurve: number;
  community: number;
  enterprise: boolean;
  features: string[];
  ecosystem: string[];
  bundleSize?: number; // for frontend frameworks
  ssr: boolean;
  spa: boolean;
  pwa: boolean;
}

export interface Database {
  id: string;
  name: string;
  type: 'relational' | 'document' | 'key-value' | 'graph' | 'time-series' | 'columnar';
  language: string;
  performance: number;
  scalability: number;
  consistency: 'eventual' | 'strong' | 'causal';
  acid: boolean;
  distributed: boolean;
  cloud: boolean;
  features: string[];
  useCases: string[];
}

export interface Tool {
  id: string;
  name: string;
  category: 'build' | 'test' | 'lint' | 'format' | 'bundler' | 'package-manager' | 'ci-cd' | 'monitoring' | 'deployment';
  language: string;
  type: 'cli' | 'gui' | 'web' | 'api';
  performance: number;
  learningCurve: number;
  community: number;
  enterprise: boolean;
  features: string[];
  integrations: string[];
}

export interface DeploymentOption {
  id: string;
  name: string;
  type: 'cloud' | 'on-premise' | 'hybrid' | 'serverless';
  provider: string;
  cost: 'free' | 'low' | 'medium' | 'high' | 'enterprise';
  scalability: 'auto' | 'manual' | 'hybrid';
  features: string[];
  regions: string[];
  compliance: string[];
}

export enum TechCategory {
  WEB_FRONTEND = 'web-frontend',
  WEB_BACKEND = 'web-backend',
  FULLSTACK = 'fullstack',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  DATA_SCIENCE = 'data-science',
  AI_ML = 'ai-ml',
  BLOCKCHAIN = 'blockchain',
  GAME_DEVELOPMENT = 'game-development',
  EMBEDDED = 'embedded',
  DEVOPS = 'devops',
  MICROSERVICES = 'microservices',
  SERVERLESS = 'serverless'
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  techStack: TechStack;
  category: TechCategory;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  estimatedTime: string;
  features: string[];
  structure: ProjectStructure;
  setup: SetupInstructions;
  examples: CodeExample[];
  documentation: string;
  community: string;
  license: string;
  maintainer: string;
  lastUpdated: Date;
  downloads: number;
  rating: number;
  tags: string[];
}

export interface ProjectStructure {
  directories: Directory[];
  files: ProjectFile[];
  configs: ConfigFile[];
  scripts: Script[];
}

export interface Directory {
  name: string;
  path: string;
  purpose: string;
  children?: Directory[];
}

export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  language: string;
  purpose: string;
  editable: boolean;
  generated: boolean;
}

export interface ConfigFile {
  name: string;
  path: string;
  content: string;
  purpose: string;
  environment: 'development' | 'production' | 'test' | 'all';
}

export interface Script {
  name: string;
  command: string;
  description: string;
  category: 'build' | 'test' | 'dev' | 'deploy' | 'utility';
}

export interface SetupInstructions {
  prerequisites: string[];
  installation: string[];
  configuration: string[];
  running: string[];
  testing: string[];
  deployment: string[];
}

export interface CodeExample {
  name: string;
  description: string;
  language: string;
  content: string;
  category: 'basic' | 'advanced' | 'integration' | 'testing';
}

export interface TechStackRecommendation {
  techStack: TechStack;
  score: number;
  reasoning: string;
  alternatives: TechStack[];
  considerations: string[];
}

export interface ProjectRequirements {
  type: 'web' | 'mobile' | 'desktop' | 'api' | 'data' | 'ai' | 'game' | 'blockchain';
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  teamSize: 'solo' | 'small' | 'medium' | 'large';
  timeline: 'week' | 'month' | 'quarter' | 'year';
  budget: 'free' | 'low' | 'medium' | 'high' | 'unlimited';
  performance: 'basic' | 'good' | 'excellent' | 'enterprise';
  scalability: 'low' | 'medium' | 'high' | 'enterprise';
  security: 'basic' | 'good' | 'excellent' | 'enterprise';
  maintenance: 'low' | 'medium' | 'high';
  learning: 'familiar' | 'learning' | 'new';
  preferences: string[];
  constraints: string[];
  integrations: string[];
  deployment: 'cloud' | 'on-premise' | 'hybrid';
  compliance: string[];
}

export interface TechStackComparison {
  stacks: TechStack[];
  criteria: ComparisonCriteria;
  scores: Record<string, Record<string, number>>;
  winner: string;
  summary: string;
}

export interface ComparisonCriteria {
  performance: number;
  learningCurve: number;
  community: number;
  enterprise: number;
  cost: number;
  scalability: number;
  security: number;
  documentation: number;
}
