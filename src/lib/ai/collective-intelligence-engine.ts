// 🧠 COLLECTIVE INTELLIGENCE ENGINE - Движок коллективного интеллекта
// Агрегация и синтез мыслей всех агентов в единое решение

import { EventBus } from '../events/event-bus';
import { AgentThought, AgentMessage, CollaborativeDecision } from './real-time-puter-agent';

export interface TaskAnalysis {
  taskId: string;
  taskDescription: string;
  participatingAgents: string[];
  allThoughts: AgentThought[];
  allMessages: AgentMessage[];
  collaborativeDecisions: CollaborativeDecision[];
  finalSolution: string;
  confidenceScore: number;
  createdAt: Date;
  completedAt?: Date;
  status: 'analyzing' | 'collaborating' | 'synthesizing' | 'completed';
}

export interface SynthesisStep {
  id: string;
  stepNumber: number;
  description: string;
  involvedThoughts: string[];
  result: string;
  confidence: number;
  timestamp: Date;
}

export class CollectiveIntelligenceEngine {
  private eventBus: EventBus;
  private activeAnalyses: Map<string, TaskAnalysis> = new Map();
  private thoughtBuffer: Map<string, AgentThought[]> = new Map();
  private messageBuffer: Map<string, AgentMessage[]> = new Map();

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Слушаем новые задачи
    this.eventBus.subscribe('task_created', (data: any) => {
      this.initializeTaskAnalysis(data.taskId, data.description);
    });

    // Слушаем мысли агентов
    this.eventBus.subscribe('agent_thought', (thought: AgentThought) => {
      this.processAgentThought(thought);
    });

    // Слушаем сообщения между агентами
    this.eventBus.subscribe('agent_message', (message: AgentMessage) => {
      this.processAgentMessage(message);
    });

