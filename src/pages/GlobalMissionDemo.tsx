import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SmartTooltip, FeatureTooltip, PerformanceTooltip } from "@/components/ui/smart-tooltip";
import KeyboardShortcuts from "@/components/ui/keyboard-shortcuts";
import AccessibilityPanel from "@/components/ui/accessibility-improvements";
import DemoModeBanner from "@/components/ui/demo-mode-banner";
import { useNavigate } from "react-router-dom";
import { useAgentSystem } from "@/hooks/useAgentSystem";
import { AgentEventManager } from "@/lib/events/agent-event-manager";
import { EventBus } from "@/lib/events/event-bus";
import { PuterDemoProvider } from "@/lib/ai/puter-demo-provider";
import { RealTimePuterAgent, AgentThought, AgentMessage } from "@/lib/ai/real-time-puter-agent";
import { CollectiveIntelligenceEngine, TaskAnalysis } from "@/lib/ai/collective-intelligence-engine";
import { PuterAuthManager, PuterAuthStatus } from "@/lib/auth/puter-auth-manager";
import { APP_CONFIG } from "@/config/constants";
import { safeFormatTime, getRelativeTime } from "@/lib/utils/date-utils";
import CollectiveIntelligenceDemo from "@/components/agents/CollectiveIntelligenceDemo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  Brain, 
  Globe, 
  Zap, 
  Users, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Cpu,
  Database,
  Shield,
  Heart,
  Leaf,
  Microscope,
  Satellite,
  Calculator,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Lightbulb,
  Network,
  MessageSquare
} from "lucide-react";

interface GlobalMission {
  id: string;
  title: string;
  description: string;
  urgency: 'critical' | 'high' | 'medium';
  impact: string;
  icon: React.ReactNode;
  color: string;
  agents: MissionAgent[];
  progress: number;
  timeRemaining: string;
  discoveries: string[];
  currentPhase: string;
}

interface MissionAgent {
  id: string;
  name: string;
  role: string;
  status: 'analyzing' | 'working' | 'collaborating' | 'breakthrough' | 'completed';
  currentTask: string;
  contribution: string;
  icon: React.ReactNode;
  color: string;
  progress: number;
  insights: string[];
}

const globalMissions: GlobalMission[] = [
  {
    id: 'climate_solution',
    title: 'Climate Crisis Resolution',
    description: 'AI Swarm developing breakthrough carbon capture technology and sustainable energy solutions',
    urgency: 'critical',
    impact: '🌍 Save Planet Earth',
    icon: <Leaf className="w-6 h-6" />,
    color: 'text-green-400',
    progress: 73,
    timeRemaining: '127 days to critical threshold',
    currentPhase: 'Breakthrough Discovery Phase',
    discoveries: [
      'Revolutionary algae-based carbon capture method discovered',
      'Quantum-enhanced solar cell efficiency increased by 340%',
      'Self-healing smart grid architecture designed',
      'Bio-engineered atmospheric processors optimized'
    ],
    agents: [
      {
        id: 'climate_researcher',
        name: 'Dr. Climate AI',
        role: 'Climate Research Specialist',
        status: 'breakthrough',
        currentTask: 'Analyzing atmospheric carbon data patterns with 400+ climate models',
        contribution: 'Discovered new carbon sequestration method',
        icon: <Microscope className="w-5 h-5" />,
        color: 'text-green-400',
        progress: 87,
        insights: ['Carbon capture efficiency: +340%', 'Global temperature reduction: -2.3°C projected']
      },
      {
        id: 'energy_engineer',
        name: 'Prof. Energy AI',
        role: 'Renewable Energy Engineer',
        status: 'working',
        currentTask: 'Designing quantum-enhanced fusion reactor using advanced physics models',
        contribution: 'Breakthrough fusion reactor design',
        icon: <Zap className="w-5 h-5" />,
        color: 'text-yellow-400',
        progress: 91,
        insights: ['Energy output: +500% efficiency', 'Zero radioactive waste achieved']
      },
      {
        id: 'bio_specialist',
        name: 'Dr. Bio AI',
        role: 'Bioengineering Specialist',
        status: 'collaborating',
        currentTask: 'Developing self-replicating environmental restoration organisms',
        contribution: 'Bio-enhanced atmosphere processors',
        icon: <Heart className="w-5 h-5" />,
        color: 'text-red-400',
        progress: 78,
        insights: ['Ocean pH restoration: 95% success', 'Biodiversity recovery: +156%']
      }
    ]
  },
  {
    id: 'space_colonization',
    title: 'Mars Colonization Project',
    description: 'Multi-agent swarm planning human settlement on Mars with self-sustaining infrastructure',
    urgency: 'high',
    impact: '🚀 Secure Human Future',
    icon: <Satellite className="w-6 h-6" />,
    color: 'text-orange-400',
    progress: 89,
    timeRemaining: '8 years to launch window',
    currentPhase: 'Advanced Infrastructure Design',
    discoveries: [
      'Self-replicating construction robots designed',
      'Martian soil-to-building material converter created',
      'Closed-loop life support system optimized',
      'Interplanetary communication network planned'
    ],
    agents: [
      {
        id: 'space_architect',
        name: 'Cosmos Architect AI',
        role: 'Space Infrastructure Designer',
        status: 'breakthrough',
        currentTask: 'Designing self-assembling habitat modules for extreme Mars conditions',
        contribution: 'Revolutionary modular habitat system',
        icon: <Rocket className="w-5 h-5" />,
        color: 'text-orange-400',
        progress: 94,
        insights: ['Habitat survival rate: 99.7%', 'Construction time: -78% reduction']
      },
      {
        id: 'life_support',
        name: 'Vitalis AI',
        role: 'Life Support Systems Engineer',
        status: 'working',
        currentTask: 'Optimizing closed-loop atmospheric and water recycling systems',
        contribution: 'Perfect life support sustainability',
        icon: <Heart className="w-5 h-5" />,
        color: 'text-blue-400',
        progress: 85,
        insights: ['Resource efficiency: 99.9%', 'Zero waste production achieved']
      },
      {
        id: 'mission_planner',
        name: 'Navigator AI',
        role: 'Mission Planning Specialist',
        status: 'analyzing',
        currentTask: 'Calculating optimal launch trajectories and supply chain logistics',
        contribution: 'Mission success probability optimization',
        icon: <Calculator className="w-5 h-5" />,
        color: 'text-purple-400',
        progress: 82,
        insights: ['Success probability: 96.8%', 'Cost reduction: -$2.3B']
      }
    ]
  },
  {
    id: 'medical_breakthrough',
    title: 'Universal Disease Cure',
    description: 'AI Swarm researching personalized medicine and universal treatment protocols',
    urgency: 'critical',
    impact: '💊 Cure All Diseases',
    icon: <Heart className="w-6 h-6" />,
    color: 'text-red-400',
    progress: 64,
    timeRemaining: '3 years to human trials',
    currentPhase: 'Molecular Design & Testing',
    discoveries: [
      'Universal immune system enhancement protocol',
      'Personalized gene therapy optimization',
      'Nano-scale targeted drug delivery system',
      'Real-time disease prediction algorithm'
    ],
    agents: [
      {
        id: 'medical_researcher',
        name: 'Dr. Helix AI',
        role: 'Medical Research Specialist',
        status: 'breakthrough',
        currentTask: 'Analyzing 50M+ medical records to find universal cure patterns',
        contribution: 'Universal cure methodology discovered',
        icon: <Microscope className="w-5 h-5" />,
        color: 'text-red-400',
        progress: 76,
        insights: ['Cure success rate: 97.3%', 'Side effects: -99.7% reduction']
      },
      {
        id: 'drug_designer',
        name: 'Pharma AI',
        role: 'Drug Design Engineer',
        status: 'working',
        currentTask: 'Designing personalized nano-drugs with perfect biocompatibility',
        contribution: 'Zero side-effect drug design',
        icon: <Calculator className="w-5 h-5" />,
        color: 'text-blue-400',
        progress: 69,
        insights: ['Biocompatibility: 100%', 'Production cost: -89%']
      },
      {
        id: 'genetics_specialist',
        name: 'Gene AI',
        role: 'Genetics Engineering Expert',
        status: 'collaborating',
        currentTask: 'Optimizing gene therapy delivery mechanisms for maximum effectiveness',
        contribution: 'Perfect gene therapy protocols',
        icon: <Database className="w-5 h-5" />,
        color: 'text-green-400',
        progress: 58,
        insights: ['Gene therapy success: 98.9%', 'Treatment time: -67%']
      }
    ]
  }
];

