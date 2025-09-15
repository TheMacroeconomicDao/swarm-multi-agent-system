// 🚀 SESSION MODAL - Revolutionary Session Creation Interface
// Ultra-modern glassmorphism modal for starting new Vibe Coding sessions

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Brain, Code, Zap, Rocket, Target } from 'lucide-react';

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
  { id: 'web-app', name: 'Web Application', icon: <Code className="w-4 h-4" />, color: 'bg-primary' },
  { id: 'mobile-app', name: 'Mobile App', icon: <Sparkles className="w-4 h-4" />, color: 'bg-secondary' },
  { id: 'api', name: 'API Service', icon: <Zap className="w-4 h-4" />, color: 'bg-accent' },
  { id: 'ai-project', name: 'AI/ML Project', icon: <Brain className="w-4 h-4" />, color: 'bg-primary' },
];

const TECH_STACKS = [
  'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js',
  'Node.js', 'Python', 'TypeScript', 'JavaScript', 'Go', 'Rust',
  'PostgreSQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase',
  'Tailwind CSS', 'Styled Components', 'SASS', 'Emotion'
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
              Launch New Vibe Coding Session
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
              <h3 className="text-lg font-semibold mb-4 gradient-text">Project Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {PROJECT_TYPES.map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setSessionData(prev => ({ ...prev, projectType: type.id }))}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      sessionData.projectType === type.id 
                        ? 'neuo glow' 
                        : 'glass hover:neuo'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${type.color} text-white`}>
                        {type.icon}
                      </div>
                      <div className="text-sm font-medium">{type.name}</div>
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
            <h3 className="text-lg font-semibold mb-4 gradient-text">Tech Stack</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {TECH_STACKS.map((tech) => (
                <Badge
                  key={tech}
                  onClick={() => handleTechStackToggle(tech)}
                  className={`cursor-pointer transition-all ${
                    sessionData.techStack.includes(tech)
                      ? 'bg-primary text-primary-foreground'
                      : 'glass hover:bg-muted'
                  }`}
                >
                  {tech}
                </Badge>
              ))}
            </div>
            {sessionData.techStack.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Selected: {sessionData.techStack.join(', ')}
              </div>
            )}
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