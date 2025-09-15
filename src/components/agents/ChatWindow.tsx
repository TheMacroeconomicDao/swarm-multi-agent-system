// 💬 CHAT WINDOW - Revolutionary Multi-Agent Communication Interface
// Real-time chat with AI agents using glassmorphism design

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AgentMessage, AgentRole } from '@/types/agents';
import { 
  Send, 
  Brain, 
  Users, 
  Code, 
  Activity, 
  Sparkles, 
  Zap,
  Bot,
  User,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface ChatWindowProps {
  isOpen: boolean;
  isMinimized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  sessionId: string;
  onSendMessage: (message: string) => void;
  messages: AgentMessage[];
  isProcessing: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  isOpen,
  isMinimized,
  onMinimize,
  onMaximize,
  onClose,
  sessionId,
  onSendMessage,
  messages,
  isProcessing
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const getAgentIcon = (role: AgentRole) => {
    switch (role) {
      case AgentRole.COORDINATOR: return <Users className="w-4 h-4" />;
      case AgentRole.ARCHITECT: return <Brain className="w-4 h-4" />;
      case AgentRole.DEVELOPER: return <Code className="w-4 h-4" />;
      case AgentRole.ANALYST: return <Activity className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getAgentColor = (role: AgentRole) => {
    switch (role) {
      case AgentRole.COORDINATOR: return 'bg-primary';
      case AgentRole.ARCHITECT: return 'bg-secondary';
      case AgentRole.DEVELOPER: return 'bg-accent';
      case AgentRole.ANALYST: return 'bg-muted';
      default: return 'bg-primary';
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'command': return 'border-l-blue-500';
      case 'response': return 'border-l-green-500';
      case 'collaboration': return 'border-l-purple-500';
      case 'status': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <Card className="glass h-full flex flex-col border-0 shadow-elevation">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-medium gradient-text">Agent Chat</h3>
              <p className="text-xs text-muted-foreground">Session: {sessionId.slice(-8)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={isMinimized ? onMaximize : onMinimize}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-muted/50"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-destructive/50 hover:text-destructive-foreground"
            >
              ×
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">
                      Start chatting with your AI agents!
                    </p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={`${message.id}-${index}`}
                      className={`flex items-start space-x-3 ${
                        message.agentId === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        message.agentId === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : getAgentColor(message.agentId as AgentRole)
                      }`}>
                        {message.agentId === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          getAgentIcon(message.agentId as AgentRole)
                        )}
                      </div>
                      <div className={`flex-1 ${message.agentId === 'user' ? 'text-right' : ''}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium">
                            {message.agentId === 'user' ? 'You' : message.agentId}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getMessageTypeColor(message.type)}`}
                          >
                            {message.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className={`p-3 rounded-lg border-l-4 ${
                          message.agentId === 'user' 
                            ? 'neuo-inset bg-primary/10 border-l-primary' 
                            : 'glass border-l-border'
                        } ${getMessageTypeColor(message.type)}`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.metadata?.tags && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {message.metadata.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border/10">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Message your agents..."
                  className="flex-1 px-4 py-3 rounded-lg neuo-inset bg-background border-0 focus:outline-none focus:glow transition-all text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={isProcessing}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isProcessing}
                  className="neuo glow px-4"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-background border-t-transparent" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Press Enter to send, Shift+Enter for new line</span>
                {isProcessing && (
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 animate-pulse" />
                    <span>Agents are thinking...</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};