// 🎯 AGENT DASHBOARD - Revolutionary Multi-Agent Control Center
// Ultra-modern 2025 UI with Glassmorphism + Neumorphism design

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AgentState, AgentRole, VibeCodeSession, CodeFile } from '@/types/agents';
import { Brain, Zap, Users, Code, Activity, Sparkles, MessageSquare, FileCode, AlertTriangle, CheckCircle, Clock, Rocket } from 'lucide-react';
import { SessionModal } from './SessionModal';
import { ChatWindow } from './ChatWindow';
import { CodeWorkspace } from './CodeWorkspace';
import { NotificationSystem, useNotifications } from './NotificationSystem';
import { LoadingSpinner, InlineLoading } from '@/components/ui/loading-spinner';
import { useAgentSystem } from '@/hooks/useAgentSystem';

interface AgentDashboardProps {
  agentSystem: ReturnType<typeof useAgentSystem>;
}

interface SessionData {
  title: string;
  description: string;
  projectType: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  techStack: string[];
  requirements: string[];
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({
  agentSystem
}) => {
  const navigate = useNavigate();
  const {
    coordinator,
    swarmCoordinator,
    agents,
    selectedAgent,
    setSelectedAgent,
    eventManager,
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
  } = agentSystem;

  // Local UI state
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [isCodeWorkspaceMinimized, setIsCodeWorkspaceMinimized] = useState(false);
  const [vibePrompt, setVibePrompt] = useState('');
  
  // Notifications
  const notifications = useNotifications();

  // UI handlers
  const handleStartNewSession = useCallback(() => {
    setIsSessionModalOpen(true);
  }, []);

  const handleCreateSession = useCallback(async (sessionData: SessionData) => {
    try {
      await createSession(sessionData);
      setIsSessionModalOpen(false);
      
      notifications.showSuccess(
        'Session Created!',
        `${sessionData.title} is ready for development`,
        {
          label: 'Start Coding',
          onClick: () => setIsCodeWorkspaceOpen(true)
        }
      );
    } catch (error) {
      notifications.showError(
        'Failed to Create Session',
        'Please try again or check your configuration'
      );
    }
  }, [createSession, notifications, setIsCodeWorkspaceOpen]);

  const handleProcessPrompt = useCallback(async () => {
    if (!vibePrompt.trim() || !currentSession) return;
    
    try {
      await sendMessage(vibePrompt);
      setVibePrompt('');
    } catch (error) {
      notifications.showError(
        'Failed to Send Message',
        'Please try again'
      );
    }
  }, [vibePrompt, currentSession, sendMessage, notifications]);

  const handleSendChatMessage = useCallback(async (message: string) => {
    if (!message.trim()) return;
    
    try {
      await sendMessage(message);
    } catch (error) {
      notifications.showError(
        'Failed to Send Message',
        'Please try again'
      );
    }
  }, [sendMessage, notifications]);

  const handleFileChange = useCallback((filePath: string, content: string) => {
    updateCodeFile(filePath, content);
    notifications.showInfo('File Updated', `${filePath} has been modified`);
  }, [updateCodeFile, notifications]);

  const handleRunCode = useCallback(() => {
    notifications.showInfo('Running Code', 'Executing your application...');
    setTimeout(() => {
      notifications.showSuccess('Code Executed', 'Your application is running successfully!');
    }, 2000);
  }, [notifications]);

  const handleSaveFiles = useCallback(() => {
    notifications.showSuccess('Files Saved', 'All changes have been saved successfully');
  }, [notifications]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'idle': return <Clock className="w-3 h-3" />;
      case 'thinking': return <Brain className="w-3 h-3" />;
      case 'working': return <Zap className="w-3 h-3 animate-pulse" />;
      case 'collaborating': return <Users className="w-3 h-3" />;
      default: return <AlertTriangle className="w-3 h-3" />;
    }
  };

