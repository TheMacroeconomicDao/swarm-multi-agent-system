// 🤖 AGENT SYSTEM HOOK - Centralized Agent State Management
// Advanced hook for managing multi-agent system state with performance optimization

import { useState, useCallback, useRef, useEffect } from 'react';
import { CoordinatorAgent } from '@/lib/agents/coordinator-agent';
import { ArchitectAgent, DeveloperAgent, AnalystAgent } from '@/lib/agents/specialized-agents';
import { VibeCodeSession, AgentMessage, AgentState, AgentRole, Task, CodeFile } from '@/types/agents';

interface UseAgentSystemReturn {
  // Agents
  coordinator: CoordinatorAgent;
  agents: AgentState[];
  selectedAgent: AgentState | null;
  setSelectedAgent: (agent: AgentState | null) => void;
  
  // Sessions
  currentSession: VibeCodeSession | null;
  activeSessions: VibeCodeSession[];
  createSession: (sessionData: SessionData) => Promise<void>;
  
  // Communication
  messages: AgentMessage[];
  sendMessage: (content: string) => Promise<void>;
  isProcessing: boolean;
  
  // Code & Tasks
  codeFiles: CodeFile[];
  currentTasks: Task[];
  updateCodeFile: (filePath: string, content: string) => void;
  
  // UI State
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isCodeWorkspaceOpen: boolean;
  setIsCodeWorkspaceOpen: (open: boolean) => void;
}

interface SessionData {
  title: string;
  description: string;
  projectType: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  techStack: string[];
  requirements: string[];
}

