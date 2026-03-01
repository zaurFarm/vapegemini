'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Smartphone, BrainCircuit, Database, Activity, CheckCircle2 } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'bot';
  content: string;
  debug?: {
    intent: string;
    probability: number;
    product?: string;
    memory?: any;
  };
};

export default function TelegramDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'bot',
      content: 'Привет! 👋 Я AI-консультант VapeAI. Ищешь что-то конкретное или помочь с выбором вкуса?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      // Load settings from localStorage to simulate DB fetch
      const savedSettings = localStorage.getItem('tg_ai_settings');
      const settings = savedSettings ? JSON.parse(savedSettings) : null;

      const res = await fetch('/api/v1/telegram/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, username: '@demo_user', settings })
      });
      const data = await res.json();

      setMessages(prev => [...prev, { 
        id: (Date.now() + 1).toString(), 
        role: 'bot', 
        content: data.reply,
        debug: {
          intent: data.intent,
          probability: data.sale_probability,
          product: data.suggested_product,
          memory: data.memory_extracted
        }
      }]);
    } catch (error) {
      console.error('Telegram API Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-medium text-white mb-4 flex items-center justify-center gap-3">
            <Smartphone className="w-8 h-8 text-blue-400" />
            Telegram AI Sales (Демо)
          </h1>
          <p className="text-zinc-400 text-lg">Симуляция работы самообучающегося Telegram-бота с анализом интентов.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Phone Mockup */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-zinc-950 border-[8px] border-zinc-900 rounded-[3rem] h-[700px] relative overflow-hidden shadow-2xl flex flex-col">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-zinc-900 rounded-b-3xl w-40 mx-auto z-20" />
              
              {/* Telegram Header */}
              <div className="bg-[#1c242f] pt-12 pb-3 px-4 flex items-center gap-3 z-10 shadow-md">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-medium leading-tight">VapeAI Bot</h3>
                  <p className="text-blue-400 text-xs">bot</p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 bg-[#0f1621] overflow-y-auto p-4 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-[15px] leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-[#2b5278] text-white rounded-br-sm' 
                        : 'bg-[#182533] text-white rounded-bl-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#182533] text-zinc-400 rounded-2xl rounded-bl-sm px-4 py-2 text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="bg-[#1c242f] p-3">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message"
                    className="flex-1 bg-[#0f1621] text-white rounded-full px-4 py-2.5 text-sm focus:outline-none placeholder:text-zinc-500"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white disabled:opacity-50 transition-opacity flex-shrink-0"
                  >
                    <Send className="w-4 h-4 ml-1" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Debug & Analytics Panel */}
          <div className="w-full lg:w-[500px] space-y-6">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
              <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-indigo-400" />
                Under the Hood (RAG & NLP)
              </h2>
              
              <AnimatePresence mode="wait">
                {messages.length > 1 && messages[messages.length - 1].role === 'bot' ? (
                  <motion.div 
                    key={messages[messages.length - 1].id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-5">
                      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Определенный Интент</p>
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-emerald-400" />
                        <span className="text-lg font-medium text-white">
                          {messages[messages.length - 1].debug?.intent}
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-5">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider">Вероятность продажи</p>
                        <span className="text-indigo-400 font-mono font-bold">
                          {messages[messages.length - 1].debug?.probability}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${messages[messages.length - 1].debug?.probability}%` }}
                          className={`h-full rounded-full ${
                            (messages[messages.length - 1].debug?.probability || 0) > 70 
                              ? 'bg-emerald-500' 
                              : (messages[messages.length - 1].debug?.probability || 0) > 30 
                                ? 'bg-amber-500' 
                                : 'bg-rose-500'
                          }`}
                        />
                      </div>
                    </div>

                    {messages[messages.length - 1].debug?.product && (
                      <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-5">
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Предложенный товар</p>
                        <p className="text-white font-medium">{messages[messages.length - 1].debug?.product}</p>
                      </div>
                    )}

                    {messages[messages.length - 1].debug?.memory && Object.keys(messages[messages.length - 1].debug?.memory || {}).length > 0 && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                          <Database className="w-5 h-5 text-emerald-400" />
                          <h4 className="text-emerald-400 font-medium">Извлеченная память (Memory)</h4>
                        </div>
                        <p className="text-sm text-zinc-400 mb-3">Новые факты о пользователе сохранены в БД.</p>
                        <pre className="text-xs text-emerald-400 font-mono bg-zinc-950/50 p-3 rounded-xl overflow-x-auto border border-zinc-800">
                          {JSON.stringify(messages[messages.length - 1].debug?.memory, null, 2)}
                        </pre>
                      </div>
                    )}

                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <Database className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-indigo-400 font-medium">Векторизация диалога</h4>
                      </div>
                      <p className="text-sm text-zinc-400 mb-3">
                        Диалог сохранен в Qdrant. Если клиент совершит покупку, этот паттерн общения получит высокий вес для будущих консультаций.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4" /> Vector ID: {Math.random().toString(36).substring(7)}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-zinc-500">
                    <BrainCircuit className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Напишите сообщение в чат, чтобы увидеть анализ AI.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
