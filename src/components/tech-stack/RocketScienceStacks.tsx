// 🚀 ROCKET SCIENCE STACKS COMPONENT
// Display and manage cutting-edge technology stacks

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { SmartTooltip, FeatureTooltip, PerformanceTooltip } from '@/components/ui/smart-tooltip';
import { 
  Rocket, 
  Zap, 
  Brain, 
  Star, 
  TrendingUp, 
  Code, 
  Database, 
  Smartphone,
  Gamepad2,
  Cpu,
  Wifi,
  Atom,
  Satellite,
  Dna,
  FlaskConical
} from 'lucide-react';
import { TechStack, TechCategory } from '@/types/tech-stack';
import { TechStackManager } from '@/lib/tech-stack/tech-stack-manager';

interface RocketScienceStacksProps {
  onStackSelect?: (stack: TechStack) => void;
}

const techStackManager = new TechStackManager();

const categoryIcons: Record<TechCategory, React.ReactNode> = {
  [TechCategory.WEB_FRONTEND]: <Code className="w-4 h-4" />,
  [TechCategory.WEB_BACKEND]: <Database className="w-4 h-4" />,
  [TechCategory.FULLSTACK]: <Code className="w-4 h-4" />,
  [TechCategory.MOBILE]: <Smartphone className="w-4 h-4" />,
  [TechCategory.DESKTOP]: <Cpu className="w-4 h-4" />,
  [TechCategory.DATA_SCIENCE]: <TrendingUp className="w-4 h-4" />,
  [TechCategory.AI_ML]: <Brain className="w-4 h-4" />,
  [TechCategory.BLOCKCHAIN]: <Zap className="w-4 h-4" />,
  [TechCategory.GAME_DEVELOPMENT]: <Gamepad2 className="w-4 h-4" />,
  [TechCategory.EMBEDDED]: <Cpu className="w-4 h-4" />,
  [TechCategory.DEVOPS]: <Database className="w-4 h-4" />,
  [TechCategory.MICROSERVICES]: <Database className="w-4 h-4" />,
  [TechCategory.SERVERLESS]: <Database className="w-4 h-4" />,
  [TechCategory.QUANTUM]: <Atom className="w-4 h-4" />,
  [TechCategory.ROBOTICS]: <Cpu className="w-4 h-4" />,
  [TechCategory.IOT]: <Wifi className="w-4 h-4" />,
  [TechCategory.AR_VR]: <Brain className="w-4 h-4" />,
  [TechCategory.METAVERSE]: <Brain className="w-4 h-4" />,
  [TechCategory.WEB3]: <Zap className="w-4 h-4" />,
  [TechCategory.DEFI]: <Zap className="w-4 h-4" />,
  [TechCategory.NFT]: <Star className="w-4 h-4" />,
  [TechCategory.CRYPTO]: <Zap className="w-4 h-4" />,
  [TechCategory.SPACE_TECH]: <Satellite className="w-4 h-4" />,
  [TechCategory.BIOTECH]: <Dna className="w-4 h-4" />,
  [TechCategory.NANOTECH]: <FlaskConical className="w-4 h-4" />
};

