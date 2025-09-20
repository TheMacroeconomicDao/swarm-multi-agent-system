// 🚀 ROCKET SCIENCE PAGE
// Showcase of cutting-edge technology stacks

import React from 'react';
import { RocketScienceStacks } from '@/components/tech-stack/RocketScienceStacks';
import { TechStack } from '@/types/tech-stack';

const RocketScience: React.FC = () => {
  const handleStackSelect = (stack: TechStack) => {
    console.log('Selected stack:', stack);
    // Here you could navigate to a detailed view or start project initialization
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <RocketScienceStacks onStackSelect={handleStackSelect} />
      </div>
    </div>
  );
};

export default RocketScience;
