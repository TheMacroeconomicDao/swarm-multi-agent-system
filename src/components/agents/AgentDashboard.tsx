// 🎯 AGENT DASHBOARD - Revolutionary Multi-Agent Control Center
// Ultra-modern 2025 UI with Glassmorphism + Neumorphism design

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentState, AgentRole, VibeCodeSession, Task } from '@/types/agents';
import { Brain, Zap, Users, Code, Activity, Sparkles } from 'lucide-react';

interface AgentDashboardProps {
  onStartSession: (title: string, description: string) => void;
  onProcessRequest: (prompt: string, sessionId: string) => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  onStartSession,
  onProcessRequest
}) => {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [activeSessions, setActiveSessions] = useState<VibeCodeSession[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentState | null>(null);
  const [vibePrompt, setVibePrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data for demonstration
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

    // Mock active session
    setActiveSessions([
      {
        id: 'session_001',
        title: 'E-commerce Platform Build',
        description: 'Creating a modern e-commerce platform with AI recommendations',
        status: 'active',
        participants: [],
        tasks: [],
        codebase: { files: [], architecture: '', techStack: ['React', 'TypeScript', 'Tailwind'] },
        vibeMetrics: {
          flowScore: 0.87,
          iterationVelocity: 12,
          codeQuality: 0.91,
          userSatisfaction: 0.94
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date()
      }
    ]);
  }, []);

  const getAgentIcon = (role: AgentRole) => {
    switch (role) {
      case AgentRole.COORDINATOR: return <Users className="w-4 h-4" />;
      case AgentRole.ARCHITECT: return <Brain className="w-4 h-4" />;
      case AgentRole.DEVELOPER: return <Code className="w-4 h-4" />;
      case AgentRole.ANALYST: return <Activity className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-muted';
      case 'thinking': return 'bg-secondary';
      case 'working': return 'bg-primary';
      case 'collaborating': return 'bg-accent';
      default: return 'bg-muted';
    }
  };

  const handleStartNewSession = () => {
    const title = 'New Vibe Coding Session';
    const description = 'Revolutionary development session with multi-agent collaboration';
    onStartSession(title, description);
  };

  const handleProcessPrompt = async () => {
    if (!vibePrompt.trim() || activeSessions.length === 0) return;
    
    setIsProcessing(true);
    try {
      await onProcessRequest(vibePrompt, activeSessions[0].id);
      setVibePrompt('');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-6 mesh-bg">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass rounded-[var(--radius-glass)] p-6 animate-float">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">
                🚀 Vibe Coding Multi-Agent System
              </h1>
              <p className="text-muted-foreground mt-2">
                Revolutionary AI-powered collaborative development platform
              </p>
            </div>
            <Button 
              onClick={handleStartNewSession}
              className="neuo glow animate-pulse-glow"
              size="lg"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start New Session
            </Button>
          </div>
        </div>

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="glass p-1">
            <TabsTrigger value="agents" className="data-[state=active]:neuo">
              <Users className="w-4 h-4 mr-2" />
              Agent Orchestra
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:neuo">
              <Brain className="w-4 h-4 mr-2" />
              Vibe Sessions
            </TabsTrigger>
            <TabsTrigger value="performance" className="data-[state=active]:neuo">
              <Activity className="w-4 h-4 mr-2" />
              Performance Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-6">
            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {agents.map((agent) => (
                <Card 
                  key={agent.id}
                  className={`glass p-6 cursor-pointer transition-all duration-300 hover:neuo hover:glow ${
                    selectedAgent?.id === agent.id ? 'neuo glow' : ''
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getAgentIcon(agent.role)}
                      <span className="font-semibold capitalize">
                        {agent.role.replace('_', ' ')}
                      </span>
                    </div>
                    <Badge 
                      className={`${getStatusColor(agent.status)} text-white border-0`}
                      variant="secondary"
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Workload</span>
                        <span>{agent.workload}%</span>
                      </div>
                      <Progress value={agent.workload} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tasks</span>
                        <div className="font-semibold">{agent.performance.tasksCompleted}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success</span>
                        <div className="font-semibold">
                          {(agent.performance.successRate * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Selected Agent Details */}
            {selectedAgent && (
              <Card className="glass p-6 animate-float">
                <h3 className="text-xl font-semibold mb-4 gradient-text">
                  Agent Details: {selectedAgent.role.replace('_', ' ')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Average Completion Time</span>
                        <span>{selectedAgent.performance.averageCompletionTime}min</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Collaboration Rating</span>
                        <span>{(selectedAgent.performance.collaborationRating * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Active</span>
                        <span>{selectedAgent.lastActive.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Current Status</h4>
                    <div className="space-y-2">
                      <Badge className={`${getStatusColor(selectedAgent.status)} text-white`}>
                        {selectedAgent.status.toUpperCase()}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {selectedAgent.status === 'working' && 'Processing complex task...'}
                        {selectedAgent.status === 'thinking' && 'Analyzing requirements...'}
                        {selectedAgent.status === 'collaborating' && 'Working with team...'}
                        {selectedAgent.status === 'idle' && 'Ready for new tasks'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Workload Distribution</h4>
                    <Progress value={selectedAgent.workload} className="h-3 mb-2" />
                    <div className="text-sm text-muted-foreground">
                      {selectedAgent.workload < 30 && 'Light workload - Available for new tasks'}
                      {selectedAgent.workload >= 30 && selectedAgent.workload < 70 && 'Moderate workload - Optimal performance'}
                      {selectedAgent.workload >= 70 && 'Heavy workload - Consider load balancing'}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            {/* Vibe Coding Interface */}
            <Card className="glass p-6">
              <h3 className="text-xl font-semibold mb-4 gradient-text">
                🌊 Vibe Coding Interface
              </h3>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={vibePrompt}
                    onChange={(e) => setVibePrompt(e.target.value)}
                    placeholder="Describe what you want to build... (Flow over friction!)"
                    className="flex-1 px-4 py-3 rounded-lg neuo-inset bg-background border-0 focus:outline-none focus:glow transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && handleProcessPrompt()}
                  />
                  <Button 
                    onClick={handleProcessPrompt}
                    disabled={isProcessing || !vibePrompt.trim()}
                    className="neuo glow px-6"
                  >
                    {isProcessing ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
                    ) : (
                      <Zap className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  💡 Tip: Use natural language. Our agents will break it down and collaborate to build it!
                </div>
              </div>
            </Card>

            {/* Active Sessions */}
            <div className="grid gap-6">
              {activeSessions.map((session) => (
                <Card key={session.id} className="glass p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold gradient-text">{session.title}</h3>
                      <p className="text-muted-foreground text-sm">{session.description}</p>
                    </div>
                    <Badge className="bg-primary text-primary-foreground">
                      {session.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {/* Vibe Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="neuo-inset p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {(session.vibeMetrics.flowScore * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Flow Score</div>
                    </div>
                    <div className="neuo-inset p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {session.vibeMetrics.iterationVelocity}
                      </div>
                      <div className="text-xs text-muted-foreground">Iterations</div>
                    </div>
                    <div className="neuo-inset p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {(session.vibeMetrics.codeQuality * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Code Quality</div>
                    </div>
                    <div className="neuo-inset p-3 rounded-lg text-center">
                      <div className="text-2xl font-bold gradient-text">
                        {(session.vibeMetrics.userSatisfaction * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {session.codebase.techStack.map((tech) => (
                      <Badge key={tech} variant="outline" className="glass border-0">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="glass p-6">
              <h3 className="text-xl font-semibold mb-4 gradient-text">
                📊 System Performance Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="neuo-inset p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Overall System Health</h4>
                  <Progress value={94} className="h-3 mb-2" />
                  <div className="text-sm text-muted-foreground">94% - Excellent</div>
                </div>
                <div className="neuo-inset p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Agent Collaboration</h4>
                  <Progress value={91} className="h-3 mb-2" />
                  <div className="text-sm text-muted-foreground">91% - Very Good</div>
                </div>
                <div className="neuo-inset p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Task Success Rate</h4>
                  <Progress value={87} className="h-3 mb-2" />
                  <div className="text-sm text-muted-foreground">87% - Good</div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};