import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SmartTooltip, FeatureTooltip } from "@/components/ui/smart-tooltip";
import KeyboardShortcuts from "@/components/ui/keyboard-shortcuts";
import AccessibilityPanel from "@/components/ui/accessibility-improvements";
import ResponsiveContainer from "@/components/ui/responsive-container";
import {
  Home,
  Search,
  ArrowLeft,
  Rocket,
  Brain,
  Zap,
  AlertTriangle,
  RefreshCw,
  Compass,
  Map,
  Star,
  Globe,
  Users
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    
    // Show suggestions after a delay
    const timer = setTimeout(() => setShowSuggestions(true), 1000);
    
    // Auto redirect countdown
    const countdownTimer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownTimer);
    };
  }, [location.pathname, navigate]);

  const keyboardShortcuts = {
    onNavigateHome: () => navigate('/'),
    onNavigateDemo: () => navigate('/global-mission'),
    onNavigateDashboard: () => navigate('/#dashboard'),
    onOpenSearch: () => console.log("Search opened"),
    onToggleTheme: () => document.documentElement.classList.toggle('dark')
  };

  const popularPages = [
    {
      title: "🚀 Main Dashboard",
      description: "Revolutionary AI-powered swarm system",
      path: "/",
      icon: <Home className="w-5 h-5" />,
      badge: "Popular"
    },
    {
      title: "🌍 Global Mission Demo", 
      description: "Watch AI swarm solve humanity's greatest challenges",
      path: "/global-mission",
      icon: <Globe className="w-5 h-5" />,
      badge: "Revolutionary"
    },
    {
      title: "🔬 Tech Stacks",
      description: "Explore cutting-edge technology combinations",
      path: "/rocket-science",
      icon: <Rocket className="w-5 h-5" />,
      badge: "Advanced"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 animate-ultramodern-glow">
      <div className="container mx-auto px-4 py-16 text-center">
        {/* Animated 404 Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-12"
        >
          {/* Floating 404 */}
          <motion.div
            className="relative mb-8"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-8xl md:text-9xl font-bold gradient-text mb-4 relative">
              4
              <motion.div
                className="inline-block mx-4"
                animate={{
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
              </motion.div>
              4
            </div>
            
            {/* Orbiting particles */}
            {[0, 120, 240].map((rotation, index) => (
              <motion.div
                key={index}
                className="absolute w-3 h-3 bg-primary rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: '80px 0'
                }}
                animate={{
                  rotate: 360
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.5
                }}
                initial={{
                  rotate: rotation
                }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Oops! Lost in the Digital Universe
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-2 max-w-2xl mx-auto">
              The page you're looking for seems to have been consumed by our AI swarm! 🤖
            </p>
            
            <motion.div
              className="inline-flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-full"
              animate={{
                boxShadow: ["0 0 20px rgba(239, 68, 68, 0.3)", "0 0 40px rgba(239, 68, 68, 0.6)", "0 0 20px rgba(239, 68, 68, 0.3)"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Map className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                Route: {location.pathname}
              </span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Quick Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SmartTooltip
            title="Return Home"
            description="Go back to the main dashboard with all system features and AI-powered swarm intelligence"
            shortcut="Ctrl+H"
            type="info"
          >
            <Button 
              size="lg"
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </SmartTooltip>

          <Button 
            variant="outline" 
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>

          <FeatureTooltip
            title="Try Live Demo"
            description="Experience our revolutionary swarm system with real-time AI orchestration and 400+ models"
            shortcut="Ctrl+D"
          >
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/demo')}
              className="hover:bg-primary/20"
            >
              <Zap className="w-5 h-5 mr-2" />
              Live Demo
            </Button>
          </FeatureTooltip>
        </motion.div>

        {/* Popular Destinations */}
        <AnimatePresence>
          {showSuggestions && (
            <motion.section
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex items-center justify-center gap-2 mb-8">
                <Compass className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Popular Destinations</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {popularPages.map((page, index) => (
                  <motion.div
                    key={page.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="glass p-6 cursor-pointer hover:shadow-xl transition-all duration-300"
                      onClick={() => navigate(page.path)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 rounded-lg bg-primary/20">
                          {page.icon}
                        </div>
                        <Badge className="bg-accent/20 text-accent">
                          {page.badge}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{page.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {page.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Auto Redirect Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <Card className="glass p-4 max-w-md mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="font-medium">Auto-redirecting to home</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Redirecting in <Badge variant="outline" className="mx-1">{countdown}</Badge> seconds
            </p>
          </Card>
        </motion.div>

        {/* Fun Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <Card className="glass p-4 text-center">
            <motion.div 
              className="text-2xl font-bold text-primary mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              400+
            </motion.div>
            <div className="text-xs text-muted-foreground">AI Models</div>
          </Card>
          
          <Card className="glass p-4 text-center">
            <motion.div 
              className="text-2xl font-bold text-accent mb-1"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              🚀
            </motion.div>
            <div className="text-xs text-muted-foreground">Swarm System</div>
          </Card>
          
          <Card className="glass p-4 text-center">
            <motion.div 
              className="text-2xl font-bold text-secondary mb-1"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              99.9%
            </motion.div>
            <div className="text-xs text-muted-foreground">Uptime</div>
          </Card>
          
          <Card className="glass p-4 text-center">
            <motion.div 
              className="text-2xl font-bold text-success mb-1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ∞
            </motion.div>
            <div className="text-xs text-muted-foreground">Possibilities</div>
          </Card>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-sm text-muted-foreground">
            💡 Tip: Our AI-powered swarm system is ready to help you navigate anywhere!
          </p>
        </motion.div>
      </div>

      {/* Enhanced UX Components */}
      <KeyboardShortcuts {...keyboardShortcuts} />
      <AccessibilityPanel />
      
      {/* Skip to content for screen readers */}
      <a href="#error-content" className="skip-to-content">
        Skip to error page content
      </a>
    </div>
  );
};

export default NotFound;
