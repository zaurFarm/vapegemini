import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    const systemInstruction = `
      Ты — AI SEO-движок для премиального вейп-маркетплейса.
      Твоя задача — генерировать уникальные, SEO-оптимизированные статьи для блога.
      
      Верни JSON со следующими полями:
      - title: Привлекательный H1 заголовок
      - slug: URL-friendly строка (например: top-odnorazok-2026)
      - content: Текст статьи в формате Markdown (минимум 3 раздела, используй H2, H3, списки)
      - excerpt: Краткое описание для превью (до 150 символов)
      - readTime: Время чтения в минутах (число)
      - seoKeywords: Массив ключевых слов
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Напиши SEO-статью на тему: "${topic}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            slug: { type: Type.STRING },
            content: { type: Type.STRING },
            excerpt: { type: Type.STRING },
            readTime: { type: Type.NUMBER },
            seoKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["title", "slug", "content", "excerpt", "readTime", "seoKeywords"]
        },
        temperature: 0.7,
      }
    });

    console.log(`[AI LOG] SEO Blog Generated for topic: "${topic}"`);

    const result = JSON.parse(response.text || '{}');
    return NextResponse.json(result);
  } catch (error) {
    console.error('[AI ERROR]', error);
    return NextResponse.json({ error: 'AI Blog Generation Error' }, { status: 500 });
  }
}
