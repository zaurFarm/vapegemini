'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Package, Heart, Settings, LogOut, 
  BrainCircuit, Sparkles, Clock, TrendingUp,
  ChevronRight, RefreshCw, Zap, CheckCircle2, Truck
} from 'lucide-react';
import { Product, products } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/lib/CartContext';
import Image from 'next/image';

export default function BuyerDashboard() {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'ai-mix'>('profile');
  const [isLoadingMix, setIsLoadingMix] = useState(false);
  const [aiMix, setAiMix] = useState<Product[] | null>(null);
  const { addToCart } = useCart();

  // Имитация данных профиля, собранных AI из прошлых диалогов и покупок
  const aiProfile = {
    favoriteFlavors: ['Манго', 'Ледяной арбуз', 'Ягоды'],
    priceSensitivity: 'Средняя ($20 - $35)',
    nicotinePreference: '2% (20мг)',
    buyingFrequency: 'Раз в 3 недели',
    lastPurchase: '2026-02-10',
    loyaltyScore: 85
  };

  const mockOrders = [
    {
      id: "ORD-2026-8912",
      date: "24 Фев 2026",
      status: "Доставлен",
      total: 45.00,
      items: [
        { name: "Lost Mary OS5000", image: "https://picsum.photos/seed/vape1/400/400" }
      ]
    },
    {
      id: "ORD-2026-7734",
      date: "15 Фев 2026",
      status: "В пути",
      total: 89.98,
      items: [
        { name: "Vaporesso XROS 3", image: "https://picsum.photos/seed/vape3/400/400" },
        { name: "Naked 100 Hawaiian POG", image: "https://picsum.photos/seed/vape5/400/400" }
      ]
    }
  ];

  const generateAiMix = () => {
    setIsLoadingMix(true);
    // Имитация запроса к AI для подбора идеального микса на основе профиля
    setTimeout(() => {
      // Подбираем товары, подходящие под профиль (Манго, Арбуз, Ягоды)
      const mix = products.filter(p => 
        p.flavorProfile?.toLowerCase().includes('манго') || 
        p.flavorProfile?.toLowerCase().includes('арбуз') ||
        p.flavorProfile?.toLowerCase().includes('ягод')
      ).slice(0, 3);
      
      setAiMix(mix);
      setIsLoadingMix(false);
    }, 1500);
  };

  const addMixToCart = () => {
    if (aiMix) {
      aiMix.forEach(product => addToCart(product));
      alert('AI-Микс успешно добавлен в корзину!');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-sans font-medium text-white flex items-center gap-3">
              <User className="w-8 h-8 text-white" />
              Личный кабинет
            </h1>
            <p className="text-[#B5B5B5] mt-1">Добро пожаловать обратно, Алекс. Ваш AI-профиль обновлен.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171717] text-[#B5B5B5] hover:text-white hover:bg-white/5 border border-white/5 transition-colors text-sm">
            <LogOut className="w-4 h-4" />
            Выйти
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === 'profile' 
                  ? 'bg-white/10 border-white/20 text-white border' 
                  : 'bg-[#171717] border-white/5 text-[#B5B5B5] hover:bg-white/5 border'
              }`}
            >
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-5 h-5" />
                <span className="font-medium">Мой AI-Профиль</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>
            
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                activeTab === 'orders' 
                  ? 'bg-white/10 border-white/20 text-white border' 
                  : 'bg-[#171717] border-white/5 text-[#B5B5B5] hover:bg-white/5 border'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5" />
                <span className="font-medium">История заказов</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button 
              onClick={() => setActiveTab('ai-mix')}
              className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all relative overflow-hidden ${
                activeTab === 'ai-mix' 
                  ? 'bg-white/10 border-white/20 text-white border' 
                  : 'bg-[#171717] border-white/5 text-[#B5B5B5] hover:bg-white/5 border'
              }`}
            >
              {activeTab !== 'ai-mix' && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 hover:opacity-100 transition-opacity" />}
              <div className="flex items-center gap-3 relative z-10">
                <Sparkles className={`w-5 h-5 ${activeTab === 'ai-mix' ? 'text-white' : 'text-[#B5B5B5]'}`} />
                <span className="font-medium">Собрать AI-Микс</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50 relative z-10" />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              
              {/* TAB: AI PROFILE */}
              {activeTab === 'profile' && (
                <motion.div 
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-[#171717] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                    
                    <div className="flex items-center gap-3 mb-6">
                      <BrainCircuit className="w-6 h-6 text-white" />
                      <h2 className="text-2xl font-medium text-white">Как AI видит вас</h2>
                    </div>
                    <p className="text-[#B5B5B5] text-sm mb-8 max-w-2xl">
                      Эта информация собрана на основе ваших прошлых покупок, поисковых запросов и общения с нашим Telegram-ботом. Мы используем её, чтобы предлагать только то, что вам действительно понравится.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-xs text-[#B5B5B5] uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Heart className="w-4 h-4" /> Любимые вкусы
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {aiProfile.favoriteFlavors.map(flavor => (
                            <span key={flavor} className="px-3 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-sm">
                              {flavor}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-xs text-[#B5B5B5] uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Zap className="w-4 h-4" /> Предпочтения
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#B5B5B5]">Крепость:</span>
                            <span className="text-sm font-medium text-white">{aiProfile.nicotinePreference}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-[#B5B5B5]">Бюджет:</span>
                            <span className="text-sm font-medium text-white">{aiProfile.priceSensitivity}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 md:col-span-2 flex items-center justify-between">
                        <div>
                          <h3 className="text-xs text-[#B5B5B5] uppercase tracking-wider mb-1 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Индекс лояльности
                          </h3>
                          <p className="text-sm text-[#B5B5B5]">Вероятность того, что вам понравится наша новая рекомендация.</p>
                        </div>
                        <div className="text-3xl font-mono text-white font-bold">
                          {aiProfile.loyaltyScore}%
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB: ORDERS */}
              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#171717] border border-white/5 rounded-3xl p-8"
                >
                  <h2 className="text-2xl font-medium text-white mb-6 flex items-center gap-3">
                    <Package className="w-6 h-6 text-[#B5B5B5]" />
                    История заказов
                  </h2>
                  
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                          <div>
                            <p className="text-sm text-[#B5B5B5] mb-1">Заказ #{order.id}</p>
                            <p className="text-white font-medium">{order.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-sm text-[#B5B5B5] mb-1">Сумма</p>
                              <p className="text-white font-medium">${order.total.toFixed(2)}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                              order.status === 'Доставлен' 
                                ? 'bg-white/10 text-white border border-white/20'
                                : 'bg-white/5 text-[#B5B5B5] border border-white/10'
                            }`}>
                              {order.status === 'Доставлен' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Truck className="w-3.5 h-3.5" />}
                              {order.status}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-4">
                              {order.items.map((item, i) => (
                                <div key={i} className="relative w-12 h-12 rounded-full border-2 border-[#0F0F0F] bg-[#171717] overflow-hidden">
                                  <Image src={item.image} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                                </div>
                              ))}
                            </div>
                            <p className="text-sm text-[#B5B5B5]">
                              {order.items.length} {order.items.length === 1 ? 'товар' : 'товара'}
                            </p>
                          </div>
                          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl transition-colors border border-white/10">
                            Повторить
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB: AI MIX */}
              {activeTab === 'ai-mix' && (
                <motion.div 
                  key="ai-mix"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="bg-[#171717] border border-white/5 rounded-3xl p-8 relative overflow-hidden text-center">
                    
                    <Sparkles className="w-12 h-12 text-white mx-auto mb-4" />
                    <h2 className="text-3xl font-sans font-medium text-white mb-4">Ваш Идеальный Микс</h2>
                    <p className="text-[#B5B5B5] max-w-xl mx-auto mb-8">
                      Наш AI проанализировал ваш профиль (любовь к манго и ягодам, средний бюджет) и готов собрать идеальную корзину на месяц.
                    </p>

                    {!aiMix && !isLoadingMix && (
                      <button 
                        onClick={generateAiMix}
                        className="px-8 py-4 bg-white hover:bg-zinc-200 text-black font-medium rounded-2xl transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                      >
                        <BrainCircuit className="w-5 h-5" />
                        Сгенерировать подборку
                      </button>
                    )}

                    {isLoadingMix && (
                      <div className="py-8 flex flex-col items-center">
                        <RefreshCw className="w-8 h-8 text-white animate-spin mb-4" />
                        <p className="text-[#B5B5B5] animate-pulse">Анализируем ваши вкусы и наличие на складе...</p>
                      </div>
                    )}
                  </div>

                  {aiMix && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-medium text-white">Специально для вас:</h3>
                        <button 
                          onClick={generateAiMix}
                          className="text-sm text-[#B5B5B5] hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <RefreshCw className="w-3 h-3" /> Пересобрать
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aiMix.map(product => (
                          <ProductCard key={product.id} productGroup={[product]} />
                        ))}
                      </div>

                      <div className="bg-[#171717] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
                        <div>
                          <p className="text-[#B5B5B5] text-sm mb-1">Итого за AI-Микс (3 товара):</p>
                          <p className="text-3xl font-light text-white">
                            ${aiMix.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                          </p>
                        </div>
                        <button 
                          onClick={addMixToCart}
                          className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2"
                        >
                          Добавить всё в корзину
                        </button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
