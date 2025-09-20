// 🧠 CONTEXT MANAGER - Advanced Context Management and Optimization
// Intelligent context compression and management for cost optimization

export interface ContextItem {
  id: string;
  content: string;
  importance: number; // 0-1
  timestamp: Date;
  accessCount: number;
  lastAccessed: Date;
  compressed: boolean;
  size: number; // in tokens
  tags: string[];
  dependencies: string[];
}

export interface ContextSummary {
  totalItems: number;
  totalSize: number;
  compressedSize: number;
  compressionRatio: number;
  importantItems: ContextItem[];
  recentItems: ContextItem[];
  frequentlyAccessed: ContextItem[];
}

export interface SwarmContext {
  sessionId: string;
  taskId: string;
  agents: string[];
  sharedKnowledge: Map<string, any>;
  conversationHistory: ContextItem[];
  codeContext: ContextItem[];
  requirements: ContextItem[];
  constraints: ContextItem[];
  decisions: ContextItem[];
  metadata: Record<string, any>;
  lastUpdated: Date;
}

export class ContextManager {
  private contexts: Map<string, SwarmContext> = new Map();
  private compressionThreshold: number = 1000; // tokens
  private maxContextSize: number = 4000; // tokens
  private importanceThreshold: number = 0.7;
  private accessThreshold: number = 3;

  constructor() {
    this.initializeContextManager();
  }

  // 🧠 Context Management
  public createSwarmContext(sessionId: string, taskId: string, agents: string[]): SwarmContext {
    const context: SwarmContext = {
      sessionId,
      taskId,
      agents,
      sharedKnowledge: new Map(),
      conversationHistory: [],
      codeContext: [],
      requirements: [],
      constraints: [],
      decisions: [],
      metadata: {},
      lastUpdated: new Date()
    };

    this.contexts.set(sessionId, context);
    return context;
  }

  public getSwarmContext(sessionId: string): SwarmContext | null {
    return this.contexts.get(sessionId) || null;
  }

  public addContextItem(
    sessionId: string,
    category: 'conversation' | 'code' | 'requirements' | 'constraints' | 'decisions',
    content: string,
    importance: number = 0.5,
    tags: string[] = []
  ): string {
    const context = this.contexts.get(sessionId);
    if (!context) {
      throw new Error(`Context for session ${sessionId} not found`);
    }

    const item: ContextItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      importance,
      timestamp: new Date(),
      accessCount: 0,
      lastAccessed: new Date(),
      compressed: false,
      size: this.estimateTokenCount(content),
      tags,
      dependencies: []
    };

    context[`${category}History`] = [
      ...(context[`${category}History`] as ContextItem[] || []),
      item
    ];
    
    context.lastUpdated = new Date();

    // Auto-compress if needed
    this.autoCompressContext(sessionId);

