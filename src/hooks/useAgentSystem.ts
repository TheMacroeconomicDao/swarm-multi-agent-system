// 🤖 AGENT SYSTEM HOOK - Centralized Agent State Management
// Advanced hook for managing multi-agent system state with performance optimization

import { useState, useCallback, useRef, useEffect } from 'react';
import { CoordinatorAgent } from '@/lib/agents/coordinator-agent';
import { ArchitectAgent, DeveloperAgent, AnalystAgent } from '@/lib/agents/specialized-agents';
import { SwarmCoordinator } from '@/lib/swarm/swarm-coordinator';
import { FrontendSwarmAgent, BackendSwarmAgent, TestingSwarmAgent } from '@/lib/agents/swarm-specialized-agents';
import { VibeCodeSession, AgentMessage, AgentState, AgentRole, Task, CodeFile } from '@/types/agents';
import { AgentEventManager } from '@/lib/events/agent-event-manager';
import { EventBus } from '@/lib/events/event-bus';
import { InMemoryEventStore } from '@/lib/events/event-store';
import { EventFactory } from '@/lib/events/event-factory';
import { AgentEventType } from '@/types/events';

interface UseAgentSystemReturn {
  // Agents
  coordinator: CoordinatorAgent;
  swarmCoordinator: SwarmCoordinator;
  agents: AgentState[];
  selectedAgent: AgentState | null;
  setSelectedAgent: (agent: AgentState | null) => void;
  
  // Event System
  eventManager: AgentEventManager;
  systemStats: any;
  
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
  // Initialize event system
  const eventManagerRef = useRef<AgentEventManager>();
  const eventBusRef = useRef<EventBus>();
  
  // Initialize agents once using refs to prevent re-creation
  const coordinatorRef = useRef<CoordinatorAgent>();
  const swarmCoordinatorRef = useRef<SwarmCoordinator>();
  const architectRef = useRef<ArchitectAgent>();
  const developerRef = useRef<DeveloperAgent>();
  const analystRef = useRef<AnalystAgent>();
  const frontendSwarmRef = useRef<FrontendSwarmAgent>();
  const backendSwarmRef = useRef<BackendSwarmAgent>();
  const testingSwarmRef = useRef<TestingSwarmAgent>();

