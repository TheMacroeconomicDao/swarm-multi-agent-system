// 🛡️ ERROR BOUNDARY - Advanced Error Handling Component
// Revolutionary error boundary with beautiful UI and recovery options

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Bug, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);
    
    // Log error for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-destructive/5">
          <Card className="glass max-w-lg w-full p-8 text-center animate-fade-in">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold gradient-text mb-2">
                Oops! Something went wrong
              </h2>
              <p className="text-muted-foreground">
                The application encountered an unexpected error. Don't worry, we can recover from this.
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <Button
                onClick={this.handleRetry}
                className="w-full neuo glow"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="w-full glass"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Reload Application
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 mb-2">
                  <Bug className="w-4 h-4" />
                  Show Error Details
                </summary>
                <div className="bg-muted/50 p-4 rounded-lg text-xs font-mono overflow-auto max-h-40">
                  <div className="text-destructive font-semibold mb-2">
                    {this.state.error.name}: {this.state.error.message}
                  </div>
                  <div className="text-muted-foreground whitespace-pre-wrap">
                    {this.state.error.stack}
                  </div>
                </div>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// 🎯 HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode,
  onError?: (error: Error, errorInfo: ErrorInfo) => void
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback} onError={onError}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}