// 📅 DATE UTILITIES - Безопасная работа с датами и временем
// Utility functions for safe date/time formatting

import { DEFAULTS } from '@/config/constants';

/**
 * Безопасно форматирует timestamp в строку времени
 */
export function safeFormatTime(timestamp: Date | string | number | undefined): string {
  try {
    if (!timestamp) {
      return new Date().toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    }

    let date: Date;
    
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else {
      date = new Date();
    }

    // Проверяем что дата валидна
    if (isNaN(date.getTime())) {
      date = new Date();
    }

    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

  } catch (error) {
    console.warn('Error formatting time:', error);
    return new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}

/**
 * Безопасно форматирует timestamp в строку даты
 */
export function safeFormatDate(timestamp: Date | string | number | undefined): string {
  try {
    if (!timestamp) {
      return new Date().toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric'
      });
    }

    let date: Date;
    
    if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) {
      date = new Date();
    }

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  } catch (error) {
    console.warn('Error formatting date:', error);
    return new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}

/**
 * Безопасно форматирует timestamp в полную строку даты и времени
 */
export function safeFormatDateTime(timestamp: Date | string | number | undefined): string {
  return `${safeFormatDate(timestamp)} ${safeFormatTime(timestamp)}`;
}

/**
 * Возвращает человеко-читаемую строку "время назад"
 */
export function getRelativeTime(timestamp: Date | string | number | undefined): string {
  try {
    if (!timestamp) return 'только что';

    let date: Date;
    
    if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) {
      return 'только что';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
      return 'только что';
    } else if (diffMinutes < 60) {
      return `${diffMinutes} мин. назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч. назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн. назад`;
    } else {
      return safeFormatDate(timestamp);
    }

  } catch (error) {
    console.warn('Error calculating relative time:', error);
    return 'только что';
  }
}

/**
 * Проверяет валидность timestamp
 */
export function isValidTimestamp(timestamp: any): boolean {
  if (!timestamp) return false;
  
  try {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Создает безопасный timestamp
 */
export function createSafeTimestamp(): Date {
  return new Date();
}

/**
 * Форматирует длительность в миллисекундах в читаемый формат
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}мс`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(1)}с`;
  } else if (ms < 3600000) {
    return `${(ms / 60000).toFixed(1)}м`;
  } else {
    return `${(ms / 3600000).toFixed(1)}ч`;
  }
}

