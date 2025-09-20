// 🚀 VIBE CODING MULTI-AGENT SYSTEM - TYPE DEFINITIONS
// Advanced Type System for Revolutionary Multi-Agent Architecture

export interface AgentMessage {
  id: string;
  content: string;
  timestamp: Date;
  agentId: string;
  type: 'command' | 'response' | 'collaboration' | 'status' | 'error';
  metadata?: {
    taskId?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    tags?: string[];
    parentMessageId?: string;
    sessionId?: string;
  };
}

export interface AgentContext {
  taskHistory: AgentMessage[];
  currentObjective: string;
  availableTools: string[];
  collaborators: string[];
  memoryBank: Map<string, any>;
  skills: AgentSkill[];
  workingDirectory?: string;
}

export interface AgentSkill {
  name: string;
  description: string;
  confidence: number; // 0-1
  lastUsed?: Date;
  successRate: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'blocked' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAgent?: string;
  dependencies: string[];
  subtasks: Task[];
  estimatedComplexity: number; // 1-10
  actualComplexity?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata: {
    codeFiles?: string[];
    requirements?: string[];
    constraints?: string[];
  };
}

export interface AgentPersonality {
  name: string;
  role: AgentRole;
  description: string;
  avatar: string;
  color: string;
  specializations: string[];
  workingStyle: 'methodical' | 'creative' | 'analytical' | 'collaborative' | 'innovative';
  communication: 'formal' | 'casual' | 'technical' | 'encouraging';
}

export enum AgentRole {
  COORDINATOR = 'coordinator',
  ARCHITECT = 'architect', 
  ANALYST = 'analyst',
  ENGINEER = 'engineer',
  DEVELOPER = 'developer',
  REVIEWER = 'reviewer',
  OPTIMIZER = 'optimizer',
  DEVOPS = 'devops',
  SECURITY = 'security',
  TESTING = 'testing',
  UI_UX = 'ui_ux',
  DATABASE = 'database',
  API_SPECIALIST = 'api_specialist',
  PERFORMANCE = 'performance',
  DOCUMENTATION = 'documentation',
  DEPLOYMENT = 'deployment',
  MONITORING = 'monitoring',
  AI_ML = 'ai_ml',
  BLOCKCHAIN = 'blockchain',
  MOBILE = 'mobile',
  GAME_DEV = 'game_dev'
}

export interface CollaborationPattern {
  id: string;
  name: string;
  description: string;
  participants: AgentRole[];
  workflow: CollaborationStep[];
  useCase: string;
}

export interface CollaborationStep {
  order: number;
  agent: AgentRole;
  action: string;
  expectedOutput: string;
  nextSteps: string[];
  timeout?: number; // milliseconds
}

export interface AgentState {
  id: string;
  role: AgentRole;
  status: 'idle' | 'thinking' | 'working' | 'waiting' | 'collaborating';
  currentTask?: string;
  performance: {
    tasksCompleted: number;
    averageCompletionTime: number;
    successRate: number;
    collaborationRating: number;
  };
  lastActive: Date;
  workload: number; // 0-100
}

export interface VibeCodeSession {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  participants: AgentState[];
  tasks: Task[];
  codebase: {
    files: CodeFile[];
    architecture: string;
    techStack: string[];
  };
  vibeMetrics: {
    flowScore: number; // How smooth the development is
    iterationVelocity: number; // Speed of iterations
    codeQuality: number; // Quality of generated code
    userSatisfaction: number; // User feedback score
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeFile {
  path: string;
  content: string;
  language: string;
  lastModified: Date;
  modifiedBy: string;
  version: number;
  status: 'draft' | 'review' | 'approved' | 'deprecated';
}

export interface VibeCodingPrompt {
  id: string;
  userQuery: string;
  context: {
    projectType: string;
    complexity: number;
    preferences: string[];
    constraints: string[];
  };
  decomposition: {
    mainObjective: string;
    subTasks: string[];
    dependencies: string[];
  };
  agentAssignments: {
    [agentId: string]: string[];
  };
}

export interface AgentResponse {
  agentId: string;
  taskId: string;
  response: {
    type: 'code' | 'analysis' | 'plan' | 'review' | 'suggestion';
    content: string;
    confidence: number;
    reasoning: string;
    alternatives?: string[];
  };
  nextActions: string[];
  collaborationRequests?: {
    targetAgent: string;
    reason: string;
    expectedInput: string;
  }[];
}