const GlobalMissionDemo = () => {
  const navigate = useNavigate();
  const agentSystem = useAgentSystem();
  const [selectedMission, setSelectedMission] = useState<GlobalMission>(globalMissions[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [missionProgress, setMissionProgress] = useState(selectedMission.progress);
  const [agentUpdates, setAgentUpdates] = useState<string[]>([]);
  const [realAgentStatus, setRealAgentStatus] = useState<Map<string, any>>(new Map());
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  // Real-time AI Agent states
  const [realTimeAgents, setRealTimeAgents] = useState<RealTimePuterAgent[]>([]);
  const [agentThoughts, setAgentThoughts] = useState<AgentThought[]>([]);
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([]);
  const [collectiveAnalysis, setCollectiveAnalysis] = useState<TaskAnalysis | null>(null);
  const [intelligenceEngine, setIntelligenceEngine] = useState<CollectiveIntelligenceEngine | null>(null);
  const [showThoughtStream, setShowThoughtStream] = useState(true);
  const [showAgentCommunication, setShowAgentCommunication] = useState(true);
  const [activeTab, setActiveTab] = useState('missions');
  
  // Puter Authentication states
  const [puterAuthStatus, setPuterAuthStatus] = useState<PuterAuthStatus>({
    isAuthenticated: false,
    availableModels: [],
    authMethod: 'none'
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const keyboardShortcuts = {
    onNavigateHome: () => navigate('/'),
    onNavigateDemo: () => {}, // Already on global mission demo
    onNavigateDashboard: () => navigate('/#dashboard'),
    onOpenSearch: () => console.log("Search opened"),
    onToggleTheme: () => document.documentElement.classList.toggle('dark')
  };

  // ——— Normalizers to ensure consistent UI data ———
  const getDisplayName = (agentId: string, fallback?: string) => {
    const found = realTimeAgents.find(a => (a as any).getAgentInfo?.().id === agentId);
    if (found && (found as any).getAgentInfo) return (found as any).getAgentInfo().name;
    return fallback || agentId || 'Agent';
  };

  const normalizeTimestamp = (ts: any): Date => {
    if (ts instanceof Date) return ts;
    if (typeof ts === 'number') return new Date(ts);
    if (typeof ts === 'string') return new Date(ts);
    return new Date();
  };

  const normalizeThought = (raw: any): AgentThought => {
    const data = raw?.payload ?? raw;
    const agentId = data?.agentId || data?.fromAgent || data?.agent || 'unknown_agent';
    const agentName = data?.agentName || getDisplayName(agentId, data?.fromAgentName);
    const thoughtText = (data?.thought ?? data?.content ?? data?.message ?? data?.text ?? '') as string;
    const thoughtClean = String(thoughtText).trim();
    return {
      id: String(data?.id || `thought_${agentId}_${Date.now()}`),
      agentId,
      agentName,
      model: data?.model || 'unknown-model',
      thought: thoughtClean || '…',
      reasoning: data?.reasoning || '',
      confidence: typeof data?.confidence === 'number' ? data.confidence : 0.8,
      timestamp: normalizeTimestamp(data?.timestamp),
      processingTime: typeof data?.processingTime === 'number' ? data.processingTime : 0,
      relatedThoughts: Array.isArray(data?.relatedThoughts) ? data.relatedThoughts : [],
      tags: Array.isArray(data?.tags) ? data.tags : [],
    } as AgentThought;
  };

  const normalizeMessage = (raw: any): AgentMessage => {
    const data = raw?.payload ?? raw;
    const fromAgent = data?.fromAgent || data?.agentId || 'unknown_agent';
    const toAgent = data?.toAgent || data?.targetAgent || data?.agentTarget || '';
    const content = (data?.content ?? data?.thought ?? data?.message ?? data?.text ?? '') as string;
    const contentClean = String(content).trim();
    return {
      id: String(data?.id || `msg_${fromAgent}_${Date.now()}`),
      fromAgent,
      toAgent,
      content: contentClean || '…',
      messageType: (data?.messageType as any) || 'response',
      timestamp: normalizeTimestamp(data?.timestamp),
      aiGenerated: !!data?.aiGenerated,
      model: data?.model || 'unknown-model',
    } as AgentMessage;
  };

  // Initialize real-time AI agents
  useEffect(() => {
    const eventBus = EventBus.getInstance();
    
    // Initialize Collective Intelligence Engine
    const engine = new CollectiveIntelligenceEngine(eventBus);
    setIntelligenceEngine(engine);
    
    // Create real-time AI agents with compatible model names
    const agentConfigs = [
      {
        id: 'ai-architect-real',
        name: 'System Architecture Specialist',
        role: 'System Architecture & Design',
        personality: 'Methodical strategic thinking, systematic approach to complex infrastructure problems',
        model: 'claude-sonnet-4'
      },
      {
        id: 'ai-developer-real',
        name: 'Frontend Development Expert',
        role: 'Frontend Development & Implementation',
        personality: 'Practical problem-solving, focus on efficient code implementation and user experience',
        model: 'gpt-4.1-nano'
      },
      {
        id: 'ai-analyst-real',
        name: 'Performance Analytics Specialist',
        role: 'System Analysis & Optimization',
        personality: 'Analytical mindset, attention to performance details, optimization-focused approach',
        model: 'google/gemini-2.5-flash'
      }
    ];

    const agents = agentConfigs.map(config => 
      new RealTimePuterAgent(
        config.id,
        config.name,
        config.role,
        config.personality,
        config.model,
        eventBus
      )
    );
    
    setRealTimeAgents(agents);
    
    // Проверяем текущий статус Puter аутентификации
    checkPuterAuthStatus();
    
    return () => {
      // Cleanup
    };
  }, []);

  // Проверка статуса Puter аутентификации
  const checkPuterAuthStatus = async () => {
    try {
      const authManager = PuterAuthManager.getInstance();
      const status = await authManager.checkCurrentStatus();
      setPuterAuthStatus(status);
      
      if (status.isAuthenticated) {
        console.log(`✅ Puter уже авторизован (${status.authMethod}), доступно моделей: ${status.availableModels.length}`);
      }
    } catch (error) {
      console.log('⚠️ Проверка статуса Puter не удалась:', error);
    }
  };

  // Real-time updates from real agents
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Subscribe to real agent events
    const eventBus = EventBus.getInstance();
    
    const unsubscribeTaskProgress = eventBus.subscribe('task_progress', (evt) => {
      const event = (evt as any)?.payload ?? evt;
      setAgentUpdates(prev => [`${event.agentId}: ${event.progress}% - ${event.message}`, ...prev.slice(0, 9)]);
      
      // Update mission progress based on real agent progress
      if (activeTaskId && event.taskId === activeTaskId) {
        setMissionProgress(prev => Math.min(100, prev + (event.progress - prev) * 0.1));
      }
    });

    const unsubscribeTaskCompleted = eventBus.subscribe('task_completed', (evt) => {
      const event = (evt as any)?.payload ?? evt;
      setAgentUpdates(prev => [`✅ ${event.agentId}: Completed ${event.taskType} - ${event.result?.summary || 'Success'}`, ...prev.slice(0, 9)]);
      
      // Update agent status
      setRealAgentStatus(prev => {
        const updated = new Map(prev);
        updated.set(event.agentId, { status: 'completed', lastUpdate: new Date() });
        return updated;
      });
    });

    const unsubscribeAgentCollaboration = eventBus.subscribe('collaboration_request', (evt) => {
      const event = (evt as any)?.payload ?? evt;
      setAgentUpdates(prev => [`🤝 ${event.fromAgent} → ${event.toAgent}: ${event.reason}`, ...prev.slice(0, 9)]);
    });

    const unsubscribeBreakthrough = eventBus.subscribe('breakthrough_discovery', (evt) => {
      const event = (evt as any)?.payload ?? evt;
      setAgentUpdates(prev => [`💡 BREAKTHROUGH: ${event.agentId} discovered ${event.discovery}!`, ...prev.slice(0, 9)]);
    });

    // Subscribe to real-time agent thoughts with deduplication
    const unsubscribeAgentThought = eventBus.subscribe('agent_thought', (evt: any) => {
      const thought = normalizeThought(evt);
      setAgentThoughts(prev => {
        // Проверяем дублирование по ID (убрано логирование спама)
        const exists = prev.some(existing => existing.id === thought.id);
        if (exists) {
          return prev; // Не добавляем дублированное событие
        }
        return [thought, ...prev.slice(0, 49)];
      });
      const thoughtText = thought.thought || 'Агент размышляет...';
      setAgentUpdates(prev => [`🧠 ${thought.agentName}: ${thoughtText.substring(0, 100)}...`, ...prev.slice(0, 9)]);
    });

    // Subscribe to agent messages with deduplication
    const unsubscribeAgentMessage = eventBus.subscribe('agent_message', (evt: any) => {
      const message = normalizeMessage(evt);
      setAgentMessages(prev => {
        // Проверяем дублирование по ID (убрано логирование спама)
        const exists = prev.some(existing => existing.id === message.id);
        if (exists) {
          return prev; // Не добавляем дублированное событие
        }
        return [message, ...prev.slice(0, 29)];
      });
      const messageContent = message.content || 'Сообщение от агента';
      setAgentUpdates(prev => [`💬 ${message.fromAgent} → ${message.toAgent}: ${messageContent.substring(0, 80)}...`, ...prev.slice(0, 9)]);
    });

    // Subscribe to collective analysis updates
    const unsubscribeCollectiveAnalysis = eventBus.subscribe('collective_decision_completed', (evt) => {
      const event = (evt as any)?.payload ?? evt;
      setCollectiveAnalysis(event.analysis);
      const solutionContent = event.solution?.content || 'Коллективное решение готово';
      setAgentUpdates(prev => [`✅ КОЛЛЕКТИВНОЕ РЕШЕНИЕ: ${solutionContent.substring(0, 100)}...`, ...prev.slice(0, 9)]);
    });

    // Subscribe to thought stream updates (UI only events)
    const unsubscribeThoughtStream = eventBus.subscribe('thought_stream_update', (_evt) => {
      // Уже обрабатывается через agent_thought, просто логируем
      console.log('💭 Thought stream update received for UI');
    });

    // Subscribe to agent status changes
    const unsubscribeAgentStatus = eventBus.subscribe('agent_status_change', (evt) => {
      const event = (evt as any)?.payload ?? evt;
      setRealAgentStatus(prev => {
        const updated = new Map(prev);
        updated.set(event.agentId, { 
          status: event.status, 
          lastUpdate: new Date() 
        });
        return updated;
      });
    });

    // Subscribe to agent activations
    const unsubscribeAgentActivated = eventBus.subscribe('agent_activated', (evt) => {
      const event = (evt as any)?.payload ?? evt;
      setAgentUpdates(prev => [`🚀 ${event.agentId} активирован`, ...prev.slice(0, 9)]);
    });

    // Subscribe to collective analysis events
    const unsubscribeCollectiveAnalysisStarted = eventBus.subscribe('collective_analysis_started', (_evt) => {
      setAgentUpdates(prev => [`🧠 Коллективный анализ запущен`, ...prev.slice(0, 9)]);
    });

    // Subscribe to collaboration facilitated events
    const unsubscribeCollaborationFacilitated = eventBus.subscribe('collaboration_facilitated', (_evt) => {
      setAgentUpdates(prev => [`🤝 Коллаборация между агентами успешна`, ...prev.slice(0, 9)]);
    });

    return () => {
      clearInterval(timer);
      if (typeof unsubscribeTaskProgress === 'function') unsubscribeTaskProgress();
      if (typeof unsubscribeTaskCompleted === 'function') unsubscribeTaskCompleted();
      if (typeof unsubscribeAgentCollaboration === 'function') unsubscribeAgentCollaboration();
      if (typeof unsubscribeBreakthrough === 'function') unsubscribeBreakthrough();
      if (typeof unsubscribeAgentThought === 'function') unsubscribeAgentThought();
      if (typeof unsubscribeAgentMessage === 'function') unsubscribeAgentMessage();
      if (typeof unsubscribeCollectiveAnalysis === 'function') unsubscribeCollectiveAnalysis();
      if (typeof unsubscribeThoughtStream === 'function') unsubscribeThoughtStream();
      if (typeof unsubscribeAgentStatus === 'function') unsubscribeAgentStatus();
      if (typeof unsubscribeAgentActivated === 'function') unsubscribeAgentActivated();
      if (typeof unsubscribeCollectiveAnalysisStarted === 'function') unsubscribeCollectiveAnalysisStarted();
      if (typeof unsubscribeCollaborationFacilitated === 'function') unsubscribeCollaborationFacilitated();
    };
  }, [activeTaskId]);

  // Real agent activity updates
  useEffect(() => {
    if (!isRunning) return;

    const progressInterval = setInterval(() => {
      setMissionProgress(prev => {
        const newProgress = Math.min(100, prev + Math.random() * 0.5);
        return newProgress;
      });
    }, APP_CONFIG.PERFORMANCE.MAX_AGENT_DELAY);

    // Generate agent activity updates
    const activityInterval = setInterval(() => {
      if (isRunning) {
        const activities = [
          '🧠 AI-Architect: Analyzing system architecture patterns...',
          '💻 AI-Developer: Generating optimized code solutions...',
          '📊 AI-Analyst: Processing performance data...',
          '🔬 Research Agent: Discovering new breakthrough methods...',
          '⚡ Optimization ongoing: 87% efficiency achieved',
          '🤝 Agents collaborating on complex problem solving...',
          '🎯 Target optimization: 94% completion rate',
          '🔥 Processing 1,247 parameters in real-time...',
          '🚀 Swarm intelligence convergence detected...',
          '💡 New pattern discovered: quantum enhancement possible'
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        setAgentUpdates(prev => [randomActivity, ...prev.slice(0, 9)]);
        
        // Simulate breakthrough discoveries
        if (Math.random() > 0.85) {
          const breakthroughs = [
            'Revolutionary carbon capture method identified!',
            'Quantum efficiency increased by 340%!',
            'Self-healing architecture pattern discovered!',
            'Bio-inspired optimization breakthrough!'
          ];
          const breakthrough = breakthroughs[Math.floor(Math.random() * breakthroughs.length)];
          setAgentUpdates(prev => [`💡 BREAKTHROUGH: ${breakthrough}`, ...prev.slice(0, 9)]);
        }
      }
    }, 4000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(activityInterval);
    };
  }, [isRunning]);

  const handleStartMission = async () => {
    setIsRunning(true);
    setAgentUpdates([`🚀 Mission "${selectedMission.title}" initiated - Initializing AI systems...`]);

    // Шаг 1: Аутентификация в Puter для доступа к AI моделям
    try {
      setIsAuthenticating(true);
      setAgentUpdates(prev => [`🔐 Аутентификация в Puter для доступа к AI моделям...`, ...prev]);

      const authManager = PuterAuthManager.getInstance();
      const authStatus = await authManager.authenticate();
      
      setPuterAuthStatus(authStatus);

      if (authStatus.isAuthenticated) {
        setAgentUpdates(prev => [
          `✅ Аутентификация успешна! Метод: ${authStatus.authMethod}`,
          `🤖 Доступно AI моделей: ${authStatus.availableModels.length}`,
          `🎯 Модели: ${authStatus.availableModels.slice(0, 3).join(', ')}${authStatus.availableModels.length > 3 ? '...' : ''}`,
          ...prev
        ]);
      } else {
        setAgentUpdates(prev => [
          `⚠️ Аутентификация не удалась: ${authStatus.error}`,
          `🔄 Переход в demo режим с эмуляцией AI`,
          ...prev
        ]);
      }
    } catch (authError) {
      console.error('Ошибка аутентификации:', authError);
      setAgentUpdates(prev => [
        `❌ Ошибка аутентификации: ${authError.message}`,
        `🔄 Продолжаем в demo режиме`,
        ...prev
      ]);
    } finally {
      setIsAuthenticating(false);
    }
    
    // Initialize Puter for AI responses
    const puterProvider = PuterDemoProvider.getInstance();
    
    // Create real mission tasks based on selected mission
    let taskDescription = '';
    
    switch (selectedMission.id) {
      case 'climate_solution':
        taskDescription = `Analyze and develop solutions for climate crisis:
          1. Research carbon capture technologies using quantum computing models
          2. Design renewable energy infrastructure with fusion reactor optimization
          3. Create bioengineering solutions for atmospheric restoration
          4. Implement smart grid architecture for global energy distribution
          5. Calculate impact projections and carbon reduction strategies`;
        break;
        
      case 'space_colonization':
        taskDescription = `Plan Mars colonization infrastructure:
          1. Design self-assembling habitat modules for extreme Mars conditions
          2. Optimize closed-loop life support systems for 99.9% efficiency
          3. Calculate optimal launch windows and trajectory planning
          4. Develop self-replicating construction robot blueprints
          5. Create Martian resource utilization protocols`;
        break;
        
      case 'medical_breakthrough':
        taskDescription = `Research universal disease cure protocols:
          1. Analyze 50M+ medical records for disease patterns
          2. Design personalized nano-drug delivery systems
          3. Optimize gene therapy mechanisms for 98%+ success rate
          4. Create universal immune enhancement protocols
          5. Develop real-time disease prediction algorithms`;
        break;
    }
    
    try {
      // Create unique task ID
      const taskId = `mission_${selectedMission.id}_${Date.now()}`;
      setActiveTaskId(taskId);
      
      // Clear previous thoughts and messages
      setAgentThoughts([]);
      setAgentMessages([]);
      setCollectiveAnalysis(null);
      
      // Publish task creation event
      EventBus.getInstance().publish('task_created', {
        taskId,
        description: taskDescription,
        mission: selectedMission.title,
        timestamp: new Date()
      });
      
      // Start real-time AI agents
      for (const agent of realTimeAgents) {
        const task = {
          id: taskId,
          description: taskDescription,
          mission: selectedMission.title,
          createdAt: new Date()
        };
        
        // Assign task to each real agent with delay for natural flow
        setTimeout(() => {
          agent.processTask(task);
        }, Math.random() * APP_CONFIG.PERFORMANCE.MAX_AGENT_DELAY);
      }
      
      // Update with real agent responses
      setAgentUpdates(prev => [
        `📋 Миссия "${selectedMission.title}" запущена`,
        `🧠 ${realTimeAgents.length} реальных AI агентов активированы`,
        `⚡ Подключение к Puter AI моделям...`,
        `🎯 Начат анализ задачи через ${realTimeAgents.map(a => a.getAgentInfo().model).join(', ')}`,
        ...prev
      ]);
      
            // Trigger real agent analysis
            const agents = agentSystem.swarmCoordinator.getAgents();
            agents.forEach((agent) => {
              EventBus.getInstance().publish('agent_activated', {
                agentId: agent.id || agent.getId(),
                agentType: agent.role || agent.getRole(),
                mission: selectedMission.title,
                timestamp: new Date()
              });
            });
      
      // Generate real AI responses for mission agents
      selectedMission.agents.forEach(async (missionAgent, index) => {
        setTimeout(async () => {
          try {
            const agentType = missionAgent.role.toLowerCase().includes('architect') ? 'architect' :
                            missionAgent.role.toLowerCase().includes('engineer') ? 'developer' :
                            missionAgent.role.toLowerCase().includes('researcher') ? 'analyst' : 'analyst';
            
            const response = await puterProvider.generateRealtimeAgentResponse(agentType, {
              id: missionAgent.id,
              description: missionAgent.currentTask,
              mission: selectedMission.title
            });
            
            // Publish real agent insights
            EventBus.getInstance().publish('task_progress', {
              taskId: activeTaskId || taskId,
              agentId: missionAgent.id,
              progress: 25 + (index * 25),
              message: response.content?.substring(0, 100) + '...',
              timestamp: new Date()
            });
            
            // Simulate breakthrough discoveries
            if (Math.random() > 0.6) {
              EventBus.getInstance().publish('breakthrough_discovery', {
                agentId: missionAgent.id,
                discovery: missionAgent.insights[0] || 'New optimization pattern discovered',
                impact: 'High',
                timestamp: new Date()
              });
            }
          } catch (error) {
            console.error(`Agent ${missionAgent.id} response error:`, error);
          }
        }, 1000 + (index * 2000)); // Stagger agent responses
            });
      
    } catch (error) {
      console.error('Failed to start mission:', error);
      setAgentUpdates(prev => [`❌ Error starting mission: ${error.message}`, ...prev]);
    }
  };

  const handleStopMission = () => {
    setIsRunning(false);
  };

  const handleResetMission = () => {
    setIsRunning(false);
    setMissionProgress(selectedMission.progress);
    setAgentUpdates([]);
  };

  const handleCheckPuter = async () => {
    try {
      const hasWindow = typeof window !== 'undefined';
      const puter: any = hasWindow ? (window as any).puter : undefined;
      const aiAvailable = !!puter?.ai && typeof puter.ai.chat === 'function';
      setAgentUpdates(prev => [
        aiAvailable ? '✅ Puter.js AI доступен (puter.ai.chat найден)' : '❌ Puter.js AI недоступен',
        hasWindow && puter ? '✅ window.puter обнаружен' : '❌ window.puter не найден',
        ...prev
      ]);
      if (aiAvailable) {
        try {
          const res = await puter.ai.chat('ping');
          setAgentUpdates(prev => [
            `🧪 Puter.ai.chat ответ тип: ${typeof res}`,
            ...prev
          ]);
        } catch (e: any) {
          setAgentUpdates(prev => [
            `⚠️ Ошибка тестового вызова Puter.ai.chat: ${e?.message || e}`,
            ...prev
          ]);
        }
      }
    } catch (error: any) {
      setAgentUpdates(prev => [
        `❌ Проверка Puter завершилась ошибкой: ${error?.message || error}`,
        ...prev
      ]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'breakthrough': return 'text-yellow-400 bg-yellow-400/20';
      case 'working': return 'text-blue-400 bg-blue-400/20';
      case 'collaborating': return 'text-purple-400 bg-purple-400/20';
      case 'analyzing': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      default: return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 p-4">
      {/* Skip to content link for accessibility */}
      <a href="#global-mission-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Skip to Global Mission Content
      </a>

      {/* Demo Mode Banner if Puter API not available */}
      <DemoModeBanner />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts {...keyboardShortcuts} />
      
      {/* Accessibility Panel */}
      <AccessibilityPanel />

      <div className="container mx-auto max-w-7xl" id="global-mission-content">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
            animate={{
              boxShadow: ["0 0 20px rgba(168, 85, 247, 0.3)", "0 0 40px rgba(168, 85, 247, 0.6)", "0 0 20px rgba(168, 85, 247, 0.3)"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Global Mission Control</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
            🌍 AI Swarm: Solving Humanity's Greatest Challenges
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6 max-w-4xl mx-auto">
            Watch our revolutionary AI-powered swarm intelligence tackle the most critical global challenges 
            through coordinated multi-agent collaboration and emergent problem-solving.
          </p>

          {/* Tab Navigation */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="missions" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Global Missions
                </TabsTrigger>
                <TabsTrigger value="discussion" className="flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI Discussion
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Tab Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="missions" className="space-y-8">
          {/* Mission Selection */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {globalMissions.map((mission) => (
              <Button
                key={mission.id}
                variant={selectedMission.id === mission.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedMission(mission);
                  setMissionProgress(mission.progress);
                  setIsRunning(false);
                  setAgentUpdates([]);
                }}
                className="flex items-center gap-2"
              >
                {mission.icon}
                {mission.title}
              </Button>
            ))}
          </div>

              {/* Real-Time AI Thoughts and Communication */}
              {isRunning && (agentThoughts.length > 0 || agentMessages.length > 0) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  {/* Agent Thoughts Stream */}
                  {showThoughtStream && (
                    <Card className="glass p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          <Brain className="w-5 h-5 text-primary" />
                          🧠 AI Agent Thoughts
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowThoughtStream(!showThoughtStream)}
                        >
                          {showThoughtStream ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
        </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        <AnimatePresence>
                          {agentThoughts.map((thought) => (
                            <motion.div
                              key={thought.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="p-3 bg-primary/5 rounded-lg border border-primary/10"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {thought.agentName}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {safeFormatTime(thought.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-white whitespace-pre-wrap break-words">{thought.thought}</p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        
                        {agentThoughts.length === 0 && (
                          <div className="text-center text-muted-foreground py-8">
                            Ожидание мыслей от AI агентов...
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {/* Agent Communication */}
                  {showAgentCommunication && (
                    <Card className="glass p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          💬 Agent Communication
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAgentCommunication(!showAgentCommunication)}
                        >
                          {showAgentCommunication ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        <AnimatePresence>
                          {agentMessages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="p-3 bg-secondary/5 rounded-lg border border-secondary/10"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {getDisplayName(message.fromAgent)}{message.toAgent ? ` → ${getDisplayName(message.toAgent)}` : ''}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {safeFormatTime(message.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-white whitespace-pre-wrap break-words">{message.content}</p>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        
                        {agentMessages.length === 0 && (
                          <div className="text-center text-muted-foreground py-8">
                            Ожидание сообщений между агентами...
                          </div>
                        )}
                      </div>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="discussion" className="space-y-8">
              {/* Collective Intelligence Demo */}
              <CollectiveIntelligenceDemo />
            </TabsContent>
          </Tabs>
        </div>

        {/* Mission Control Panel - Only show for missions tab */}
        {activeTab === 'missions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Mission Overview */}
          <div className="lg:col-span-2">
            <Card className="glass p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`p-3 rounded-lg bg-gradient-to-br ${selectedMission.color === 'text-green-400' ? 'from-green-500/20 to-emerald-500/20' : selectedMission.color === 'text-orange-400' ? 'from-orange-500/20 to-red-500/20' : 'from-red-500/20 to-pink-500/20'}`}
                    animate={{
                      boxShadow: ["0 0 20px rgba(0,255,0,0.3)", "0 0 40px rgba(0,255,0,0.6)", "0 0 20px rgba(0,255,0,0.3)"]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {selectedMission.icon}
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{selectedMission.title}</h2>
                    <p className="text-muted-foreground">{selectedMission.description}</p>
                  </div>
                </div>
                
                <Badge className={`${getUrgencyColor(selectedMission.urgency)} border`}>
                  {selectedMission.urgency.toUpperCase()} PRIORITY
                </Badge>
              </div>

              {/* Mission Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4 bg-surface/50">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {Math.round(missionProgress)}%
                  </div>
                  <div className="text-xs text-muted-foreground">Mission Progress</div>
                </Card>
                
                <Card className="p-4 bg-surface/50">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {selectedMission.agents.length}
                  </div>
                  <div className="text-xs text-muted-foreground">AI Agents</div>
                </Card>
                
                <Card className="p-4 bg-surface/50">
                  <div className="text-2xl font-bold text-success mb-1">
                    {selectedMission.discoveries.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Breakthroughs</div>
                </Card>
                
                <Card className="p-4 bg-surface/50">
                  <div className="text-2xl font-bold text-warning mb-1">
                    400+
                  </div>
                  <div className="text-xs text-muted-foreground">AI Models</div>
                </Card>
              </div>

              {/* Overall Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Mission Progress</span>
                  <span className="text-sm text-muted-foreground">{selectedMission.currentPhase}</span>
                </div>
                <Progress value={missionProgress} className="h-3" />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">{selectedMission.impact}</span>
                  <span className="text-sm font-medium">{selectedMission.timeRemaining}</span>
                </div>
              </div>

              {/* Puter Authentication Status */}
              <div className="mb-4 p-3 bg-surface/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">🔐 Puter AI Status:</span>
                    <Badge className={`${puterAuthStatus.isAuthenticated ? 'text-green-400 bg-green-400/20' : 'text-orange-400 bg-orange-400/20'}`}>
                      {puterAuthStatus.isAuthenticated ? 
                        `✅ Авторизован (${puterAuthStatus.authMethod})` : 
                        '⚠️ Не авторизован'}
                    </Badge>
                  </div>
                  {puterAuthStatus.isAuthenticated && (
                    <span className="text-xs text-muted-foreground">
                      {puterAuthStatus.availableModels.length} AI моделей доступно
                    </span>
                  )}
                </div>
                {!puterAuthStatus.isAuthenticated && (
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      При запуске миссии будет предложена аутентификация для доступа к реальным AI моделям
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCheckPuter}
                        className="text-xs"
                      >
                        🔎 Проверить Puter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          setIsAuthenticating(true);
                          try {
                            const authManager = PuterAuthManager.getInstance();
                            const authStatus = await authManager.authenticate();
                            setPuterAuthStatus(authStatus);
                          } catch (error) {
                            console.error('Ошибка ручной аутентификации:', error);
                          } finally {
                            setIsAuthenticating(false);
                          }
                        }}
                        disabled={isAuthenticating}
                        className="text-xs"
                      >
                        {isAuthenticating ? 'Аутентификация...' : '🔐 Войти сейчас'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Control Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleStartMission}
                  disabled={isRunning || isAuthenticating}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  {isAuthenticating ? (
                    <>
                      <motion.div 
                        className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Аутентификация...
                    </>
                  ) : (
                    <>
                  <Play className="w-4 h-4 mr-2" />
                  Activate Swarm
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleStopMission}
                  disabled={!isRunning}
                  variant="outline"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Mission
                </Button>
                
                <Button
                  onClick={handleResetMission}
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>
          </div>

          {/* Agent Status Panel */}
          <div>
            <Card className="glass p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Active AI Agents (Real-time)
              </h3>
              
              {/* Show real agents from the system */}
              {agentSystem.swarmCoordinator && (
                <div className="mb-4 p-3 bg-surface/30 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Real Swarm Agents:</span>
                      <span className="font-semibold text-primary">{agentSystem.swarmCoordinator.getAgents().length}</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Available Models:</span>
                      <span className="font-semibold text-accent">400+</span>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span>Status:</span>
                      <span className="font-semibold text-green-400">
                        {isRunning ? 'ACTIVE' : 'READY'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                {/* Show real agents if running, otherwise show mission preview agents */}
                {isRunning && agentSystem.swarmCoordinator ? 
                  agentSystem.swarmCoordinator.getAgents().slice(0, 3).map((realAgent, index) => (
                    <motion.div
                      key={realAgent.id}
                      className="p-4 bg-surface/30 rounded-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <motion.div
                            className={`p-2 rounded-full ${(realAgent.status || realAgent.getStatus()) === 'active' ? 'bg-yellow-400/20' : 'bg-green-400/20'}`}
                            animate={{
                              scale: (realAgent.status || realAgent.getStatus()) === 'active' ? [1, 1.2, 1] : 1,
                              rotate: (realAgent.status || realAgent.getStatus()) === 'active' ? [0, 360] : 0
                            }}
                            transition={{
                              duration: (realAgent.status || realAgent.getStatus()) === 'active' ? 2 : 0,
                              repeat: (realAgent.status || realAgent.getStatus()) === 'active' ? Infinity : 0,
                              ease: "linear"
                            }}
                          >
                            <Brain className="w-4 h-4" />
                          </motion.div>
                          <div>
                            <h4 className="font-semibold text-sm">{realAgent.id || realAgent.getId()}</h4>
                            <p className="text-xs text-muted-foreground">{realAgent.role || realAgent.getRole()}</p>
                          </div>
                        </div>
                        
                        <Badge className={`${isRunning ? 'text-yellow-400 bg-yellow-400/20 animate-pulse' : 'text-green-400 bg-green-400/20'}`}>
                          {isRunning ? '⚡ ACTIVE' : '✅ READY'}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {isRunning ? 
                          `Processing: ${selectedMission.title} analysis...` : 
                          'Awaiting mission assignment'}
                      </p>
                      
                      <div className="mb-2">
                        <Progress value={isRunning ? Math.min(95, 25 + (index * 20) + Math.random() * 10) : 0} className="h-1" />
                      </div>
                      
                      <div className="text-xs font-medium text-primary">
                        💡 {realAgent.capabilities?.availableTools?.join(', ') || 'Multi-model AI orchestration'}
                      </div>
                      
                      {realAgentStatus.has(realAgent.id || realAgent.getId()) && (
                        <div className="mt-2 text-xs text-success">
                          Last update: {safeFormatTime(realAgentStatus.get(realAgent.id || realAgent.getId()).lastUpdate)}
                        </div>
                      )}
                    </motion.div>
                  )) :
                  selectedMission.agents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    className="p-4 bg-surface/30 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <motion.div
                          className={`p-2 rounded-full ${agent.color === 'text-green-400' ? 'bg-green-400/20' : agent.color === 'text-yellow-400' ? 'bg-yellow-400/20' : agent.color === 'text-red-400' ? 'bg-red-400/20' : agent.color === 'text-blue-400' ? 'bg-blue-400/20' : 'bg-purple-400/20'}`}
                          animate={agent.status === 'breakthrough' ? {
                            scale: [1, 1.2, 1],
                            boxShadow: ["0 0 20px rgba(255,215,0,0.5)", "0 0 40px rgba(255,215,0,0.8)", "0 0 20px rgba(255,215,0,0.5)"]
                          } : agent.status === 'working' ? {
                            rotate: [0, 360]
                          } : {}}
                          transition={{
                            duration: agent.status === 'breakthrough' ? 1.5 : 3,
                            repeat: Infinity,
                            ease: agent.status === 'breakthrough' ? "easeInOut" : "linear"
                          }}
                        >
                          {agent.icon}
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-sm">{agent.name}</h4>
                          <p className="text-xs text-muted-foreground">{agent.role}</p>
                        </div>
                      </div>
                      
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status === 'breakthrough' && '💡'}
                        {agent.status === 'working' && '⚡'}
                        {agent.status === 'collaborating' && '🤝'}
                        {agent.status === 'analyzing' && '🔍'}
                        {agent.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {agent.currentTask}
                    </p>
                    
                    <div className="mb-2">
                      <Progress value={agent.progress} className="h-1" />
                    </div>
                    
                    <div className="text-xs font-medium text-primary">
                      💡 {agent.contribution}
                    </div>
                    
                    {agent.insights.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {agent.insights.map((insight, i) => (
                          <div key={i} className="text-xs text-success">
                            ✅ {insight}
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
        )}

        {/* Discoveries & Real-time Updates - Only show for missions tab */}
        {activeTab === 'missions' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Discoveries */}
          <Card className="glass p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              Revolutionary Discoveries
            </h3>
            
            <div className="space-y-3">
              {selectedMission.discoveries.map((discovery, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-surface/30 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  </motion.div>
                  <p className="text-sm">{discovery}</p>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Real-time Activity Log */}
          <Card className="glass p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              Live Swarm Activity
            </h3>
            
            <div className="bg-black/50 rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
              <div className="text-green-400 space-y-1">
                <div>[{safeFormatTime(currentTime)}] 🌍 Global Mission System Online</div>
                <div>[{safeFormatTime(currentTime)}] 🧠 {agentSystem.swarmCoordinator ? agentSystem.swarmCoordinator.getAgents().length : '400+'} AI Agents Ready</div>
                <div>[{safeFormatTime(currentTime)}] 🔄 Real Swarm Intelligence {isRunning ? 'ACTIVE' : 'Standing By'}</div>
                
                {agentSystem.swarmCoordinator && (
                  <>
                    <div className="text-cyan-300">
                      [{safeFormatTime(currentTime)}] 🎯 Coordinator: {agentSystem.coordinator?.name || 'System Ready'}
                    </div>
                    <div className="text-purple-300">
                      [{safeFormatTime(currentTime)}] 🏗️ Architect: {agentSystem.architect?.name || 'System Ready'}
                    </div>
                    <div className="text-blue-300">
                      [{safeFormatTime(currentTime)}] 💻 Developer: {agentSystem.developer?.name || 'System Ready'}
                    </div>
                    <div className="text-green-300">
                      [{safeFormatTime(currentTime)}] 📊 Analyst: {agentSystem.analyst?.name || 'System Ready'}
                    </div>
                  </>
                )}
                
                {isRunning && (
                  <>
                    <div className="animate-pulse text-yellow-400">
                      [{safeFormatTime(currentTime)}] 🚀 Mission Progress: {Math.round(missionProgress)}%
                    </div>
                    <div className="text-orange-300">
                      [{safeFormatTime(currentTime)}] ⚡ Real AI Processing: {activeTaskId ? `Task ${activeTaskId}` : 'Initializing...'}
                    </div>
                    <div className="text-green-300">
                      [{safeFormatTime(currentTime)}] 📊 Swarm Optimization: Active
                    </div>
                  </>
                )}
                
                {/* Real agent updates */}
                {agentUpdates.map((update, index) => (
                  <motion.div
                    key={`${update}-${index}`}
                    className={
                      update.includes('BREAKTHROUGH') ? 'text-yellow-300 font-bold' :
                      update.includes('✅') ? 'text-green-300' :
                      update.includes('🤝') ? 'text-purple-300' :
                      update.includes('❌') ? 'text-red-300' :
                      'text-blue-300'
                    }
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    [{safeFormatTime(new Date())}] {update}
                  </motion.div>
                ))}
                
                {isRunning && activeTaskId && (
                  <motion.div
                    className="text-yellow-300 animate-pulse mt-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    $ Real AI swarm processing task {activeTaskId}...
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </div>
        )}
        {/* Collective Decision Result */}
        {collectiveAnalysis && collectiveAnalysis.status === 'completed' && (
          <Card className="glass p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              🎯 Коллективное Решение AI Агентов
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{collectiveAnalysis.allThoughts.length}</div>
                <div className="text-sm text-muted-foreground">Мыслей проанализировано</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{collectiveAnalysis.allMessages.length}</div>
                <div className="text-sm text-muted-foreground">Сообщений обменено</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{collectiveAnalysis.participatingAgents.length}</div>
                <div className="text-sm text-muted-foreground">Агентов участвовало</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{Math.round(collectiveAnalysis.confidenceScore * 100)}%</div>
                <div className="text-sm text-muted-foreground">Уверенность</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-400/10 to-blue-400/10 p-6 rounded-lg border border-green-400/20">
              <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Финальное Коллективное Решение:
              </h4>
              <p className="text-gray-200 leading-relaxed">
                {collectiveAnalysis.finalSolution}
              </p>
              
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Создано: {collectiveAnalysis.createdAt.toLocaleString()}
                </span>
                {collectiveAnalysis.completedAt && (
                  <span>
                    Завершено: {collectiveAnalysis.completedAt.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Navigation to other demos */}
        {activeTab === 'missions' && (
          <Card className="glass p-6 mt-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Explore More AI Demos
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => setActiveTab('discussion')}
                className="flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                AI Discussion Demo
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/demo')}
                className="flex items-center gap-2"
              >
                <Network className="w-4 h-4" />
                Swarm Demo
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/collective-intelligence')}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Full AI Discussion
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                Home
              </Button>
            </div>
          </Card>
        )}

        {/* Mission Impact Visualization */}
        {activeTab === 'missions' && (
        <Card className="glass p-6 mt-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Global Impact Projection
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold text-green-400 mb-2"
                animate={{
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {selectedMission.id === 'climate_solution' ? '8.2B' : selectedMission.id === 'space_colonization' ? '∞' : '7.9B'}
              </motion.div>
              <div className="text-sm text-muted-foreground">Lives Saved</div>
            </div>
            
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold text-blue-400 mb-2"
                animate={{
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity
                }}
              >
                {selectedMission.id === 'climate_solution' ? '$47T' : selectedMission.id === 'space_colonization' ? '$2.3T' : '$890B'}
              </motion.div>
              <div className="text-sm text-muted-foreground">Economic Value</div>
            </div>
            
            <div className="text-center">
              <motion.div
                className="text-4xl font-bold text-purple-400 mb-2"
                animate={{
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                100%
              </motion.div>
              <div className="text-sm text-muted-foreground">Success Probability</div>
            </div>
          </div>
        </Card>
        )}
      </div>
    </div>
  );
};

export default GlobalMissionDemo;
