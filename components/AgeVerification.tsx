'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

export default function AgeVerification() {
  const [isVerified, setIsVerified] = useState(true); // Default true to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const init = () => {
      setMounted(true);
      const verified = localStorage.getItem('vapeai_age_verified');
      if (!verified) {
        setIsVerified(false);
      }
    };
    init();
  }, []);

  const handleVerify = () => {
    localStorage.setItem('vapeai_age_verified', 'true');
    setIsVerified(true);
  };

  const handleReject = () => {
    window.location.href = 'https://google.com';
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {!isVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F0F]/95 backdrop-blur-xl p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="max-w-md w-full bg-[#171717] border border-white/5 rounded-3xl p-8 text-center shadow-2xl"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <ShieldAlert className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-sans font-medium text-white mb-4">Вам есть 18 лет?</h2>
            <p className="text-[#B5B5B5] mb-8 text-sm leading-relaxed">
              Сайт содержит информацию о продуктах, содержащих никотин. 
              Для доступа к сайту вы должны подтвердить свое совершеннолетие 
              в соответствии с законодательством.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleReject}
                className="flex-1 py-4 rounded-xl bg-[#0F0F0F] hover:bg-white/5 border border-white/5 text-white font-medium transition-colors"
              >
                Нет, мне меньше 18
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium transition-colors"
              >
                Да, мне есть 18
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
