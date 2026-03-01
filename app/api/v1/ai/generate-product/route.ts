import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const systemInstruction = `
      Ты — AI-ассистент для продавцов (селлеров) на вейп-маркетплейсе.
      Твоя задача — генерировать идеальные, SEO-оптимизированные карточки товаров на основе краткого описания от продавца.
      
      Верни JSON со следующими полями:
      - name: Привлекательное название товара
      - description: Продающее описание (2-3 абзаца, подчеркивающее вкус и преимущества)
      - seoKeywords: Массив из 5-7 ключевых слов для поиска
      - metaDescription: Краткое описание для SEO (до 160 символов)
      - suggestedPrice: Рекомендуемая цена в долларах (число, на основе анализа рынка)
      - category: Категория (Disposable, Pod System, E-Liquid, Accessories)
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Создай карточку товара для: "${prompt}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            metaDescription: { type: Type.STRING },
            suggestedPrice: { type: Type.NUMBER },
            category: { type: Type.STRING }
          },
          required: ["name", "description", "seoKeywords", "metaDescription", "suggestedPrice", "category"]
        },
        temperature: 0.7,
      }
    });

    console.log(`[AI LOG] Seller Product Generated for prompt: "${prompt}"`);

    const result = JSON.parse(response.text || '{}');
    return NextResponse.json(result);
  } catch (error) {
    console.error('[AI ERROR]', error);
    return NextResponse.json({ error: 'AI Generation Error' }, { status: 500 });
  }
}
