/**
 * API Client для взаимодействия с Rust Backend Gateway
 * Согласно Enterprise ТЗ (Раздел 3.3 AI Proxy Layer)
 */

const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || '/api/v1';

export const apiClient = {
  // 1. Marketplace Core
  products: {
    getAll: async () => fetch(`${API_URL}/products`).then(res => res.json()),
    getById: async (id: string) => fetch(`${API_URL}/products/${id}`).then(res => res.json()),
    search: async (query: string) => fetch(`${API_URL}/products/search?q=${query}`).then(res => res.json()),
  },
  
  // 2. AI Proxy Layer (Rust -> Python)
  ai: {
    semanticSearch: async (query: string) => 
      fetch(`${API_URL}/ai/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      }).then(res => res.json()),
      
    getSuggestions: async (query: string) =>
      fetch(`${API_URL}/ai/suggestions?q=${encodeURIComponent(query)}`).then(res => res.json()),
      
    recommendProducts: async (userId: string) => 
      fetch(`${API_URL}/ai/recommendations/${userId}`).then(res => res.json()),
      
    chat: async (message: string, history: any[]) => 
      fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      }).then(res => res.json()),
  },

  // 3. Auth & RBAC
  auth: {
    login: async (credentials: any) => 
      fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      }).then(res => res.json()),
  },

  // 4. Admin & Analytics
  admin: {
    getStats: async () => fetch(`${API_URL}/admin/stats`).then(res => res.json()),
  }
};
