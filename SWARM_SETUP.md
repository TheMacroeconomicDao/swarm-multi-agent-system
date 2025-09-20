# 🐝 Swarm Multi-Agent System Setup

## Revolutionary Agent-Based Development Platform

Этот проект представляет собой продвинутую систему роевых агентов для разработки ПО, основанную на концепциях из статьи о переходе от "вайбкодинга" к агентному роевому программированию.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка OpenAI API

Создайте файл `.env` в корне проекта:

```env
OPENAI_API_KEY=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
```

### 3. Запуск системы

```bash
npm run dev
```

## 🧠 Архитектура роевой системы

### Основные компоненты

1. **SwarmCoordinator** - Главный координатор роя
2. **SwarmAgent** - Базовый класс для роевых агентов
3. **FrontendSwarmAgent** - Специализированный агент для фронтенда
4. **BackendSwarmAgent** - Специализированный агент для бэкенда
5. **TestingSwarmAgent** - Специализированный агент для тестирования

### Системы поддержки

- **ContextManager** - Управление контекстом и оптимизация
- **QualityValidator** - Валидация качества кода
- **CostOptimizer** - Оптимизация затрат на API
- **OpenAIClient** - Интеграция с OpenAI API

## 🎯 Ключевые возможности

### Роевое программирование
- Параллельная обработка задач несколькими агентами
- Интеллектуальное распределение задач
- Автоматическая координация между агентами

### Оптимизация затрат
- Умный выбор моделей AI
- Сжатие контекста
- Кэширование результатов
- Батчевая обработка

### Контроль качества
- Автоматическая валидация кода
- Анализ качества и производительности
- Проверка безопасности
- Генерация тестов

## 🔧 Конфигурация

### Переменные окружения

```env
# OpenAI Configuration
OPENAI_API_KEY=your_api_key_here
OPENAI_DEFAULT_MODEL=gpt-4
OPENAI_COST_OPTIMIZATION=true

# Swarm Configuration
SWARM_MAX_PARALLEL_EXECUTIONS=5
SWARM_QUALITY_THRESHOLD=75

# Cost Management
DAILY_COST_LIMIT=50
MONTHLY_COST_LIMIT=1000
COST_WARNING_THRESHOLD=80
COST_CRITICAL_THRESHOLD=95
```

### Настройка агентов

Каждый агент можно настроить через конфигурацию:

```typescript
const capabilities: SwarmAgentCapabilities = {
  domains: ['frontend', 'ui', 'ux'],
  languages: ['typescript', 'javascript'],
  frameworks: ['react', 'vue', 'angular'],
  maxComplexity: 8,
  parallelTasks: 3,
  specialization: ['component-design', 'state-management']
};
```

## 📊 Мониторинг и метрики

### Метрики роевой системы
- Общее количество задач
- Средний балл качества
- Процент успешности
- Эффективность затрат

### Активные выполнения
- Отслеживание текущих задач
- Статус агентов
- Качество результатов
- Затраты на выполнение

## 🛠️ Разработка

### Добавление нового агента

1. Создайте класс, наследующий от `SwarmAgent`
2. Реализуйте необходимые методы
3. Зарегистрируйте агента в `SwarmCoordinator`

```typescript
export class CustomSwarmAgent extends SwarmAgent {
  protected async processSwarmTask(task: SwarmTask): Promise<AgentResponse> {
    // Ваша логика обработки задач
  }
}
```

### Кастомизация валидации

```typescript
const customValidator = new QualityValidator();
customValidator.setQualityThresholds({
  minimum: 70,
  good: 85,
  excellent: 95
});
```

## 🚨 Устранение неполадок

### Проблемы с API
- Проверьте правильность API ключа
- Убедитесь в наличии интернет-соединения
- Проверьте лимиты API

### Проблемы с производительностью
- Уменьшите `SWARM_MAX_PARALLEL_EXECUTIONS`
- Включите `OPENAI_COST_OPTIMIZATION`
- Проверьте настройки кэширования

### Проблемы с качеством
- Увеличьте `SWARM_QUALITY_THRESHOLD`
- Проверьте настройки валидации
- Убедитесь в правильности промптов

## 📈 Оптимизация

### Снижение затрат
1. Используйте более дешевые модели для простых задач
2. Включите сжатие контекста
3. Настройте кэширование
4. Используйте батчевую обработку

### Повышение качества
1. Настройте валидацию качества
2. Используйте специализированных агентов
3. Увеличьте пороги качества
4. Добавьте дополнительные проверки

## 🔮 Будущие улучшения

- Интеграция с другими AI моделями
- Расширенная аналитика
- Автоматическое обучение агентов
- Интеграция с CI/CD
- Поддержка большего количества языков и фреймворков

## 📚 Дополнительные ресурсы

- [Статья о роевом программировании](https://share.google/fHLa0AtLNVOzMbeSX)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие системы! Пожалуйста, создавайте issues и pull requests для улучшения функциональности.

## 📄 Лицензия

MIT License - см. файл LICENSE для подробностей.
