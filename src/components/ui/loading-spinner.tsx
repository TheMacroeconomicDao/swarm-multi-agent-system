// ⚡ LOADING SPINNER - Modern Loading Components
// Beautiful loading indicators with multiple variants

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Brain, Zap } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'brain' | 'pulse';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className,
  text
}) => {
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-primary animate-pulse',
                  size === 'sm' && 'w-1 h-1',
                  size === 'md' && 'w-2 h-2',
                  size === 'lg' && 'w-3 h-3',
                  size === 'xl' && 'w-4 h-4'
                )}
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        );

      case 'brain':
        return (
          <Brain 
            className={cn(
              'animate-pulse text-primary',
              sizeClasses[size]
            )}
          />
        );

      case 'pulse':
        return (
          <div
            className={cn(
              'rounded-full bg-primary animate-pulse',
              sizeClasses[size]
            )}
          />
        );

      default:
        return (
          <Loader2 
            className={cn(
              'animate-spin text-primary',
              sizeClasses[size]
            )}
          />
        );
    }
  };

  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      {renderSpinner()}
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

// 🎯 Full Screen Loading Component
interface FullScreenLoadingProps {
  title?: string;
  description?: string;
  variant?: LoadingSpinnerProps['variant'];
}

export const FullScreenLoading: React.FC<FullScreenLoadingProps> = ({
  title = 'Loading...',
  description,
  variant = 'brain'
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="glass p-8 rounded-xl text-center animate-fade-in">
        <LoadingSpinner size="xl" variant={variant} className="mb-4" />
        <h3 className="text-lg font-semibold gradient-text mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

// 🔄 Inline Loading Component
interface InlineLoadingProps {
  text?: string;
  size?: LoadingSpinnerProps['size'];
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text,
  size = 'sm',
  className
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size={size} />
      {text && (
        <span className="text-sm text-muted-foreground">
          {text}
        </span>
      )}
    </div>
  );
};