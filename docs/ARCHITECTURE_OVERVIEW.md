# 🏢 VAPE AI: ENTERPRISE ARCHITECTURE OVERVIEW

Этот документ описывает полную архитектуру платформы VapeAI, реализованную на данный момент. Платформа представляет собой Enterprise B2B/B2C маркетплейс с глубокой интеграцией искусственного интеллекта (LLM + RAG) на всех уровнях: от поиска товаров до автоматизации продаж в Telegram.

---

## 🏗 1. ОБЩАЯ АРХИТЕКТУРА СИСТЕМЫ

Система спроектирована по микросервисной архитектуре (Microservices + Event-Driven).

### 🔹 Frontend (Текущая реализация)
* **Стек**: Next.js 15 (App Router), React 19, Tailwind CSS v4, TypeScript, Framer Motion (motion/react), Recharts.
* **Роль**: SPA-клиент для покупателей, продавцов и администраторов.
* **Особенности**: Glassmorphism UI, оптимизация под мобильные устройства, SSR/SSG где применимо.

### 🔹 Backend Gateway (Rust / Axum) — *Проектирование*
* **Роль**: Основной API Gateway, маршрутизация, Rate Limiting, RBAC (Role-Based Access Control), бизнес-логика маркетплейса (заказы, корзина, финансы).
* **База данных**: PostgreSQL (Реляционные данные: пользователи, товары, транзакции).
* **Кэш**: Redis (Сессии, Rate Limit, корзины).

### 🔹 AI Service (Python / FastAPI) — *Проектирование*
* **Роль**: Изолированный микросервис для тяжелых ML-задач.
* **LLM**: Google Gemini API (через `@google/genai`).
* **Векторная БД**: Qdrant (Хранение эмбеддингов товаров, FAQ, истории диалогов).
* **Поисковый движок**: Meilisearch (Лексический поиск) + Qdrant (Семантический поиск).

---

## 🧩 2. РЕАЛИЗОВАННЫЕ МОДУЛИ (FRONTEND & MOCK API)

### 🛍 2.1. Клиентская часть (B2C)
* **Главная страница (`/`)**: Hero-секция, преимущества, динамический каталог.
* **AI-Поиск (ProductGrid)**:
  * Гибридный поиск (имитация Meilisearch + Qdrant).
  * Автодополнение (Autocomplete) при вводе.
  * Понимание естественного языка (например, "что-то сладкое и легкое").
* **Корзина и Чекаут (`/cart`, `/checkout`)**: Управление состоянием (Context API), расчет налогов, мок-оплата.
* **SEO Блог (`/blog`)**: Статьи, сгенерированные AI для органического трафика.

### 🏪 2.2. Enterprise Seller Dashboard (`/dashboard/seller`)
Кабинет продавца для управления бизнесом:
* **Аналитика**: Графики выручки, конверсии (CTR), остатки на складе.
* **AI-Генератор карточек**: Автоматическое создание SEO-описаний, подбор ключевых слов и расчет оптимальной цены по 2-3 словам описания.
* **AI Автоценник (Repricing)**: Движок динамического ценообразования (повышение цены при дефиците у конкурентов).
* **Прогноз спроса**: Предупреждения о падении тренда на конкретные товары.

### 🛡 2.3. Enterprise Admin Panel (`/dashboard/admin`)
Центр управления всей платформой:
* **Global Analytics**: GMV платформы, доход с комиссий, AI Search Success Rate.
* **Управление продавцами**: Trust Level, индивидуальные комиссии, AI Fraud Risk (оценка риска мошенничества).
* **AI Модерация**: Очередь товаров с оценкой Spam Score и поиском запрещенных слов.
* **Финансы**: Выплаты селлерам, замороженные средства.

### 🤖 2.4. AI Control Center & Telegram Bot (`/telegram-demo`)
Полноценный AI-канал продаж (Sales Bot) с управлением из админки:
* **Управление Personality (Админка)**:
  * Настройка System Prompt.
  * Выбор тональности (Дружелюбный, Профессиональный, Агрессивный Upsell).
  * Настройка интенсивности продаж (Sales Intensity).
* **Технические настройки (Админка)**:
  * Управление долгосрочной памятью (Memory).
  * Настройка Temperature, Max Tokens, Similarity Threshold (RAG).
* **Telegram Demo UI**: Интерактивный симулятор чата с ботом.
* **AI Pipeline (Webhook)**:
  * Определение интента (покупка, консультация, жалоба).
  * Расчет вероятности продажи (Sale Probability).
  * **Memory Extraction**: Автоматическое извлечение фактов о пользователе (любимые вкусы, бюджет) из диалога для сохранения в БД.

### 📊 2.5. Инфраструктура
* **Analytics (`/lib/analytics.ts`)**: Трекинг событий (`page_view`, `purchase`, `ai_search`) для последующей отправки в PostHog/Mixpanel.
* **Security (`/middleware.ts`)**: Базовый WAF (Rate Limiting по IP) и Security Headers.

---

## 🗄 3. СТРУКТУРА БАЗЫ ДАННЫХ (Спроектировано для PostgreSQL)

### RBAC (Управление доступом)
* `users`, `roles`, `user_roles`, `permissions`, `role_permissions`

### Marketplace Core
* `products`, `categories`, `orders`, `order_items`

### Seller Enterprise
* `seller_profiles` (Trust level, commission rate)
* `seller_commissions` (Финансы)
* `product_ai_scores` (Аналитика спроса, оптимальная цена)
* `moderation_queue` (Очередь проверки AI)

### Telegram AI Layer
* `tg_users` (Фингерпринт, fraud score)
* `tg_sessions` (Контекст диалога)
* `tg_dialog_logs` (Векторы диалогов для дообучения)
* `tg_user_memory` (Долгосрочная память: любимые вкусы, чувствительность к цене)
* `tg_bot_settings` (Промпты, thresholds)

---

## 🚀 4. ЧТО ДАЛЬШЕ (ROADMAP)

1. **Backend Development (Rust)**: Реализация спроектированных эндпоинтов (`/api/admin/*`, `/api/seller/*`) и подключение PostgreSQL.
2. **AI Microservice (Python)**: Развертывание FastAPI сервиса, подключение Qdrant, реализация реального пайплайна векторизации (Embedding).
3. **Event Bus (Kafka/NATS)**: Настройка асинхронного взаимодействия между Rust и Python (например, для фоновой модерации товаров).
4. **Telegram Bot Integration**: Подключение реального Telegram Bot API к нашему Webhook.
