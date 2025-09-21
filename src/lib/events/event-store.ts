// 🎯 EVENT STORE - Persistent Event Storage
// Advanced event persistence with indexing and querying capabilities

import { 
  AgentEvent, 
  EventFilter, 
  EventStore as IEventStore 
} from '@/types/events';

export class InMemoryEventStore implements IEventStore {
  private events: AgentEvent[] = [];
  private indexByType = new Map<string, Set<number>>();
  private indexBySource = new Map<string, Set<number>>();
  private indexByTarget = new Map<string, Set<number>>();
  private indexByCorrelationId = new Map<string, Set<number>>();
  private indexByTimestamp = new Map<number, Set<number>>();

  async append(event: AgentEvent): Promise<void> {
    const index = this.events.length;
    this.events.push(event);

    // Update indexes
    this.updateIndexes(event, index);
    
    console.log(`💾 Event stored: ${event.type} at index ${index}`);
  }

  async getEvents(filter: EventFilter): Promise<AgentEvent[]> {
    let indices = new Set<number>();

    // Start with all events
    if (this.events.length === 0) {
      return [];
    }

    // Apply filters
    if (filter.eventTypes && filter.eventTypes.length > 0) {
      const typeIndices = new Set<number>();
      for (const eventType of filter.eventTypes) {
        const typeSet = this.indexByType.get(eventType);
        if (typeSet) {
          typeSet.forEach(index => typeIndices.add(index));
        }
      }
      indices = typeIndices;
    } else {
      // If no event types filter, start with all indices
      indices = new Set(this.events.map((_, index) => index));
    }

    // Filter by source
    if (filter.source) {
      const sourceSet = this.indexBySource.get(filter.source);
      if (sourceSet) {
        indices = new Set([...indices].filter(index => sourceSet.has(index)));
      } else {
        indices.clear();
      }
    }

    // Filter by target
    if (filter.target) {
      const targetSet = this.indexByTarget.get(filter.target);
      if (targetSet) {
        indices = new Set([...indices].filter(index => targetSet.has(index)));
      } else {
        indices.clear();
      }
    }

    // Filter by correlation ID
    if (filter.correlationId) {
      const correlationSet = this.indexByCorrelationId.get(filter.correlationId);
      if (correlationSet) {
        indices = new Set([...indices].filter(index => correlationSet.has(index)));
      } else {
        indices.clear();
      }
    }

    // Filter by timestamp range
    if (filter.fromTimestamp || filter.toTimestamp) {
      indices = new Set([...indices].filter(index => {
        const event = this.events[index];
        if (filter.fromTimestamp && event.timestamp < filter.fromTimestamp) {
          return false;
        }
        if (filter.toTimestamp && event.timestamp > filter.toTimestamp) {
          return false;
        }
        return true;
      }));
    }

    // Convert indices to events
    let result = Array.from(indices).map(index => this.events[index]);

    // Sort by timestamp (newest first)
    result.sort((a, b) => b.timestamp - a.timestamp);

    // Apply pagination
    if (filter.offset) {
      result = result.slice(filter.offset);
    }
    if (filter.limit) {
      result = result.slice(0, filter.limit);
    }

    return result;
  }

  async getEventById(id: string): Promise<AgentEvent | null> {
    const event = this.events.find(e => e.id === id);
    return event || null;
  }

  async getEventsByCorrelationId(correlationId: string): Promise<AgentEvent[]> {
    const correlationSet = this.indexByCorrelationId.get(correlationId);
    if (!correlationSet) {
      return [];
    }

    const events = Array.from(correlationSet)
      .map(index => this.events[index])
      .sort((a, b) => a.timestamp - b.timestamp);

    return events;
  }

  async deleteEvents(olderThan: Date): Promise<number> {
    const cutoffTimestamp = olderThan.getTime();
    const initialCount = this.events.length;

    // Find events to delete
    const eventsToDelete = this.events
      .map((event, index) => ({ event, index }))
      .filter(({ event }) => event.timestamp < cutoffTimestamp)
      .sort((a, b) => b.index - a.index); // Sort by index descending for safe deletion

    // Delete events and update indexes
    for (const { index } of eventsToDelete) {
      this.events.splice(index, 1);
      this.rebuildIndexes();
    }

    const deletedCount = initialCount - this.events.length;
    console.log(`🗑️ Deleted ${deletedCount} events older than ${olderThan.toISOString()}`);
    
    return deletedCount;
  }

  private updateIndexes(event: AgentEvent, index: number): void {
    // Index by event type
    if (!this.indexByType.has(event.type)) {
      this.indexByType.set(event.type, new Set());
    }
    this.indexByType.get(event.type)!.add(index);

    // Index by source
    if (!this.indexBySource.has(event.source)) {
      this.indexBySource.set(event.source, new Set());
    }
    this.indexBySource.get(event.source)!.add(index);

    // Index by target
    if (event.target) {
      if (!this.indexByTarget.has(event.target)) {
        this.indexByTarget.set(event.target, new Set());
      }
      this.indexByTarget.get(event.target)!.add(index);
    }

    // Index by correlation ID
    if (!this.indexByCorrelationId.has(event.correlationId)) {
      this.indexByCorrelationId.set(event.correlationId, new Set());
    }
    this.indexByCorrelationId.get(event.correlationId)!.add(index);

    // Index by timestamp (rounded to minute for efficiency)
    const timestampMinute = Math.floor(event.timestamp / 60000) * 60000;
    if (!this.indexByTimestamp.has(timestampMinute)) {
      this.indexByTimestamp.set(timestampMinute, new Set());
    }
    this.indexByTimestamp.get(timestampMinute)!.add(index);
  }

