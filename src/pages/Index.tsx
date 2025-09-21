import React, { useState } from "react";
import { AgentDashboard } from "@/components/agents/AgentDashboard";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useAgentSystem } from "@/hooks/useAgentSystem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const Index = () => {
  const agentSystem = useAgentSystem();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
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
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text">
                  🚀 Swarm Multiagent System
                </h1>
                
                <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                  The world's first <span className="text-primary font-semibold">Event-Driven P2P Multi-Agent Development Environment</span> 
                  that transforms how rocket science researchers, developers, and scientists collaborate and innovate.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                    <Play className="w-5 h-5 mr-2" />
                    Launch Agent System
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => setActiveTab("dashboard")}>
                    <Brain className="w-5 h-5 mr-2" />
                    View Dashboard
                  </Button>
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <Card className="glass p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Event-Driven Architecture</h3>
                  <p className="text-muted-foreground">
                    Revolutionary event bus system with real-time task coordination, 
                    automatic load balancing, and intelligent agent orchestration.
                  </p>
                </Card>

                <Card className="glass p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">P2P Communication</h3>
                  <p className="text-muted-foreground">
                    Direct agent-to-agent communication with automatic peer discovery, 
                    mesh networking, and decentralized task delegation.
                  </p>
                </Card>

                <Card className="glass p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
                    <Cpu className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI-Powered Agents</h3>
                  <p className="text-muted-foreground">
                    Specialized AI agents for architecture, development, testing, 
                    deployment, and research with advanced collaboration capabilities.
                  </p>
                </Card>

                <Card className="glass p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Enterprise Security</h3>
                  <p className="text-muted-foreground">
                    Military-grade encryption, secure P2P protocols, 
                    and comprehensive audit trails for sensitive research projects.
                  </p>
                </Card>

                <Card className="glass p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Gauge className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Real-Time Analytics</h3>
                  <p className="text-muted-foreground">
                    Advanced monitoring, performance metrics, and predictive analytics 
                    for optimal system performance and resource utilization.
                  </p>
                </Card>

                <Card className="glass p-6 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Global Collaboration</h3>
                  <p className="text-muted-foreground">
                    Seamless collaboration across time zones with distributed teams, 
                    real-time synchronization, and intelligent conflict resolution.
                  </p>
                </Card>
              </div>

              {/* Benefits Section */}
              <div className="mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
                  Why Choose 🚀 Swarm Multiagent System?
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">10x Faster Development</h3>
                        <p className="text-muted-foreground">
                          Parallel agent execution and intelligent task distribution 
                          reduce development time by up to 90% compared to traditional methods.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Zero-Downtime Scaling</h3>
                        <p className="text-muted-foreground">
                          Dynamic agent scaling and automatic failover ensure 
                          99.99% uptime even during peak research workloads.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Intelligent Resource Management</h3>
                        <p className="text-muted-foreground">
                          AI-driven resource allocation optimizes compute, memory, 
                          and network usage for maximum efficiency and cost savings.
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
                        <h3 className="font-semibold mb-2">Advanced Collaboration</h3>
                        <p className="text-muted-foreground">
                          Multi-agent swarm intelligence enables complex problem-solving 
                          that exceeds the capabilities of individual developers.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-red-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Research-Grade Quality</h3>
                        <p className="text-muted-foreground">
                          Built for rocket science research with enterprise-grade 
                          reliability, security, and compliance standards.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Future-Proof Architecture</h3>
                        <p className="text-muted-foreground">
                          Modular design and extensible framework ensure your 
                          development environment evolves with cutting-edge technology.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                <Card className="glass p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">99.99%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </Card>
                <Card className="glass p-6 text-center">
                  <div className="text-3xl font-bold text-accent mb-2">10x</div>
                  <div className="text-sm text-muted-foreground">Faster Development</div>
                </Card>
                <Card className="glass p-6 text-center">
                  <div className="text-3xl font-bold text-success mb-2">21</div>
                  <div className="text-sm text-muted-foreground">AI Agents</div>
                </Card>
                <Card className="glass p-6 text-center">
                  <div className="text-3xl font-bold text-warning mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Monitoring</div>
                </Card>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
                  Ready to Revolutionize Your Development?
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join the future of collaborative development with the most advanced 
                  multi-agent system ever created for rocket science research.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" onClick={() => setActiveTab("dashboard")}>
                    <Rocket className="w-5 h-5 mr-2" />
                    Launch Now
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
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90" onClick={() => setActiveTab("dashboard")}>
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Building Now
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
};

export default Index;
