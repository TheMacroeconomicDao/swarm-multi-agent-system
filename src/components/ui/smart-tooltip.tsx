import React, { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Zap, Brain, Lightbulb, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SmartTooltipProps {
  children: React.ReactNode;
  title: string;
  description: string;
  type?: 'info' | 'feature' | 'ai' | 'performance' | 'warning';
  shortcut?: string;
  learnMoreUrl?: string;
  showOnHover?: boolean;
  showOnFocus?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

const typeConfig = {
  info: {
    icon: HelpCircle,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/30'
  },
  feature: {
    icon: Zap,
    color: 'text-purple-400', 
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/30'
  },
  ai: {
    icon: Brain,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30'
  },
  performance: {
    icon: Zap,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30'
  },
  warning: {
    icon: Lightbulb,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30'
  }
};

export const SmartTooltip: React.FC<SmartTooltipProps> = ({
  children,
  title,
  description,
  type = 'info',
  shortcut,
  learnMoreUrl,
  showOnHover = true,
  showOnFocus = true,
  position = 'top',
  delay = 500,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  const config = typeConfig[type];
  const IconComponent = config.icon;

  useEffect(() => {
    if (isVisible && !hasBeenShown) {
      setHasBeenShown(true);
    }
  }, [isVisible, hasBeenShown]);

  const handleOpenChange = (open: boolean) => {
    setIsVisible(open);
  };

  return (
    <TooltipProvider delayDuration={delay}>
      <Tooltip onOpenChange={handleOpenChange}>
        <TooltipTrigger asChild>
          <div 
            className={`relative inline-flex items-center ${className}`}
            tabIndex={showOnFocus ? 0 : -1}
          >
            {children}
            {/* Smart indicator */}
            <motion.div
              className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${config.bgColor} ${config.borderColor} border opacity-70`}
              animate={{
                scale: isVisible ? 1.2 : 1,
                opacity: hasBeenShown ? 0.5 : 0.8
              }}
              transition={{
                duration: 0.2,
                ease: "easeInOut"
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side={position}
          className="max-w-xs p-0 overflow-hidden glass border-0 bg-background/95 backdrop-blur-xl"
        >
          <AnimatePresence>
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                    <IconComponent className={`w-4 h-4 ${config.color}`} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm text-foreground">
                        {title}
                      </h4>
                      {shortcut && (
                        <Badge variant="outline" className="text-xs px-2 py-1 font-mono">
                          {shortcut}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                    
                    {learnMoreUrl && (
                      <motion.a
                        href={learnMoreUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Learn more
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Preset configurations for common use cases
export const FeatureTooltip: React.FC<Omit<SmartTooltipProps, 'type'>> = (props) => (
  <SmartTooltip {...props} type="feature" />
);

export const AITooltip: React.FC<Omit<SmartTooltipProps, 'type'>> = (props) => (
  <SmartTooltip {...props} type="ai" />
);

export const PerformanceTooltip: React.FC<Omit<SmartTooltipProps, 'type'>> = (props) => (
  <SmartTooltip {...props} type="performance" />
);

export const InfoTooltip: React.FC<Omit<SmartTooltipProps, 'type'>> = (props) => (
  <SmartTooltip {...props} type="info" />
);

