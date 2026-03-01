'use client';

import { useState } from 'react';
import { ShoppingCart, Search, Menu, Sparkles, X, User, Smartphone } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const router = useRouter();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const scrollToProducts = () => {
    if (pathname !== '/') {
      router.push('/#products');
    } else {
      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const focusSearch = () => {
    scrollToProducts();
    setTimeout(() => {
      document.getElementById('product-search')?.focus();
    }, 500);
  };

  return (
    <>
      <motion.header 
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" }
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`sticky top-0 z-40 w-full transition-colors duration-300 ${
          isScrolled 
            ? 'bg-[#0F0F0F]/80 backdrop-blur-md border-b border-white/5' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-zinc-50"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <span className="font-sans font-medium text-xl tracking-tight text-white">VapeAI</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <button onClick={scrollToProducts} className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">Каталог</button>
            <Link href="/blog" className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">Блог</Link>
            <button onClick={scrollToProducts} className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors">Жидкости</button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={focusSearch}
              className="p-2 text-zinc-400 hover:text-zinc-50 transition-colors hidden sm:block"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 text-zinc-400 hover:text-zinc-50 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-[#171717] border border-white/5 rounded-xl shadow-2xl py-2 overflow-hidden"
                  >
                    <Link href="/dashboard/buyer" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-[#B5B5B5] hover:bg-white/5 hover:text-white transition-colors">Кабинет покупателя</Link>
                    <Link href="/dashboard/seller" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-[#B5B5B5] hover:bg-white/5 hover:text-white transition-colors">Кабинет продавца</Link>
                    <div className="h-px bg-white/5 my-1" />
                    <Link href="/dashboard/admin" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-white/5 transition-colors font-medium">Админ-панель</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              className="p-2 text-zinc-400 hover:text-zinc-50 transition-colors relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-white text-[10px] font-bold flex items-center justify-center text-black">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0F0F0F]/80 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-[#171717] border-r border-white/5 shadow-2xl z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-black" />
                  </div>
                  <span className="font-sans font-medium text-xl tracking-tight text-white">VapeAI</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                <button 
                  onClick={focusSearch}
                  className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors text-lg font-medium"
                >
                  <Search className="w-5 h-5" />
                  Поиск товаров
                </button>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-lg font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-3">
                  <Sparkles className="w-5 h-5" /> Блог
                </Link>
                <div className="h-px bg-white/5 w-full" />
                <Link href="/dashboard/buyer" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-lg font-medium text-[#B5B5B5] hover:text-white transition-colors flex items-center gap-3"><User className="w-5 h-5" /> Кабинет покупателя</Link>
                <Link href="/dashboard/seller" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-lg font-medium text-[#B5B5B5] hover:text-white transition-colors flex items-center gap-3"><User className="w-5 h-5" /> Кабинет продавца</Link>
                <Link href="/dashboard/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-left text-lg font-medium text-white hover:text-white transition-colors flex items-center gap-3"><User className="w-5 h-5" /> Админ-панель</Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
