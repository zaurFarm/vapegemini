import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';
import { products } from '@/lib/data';

// Имитация Rust API Gateway -> Python AI Service
// В реальном Enterprise проекте этот роут будет просто проксировать запрос в Rust

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // RAG Context: Подмешиваем данные о товарах в системный промпт
    const productContext = products.map(p => 
      `- ${p.name} (${p.category}): ${p.flavorProfile || 'Без вкуса'}, Крепость: ${p.nicotine || '0мг'}, Цена: $${p.price}`
    ).join('\n');

    const systemInstruction = `
      Ты — AI-ассистент премиального вейп-маркетплейса VapeAI.
      Твоя задача — помогать клиентам с выбором товаров, консультировать по вкусам и крепости.
      ОТВЕЧАЙ СТРОГО ПО ТЕМАТИКЕ ВЕЙПИНГА. Если вопрос не по теме, вежливо откажись отвечать.
      
      Доступные товары (RAG Context):
      ${productContext}
      
      Веди диалог естественно, предлагай конкретные товары из списка выше.
      Не придумывай товары, которых нет в списке.
    `;

    // Формируем историю для Gemini
    const chatHistory = history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Добавляем текущее сообщение
    chatHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: chatHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // Логирование запроса (Имитация AI Logs)
    console.log(`[AI LOG] Chat Intent processed. Tokens used: ${response.usageMetadata?.totalTokenCount}`);

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('[AI ERROR]', error);
    return NextResponse.json({ error: 'AI Service Error' }, { status: 500 });
  }
}