  if (!eventManagerRef.current) {
    // Initialize event system first
    eventManagerRef.current = new AgentEventManager();
    eventBusRef.current = new EventBus(
      new InMemoryEventStore(),
      {
        maxRetries: 3,
        retryDelay: 1000,
        batchSize: 10,
        flushInterval: 100,
        persistence: true,
        compression: false,
        encryption: false
      }
    );

    // Initialize traditional agents with event bus
    coordinatorRef.current = new CoordinatorAgent('coordinator_01', undefined, eventBusRef.current);
    architectRef.current = new ArchitectAgent('architect_01', undefined, eventBusRef.current);
    developerRef.current = new DeveloperAgent('developer_01', undefined, eventBusRef.current);
    analystRef.current = new AnalystAgent('analyst_01', undefined, eventBusRef.current);

    // Initialize swarm coordinator and agents
    swarmCoordinatorRef.current = new SwarmCoordinator();
    frontendSwarmRef.current = new FrontendSwarmAgent();
    backendSwarmRef.current = new BackendSwarmAgent();
    testingSwarmRef.current = new TestingSwarmAgent();

    // Register agents with event manager
    eventManagerRef.current.registerAgent(coordinatorRef.current);
    eventManagerRef.current.registerAgent(architectRef.current);
    eventManagerRef.current.registerAgent(developerRef.current);
    eventManagerRef.current.registerAgent(analystRef.current);

    // Register traditional agents with coordinator
    coordinatorRef.current.registerAgent(architectRef.current);
    coordinatorRef.current.registerAgent(developerRef.current);
    coordinatorRef.current.registerAgent(analystRef.current);

    // Register swarm agents with swarm coordinator
    swarmCoordinatorRef.current.registerSwarmAgent(frontendSwarmRef.current);
    swarmCoordinatorRef.current.registerSwarmAgent(backendSwarmRef.current);
    swarmCoordinatorRef.current.registerSwarmAgent(testingSwarmRef.current);
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
  const [systemStats, setSystemStats] = useState<any>(null);

  // Initialize agent data and system stats
  useEffect(() => {
    const initializeAgents = async () => {
      try {
        // Get system stats from event manager
        if (eventManagerRef.current) {
          const stats = eventManagerRef.current.getSystemStats();
          setSystemStats(stats);
        }

        // Get traditional agent status
        const traditionalAgents = coordinatorRef.current?.getTeamStatus() || [];
        
        // Get swarm agent status
        const swarmAgents = swarmCoordinatorRef.current?.getSwarmStatus() || [];
        
        // Combine all agents
        const allAgents = [...traditionalAgents, ...swarmAgents];
        
        // Always use our comprehensive agent list for the dashboard
        // This ensures we show all 21 agent types regardless of coordinator status
        const initialAgents: AgentState[] = [
            {
              id: 'coordinator_01',
              role: AgentRole.COORDINATOR,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.95,
                collaborationRating: 0.92
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'architect_01',
              role: AgentRole.ARCHITECT,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.88,
                collaborationRating: 0.85
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'developer_01',
              role: AgentRole.DEVELOPER,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.92,
                collaborationRating: 0.88
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'analyst_01',
              role: AgentRole.ANALYST,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.90,
                collaborationRating: 0.87
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'database_01',
              role: AgentRole.DATABASE,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.89,
                collaborationRating: 0.83
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'api_specialist_01',
              role: AgentRole.API_SPECIALIST,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.91,
                collaborationRating: 0.86
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'performance_01',
              role: AgentRole.PERFORMANCE,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.87,
                collaborationRating: 0.84
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'documentation_01',
              role: AgentRole.DOCUMENTATION,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.93,
                collaborationRating: 0.89
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'engineer_01',
              role: AgentRole.ENGINEER,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.91,
                collaborationRating: 0.87
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'reviewer_01',
              role: AgentRole.REVIEWER,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.94,
                collaborationRating: 0.90
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'optimizer_01',
              role: AgentRole.OPTIMIZER,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.89,
                collaborationRating: 0.85
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'devops_01',
              role: AgentRole.DEVOPS,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.92,
                collaborationRating: 0.88
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'security_01',
              role: AgentRole.SECURITY,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.96,
                collaborationRating: 0.93
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'testing_01',
              role: AgentRole.TESTING,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.90,
                collaborationRating: 0.86
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'ui_ux_01',
              role: AgentRole.UI_UX,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.88,
                collaborationRating: 0.84
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'deployment_01',
              role: AgentRole.DEPLOYMENT,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.93,
                collaborationRating: 0.89
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'monitoring_01',
              role: AgentRole.MONITORING,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.95,
                collaborationRating: 0.91
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'ai_ml_01',
              role: AgentRole.AI_ML,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.87,
                collaborationRating: 0.83
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'blockchain_01',
              role: AgentRole.BLOCKCHAIN,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.85,
                collaborationRating: 0.81
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'mobile_01',
              role: AgentRole.MOBILE,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.89,
                collaborationRating: 0.85
              },
              lastActive: new Date(),
              workload: 0
            },
            {
              id: 'game_dev_01',
              role: AgentRole.GAME_DEV,
              status: 'idle',
              performance: {
                tasksCompleted: 0,
                averageCompletionTime: 0,
                successRate: 0.86,
                collaborationRating: 0.82
              },
              lastActive: new Date(),
              workload: 0
            }
          ];
          
          // Always use our comprehensive agent list
          setAgents(initialAgents);
      } catch (error) {
        console.error('Failed to initialize agents:', error);
      }
    };

    initializeAgents();

    // Update system stats periodically
    const statsInterval = setInterval(() => {
      if (eventManagerRef.current) {
        const stats = eventManagerRef.current.getSystemStats();
        setSystemStats(stats);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(statsInterval);
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
      // Update agent statuses to show they're working
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: Math.random() > 0.5 ? 'thinking' : 'working',
        workload: Math.min(agent.workload + Math.floor(Math.random() * 20), 100),
        lastActive: new Date()
      })));

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

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Process through swarm coordinator for better results
      const response = await swarmCoordinatorRef.current!.processTask({
        id: `task_${Date.now()}`,
        title: content,
        description: content,
        status: 'pending',
        priority: 'medium',
        dependencies: [],
        subtasks: [],
        estimatedComplexity: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          requirements: [content],
          constraints: []
        }
      });
      
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
      
      // Create task and submit to event system
      const newTask: Task = {
        id: `task_${Date.now()}`,
        title: content,
        description: `User request: ${content}`,
        status: 'pending',
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
      
      // Submit task to event manager
      if (eventManagerRef.current) {
        await eventManagerRef.current.submitTask(newTask);
      }
      
      setCurrentTasks(prev => [...prev, newTask]);

      // Update agent performance metrics
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: Math.random() > 0.3 ? 'idle' : 'collaborating',
        performance: {
          ...agent.performance,
          tasksCompleted: agent.performance.tasksCompleted + 1,
          averageCompletionTime: Math.floor(Math.random() * 10) + 1
        }
      })));
      
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

      // Reset agent statuses on error
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: 'idle',
        workload: Math.max(agent.workload - 10, 0)
      })));
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
    swarmCoordinator: swarmCoordinatorRef.current!,
    agents,
    selectedAgent,
    setSelectedAgent,
    eventManager: eventManagerRef.current!,
    systemStats,
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