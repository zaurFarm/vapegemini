'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Star, Truck, X, MapPin } from 'lucide-react';
import { Product } from '@/lib/data';
import { useCart } from '@/lib/CartContext';
import { useABTest } from '@/lib/ABTestContext';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({ productGroup }: { productGroup: Product[] }) {
  const [selectedVariant, setSelectedVariant] = useState(productGroup[0]);
  const [showReviews, setShowReviews] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  
  const { addToCart } = useCart();
  const { group, trackEvent } = useABTest();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(selectedVariant);
    trackEvent('add_to_cart', { productId: selectedVariant.id, group });
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: selectedVariant.name,
    image: selectedVariant.image,
    description: selectedVariant.description,
    brand: {
      '@type': 'Brand',
      name: 'VapeAI Premium',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: selectedVariant.price.toString(),
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: selectedVariant.rating.toString(),
      reviewCount: selectedVariant.reviews.toString(),
    },
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="group relative flex flex-col bg-[#171717] rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/50 border border-white/5"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link href={`/product/${selectedVariant.id}`} className="flex flex-col flex-grow">
          <div className="relative aspect-square overflow-hidden bg-[#111111] p-6">
            <Image
              src={selectedVariant.image}
              alt={selectedVariant.name}
              fill
              referrerPolicy="no-referrer"
              className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              <div className="flex gap-2">
                <span className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider bg-white/10 text-white rounded-full">
                  {selectedVariant.category}
                </span>
                {selectedVariant.nicotine && (
                  <span className="px-3 py-1 text-[10px] font-medium uppercase tracking-wider bg-indigo-500/20 text-indigo-300 rounded-full">
                    {selectedVariant.nicotine}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-grow">
            <div className="flex items-center justify-between mb-2">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowReviews(true); }}
                className="flex items-center gap-1 hover:bg-white/5 px-2 py-1 -ml-2 rounded-lg transition-colors"
              >
                <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                <span className="text-xs font-medium text-[#B5B5B5]">{selectedVariant.rating}</span>
                <span className="text-[10px] text-[#B5B5B5] ml-1 underline decoration-white/20 underline-offset-2">({selectedVariant.reviews} отзывов)</span>
              </button>
              {group === 'B' && (
                <span className="text-xl font-medium text-white">{selectedVariant.price.toFixed(0)} ₽</span>
              )}
            </div>
            
            <h3 className="text-lg font-sans font-medium text-white mb-1 line-clamp-1">
              {selectedVariant.name.split(' - ')[0]}
            </h3>
            
            {productGroup.length > 1 && (
              <div className="mt-3 mb-4" onClick={(e) => e.preventDefault()}>
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wider">Выберите вкус:</p>
                <div className="flex flex-wrap gap-2">
                  {productGroup.map(variant => {
                    const flavorName = variant.name.split(' - ')[1] || variant.flavorProfile || 'Стандарт';
                    return (
                      <button
                        key={variant.id}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVariant(variant); }}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          selectedVariant.id === variant.id 
                            ? 'border-[#3B82F6] bg-[#3B82F6]/20 text-white' 
                            : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {flavorName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <p className="text-sm text-[#B5B5B5] line-clamp-2 mb-4 flex-grow font-light mt-2">
              {selectedVariant.description}
            </p>
          </div>
        </Link>
          
        <div className="p-6 pt-0 flex flex-col gap-3 mt-auto">
          {group === 'A' && (
            <div className="flex items-center justify-between mb-1">
              <span className="text-2xl font-medium text-white">{selectedVariant.price.toFixed(0)} ₽</span>
            </div>
          )}
          
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowDelivery(true); }}
            className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-zinc-400" />
            Рассчитать доставку
          </button>

          <button 
            onClick={handleAddToCart}
            className={`w-full py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
              group === 'A' 
                ? 'bg-[#3B82F6] hover:bg-blue-600 text-white' 
                : 'bg-[#8B5CF6] hover:bg-purple-600 text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            В корзину
          </button>
        </div>
      </motion.div>

      {/* Reviews Modal */}
      <AnimatePresence>
        {showReviews && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#171717] border border-white/10 rounded-2xl p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowReviews(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-medium text-white mb-6">Отзывы о {selectedVariant.name}</h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(selectedVariant.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-600'}`} />
                        ))}
                      </div>
                      <span className="text-xs text-zinc-400">Анонимный покупатель</span>
                    </div>
                    <p className="text-sm text-zinc-300">Отличный товар, вкус насыщенный, доставка быстрая. Рекомендую!</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delivery Widget Modal */}
      <AnimatePresence>
        {showDelivery && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#171717] border border-white/10 rounded-2xl p-6 w-full max-w-lg relative"
            >
              <button 
                onClick={() => setShowDelivery(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-medium text-white mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#3B82F6]" />
                Расчет доставки
              </h3>
              <p className="text-sm text-zinc-400 mb-6">Интеграция с виджетом SafeRoute</p>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-zinc-400" />
                  <div className="flex-1">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Город (автоопределение)</label>
                    <input type="text" defaultValue="Москва" className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:outline-none focus:border-[#3B82F6]" />
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5" />
                  <div className="flex-1">
                    <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Точный адрес или ПВЗ</label>
                    <input type="text" placeholder="Введите адрес..." className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:outline-none focus:border-[#3B82F6]" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center p-3 rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/10">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
                    <span className="text-sm text-white">Курьером до двери</span>
                  </div>
                  <span className="text-sm font-medium text-white">от 350 ₽</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg border border-white/5 hover:border-white/20 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full border border-zinc-500" />
                    <span className="text-sm text-zinc-300">В пункт выдачи (СДЭК, Boxberry)</span>
                  </div>
                  <span className="text-sm font-medium text-white">от 150 ₽</span>
                </div>
              </div>

              <button 
                onClick={() => setShowDelivery(false)}
                className="w-full py-3 rounded-xl bg-[#3B82F6] hover:bg-blue-600 text-white font-medium transition-colors"
              >
                Понятно
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