  private rebuildIndexes(): void {
    // Clear all indexes
    this.indexByType.clear();
    this.indexBySource.clear();
    this.indexByTarget.clear();
    this.indexByCorrelationId.clear();
    this.indexByTimestamp.clear();

    // Rebuild indexes
    this.events.forEach((event, index) => {
      this.updateIndexes(event, index);
    });
  }

  // Get statistics
  getStats(): {
    totalEvents: number;
    eventsByType: Record<string, number>;
    eventsBySource: Record<string, number>;
    oldestEvent: Date | null;
    newestEvent: Date | null;
  } {
    const eventsByType: Record<string, number> = {};
    const eventsBySource: Record<string, number> = {};
    
    let oldestTimestamp = Number.MAX_SAFE_INTEGER;
    let newestTimestamp = 0;

    for (const event of this.events) {
      // Count by type
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      
      // Count by source
      eventsBySource[event.source] = (eventsBySource[event.source] || 0) + 1;
      
      // Track timestamps
      if (event.timestamp < oldestTimestamp) {
        oldestTimestamp = event.timestamp;
      }
      if (event.timestamp > newestTimestamp) {
        newestTimestamp = event.timestamp;
      }
    }

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySource,
      oldestEvent: this.events.length > 0 ? new Date(oldestTimestamp) : null,
      newestEvent: this.events.length > 0 ? new Date(newestTimestamp) : null
    };
  }

  // Clear all events
  clear(): void {
    this.events = [];
    this.indexByType.clear();
    this.indexBySource.clear();
    this.indexByTarget.clear();
    this.indexByCorrelationId.clear();
    this.indexByTimestamp.clear();
    
    console.log('🧹 Event store cleared');
  }
}

// Redis-based Event Store (for production use)
export class RedisEventStore implements IEventStore {
  private redis: any; // Redis client
  private keyPrefix = 'agent_events:';

  constructor(redisClient: any) {
    this.redis = redisClient;
  }

  async append(event: AgentEvent): Promise<void> {
    const key = `${this.keyPrefix}${event.id}`;
    const eventData = JSON.stringify(event);
    
    await this.redis.setex(key, 86400 * 7, eventData); // 7 days TTL
    
    // Add to indexes
    await this.redis.sadd(`${this.keyPrefix}type:${event.type}`, event.id);
    await this.redis.sadd(`${this.keyPrefix}source:${event.source}`, event.id);
    if (event.target) {
      await this.redis.sadd(`${this.keyPrefix}target:${event.target}`, event.id);
    }
    await this.redis.sadd(`${this.keyPrefix}correlation:${event.correlationId}`, event.id);
    
    console.log(`💾 Event stored in Redis: ${event.type}`);
  }

  async getEvents(filter: EventFilter): Promise<AgentEvent[]> {
    // Implementation would use Redis sets and sorted sets for efficient querying
    // This is a simplified version
    const eventIds = new Set<string>();
    
    // Get event IDs based on filters
    if (filter.eventTypes && filter.eventTypes.length > 0) {
      for (const eventType of filter.eventTypes) {
        const ids = await this.redis.smembers(`${this.keyPrefix}type:${eventType}`);
        ids.forEach((id: string) => eventIds.add(id));
      }
    }
    
    // Apply other filters...
    
    // Fetch events
    const events: AgentEvent[] = [];
    for (const id of eventIds) {
      const eventData = await this.redis.get(`${this.keyPrefix}${id}`);
      if (eventData) {
        events.push(JSON.parse(eventData));
      }
    }
    
    return events.sort((a, b) => b.timestamp - a.timestamp);
  }

  async getEventById(id: string): Promise<AgentEvent | null> {
    const eventData = await this.redis.get(`${this.keyPrefix}${id}`);
    return eventData ? JSON.parse(eventData) : null;
  }

  async getEventsByCorrelationId(correlationId: string): Promise<AgentEvent[]> {
    const eventIds = await this.redis.smembers(`${this.keyPrefix}correlation:${correlationId}`);
    const events: AgentEvent[] = [];
    
    for (const id of eventIds) {
      const eventData = await this.redis.get(`${this.keyPrefix}${id}`);
      if (eventData) {
        events.push(JSON.parse(eventData));
      }
    }
    
    return events.sort((a, b) => a.timestamp - b.timestamp);
  }

  async deleteEvents(olderThan: Date): Promise<number> {
    // Implementation would scan and delete old events
    // This is a simplified version
    return 0;
  }
}
