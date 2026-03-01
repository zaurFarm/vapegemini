'use client';

import { useState } from 'react';
import { Product } from '@/lib/data';
import { useCart } from '@/lib/CartContext';
import Image from 'next/image';
import { motion } from 'motion/react';
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, Plus, Minus } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetailsClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="container mx-auto px-4 py-24">
      <Link href="/#products" className="inline-flex items-center gap-2 text-[#B5B5B5] hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Назад к каталогу
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-3xl overflow-hidden bg-[#171717] border border-white/5 p-12 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-0" />
          <Image
            src={product.image}
            alt={product.name}
            fill
            referrerPolicy="no-referrer"
            className="object-contain p-12 relative z-10"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] bg-white/10 backdrop-blur-md text-white rounded-full border border-white/10">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-white text-white" />
              <span className="text-sm font-medium text-white">{product.rating}</span>
              <span className="text-xs text-[#B5B5B5] tracking-wider">({product.reviews} отзывов)</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-sans font-medium text-white mb-4 tracking-wide">
            {product.name}
          </h1>
          
          <p className="text-3xl font-medium tracking-tight text-white mb-8">
            ${product.price.toFixed(2)}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <div className="flex items-center bg-[#171717] border border-white/5 rounded-xl p-1 w-full sm:w-auto">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/10 text-[#B5B5B5] hover:text-white transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-16 text-center font-medium text-white text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center rounded-lg hover:bg-white/10 text-[#B5B5B5] hover:text-white transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={() => addToCart(product, quantity)}
              className="w-full sm:flex-1 py-4 rounded-xl bg-white text-black font-medium text-lg transition-colors hover:bg-zinc-200 flex items-center justify-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              Добавить в корзину
            </button>
          </div>

          <div className="space-y-8 border-t border-white/5 pt-8">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Характеристики</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.flavorProfile && (
                  <div className="bg-[#171717] border border-white/5 rounded-2xl p-4">
                    <p className="text-xs text-[#B5B5B5] uppercase tracking-widest mb-1">Профиль вкуса</p>
                    <p className="text-sm font-medium text-white">{product.flavorProfile}</p>
                  </div>
                )}
                {product.nicotine && (
                  <div className="bg-[#171717] border border-white/5 rounded-2xl p-4">
                    <p className="text-xs text-[#B5B5B5] uppercase tracking-widest mb-1">Крепость</p>
                    <p className="text-sm font-medium text-white">{product.nicotine}</p>
                  </div>
                )}
              </div>
              <p className="text-base text-[#B5B5B5] font-light leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-[#B5B5B5]">
                <ShieldCheck className="w-5 h-5 text-white" />
                <span className="text-sm">Оригинальная продукция с гарантией качества</span>
              </div>
              <div className="flex items-center gap-3 text-[#B5B5B5]">
                <Truck className="w-5 h-5 text-white" />
                <span className="text-sm">Быстрая доставка по всей стране</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="mt-24 pt-16 border-t border-white/5">
        <h2 className="text-3xl font-sans font-medium text-white mb-8">Отзывы покупателей</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-white text-white' : 'text-[#333333]'}`} />
              ))}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Отличное качество</h3>
            <p className="text-[#B5B5B5] text-sm leading-relaxed mb-4">Вкус очень насыщенный, устройство работает без нареканий. Доставка была быстрой и анонимной, как и обещали.</p>
            <p className="text-xs text-[#B5B5B5] uppercase tracking-widest">— Александр М.</p>
          </div>
          <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-white text-white' : 'text-[#333333]'}`} />
              ))}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Рекомендую</h3>
            <p className="text-[#B5B5B5] text-sm leading-relaxed mb-4">Беру уже не первый раз. Всегда оригинальная продукция. ИИ-ассистент помог выбрать именно этот вкус, и он не ошибся!</p>
            <p className="text-xs text-[#B5B5B5] uppercase tracking-widest">— Елена В.</p>
          </div>
          <div className="bg-[#171717] border border-white/5 rounded-3xl p-8">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.ceil(product.rating) ? 'fill-white text-white' : 'text-[#333333]'}`} />
              ))}
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Хорошо, но есть нюансы</h3>
            <p className="text-[#B5B5B5] text-sm leading-relaxed mb-4">Сам вейп отличный, но вкус оказался немного слаще, чем я ожидал. В остальном сервис на высоте.</p>
            <p className="text-xs text-[#B5B5B5] uppercase tracking-widest">— Дмитрий К.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
