import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  // Имитация Hybrid Autocomplete (Meilisearch + AI)
  const allSuggestions = [
    "сладкий манго",
    "сладкая мята",
    "сладкие одноразки",
    "крепкий табак",
    "легкий фруктовый",
    "ягодный микс",
    "холодок",
    "elf bar",
    "lost mary",
    "vaporesso",
    "жидкость 50мг",
    "жидкость 20мг"
  ];

  const filtered = allSuggestions.filter(s => s.includes(query)).slice(0, 5);

  return NextResponse.json({ suggestions: filtered });
}
