// 🔧 APPLICATION CONSTANTS - Centralized configuration
// No more hardcoded values scattered throughout the codebase!

export const APP_CONFIG = {
  // 🌐 External URLs
  PUTER_WEBSITE: 'https://puter.com',
  PUTER_AI_MODELS_URL: 'https://puter.com/ai-models',
  PUTER_JS_CDN: 'https://js.puter.com/v2/',
  PUTER_API_BASE: 'https://api.puter.com',
  
  // 📚 Documentation URLs
  REACT_DOCS: 'https://react.dev/learn',
  REACT_GITHUB: 'https://github.com/facebook/react',
  STIGMERGY_WIKI: 'https://en.wikipedia.org/wiki/Stigmergy',
  
  // ⏱️ Timing Configuration
  TIMEOUTS: {
    DEFAULT_REQUEST: 30000,      // 30 seconds
    AI_REQUEST: 30000,           // 30 seconds  
    TASK_PROCESSING: 30000,      // 30 seconds
    CACHE_TIMEOUT: 300000,       // 5 minutes
    PATTERN_DETECTION: 300000,   // 5 minutes
    LEARNING_INTERVAL: 30000,    // 30 seconds
    HEALTH_CHECK: 5000,          // 5 seconds
    CONSENSUS_TIMEOUT: 30000,    // 30 seconds
  },
  
  // 🎯 Performance Thresholds
  PERFORMANCE: {
    FAST_RESPONSE_THRESHOLD: 3000,     // 3 seconds
    MAX_AGENT_DELAY: 3000,             // 3 seconds
    MIN_SUCCESS_RATE: 0.7,             // 70%
    MAX_FAILURE_THRESHOLD: 5,          // 5 failures
  },
  
  // 🤖 Agent Configuration
  AGENTS: {
    MAX_THOUGHT_HISTORY: 50,
    MAX_MESSAGE_HISTORY: 100,
    DEFAULT_CONFIDENCE: 0.85,
    MIN_CONFIDENCE: 0.5,
    MAX_CONFIDENCE: 1.0,
  },
  
  // 🐝 Swarm Configuration
  SWARM: {
    MIN_AGENTS: 1,
    MAX_AGENTS: 20,
    DEFAULT_BATCH_SIZE: 10,
    MAX_RETRIES: 3,
    FAILOVER_THRESHOLD: 0.7,
  },
  
  // 🎨 UI Configuration
  UI: {
    ANIMATION_DURATION: 300,     // ms
    DEBOUNCE_DELAY: 300,         // ms
    MAX_CONSOLE_LINES: 20,
    DEFAULT_PAGE_SIZE: 10,
  },
  
  // 📊 Metrics
  METRICS: {
    UPDATE_INTERVAL: 1000,       // 1 second
    HISTORY_RETENTION: 86400000, // 24 hours
    MAX_EVENTS_STORED: 1000,
  },
  
  // 🔐 Security
  SECURITY: {
    MAX_REQUEST_SIZE: 1048576,   // 1MB
    RATE_LIMIT_WINDOW: 60000,    // 1 minute
    MAX_REQUESTS_PER_WINDOW: 100,
  }
} as const;

// 🎨 Theme and Design Constants
export const DESIGN_SYSTEM = {
  // Colors (consistent with Tailwind theme)
  COLORS: {
    PRIMARY: 'rgb(59, 130, 246)',      // blue-500
    SECONDARY: 'rgb(147, 51, 234)',    // purple-600
    SUCCESS: 'rgb(34, 197, 94)',       // green-500
    WARNING: 'rgb(251, 191, 36)',      // yellow-400
    ERROR: 'rgb(239, 68, 68)',         // red-500
    INFO: 'rgb(59, 130, 246)',         // blue-500
  },
  
  // Spacing
  SPACING: {
    XS: '0.25rem',    // 4px
    SM: '0.5rem',     // 8px
    MD: '1rem',       // 16px
    LG: '1.5rem',     // 24px
    XL: '2rem',       // 32px
  },
  
  // Border radius
  RADIUS: {
    SM: '0.25rem',    // 4px
    MD: '0.5rem',     // 8px
    LG: '0.75rem',    // 12px
    XL: '1rem',       // 16px
  },
  
  // Z-index layers
  Z_INDEX: {
    BASE: 1,
    DROPDOWN: 1000,
    STICKY: 1020,
    FIXED: 1030,
    MODAL_BACKDROP: 1040,
    MODAL: 1050,
    POPOVER: 1060,
    TOOLTIP: 1070,
    NOTIFICATION: 1080,
  }
} as const;

// 🌟 Feature Flags
export const FEATURES = {
  ENABLE_REAL_AI: true,
  ENABLE_DEMO_MODE: true,
  ENABLE_ANALYTICS: false,
  ENABLE_EXPERIMENTAL_FEATURES: false,
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
} as const;

// 📱 Device Detection
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// 🎯 Default Values
export const DEFAULTS = {
  LANGUAGE: 'ru',
  TIMEZONE: 'Europe/Moscow',
  CURRENCY: 'RUB',
  DATE_FORMAT: 'DD.MM.YYYY',
  TIME_FORMAT: 'HH:mm',
} as const;

// Type exports for better TypeScript support
export type AppConfig = typeof APP_CONFIG;
export type DesignSystem = typeof DESIGN_SYSTEM;
export type Features = typeof FEATURES;