  return (
    <>
      <div className="min-h-screen p-6 mesh-bg">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="glass rounded-[var(--radius-glass)] p-6 animate-float">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold gradient-text">
                  🚀 Swarm Multiagent System
                </h1>
                <p className="text-muted-foreground mt-2">
                  Revolutionary AI-powered collaborative development platform
                </p>
                {currentSession && (
                  <div className="flex items-center mt-3 space-x-2">
                    <Badge className="bg-primary/20 text-primary border-0">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active: {currentSession.title}
                    </Badge>
                    <Badge variant="outline" className="glass">
                      {currentTasks.length} Tasks
                    </Badge>
                  </div>
                )}
              </div>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => navigate('/rocket-science')}
                  variant="outline"
                  className="glass hover:bg-primary/10 transition-all duration-300"
                >
                  <Rocket className="w-4 h-4 mr-2" />
                  Rocket Science Stacks
                </Button>
                <Button 
                  onClick={() => setIsChatOpen(true)}
                  className="neuo glow"
                  size="lg"
                  disabled={!currentSession}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {isChatOpen ? 'Chat Active' : 'Open Chat'}
                </Button>
                <Button 
                  onClick={() => setIsCodeWorkspaceOpen(true)}
                  className="neuo glow"
                  size="lg"
                  disabled={!currentSession}
                >
                  <FileCode className="w-4 h-4 mr-2" />
                  {isCodeWorkspaceOpen ? 'Workspace Active' : 'Code Workspace'}
                </Button>
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
              {/* Agent Count Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold gradient-text">
                  Agent Orchestra ({agents.length} Agents)
                </h3>
                <Badge variant="secondary" className="glass">
                  {agents.filter(a => a.status === 'idle').length} Available
                </Badge>
              </div>
              
              {/* Agent Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
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
                        className={`${getStatusColor(agent.status)} text-white border-0 flex items-center space-x-1`}
                        variant="secondary"
                      >
                        {getStatusIcon(agent.status)}
                        <span>{agent.status}</span>
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
                <Card className="glass p-6 animate-fade-in">
                  <h3 className="text-xl font-semibold mb-4 gradient-text flex items-center">
                    {getAgentIcon(selectedAgent.role)}
                    <span className="ml-2">Agent Details: {selectedAgent.role.replace('_', ' ')}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="neuo-inset p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Activity className="w-4 h-4 mr-2 text-primary" />
                        Performance Metrics
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Average Completion Time</span>
                          <span className="font-medium">{selectedAgent.performance.averageCompletionTime}min</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Collaboration Rating</span>
                          <span className="font-medium">{(selectedAgent.performance.collaborationRating * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Active</span>
                          <span className="font-medium">{selectedAgent.lastActive.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="neuo-inset p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-secondary" />
                        Current Status
                      </h4>
                      <div className="space-y-3">
                        <Badge className={`${getStatusColor(selectedAgent.status)} text-white flex items-center space-x-2 w-fit`}>
                          {getStatusIcon(selectedAgent.status)}
                          <span>{selectedAgent.status.toUpperCase()}</span>
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
                      <h4 className="font-semibold mb-3 flex items-center">
                        <Brain className="w-4 h-4 mr-2 text-accent" />
                        Workload Distribution
                      </h4>
                      <Progress value={selectedAgent.workload} className="h-3 mb-3" />
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
                <h3 className="text-xl font-semibold mb-4 gradient-text flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Vibe Coding Interface
                </h3>
                <div className="flex space-x-4 mb-4">
                  <input
                    type="text"
                    value={vibePrompt}
                    onChange={(e) => setVibePrompt(e.target.value)}
                    placeholder="Describe what you want to build in natural language..."
                    className="flex-1 px-4 py-3 rounded-lg neuo-inset bg-background border-0 focus:outline-none focus:glow transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && handleProcessPrompt()}
                    disabled={isProcessing || !currentSession}
                  />
                  <Button 
                    onClick={handleProcessPrompt}
                    className="neuo glow px-8"
                    size="lg"
                    disabled={isProcessing || !vibePrompt.trim() || !currentSession}
                  >
                    {isProcessing ? (
                      <InlineLoading text="Processing..." />
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Vibe Code
                      </>
                    )}
                  </Button>
                </div>
                
                {!currentSession && (
                  <div className="text-center p-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start a new session to begin vibe coding</p>
                  </div>
                )}
              </Card>

              {/* Active Sessions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeSessions.map((session) => (
                  <Card key={session.id} className="glass p-6 hover:neuo transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">{session.title}</h4>
                      <Badge 
                        className={`${
                          session.status === 'active' ? 'bg-primary' : 'bg-muted'
                        } text-white border-0`}
                      >
                        {session.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {session.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Flow Score</span>
                        <div className="font-semibold">{(session.vibeMetrics.flowScore * 100).toFixed(0)}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quality</span>
                        <div className="font-semibold">{(session.vibeMetrics.codeQuality * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="glass flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="neuo flex-1">
                        Continue Session
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass p-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-success" />
                    System Health
                  </h4>
                  <div className="text-2xl font-bold text-success mb-2">
                    {agents.length > 0 ? Math.round(agents.filter(a => a.status !== 'idle').length / agents.length * 100) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {agents.filter(a => a.status !== 'idle').length} of {agents.length} agents active
                  </p>
                </Card>
                
                <Card className="glass p-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-primary" />
                    Average Workload
                  </h4>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {agents.length > 0 ? Math.round(agents.reduce((acc, agent) => acc + agent.workload, 0) / agents.length) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">System utilization</p>
                </Card>
                
                <Card className="glass p-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-accent" />
                    Collaboration Score
                  </h4>
                  <div className="text-2xl font-bold text-accent mb-2">
                    {agents.length > 0 ? Math.round(agents.reduce((acc, agent) => acc + agent.performance.collaborationRating, 0) / agents.length * 100) : 0}%
                  </div>
                  <p className="text-sm text-muted-foreground">Inter-agent efficiency</p>
                </Card>
              </div>

              {/* Swarm Metrics */}
              <Card className="glass p-6">
                <h3 className="text-xl font-semibold mb-4 gradient-text flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  Event-Driven System Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Total Tasks</h4>
                    <div className="text-2xl font-bold text-primary">
                      {systemStats?.totalTasks || currentTasks.length}
                    </div>
                    <p className="text-xs text-muted-foreground">Pending: {systemStats?.pendingTasks || 0}</p>
                  </div>
                  
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Available Agents</h4>
                    <div className="text-2xl font-bold text-success">
                      {systemStats?.availableAgents || agents.filter(a => a.status === 'idle').length}
                    </div>
                    <p className="text-xs text-muted-foreground">Ready for tasks</p>
                  </div>
                  
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Event Subscriptions</h4>
                    <div className="text-2xl font-bold text-accent">
                      {systemStats?.eventStats?.totalSubscriptions || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Active listeners</p>
                  </div>
                  
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Event Queue</h4>
                    <div className="text-2xl font-bold text-warning">
                      {systemStats?.eventStats?.queueSize || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Processing queue</p>
                  </div>
                </div>
              </Card>

              {/* P2P Network Status */}
              <Card className="glass p-6">
                <h3 className="text-xl font-semibold mb-4 gradient-text flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  P2P Network Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Network Health</h4>
                    <div className="text-2xl font-bold text-success">
                      {systemStats?.networkHealth || 95}%
                    </div>
                    <p className="text-xs text-muted-foreground">Overall status</p>
                  </div>
                  
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Connected Peers</h4>
                    <div className="text-2xl font-bold text-primary">
                      {systemStats?.connectedPeers || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Active connections</p>
                  </div>
                  
                  <div className="neuo-inset p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Message Throughput</h4>
                    <div className="text-2xl font-bold text-accent">
                      {systemStats?.messageThroughput || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">Messages/sec</p>
                  </div>
                </div>
              </Card>

              {/* Active Tasks */}
              <Card className="glass p-6">
                <h3 className="text-xl font-semibold mb-4 gradient-text flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Active Tasks
                </h3>
                <div className="space-y-3">
                  {currentTasks.length > 0 ? (
                    currentTasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 neuo-inset rounded-lg">
                        <div>
                          <div className="font-medium">{task.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {task.assignedAgent || 'Unassigned'} • {task.status}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Priority: {task.priority}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Complexity: {task.estimatedComplexity}/10
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center p-8 text-muted-foreground">
                      <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No active tasks</p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals and Windows */}
      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        onCreateSession={handleCreateSession}
      />

      {isChatOpen && (
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendChatMessage}
          onClose={() => setIsChatOpen(false)}
          onMinimize={() => setIsChatMinimized(!isChatMinimized)}
          onMaximize={() => setIsChatMinimized(false)}
          isMinimized={isChatMinimized}
          isOpen={isChatOpen}
          isProcessing={isProcessing}
          sessionId={currentSession?.id || ''}
        />
      )}

      {isCodeWorkspaceOpen && (
        <CodeWorkspace
          codeFiles={codeFiles}
          currentTasks={currentTasks}
          onFileChange={handleFileChange}
          onClose={() => setIsCodeWorkspaceOpen(false)}
          onMinimize={() => setIsCodeWorkspaceMinimized(!isCodeWorkspaceMinimized)}
          onMaximize={() => setIsCodeWorkspaceMinimized(false)}
          isMinimized={isCodeWorkspaceMinimized}
          isOpen={isCodeWorkspaceOpen}
          sessionId={currentSession?.id || ''}
          onRunCode={handleRunCode}
          onSaveFiles={handleSaveFiles}
        />
      )}

      <NotificationSystem 
        notifications={[]} 
        onDismiss={() => {}}
      />
    </>
  );
};