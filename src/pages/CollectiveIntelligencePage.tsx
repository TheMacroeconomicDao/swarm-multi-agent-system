import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Brain, Users, MessageSquare, Target, Globe, Network, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CollectiveIntelligenceDemo from '@/components/agents/CollectiveIntelligenceDemo';
import DemoModeBanner from '@/components/ui/demo-mode-banner';
import KeyboardShortcuts from '@/components/ui/keyboard-shortcuts';
import AccessibilityPanel from '@/components/ui/accessibility-improvements';

const CollectiveIntelligencePage: React.FC = () => {
  const navigate = useNavigate();

  const keyboardShortcuts = {
    onNavigateHome: () => navigate('/'),
    onNavigateDemo: () => navigate('/global-mission'),
    onNavigateDashboard: () => navigate('/#dashboard'),
    onOpenSearch: () => console.log("Search opened"),
    onToggleTheme: () => document.documentElement.classList.toggle('dark')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      {/* Skip to content link for accessibility */}
      <a href="#collective-intelligence-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md">
        Skip to Collective Intelligence Content
      </a>

      {/* Demo Mode Banner */}
      <DemoModeBanner />

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts {...keyboardShortcuts} />
      
      {/* Accessibility Panel */}
      <AccessibilityPanel />

      <div className="container mx-auto max-w-7xl p-4" id="collective-intelligence-content">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            className="flex items-center gap-4 mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/global-mission')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Global Mission
            </Button>
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4"
              animate={{
                boxShadow: ["0 0 20px rgba(168, 85, 247, 0.3)", "0 0 40px rgba(168, 85, 247, 0.6)", "0 0 20px rgba(168, 85, 247, 0.3)"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Collective Intelligence Laboratory</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
              🧠 AI Models Working Together
            </h1>
            
            <p className="text-xl text-muted-foreground mb-6 max-w-4xl mx-auto">
              Experience the future of AI collaboration as top models (Claude, GPT-4, Gemini, Llama, O1) 
              engage in real-time discussions to solve humanity's greatest challenges through collective intelligence.
            </p>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="glass p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold">Multi-Model Collaboration</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  5 top AI models working together with different strengths and perspectives
                </p>
              </Card>
              
              <Card className="glass p-4">
                <div className="flex items-center gap-3 mb-2">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold">Real-Time Discussion</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Watch AI models debate, agree, disagree, and synthesize solutions in real-time
                </p>
              </Card>
              
              <Card className="glass p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold">Global Challenges</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tackle critical global issues like climate change, space colonization, and medical breakthroughs
                </p>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Main Demo Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <CollectiveIntelligenceDemo />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass p-6 max-w-4xl mx-auto">
            <h3 className="text-xl font-semibold mb-4 flex items-center justify-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              How It Works
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h4 className="font-semibold mb-2">Select Challenge</h4>
                <p className="text-sm text-muted-foreground">
                  Choose from critical global challenges like climate crisis or space colonization
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h4 className="font-semibold mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Each AI model analyzes the problem from their unique perspective and expertise
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h4 className="font-semibold mb-2">Collaborative Discussion</h4>
                <p className="text-sm text-muted-foreground">
                  Models engage in real-time discussion, debate, and knowledge sharing
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">4️⃣</span>
                </div>
                <h4 className="font-semibold mb-2">Collective Solution</h4>
                <p className="text-sm text-muted-foreground">
                  Final synthesized solution combining the best ideas from all AI models
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This demo showcases the potential of AI collective intelligence. 
                When Puter authentication is available, you'll see real AI models collaborating. 
                Otherwise, the demo simulates realistic AI interactions based on each model's known capabilities.
              </p>
            </div>
            
            {/* Navigation to other demos */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3 text-center">Explore More Demos</h4>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate('/global-mission')}
                  className="flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  Global Mission Demo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/demo')}
                  className="flex items-center gap-2"
                >
                  <Network className="w-4 h-4" />
                  Swarm Demo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4" />
                  Home
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CollectiveIntelligencePage;
