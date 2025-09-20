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

// Helper function to safely get environment variables
function getEnvVar(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key] || defaultValue;
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue;
  }
  return defaultValue;
}

export const environmentConfig: EnvironmentConfig = {
  openai: {
    apiKey: getEnvVar('VITE_OPENAI_API_KEY', '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'),
    baseURL: getEnvVar('VITE_OPENAI_BASE_URL', 'https://api.openai.com/v1'),
    defaultModel: getEnvVar('VITE_OPENAI_DEFAULT_MODEL', 'gpt-4'),
    maxRetries: parseInt(getEnvVar('VITE_OPENAI_MAX_RETRIES', '3')),
    timeout: parseInt(getEnvVar('VITE_OPENAI_TIMEOUT', '30000')),
    costOptimization: getEnvVar('VITE_OPENAI_COST_OPTIMIZATION', 'true') !== 'false'
  },
  swarm: {
    maxParallelExecutions: parseInt(getEnvVar('VITE_SWARM_MAX_PARALLEL_EXECUTIONS', '5')),
    qualityThreshold: parseInt(getEnvVar('VITE_SWARM_QUALITY_THRESHOLD', '75')),
    costOptimization: getEnvVar('VITE_SWARM_COST_OPTIMIZATION', 'true') !== 'false'
  },
  cost: {
    dailyLimit: parseFloat(getEnvVar('VITE_DAILY_COST_LIMIT', '50')),
    monthlyLimit: parseFloat(getEnvVar('VITE_MONTHLY_COST_LIMIT', '1000')),
    warningThreshold: parseInt(getEnvVar('VITE_COST_WARNING_THRESHOLD', '80')),
    criticalThreshold: parseInt(getEnvVar('VITE_COST_CRITICAL_THRESHOLD', '95'))
  },
  performance: {
    requestTimeout: parseInt(getEnvVar('VITE_REQUEST_TIMEOUT', '30000')),
    maxRetries: parseInt(getEnvVar('VITE_MAX_RETRIES', '3')),
    rateLimitDelay: parseInt(getEnvVar('VITE_RATE_LIMIT_DELAY', '100'))
  },
  development: {
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    appTitle: getEnvVar('VITE_APP_TITLE', 'Vibe Coding Multi-Agent System'),
    debugMode: getEnvVar('NODE_ENV', 'development') === 'development'
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
