import { AgentDashboard } from "@/components/agents/AgentDashboard";
import { useState } from "react";
import { CoordinatorAgent } from "@/lib/agents/coordinator-agent";
import { VibeCodeSession } from "@/types/agents";

const Index = () => {
  const [coordinator] = useState(() => new CoordinatorAgent());
  const [currentSession, setCurrentSession] = useState<VibeCodeSession | null>(null);

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

  const handleProcessRequest = async (request: string) => {
    if (!currentSession) return;
    
    // Process the request through the coordinator
    // This is where the magic happens
    console.log('Processing request:', request);
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
