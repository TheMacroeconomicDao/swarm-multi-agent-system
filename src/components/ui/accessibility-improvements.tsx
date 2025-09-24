import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accessibility, 
  Type, 
  Eye, 
  Keyboard, 
  Volume2, 
  Settings,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from "lucide-react";

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  fontSize: number;
  darkMode: boolean;
}

export const AccessibilityPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    reduceMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    fontSize: 16,
    darkMode: false
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    // Detect system preferences
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setSettings(prev => ({
      ...prev,
      darkMode: prefersDark,
      reduceMotion: prefersReducedMotion
    }));
  }, []);

  // Apply settings
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (settings.largeText) {
      root.style.fontSize = `${settings.fontSize * 1.2}px`;
    } else {
      root.style.fontSize = `${settings.fontSize}px`;
    }

    // Reduce motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Dark mode
    if (settings.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Save settings
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        toggleSetting('darkMode');
      }
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        toggleSetting('highContrast');
      }
      if (e.altKey && e.key === '+') {
        e.preventDefault();
        adjustFontSize(2);
      }
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        adjustFontSize(-2);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, settings]);

  const toggleSetting = (key: keyof AccessibilitySettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const adjustFontSize = (change: number) => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(12, Math.min(32, prev.fontSize + change))
    }));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      reduceMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      fontSize: 16,
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
    };
    setSettings(defaultSettings);
  };

  return (
    <>
      {/* Accessibility Toggle Button */}
      <motion.div 
        className="fixed bottom-6 left-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 3 }}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="glass shadow-lg hover:shadow-xl transition-all duration-300"
          aria-label="Open accessibility settings (Alt+A)"
        >
          <Accessibility className="w-4 h-4 mr-2" />
          A11y
        </Button>
      </motion.div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <Card className="glass p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Accessibility className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Accessibility Settings</h2>
                      <p className="text-sm text-muted-foreground">Customize your experience</p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close accessibility panel"
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Visual Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Visual Settings
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                            <span className="text-sm font-medium">Dark Mode</span>
                          </div>
                          <Button
                            variant={settings.darkMode ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSetting('darkMode')}
                            aria-label="Toggle dark mode (Alt+T)"
                          >
                            {settings.darkMode ? 'On' : 'Off'}
                          </Button>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Type className="w-4 h-4" />
                            <span className="text-sm font-medium">High Contrast</span>
                          </div>
                          <Button
                            variant={settings.highContrast ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleSetting('highContrast')}
                            aria-label="Toggle high contrast (Alt+C)"
                          >
                            {settings.highContrast ? 'On' : 'Off'}
                          </Button>
                        </div>
                      </Card>
                    </div>

                    {/* Font Size Controls */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Type className="w-4 h-4" />
                          <span className="text-sm font-medium">Font Size</span>
                        </div>
                        <Badge variant="outline">{settings.fontSize}px</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustFontSize(-2)}
                          disabled={settings.fontSize <= 12}
                          aria-label="Decrease font size (Alt+-)"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 bg-muted h-2 rounded-full">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${((settings.fontSize - 12) / 20) * 100}%` }}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => adjustFontSize(2)}
                          disabled={settings.fontSize >= 32}
                          aria-label="Increase font size (Alt++)"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  </div>

                  {/* Motion Settings */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Motion & Interaction
                    </h3>
                    
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Reduce Motion</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
                        </div>
                        <Button
                          variant={settings.reduceMotion ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSetting('reduceMotion')}
                          aria-label="Toggle reduced motion"
                        >
                          {settings.reduceMotion ? 'On' : 'Off'}
                        </Button>
                      </div>
                    </Card>
                  </div>

                  {/* Keyboard Navigation */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Keyboard className="w-4 h-4" />
                      Navigation
                    </h3>
                    
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Keyboard Navigation</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Enhanced keyboard shortcuts and focus</p>
                        </div>
                        <Button
                          variant={settings.keyboardNavigation ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSetting('keyboardNavigation')}
                          aria-label="Toggle keyboard navigation enhancements"
                        >
                          {settings.keyboardNavigation ? 'On' : 'Off'}
                        </Button>
                      </div>
                    </Card>
                  </div>

                  {/* Keyboard Shortcuts Help */}
                  <Card className="p-4 bg-muted/50">
                    <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div><Badge className="mr-2">Alt+A</Badge>Open accessibility</div>
                      <div><Badge className="mr-2">Alt+T</Badge>Toggle dark mode</div>
                      <div><Badge className="mr-2">Alt+C</Badge>Toggle contrast</div>
                      <div><Badge className="mr-2">Alt±</Badge>Adjust font size</div>
                    </div>
                  </Card>

                  {/* Reset Button */}
                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={resetSettings}
                      className="flex items-center gap-2"
                      aria-label="Reset all accessibility settings to default"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset to Default
                    </Button>
                    
                    <Button onClick={() => setIsOpen(false)}>
                      Done
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// CSS that should be added to global styles
export const accessibilityStyles = `
/* High Contrast Mode */
.high-contrast {
  --background: 0 0% 0%;
  --foreground: 0 0% 100%;
  --card: 0 0% 10%;
  --card-foreground: 0 0% 100%;
  --popover: 0 0% 10%;
  --popover-foreground: 0 0% 100%;
  --primary: 210 100% 70%;
  --primary-foreground: 0 0% 0%;
  --secondary: 0 0% 20%;
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 85%;
  --accent: 120 100% 70%;
  --accent-foreground: 0 0% 0%;
  --destructive: 0 100% 60%;
  --destructive-foreground: 0 0% 100%;
  --border: 0 0% 30%;
  --input: 0 0% 15%;
  --ring: 210 100% 70%;
}

.high-contrast * {
  border-color: hsl(var(--border)) !important;
}

/* Reduced Motion */
.reduce-motion * {
  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0.01ms !important;
}

/* Enhanced Focus Styles */
.accessibility-focus:focus {
  outline: 3px solid hsl(var(--primary));
  outline-offset: 2px;
  box-shadow: 0 0 0 3px hsl(var(--primary) / 0.3);
}

/* Skip to content link */
.skip-to-content {
  position: absolute;
  top: -40px;
  left: 6px;
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 1000;
}

.skip-to-content:focus {
  top: 6px;
}
`;

export default AccessibilityPanel;

