# 🚀 VAPE AI: ENTERPRISE 2.0 ARCHITECTURE

Документ описывает целевую архитектуру уровня **SaaS / AI-commerce платформы** (Enterprise 2.0). Эта архитектура предназначена для масштабирования до сотен тысяч продавцов (Multi-tenant), обработки высоких нагрузок (High-load) и обеспечения максимальной гибкости AI-инфраструктуры.

---

## 🏗 1. ПОЛНАЯ MICROSERVICES-КАРТА

Архитектура переходит от монолитного API к событийно-ориентированной микросервисной модели.

```text
                        ┌──────────────────┐
                        │   Cloud Load Balancer
                        └─────────┬────────┘
                                  │
                        ┌─────────▼────────┐
                        │   API Gateway    │
                        │ (Rust / Axum)    │
                        └─────────┬────────┘
                                  │
     ┌───────────────┬────────────┼───────────────┬────────────────┐
     ▼               ▼            ▼               ▼                ▼
Auth Service     Marketplace   Seller Service  Admin Service    Bot Service
(RBAC, JWT)      Service       (Multi-tenant)  (Audit, Control) Telegram
                                  │
                                  ▼
                          Event Bus (NATS/Kafka)
                                  │
    ┌───────────────┬─────────────┼──────────────┬───────────────┐
    ▼               ▼             ▼              ▼               ▼
AI Service      Search Service  Pricing Engine  Fraud Engine   Analytics
(Python)        (Meili)         (Repricing AI)  (AI Risk)      Pipeline
                                  │
                                  ▼
                 PostgreSQL / Redis / Qdrant / Object Storage
```

---

## 🏢 2. MULTI-TENANT МОДЕЛЬ (КРИТИЧНО)

Платформа становится SaaS-решением. Каждый продавец или бренд является отдельным тенантом.

