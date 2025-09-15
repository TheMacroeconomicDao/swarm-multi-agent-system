// 🔔 NOTIFICATION SYSTEM - Revolutionary Real-time Feedback
// Ultra-modern toast notifications with glassmorphism design

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  XCircle, 
  X,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'agent';
  title: string;
  message: string;
  agentId?: string;
  timestamp: Date;
  duration?: number;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationSystemProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  maxNotifications?: number;
}

export const NotificationSystem: React.FC<NotificationSystemProps> = ({
  notifications,
  onDismiss,
  maxNotifications = 5
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Auto-dismiss notifications after their duration
    notifications.forEach((notification) => {
      if (notification.duration) {
        setTimeout(() => {
          onDismiss(notification.id);
        }, notification.duration);
      }
    });

    // Limit visible notifications
    setVisibleNotifications(notifications.slice(0, maxNotifications));
  }, [notifications, onDismiss, maxNotifications]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info': return <Info className="w-5 h-5 text-blue-500" />;
      case 'agent': return <Brain className="w-5 h-5 text-purple-500" />;
      default: return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-500/10';
      case 'error': return 'border-l-red-500 bg-red-500/10';
      case 'warning': return 'border-l-yellow-500 bg-yellow-500/10';
      case 'info': return 'border-l-blue-500 bg-blue-500/10';
      case 'agent': return 'border-l-purple-500 bg-purple-500/10';
      default: return 'border-l-primary bg-primary/10';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 w-96 space-y-3">
      {visibleNotifications.map((notification, index) => (
        <Card
          key={notification.id}
          className={`glass border-l-4 p-4 animate-fade-in shadow-elevation ${getNotificationColor(notification.type)}`}
          style={{
            animationDelay: `${index * 100}ms`,
            transform: `translateY(${index * 4}px)`,
            zIndex: 50 - index
          }}
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-sm gradient-text">
                  {notification.title}
                </h4>
                <div className="flex items-center space-x-2">
                  {notification.agentId && (
                    <Badge variant="outline" className="text-xs">
                      {notification.agentId}
                    </Badge>
                  )}
                  <Button
                    onClick={() => onDismiss(notification.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:bg-muted/50"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {notification.timestamp.toLocaleTimeString()}
                </span>
                
                {notification.actionButton && (
                  <Button
                    onClick={notification.actionButton.onClick}
                    variant="ghost"
                    size="sm"
                    className="h-7 px-3 text-xs neuo-inset hover:glow"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    {notification.actionButton.label}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      duration: notification.duration || (notification.type === 'error' ? 0 : 5000) // Errors don't auto-dismiss
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Utility functions for common notification types
  const showSuccess = (title: string, message: string, actionButton?: Notification['actionButton']) => {
    addNotification({ type: 'success', title, message, actionButton });
  };

  const showError = (title: string, message: string, actionButton?: Notification['actionButton']) => {
    addNotification({ type: 'error', title, message, actionButton });
  };

  const showWarning = (title: string, message: string, actionButton?: Notification['actionButton']) => {
    addNotification({ type: 'warning', title, message, actionButton });
  };

  const showInfo = (title: string, message: string, actionButton?: Notification['actionButton']) => {
    addNotification({ type: 'info', title, message, actionButton });
  };

  const showAgentNotification = (agentId: string, title: string, message: string, actionButton?: Notification['actionButton']) => {
    addNotification({ type: 'agent', title, message, agentId, actionButton });
  };

  return {
    notifications,
    addNotification,
    dismissNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showAgentNotification
  };
};