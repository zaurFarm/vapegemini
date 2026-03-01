# 🏢 ENTERPRISE PLATFORM ARCHITECTURE

Документация по архитектуре ролевой модели, базы данных и API для Enterprise-версии маркетплейса VapeAI.

---

## 1. РОЛЕВАЯ МОДЕЛЬ (RBAC)

Система контроля доступа базируется на строгой иерархии ролей и гранулярных пермиссиях.

### Базовые таблицы RBAC (PostgreSQL)
```sql
CREATE TABLE roles (
    id UUID PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL, -- super_admin, platform_admin, finance_manager, content_moderator, seller, seller_manager, buyer
    description TEXT
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'approve_seller', 'edit_system_prompt', 'view_global_finance'
    module VARCHAR(50)
);

CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id),
    permission_id UUID REFERENCES permissions(id),
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id),
    role_id UUID REFERENCES roles(id),
    PRIMARY KEY (user_id, role_id)
);
```

---

## 2. РАСШИРЕНИЕ БАЗЫ ДАННЫХ (Marketplace & AI)

```sql
-- Профили продавцов
CREATE TABLE seller_profiles (
    id UUID PRIMARY KEY REFERENCES users(id),
    company_name VARCHAR(255),
    trust_level INT DEFAULT 50, -- 0-100
    custom_commission_rate DECIMAL(5,2),
    status VARCHAR(20) -- pending, active, blocked
);

-- Финансы и комиссии
CREATE TABLE seller_commissions (
    id UUID PRIMARY KEY,
    seller_id UUID REFERENCES seller_profiles(id),
    order_id UUID REFERENCES orders(id),
    amount DECIMAL(10,2),
    commission_amount DECIMAL(10,2),
    status VARCHAR(20) -- hold, available, paid
);

-- Очередь модерации AI
CREATE TABLE moderation_queue (
    id UUID PRIMARY KEY,
    product_id UUID REFERENCES products(id),
    ai_spam_score FLOAT,
    ai_forbidden_words JSONB,
    status VARCHAR(20) -- pending, approved, rejected
);

-- AI Аналитика товаров
CREATE TABLE product_ai_scores (
    product_id UUID PRIMARY KEY REFERENCES products(id),
    demand_risk_score FLOAT,
    optimal_price DECIMAL(10,2),
    competitiveness_index INT
);
```

---

## 3. BACKEND API СТРУКТУРА (Rust / Axum)

### 🛡 Admin Endpoints (`/api/admin/*`)
* `GET /admin/platform/stats` - Глобальная аналитика (GMV, комиссии).
* `GET /admin/users` - Список пользователей и селлеров.
* `PUT /admin/user/:id/block` - Блокировка пользователя.
* `PUT /admin/seller/:id/commission` - Установка индивидуальной комиссии.
* `GET /admin/moderation/queue` - Очередь товаров на проверку.
* `POST /admin/moderation/approve/:id` - Одобрение товара.
* `GET /admin/finance/payouts` - Выплаты селлерам.
* `GET /admin/ai/logs` - Логи AI (Similarity scores, RAG chunks).
* `PUT /admin/ai/config` - Настройка System Prompt и Thresholds.

### 🛍 Seller Endpoints (`/api/seller/*`)
* `GET /seller/dashboard/stats` - Дашборд (Выручка, маржа, конверсия).
* `GET /seller/products` - Список товаров со статусами модерации.
* `POST /seller/products/bulk` - Массовый импорт (CSV).
* `PUT /seller/products/:id/repricing` - Включение AI Автоценника.
* `GET /seller/analytics` - Графики продаж, CTR, возвраты.
* `POST /seller/ai/generate-description` - AI генерация SEO-карточки.

---

## 4. МЕТРИКИ КАЧЕСТВА (KPIs)

**Для платформы (Admin):**
* **GMV (Gross Merchandise Volume)**: Общий объем продаж.
* **Commission %**: Эффективная ставка комиссии.
* **Seller Churn**: Отток продавцов.
* **AI Search Success Rate**: % поисков, завершившихся добавлением в корзину.

**Для продавца (Seller):**
* **Revenue Growth**: Рост выручки (MoM).
* **Inventory Turnover**: Оборачиваемость запасов.
* **Product CTR**: Кликабельность карточек в каталоге.
* **AI Content Score**: Оценка качества описания от AI.
