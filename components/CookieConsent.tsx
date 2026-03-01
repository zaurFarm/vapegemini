'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const init = () => {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        setIsVisible(true);
      }
    };
    init();
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-[#171717] border border-white/5 p-4 rounded-2xl shadow-2xl z-50 flex flex-col gap-3"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-white font-medium text-sm">Мы используем файлы cookie 🍪</h3>
            <button onClick={() => setIsVisible(false)} className="text-[#B5B5B5] hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#B5B5B5] leading-relaxed">
            Это помогает нам улучшать работу сайта, анализировать трафик и персонализировать контент (включая AI-рекомендации).
          </p>
          <div className="flex gap-2 mt-2">
            <button 
              onClick={accept} 
              className="flex-1 bg-white hover:bg-zinc-200 text-black text-xs font-medium py-2.5 rounded-lg transition-colors"
            >
              Принять все
            </button>
            <button 
              onClick={() => setIsVisible(false)} 
              className="flex-1 bg-[#0F0F0F] hover:bg-white/5 text-white text-xs font-medium py-2.5 rounded-lg transition-colors border border-white/5"
            >
              Настроить
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
