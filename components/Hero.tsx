'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section className="relative overflow-hidden h-screen flex items-center justify-center bg-[#0F0F0F]">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://picsum.photos/seed/cyber-neon/1920/1080"
          alt="Modern AI Vape"
          fill
          className="object-cover opacity-30 mix-blend-luminosity"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/80 via-[#0A0A1A]/60 to-[#0F0F0F]" />
        
        {/* Neon Accents */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B5CF6]/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#3B82F6]/20 rounded-full blur-[120px] pointer-events-none" />
      </motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="text-xs font-medium tracking-widest text-[#B5B5B5] uppercase">VapeAI • Нейросетевой подбор</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-sans font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 mb-6 leading-[1.1]"
          >
            Умный вейпинг <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6]">будущего.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-[#B5B5B5] mb-12 max-w-2xl leading-relaxed font-light"
          >
            Первый в мире маркетплейс с искусственным интеллектом, который подберет идеальное устройство и вкус специально для вас.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button 
              onClick={() => {
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group px-8 py-4 rounded-full bg-white text-black font-medium transition-all hover:scale-105 flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.15)] hover:shadow-[0_0_60px_rgba(255,255,255,0.25)] w-full sm:w-auto"
            >
              Смотреть каталог
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => {
                // Open AI Mix modal or scroll to it
              }}
              className="group px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-medium transition-all hover:bg-white/10 flex items-center justify-center gap-3 w-full sm:w-auto"
            >
              Подобрать вкус с ИИ
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
