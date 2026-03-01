'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { analytics } from '@/lib/analytics';
import { ShoppingBag, X, Plus, Minus, Trash2, Sparkles, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Product, products } from '@/lib/data';

export default function Cart() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, clearCart, addToCart } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    analytics.trackPurchase('mock_order_123', totalPrice, items);
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const handleClose = () => {
    setIsCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#0F0F0F]/80 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#171717] border-l border-white/5 shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-sans font-medium text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-white" />
                Ваша корзина
              </h2>
              <button 
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 text-[#B5B5B5] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#B5B5B5] space-y-4 my-auto">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="text-lg font-medium">Ваша корзина пуста</p>
                  <button 
                    onClick={handleClose}
                    className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Продолжить покупки
                  </button>
                </div>
              ) : (
                <div className="space-y-6 flex-1">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-4 bg-[#111111] p-4 rounded-2xl border border-white/5 relative group">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#0F0F0F] flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          referrerPolicy="no-referrer"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-white line-clamp-1 pr-6">{item.name}</h3>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="absolute top-4 right-4 text-[#B5B5B5] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-[#B5B5B5] mt-1">{item.category}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-[#0F0F0F] rounded-lg px-2 py-1 border border-white/5">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-[#B5B5B5] hover:text-white transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium text-white w-4 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-[#B5B5B5] hover:text-white transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-medium text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-[#111111]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#B5B5B5] font-medium">Итого</span>
                  <span className="text-2xl font-sans font-medium text-white">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-[#B5B5B5] mb-6">Налоги и доставка рассчитываются при оформлении.</p>
                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-xl bg-white hover:bg-zinc-200 text-black font-medium text-lg transition-colors flex items-center justify-center gap-2"
                >
                  Оформить заказ
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
