import React, { useState } from "react";
import { APP_CONFIG } from "@/config/constants";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  X, 
  Info, 
  Zap, 
  Brain,
  Settings,
  ExternalLink
} from "lucide-react";

interface DemoModeBannerProps {
  isVisible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  isVisible = true,
  onDismiss,
  className = ""
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (!isVisible || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      >
        <Card className="glass p-4 max-w-md border border-primary/30 shadow-lg">
          <div className="flex items-start gap-3">
            <motion.div
              className="p-1 rounded-full bg-primary/20"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.3)",
                  "0 0 30px rgba(168, 85, 247, 0.6)", 
                  "0 0 20px rgba(168, 85, 247, 0.3)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">
                  🎭 Demo Mode Active
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 hover:bg-background/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed">
                Swarm intelligence is <span className="text-primary font-medium">fully operational</span> with 
                intelligent demo responses. Agents are coordinating successfully!
              </p>
              
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 text-xs px-2 py-1">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Active
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1">
                  <Zap className="w-3 h-3 mr-1" />
                  Swarm Ready
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                💡 Full 400+ AI models with Puter API
              </p>
              <motion.a
                href={APP_CONFIG.PUTER_WEBSITE}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ExternalLink className="w-3 h-3" />
                Setup
              </motion.a>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoModeBanner;

