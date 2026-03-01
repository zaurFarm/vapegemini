'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FileText, Loader2, ArrowRight } from 'lucide-react';
import Markdown from 'react-markdown';
import Link from 'next/link';

export default function BlogPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('');
  const [articles, setArticles] = useState<any[]>([
    {
      title: "Тренды вейпинга 2026: Что курят в этом году",
      slug: "trendy-vapinga-2026",
      excerpt: "Обзор самых популярных вкусов, устройств и технологий на рынке электронных сигарет в 2026 году.",
      readTime: 5,
      date: "24 Фев 2026"
    },
    {
      title: "Как выбрать крепость никотина: Гид для новичков",
      slug: "kak-vybrat-krepost",
      excerpt: "Подробное руководство по выбору правильной концентрации никотина для комфортного перехода на вейпинг.",
      readTime: 4,
      date: "20 Фев 2026"
    }
  ]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/v1/ai/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      
      setArticles(prev => [{
        ...data,
        date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
      }, ...prev]);
      
      setTopic('');
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
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-white mb-4">Блог VapeAI</h1>
          <p className="text-zinc-400 text-lg">Полезные статьи, обзоры и тренды индустрии.</p>
        </div>

        {/* AI SEO Generator (Admin/Demo Only) */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-medium text-white">AI SEO-Движок (Демо)</h2>
          </div>
          <p className="text-zinc-400 text-sm mb-6">Сгенерируйте уникальную SEO-статью на любую тему. AI подберет ключи, структуру и напишет текст.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Тема статьи (например: Топ 5 одноразок со вкусом арбуза)"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
            >
              {isGenerating ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Пишем...</>
              ) : (
                <><FileText className="w-5 h-5" /> Сгенерировать</>
              )}
            </button>
          </div>
        </div>

        {/* Articles List */}
        <div className="space-y-6">
          <AnimatePresence>
            {articles.map((article, idx) => (
              <motion.article 
                key={article.slug + idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10 rounded-3xl p-8 transition-all"
              >
                <div className="flex items-center gap-4 text-sm text-zinc-500 mb-4">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span>{article.readTime} мин чтения</span>
                </div>
                <h2 className="text-2xl font-medium text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {article.title}
                </h2>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  {article.excerpt}
                </p>
                
                {article.content && (
                  <div className="mb-6 p-6 bg-zinc-950/50 rounded-2xl border border-white/5 prose prose-invert prose-indigo max-w-none">
                    <Markdown>{article.content}</Markdown>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {article.seoKeywords?.slice(0, 3).map((kw: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-white/5 text-xs text-zinc-400">
                        #{kw.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                  <button className="text-indigo-400 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                    Читать <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
