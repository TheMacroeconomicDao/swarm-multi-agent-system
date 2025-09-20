// 🚀 SESSION MODAL - Revolutionary Session Creation Interface
// Ultra-modern glassmorphism modal for starting new Vibe Coding sessions

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Code, Zap, Rocket, Target, Smartphone, Gamepad2, Cpu, Wifi, Atom, Satellite, Dna, FlaskConical } from 'lucide-react';

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSession: (sessionData: SessionData) => void;
}

interface SessionData {
  title: string;
  description: string;
  projectType: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'enterprise';
  techStack: string[];
  requirements: string[];
}

const PROJECT_TYPES = [
  // 🚀 Core Web Development
  { id: 'web-app', name: 'Web Application', icon: <Code className="w-4 h-4" />, color: 'bg-primary' },
  { id: 'api', name: 'API Service', icon: <Zap className="w-4 h-4" />, color: 'bg-accent' },
  { id: 'fullstack', name: 'Full-Stack App', icon: <Sparkles className="w-4 h-4" />, color: 'bg-secondary' },
  
  // 📱 Mobile & Desktop
  { id: 'mobile-app', name: 'Mobile App', icon: <Smartphone className="w-4 h-4" />, color: 'bg-green-500' },
  { id: 'desktop-app', name: 'Desktop App', icon: <Cpu className="w-4 h-4" />, color: 'bg-blue-500' },
  
  // 🎮 Game Development
  { id: 'game', name: 'Game Project', icon: <Gamepad2 className="w-4 h-4" />, color: 'bg-purple-500' },
  
  // 🤖 AI/ML & Data Science
  { id: 'ai-project', name: 'AI/ML Project', icon: <Brain className="w-4 h-4" />, color: 'bg-orange-500' },
  { id: 'data-science', name: 'Data Science', icon: <Target className="w-4 h-4" />, color: 'bg-indigo-500' },
  
  // ⛓️ Blockchain & Web3
  { id: 'blockchain', name: 'Blockchain/Web3', icon: <Zap className="w-4 h-4" />, color: 'bg-yellow-500' },
  { id: 'defi', name: 'DeFi Application', icon: <Rocket className="w-4 h-4" />, color: 'bg-red-500' },
  
  // 🌐 IoT & Embedded
  { id: 'iot', name: 'IoT Project', icon: <Wifi className="w-4 h-4" />, color: 'bg-teal-500' },
  
  // 🔬 Cutting Edge Science
  { id: 'quantum', name: 'Quantum Computing', icon: <Atom className="w-4 h-4" />, color: 'bg-pink-500' },
  { id: 'space-tech', name: 'Space Technology', icon: <Satellite className="w-4 h-4" />, color: 'bg-cyan-500' },
  { id: 'biotech', name: 'Biotechnology', icon: <Dna className="w-4 h-4" />, color: 'bg-emerald-500' },
  { id: 'nanotech', name: 'Nanotechnology', icon: <FlaskConical className="w-4 h-4" />, color: 'bg-violet-500' },
];

const TECH_STACKS = [
  // 🚀 Frontend Frameworks
  'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Gatsby', 'Remix',
  
  // 🎯 Backend & Languages
  'Node.js', 'Python', 'TypeScript', 'JavaScript', 'Go', 'Rust', 'C++', 'C#', 'Java',
  
  // 🗄️ Databases & Storage
  'PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase', 'MySQL', 'SQLite', 'DynamoDB',
  
  // 🎨 Styling & UI
  'Tailwind CSS', 'Styled Components', 'Sass', 'Emotion', 'Material-UI', 'Chakra UI', 'Ant Design',
  
  // 📱 Mobile Development
  'Flutter', 'React Native', 'Dart', 'Swift', 'Kotlin', 'Xamarin', 'Ionic',
  
  // 🎮 Game Development
  'Unity', 'Unreal Engine', 'Godot', 'Cocos2d-x', 'Phaser', 'Three.js',
  
  // 🤖 AI/ML & Data Science
  'PyTorch', 'TensorFlow', 'scikit-learn', 'Pandas', 'NumPy', 'Jupyter', 'HuggingFace', 'Langchain',
  
  // ⛓️ Blockchain & Web3
  'Solidity', 'Ethereum', 'Polygon', 'Solana', 'web3.js', 'ethers.js', 'Hardhat', 'Truffle',
  
  // 🖥️ Desktop Development
  'Electron', 'Tauri', 'Qt', 'GTK', 'WPF', 'Flutter Desktop',
  
  // 🌐 IoT & Embedded
  'Arduino', 'Raspberry Pi', 'ESP32', 'STM32', 'LoRa', 'Zigbee', 'MQTT',
  
  // 🚀 DevOps & Cloud
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Jenkins', 'GitHub Actions',
  
  // 🔬 Cutting Edge
  'Qiskit', 'Q#', 'WebAssembly', 'WebRTC', 'GraphQL', 'gRPC', 'Apache Kafka',
  
  // 🧬 Specialized
  'BioPython', 'LAMMPS', 'VASP', 'MATLAB', 'R', 'Julia', 'Fortran'
];

