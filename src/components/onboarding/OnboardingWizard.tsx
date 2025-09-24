import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Code, 
  Brain, 
  Users, 
  Settings, 
  Microscope,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  Zap,
  Shield,
  Rocket,
  CheckCircle,
  Star
} from "lucide-react";

interface UserRole {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  features: string[];
  recommendations: string[];
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface OnboardingWizardProps {
  isOpen: boolean;
  onComplete: (userData: UserData) => void;
  onClose: () => void;
}

interface UserData {
  role: string;
  experience: string;
  interests: string[];
  goals: string[];
  preferredPath: string;
}

const roles: UserRole[] = [
  {
    id: 'developer',
    title: 'Software Developer',
    description: 'Build and integrate AI-powered applications',
    icon: <Code className="w-6 h-6" />,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    features: ['Code Examples', 'API Documentation', 'SDKs', 'Integration Guides'],
    recommendations: ['Start with Agent Dashboard', 'Explore API docs', 'Try live demo']
  },
  {
    id: 'researcher',
    title: 'AI Researcher',
    description: 'Explore swarm intelligence and multi-agent systems',
    icon: <Brain className="w-6 h-6" />,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    features: ['Research Papers', 'Algorithms', 'Experiments', 'Data Analysis'],
    recommendations: ['Study PSO/ACO algorithms', 'Analyze swarm metrics', 'Research papers']
  },
  {
    id: 'architect',
    title: 'System Architect',
    description: 'Design scalable multi-agent architectures',
    icon: <Settings className="w-6 h-6" />,
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    features: ['Architecture Diagrams', 'Scaling Guides', 'Best Practices', 'Performance'],
    recommendations: ['Review architecture', 'Study scalability', 'Performance metrics']
  },
  {
    id: 'manager',
    title: 'Product Manager',
    description: 'Understand business value and ROI',
    icon: <TrendingUp className="w-6 h-6" />,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/20',
    features: ['ROI Metrics', 'Business Cases', 'Dashboards', 'Reports'],
    recommendations: ['View business metrics', 'Cost analysis', 'Success stories']
  },
  {
    id: 'scientist',
    title: 'Research Scientist',
    description: 'Advanced research in rocket science applications',
    icon: <Microscope className="w-6 h-6" />,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    features: ['Scientific Computing', 'Simulations', 'Publications', 'Collaboration'],
    recommendations: ['Advanced algorithms', 'Scientific computing', 'Collaboration tools']
  },
  {
    id: 'student',
    title: 'Student/Learner',
    description: 'Learn about AI and swarm intelligence',
    icon: <Users className="w-6 h-6" />,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/20',
    features: ['Tutorials', 'Learning Paths', 'Examples', 'Community'],
    recommendations: ['Start with basics', 'Interactive tutorials', 'Join community']
  }
];

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onComplete,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<Partial<UserData>>({});
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to the Future!',
      description: 'Let\'s personalize your experience with our AI-powered swarm system',
      component: <WelcomeStep />
    },
    {
      id: 'role',
      title: 'Choose Your Role',
      description: 'Help us customize the perfect experience for you',
      component: <RoleSelectionStep 
        roles={roles} 
        selectedRole={selectedRole}
        onRoleSelect={setSelectedRole}
      />
    },
    {
      id: 'experience',
      title: 'Experience Level',
      description: 'Tell us about your background',
      component: <ExperienceStep 
        onExperienceSelect={(exp) => setUserData({...userData, experience: exp})}
        selected={userData.experience}
      />
    },
    {
      id: 'goals',
      title: 'Your Goals',
      description: 'What do you want to achieve?',
      component: <GoalsStep 
        role={selectedRole}
        onGoalsSelect={(goals) => setUserData({...userData, goals})}
        selected={userData.goals || []}
      />
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Your personalized experience is ready',
      component: <CompleteStep 
        role={selectedRole}
        userData={userData}
      />
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const completeUserData: UserData = {
        role: selectedRole?.id || 'developer',
        experience: userData.experience || 'intermediate',
        interests: userData.interests || [],
        goals: userData.goals || [],
        preferredPath: selectedRole?.recommendations[0] || 'dashboard'
      };
      onComplete(completeUserData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedRole !== null;
      case 2: return userData.experience !== undefined;
      case 3: return userData.goals && userData.goals.length > 0;
      default: return true;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <Card className="glass p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center gap-2 mb-4"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Rocket className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">
                AI Swarm System
              </span>
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <Badge variant="outline">
                {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Content */}
          <div className="min-h-[400px] mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].component}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={currentStep === steps.length - 1 ? () => onComplete(userData as UserData) : handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

// Step Components
const WelcomeStep = () => (
  <div className="text-center py-8">
    <motion.div
      className="mb-6"
      animate={{
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      🚀
    </motion.div>
    <h3 className="text-2xl font-bold mb-4">
      World's Most Advanced AI-Powered Swarm System!
    </h3>
    <p className="text-lg text-muted-foreground mb-6">
      Experience revolutionary multi-agent intelligence with 400+ AI models, 
      collective learning, and emergent behavior.
    </p>
    <div className="flex justify-center gap-4">
      <Badge className="bg-primary/20 text-primary">400+ AI Models</Badge>
      <Badge className="bg-secondary/20 text-secondary">Byzantine Fault Tolerance</Badge>
      <Badge className="bg-accent/20 text-accent">Collective Intelligence</Badge>
    </div>
  </div>
);

const RoleSelectionStep: React.FC<{
  roles: UserRole[];
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
}> = ({ roles, selectedRole, onRoleSelect }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {roles.map((role) => (
      <motion.div
        key={role.id}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card
          className={`p-4 cursor-pointer transition-all ${
            selectedRole?.id === role.id 
              ? `${role.bgColor} border-2 border-current` 
              : 'hover:bg-surface/50'
          }`}
          onClick={() => onRoleSelect(role)}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${role.bgColor}`}>
              <div className={role.color}>
                {role.icon}
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="font-semibold mb-1">{role.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {role.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {role.features.slice(0, 2).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            
            {selectedRole?.id === role.id && (
              <CheckCircle className="w-5 h-5 text-primary" />
            )}
          </div>
        </Card>
      </motion.div>
    ))}
  </div>
);

const ExperienceStep: React.FC<{
  onExperienceSelect: (exp: string) => void;
  selected?: string;
}> = ({ onExperienceSelect, selected }) => {
  const experiences = [
    { id: 'beginner', label: 'Beginner', desc: 'New to AI/ML and swarm systems' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Some experience with AI/ML' },
    { id: 'advanced', label: 'Advanced', desc: 'Expert in AI/ML and distributed systems' }
  ];

  return (
    <div className="space-y-4">
      {experiences.map((exp) => (
        <Card
          key={exp.id}
          className={`p-4 cursor-pointer transition-all ${
            selected === exp.id ? 'bg-primary/20 border-primary' : 'hover:bg-surface/50'
          }`}
          onClick={() => onExperienceSelect(exp.id)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{exp.label}</h4>
              <p className="text-sm text-muted-foreground">{exp.desc}</p>
            </div>
            {selected === exp.id && <CheckCircle className="w-5 h-5 text-primary" />}
          </div>
        </Card>
      ))}
    </div>
  );
};

const GoalsStep: React.FC<{
  role: UserRole | null;
  onGoalsSelect: (goals: string[]) => void;
  selected: string[];
}> = ({ role, onGoalsSelect, selected }) => {
  const goals = role ? role.recommendations : [
    'Learn swarm intelligence',
    'Build AI applications',
    'Research algorithms',
    'Scale systems'
  ];

  const toggleGoal = (goal: string) => {
    const newGoals = selected.includes(goal)
      ? selected.filter(g => g !== goal)
      : [...selected, goal];
    onGoalsSelect(newGoals);
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-muted-foreground mb-6">
        Select your primary goals (choose multiple):
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {goals.map((goal) => (
          <Card
            key={goal}
            className={`p-3 cursor-pointer transition-all ${
              selected.includes(goal) ? 'bg-primary/20 border-primary' : 'hover:bg-surface/50'
            }`}
            onClick={() => toggleGoal(goal)}
          >
            <div className="flex items-center gap-3">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-medium">{goal}</span>
              {selected.includes(goal) && (
                <CheckCircle className="w-4 h-4 text-primary ml-auto" />
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const CompleteStep: React.FC<{
  role: UserRole | null;
  userData: Partial<UserData>;
}> = ({ role }) => (
  <div className="text-center py-8">
    <motion.div
      className="mb-6"
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 360]
      }}
      transition={{
        duration: 2,
        ease: "easeInOut"
      }}
    >
      <div className="w-20 h-20 mx-auto bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
        <Star className="w-10 h-10 text-white" />
      </div>
    </motion.div>
    
    <h3 className="text-2xl font-bold mb-4">
      Perfect! Your {role?.title} experience is ready! 
    </h3>
    <p className="text-lg text-muted-foreground mb-6">
      We've customized the interface specifically for your role and goals.
    </p>
    
    {role && (
      <div className="bg-surface/50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-2">Personalized for you:</h4>
        <div className="flex justify-center gap-2">
          {role.features.slice(0, 3).map((feature) => (
            <Badge key={feature} variant="outline">
              {feature}
            </Badge>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default OnboardingWizard;

