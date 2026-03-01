'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, PackageSearch, PlusCircle, DollarSign, Edit, Trash2, 
  Sparkles, Wand2, TrendingDown, Loader2, CheckCircle2, UploadCloud,
  BarChart3, AlertCircle, RefreshCw, Settings, FileText, Activity, BrainCircuit
} from 'lucide-react';
import { products } from '@/lib/data';
import Image from 'next/image';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';

export default function SellerDashboard() {
  const sellerProducts = products.slice(0, 4);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'ai-tools' | 'analytics'>('overview');
  
  // AI Generator State
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatedProduct, setGeneratedProduct] = useState<any>(null);

  // Mock Data for Charts
  const salesData = [
    { name: 'Пн', sales: 1200, conversion: 2.4 },
    { name: 'Вт', sales: 1900, conversion: 3.1 },
    { name: 'Ср', sales: 1500, conversion: 2.8 },
    { name: 'Чт', sales: 2200, conversion: 3.5 },
    { name: 'Пт', sales: 2800, conversion: 4.2 },
    { name: 'Сб', sales: 3500, conversion: 5.0 },
    { name: 'Вс', sales: 3100, conversion: 4.8 },
  ];

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/v1/ai/generate-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      setGeneratedProduct(data);
    } catch (error) {
      console.error('Generation failed', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-serif font-medium text-white mb-2">Кабинет продавца (Enterprise)</h1>
            <p className="text-zinc-400">Управление бизнесом, AI-аналитика и автоматизация продаж.</p>
          </div>
          <div className="flex bg-[#171717] p-1 rounded-xl border border-white/5 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-[#B5B5B5] hover:text-white'}`}
            >
              Дашборд
            </button>
            <button 
              onClick={() => setActiveTab('products')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'products' ? 'bg-white/10 text-white' : 'text-[#B5B5B5] hover:text-white'}`}
            >
              Товары
            </button>
            <button 
              onClick={() => setActiveTab('ai-tools')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'ai-tools' ? 'bg-white text-black' : 'text-[#B5B5B5] hover:bg-white/5 hover:text-white'}`}
            >
              <Sparkles className="w-4 h-4" /> AI Инструменты
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${activeTab === 'analytics' ? 'bg-white/10 text-white' : 'text-[#B5B5B5] hover:text-white'}`}
            >
              Аналитика
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#B5B5B5] font-medium">Выручка (7 дней)</p>
                    <h3 className="text-2xl font-bold text-white">$16,200</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#B5B5B5]">
                  <TrendingUp className="w-4 h-4 text-white" /> +12.5% к прошлой неделе
                </div>
              </div>
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#B5B5B5] font-medium">Конверсия</p>
                    <h3 className="text-2xl font-bold text-white">4.2%</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#B5B5B5]">
                  <TrendingUp className="w-4 h-4 text-white" /> +0.8% (AI Поиск)
                </div>
              </div>
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <PackageSearch className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#B5B5B5] font-medium">Остатки на складе</p>
                    <h3 className="text-2xl font-bold text-white">1,240 шт</h3>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#B5B5B5]">
                  <AlertCircle className="w-4 h-4 text-white" /> 3 товара заканчиваются
                </div>
              </div>
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#B5B5B5] font-medium">AI Прогноз спроса</p>
                    <h3 className="text-2xl font-bold text-white">Высокий</h3>
                  </div>
                </div>
                <p className="text-xs text-[#B5B5B5]">Ожидается рост продаж &quot;Mango Ice&quot; на выходных.</p>
              </div>
            </div>

            <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
              <h3 className="text-lg font-medium text-white mb-6">Динамика продаж</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                    <XAxis dataKey="name" stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F0F0F', borderColor: '#333333', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="sales" stroke="#ffffff" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" name="Продажи ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-medium text-white">Управление товарами</h2>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center gap-2 border border-white/10">
                  <UploadCloud className="w-4 h-4" /> CSV Импорт
                </button>
                <button className="px-4 py-2 rounded-lg bg-white hover:bg-zinc-200 text-black text-sm font-medium transition-colors flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" /> Добавить
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[#B5B5B5] text-sm">
                    <th className="pb-4 font-medium">Товар</th>
                    <th className="pb-4 font-medium">Категория</th>
                    <th className="pb-4 font-medium">Цена</th>
                    <th className="pb-4 font-medium">Статус</th>
                    <th className="pb-4 font-medium text-right">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerProducts.map((product, idx) => (
                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl bg-[#0F0F0F] overflow-hidden">
                            <Image src={product.image} alt={product.name} fill className="object-contain p-1" />
                          </div>
                          <span className="font-medium text-white">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 text-[#B5B5B5]">{product.category}</td>
                      <td className="py-4 text-white font-medium">${product.price.toFixed(2)}</td>
                      <td className="py-4">
                        {idx === 0 ? (
                          <span className="px-2 py-1 rounded-md bg-white/10 text-white text-xs border border-white/20">Активен</span>
                        ) : idx === 1 ? (
                          <span className="px-2 py-1 rounded-md bg-white/5 text-[#B5B5B5] text-xs border border-white/10">Модерация</span>
                        ) : (
                          <span className="px-2 py-1 rounded-md bg-white/10 text-white text-xs border border-white/20">Активен</span>
                        )}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-[#B5B5B5] hover:text-white transition-colors rounded-lg hover:bg-white/10">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-[#B5B5B5] hover:text-white transition-colors rounded-lg hover:bg-white/10">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: AI TOOLS */}
        {activeTab === 'ai-tools' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* AI Product Generator */}
            <div className="bg-[#171717] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
              <h2 className="text-2xl font-medium text-white mb-2 flex items-center gap-2">
                <Wand2 className="w-6 h-6 text-white" />
                AI-Генератор карточек
              </h2>
              <p className="text-[#B5B5B5] text-sm mb-6">Опишите товар в 2-3 словах, и ИИ создаст идеальную SEO-карточку с FAQ и ключами.</p>
              
              <div className="space-y-4 mb-8">
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Например: Одноразка со вкусом манго и льда, 5000 затяжек, 5% никотина..."
                  className="w-full h-32 bg-[#0F0F0F] border border-white/5 rounded-2xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/20 resize-none"
                />
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="w-full py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Генерируем магию...</>
                  ) : (
                    <><Sparkles className="w-5 h-5" /> Создать карточку</>
                  )}
                </button>
              </div>

              <AnimatePresence>
                {generatedProduct && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-white mb-2">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">Готово!</span>
                    </div>
                    <div>
                      <p className="text-xs text-[#B5B5B5] uppercase tracking-wider mb-1">Название (H1)</p>
                      <p className="text-white font-medium">{generatedProduct.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#B5B5B5] uppercase tracking-wider mb-1">SEO Описание</p>
                      <p className="text-[#B5B5B5] text-sm leading-relaxed">{generatedProduct.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-[#B5B5B5] uppercase tracking-wider mb-1">Реком. цена</p>
                        <p className="text-white font-bold text-xl">${generatedProduct.suggestedPrice}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#B5B5B5] uppercase tracking-wider mb-1">Категория</p>
                        <p className="text-white text-sm">{generatedProduct.category}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#B5B5B5] uppercase tracking-wider mb-2">Ключевые слова</p>
                      <div className="flex flex-wrap gap-2">
                        {generatedProduct.seoKeywords.map((kw: string, i: number) => (
                          <span key={i} className="px-2 py-1 rounded-md bg-white/5 text-xs text-[#B5B5B5] border border-white/5">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="w-full mt-4 py-3 rounded-xl bg-white text-black font-medium hover:bg-zinc-200 transition-colors">
                      Сохранить и отправить на модерацию
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Repricing Engine & Analytics */}
            <div className="space-y-8">
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-medium text-white mb-2 flex items-center gap-2">
                      <RefreshCw className="w-6 h-6 text-white" />
                      AI Автоценник
                    </h2>
                    <p className="text-[#B5B5B5] text-sm">Автоматическая оптимизация цен (Repricing) в рамках min/max.</p>
                  </div>
                  <div className="w-12 h-6 bg-white/10 rounded-full flex items-center p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6 transition-transform" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-white font-medium">Vaporesso XROS 3</h4>
                        <p className="text-xs text-[#B5B5B5]">Дефицит у конкурентов</p>
                      </div>
                      <span className="px-2 py-1 rounded-md bg-white/10 text-white text-xs font-medium border border-white/20">
                        Цена повышена
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#B5B5B5]">Было: <span className="text-white line-through">$34.99</span></span>
                      <span className="text-white font-medium">Стало: $39.99</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
                <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-white" />
                  Риски падения спроса
                </h2>
                <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-medium">Lost Mary OS5000</h4>
                      <p className="text-xs text-[#B5B5B5]">Тренд поиска падает на 15%</p>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-white/5 text-[#B5B5B5] text-xs font-medium border border-white/10">
                      Внимание
                    </span>
                  </div>
                  <button className="w-full mt-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors border border-white/10">
                    Запустить распродажу
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
                <h3 className="text-lg font-medium text-white mb-6">Конверсия карточек (CTR)</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                      <XAxis dataKey="name" stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F0F0F', borderColor: '#333333', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="conversion" fill="#ffffff" radius={[4, 4, 0, 0]} name="Конверсия (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
                <h3 className="text-lg font-medium text-white mb-6">Рейтинг товаров</h3>
                <div className="space-y-4">
                  {sellerProducts.map((p, i) => (
                    <div key={p.id} className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-xl border border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="text-[#B5B5B5] font-mono">0{i+1}</span>
                        <span className="text-white font-medium">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#B5B5B5] text-sm">{p.reviews} отзывов</span>
                        <span className="text-white font-medium">{p.rating} ★</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