export const useAgentSystem = (): UseAgentSystemReturn => {
  // Initialize agents once using refs to prevent re-creation
  const coordinatorRef = useRef<CoordinatorAgent>();
  const architectRef = useRef<ArchitectAgent>();
  const developerRef = useRef<DeveloperAgent>();
  const analystRef = useRef<AnalystAgent>();

  if (!coordinatorRef.current) {
    coordinatorRef.current = new CoordinatorAgent();
    architectRef.current = new ArchitectAgent();
    developerRef.current = new DeveloperAgent();
    analystRef.current = new AnalystAgent();

    // Register agents with coordinator
    coordinatorRef.current.registerAgent(architectRef.current);
    coordinatorRef.current.registerAgent(developerRef.current);
    coordinatorRef.current.registerAgent(analystRef.current);
  }

  // State management
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentState | null>(null);
  const [currentSession, setCurrentSession] = useState<VibeCodeSession | null>(null);
  const [activeSessions, setActiveSessions] = useState<VibeCodeSession[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCodeWorkspaceOpen, setIsCodeWorkspaceOpen] = useState(false);

  // Initialize mock data
  useEffect(() => {
    setAgents([
      {
        id: 'coordinator_main',
        role: AgentRole.COORDINATOR,
        status: 'idle',
        performance: {
          tasksCompleted: 127,
          averageCompletionTime: 4.2,
          successRate: 0.96,
          collaborationRating: 0.94
        },
        lastActive: new Date(),
        workload: 15
      },
      {
        id: 'architect_01',
        role: AgentRole.ARCHITECT,
        status: 'thinking',
        performance: {
          tasksCompleted: 89,
          averageCompletionTime: 8.7,
          successRate: 0.91,
          collaborationRating: 0.88
        },
        lastActive: new Date(),
        workload: 65
      },
      {
        id: 'developer_01',
        role: AgentRole.DEVELOPER,
        status: 'working',
        performance: {
          tasksCompleted: 203,
          averageCompletionTime: 3.1,
          successRate: 0.87,
          collaborationRating: 0.92
        },
        lastActive: new Date(),
        workload: 80
      },
      {
        id: 'analyst_01',
        role: AgentRole.ANALYST,
        status: 'collaborating',
        performance: {
          tasksCompleted: 156,
          averageCompletionTime: 6.3,
          successRate: 0.93,
          collaborationRating: 0.97
        },
        lastActive: new Date(),
        workload: 45
      }
    ]);
  }, []);

  // Create new session with proper error handling
  const createSession = useCallback(async (sessionData: SessionData) => {
    try {
      const newSession: VibeCodeSession = {
        id: `session_${Date.now()}`,
        title: sessionData.title,
        description: sessionData.description,
        status: 'active',
        participants: [],
        tasks: [],
        codebase: {
          files: [],
          architecture: 'Multi-Agent System',
          techStack: sessionData.techStack
        },
        vibeMetrics: {
          flowScore: 0,
          iterationVelocity: 0,
          codeQuality: 0,
          userSatisfaction: 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setCurrentSession(newSession);
      setActiveSessions(prev => [newSession, ...prev]);

      // Initialize sample files based on tech stack
      const sampleFiles: CodeFile[] = [];
      if (sessionData.techStack.includes('React')) {
        sampleFiles.push({
          path: 'src/App.tsx',
          content: `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-background text-foreground">\n      <h1 className="text-4xl font-bold text-center pt-20">\n        Welcome to ${sessionData.title}\n      </h1>\n      <p className="text-center mt-4 text-muted-foreground">\n        ${sessionData.description}\n      </p>\n    </div>\n  );\n}\n\nexport default App;`,
          language: 'typescript',
          lastModified: new Date(),
          modifiedBy: 'coordinator',
          version: 1,
          status: 'draft'
        });
      }

      if (sessionData.techStack.includes('TypeScript')) {
        sampleFiles.push({
          path: 'src/types/index.ts',
          content: `// Project types for ${sessionData.title}\n\nexport interface AppConfig {\n  name: string;\n  version: string;\n  environment: 'development' | 'production';\n}\n\nexport interface User {\n  id: string;\n  name: string;\n  email: string;\n  createdAt: Date;\n}\n`,
          language: 'typescript',
          lastModified: new Date(),
          modifiedBy: 'architect',
          version: 1,
          status: 'draft'
        });
      }

      setCodeFiles(sampleFiles);
      setIsChatOpen(true);
      setIsCodeWorkspaceOpen(true);
    } catch (error) {
      console.error('Failed to create session:', error);
      throw error;
    }
  }, []);

  // Send message with enhanced processing
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || !currentSession) return;

    setIsProcessing(true);

    try {
      // Add user message
      const userMessage: AgentMessage = {
        id: `msg_${Date.now()}`,
        content,
        timestamp: new Date(),
        agentId: 'user',
        type: 'command',
        metadata: {
          sessionId: currentSession.id,
          priority: 'medium'
        }
      };
      
      setMessages(prev => [...prev, userMessage]);

      // Process through coordinator
      const response = await coordinatorRef.current!.processVibeRequest(content, currentSession.id);
      
      // Add agent response
      const agentResponse: AgentMessage = {
        id: `msg_${Date.now()}_response`,
        content: `Processing your request: "${content}". Coordinating with the agent team to deliver the best solution.`,
        timestamp: new Date(),
        agentId: AgentRole.COORDINATOR,
        type: 'response',
        metadata: {
          sessionId: currentSession.id,
          taskId: `task_${Date.now()}`,
          tags: ['coordination', 'planning'],
          priority: 'medium'
        }
      };
      
      setMessages(prev => [...prev, agentResponse]);
      
      // Simulate task creation
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: content,
        description: `User request: ${content}`,
        status: 'in_progress',
        priority: 'medium',
        dependencies: [],
        subtasks: [],
        estimatedComplexity: Math.floor(Math.random() * 10) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          requirements: [content],
          constraints: []
        }
      };
      
      setCurrentTasks(prev => [...prev, newTask]);
      
    } catch (error) {
      console.error('Failed to process message:', error);
      
      const errorMessage: AgentMessage = {
        id: `msg_${Date.now()}_error`,
        content: `Sorry, I encountered an error processing your request. Please try again.`,
        timestamp: new Date(),
        agentId: 'system',
        type: 'error',
        metadata: {
          sessionId: currentSession.id,
          priority: 'high'
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [currentSession]);

  // Update code file with version tracking
  const updateCodeFile = useCallback((filePath: string, content: string) => {
    setCodeFiles(prev => prev.map(file => 
      file.path === filePath 
        ? { 
            ...file, 
            content, 
            lastModified: new Date(), 
            version: file.version + 1,
            status: 'draft' as const
          }
        : file
    ));
  }, []);

  return {
    coordinator: coordinatorRef.current!,
    agents,
    selectedAgent,
    setSelectedAgent,
    currentSession,
    activeSessions,
    createSession,
    messages,
    sendMessage,
    isProcessing,
    codeFiles,
    currentTasks,
    updateCodeFile,
    isChatOpen,
    setIsChatOpen,
    isCodeWorkspaceOpen,
    setIsCodeWorkspaceOpen
  };
};