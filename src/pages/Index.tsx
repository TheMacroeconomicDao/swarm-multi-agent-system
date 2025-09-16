import React from "react";
import { AgentDashboard } from "@/components/agents/AgentDashboard";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useAgentSystem } from "@/hooks/useAgentSystem";

const Index = () => {
  const agentSystem = useAgentSystem();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
        <AgentDashboard agentSystem={agentSystem} />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
