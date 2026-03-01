import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';
import { products } from '@/lib/data';

// Имитация Rust API Gateway -> Python AI Service (Hybrid Search)
// Заменяет Meilisearch + Qdrant Re-ranking в рамках прототипа

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: products });
    }

    // RAG Context для семантического поиска
    const productData = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      flavor: p.flavorProfile || 'Без вкуса',
      nicotine: p.nicotine || '0мг',
      desc: p.description
    }));

    const prompt = `
      Пользователь ищет: "${query}"
      
      Твоя задача — проанализировать интент (намерение) пользователя и вернуть массив ID товаров, которые лучше всего подходят под этот запрос.
      Учитывай синонимы, семантику (например, "сладкое" = фрукты, ягоды, десерты; "крепкое" = 50мг, 5%).
      
      Доступные товары:
      ${JSON.stringify(productData)}
      
      Верни ТОЛЬКО JSON массив строк (ID товаров), отсортированных по релевантности. Не пиши ничего кроме JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Массив ID релевантных товаров"
        },
        temperature: 0.1,
      }
    });

    // Логирование поиска (Имитация AI Logs)
    console.log(`[AI LOG] Semantic Search Query: "${query}". Tokens used: ${response.usageMetadata?.totalTokenCount}`);

    const matchedIds: string[] = JSON.parse(response.text || '[]');
    
    // Сортируем товары в том порядке, в котором их вернул AI (Re-ranking)
    const matchedProducts = matchedIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean);

    return NextResponse.json({ results: matchedProducts });
  } catch (error) {
    console.error('[AI ERROR]', error);
    return NextResponse.json({ error: 'AI Search Error' }, { status: 500 });
  }
}
