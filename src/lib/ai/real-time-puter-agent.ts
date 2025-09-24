// 🧠 REAL-TIME PUTER AI AGENT - Настоящее взаимодействие с AI через Puter
// Реальные агенты с настоящим мышлением через AI модели

import { EventBus } from '../events/event-bus';
import { PuterAuthManager } from '../auth/puter-auth-manager';
import { APP_CONFIG } from '@/config/constants';

export interface AgentThought {
  id: string;
  agentId: string;
  agentName: string;
  model: string;
  thought: string;
  reasoning: string;
  confidence: number;
  timestamp: Date;
  processingTime: number;
  relatedThoughts: string[];
  tags: string[];
}

export interface AgentMessage {
  id: string;
  fromAgent: string;
  toAgent: string;
  content: string;
  messageType: 'thought' | 'question' | 'response' | 'suggestion' | 'decision';
  timestamp: Date;
  aiGenerated: boolean;
  model: string;
}

export interface CollaborativeDecision {
  id: string;
  taskId: string;
  participatingAgents: string[];
  allThoughts: AgentThought[];
  finalDecision: string;
  reasoning: string;
  confidence: number;
  timestamp: Date;
  synthesizedBy: string;
}

export class RealTimePuterAgent {
  private id: string;
  private name: string;
  private role: string;
  private personality: string;
  private preferredModel: string;
  private eventBus: EventBus;
  private thoughtHistory: AgentThought[] = [];
  private messageHistory: AgentMessage[] = [];
  private isThinking: boolean = false;
  private lastThoughtTime: number = 0;
  private thoughtCooldown: number = 2000; // Уменьшаем cooldown до 2 секунд для более активного общения

  constructor(
    id: string,
    name: string,
    role: string,
    personality: string,
    preferredModel: string,
    eventBus: EventBus
  ) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.personality = personality;
    this.preferredModel = preferredModel;
    this.eventBus = eventBus;
    
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Слушаем новые задачи
    this.eventBus.subscribe('task_assigned', (event) => {
      if (event.agentId === this.id) {
        this.processTask(event.task);
      }
    });

    // Слушаем сообщения от других агентов
    this.eventBus.subscribe('agent_message', (event) => {
      if (event.toAgent === this.id) {
        this.processAgentMessage(event);
      }
    });

    // Слушаем мысли других агентов
    this.eventBus.subscribe('agent_thought', (event) => {
      if (event.agentId !== this.id) {
        this.analyzeOtherAgentThought(event);
      }
    });

