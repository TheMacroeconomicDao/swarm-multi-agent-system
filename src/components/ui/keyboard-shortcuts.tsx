import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Keyboard, 
  X, 
  Search, 
  Home, 
  Play, 
  Settings, 
  HelpCircle,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Command
} from "lucide-react";

interface ShortcutAction {
  key: string;
  description: string;
  icon?: React.ReactNode;
  category: 'navigation' | 'actions' | 'system';
  action: () => void;
}

interface KeyboardShortcutsProps {
  onNavigateHome?: () => void;
  onNavigateDemo?: () => void;
  onNavigateDashboard?: () => void;
  onOpenSearch?: () => void;
  onToggleTheme?: () => void;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  onNavigateHome,
  onNavigateDemo,
  onNavigateDashboard,
  onOpenSearch,
  onToggleTheme
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  const shortcuts: ShortcutAction[] = [
    // Navigation
    {
      key: "H",
      description: "Go to Home",
      icon: <Home className="w-4 h-4" />,
      category: "navigation",
      action: () => onNavigateHome?.()
    },
    {
      key: "D",
      description: "Open Live Demo",
      icon: <Play className="w-4 h-4" />,
      category: "navigation", 
      action: () => onNavigateDemo?.()
    },
    {
      key: "B",
      description: "View Dashboard",
      icon: <Settings className="w-4 h-4" />,
      category: "navigation",
      action: () => onNavigateDashboard?.()
    },
    // Actions
    {
      key: "/",
      description: "Open Search",
      icon: <Search className="w-4 h-4" />,
      category: "actions",
      action: () => onOpenSearch?.()
    },
    {
      key: "T",
      description: "Toggle Theme",
      icon: <Settings className="w-4 h-4" />,
      category: "actions",
      action: () => onToggleTheme?.()
    },
    // System
    {
      key: "?",
      description: "Show Shortcuts",
      icon: <HelpCircle className="w-4 h-4" />,
      category: "system",
      action: () => setIsVisible(!isVisible)
    },
    {
      key: "Escape",
      description: "Close Overlays",
      icon: <X className="w-4 h-4" />,
      category: "system", 
      action: () => setIsVisible(false)
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      
      // Update pressed keys visual feedback
      setPressedKeys(prev => new Set([...prev, key]));
      
      // Handle shortcuts
      if (event.ctrlKey || event.metaKey) {
        const shortcut = shortcuts.find(s => s.key.toLowerCase() === key);
        if (shortcut) {
          event.preventDefault();
          shortcut.action();
        }
      } else {
        // Direct key shortcuts
        if (key === '?') {
          event.preventDefault();
          setIsVisible(!isVisible);
        } else if (key === 'escape') {
          setIsVisible(false);
        } else if (key === '/') {
          event.preventDefault();
          onOpenSearch?.();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(event.key.toLowerCase());
        return newSet;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isVisible, shortcuts, onNavigateHome, onNavigateDemo, onNavigateDashboard, onOpenSearch, onToggleTheme]);

  const categoryGroups = {
    navigation: shortcuts.filter(s => s.category === 'navigation'),
    actions: shortcuts.filter(s => s.category === 'actions'),
    system: shortcuts.filter(s => s.category === 'system')
  };

  const categoryIcons = {
    navigation: <ArrowRight className="w-4 h-4" />,
    actions: <Play className="w-4 h-4" />,
    system: <Settings className="w-4 h-4" />
  };

  const formatKey = (key: string) => {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modifierKey = isMac ? '⌘' : 'Ctrl';
    
    if (key.length === 1 && key !== '/' && key !== '?') {
      return `${modifierKey} + ${key.toUpperCase()}`;
    }
    return key === 'Escape' ? 'Esc' : key;
  };

  return (
    <>
      {/* Floating shortcuts help button */}
      <motion.div 
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="glass shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Keyboard className="w-4 h-4 mr-2" />
          ?
        </Button>
      </motion.div>

      {/* Shortcuts overlay */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsVisible(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <Card className="glass p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Keyboard className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Keyboard Shortcuts</h2>
                      <p className="text-sm text-muted-foreground">Power user productivity tips</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsVisible(false)}
                    className="hover:bg-destructive/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {Object.entries(categoryGroups).map(([category, shortcuts]) => (
                    <div key={category}>
                      <div className="flex items-center gap-2 mb-3">
                        {categoryIcons[category as keyof typeof categoryIcons]}
                        <h3 className="font-semibold capitalize text-sm">
                          {category}
                        </h3>
                      </div>
                      
                      <div className="space-y-2">
                        {shortcuts.map(shortcut => (
                          <div 
                            key={shortcut.key}
                            className="flex items-center justify-between p-3 rounded-lg bg-surface/50 hover:bg-surface/70 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {shortcut.icon}
                              <span className="text-sm">{shortcut.description}</span>
                            </div>
                            
                            <Badge 
                              variant="outline" 
                              className="font-mono text-xs"
                            >
                              {formatKey(shortcut.key)}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    💡 Tip: Press <Badge variant="outline" className="mx-1 text-xs">?</Badge> anytime to toggle this help
                  </p>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;