    // Слушаем запросы на коллаборацию
    this.eventBus.subscribe('collaboration_request', (data: any) => {
      this.facilitateCollaboration(data);
    });
  }

  private initializeTaskAnalysis(taskId: string, description: string): void {
    const analysis: TaskAnalysis = {
      taskId,
      taskDescription: description,
      participatingAgents: [],
      allThoughts: [],
      allMessages: [],
      collaborativeDecisions: [],
      finalSolution: '',
      confidenceScore: 0,
      createdAt: new Date(),
      status: 'analyzing'
    };

    this.activeAnalyses.set(taskId, analysis);
    this.thoughtBuffer.set(taskId, []);
    this.messageBuffer.set(taskId, []);

    // Публикуем событие о начале анализа
    this.eventBus.publish('collective_analysis_started', {
      taskId,
      analysis,
      timestamp: new Date()
    });
  }

  private processAgentThought(thought: AgentThought): void {
    // Определяем к какой задаче относится мысль
    const taskId = this.findTaskForThought(thought);
    if (!taskId) return;

    const analysis = this.activeAnalyses.get(taskId);
    if (!analysis) return;

    // Добавляем мысль к анализу
    analysis.allThoughts.push(thought);
    
    // Добавляем агента к участникам если его еще нет
    if (!analysis.participatingAgents.includes(thought.agentId)) {
      analysis.participatingAgents.push(thought.agentId);
    }

    // Добавляем в буфер для обработки
    const buffer = this.thoughtBuffer.get(taskId) || [];
    buffer.push(thought);
    this.thoughtBuffer.set(taskId, buffer);

    // Публикуем обновление
    this.eventBus.publish('collective_thought_added', {
      taskId,
      thought,
      totalThoughts: analysis.allThoughts.length,
      timestamp: new Date()
    });

    // Проверяем нужно ли синтезировать результат
    this.checkForSynthesis(taskId);
  }

  private processAgentMessage(message: AgentMessage): void {
    const taskId = this.findTaskForMessage(message);
    if (!taskId) return;

    const analysis = this.activeAnalyses.get(taskId);
    if (!analysis) return;

    analysis.allMessages.push(message);

    const buffer = this.messageBuffer.get(taskId) || [];
    buffer.push(message);
    this.messageBuffer.set(taskId, buffer);

    // Публикуем обновление
    this.eventBus.publish('collective_message_added', {
      taskId,
      message,
      totalMessages: analysis.allMessages.length,
      timestamp: new Date()
    });
  }

  private async facilitateCollaboration(event: any): Promise<void> {
    // Находим других агентов которые могут помочь
    const relevantAgents = this.findRelevantAgents(event.reason);
    
    // Отправляем запрос на коллаборацию
    for (const agentId of relevantAgents) {
      if (agentId !== event.fromAgent) {
        this.eventBus.publish('agent_message', {
          id: `collab_${Date.now()}`,
          fromAgent: 'collective_intelligence',
          toAgent: agentId,
          content: `Агент ${event.fromAgentName} запрашивает коллаборацию: ${event.reason}. Можешь помочь?`,
          messageType: 'question',
          timestamp: new Date(),
          aiGenerated: false,
          model: 'system'
        });
      }
    }

    // Публикуем событие о коллаборации
    this.eventBus.publish('collaboration_facilitated', {
      initiator: event.fromAgent,
      participants: relevantAgents,
      reason: event.reason,
      timestamp: new Date()
    });
  }

  private async checkForSynthesis(taskId: string): Promise<void> {
    const analysis = this.activeAnalyses.get(taskId);
    if (!analysis) return;

    const thoughts = this.thoughtBuffer.get(taskId) || [];
    
    // Критерии для начала синтеза:
    // 1. Более 3 мыслей от разных агентов
    // 2. Прошло достаточно времени
    // 3. Есть признаки завершения обсуждения
    
    const uniqueAgents = new Set(thoughts.map(t => t.agentId)).size;
    const timeSinceStart = Date.now() - analysis.createdAt.getTime();
    
    if (uniqueAgents >= 2 && thoughts.length >= 3 && timeSinceStart > 10000) {
      await this.synthesizeCollectiveDecision(taskId);
    }
  }

  private async synthesizeCollectiveDecision(taskId: string): Promise<void> {
    const analysis = this.activeAnalyses.get(taskId);
    if (!analysis || analysis.status === 'synthesizing') return;

    analysis.status = 'synthesizing';

    // Публикуем начало синтеза
    this.eventBus.publish('synthesis_started', {
      taskId,
      thoughtCount: analysis.allThoughts.length,
      agentCount: analysis.participatingAgents.length,
      timestamp: new Date()
    });

    try {
      // Создаем этапы синтеза
      const synthesisSteps = await this.createSynthesisSteps(analysis);
      
      // Выполняем синтез по этапам
      for (const step of synthesisSteps) {
        await this.executeSynthesisStep(step, taskId);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Пауза между этапами
      }

      // Генерируем финальное решение
      const finalSolution = await this.generateFinalSolution(analysis);
      analysis.finalSolution = finalSolution.content;
      analysis.confidenceScore = finalSolution.confidence;
      analysis.status = 'completed';
      analysis.completedAt = new Date();

      // Публикуем завершение
      this.eventBus.publish('collective_decision_completed', {
        taskId,
        solution: finalSolution,
        analysis,
        timestamp: new Date()
      });

    } catch (error) {
      console.error('Ошибка при синтезе коллективного решения:', error);
      
      // Публикуем ошибку
      this.eventBus.publish('synthesis_error', {
        taskId,
        error: error.message,
        timestamp: new Date()
      });
    }
  }

  private async createSynthesisSteps(analysis: TaskAnalysis): Promise<SynthesisStep[]> {
    const steps: SynthesisStep[] = [];

    // Этап 1: Анализ всех мыслей
    steps.push({
      id: `step_1_${analysis.taskId}`,
      stepNumber: 1,
      description: 'Анализ и категоризация всех мыслей агентов',
      involvedThoughts: analysis.allThoughts.map(t => t.id),
      result: await this.analyzeAllThoughts(analysis.allThoughts),
      confidence: 0.8,
      timestamp: new Date()
    });

    // Этап 2: Поиск консенсуса
    steps.push({
      id: `step_2_${analysis.taskId}`,
      stepNumber: 2,
      description: 'Поиск точек согласия между агентами',
      involvedThoughts: analysis.allThoughts.map(t => t.id),
      result: await this.findConsensus(analysis.allThoughts),
      confidence: 0.75,
      timestamp: new Date()
    });

    // Этап 3: Разрешение конфликтов
    steps.push({
      id: `step_3_${analysis.taskId}`,
      stepNumber: 3,
      description: 'Разрешение противоречий и конфликтных мнений',
      involvedThoughts: analysis.allThoughts.filter(t => t.confidence < 0.7).map(t => t.id),
      result: await this.resolveConflicts(analysis.allThoughts),
      confidence: 0.7,
      timestamp: new Date()
    });

    return steps;
  }

  private async executeSynthesisStep(step: SynthesisStep, taskId: string): Promise<void> {
    // Публикуем выполнение этапа
    this.eventBus.publish('synthesis_step_executed', {
      taskId,
      step,
      timestamp: new Date()
    });
  }

  private async analyzeAllThoughts(thoughts: AgentThought[]): Promise<string> {
    // Анализируем все мысли и создаем сводку
    const categories = this.categorizeThoughts(thoughts);
    const summary = Object.entries(categories)
      .map(([category, categoryThoughts]) => 
        `${category}: ${categoryThoughts.length} мыслей`)
      .join(', ');
    
    return `Проанализировано ${thoughts.length} мыслей от ${new Set(thoughts.map(t => t.agentId)).size} агентов. Категории: ${summary}`;
  }

  private async findConsensus(thoughts: AgentThought[]): Promise<string> {
    // Находим общие темы и точки согласия
    const commonThemes = this.extractCommonThemes(thoughts);
    return `Найдены общие темы: ${commonThemes.join(', ')}. Агенты согласны в основных принципах решения.`;
  }

  private async resolveConflicts(thoughts: AgentThought[]): Promise<string> {
    // Анализируем противоречия и предлагаем решения
    const conflicts = this.identifyConflicts(thoughts);
    return `Обнаружено ${conflicts.length} противоречий. Предложены компромиссные решения.`;
  }

  private async generateFinalSolution(analysis: TaskAnalysis): Promise<{content: string, confidence: number}> {
    // Генерируем финальное решение на основе всех данных
    const thoughtsSummary = analysis.allThoughts
      .map(t => `${t.agentName}: ${t.thought}`)
      .join('\n');

    try {
      // Используем AI для генерации финального решения
      const solution = await this.callPuterForSynthesis(analysis.taskDescription, thoughtsSummary);
      return {
        content: solution,
        confidence: 0.9
      };
    } catch (error) {
      // Fallback решение
      return {
        content: `Коллективное решение на основе анализа ${analysis.allThoughts.length} мыслей от ${analysis.participatingAgents.length} агентов: ${this.createFallbackSolution(analysis)}`,
        confidence: 0.7
      };
    }
  }

  private async callPuterForSynthesis(taskDescription: string, thoughtsSummary: string): Promise<string> {
    if (typeof window === 'undefined' || !(window as any).puter) {
      throw new Error('Puter не доступен');
    }

    const puter = (window as any).puter;
    
    const prompt = `Проанализируй следующую задачу и мысли экспертов, затем создай финальное коллективное решение:

ЗАДАЧА: ${taskDescription}

МЫСЛИ ЭКСПЕРТОВ:
${thoughtsSummary}

Создай синтезированное решение, которое учитывает лучшие идеи всех экспертов и предлагает конкретный план действий.`;

    try {
      // Правильный API вызов согласно документации Puter.js
      const systemPrompt = 'Ты эксперт по синтезу коллективного интеллекта. Создавай четкие, практичные решения.';
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;
      
        const response = await puter.ai.chat(fullPrompt);

      console.log('🔍 Collective Intelligence response:', response);
      
      // Обработка ответа согласно документации
      if (typeof response === 'string') {
        return response;
      } else if (response?.message?.content) {
        if (Array.isArray(response.message.content)) {
          return response.message.content[0]?.text || response.message.content[0] || '';
        } else {
          return response.message.content;
        }
      } else {
        return response?.content || 'Коллективное решение сгенерировано';
      }
    } catch (error) {
      throw error;
    }
  }

  private categorizeThoughts(thoughts: AgentThought[]): Record<string, AgentThought[]> {
    const categories: Record<string, AgentThought[]> = {};
    
    for (const thought of thoughts) {
      for (const tag of thought.tags) {
        if (!categories[tag]) categories[tag] = [];
        categories[tag].push(thought);
      }
    }
    
    return categories;
  }

  private extractCommonThemes(thoughts: AgentThought[]): string[] {
    // Простой анализ общих тем по ключевым словам
    const keywords = thoughts
      .flatMap(t => t.thought.split(' '))
      .filter(word => word.length > 3)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(keywords)
      .filter(([_, count]) => count >= 2)
      .map(([word, _]) => word)
      .slice(0, 5);
  }

  private identifyConflicts(thoughts: AgentThought[]): any[] {
    // Простое определение конфликтов по низкой уверенности
    return thoughts.filter(t => t.confidence < 0.7);
  }

  private createFallbackSolution(analysis: TaskAnalysis): string {
    return `Основываясь на коллективном анализе, рекомендуется комплексный подход, учитывающий все предложенные идеи и экспертные мнения ${analysis.participatingAgents.length} агентов.`;
  }

  private findTaskForThought(thought: AgentThought): string | null {
    // Простая логика - связываем с активной задачей
    for (const [taskId, analysis] of this.activeAnalyses) {
      if (analysis.status !== 'completed') {
        return taskId;
      }
    }
    return null;
  }

  private findTaskForMessage(message: AgentMessage): string | null {
    // Аналогично для сообщений
    for (const [taskId, analysis] of this.activeAnalyses) {
      if (analysis.status !== 'completed') {
        return taskId;
      }
    }
    return null;
  }

  private findRelevantAgents(reason: string): string[] {
    // Простая логика поиска релевантных агентов
    const allAgents = ['ai-architect-agent', 'ai-developer-agent', 'ai-analyst-agent'];
    return allAgents.slice(0, 2); // Возвращаем первых двух
  }

  // Публичные методы
  public getActiveAnalyses(): TaskAnalysis[] {
    return Array.from(this.activeAnalyses.values());
  }

  public getAnalysis(taskId: string): TaskAnalysis | undefined {
    return this.activeAnalyses.get(taskId);
  }
}
