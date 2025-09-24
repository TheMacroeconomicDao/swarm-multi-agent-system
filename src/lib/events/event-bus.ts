// 🎯 EVENT BUS - Central Event Management System
// Advanced event-driven architecture for multi-agent communication

import { 
  AgentEvent, 
  AgentEventType, 
  EventHandler, 
  EventSubscription, 
  EventBusConfig,
  EventFilter,
  EventStore
} from '@/types/events';
import { InMemoryEventStore } from './event-store';

export class EventBus {
  private static instance: EventBus | null = null;
  private subscriptions = new Map<AgentEventType, EventSubscription[]>();
  private eventStore: EventStore;
  private config: EventBusConfig;
  private isProcessing = false;
  private eventQueue: AgentEvent[] = [];
  private processingInterval: NodeJS.Timeout | null = null;
  private eventCounter = 0; // Счетчик для гарантии уникальности ID событий

  constructor(eventStore: EventStore, config: EventBusConfig) {
    this.eventStore = eventStore;
    this.config = config;
    this.startProcessing();
  }

  // Singleton pattern
  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      // Create default instance if none exists
      EventBus.instance = new EventBus(
        new InMemoryEventStore(),
        {
          maxRetries: 3,
          retryDelay: 1000,
          batchSize: 10,
          flushInterval: 100,
          persistence: true,
          compression: false,
          encryption: false
        }
      );
    }
    return EventBus.instance;
  }

  // Subscribe to specific event types (formal AgentEventType)
  public subscribe(
    eventType: AgentEventType,
    handler: EventHandler,
    options?: {
      filter?: (event: AgentEvent) => boolean;
      priority?: number;
    }
  ): string;
  // Subscribe to any string event type
  public subscribe(
    eventType: string,
    handler: (data?: any) => void,
    options?: {
      filter?: (event: AgentEvent) => boolean;
      priority?: number;
    }
  ): string;
  public subscribe(
    eventType: AgentEventType | string,
    handler: EventHandler | ((data?: any) => void),
    options: {
      filter?: (event: AgentEvent) => boolean;
      priority?: number;
    } = {}
  ): string {
    const subscriptionId = this.generateSubscriptionId();
    const subscription: EventSubscription = {
      id: subscriptionId,
      eventType,
      handler,
      filter: options.filter,
      priority: options.priority || 0,
      active: true
    };

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }

    const subscriptions = this.subscriptions.get(eventType)!;
    subscriptions.push(subscription);
    
    // Sort by priority (higher priority first)
    subscriptions.sort((a, b) => b.priority - a.priority);

    console.log(`📡 Event subscription created: ${eventType} -> ${subscriptionId}`);
    return subscriptionId;
  }

  // Unsubscribe from events
  public unsubscribe(subscriptionId: string): boolean {
    for (const [eventType, subscriptions] of this.subscriptions.entries()) {
      const index = subscriptions.findIndex(sub => sub.id === subscriptionId);
      if (index !== -1) {
        subscriptions.splice(index, 1);
        console.log(`📡 Event subscription removed: ${eventType} -> ${subscriptionId}`);
        return true;
      }
    }
    return false;
  }

  // Publish event to the bus (formal AgentEvent)
  public async publish(event: AgentEvent): Promise<void>;
  // Publish simple event (string type with data)
  public async publish(eventType: string, data?: any): Promise<void>;
  public async publish(eventOrType: AgentEvent | string, data?: any): Promise<void> {
    try {
      let event: AgentEvent;
      
      if (typeof eventOrType === 'string') {
        // Create AgentEvent from simple parameters with improved unique ID generation
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 12); // Увеличена длина случайной части
        const counter = this.eventCounter++; // Добавлен счетчик для гарантии уникальности
        
        event = {
          id: `event_${timestamp}_${counter}_${random}`,
          type: eventOrType as any, // Allow any string type for flexibility
          source: data?.source || 'system',
          target: data?.target,
          timestamp,
          correlationId: data?.correlationId || `corr_${timestamp}_${random}`,
          version: 1,
          metadata: data?.metadata,
          payload: data || {}
        };
      } else {
        event = eventOrType;
      }

      // Add to event store for persistence
      if (this.config.persistence) {
        await this.eventStore.append(event);
      }

      // Add to processing queue
      this.eventQueue.push(event);

      console.log(`📤 Event published: ${event.type} from ${event.source}`);
    } catch (error) {
      console.error('Failed to publish event:', error);
      throw error;
    }
  }

  // Publish multiple events in batch
  public async publishBatch(events: AgentEvent[]): Promise<void> {
    try {
      if (this.config.persistence) {
        for (const event of events) {
          await this.eventStore.append(event);
        }
      }

      this.eventQueue.push(...events);
      console.log(`📤 Batch published: ${events.length} events`);
    } catch (error) {
      console.error('Failed to publish event batch:', error);
      throw error;
    }
  }

  // Get events from store
  public async getEvents(filter: EventFilter): Promise<AgentEvent[]> {
    return this.eventStore.getEvents(filter);
  }

  // Get events by correlation ID
  public async getEventsByCorrelationId(correlationId: string): Promise<AgentEvent[]> {
    return this.eventStore.getEventsByCorrelationId(correlationId);
  }

  // Start processing events
  private startProcessing(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    this.processingInterval = setInterval(() => {
      this.processEventQueue();
    }, this.config.flushInterval);
  }

  // Process event queue
  private async processEventQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const batchSize = Math.min(this.config.batchSize, this.eventQueue.length);
      const batch = this.eventQueue.splice(0, batchSize);

      await this.processEventBatch(batch);
    } catch (error) {
      console.error('Error processing event queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Process batch of events
  private async processEventBatch(events: AgentEvent[]): Promise<void> {
    const promises = events.map(event => this.processEvent(event));
    await Promise.allSettled(promises);
  }

  // Process individual event
  private async processEvent(event: AgentEvent): Promise<void> {
    const subscriptions = this.subscriptions.get(event.type) || [];
    
    if (subscriptions.length === 0) {
      console.log(`⚠️ No subscribers for event type: ${event.type}`);
      return;
    }

    const activeSubscriptions = subscriptions.filter(sub => sub.active);
    
    for (const subscription of activeSubscriptions) {
      try {
        // Apply filter if exists
        if (subscription.filter && !subscription.filter(event)) {
          continue;
        }

        // Execute handler - check if it's a simple handler or formal EventHandler
        if (subscription.handler.length === 1) {
          // Formal EventHandler that expects full AgentEvent
          await subscription.handler(event);
        } else {
          // Simple handler that expects just data
          await (subscription.handler as any)(event.payload);
        }
        console.log(`✅ Event processed: ${event.type} by ${subscription.id}`);
      } catch (error) {
        console.error(`❌ Error processing event ${event.type} by ${subscription.id}:`, error);
        
        // Retry logic could be implemented here
        if (this.config.maxRetries > 0) {
          await this.retryEventProcessing(event, subscription);
        }
      }
    }
  }

  // Retry event processing
  private async retryEventProcessing(event: AgentEvent, subscription: EventSubscription): Promise<void> {
    let retries = 0;
    
    while (retries < this.config.maxRetries) {
      try {
        await new Promise(resolve => setTimeout(resolve, this.config.retryDelay * (retries + 1)));
        await subscription.handler(event);
        console.log(`✅ Event retry successful: ${event.type} by ${subscription.id}`);
        return;
      } catch (error) {
        retries++;
        console.error(`❌ Event retry ${retries}/${this.config.maxRetries} failed:`, error);
      }
    }
    
    console.error(`💥 Event processing failed after ${this.config.maxRetries} retries: ${event.type}`);
  }

  // Generate unique subscription ID
  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get subscription statistics
  public getStats(): {
    totalSubscriptions: number;
    subscriptionsByType: Record<string, number>;
    queueSize: number;
    isProcessing: boolean;
  } {
    const subscriptionsByType: Record<string, number> = {};
    let totalSubscriptions = 0;

    for (const [eventType, subscriptions] of this.subscriptions.entries()) {
      const activeCount = subscriptions.filter(sub => sub.active).length;
      subscriptionsByType[eventType] = activeCount;
      totalSubscriptions += activeCount;
    }

    return {
      totalSubscriptions,
      subscriptionsByType,
      queueSize: this.eventQueue.length,
      isProcessing: this.isProcessing
    };
  }

  // Cleanup resources
  public destroy(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
    
    this.subscriptions.clear();
    this.eventQueue = [];
    this.isProcessing = false;
    
    console.log('🧹 EventBus destroyed');
  }
}

// Factory function for creating EventBus
export function createEventBus(
  eventStore: EventStore,
  config: Partial<EventBusConfig> = {}
): EventBus {
  const defaultConfig: EventBusConfig = {
    maxRetries: 3,
    retryDelay: 1000,
    batchSize: 10,
    flushInterval: 100,
    persistence: true,
    compression: false,
    encryption: false
  };

  const finalConfig = { ...defaultConfig, ...config };
  return new EventBus(eventStore, finalConfig);
}