    return item.id;
  }

  public getContextSummary(sessionId: string): ContextSummary {
    const context = this.contexts.get(sessionId);
    if (!context) {
      throw new Error(`Context for session ${sessionId} not found`);
    }

    const allItems = [
      ...context.conversationHistory,
      ...context.codeContext,
      ...context.requirements,
      ...context.constraints,
      ...context.decisions
    ];

    const totalSize = allItems.reduce((sum, item) => sum + item.size, 0);
    const compressedSize = allItems
      .filter(item => item.compressed)
      .reduce((sum, item) => sum + item.size, 0);

    return {
      totalItems: allItems.length,
      totalSize,
      compressedSize,
      compressionRatio: totalSize > 0 ? compressedSize / totalSize : 0,
      importantItems: allItems.filter(item => item.importance >= this.importanceThreshold),
      recentItems: allItems
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
        .slice(0, 10),
      frequentlyAccessed: allItems
        .filter(item => item.accessCount >= this.accessThreshold)
        .sort((a, b) => b.accessCount - a.accessCount)
        .slice(0, 10)
    };
  }

  // 🗜️ Context Compression
  public compressContext(sessionId: string, targetSize?: number): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    const target = targetSize || this.maxContextSize;
    const summary = this.getContextSummary(sessionId);

    if (summary.totalSize <= target) return;

    // Sort items by importance and recency
    const allItems = [
      ...context.conversationHistory,
      ...context.codeContext,
      ...context.requirements,
      ...context.constraints,
      ...context.decisions
    ];

    const sortedItems = allItems.sort((a, b) => {
      const scoreA = this.calculateItemScore(a);
      const scoreB = this.calculateItemScore(b);
      return scoreB - scoreA;
    });

    // Keep most important items, compress or remove others
    let currentSize = 0;
    const itemsToKeep: ContextItem[] = [];
    const itemsToCompress: ContextItem[] = [];
    const itemsToRemove: ContextItem[] = [];

    for (const item of sortedItems) {
      if (currentSize + item.size <= target) {
        itemsToKeep.push(item);
        currentSize += item.size;
      } else if (item.importance >= 0.8) {
        // Compress high-importance items
        const compressedItem = this.compressItem(item);
        if (currentSize + compressedItem.size <= target) {
          itemsToCompress.push(compressedItem);
          currentSize += compressedItem.size;
        } else {
          itemsToRemove.push(item);
        }
      } else {
        itemsToRemove.push(item);
      }
    }

    // Update context with compressed items
    this.updateContextWithCompressedItems(context, itemsToKeep, itemsToCompress, itemsToRemove);
  }

  public autoCompressContext(sessionId: string): void {
    const summary = this.getContextSummary(sessionId);
    
    if (summary.totalSize > this.compressionThreshold) {
      this.compressContext(sessionId);
    }
  }

  // 🔍 Context Analysis and Synthesis
  public extractSwarmContext(input: string, context: any): any {
    return {
      input,
      context,
      extractedEntities: this.extractEntities(input),
      extractedIntent: this.extractIntent(input),
      extractedRequirements: this.extractRequirements(input),
      contextRelevance: this.calculateContextRelevance(input, context),
      timestamp: new Date()
    };
  }

  public async synthesizeResults(results: any[]): Promise<string> {
    if (results.length === 0) return 'No results to synthesize';

    // Group results by type
    const groupedResults = this.groupResultsByType(results);
    
    // Create synthesis for each group
    const syntheses = [];
    
    for (const [type, groupResults] of Object.entries(groupedResults)) {
      const synthesis = await this.synthesizeGroupResults(type, groupResults);
      syntheses.push(synthesis);
    }
    
    // Combine syntheses
    return this.combineSyntheses(syntheses);
  }

  public findRelevantContext(sessionId: string, query: string, limit: number = 5): ContextItem[] {
    const context = this.contexts.get(sessionId);
    if (!context) return [];

    const allItems = [
      ...context.conversationHistory,
      ...context.codeContext,
      ...context.requirements,
      ...context.constraints,
      ...context.decisions
    ];

    // Calculate relevance scores
    const scoredItems = allItems.map(item => ({
      item,
      score: this.calculateRelevanceScore(item, query)
    }));

    // Sort by relevance and return top items
    return scoredItems
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(scored => scored.item);
  }

  // 💰 Cost Optimization
  public optimizeContextForCost(sessionId: string, maxTokens: number): void {
    const context = this.contexts.get(sessionId);
    if (!context) return;

    // Remove low-importance items first
    this.removeLowImportanceItems(context, maxTokens * 0.3);
    
    // Compress medium-importance items
    this.compressMediumImportanceItems(context, maxTokens * 0.5);
    
    // Keep only high-importance items if still over limit
    if (this.getContextSummary(sessionId).totalSize > maxTokens) {
      this.keepOnlyHighImportanceItems(context, maxTokens);
    }
  }

  public estimateContextCost(sessionId: string, costPerToken: number = 0.0001): number {
    const summary = this.getContextSummary(sessionId);
    return summary.totalSize * costPerToken;
  }

  // 🧠 Private Helper Methods
  private initializeContextManager(): void {
    console.log('🧠 Context Manager initialized');
  }

  private estimateTokenCount(text: string): number {
    // Simple token estimation (rough approximation)
    return Math.ceil(text.length / 4);
  }

  private calculateItemScore(item: ContextItem): number {
    const importanceWeight = 0.4;
    const recencyWeight = 0.3;
    const accessWeight = 0.3;
    
    const recencyScore = Math.max(0, 1 - (Date.now() - item.timestamp.getTime()) / (24 * 60 * 60 * 1000));
    const accessScore = Math.min(1, item.accessCount / 10);
    
    return (
      item.importance * importanceWeight +
      recencyScore * recencyWeight +
      accessScore * accessWeight
    );
  }

  private compressItem(item: ContextItem): ContextItem {
    // Simple compression - keep first and last parts, summarize middle
    const words = item.content.split(' ');
    if (words.length <= 20) return item;
    
    const firstPart = words.slice(0, 10).join(' ');
    const lastPart = words.slice(-10).join(' ');
    const middleSummary = `[... ${words.length - 20} words ...]`;
    
    const compressedContent = `${firstPart} ${middleSummary} ${lastPart}`;
    
    return {
      ...item,
      content: compressedContent,
      compressed: true,
      size: this.estimateTokenCount(compressedContent)
    };
  }

  private updateContextWithCompressedItems(
    context: SwarmContext,
    itemsToKeep: ContextItem[],
    itemsToCompress: ContextItem[],
    itemsToRemove: ContextItem[]
  ): void {
    // Update each category with the new items
    const categories = ['conversation', 'code', 'requirements', 'constraints', 'decisions'] as const;
    
    categories.forEach(category => {
      const categoryKey = `${category}History` as keyof SwarmContext;
      const categoryItems = context[categoryKey] as ContextItem[];
      
      // Filter out removed items
      const remainingItems = categoryItems.filter(item => 
        !itemsToRemove.some(removed => removed.id === item.id)
      );
      
      // Add compressed items
      const compressedItems = itemsToCompress.filter(item => 
        categoryItems.some(original => original.id === item.id)
      );
      
      context[categoryKey] = [...remainingItems, ...compressedItems] as any;
    });
    
    context.lastUpdated = new Date();
  }

  private extractEntities(input: string): string[] {
    // Simple entity extraction - would use NLP in practice
    const entities = [];
    const words = input.toLowerCase().split(' ');
    
    const techKeywords = ['react', 'typescript', 'nodejs', 'python', 'api', 'database', 'frontend', 'backend'];
    const actionKeywords = ['create', 'build', 'implement', 'fix', 'optimize', 'test', 'deploy'];
    
    words.forEach(word => {
      if (techKeywords.includes(word)) entities.push(`tech:${word}`);
      if (actionKeywords.includes(word)) entities.push(`action:${word}`);
    });
    
    return entities;
  }

  private extractIntent(input: string): string {
    // Simple intent extraction
    if (input.includes('create') || input.includes('build')) return 'creation';
    if (input.includes('fix') || input.includes('bug')) return 'fixing';
    if (input.includes('optimize') || input.includes('improve')) return 'optimization';
    if (input.includes('test')) return 'testing';
    if (input.includes('deploy')) return 'deployment';
    return 'general';
  }

  private extractRequirements(input: string): string[] {
    // Extract requirements from input
    const requirements = [];
    const sentences = input.split(/[.!?]+/);
    
    sentences.forEach(sentence => {
      if (sentence.includes('should') || sentence.includes('must') || sentence.includes('need')) {
        requirements.push(sentence.trim());
      }
    });
    
    return requirements;
  }

  private calculateContextRelevance(input: string, context: any): number {
    // Calculate how relevant the context is to the input
    const inputWords = input.toLowerCase().split(' ');
    const contextWords = JSON.stringify(context).toLowerCase().split(' ');
    
    const commonWords = inputWords.filter(word => contextWords.includes(word));
    return commonWords.length / inputWords.length;
  }

  private groupResultsByType(results: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    
    results.forEach(result => {
      const type = result.response?.type || 'unknown';
      if (!groups[type]) groups[type] = [];
      groups[type].push(result);
    });
    
    return groups;
  }

  private async synthesizeGroupResults(type: string, results: any[]): Promise<string> {
    // Simple synthesis based on type
    switch (type) {
      case 'code':
        return `Generated ${results.length} code solutions with average confidence ${this.calculateAverageConfidence(results)}%`;
      case 'analysis':
        return `Performed ${results.length} analyses covering different aspects of the problem`;
      case 'plan':
        return `Created ${results.length} implementation plans with varying approaches`;
      default:
        return `Completed ${results.length} ${type} tasks`;
    }
  }

  private calculateAverageConfidence(results: any[]): number {
    const totalConfidence = results.reduce((sum, result) => 
      sum + (result.response?.confidence || 0), 0);
    return Math.round((totalConfidence / results.length) * 100);
  }

  private combineSyntheses(syntheses: string[]): string {
    return syntheses.join('\n\n');
  }

  private calculateRelevanceScore(item: ContextItem, query: string): number {
    const queryWords = query.toLowerCase().split(' ');
    const itemWords = item.content.toLowerCase().split(' ');
    
    const commonWords = queryWords.filter(word => itemWords.includes(word));
    const wordScore = commonWords.length / queryWords.length;
    
    const tagScore = item.tags.some(tag => 
      queryWords.some(word => tag.toLowerCase().includes(word))
    ) ? 0.3 : 0;
    
    return wordScore + tagScore + (item.importance * 0.2);
  }

  private removeLowImportanceItems(context: SwarmContext, maxTokens: number): void {
    const categories = ['conversation', 'code', 'requirements', 'constraints', 'decisions'] as const;
    
    categories.forEach(category => {
      const categoryKey = `${category}History` as keyof SwarmContext;
      const items = context[categoryKey] as ContextItem[];
      
      // Sort by importance and remove low-importance items
      const sortedItems = items.sort((a, b) => b.importance - a.importance);
      let currentSize = 0;
      const keptItems: ContextItem[] = [];
      
      for (const item of sortedItems) {
        if (currentSize + item.size <= maxTokens || item.importance >= 0.7) {
          keptItems.push(item);
          currentSize += item.size;
        }
      }
      
      context[categoryKey] = keptItems as any;
    });
  }

  private compressMediumImportanceItems(context: SwarmContext, maxTokens: number): void {
    const categories = ['conversation', 'code', 'requirements', 'constraints', 'decisions'] as const;
    
    categories.forEach(category => {
      const categoryKey = `${category}History` as keyof SwarmContext;
      const items = context[categoryKey] as ContextItem[];
      
      const mediumImportanceItems = items.filter(item => 
        item.importance >= 0.5 && item.importance < 0.7 && !item.compressed
      );
      
      mediumImportanceItems.forEach(item => {
        const compressedItem = this.compressItem(item);
        const index = items.findIndex(i => i.id === item.id);
        if (index !== -1) {
          items[index] = compressedItem;
        }
      });
    });
  }

  private keepOnlyHighImportanceItems(context: SwarmContext, maxTokens: number): void {
    const categories = ['conversation', 'code', 'requirements', 'constraints', 'decisions'] as const;
    
    categories.forEach(category => {
      const categoryKey = `${category}History` as keyof SwarmContext;
      const items = context[categoryKey] as ContextItem[];
      
      // Keep only high-importance items
      const highImportanceItems = items
        .filter(item => item.importance >= 0.8)
        .sort((a, b) => b.importance - a.importance);
      
      let currentSize = 0;
      const keptItems: ContextItem[] = [];
      
      for (const item of highImportanceItems) {
        if (currentSize + item.size <= maxTokens) {
          keptItems.push(item);
          currentSize += item.size;
        }
      }
      
      context[categoryKey] = keptItems as any;
    });
  }

  // Public API
  public getContextSize(sessionId: string): number {
    const summary = this.getContextSummary(sessionId);
    return summary.totalSize;
  }

  public clearContext(sessionId: string): void {
    this.contexts.delete(sessionId);
  }

  public getAllContexts(): SwarmContext[] {
    return Array.from(this.contexts.values());
  }
}
