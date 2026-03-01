'use client';

import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Cpu } from 'lucide-react';

const benefits = [
  {
    icon: <Sparkles className="w-6 h-6 text-[#3B82F6]" />,
    title: "AI-Анализ предпочтений",
    description: "Нейросеть анализирует ваши вкусы для идеальных рекомендаций."
  },
  {
    icon: <Cpu className="w-6 h-6 text-[#8B5CF6]" />,
    title: "Умный подбор крепости",
    description: "Алгоритм рассчитывает оптимальную крепость на основе вашего опыта."
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-white" />,
    title: "Гарантия качества",
    description: "100% оригинальная продукция от проверенных брендов."
  }
];

export default function Benefits() {
  return (
    <section className="py-20 border-y border-white/5 bg-[#0F0F0F] relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-2xl border border-white/10 bg-[#171717] flex items-center justify-center mb-6 transition-transform duration-300 group-hover:-translate-y-1">
                {benefit.icon}
              </div>
              <h3 className="text-base font-medium text-white mb-3">{benefit.title}</h3>
              <p className="text-sm text-[#B5B5B5] max-w-[240px] leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
