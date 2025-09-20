// 🔧 ENVIRONMENT CONFIGURATION - Production Environment Settings
// Centralized configuration management for the multi-agent system

export interface EnvironmentConfig {
  openai: {
    apiKey: string;
    baseURL?: string;
    defaultModel: string;
    maxRetries: number;
    timeout: number;
    costOptimization: boolean;
  };
  swarm: {
    maxParallelExecutions: number;
    qualityThreshold: number;
    costOptimization: boolean;
  };
  cost: {
    dailyLimit: number;
    monthlyLimit: number;
    warningThreshold: number;
    criticalThreshold: number;
  };
  performance: {
    requestTimeout: number;
    maxRetries: number;
    rateLimitDelay: number;
  };
  development: {
    nodeEnv: string;
    appTitle: string;
    debugMode: boolean;
  };
}

export const environmentConfig: EnvironmentConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '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',
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4',
    maxRetries: parseInt(process.env.OPENAI_MAX_RETRIES || '3'),
    timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
    costOptimization: process.env.OPENAI_COST_OPTIMIZATION !== 'false'
  },
  swarm: {
    maxParallelExecutions: parseInt(process.env.SWARM_MAX_PARALLEL_EXECUTIONS || '5'),
    qualityThreshold: parseInt(process.env.SWARM_QUALITY_THRESHOLD || '75'),
    costOptimization: process.env.SWARM_COST_OPTIMIZATION !== 'false'
  },
  cost: {
    dailyLimit: parseFloat(process.env.DAILY_COST_LIMIT || '50'),
    monthlyLimit: parseFloat(process.env.MONTHLY_COST_LIMIT || '1000'),
    warningThreshold: parseInt(process.env.COST_WARNING_THRESHOLD || '80'),
    criticalThreshold: parseInt(process.env.COST_CRITICAL_THRESHOLD || '95')
  },
  performance: {
    requestTimeout: parseInt(process.env.REQUEST_TIMEOUT || '30000'),
    maxRetries: parseInt(process.env.MAX_RETRIES || '3'),
    rateLimitDelay: parseInt(process.env.RATE_LIMIT_DELAY || '100')
  },
  development: {
    nodeEnv: process.env.NODE_ENV || 'development',
    appTitle: process.env.VITE_APP_TITLE || 'Vibe Coding Multi-Agent System',
    debugMode: process.env.NODE_ENV === 'development'
  }
};

// Validation function
export function validateEnvironmentConfig(): void {
  const requiredFields = [
    'openai.apiKey'
  ];

  const missingFields: string[] = [];

  requiredFields.forEach(field => {
    const keys = field.split('.');
    let value: any = environmentConfig;
    
    for (const key of keys) {
      value = value[key];
    }
    
    if (!value || value === '') {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    console.warn('⚠️ Missing environment configuration:', missingFields);
  }

  // Validate OpenAI API key format
  if (environmentConfig.openai.apiKey && !environmentConfig.openai.apiKey.startsWith('sk-')) {
    console.warn('⚠️ Invalid OpenAI API key format');
  }

  // Validate numeric values
  if (environmentConfig.cost.dailyLimit <= 0) {
    console.warn('⚠️ Daily cost limit should be positive');
  }

  if (environmentConfig.swarm.maxParallelExecutions <= 0) {
    console.warn('⚠️ Max parallel executions should be positive');
  }
}

// Initialize validation
validateEnvironmentConfig();

// Export individual configs for convenience
export const openaiConfig = environmentConfig.openai;
export const swarmConfig = environmentConfig.swarm;
export const costConfig = environmentConfig.cost;
export const performanceConfig = environmentConfig.performance;
export const devConfig = environmentConfig.development;
