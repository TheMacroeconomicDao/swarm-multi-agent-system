// 🚀 ROCKET SCIENCE PAGE
// Showcase of cutting-edge technology stacks with modern UX/UI

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RocketScienceStacks } from '@/components/tech-stack/RocketScienceStacks';
import { TechStack } from '@/types/tech-stack';
import { SmartTooltip, FeatureTooltip, PerformanceTooltip } from '@/components/ui/smart-tooltip';
import KeyboardShortcuts from '@/components/ui/keyboard-shortcuts';
import AccessibilityPanel from '@/components/ui/accessibility-improvements';
import ResponsiveContainer from '@/components/ui/responsive-container';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Rocket, 
  Brain, 
  Zap, 
  Star,
  Lightbulb,
  Target,
  Users
} from 'lucide-react';

const RocketScience: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStack, setSelectedStack] = useState<TechStack | null>(null);

  useEffect(() => {
    // Simulate loading for dramatic effect
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStackSelect = (stack: TechStack) => {
    setSelectedStack(stack);
    console.log('Selected stack:', stack);
    
    // Show detailed view or navigate to project initialization
    // You could implement a detailed modal or navigate to a new page
  };

  const keyboardShortcuts = {
    onNavigateHome: () => navigate('/'),
    onNavigateDemo: () => navigate('/global-mission'),
    onNavigateDashboard: () => navigate('/#dashboard'),
    onOpenSearch: () => console.log("Search opened"),
    onToggleTheme: () => document.documentElement.classList.toggle('dark')
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
        <EnhancedLoading
          title="Loading Rocket Science Stacks"
          subtitle="Discovering the most cutting-edge technology combinations..."
          variant="ai"
          overallProgress={85}
        />
        <KeyboardShortcuts {...keyboardShortcuts} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 animate-ultramodern-glow">
      {/* Navigation Header */}
      <motion.div 
        className="sticky top-0 z-40 glass border-b border-border/50 backdrop-blur-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SmartTooltip
                title="Back to Home"
                description="Return to the main dashboard with all system features"
                shortcut="Ctrl+H"
                type="info"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="glass hover:bg-surface/80"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </SmartTooltip>

              <div className="h-6 w-px bg-border/50" />
              
              <motion.div
                className="flex items-center gap-2"
                animate={{
                  y: [0, -2, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Rocket className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold gradient-text">
                  Rocket Science Tech Stacks
                </h1>
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              <PerformanceTooltip
                title="Global Mission Demo"
                description="Witness AI swarm solving humanity's greatest challenges: climate crisis, Mars colonization, disease cures"
                shortcut="Ctrl+D"
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/global-mission')}
                  className="glass hover:bg-green-500/20"
                >
                  <Globe className="w-4 h-4 mr-2" />
                  🌍 Global Mission
                </Button>
              </PerformanceTooltip>

              <Badge className="bg-primary/20 text-primary animate-pulse">
                🚀 Revolutionary Tech
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        className="py-16 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6"
            animate={{
              boxShadow: ["0 0 20px rgba(168, 85, 247, 0.3)", "0 0 40px rgba(168, 85, 247, 0.6)", "0 0 20px rgba(168, 85, 247, 0.3)"]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">World's Most Advanced Tech Combinations</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            🚀 Rocket Science Technology Stacks
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            Discover and explore the most <span className="text-primary font-semibold">cutting-edge technology combinations</span> 
            designed for revolutionary AI-powered applications and swarm intelligence systems.
          </p>

          {/* Key Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <FeatureTooltip
              title="Innovation Score System"
              description="Each tech stack is rated on innovation, complexity, cutting-edge factors, and future potential using our proprietary Swarm Science scoring algorithm"
              shortcut="Ctrl+I"
            >
              <Card className="glass p-4 hover:scale-105 transition-all duration-300 cursor-help">
                <motion.div
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Brain className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                </motion.div>
                <h3 className="font-semibold mb-1">AI-Powered Scoring</h3>
                <p className="text-sm text-muted-foreground">Intelligent evaluation system</p>
              </Card>
            </FeatureTooltip>

            <SmartTooltip
              title="Cutting-Edge Discovery"
              description="Find the most innovative and future-ready technology combinations used by industry leaders and research institutions"
              type="feature"
              shortcut="Ctrl+E"
            >
              <Card className="glass p-4 hover:scale-105 transition-all duration-300 cursor-help">
                <motion.div
                  animate={{
                    y: [0, -5, 5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                </motion.div>
                <h3 className="font-semibold mb-1">Future-Ready</h3>
                <p className="text-sm text-muted-foreground">Tomorrow's technology today</p>
              </Card>
            </SmartTooltip>

            <PerformanceTooltip
              title="Expert Curation"
              description="All technology stacks are carefully curated and evaluated by our team of senior architects and researchers"
              shortcut="Ctrl+C"
            >
              <Card className="glass p-4 hover:scale-105 transition-all duration-300 cursor-help">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                </motion.div>
                <h3 className="font-semibold mb-1">Expert Curated</h3>
                <p className="text-sm text-muted-foreground">Vetted by professionals</p>
              </Card>
            </PerformanceTooltip>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <motion.div
        className="container mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <RocketScienceStacks onStackSelect={handleStackSelect} />
      </motion.div>

      {/* Selected Stack Modal/Preview (if needed) */}
      <AnimatePresence>
        {selectedStack && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStack(null)}
          >
            <motion.div
              className="max-w-2xl w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <Card className="glass p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{selectedStack.name}</h3>
                    <p className="text-muted-foreground">{selectedStack.description}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedStack(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge className="bg-primary/20 text-primary">
                      Swarm Science Score: {selectedStack.rocketScience?.overall || 0}/100
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {selectedStack.complexity}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Performance:</span> {selectedStack.performance}/100
                    </div>
                    <div>
                      <span className="font-medium">Community:</span> {selectedStack.community}/100
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Technologies:</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedStack.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1">
                      <Target className="w-4 h-4 mr-2" />
                      Start Project
                    </Button>
                    <Button variant="outline">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced UX Components */}
      <KeyboardShortcuts {...keyboardShortcuts} />
      <AccessibilityPanel />
      
      {/* Skip to content for screen readers */}
      <a href="#tech-stacks-content" className="skip-to-content">
        Skip to tech stacks content
      </a>
    </div>
  );
};

export default RocketScience;

