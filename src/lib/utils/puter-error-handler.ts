// 🛡️ Puter.js Error Handler - Graceful API Error Management

interface PuterAPIError {
  status: number;
  message: string;
  code?: string;
}

class PuterErrorHandler {
  private static instance: PuterErrorHandler;
  private isInitialized = false;
  private apiAvailable = false;

  static getInstance(): PuterErrorHandler {
    if (!this.instance) {
      this.instance = new PuterErrorHandler();
    }
    return this.instance;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return this.apiAvailable;
    }

    try {
      // Check if Puter.js is available
      if (typeof window !== 'undefined' && (window as any).puter) {
        // Don't check health endpoint - it causes 401 errors
        // Just assume API is available if Puter.js is loaded
        this.apiAvailable = true;
        console.log('🎭 Puter.js available - Demo mode ready');
      } else {
        console.warn('📦 Puter.js not loaded - functionality may be limited');
        this.apiAvailable = false;
      }
    } catch (error) {
      console.warn('⚠️ Puter initialization check failed:', error);
      this.apiAvailable = false;
    }

    this.isInitialized = true;
    return this.apiAvailable;
  }

  handleAPIError(error: any): PuterAPIError {
    let processedError: PuterAPIError;

    if (error?.response) {
      // HTTP error response
      processedError = {
        status: error.response.status,
        message: this.getErrorMessage(error.response.status),
        code: error.response.data?.code
      };
    } else if (error?.status) {
      // Direct status error
      processedError = {
        status: error.status,
        message: this.getErrorMessage(error.status)
      };
    } else {
      // Generic error
      processedError = {
        status: 500,
        message: 'Unknown API error occurred'
      };
    }

    this.logError(processedError);
    return processedError;
  }

  private getErrorMessage(status: number): string {
    const errorMessages: { [key: number]: string } = {
      401: 'Authentication required - Please check your API credentials',
      403: 'Access forbidden - Insufficient permissions',
      404: 'API endpoint not found',
      429: 'Rate limit exceeded - Please try again later',
      500: 'Internal server error - Please try again',
      502: 'Service temporarily unavailable',
      503: 'Service maintenance mode'
    };

    return errorMessages[status] || `API error occurred (${status})`;
  }

  private logError(error: PuterAPIError): void {
    const emoji = this.getErrorEmoji(error.status);
    console.warn(`${emoji} Puter API Error [${error.status}]: ${error.message}`);
  }

  private getErrorEmoji(status: number): string {
    if (status === 401) return '🔐';
    if (status === 403) return '🚫';
    if (status === 404) return '🔍';
    if (status === 429) return '⏱️';
    if (status >= 500) return '🛠️';
    return '⚠️';
  }

  isAPIAvailable(): boolean {
    return this.apiAvailable;
  }

  // Mock responses for when API is unavailable
  getMockResponse(method: string, context?: any) {
    const mockResponses = {
      'chat': {
        choices: [{
          message: {
            content: `Mock response: I'm currently running in demo mode. The full AI capabilities will be available when connected to Puter API. Your request "${context?.prompt || 'example'}" has been received.`
          }
        }]
      },
      'models': {
        data: [
          { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Mock)' },
          { id: 'claude-3-opus', name: 'Claude 3 Opus (Mock)' },
          { id: 'claude-3-haiku', name: 'Claude 3 Haiku (Mock)' }
        ]
      }
    };

    return mockResponses[method as keyof typeof mockResponses] || { 
      success: true, 
      message: 'Mock response - API not available' 
    };
  }

  // Graceful degradation wrapper
  async withFallback<T>(
    apiCall: () => Promise<T>,
    fallback?: () => T
  ): Promise<T> {
    try {
      if (!this.apiAvailable) {
        throw new Error('API not available');
      }
      return await apiCall();
    } catch (error) {
      this.handleAPIError(error);
      
      if (fallback) {
        console.info('🔄 Using fallback response');
        return fallback();
      }
      
      throw error;
    }
  }
}

// Global error event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.toString().includes('puter') || 
        event.reason?.toString().includes('api.puter.com')) {
      console.warn('🔧 Puter API promise rejection handled gracefully');
      event.preventDefault(); // Prevent the error from being logged to console
    }
  });

  // Перехватываем и подавляем 401 ошибки от Puter API
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    const url = args[0]?.toString() || '';
    
    // Блокируем автоматические вызовы whoami от Puter
    if (url.includes('api.puter.com/whoami')) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        status: 401,
        statusText: 'Unauthorized',
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    try {
      const response = await originalFetch.apply(this, args);
      
      // Обрабатываем ошибки Puter API без вывода в консоль
      if (url.includes('api.puter.com') && !response.ok) {
        if (response.status === 401) {
          // Подавляем 401 ошибки полностью
          console.log('📡 Puter API: Работа в режиме без аутентификации');
          return response;
        }
        const errorHandler = PuterErrorHandler.getInstance();
        errorHandler.handleAPIError({ status: response.status });
      }
      
      return response;
    } catch (error) {
      if (url.includes('api.puter.com')) {
        const errorHandler = PuterErrorHandler.getInstance();
        errorHandler.handleAPIError(error);
        // Не пробрасываем ошибку дальше для Puter API
        return new Response(JSON.stringify({ error: 'API unavailable' }), {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw error;
    }
  };
}

export default PuterErrorHandler;
