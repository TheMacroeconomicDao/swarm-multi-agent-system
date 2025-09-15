import { AgentDashboard } from "@/components/agents/AgentDashboard";
import { useState } from "react";
import { CoordinatorAgent } from "@/lib/agents/coordinator-agent";
import { ArchitectAgent, DeveloperAgent, AnalystAgent } from "@/lib/agents/specialized-agents";
import { VibeCodeSession, AgentMessage, AgentRole } from "@/types/agents";

const Index = () => {
  const [coordinator] = useState(() => new CoordinatorAgent());
  const [architect] = useState(() => new ArchitectAgent());
  const [developer] = useState(() => new DeveloperAgent());
  const [analyst] = useState(() => new AnalystAgent());
  const [currentSession, setCurrentSession] = useState<VibeCodeSession | null>(null);
  const [messages, setMessages] = useState<AgentMessage[]>([]);

  const handleStartSession = async (sessionName: string, objective: string) => {
    const session: VibeCodeSession = {
      id: `session_${Date.now()}`,
      title: sessionName,
      description: objective,
      status: 'active',
      participants: [],
      tasks: [],
      codebase: {
        files: [],
        architecture: 'Multi-Agent Vibe Coding System',
        techStack: ['React', 'TypeScript', 'Tailwind CSS']
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
    setCurrentSession(session);
  };

  const handleProcessRequest = async (request: string, sessionId: string) => {
    if (!currentSession) return;
    
    console.log('Processing request:', request, 'for session:', sessionId);
    
    try {
      // Register agents with coordinator if not already done
      coordinator.registerAgent(architect);
      coordinator.registerAgent(developer);
      coordinator.registerAgent(analyst);
      
      // Process the request through the coordinator
      const response = await coordinator.processVibeRequest(request, sessionId);
      
      // Add the response to messages (this will be handled by AgentDashboard)
      console.log('Coordinator response:', response);
      
    } catch (error) {
      console.error('Error processing request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      <AgentDashboard 
        onStartSession={handleStartSession}
        onProcessRequest={handleProcessRequest}
      />
    </div>
  );
};

export default Index;