export const SessionModal: React.FC<SessionModalProps> = ({ isOpen, onClose, onCreateSession }) => {
  const [sessionData, setSessionData] = useState<SessionData>({
    title: '',
    description: '',
    projectType: '',
    complexity: 'moderate',
    techStack: [],
    requirements: []
  });

  const [currentRequirement, setCurrentRequirement] = useState('');

  const handleTechStackToggle = (tech: string) => {
    setSessionData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(tech)
        ? prev.techStack.filter(t => t !== tech)
        : [...prev.techStack, tech]
    }));
  };

  const handleAddRequirement = () => {
    if (currentRequirement.trim()) {
      setSessionData(prev => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()]
      }));
      setCurrentRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setSessionData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleCreateSession = () => {
    if (sessionData.title && sessionData.description && sessionData.projectType) {
      onCreateSession(sessionData);
      onClose();
      // Reset form
      setSessionData({
        title: '',
        description: '',
        projectType: '',
        complexity: 'moderate',
        techStack: [],
        requirements: []
      });
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-500';
      case 'moderate': return 'bg-yellow-500';
      case 'complex': return 'bg-orange-500';
      case 'enterprise': return 'bg-red-500';
      default: return 'bg-muted';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0 bg-transparent">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text flex items-center gap-2">
              <Rocket className="w-6 h-6" />
              Launch New Swarm Session
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Configure your revolutionary multi-agent development session
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4 gradient-text">Project Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Title</label>
                  <input
                    type="text"
                    value={sessionData.title}
                    onChange={(e) => setSessionData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="My Revolutionary App"
                    className="w-full px-4 py-3 rounded-lg neuo-inset bg-background border-0 focus:outline-none focus:glow transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={sessionData.description}
                    onChange={(e) => setSessionData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your vision in natural language..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg neuo-inset bg-background border-0 focus:outline-none focus:glow transition-all resize-none"
                  />
                </div>
              </div>
            </Card>

            {/* Project Type */}
            <Card className="glass p-6">
              <h3 className="text-lg font-semibold mb-4 gradient-text">🚀 Project Type</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {PROJECT_TYPES.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSessionData(prev => ({ ...prev, projectType: type.id }))}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      sessionData.projectType === type.id 
                        ? 'neuo glow' 
                        : 'glass hover:neuo'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2 text-center">
                      <div className={`p-2 rounded-lg ${type.color} text-white`}>
                        {type.icon}
                      </div>
                      <div className="text-xs font-medium leading-tight">{type.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Complexity */}
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Project Complexity</h3>
            <div className="flex space-x-4">
              {(['simple', 'moderate', 'complex', 'enterprise'] as const).map((complexity) => (
                <button
                  key={complexity}
                  onClick={() => setSessionData(prev => ({ ...prev, complexity }))}
                  className={`px-4 py-2 rounded-lg transition-all capitalize ${
                    sessionData.complexity === complexity
                      ? 'neuo glow'
                      : 'glass hover:neuo'
                  }`}
                >
                  <Badge className={`${getComplexityColor(complexity)} text-white border-0 mr-2`}>
                    {complexity}
                  </Badge>
                  {complexity}
                </button>
              ))}
            </div>
          </Card>

          {/* Tech Stack */}
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4 gradient-text">🚀 Swarm Multiagent Tech Stack</h3>
            <div className="space-y-4">
              {/* Tech Stack Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Frontend */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-primary">🎨 Frontend</h4>
                  <div className="flex flex-wrap gap-1">
                    {TECH_STACKS.slice(0, 8).map((tech) => (
                      <Badge
                        key={tech}
                        onClick={() => handleTechStackToggle(tech)}
                        className={`cursor-pointer transition-all text-xs ${
                          sessionData.techStack.includes(tech)
                            ? 'bg-primary text-primary-foreground'
                            : 'glass hover:bg-muted'
                        }`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Backend */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-secondary">⚙️ Backend</h4>
                  <div className="flex flex-wrap gap-1">
                    {TECH_STACKS.slice(8, 17).map((tech) => (
                      <Badge
                        key={tech}
                        onClick={() => handleTechStackToggle(tech)}
                        className={`cursor-pointer transition-all text-xs ${
                          sessionData.techStack.includes(tech)
                            ? 'bg-primary text-primary-foreground'
                            : 'glass hover:bg-muted'
                        }`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-green-500">📱 Mobile</h4>
                  <div className="flex flex-wrap gap-1">
                    {TECH_STACKS.slice(22, 29).map((tech) => (
                      <Badge
                        key={tech}
                        onClick={() => handleTechStackToggle(tech)}
                        className={`cursor-pointer transition-all text-xs ${
                          sessionData.techStack.includes(tech)
                            ? 'bg-primary text-primary-foreground'
                            : 'glass hover:bg-muted'
                        }`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* AI/ML */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-orange-500">🤖 AI/ML</h4>
                  <div className="flex flex-wrap gap-1">
                    {TECH_STACKS.slice(35, 43).map((tech) => (
                      <Badge
                        key={tech}
                        onClick={() => handleTechStackToggle(tech)}
                        className={`cursor-pointer transition-all text-xs ${
                          sessionData.techStack.includes(tech)
                            ? 'bg-primary text-primary-foreground'
                            : 'glass hover:bg-muted'
                        }`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Blockchain */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-yellow-500">⛓️ Blockchain</h4>
                  <div className="flex flex-wrap gap-1">
                    {TECH_STACKS.slice(43, 51).map((tech) => (
                      <Badge
                        key={tech}
                        onClick={() => handleTechStackToggle(tech)}
                        className={`cursor-pointer transition-all text-xs ${
                          sessionData.techStack.includes(tech)
                            ? 'bg-primary text-primary-foreground'
                            : 'glass hover:bg-muted'
                        }`}
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Cutting Edge */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-pink-500">🔬 Cutting Edge</h4>
                  <div className="flex flex-wrap gap-1">
                    {TECH_STACKS.slice(57, 65).map((tech) => (
                <Badge
                  key={tech}
                  onClick={() => handleTechStackToggle(tech)}
                        className={`cursor-pointer transition-all text-xs ${
                    sessionData.techStack.includes(tech)
                      ? 'bg-primary text-primary-foreground'
                      : 'glass hover:bg-muted'
                  }`}
                >
                  {tech}
                </Badge>
              ))}
            </div>
                </div>
              </div>

              {/* Selected Tech Stack Summary */}
            {sessionData.techStack.length > 0 && (
                <div className="mt-4 p-3 rounded-lg neuo-inset">
                  <div className="text-sm font-medium mb-2">Selected Technologies ({sessionData.techStack.length}):</div>
                  <div className="flex flex-wrap gap-1">
                    {sessionData.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        className="bg-primary/20 text-primary border-primary/30"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
              </div>
            )}
            </div>
          </Card>

          {/* Requirements */}
          <Card className="glass p-6">
            <h3 className="text-lg font-semibold mb-4 gradient-text">Special Requirements</h3>
            <div className="flex space-x-2 mb-4">
              <input
                type="text"
                value={currentRequirement}
                onChange={(e) => setCurrentRequirement(e.target.value)}
                placeholder="Add specific requirement..."
                className="flex-1 px-4 py-2 rounded-lg neuo-inset bg-background border-0 focus:outline-none focus:glow transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
              />
              <Button
                onClick={handleAddRequirement}
                className="neuo glow"
                disabled={!currentRequirement.trim()}
              >
                <Target className="w-4 h-4" />
              </Button>
            </div>
            {sessionData.requirements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {sessionData.requirements.map((req, index) => (
                  <Badge
                    key={index}
                    className="glass cursor-pointer hover:bg-destructive"
                    onClick={() => handleRemoveRequirement(index)}
                  >
                    {req} ×
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="glass"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSession}
              className="neuo glow animate-pulse-glow"
              disabled={!sessionData.title || !sessionData.description || !sessionData.projectType}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Launch Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};