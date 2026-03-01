import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for Admin Dashboard
  return NextResponse.json({
    overview: {
      totalRevenue: 124500,
      aiDrivenRevenue: 45200,
      activeUsers: 1250,
      aiSearchCTR: 24.5,
    },
    chartData: [
      { name: 'Пн', search: 400, ai_search: 240, sales: 150 },
      { name: 'Вт', search: 300, ai_search: 139, sales: 120 },
      { name: 'Ср', search: 200, ai_search: 980, sales: 200 },
      { name: 'Чт', search: 278, ai_search: 390, sales: 180 },
      { name: 'Пт', search: 189, ai_search: 480, sales: 210 },
      { name: 'Сб', search: 239, ai_search: 380, sales: 250 },
      { name: 'Вс', search: 349, ai_search: 430, sales: 300 },
    ],
    telegramDialogs: [
      { id: 1, user: "@vaper_pro", intent: "Поиск вкуса", result: "sold", time: "10 мин назад", summary: "Искал сладкий манго, купил Elf Bar 5000" },
      { id: 2, user: "@newbie123", intent: "Консультация", result: "not_sold", time: "1 час назад", summary: "Спрашивал про разницу солевого и щелочного" },
      { id: 3, user: "@cloud_chaser", intent: "Наличие", result: "sold", time: "2 часа назад", summary: "Узнавал про XROS 3, оформил заказ" },
      { id: 4, user: "@alex_m", intent: "Вне тематики", result: "rejected", time: "3 часа назад", summary: "Спрашивал про ремонт авто, бот отказал" },
    ],
    systemHealth: {
      qdrantLatency: "45ms",
      meiliLatency: "12ms",
      aiUptime: "99.99%",
      activeNodes: 3
    }
  });
}
