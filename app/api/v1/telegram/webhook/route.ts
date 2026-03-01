import { GoogleGenAI, Type } from '@google/genai';
import { NextResponse } from 'next/server';
import { products } from '@/lib/data';

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message, username, settings } = await req.json();

    // Default settings if not provided
    const defaultSettings = {
      systemPrompt: "Ты профессиональный консультант по вейп продукции маркетплейса VapeAI. Отвечай ТОЛЬКО по вейп тематике. Используй ТОЛЬКО данные из переданного контекста (RAG). НЕ придумывай факты. Отвечай всегда на РУССКОМ языке. Помогай клиентам с выбором и предлагай оформить заказ прямо в чате.",
      tonality: "friendly",
      fallbackMessage: "Извините, я могу помочь только с выбором вейпов и жидкостей.",
      enableMemory: true,
      salesIntensity: 50,
      temperature: 0.7
    };

    const currentSettings = settings || defaultSettings;

    const tonalityInstruction = 
      currentSettings.tonality === 'friendly' ? 'Отвечай коротко, дружелюбно, в стиле Telegram (используй эмодзи).' :
      currentSettings.tonality === 'professional' ? 'Отвечай строго, профессионально, без лишних эмоций и эмодзи.' :
      'Твоя главная цель - продать. Активно предлагай сопутствующие товары (апселл), используй маркетинговые триггеры.';

    const salesInstruction = currentSettings.salesIntensity > 70 
      ? 'Используй триггеры дефицита ("Осталось мало штук") и активно предлагай сопутствующие товары.'
      : 'Предлагай товары ненавязчиво, только если это релевантно запросу.';

    const memoryInstruction = currentSettings.enableMemory
      ? 'Учитывай историю пользователя: предпочитает сладкие вкусы, средний чек $20-30.'
      : 'Не используй историю пользователя.';

    const systemInstruction = `
      ${currentSettings.systemPrompt}
      
      ${tonalityInstruction}
      ${salesInstruction}
      ${memoryInstruction}

      ДОСТУПНЫЕ ТОВАРЫ ДЛЯ ЗАКАЗА:
      ${products.map(p => `- ${p.name} (${p.category}): ${p.price} руб. Описание: ${p.description}`).join('\n')}
      
      Если клиент хочет заказать товар, подтверди заказ и скажи, что менеджер скоро свяжется для уточнения деталей доставки.
      
      Если вопрос не про вейпы — вежливо отказывай, используя эту фразу: "${currentSettings.fallbackMessage}".
      
      Помимо ответа, ты должен проанализировать интент (намерение) пользователя для нашей системы самообучения.
      
      Верни строго JSON со следующими полями:
      - reply: Твой текстовый ответ пользователю на РУССКОМ языке
      - intent: Строка (одно из: "search_flavor", "consultation", "buy", "order_status", "out_of_topic", "complaint")
      - sale_probability: Число от 0 до 100 (вероятность того, что клиент купит товар после этого сообщения)
      - suggested_product: Название товара, который лучше всего подходит (или null)
      - memory_extracted: Объект с новыми фактами о пользователе (например, {"favorite_flavor": "mango"}) или null
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Пользователь ${username} пишет: "${message}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: { type: Type.STRING },
            intent: { type: Type.STRING },
            sale_probability: { type: Type.NUMBER },
            suggested_product: { type: Type.STRING },
            memory_extracted: { type: Type.OBJECT, description: "Extracted facts about user" }
          },
          required: ["reply", "intent", "sale_probability"]
        },
        temperature: currentSettings.temperature || 0.7,
      }
    });

    const result = JSON.parse(response.text || '{}');
    
    // Имитация сохранения вектора диалога в Qdrant для самообучения
    console.log(`[TELEGRAM AI LOG] Saved vector for user ${username}. Intent: ${result.intent}, Probability: ${result.sale_probability}%`);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[TELEGRAM WEBHOOK ERROR]', error);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
