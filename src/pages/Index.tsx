import React, { useState, useEffect } from "react";
import { AgentDashboard } from "@/components/agents/AgentDashboard";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useAgentSystem } from "@/hooks/useAgentSystem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { SmartTooltip, FeatureTooltip, AITooltip, PerformanceTooltip } from "@/components/ui/smart-tooltip";
import KeyboardShortcuts from "@/components/ui/keyboard-shortcuts";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { APP_CONFIG } from "@/config/constants";
import AccessibilityPanel from "@/components/ui/accessibility-improvements";
import ResponsiveContainer from "@/components/ui/responsive-container";
import DemoModeBanner from "@/components/ui/demo-mode-banner";
import { motion } from "framer-motion";
import { 
  Rocket, 
  Brain, 
  Zap, 
  Shield, 
  Globe, 
  Cpu, 
  Database, 
  Code, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Star,
  Target,
  Lightbulb,
  Gauge,
  Lock,
  Network,
  MessageSquare,
  FileCode,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

interface UserData {
  role: string;
  experience: string;
  interests: string[];
  goals: string[];
  preferredPath: string;
}

const Index = () => {
  const agentSystem = useAgentSystem();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Check if user needs onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('swarm-onboarding-completed');
    if (!hasCompletedOnboarding) {
      // Delay to let page load
      setTimeout(() => setShowOnboarding(true), 1500);
    } else {
      const savedUserData = localStorage.getItem('swarm-user-data');
      if (savedUserData) {
        setUserData(JSON.parse(savedUserData));
      }
    }
  }, []);

  const handleOnboardingComplete = (data: UserData) => {
    setUserData(data);
    setShowOnboarding(false);
    localStorage.setItem('swarm-onboarding-completed', 'true');
    localStorage.setItem('swarm-user-data', JSON.stringify(data));
    
    // Navigate based on user preference
    if (data.preferredPath === 'demo') {
      navigate('/demo');
    } else if (data.preferredPath === 'dashboard') {
      setActiveTab('dashboard');
    }
  };

  const handleKeyboardShortcuts = {
    onNavigateHome: () => setActiveTab("overview"),
    onNavigateDemo: () => navigate("/global-mission"),
    onNavigateDashboard: () => setActiveTab("dashboard"),
    onOpenSearch: () => {
      // Implement search functionality
      console.log("Search opened");
    },
    onToggleTheme: () => {
      // Implement theme toggle
      document.documentElement.classList.toggle('dark');
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 animate-ultramodern-glow">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 glass">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Agent Dashboard
            </TabsTrigger>
            <TabsTrigger value="techstack" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Tech Stack
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="pt-20">
            <div className="container mx-auto px-4 py-8">
              {/* Hero Section */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 rounded-full mb-6">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-medium">Revolutionary Multi-Agent IDE</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-pulse">
                  🚀 World's Most Advanced AI-Powered Swarm System!
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                  Revolutionary <span className="text-primary font-semibold">Multi-Agent Swarm Intelligence</span> 
                  that coordinates <span className="text-accent font-semibold">400+ AI Models</span> to solve 
                  <span className="text-success font-semibold">humanity's greatest challenges</span> - from climate crisis to space colonization to universal disease cures!
                  <br />
                  <span className="text-sm mt-2 block text-accent font-medium">
                    🌍 Save Planet Earth • 🚀 Colonize Mars • 💊 Cure All Diseases • 🧬 Advance Science • 🤖 Collective Intelligence
                  </span>
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    onClick={() => navigate("/global-mission")}
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    🌍 Save Humanity Demo
                  </Button>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                    onClick={() => navigate("/collective-intelligence")}
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    🧠 AI Discussion Demo
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline" 
                    onClick={() => navigate("/demo")}
                    className="hover:bg-primary/20"
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Tech Demo
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setActiveTab("dashboard")}>
                    <Brain className="w-5 h-5 mr-2" />
                    Dashboard
                  </Button>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <AITooltip 
                  title="Universal AI Access"
                  description="Revolutionary integration with 400+ AI models from top providers like OpenAI, Anthropic, Google, Meta, and more through Puter.js API"
                  shortcut="Ctrl+A"
                  learnMoreUrl={APP_CONFIG.PUTER_AI_MODELS_URL}
                >
                  <Card className="glass p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 cursor-help">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4"
                      animate={{
                        y: [0, -10, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                    <Brain className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">400+ AI Models Access</h3>
                  <p className="text-muted-foreground">
                      Unique integration via Puter.js API for access to Claude 4, GPT-4, Gemini, 
                      Llama, Mistral, DeepSeek, Perplexity and hundreds of other AI models in one system!
                  </p>
                </Card>
                </AITooltip>

                <FeatureTooltip
                  title="Stigmergic Communication"
                  description="Bio-inspired indirect communication where agents leave environmental markers and pheromone trails, enabling self-organization and emergent behavior patterns"
                  shortcut="Ctrl+S"
                  learnMoreUrl={APP_CONFIG.STIGMERGY_WIKI}
                >
                  <Card className="glass p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green/20 cursor-help">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.8, 1, 0.8]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                    <Network className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">Stigmergic Communication</h3>
                  <p className="text-muted-foreground">
                      Revolutionary indirect communication system through environmental markers, 
                      enabling agents to coordinate like a real swarm in nature!
                  </p>
                </Card>
                </FeatureTooltip>

                <AITooltip
                  title="Collective Intelligence Engine"
                  description="Advanced swarm learning system with shared knowledge base, experience replay buffer, and transfer learning capabilities for emergent problem-solving"
                  shortcut="Ctrl+C"
                >
                  <Card className="glass p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-orange/20 cursor-help">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4"
                      animate={{
                        rotate: 360
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                    <Cpu className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">Collective Intelligence</h3>
                  <p className="text-muted-foreground">
                      Swarm collective learning with shared knowledge base, 
                      transfer learning and emergent behavior for solving the most complex tasks.
                  </p>
                </Card>
                </AITooltip>

                <SmartTooltip
                  title="Byzantine Fault Tolerance"
                  description="Military-grade PBFT consensus algorithm with self-healing mechanisms that ensures 99.9% uptime even with up to 1/3 malicious agents"
                  type="warning"
                  shortcut="Ctrl+B"
                >
                  <Card className="glass p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple/20 cursor-help">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4"
                      animate={{
                        boxShadow: ["0 0 20px rgba(168, 85, 247, 0.4)", "0 0 40px rgba(168, 85, 247, 0.8)", "0 0 20px rgba(168, 85, 247, 0.4)"]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                    <Shield className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">Byzantine Fault Tolerance</h3>
                  <p className="text-muted-foreground">
                      Advanced PBFT consensus and self-healing mechanisms 
                      ensure resilience to failures and malicious agents.
                  </p>
                </Card>
                </SmartTooltip>

                <PerformanceTooltip
                  title="Bio-Inspired Algorithms"
                  description="Particle Swarm Optimization (PSO) and Ant Colony Optimization (ACO) algorithms that mimic nature's most efficient coordination patterns"
                  shortcut="Ctrl+P"
                >
                  <Card className="glass p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan/20 cursor-help">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4"
                      animate={{
                        y: [0, -5, 5, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                    <Gauge className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">PSO & ACO Algorithms</h3>
                  <p className="text-muted-foreground">
                      Particle Swarm Optimization and Ant Colony Optimization 
                      for intelligent task distribution and path optimization.
                  </p>
                </Card>
                </PerformanceTooltip>

                <AITooltip
                  title="Multi-Provider AI Gateway"
                  description="Unified access to 400+ AI models from OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, Perplexity, and dozens more via Puter.js"
                  shortcut="Ctrl+M"
                  learnMoreUrl={APP_CONFIG.PUTER_WEBSITE}
                >
                  <Card className="glass p-6 hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow/20 cursor-help">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4"
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                    <Globe className="w-6 h-6 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-3">Universal AI Access</h3>
                  <p className="text-muted-foreground">
                      Unified API for all top AI providers via Puter.js: 
                      OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek and dozens more!
                  </p>
                </Card>
                </AITooltip>
              </div>

              {/* Benefits Section */}
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
                  🌍 How Our AI Swarm is Saving Humanity Right Now
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">🌍 Global Problem Solving</h3>
                        <p className="text-muted-foreground">
                          Our AI swarm is actively working on climate crisis resolution, 
                          Mars colonization planning, and universal disease cures through coordinated intelligence.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">🚀 Breakthrough Discovery Rate</h3>
                        <p className="text-muted-foreground">
                          Swarm intelligence accelerates scientific breakthroughs by 1000x, 
                          discovering solutions that would take humans decades in just hours.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">💊 Life-Saving Innovation</h3>
                        <p className="text-muted-foreground">
                          AI swarm analyzing millions of medical records and molecular patterns 
                          to discover universal cures and personalized treatments for all diseases.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">🤖 Emergent Super-Intelligence</h3>
                        <p className="text-muted-foreground">
                          When 400+ AI models work together through swarm coordination, 
                          they achieve collective intelligence that surpasses human capabilities.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">🛡️ Humanity's Digital Guardian</h3>
                        <p className="text-muted-foreground">
                          Byzantine fault tolerance and self-healing mechanisms ensure 
                          our AI swarm remains stable and trustworthy while solving critical global challenges.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">🔮 Future of Humanity Secured</h3>
                        <p className="text-muted-foreground">
                          Self-evolving swarm intelligence continuously adapts and learns, 
                          ensuring humanity stays ahead of existential challenges and technological progress.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                <Card className="glass p-6 text-center hover:scale-105 transition-all duration-300">
                  <div className="text-3xl font-bold text-primary mb-2 animate-pulse">400+</div>
                  <div className="text-sm text-muted-foreground">AI Models</div>
                </Card>
                <Card className="glass p-6 text-center hover:scale-105 transition-all duration-300">
                  <div className="text-3xl font-bold text-accent mb-2 animate-bounce">100x</div>
                  <div className="text-sm text-muted-foreground">Faster Development</div>
                </Card>
                <Card className="glass p-6 text-center hover:scale-105 transition-all duration-300">
                  <div className="text-3xl font-bold text-success mb-2">∞</div>
                  <div className="text-sm text-muted-foreground">Scalable Agents</div>
                </Card>
                <Card className="glass p-6 text-center hover:scale-105 transition-all duration-300">
                  <div className="text-3xl font-bold text-warning mb-2 animate-spin">🚀</div>
                  <div className="text-sm text-muted-foreground">Revolutionary</div>
                </Card>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                  🌟 Ready to Witness the Future of Humanity?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Experience how our revolutionary AI swarm intelligence is actively solving 
                  climate crisis, planning Mars colonization, and discovering universal disease cures!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                    onClick={() => navigate("/global-mission")}
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    🌍 Global Mission Demo
                  </Button>
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700" 
                    onClick={() => navigate("/collective-intelligence")}
                  >
                    <Brain className="w-5 h-5 mr-2" />
                    🧠 AI Discussion Demo
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setActiveTab("techstack")}>
                    <Code className="w-5 h-5 mr-2" />
                    Explore Tech Stack
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="pt-20">
            <AgentDashboard agentSystem={agentSystem} />
          </TabsContent>

          <TabsContent value="techstack" className="pt-20">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                  🚀 Swarm Multiagent Tech Stack
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Comprehensive technology ecosystem designed for cutting-edge research, 
                  development, and innovation in rocket science and advanced engineering.
                </p>
              </div>

              {/* Tech Stack Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* AI & Machine Learning */}
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">AI & Machine Learning</h3>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 mb-2">TensorFlow</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">PyTorch</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">OpenAI GPT-4</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Anthropic Claude</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Hugging Face</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">LangChain</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Weaviate</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Pinecone</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Jupyter</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">MLflow</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Kubeflow</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Ray</Badge>
                  </div>
                </Card>

                {/* Quantum Computing */}
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Quantum Computing</h3>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 mb-2">Qiskit</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Cirq</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">PennyLane</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Q#</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">QuTiP</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Forest SDK</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Braket</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Ocean</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Qiskit Runtime</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Quantum ML</Badge>
                  </div>
                </Card>

                {/* High-Performance Computing */}
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Gauge className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">HPC & Simulation</h3>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 mb-2">OpenMP</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">MPI</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">CUDA</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">OpenCL</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">OpenFOAM</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">ANSYS</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">COMSOL</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">MATLAB</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Simulink</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">ParaView</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">VisIt</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Dask</Badge>
                  </div>
                </Card>

                {/* Blockchain & Web3 */}
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Blockchain & Web3</h3>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 mb-2">Ethereum</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Solana</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Polygon</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">IPFS</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Arweave</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Web3.js</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Ethers.js</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Hardhat</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Truffle</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Foundry</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Subgraph</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">The Graph</Badge>
                  </div>
                </Card>

                {/* Cloud & Infrastructure */}
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Cloud & Infrastructure</h3>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 mb-2">AWS</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">GCP</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Azure</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Kubernetes</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Docker</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Terraform</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Ansible</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Consul</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Vault</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Istio</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Linkerd</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Prometheus</Badge>
                  </div>
                </Card>

                {/* Data Science & Analytics */}
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Data Science & Analytics</h3>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 mb-2">Pandas</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">NumPy</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">SciPy</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Scikit-learn</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Apache Spark</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Apache Kafka</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Elasticsearch</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">ClickHouse</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">TimescaleDB</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">InfluxDB</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Grafana</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Tableau</Badge>
                  </div>
                </Card>

                {/* Programming Languages */}
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Code className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Programming Languages</h3>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 mb-2">Python</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Rust</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Go</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">C++</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">C#</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Java</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">TypeScript</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Julia</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Fortran</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Haskell</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Clojure</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Erlang</Badge>
                  </div>
                </Card>

                {/* Scientific Computing */}
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Scientific Computing</h3>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 mb-2">SciPy</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">SymPy</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">SageMath</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">GSL</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">BLAS</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">LAPACK</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">FFTW</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">PETSc</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Trilinos</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">OpenMDAO</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Dakota</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Cantera</Badge>
                  </div>
                </Card>

                {/* Robotics & Control Systems */}
                <Card className="glass p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Robotics & Control</h3>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="mr-2 mb-2">ROS</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">ROS2</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Gazebo</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Webots</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">MuJoCo</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">PyBullet</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">OpenCV</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">PCL</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">MoveIt</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Navigation2</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Control Toolbox</Badge>
                    <Badge variant="secondary" className="mr-2 mb-2">Drake</Badge>
                  </div>
                </Card>
              </div>

              {/* CTA Section */}
              <div className="text-center mt-16">
                <h2 className="text-3xl font-bold mb-6 gradient-text">
                  Ready to Build the Future?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  With this comprehensive tech stack, you have everything needed 
                  to tackle the most challenging rocket science problems.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                  onClick={() => navigate("/global-mission")}
                >
                  <Globe className="w-5 h-5 mr-2" />
                  🌍 Witness Global Impact
                </Button>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700" 
                  onClick={() => navigate("/collective-intelligence")}
                >
                  <Brain className="w-5 h-5 mr-2" />
                  🧠 Watch AI Collaborate
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Enhanced UX Components */}
        <KeyboardShortcuts {...handleKeyboardShortcuts} />
        <AccessibilityPanel />
        
        {/* Demo Mode Banner */}
        <DemoModeBanner />
        
        {/* Onboarding Wizard */}
        <OnboardingWizard
          isOpen={showOnboarding}
          onComplete={handleOnboardingComplete}
          onClose={() => setShowOnboarding(false)}
        />
        
        {/* Skip to content for screen readers */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        
        {/* Personalized Welcome Message */}
        {userData && !showOnboarding && (
          <motion.div
            className="fixed top-20 right-6 z-40"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <Card className="glass p-4 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Welcome back, {userData.role?.replace('_', ' ') || 'User'}!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your personalized experience is ready
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Index;
