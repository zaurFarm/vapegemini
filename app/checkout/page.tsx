'use client';

import { useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-32 flex items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#171717] border border-white/5 rounded-3xl p-12 text-center max-w-lg w-full"
        >
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-sans font-medium text-white mb-4">Заказ оформлен!</h1>
          <p className="text-[#B5B5B5] mb-8 leading-relaxed">
            Спасибо за покупку. Мы отправили детали заказа на вашу электронную почту. Ваш заказ будет доставлен в ближайшее время.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-medium transition-colors"
          >
            Вернуться на главную
          </button>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl font-sans font-medium text-white mb-4">Ваша корзина пуста</h1>
        <p className="text-[#B5B5B5] mb-8">Добавьте товары в корзину, чтобы оформить заказ.</p>
        <Link 
          href="/#products"
          className="inline-flex px-8 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-medium transition-colors"
        >
          Перейти к товарам
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <Link href="/#products" className="inline-flex items-center gap-2 text-[#B5B5B5] hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Вернуться к покупкам
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-sans font-medium text-white mb-8">Оформление заказа</h1>
          
          <div className="bg-[#171717] border border-[#0088cc]/30 rounded-3xl p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0088cc]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            <h2 className="text-xl font-medium text-white mb-2 relative z-10">Быстрый заказ</h2>
            <p className="text-[#B5B5B5] mb-6 relative z-10">Оформите заказ в 1 клик через нашего Telegram-бота. Менеджер свяжется с вами для подтверждения.</p>
            <button 
              onClick={() => window.open('https://t.me/vapeai_bot', '_blank')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-medium transition-colors flex items-center justify-center gap-3 relative z-10"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Заказать через Telegram
            </button>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-[#B5B5B5] text-sm font-medium uppercase tracking-wider">Или стандартное оформление</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>

          <form onSubmit={handleCheckout} className="space-y-8">
            <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
              <h2 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-white" />
                Данные для доставки
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#B5B5B5]">Имя</label>
                  <input required type="text" className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/20" placeholder="Иван" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#B5B5B5]">Телефон</label>
                  <input required type="tel" className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/20" placeholder="+7 (999) 000-00-00" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-[#B5B5B5]">Адрес доставки</label>
                  <input required type="text" className="w-full bg-[#0F0F0F] border border-white/5 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-white/20" placeholder="Город, Улица, Дом, Квартира" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isProcessing}
              className="w-full py-5 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? 'Обработка...' : `Оформить заказ на $${(totalPrice + 5).toFixed(2)}`}
            </button>
            <div className="flex items-center justify-center gap-2 text-[#B5B5B5] text-sm">
              <ShieldCheck className="w-4 h-4" />
              Оплата при получении
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#171717] border border-white/5 rounded-3xl p-8 sticky top-24">
            <h2 className="text-xl font-medium text-white mb-6">Ваш заказ</h2>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 bg-[#0F0F0F] rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-[#B5B5B5] mb-1">Кол-во: {item.quantity}</p>
                    <p className="text-sm text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/5 pt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#B5B5B5]">Сумма</span>
                <span className="text-white">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#B5B5B5]">Доставка</span>
                <span className="text-white">$5.00</span>
              </div>
              <div className="border-t border-white/5 pt-3 flex justify-between items-center">
                <span className="text-white font-medium">Итого</span>
                <span className="text-2xl font-sans font-medium text-white">${(totalPrice + 5).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
