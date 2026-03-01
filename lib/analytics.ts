// Mock Analytics Utility for Phase 7

type EventType = 
  | 'page_view'
  | 'product_view'
  | 'add_to_cart'
  | 'purchase'
  | 'search'
  | 'ai_search'
  | 'ai_chat_interaction'
  | 'telegram_bot_interaction';

interface EventPayload {
  userId?: string;
  sessionId?: string;
  [key: string]: any;
}

class Analytics {
  private sessionId: string;

  constructor() {
    // Generate a simple session ID
    this.sessionId = typeof window !== 'undefined' 
      ? (localStorage.getItem('session_id') || Math.random().toString(36).substring(2))
      : 'server_session';
      
    if (typeof window !== 'undefined' && !localStorage.getItem('session_id')) {
      localStorage.setItem('session_id', this.sessionId);
    }
  }

  track(event: EventType, payload: EventPayload = {}) {
    const data = {
      event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      ...payload
    };

    // In a real app, this would send data to PostHog / Mixpanel / Custom Backend
    console.log(`[ANALYTICS] ${event}`, data);

    // We can also send this to our Rust API Gateway for custom AI analytics
    // fetch('/api/v1/analytics/track', { method: 'POST', body: JSON.stringify(data) });
  }

  trackSearch(query: string, isAi: boolean, resultsCount: number) {
    this.track(isAi ? 'ai_search' : 'search', { query, resultsCount });
  }

  trackPurchase(orderId: string, total: number, items: any[]) {
    this.track('purchase', { orderId, total, itemsCount: items.length });
  }
}

export const analytics = new Analytics();