    // Запускаем автономную генерацию мыслей
    this.startAutonomousThinking();
  }

  private startAutonomousThinking(): void {
    const generateAutonomousThought = async () => {
      if (this.isThinking) {
        // Если агент занят задачей, планируем следующую мысль
        setTimeout(generateAutonomousThought, 2000 + Math.random() * 3000);
        return;
      }

      try {
        // Получаем случайную тему для размышления
        const thoughtPrompts = this.getAutonomousThoughtPrompts();
        const randomPrompt = thoughtPrompts[Math.floor(Math.random() * thoughtPrompts.length)];
        
        // Генерируем мысль
        const thought = await this.generateThought(randomPrompt, `autonomous_${Date.now()}`);
        console.log(`💭 ${this.name}: ${thought.thought.substring(0, 80)}...`);
        this.publishThought(thought);

      } catch (error) {
        console.log(`${this.name}: Ошибка автономного размышления`, error);
      }

      // Иногда инициируем случайное общение с другим агентом (увеличиваем шанс)
      if (Math.random() > 0.75) { // 25% шанс вместо 15%
        this.initiateRandomCollaboration();
      }

      // Планируем следующую мысль через 4-10 секунд
      setTimeout(generateAutonomousThought, 4000 + Math.random() * 6000);
    };

    // Начинаем с задержкой чтобы агенты не стартовали одновременно
    setTimeout(generateAutonomousThought, 1000 + Math.random() * 3000);
  }

  private getAutonomousThoughtPrompts(): string[] {
    const basePrompts = [
      'Какие новые технологии стоит изучить в нашей области?',
      'Анализирую текущие тренды в индустрии',
      'Размышляю о способах оптимизации рабочих процессов',
      'Какие вызовы ждут нас в ближайшем будущем?',
      'Исследую возможности для инноваций'
    ];

    // Специфичные промпты по роли
    const roleSpecificPrompts = this.getRoleSpecificPrompts();
    
    return [...basePrompts, ...roleSpecificPrompts];
  }

  private getRoleSpecificPrompts(): string[] {
    const role = this.role.toLowerCase();
    
    if (role.includes('architect') || role.includes('архитектор')) {
      return [
        'Проектирую масштабируемую архитектуру для high-load систем',
        'Анализирую паттерны microservices vs monolithic архитектуры', 
        'Исследую новые подходы к event-driven architecture',
        'Оптимизирую data flow в распределенных системах',
        'Планирую migration стратегию для legacy кода'
      ];
    }
    
    if (role.includes('developer') || role.includes('разработчик')) {
      return [
        'Рефакторю код для улучшения производительности',
        'Исследую новые фреймворки и библиотеки',
        'Оптимизирую алгоритмы для большого объема данных',
        'Внедряю best practices в team development',
        'Создаю reusable компоненты для ускорения разработки'
      ];
    }
    
    if (role.includes('analyst') || role.includes('аналитик')) {
      return [
        'Анализирую метрики производительности системы',
        'Исследую пользовательское поведение и UX паттерны',
        'Выявляю bottlenecks в бизнес-процессах',
        'Прогнозирую потребности в ресурсах на основе данных',
        'Создаю data-driven recommendations для улучшений'
      ];
    }

    return [];
  }

  private async initiateRandomCollaboration(): Promise<void> {
    // Список возможных тем для обсуждения
    const collaborationTopics = [
      'Что думаешь о последних трендах в нашей области?',
      'Какие инструменты ты сейчас используешь в работе?', 
      'Есть интересные идеи для оптимизации процессов?',
      'Как решать задачи повышенной сложности?',
      'Поделись опытом работы с новыми технологиями'
    ];

    const randomTopic = collaborationTopics[Math.floor(Math.random() * collaborationTopics.length)];
    
    // Публикуем запрос на коллаборацию для всех агентов
    this.eventBus.publish('collaboration_request', {
      fromAgent: this.id,
      fromAgentName: this.name,
      reason: randomTopic,
      timestamp: new Date(),
      taskId: `collaboration_${Date.now()}`
    });

    // Также генерируем мысль об этом
    const collaborationThought = await this.generateThought(
      `Инициирую обсуждение с коллегами: ${randomTopic}`,
      `collaboration_${Date.now()}`
    );
    this.publishThought(collaborationThought);
  }

  public async processTask(task: any): Promise<void> {
    this.isThinking = true;
    
    // Уведомляем о начале обработки
    this.eventBus.publish('agent_status_change', {
      agentId: this.id,
      status: 'thinking',
      message: `${this.name} начинает анализ задачи...`,
      timestamp: new Date()
    });

    try {
      // Генерируем первоначальную мысль через AI
      const initialThought = await this.generateThought(
        `Как ${this.role} с личностью "${this.personality}", проанализируй эту задачу: ${task.description}. 
         Подумай глубоко и дай свой экспертный анализ.`,
        task.id
      );

      // Публикуем мысль
      this.publishThought(initialThought);

      // Генерируем дополнительные размышления
      await this.generateAdditionalThoughts(task);

      // Ищем возможности для коллаборации
      await this.seekCollaboration(task);

    } catch (error) {
      console.error(`Ошибка при обработке задачи агентом ${this.name}:`, error);
    } finally {
      this.isThinking = false;
    }
  }

  private async generateThought(prompt: string, taskId: string): Promise<AgentThought> {
    const startTime = Date.now();
    
    // Throttling - проверяем не слишком ли часто генерируем мысли
    if (startTime - this.lastThoughtTime < this.thoughtCooldown) {
      // Возвращаем кэшированную мысль если слишком рано
      const cachedThought = this.thoughtHistory[this.thoughtHistory.length - 1];
      if (cachedThought) {
        return {
          ...cachedThought,
          id: `thought_${this.id}_${Date.now()}`,
          timestamp: new Date()
        };
      }
    }
    
    this.lastThoughtTime = startTime;
    
    try {
      // Реальный вызов к Puter AI
      const response = await this.callPuterAI(prompt);
      const processingTime = Date.now() - startTime;

      const thought: AgentThought = {
        id: `thought_${this.id}_${Date.now()}`,
        agentId: this.id,
        agentName: this.name,
        model: this.preferredModel,
        thought: response.content,
        reasoning: response.reasoning || 'AI-генерированное рассуждение',
        confidence: response.confidence || 0.85,
        timestamp: new Date(),
        processingTime,
        relatedThoughts: [],
        tags: this.extractTags(response.content)
      };

      this.thoughtHistory.push(thought);
      
      // Ограничиваем размер истории мыслей
      if (this.thoughtHistory.length > APP_CONFIG.AGENTS.MAX_THOUGHT_HISTORY) {
        this.thoughtHistory = this.thoughtHistory.slice(-APP_CONFIG.AGENTS.MAX_THOUGHT_HISTORY);
      }
      
      return thought;

    } catch (error) {
      console.error('Ошибка генерации мысли:', error);
      
      // Fallback мысль в случае ошибки
      return {
        id: `thought_${this.id}_${Date.now()}`,
        agentId: this.id,
        agentName: this.name,
        model: this.preferredModel,
        thought: `Как ${this.role}, я анализирую задачу и формирую свое понимание проблемы...`,
        reasoning: 'Базовый анализ в fallback режиме',
        confidence: 0.6,
        timestamp: new Date(),
        processingTime: Date.now() - startTime,
        relatedThoughts: [],
        tags: ['analysis', 'fallback']
      };
    }
  }

  private async callPuterAI(prompt: string): Promise<any> {
    // Пытаемся использовать реальный Puter API, но с fallback
    try {
      // Проверяем статус аутентификации
      const authManager = PuterAuthManager.getInstance();
      let authStatus = authManager.getAuthStatus();
      
      // Если не авторизован, используем demo режим (не пытаемся авторизоваться повторно)
      if (!authStatus.isAuthenticated) {
        console.log(`${this.name}: Puter не авторизован, переходим в demo режим`);
        return this.generateDemoResponse(prompt);
      }
      
      console.log(`${this.name}: ✅ Puter авторизован, используем реальный AI`);

      // Проверяем доступность Puter
      if (typeof window === 'undefined' || !(window as any).puter) {
        throw new Error('Puter не доступен');
      }

      const puter = (window as any).puter;
      
      // Проверяем доступность AI модуля
      if (!puter.ai || typeof puter.ai.chat !== 'function') {
        throw new Error('Puter.ai.chat недоступен - возможно требуется дополнительная аутентификация');
      }
      
      console.log(`${this.name}: Отправляю запрос к ${this.preferredModel}...`);
      console.log(`🔍 AI модуль доступен:`, {
        aiAvailable: !!puter.ai,
        chatFunction: typeof puter.ai.chat,
        model: this.preferredModel
      });
      
      // Используем предпочитаемую модель напрямую (puter.ai.models() не поддерживается)
      let selectedModel = this.preferredModel;
      console.log(`🤖 Используем модель: ${selectedModel}`);
      
      // Список совместимых моделей в качестве fallback
      const compatibleModels = [
        'claude-3-5-sonnet-20241022',
        'claude-3-sonnet-20240229', 
        'claude-3-haiku-20240307',
        'gpt-4-turbo',
        'gpt-4',
        'gpt-3.5-turbo'
      ];
      
      // Если модель не в списке совместимых, используем fallback
      if (!compatibleModels.includes(this.preferredModel)) {
        selectedModel = 'claude-sonnet-4'; // Используем claude-sonnet-4 как дефолт
        console.log(`🔄 Fallback к совместимой модели: ${selectedModel}`);
      }
      
      // Формируем системный промпт для агента
      const systemPrompt = `Ты ${this.name} - ${this.role} с личностью: ${this.personality}.
Отвечай в характере этого агента. Будь экспертом в своей области.
Твои ответы должны отражать твою специализацию и личность.
Отвечай конкретно и по делу, но творчески.`;

      // Правильный API вызов согласно документации Claude API
      const fullPrompt = `${systemPrompt}\n\n${prompt}`;

      console.log(`🤖 ${this.name}: Отправляю простой prompt к Puter.js AI`);
      console.log(`📝 Полный prompt:`, fullPrompt);
      
      const response = await puter.ai.chat(fullPrompt);
      
      console.log(`✅ ${this.name}: Получен ответ от Puter.js AI:`, response);
      console.log(`🔍 ${this.name}: Тип ответа:`, typeof response);
      console.log(`🔍 ${this.name}: Структура ответа:`, JSON.stringify(response, null, 2));
      
      // Детальное логирование если success: false
      if (response && typeof response === 'object' && 'success' in response && response.success === false) {
        console.log(`❌ ${this.name}: API вернул success: false`);
        console.log(`🔍 ${this.name}: Полная структура error:`, JSON.stringify(response.error, null, 2));
        console.log(`🔍 ${this.name}: Ключи response:`, Object.keys(response));
      }

      // Расширенная обработка ответа с лучшей диагностикой
      let content = '';
      
      // Проверяем если это объект с success/error (может быть специфичный формат Puter)
      if (response && typeof response === 'object' && 'success' in response) {
        console.log(`🔍 ${this.name}: Обнаружен success/error формат:`, response);
        if (response.success === false) {
          throw new Error(`Puter API error: ${JSON.stringify(response.error)}`);
        }
        // Если success === true, извлекаем контент
        content = response.data || response.content || response.message || '';
      }
      // Обычная обработка
      else if (typeof response === 'string') {
        content = response;
      } else if (response?.message?.content) {
        if (Array.isArray(response.message.content)) {
          content = response.message.content[0]?.text || response.message.content[0] || '';
        } else {
          content = response.message.content;
        }
      } else if (response?.content) {
        content = response.content;
      } else if (response?.text) {
        content = response.text;
      } else {
        content = String(response || 'AI model response received');
      }
      
      console.log(`📝 ${this.name}: Извлеченный контент:`, content);

      return {
        content: content || 'AI ответ получен',
        reasoning: `🤖 Реальный AI: ${selectedModel}`,
        confidence: 0.85
      };

    } catch (error) {
      console.error(`❌ Ошибка AI запроса для ${this.name}:`, error);
      console.error('❌ Детали ошибки:', {
        message: error.message,
        stack: error.stack,
        puterAvailable: typeof (window as any).puter !== 'undefined',
        aiModuleAvailable: typeof (window as any).puter?.ai !== 'undefined',
        preferredModel: this.preferredModel
      });
      console.log('🔄 Fallback to demo mode for agent:', this.name);
      
      // Fallback к демо режиму с умными ответами
      return this.generateDemoResponse(prompt);
    }
  }

  private generateDemoResponse(prompt: string): any {
    // Расширенные умные demo ответы с большим разнообразием
    const currentTime = new Date().getTime();
    const responseIndex = Math.floor((currentTime + this.thoughtHistory.length) / 1000) % 50; // Меняется каждую секунду
    
    const responses = {
      architect: [
        'Анализирую архитектурные паттерны для high-load систем. Event-driven architecture показывает лучшие результаты.',
        'Исследую варианты serverless architecture vs traditional microservices. AWS Lambda + API Gateway интересная комбинация.',
        'Планирую migration к Kubernetes с применением Helm charts для deployment automation.',
        'Рассматриваю GraphQL Federation для унификации API endpoints в микросервисной архитектуре.',
        'Проектирую distributed caching strategy с Redis Cluster и consistent hashing.',
        'Анализирую CAP theorem применительно к нашим данным. Eventual consistency кажется оптимальной.',
        'Изучаю CQRS + Event Sourcing паттерн для audit-требований и performance optimization.',
        'Планирую multi-region deployment с automated failover через Terraform.',
        'Исследую service mesh (Istio) для observability и security в микросервисах.',
        'Разрабатываю API versioning strategy для backward compatibility.'
      ],
      developer: [
        'Рефакторю legacy код с применением Dependency Injection и Factory patterns.',
        'Внедряю TypeScript strict mode и настраиваю ESLint rules для better code quality.',
        'Оптимизирую React rendering с React.memo и useMemo для complex computed values.',
        'Интегрирую Webpack 5 Module Federation для code splitting между микрофронтендами.',
        'Реализую real-time updates через WebSocket с automatic reconnection logic.',
        'Создаю custom hooks для state management без external dependencies.',
        'Настраиваю CI/CD pipeline с automated testing и progressive deployment.',
        'Внедряю code splitting и lazy loading для улучшения Core Web Vitals.',
        'Разрабатываю error boundary strategy для graceful error handling.',
        'Оптимизирую bundle size через tree shaking и dynamic imports.'
      ],
      analyst: [
        'Анализирую user journey mapping и выявляю точки friction в UX flow.',
        'Исследую A/B testing результаты для conversion rate optimization.',
        'Провожу technical debt analysis и планирую refactoring priorities.',
        'Анализирую performance metrics: TTFB, FCP, LCP показывают потенциал для optimization.',
        'Исследую security vulnerabilities через OWASP Top 10 checklist.',
        'Составляю cost analysis для cloud infrastructure и optimization recommendations.',
        'Анализирую data flow patterns и выявляю bottlenecks в processing pipeline.',
        'Провожу competitor analysis технических решений в нашей domain area.',
        'Исследую scalability limits текущей архитектуры под load testing.',
        'Анализирую code coverage metrics и prioritizing testing improvements.'
      ]
    };

    // Определяем тип ответа на основе роли
    let roleKey: keyof typeof responses = 'developer';
    if (this.role.toLowerCase().includes('architect') || this.role.toLowerCase().includes('архитектор')) {
      roleKey = 'architect';
    } else if (this.role.toLowerCase().includes('analyst') || this.role.toLowerCase().includes('аналитик')) {
      roleKey = 'analyst';
    }

    const roleResponses = responses[roleKey];
    const selectedResponse = roleResponses[responseIndex % roleResponses.length];

    // Добавляем персонализацию на основе истории мыслей агента
    const thoughtCount = this.thoughtHistory.length;
    let personalizedPrefix = '';
    
    if (thoughtCount > 5) {
      personalizedPrefix = 'Продолжаю глубокий анализ: ';
    } else if (thoughtCount > 2) {
      personalizedPrefix = 'Развивая предыдущие мысли: ';
    }

    // Иногда добавляем контекст времени суток
    const hour = new Date().getHours();
    let timeContext = '';
    if (hour < 12 && Math.random() > 0.8) {
      timeContext = ' Утренний анализ показывает интересные паттерны.';
    } else if (hour > 18 && Math.random() > 0.8) {
      timeContext = ' Вечерний обзор выявляет новые возможности.';
    }

    const finalResponse = personalizedPrefix + selectedResponse + timeContext;

    return {
      content: finalResponse,
      reasoning: `🎭 Demo режим: ${this.preferredModel} - мысль #${thoughtCount + 1}`,
      confidence: 0.78 + Math.random() * 0.17 // Случайная уверенность 78-95%
    };
  }

  private publishThought(thought: AgentThought): void {
    this.eventBus.publish('agent_thought', thought);
    
    // Дополнительно публикуем для UI
    this.eventBus.publish('thought_stream_update', {
      agentId: this.id,
      thought,
      timestamp: new Date()
    });
  }

  private async generateAdditionalThoughts(task: any): Promise<void> {
    // Генерируем серию связанных мыслей
    const additionalPrompts = [
      `Какие потенциальные проблемы ты видишь в этой задаче?`,
      `Какие ресурсы или инструменты потребуются для решения?`,
      `Как бы ты предложил разбить эту задачу на этапы?`
    ];

    for (const prompt of additionalPrompts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Пауза для естественности
      
      if (!this.isThinking) break; // Прерываем если задача отменена
      
      const thought = await this.generateThought(prompt, task.id);
      this.publishThought(thought);
    }
  }

  private async seekCollaboration(task: any): Promise<void> {
    // Анализируем нужна ли коллаборация с другими агентами
    const collaborationPrompt = `Для решения этой задачи тебе нужна помощь других агентов? 
    Если да, то с кем именно и по какому вопросу?`;
    
    const thought = await this.generateThought(collaborationPrompt, task.id);
    
    // Если агент считает что нужна коллаборация, инициируем ее
    if (thought.thought.toLowerCase().includes('да') || 
        thought.thought.toLowerCase().includes('нужна') ||
        thought.thought.toLowerCase().includes('помощь')) {
      
      this.eventBus.publish('collaboration_request', {
        fromAgent: this.id,
        fromAgentName: this.name,
        reason: thought.thought,
        timestamp: new Date(),
        taskId: task.id
      });
    }

    this.publishThought(thought);
  }

  private async processAgentMessage(message: AgentMessage): Promise<void> {
    this.messageHistory.push(message);
    
    // Генерируем ответ на сообщение
    const responsePrompt = `Агент ${message.fromAgent} написал тебе: "${message.content}". 
    Как ты отвечаешь с позиции своей роли ${this.role}?`;
    
    const responseThought = await this.generateThought(responsePrompt, 'collaboration');
    
    // Отправляем ответ
    const response: AgentMessage = {
      id: `msg_${this.id}_${Date.now()}`,
      fromAgent: this.id,
      toAgent: message.fromAgent,
      content: responseThought.thought,
      messageType: 'response',
      timestamp: new Date(),
      aiGenerated: true,
      model: this.preferredModel
    };

    this.eventBus.publish('agent_message', response);
    this.publishThought(responseThought);
  }

  private async analyzeOtherAgentThought(thought: AgentThought): Promise<void> {
    // Дополнительная проверка throttling
    if (Date.now() - this.lastThoughtTime < this.thoughtCooldown) return;
    
    // Увеличиваем шанс реакции на мысли других агентов для более активного взаимодействия
    if (Math.random() > 0.6) { // 40% шанс проанализировать мысль другого агента
      const analysisPrompt = `Коллега ${thought.agentName} размышляет: "${thought.thought}". 
      Как ${this.role} с твоим опытом, что ты думаешь об этом? Есть ли что добавить или альтернативные идеи?`;
      
      const analysisThought = await this.generateThought(analysisPrompt, 'analysis');
      analysisThought.relatedThoughts = [thought.id];
      
      this.publishThought(analysisThought);

      // Иногда инициируем прямое сообщение агенту
      if (Math.random() > 0.8) {
        const directMessage: AgentMessage = {
          id: `msg_${this.id}_${Date.now()}`,
          fromAgent: this.id,
          toAgent: thought.agentId,
          content: `${thought.agentName}, интересная мысль! Как ${this.role}, я думаю: ${analysisThought.thought.substring(0, 200)}...`,
          messageType: 'response',
          timestamp: new Date(),
          aiGenerated: true,
          model: this.preferredModel
        };

        this.eventBus.publish('agent_message', directMessage);
      }
    }
  }

  private extractTags(content: string): string[] {
    const tags = [];
    
    // Проверяем что content это строка
    const contentStr = typeof content === 'string' ? content : String(content || '');
    const lowerContent = contentStr.toLowerCase();
    
    // Простое извлечение тегов на основе ключевых слов
    if (lowerContent.includes('архитектур')) tags.push('architecture');
    if (lowerContent.includes('код') || lowerContent.includes('программ')) tags.push('coding');
    if (lowerContent.includes('анализ')) tags.push('analysis');
    if (lowerContent.includes('проблем')) tags.push('problem');
    if (lowerContent.includes('решен')) tags.push('solution');
    if (lowerContent.includes('тест')) tags.push('testing');
    
    return tags;
  }

  // Публичные методы для получения состояния
  public getThoughtHistory(): AgentThought[] {
    return [...this.thoughtHistory];
  }

  public getMessageHistory(): AgentMessage[] {
    return [...this.messageHistory];
  }

  public isCurrentlyThinking(): boolean {
    return this.isThinking;
  }

  public getAgentInfo() {
    return {
      id: this.id,
      name: this.name,
      role: this.role,
      personality: this.personality,
      model: this.preferredModel,
      thoughtCount: this.thoughtHistory.length,
      messageCount: this.messageHistory.length,
      isThinking: this.isThinking
    };
  }
}