В **каждой** таблице базы данных обязательно присутствует:
\`tenant_id (uuid)\`

### Базовая структура:
```sql
CREATE TABLE tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    plan VARCHAR(50), -- basic, pro, enterprise
    ai_usage_limit INT,
    created_at TIMESTAMP
);
```

Все сущности (`products`, `orders`, `users`, `seller_profiles`, `ai_logs`, `telegram_users`) имеют `tenant_id`.
**Преимущества:**
✔ Полноценная SaaS модель (B2B2C).
✔ Изоляция данных на уровне БД (Row-Level Security в PostgreSQL).
✔ Раздельные тарифы и лимиты на использование AI.

---

## ⚡ 3. EVENT-DRIVEN СЛОЙ (NATS / Kafka)

Все ключевые действия в системе публикуют события в Event Bus.

**Примеры событий:**
* `ProductCreated`
* `OrderCompleted`
* `SearchPerformed`
* `AITriggered`
* `SellerCommissionUpdated`

**Зачем это нужно:**
* Асинхронная AI аналитика (не блокирует ответ пользователю).
* Fraud detection в реальном времени.
* Триггеры для AI-Автоценника (Repricing).
* Наполнение BI (Business Intelligence) пайплайна.

---

## 🧠 4. AI ABSTRACTION LAYER

Чтобы не зависеть от одного вендора (Google Gemini), вводится слой абстракции провайдеров LLM.

```typescript
interface LLMProvider {
   generate(prompt: string, context: any): Promise<Response>;
   embed(text: string): Promise<Vector>;
   moderate(content: string): Promise<ModerationResult>;
}
```

**Адаптеры:**
* `GeminiAdapter` (Текущий)
* `OpenAIAdapter`
* `ClaudeAdapter`
* `LocalLLMAdapter` (Llama 3 для секьюрных данных)

---

## 🗄 5. AI MEMORY ARCHITECTURE

Продвинутая система памяти для Telegram-бота и AI-ассистента:

1. **Short-term (Redis)**: Контекст текущей сессии (последние 20 сообщений).
2. **Long-term (PostgreSQL)**: Извлеченные факты (любимые вкусы, бюджет).
3. **Semantic recall (Qdrant)**: Векторный поиск по прошлым успешным диалогам.
4. **Auto summarization**: Сжатие длинных диалогов LLM-моделью в саммари.
5. **Confidence decay**: Устаревание фактов со временем (вкусы меняются).

**Объект памяти:**
```json
{
  "key": "favorite_flavor",
  "value": "mango ice",
  "confidence": 0.95,
  "last_reinforced_at": "2026-02-26T10:00:00Z",
  "ttl": 2592000
}
```

---

## 🛡 6. SECURITY LAYER ENTERPRISE

Усиление безопасности на уровне API Gateway и Frontend:
✔ **CSP Headers** (Content Security Policy).
✔ **CSRF Protection**.
✔ **JWT Rotation & Refresh Tokens**.
✔ **Role Permission Matrix** (Детальные права доступа).
✔ **Bot Abuse Detection** (Защита от парсинга и спама).
✔ **Prompt Injection Filter** (Защита LLM от взлома через системные промпты).

---

## 📊 7. OBSERVABILITY STACK

Полный контроль над состоянием системы:
* **Трейсинг**: OpenTelemetry.
* **Метрики**: Prometheus + Grafana.
* **Ошибки**: Sentry.
* **Логи**: Centralized logs (ELK / Loki).

**Ключевые AI-метрики:**
* AI Latency (Время ответа LLM и Qdrant).
* Sale Probability Accuracy (Точность предсказания покупки).
* Conversion per Prompt (Конверсия в зависимости от версии промпта).
* Search Success Rate.

---

## 💰 8. AI PRICING ENGINE (Advanced Repricing)

Переход от базового повышения цены при дефиците к полноценному ML-движку:
* **Elasticity modeling**: Вычисление эластичности спроса.
* **Competitor price scraping**: Парсинг цен конкурентов.
* **Demand forecast model**: Прогнозирование спроса (сезонность, тренды).
* **Bayesian update strategy**: Обновление вероятностей покупки при изменении цены.
* **Seller override rules**: Ручные лимиты (min/max цена) от продавца.

---

## 🔄 9. DATA SYNC STRATEGY (CDC)

Source of truth (Единый источник истины) — **PostgreSQL**.
Синхронизация поисковых индексов происходит через Change Data Capture (CDC):

* `PostgreSQL` → `Event Bus` → `Meilisearch index update` (Лексический поиск).
* `PostgreSQL` → `Event Bus` → `Qdrant embedding update` (Семантический поиск).

---

## 💳 10. USAGE METERING & BILLING

Каждый вызов AI логируется для биллинга тенантов (продавцов):

```sql
CREATE TABLE ai_usage_logs (
    id UUID PRIMARY KEY,
    tenant_id UUID,
    tokens_used INT,
    model VARCHAR(50),
    cost DECIMAL(10, 6),
    created_at TIMESTAMP
);
```
**Возможности:**
✔ Выставление счетов (Pay-as-you-go).
✔ Ограничение использования (Hard limits).
✔ Отключение AI-фич при неоплате.

---

## 📈 11. SCALING STRATEGY

* **Frontend**: Раздача статики через CDN (Vercel / Cloudflare).
* **API Gateway (Rust)**: Autoscaling groups (CPU/RAM based).
* **AI Service (Python)**: Horizontal scaling (GPU-ноды по требованию).
* **Database**: Read replicas для PostgreSQL.
* **Vector DB**: Qdrant Cluster mode (Distributed).

---

## 🎯 12. ENTERPRISE 2.0 ROADMAP

### Phase 1: Core Infrastructure
* Внедрение Multi-tenant архитектуры (tenant_id).
* Развертывание Rust API Gateway.
* Настройка Event Bus (NATS/Kafka).

### Phase 2: AI & Observability
* Внедрение LLM Abstraction Layer.
* Система AI Billing & Metering.
* Развертывание Observability Stack (Prometheus, Grafana, OpenTelemetry).

### Phase 3: Advanced Intelligence
* Fraud AI Engine.
* Advanced Repricing Engine (Эластичность спроса).
* BI Layer (Business Intelligence для продавцов).

---
*С этой архитектурой проект становится полноценной SaaS AI-commerce платформой, готовой к масштабированию, высоким нагрузкам и привлечению инвестиций.*
