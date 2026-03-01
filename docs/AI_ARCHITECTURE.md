# 🏗 ENTERPRISE AI ARCHITECTURE & IMPLEMENTATION PLAN

Данный документ является техническим руководством для команды разработки по внедрению гибридного AI-поиска и строгой RAG-системы.

---

## 1. СТРУКТУРА РЕПОЗИТОРИЯ (Monorepo)

\`\`\`text
vapeai-platform/
├── frontend/                 # Next.js 15 (Уже реализован)
├── backend-rust/             # Core API Gateway (Rust + Axum)
│   ├── src/
│   │   ├── main.rs           # Точка входа
│   │   ├── api/              # HTTP роуты (Axum)
│   │   │   ├── search.rs     # Hybrid Search endpoint
│   │   │   └── auth.rs
│   │   ├── services/         # Бизнес-логика
│   │   │   ├── meilisearch.rs# Клиент лексического поиска
│   │   │   └── ai_client.rs  # gRPC/HTTP клиент к Python AI
│   │   ├── models/           # Структуры БД (SQLx)
│   │   └── config/           # Конфигурация
│   ├── Cargo.toml
│   └── Dockerfile
├── ai-service-python/        # AI & RAG Engine (FastAPI)
│   ├── app/
│   │   ├── main.py           # FastAPI app
│   │   ├── api/
│   │   │   ├── search.py     # Semantic search endpoint
│   │   │   ├── chat.py       # RAG chat endpoint
│   │   │   └── ingest.py     # Векторизация данных
│   │   ├── core/
│   │   │   ├── qdrant.py     # Подключение к векторной БД
│   │   │   ├── llm.py        # Промпты и вызовы LLM
│   │   │   └── reranker.py   # Логика Re-ranking
│   │   └── models/           # Pydantic схемы
│   ├── requirements.txt
│   └── Dockerfile
└── docker-compose.yml        # Инфраструктура (Postgres, Redis, Qdrant, Meilisearch)
\`\`\`

---

## 2. RUST API GATEWAY (Hybrid Search Logic)

**Файл:** \`backend-rust/src/api/search.rs\`

\`\`\`rust
use axum::{Json, extract::State};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct SearchQuery {
    pub query: String,
    pub filters: Option<Filters>,
}

#[derive(Serialize)]
pub struct SearchResult {
    pub id: String,
    pub score: f32,
    pub source: String, // "hybrid", "lexical", "semantic"
}

pub async fn hybrid_search(
    State(state): State<AppState>,
    Json(payload): Json<SearchQuery>,
) -> Json<Vec<SearchResult>> {
    // 1. Параллельные запросы к Meilisearch и Python AI
    let (lexical_res, semantic_res) = tokio::join!(
        state.meili_client.search(&payload.query),
        state.ai_client.semantic_search(&payload.query)
    );

    // 2. Объединение и Re-ranking
    let mut combined_results = rerank_results(lexical_res.unwrap(), semantic_res.unwrap());
    
    // 3. Сортировка по FinalScore
    combined_results.sort_by(|a, b| b.score.partial_cmp(&a.score).unwrap());
    
    // 4. Возврат Топ-10
    combined_results.truncate(10);
    Json(combined_results)
}

fn rerank_results(lexical: Vec<Item>, semantic: Vec<Item>) -> Vec<SearchResult> {
    // Логика: FinalScore = 0.5 * lexical_score + 0.4 * semantic_score + 0.1 * popularity
    // ...
}
\`\`\`

---

## 3. PYTHON AI SERVICE (RAG & Semantic Search)

**Файл:** \`ai-service-python/app/api/search.py\`

\`\`\`python
from fastapi import APIRouter, Depends
from app.core.qdrant import get_qdrant_client
from sentence_transformers import SentenceTransformer

router = APIRouter()
model = SentenceTransformer('paraphrase-multilingual-mpnet-base-v2')

@router.post("/semantic-search")
async def semantic_search(query: str, qdrant=Depends(get_qdrant_client)):
    # 1. Векторизация запроса
    embedding = model.encode(query).tolist()
    
    # 2. Поиск в Qdrant
    results = qdrant.search(
        collection_name="product_embeddings",
        query_vector=embedding,
        limit=20,
        score_threshold=0.72 # Строгий фильтр релевантности
    )
    
    # 3. Форматирование ответа
    return [{"id": hit.payload["product_id"], "score": hit.score} for hit in results]
\`\`\`

**Файл:** \`ai-service-python/app/core/llm.py\` (Строгий RAG Промпт)

\`\`\`python
ENTERPRISE_SYSTEM_PROMPT = """
Ты профессиональный консультант по вейп продукции маркетплейса VapeAI.

ПРАВИЛА:
1. Отвечай ТОЛЬКО по вейп тематике.
2. Используй ТОЛЬКО данные из переданного контекста (RAG).
3. НЕ придумывай факты, цены или вкусы.
4. НЕ давай медицинские советы (напоминай, что никотин вызывает привыкание).
5. Если вопрос не относится к вейп тематике — отвечай: "Извините, я консультирую только по ассортименту VapeAI."

КОНТЕКСТ:
{context}
"""
\`\`\`

---

## 4. СХЕМА БАЗ ДАННЫХ

### PostgreSQL (Core Data)
\`\`\`sql
CREATE TABLE ai_logs (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    query TEXT NOT NULL,
    intent VARCHAR(50),
    retrieved_chunks JSONB,
    final_answer TEXT,
    similarity_score FLOAT,
    created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Qdrant (Vector Data)
Коллекция: \`product_embeddings\`
* Vector size: 768 (зависит от модели)
* Distance: Cosine
* Payload:
  \`\`\`json
  {
    "product_id": "uuid",
    "category": "disposable",
    "price": 15.99,
    "popularity_score": 85
  }
  \`\`\`

---

## 5. ИНФРАСТРУКТУРА (docker-compose.yml)

\`\`\`yaml
version: '3.8'
services:
  api-gateway:
    build: ./backend-rust
    ports: ["8080:8080"]
    depends_on: [postgres, redis, meilisearch, ai-service]

  ai-service:
    build: ./ai-service-python
    ports: ["8000:8000"]
    depends_on: [qdrant]

  qdrant:
    image: qdrant/qdrant:latest
    ports: ["6333:6333"]

  meilisearch:
    image: getmeili/meilisearch:latest
    ports: ["7700:7700"]

  redis:
    image: redis:alpine
    ports: ["6379:6379"]

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]
\`\`\`

---

## 6. ПЛАН ВНЕДРЕНИЯ (ПОШАГОВО)

### Шаг 1: Инфраструктура и Векторизация (Дни 1-3)
1. Поднять \`docker-compose\` с Qdrant и Meilisearch.
2. Написать Python-скрипт (\`ingest.py\`) для переноса товаров из Postgres в Qdrant (генерация эмбеддингов) и Meilisearch.

### Шаг 2: Python AI Service (Дни 4-7)
1. Поднять FastAPI.
2. Реализовать эндпоинт \`/semantic-search\`.
3. Реализовать эндпоинт \`/chat\` с применением \`ENTERPRISE_SYSTEM_PROMPT\` и RAG-поиском по Qdrant.

### Шаг 3: Rust API Gateway (Дни 8-10)
1. Настроить HTTP-клиенты к Meilisearch и Python AI.
2. Реализовать эндпоинт \`/api/search/hybrid\` с логикой Re-ranking.
3. Добавить Redis кэширование для частых запросов.

### Шаг 4: Интеграция с Frontend (Дни 11-12)
1. Переключить \`NEXT_PUBLIC_API_GATEWAY_URL\` на Rust Gateway.
2. Настроить автодополнение (Autocomplete) через debounce-запросы к Rust.

### Шаг 5: Production Hardening (Дни 13-14)
1. Настроить Rate Limiting в Rust (через Redis).
2. Настроить запись логов в таблицу \`ai_logs\`.
3. Настроить Circuit Breaker: если Python AI падает, Rust должен возвращать только результаты Meilisearch.
