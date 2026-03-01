'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, MessageSquare, ShieldAlert, Activity, 
  TrendingUp, Users, DollarSign, BrainCircuit,
  CheckCircle2, XCircle, AlertCircle, Sparkles,
  Store, FileCheck, CreditCard, Settings, Sliders, Save
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { apiClient } from '@/lib/apiClient';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'sellers' | 'moderation' | 'finance' | 'ai-control'>('analytics');
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // AI Settings State
  const [aiSettings, setAiSettings] = useState({
    systemPrompt: "Ты профессиональный консультант по вейп продукции маркетплейса VapeAI. Отвечай ТОЛЬКО по вейп тематике. Используй ТОЛЬКО данные из переданного контекста (RAG). НЕ придумывай факты.",
    tonality: "friendly",
    similarityThreshold: 72,
    fallbackMessage: "Извините, я могу помочь только с выбором вейпов и жидкостей.",
    maxMessagesPerMinute: 20,
    temperature: 0.7,
    maxTokens: 500,
    enableMemory: true,
    salesIntensity: 50
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage if available (simulating DB)
    const savedSettings = localStorage.getItem('tg_ai_settings');
    if (savedSettings) {
      setAiSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('tg_ai_settings', JSON.stringify(aiSettings));
      setIsSaving(false);
      alert('Настройки AI успешно сохранены и применены к Telegram-боту.');
    }, 800);
  };

  // Mock data for new tabs
  const sellersList = [
    { id: 1, name: "VapeWorld LLC", status: "active", trust: 95, commission: 12, fraudRisk: "low" },
    { id: 2, name: "Cloud Chasers", status: "pending", trust: 50, commission: 15, fraudRisk: "medium" },
    { id: 3, name: "Cheap Vapes", status: "blocked", trust: 10, commission: 20, fraudRisk: "high" },
  ];

  const moderationQueue = [
    { id: 1, product: "Elf Bar 5000 Watermelon", seller: "VapeWorld LLC", spamScore: 0.1, status: "pending" },
    { id: 2, product: "SUPER CHEAP VAPE BUY NOW", seller: "Cheap Vapes", spamScore: 0.95, status: "rejected" },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.admin.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-sans font-medium text-white mb-2 flex items-center gap-3">
              <BrainCircuit className="w-8 h-8 text-white" />
              Admin Enterprise Panel
            </h1>
            <p className="text-[#B5B5B5]">Глобальная аналитика, модерация, финансы и управление AI.</p>
          </div>
          
          <div className="flex bg-[#171717] p-1 rounded-xl border border-white/5 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-white text-black' : 'text-[#B5B5B5] hover:text-white'}`}
            >
              <BarChart3 className="w-4 h-4" /> Аналитика
            </button>
            <button 
              onClick={() => setActiveTab('sellers')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'sellers' ? 'bg-white text-black' : 'text-[#B5B5B5] hover:text-white'}`}
            >
              <Store className="w-4 h-4" /> Продавцы
            </button>
            <button 
              onClick={() => setActiveTab('moderation')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'moderation' ? 'bg-white text-black' : 'text-[#B5B5B5] hover:text-white'}`}
            >
              <FileCheck className="w-4 h-4" /> Модерация
            </button>
            <button 
              onClick={() => setActiveTab('finance')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'finance' ? 'bg-white text-black' : 'text-[#B5B5B5] hover:text-white'}`}
            >
              <CreditCard className="w-4 h-4" /> Финансы
            </button>
            <button 
              onClick={() => setActiveTab('ai-control')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'ai-control' ? 'bg-white text-black' : 'text-[#B5B5B5] hover:text-white'}`}
            >
              <Sliders className="w-4 h-4" /> AI Control
            </button>
          </div>
        </div>

        {/* TAB 1: GLOBAL ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[#B5B5B5] font-medium">GMV (Общий оборот)</p>
                    <h3 className="text-2xl font-medium text-white">${stats.overview.totalRevenue.toLocaleString()}</h3>
                  </div>
                </div>
              </div>
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[#B5B5B5] font-medium">AI Recommendation CTR</p>
                    <h3 className="text-2xl font-medium text-white">{stats.overview.aiSearchCTR}%</h3>
                  </div>
                </div>
              </div>
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <Store className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[#B5B5B5] font-medium">Новые продавцы</p>
                    <h3 className="text-2xl font-medium text-white">+24</h3>
                  </div>
                </div>
              </div>
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm text-[#B5B5B5] font-medium">Активные юзеры</p>
                    <h3 className="text-2xl font-medium text-white">{stats.overview.activeUsers}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
                <h3 className="text-lg font-medium text-white mb-6">Обычный поиск vs AI Поиск</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSearch" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#333333" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#333333" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAiSearch" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                      <XAxis dataKey="name" stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F0F0F', borderColor: '#333333', borderRadius: '12px', color: '#fff' }} />
                      <Area type="monotone" dataKey="search" stroke="#B5B5B5" fillOpacity={1} fill="url(#colorSearch)" name="Обычный поиск" />
                      <Area type="monotone" dataKey="ai_search" stroke="#ffffff" fillOpacity={1} fill="url(#colorAiSearch)" name="AI Поиск" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
                <h3 className="text-lg font-medium text-white mb-6">Конверсии платформы</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333333" vertical={false} />
                      <XAxis dataKey="name" stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#B5B5B5" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#0F0F0F', borderColor: '#333333', borderRadius: '12px', color: '#fff' }} />
                      <Line type="monotone" dataKey="sales" stroke="#ffffff" strokeWidth={3} dot={{ r: 4, fill: '#ffffff', strokeWidth: 0 }} activeDot={{ r: 6 }} name="Продажи" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SELLERS MANAGEMENT */}
        {activeTab === 'sellers' && (
          <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-medium text-white mb-6">Управление продавцами</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 text-sm">
                    <th className="pb-4 font-medium">Продавец</th>
                    <th className="pb-4 font-medium">Статус</th>
                    <th className="pb-4 font-medium">Trust Level</th>
                    <th className="pb-4 font-medium">Комиссия</th>
                    <th className="pb-4 font-medium">AI Fraud Risk</th>
                    <th className="pb-4 font-medium text-right">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {sellersList.map((seller) => (
                    <tr key={seller.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 text-white font-medium">{seller.name}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-xs border ${
                          seller.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          seller.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {seller.status}
                        </span>
                      </td>
                      <td className="py-4 text-zinc-400">{seller.trust}/100</td>
                      <td className="py-4 text-zinc-400">{seller.commission}%</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-md text-xs border ${
                          seller.fraudRisk === 'low' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          seller.fraudRisk === 'medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}>
                          {seller.fraudRisk}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
                          Управление
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MODERATION */}
        {activeTab === 'moderation' && (
          <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
            <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-white" />
              AI Модерация Карточек
            </h2>
            <div className="space-y-4">
              {moderationQueue.map((item) => (
                <div key={item.id} className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-medium text-white">{item.product}</span>
                      <span className="text-xs text-zinc-500">от {item.seller}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-zinc-400">AI Spam Score: <span className={item.spamScore > 0.5 ? 'text-rose-400' : 'text-emerald-400'}>{item.spamScore}</span></span>
                      {item.spamScore > 0.5 && (
                        <span className="text-rose-400 flex items-center gap-1"><AlertCircle className="w-4 h-4" /> Запрещенные слова (CAPS)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors text-sm font-medium">
                      Одобрить
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors text-sm font-medium">
                      Отклонить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: FINANCE */}
        {activeTab === 'finance' && (
          <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-white">Финансы и Выплаты</h2>
              <button className="px-4 py-2 rounded-lg bg-white/10 text-white font-medium hover:bg-white/20 transition-colors text-sm">
                Экспорт отчета (CSV)
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6">
                <p className="text-sm text-[#B5B5B5] mb-2">Доход с комиссий</p>
                <h3 className="text-2xl font-medium text-white">$18,450.00</h3>
              </div>
              <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6">
                <p className="text-sm text-[#B5B5B5] mb-2">К выплате селлерам</p>
                <h3 className="text-2xl font-medium text-white">$106,050.00</h3>
              </div>
              <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6">
                <p className="text-sm text-[#B5B5B5] mb-2">Заморожено (Hold)</p>
                <h3 className="text-2xl font-medium text-white">$4,200.00</h3>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: AI CONTROL CENTER */}
        {activeTab === 'ai-control' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personality & Core Settings */}
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                <h2 className="text-2xl font-medium text-white mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-white" />
                  Управление Personality
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#B5B5B5] mb-2">System Prompt (Инструкция для LLM)</label>
                    <textarea 
                      value={aiSettings.systemPrompt}
                      onChange={(e) => setAiSettings({...aiSettings, systemPrompt: e.target.value})}
                      className="w-full h-32 bg-[#0F0F0F] border border-white/5 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#B5B5B5] mb-2">Тон общения</label>
                      <select 
                        value={aiSettings.tonality}
                        onChange={(e) => setAiSettings({...aiSettings, tonality: e.target.value})}
                        className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-white/20 appearance-none"
                      >
                        <option value="friendly">💬 Дружелюбный</option>
                        <option value="professional">💼 Профессиональный</option>
                        <option value="aggressive_sales">🔥 Агрессивные продажи</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#B5B5B5] mb-2">Sales Intensity (Upsell)</label>
                      <div className="flex items-center gap-3 mt-3">
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={aiSettings.salesIntensity}
                          onChange={(e) => setAiSettings({...aiSettings, salesIntensity: parseInt(e.target.value)})}
                          className="w-full accent-white"
                        />
                        <span className="text-white font-mono text-sm w-8">{aiSettings.salesIntensity}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#B5B5B5] mb-2">Fallback Message (Вне тематики)</label>
                    <input 
                      type="text" 
                      value={aiSettings.fallbackMessage}
                      onChange={(e) => setAiSettings({...aiSettings, fallbackMessage: e.target.value})}
                      className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>
              </div>

              {/* Technical AI Settings */}
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
                <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-white" />
                  Технические настройки AI
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-[#0F0F0F] rounded-xl border border-white/5">
                    <div>
                      <h4 className="text-white font-medium text-sm">Долгосрочная память (Memory)</h4>
                      <p className="text-[#B5B5B5] text-xs mt-1">Запоминать предпочтения клиентов (вкусы, цены)</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={aiSettings.enableMemory}
                        onChange={(e) => setAiSettings({...aiSettings, enableMemory: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-[#B5B5B5]">Temperature</label>
                        <span className="text-white font-mono text-sm">{aiSettings.temperature}</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={aiSettings.temperature * 100}
                        onChange={(e) => setAiSettings({...aiSettings, temperature: parseInt(e.target.value) / 100})}
                        className="w-full accent-white" 
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-[#B5B5B5]">Similarity Threshold</label>
                        <span className="text-white font-mono text-sm">{aiSettings.similarityThreshold / 100}</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={aiSettings.similarityThreshold}
                        onChange={(e) => setAiSettings({...aiSettings, similarityThreshold: parseInt(e.target.value)})}
                        className="w-full accent-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#B5B5B5] mb-2">Max Tokens</label>
                      <input 
                        type="number" 
                        value={aiSettings.maxTokens}
                        onChange={(e) => setAiSettings({...aiSettings, maxTokens: parseInt(e.target.value)})}
                        className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#B5B5B5] mb-2">Rate Limit (msg/min)</label>
                      <input 
                        type="number" 
                        value={aiSettings.maxMessagesPerMinute}
                        onChange={(e) => setAiSettings({...aiSettings, maxMessagesPerMinute: parseInt(e.target.value)})}
                        className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-white/20"
                      />
                    </div>
                  </div>

                  <button 
                    onClick={handleSaveSettings}
                    disabled={isSaving}
                    className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                  >
                    {isSaving ? 'Сохранение...' : <><Save className="w-5 h-5" /> Сохранить конфигурацию</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Knowledge Management & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
                <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-white" />
                  Управление знаниями (RAG)
                </h2>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-[#0F0F0F] hover:bg-white/5 rounded-xl border border-white/5 transition-colors">
                    <span className="text-white font-medium text-sm">База FAQ (Вопросы и ответы)</span>
                    <span className="text-xs text-[#B5B5B5]">124 записи</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-[#0F0F0F] hover:bg-white/5 rounded-xl border border-white/5 transition-colors">
                    <span className="text-white font-medium text-sm">Скрипты продаж (Upsell)</span>
                    <span className="text-xs text-[#B5B5B5]">12 сценариев</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-[#0F0F0F] hover:bg-white/5 rounded-xl border border-white/5 transition-colors">
                    <span className="text-white font-medium text-sm">База возражений</span>
                    <span className="text-xs text-[#B5B5B5]">45 ответов</span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 bg-[#0F0F0F] hover:bg-white/5 rounded-xl border border-white/5 transition-colors">
                    <span className="text-rose-400 font-medium text-sm">Запрещенные слова</span>
                    <span className="text-xs text-[#B5B5B5]">89 слов</span>
                  </button>
                </div>
              </div>

              <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-white" />
                    Логи Telegram AI
                  </h2>
                  <button className="text-[#B5B5B5] text-sm hover:text-white">Все логи</button>
                </div>
                <div className="space-y-4">
                  {stats.telegramDialogs.slice(0, 3).map((dialog: any) => (
                    <div key={dialog.id} className="bg-[#0F0F0F] border border-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white text-sm">{dialog.user}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] border ${
                          dialog.result === 'sold' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          dialog.result === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          'bg-white/5 text-[#B5B5B5] border-white/10'
                        }`}>
                          {dialog.intent}
                        </span>
                      </div>
                      <p className="text-[#B5B5B5] text-xs">{dialog.summary}</p>
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
