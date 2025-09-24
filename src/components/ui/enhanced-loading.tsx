import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Brain, 
  Zap, 
  Network, 
  CheckCircle, 
  Users,
  Cpu,
  Database,
  Globe,
  Shield
} from "lucide-react";

interface LoadingStep {
  id: string;
  label: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  progress?: number;
  icon?: React.ReactNode;
  estimatedTime?: string;
}

interface EnhancedLoadingProps {
  title?: string;
  subtitle?: string;
  steps?: LoadingStep[];
  overallProgress?: number;
  variant?: 'minimal' | 'detailed' | 'swarm' | 'ai';
  className?: string;
}

const variantConfigs = {
  minimal: {
    showSteps: false,
    showProgress: true,
    showTitle: true
  },
  detailed: {
    showSteps: true,
    showProgress: true,  
    showTitle: true
  },
  swarm: {
    showSteps: true,
    showProgress: true,
    showTitle: true,
    customIcon: <Network className="w-6 h-6" />
  },
  ai: {
    showSteps: true,
    showProgress: true,
    showTitle: true,
    customIcon: <Brain className="w-6 h-6" />
  }
};

const defaultSwarmSteps: LoadingStep[] = [
  {
    id: 'initialization',
    label: 'Initializing Swarm System',
    description: 'Setting up core infrastructure',
    status: 'completed',
    progress: 100,
    icon: <Network className="w-4 h-4" />,
    estimatedTime: '2s'
  },
  {
    id: 'agents',
    label: 'Spawning AI Agents',
    description: 'Creating specialized swarm agents',
    status: 'in_progress',
    progress: 65,
    icon: <Users className="w-4 h-4" />,
    estimatedTime: '5s'
  },
  {
    id: 'models',
    label: 'Loading AI Models',
    description: 'Connecting to 400+ AI models via Puter.js',
    status: 'pending',
    progress: 0,
    icon: <Brain className="w-4 h-4" />,
    estimatedTime: '3s'
  },
  {
    id: 'coordination',
    label: 'Establishing Coordination',
    description: 'Setting up stigmergic communication',
    status: 'pending',
    progress: 0,
    icon: <Zap className="w-4 h-4" />,
    estimatedTime: '2s'
  },
  {
    id: 'consensus',
    label: 'Byzantine Consensus',
    description: 'Initializing fault-tolerant consensus',
    status: 'pending',
    progress: 0,
    icon: <Shield className="w-4 h-4" />,
    estimatedTime: '4s'
  }
];

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  title = "Loading Swarm System",
  subtitle = "Preparing revolutionary AI-powered multi-agent system...",
  steps = defaultSwarmSteps,
  overallProgress = 45,
  variant = 'swarm',
  className = ""
}) => {
  const config = variantConfigs[variant];

  const getStatusColor = (status: LoadingStep['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      case 'error': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: LoadingStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in_progress': return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case 'error': return <CheckCircle className="w-4 h-4 text-red-400" />;
      default: return <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />;
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[400px] p-8 ${className}`}>
      {/* Main loading animation */}
      <div className="text-center mb-8">
        <motion.div
          className="relative mx-auto mb-6"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-accent p-4 glass shadow-2xl">
            {config.customIcon || <Cpu className="w-12 h-12 text-white" />}
          </div>
          
          {/* Orbiting dots */}
          {[0, 120, 240].map((rotation, index) => (
            <motion.div
              key={index}
              className="absolute w-3 h-3 bg-primary rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '45px 0'
              }}
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.3
              }}
              initial={{
                rotate: rotation
              }}
            />
          ))}
        </motion.div>

        {config.showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-2 gradient-text">
              {title}
            </h2>
            <p className="text-muted-foreground">
              {subtitle}
            </p>
          </motion.div>
        )}
      </div>

      {/* Overall progress */}
      {config.showProgress && (
        <motion.div 
          className="w-full max-w-md mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <Badge variant="outline" className="font-mono">
              {Math.round(overallProgress)}%
            </Badge>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-2"
          />
        </motion.div>
      )}

      {/* Detailed steps */}
      {config.showSteps && (
        <motion.div 
          className="w-full max-w-lg space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-surface/30 glass"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              {/* Status icon */}
              <div className="flex-shrink-0">
                {getStatusIcon(step.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {step.icon}
                    <span className={`text-sm font-medium ${getStatusColor(step.status)}`}>
                      {step.label}
                    </span>
                  </div>
                  
                  {step.estimatedTime && step.status === 'pending' && (
                    <Badge variant="outline" className="text-xs">
                      ~{step.estimatedTime}
                    </Badge>
                  )}
                </div>
                
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </p>
                )}

                {/* Step progress */}
                {step.status === 'in_progress' && step.progress !== undefined && (
                  <div className="mt-2">
                    <Progress 
                      value={step.progress} 
                      className="h-1"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Loading tips */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <p className="text-xs text-muted-foreground">
          💡 Tip: This multi-agent system utilizes 400+ AI models for optimal performance
        </p>
      </motion.div>
    </div>
  );
};

// Preset loading components
export const SwarmLoading = (props: Partial<EnhancedLoadingProps>) => (
  <EnhancedLoading variant="swarm" {...props} />
);

export const AILoading = (props: Partial<EnhancedLoadingProps>) => (
  <EnhancedLoading 
    variant="ai" 
    title="AI Models Loading"
    subtitle="Connecting to Claude, GPT-4, Gemini and more..."
    {...props} 
  />
);

export const MinimalLoading = (props: Partial<EnhancedLoadingProps>) => (
  <EnhancedLoading variant="minimal" {...props} />
);

export default EnhancedLoading;