export const RocketScienceStacks: React.FC<RocketScienceStacksProps> = ({ onStackSelect }) => {
  const [stacks, setStacks] = useState<TechStack[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'rocket-science'>('all');
  const [selectedCategory, setSelectedCategory] = useState<TechCategory | 'all'>('all');

  useEffect(() => {
    loadStacks();
  }, [selectedLevel, selectedCategory]);

  const loadStacks = () => {
    let loadedStacks: TechStack[] = [];

    if (selectedLevel === 'all') {
      loadedStacks = techStackManager.getAllTechStacks();
    } else {
      loadedStacks = techStackManager.getStacksByRocketScienceLevel(selectedLevel);
    }

    if (selectedCategory !== 'all') {
      loadedStacks = loadedStacks.filter(stack => stack.category === selectedCategory);
    }

    // Sort by rocket science score
    loadedStacks.sort((a, b) => (b.rocketScience?.overall || 0) - (a.rocketScience?.overall || 0));
    
    setStacks(loadedStacks);
  };

  const getRocketScienceColor = (score: number): string => {
    if (score >= 95) return 'text-red-500';
    if (score >= 85) return 'text-orange-500';
    if (score >= 70) return 'text-yellow-500';
    if (score >= 50) return 'text-green-500';
    return 'text-gray-500';
  };

  const getRocketScienceBadge = (score: number): string => {
    if (score >= 95) return '🚀 SWARM SCIENCE';
    if (score >= 85) return '🔥 CUTTING EDGE';
    if (score >= 70) return '⚡ ADVANCED';
    if (score >= 50) return '💡 INNOVATIVE';
    return '📚 LEARNING';
  };

  const getRocketScienceBadgeColor = (score: number): string => {
    if (score >= 95) return 'bg-red-500/20 text-red-500 border-red-500/30';
    if (score >= 85) return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
    if (score >= 70) return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    if (score >= 50) return 'bg-green-500/20 text-green-500 border-green-500/30';
    return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center space-y-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="flex items-center justify-center space-x-2"
          animate={{
            y: [0, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Rocket className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold gradient-text">Swarm Multiagent Tech Stacks</h1>
        </motion.div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the most cutting-edge and innovative technology stacks for building the future
        </p>
      </motion.div>

      {/* Filters */}
      <Tabs value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All Stacks</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="expert">Expert</TabsTrigger>
          <TabsTrigger value="rocket-science">🚀 Swarm Science</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedLevel} className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {Object.values(TechCategory).map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="flex items-center space-x-1"
              >
                {categoryIcons[category]}
                <span className="capitalize">{category.replace('-', ' ')}</span>
              </Button>
            ))}
          </div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SmartTooltip
              title="Total Tech Stacks"
              description="Complete collection of curated technology combinations from beginner to rocket science level"
              type="info"
            >
              <Card className="glass p-4 hover:scale-105 transition-all duration-300 cursor-help">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Rocket className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div>
                    <motion.div 
                      className="text-2xl font-bold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {stacks.length}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Total Stacks</div>
                  </div>
                </div>
              </Card>
            </SmartTooltip>

            <PerformanceTooltip
              title="Swarm Science Level"
              description="Ultra-advanced technology stacks with 95+ innovation score, representing the pinnacle of modern development"
            >
              <Card className="glass p-4 hover:scale-105 transition-all duration-300 cursor-help">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ 
                      boxShadow: ["0 0 20px rgba(234, 179, 8, 0.3)", "0 0 40px rgba(234, 179, 8, 0.6)", "0 0 20px rgba(234, 179, 8, 0.3)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-5 h-5 text-yellow-500" />
                  </motion.div>
                  <div>
                    <motion.div 
                      className="text-2xl font-bold"
                      animate={{ opacity: [0.8, 1, 0.8] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      {stacks.filter(s => (s.rocketScience?.overall || 0) >= 95).length}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Swarm Science</div>
                  </div>
                </div>
              </Card>
            </PerformanceTooltip>

            <FeatureTooltip
              title="Cutting Edge Technologies"
              description="Technology stacks with 80+ cutting-edge score, featuring the latest innovations and bleeding-edge tools"
            >
              <Card className="glass p-4 hover:scale-105 transition-all duration-300 cursor-help">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  >
                    <Brain className="w-5 h-5 text-blue-500" />
                  </motion.div>
                  <div>
                    <motion.div 
                      className="text-2xl font-bold"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    >
                      {stacks.filter(s => (s.rocketScience?.cuttingEdge || 0) >= 80).length}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Cutting Edge</div>
                  </div>
                </div>
              </Card>
            </FeatureTooltip>

            <SmartTooltip
              title="Future Technology"
              description="Forward-looking technology stacks with 90+ future potential score, designed for next-generation applications"
              type="ai"
            >
              <Card className="glass p-4 hover:scale-105 transition-all duration-300 cursor-help">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  >
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </motion.div>
                  <div>
                    <motion.div 
                      className="text-2xl font-bold"
                      animate={{ 
                        background: ["linear-gradient(45deg, #22c55e, #10b981)", "linear-gradient(45deg, #10b981, #22c55e)"],
                        backgroundClip: "text",
                        color: "transparent"
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      {stacks.filter(s => (s.rocketScience?.futurePotential || 0) >= 90).length}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">Future Tech</div>
                  </div>
                </div>
              </Card>
            </SmartTooltip>
          </motion.div>

          {/* Tech Stacks Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {stacks.map((stack, index) => (
              <motion.div
                key={stack.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <SmartTooltip
                  title={`${stack.name} Stack`}
                  description={`${stack.description} - Swarm Science Score: ${stack.rocketScience?.overall || 0}/100`}
                  type="feature"
                  shortcut="Click to explore"
                >
                  <Card 
                    className="glass hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full"
                    onClick={() => onStackSelect?.(stack)}
                  >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {categoryIcons[stack.category]}
                      <CardTitle className="text-lg">{stack.name}</CardTitle>
                    </div>
                    <Badge className={getRocketScienceBadgeColor(stack.rocketScience?.overall || 0)}>
                      {getRocketScienceBadge(stack.rocketScience?.overall || 0)}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {stack.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Swarm Science Metrics */}
                  {stack.rocketScience && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Swarm Science Score</span>
                        <span className={`font-bold ${getRocketScienceColor(stack.rocketScience.overall)}`}>
                          {stack.rocketScience.overall}/100
                        </span>
                      </div>
                      <Progress value={stack.rocketScience.overall} className="h-2" />
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between">
                          <span>Innovation:</span>
                          <span className={getRocketScienceColor(stack.rocketScience.innovation)}>
                            {stack.rocketScience.innovation}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Complexity:</span>
                          <span className={getRocketScienceColor(stack.rocketScience.complexity)}>
                            {stack.rocketScience.complexity}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cutting Edge:</span>
                          <span className={getRocketScienceColor(stack.rocketScience.cuttingEdge)}>
                            {stack.rocketScience.cuttingEdge}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Future Potential:</span>
                          <span className={getRocketScienceColor(stack.rocketScience.futurePotential)}>
                            {stack.rocketScience.futurePotential}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tech Stack Info */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Complexity:</span>
                      <Badge variant="outline" className="capitalize">
                        {stack.complexity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Performance:</span>
                      <span className="font-medium">{stack.performance}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Community:</span>
                      <span className="font-medium">{stack.community}/100</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {stack.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {stack.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{stack.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className="w-full group-hover:bg-primary/90 transition-all duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStackSelect?.(stack);
                      }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Rocket className="w-4 h-4" />
                      </motion.div>
                      Explore Stack
                    </Button>
                  </motion.div>
                </CardContent>
                  </Card>
                </SmartTooltip>
              </motion.div>
            ))}
          </motion.div>

          {stacks.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  y: [0, -5, 5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Rocket className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">No stacks found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters to see more technology stacks.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedLevel('all');
                    setSelectedCategory('all');
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Show All Stacks
                </Button>
              </motion.div>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
