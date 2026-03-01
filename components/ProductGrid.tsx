'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, products } from '@/lib/data';
import ProductCard from './ProductCard';
import { Search, SlidersHorizontal, Sparkles, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { AnimatePresence, motion } from 'motion/react';
import { analytics } from '@/lib/analytics';

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isSearching, setIsSearching] = useState(false);
  const [aiResults, setAiResults] = useState<Product[] | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const fetchSuggestions = async () => {
      try {
        const res = await apiClient.ai.getSuggestions(searchQuery);
        setSuggestions(res.suggestions || []);
      } catch (e) {
        console.error("Failed to fetch suggestions", e);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounced AI Search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setAiResults(null);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await apiClient.ai.semanticSearch(searchQuery);
        if (response.results) {
          setAiResults(response.results);
          analytics.track('ai_search', { query: searchQuery, resultsCount: response.results.length });
        }
      } catch (error) {
        console.error("AI Search failed", error);
        setAiResults(null);
      } finally {
        setIsSearching(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Use AI results if available, otherwise fallback to local filtering
  const baseProducts = aiResults !== null ? aiResults : products;

  const filteredProducts = baseProducts.filter(p => {
    const matchesCategory = activeCategory ? p.category === activeCategory : true;
    
    // If AI results are active, we don't need local text matching
    if (aiResults !== null) return matchesCategory;

    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(searchLower) || 
      p.description.toLowerCase().includes(searchLower) ||
      (p.flavorProfile && p.flavorProfile.toLowerCase().includes(searchLower));
      
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured
  });

  const categories = Array.from(new Set(products.map(p => p.category)));

  // Group products by base name
  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const baseName = product.name.split(' - ')[0];
    if (!acc[baseName]) {
      acc[baseName] = [];
    }
    acc[baseName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const productGroups = Object.values(groupedProducts);

  return (
    <section id="products" className="py-24 relative bg-[#0F0F0F]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-3xl sm:text-4xl font-sans font-medium text-white mb-2">
              Эксклюзивная коллекция
            </h2>
            <p className="text-[#B5B5B5]">Откройте для себя наш премиальный выбор вейпов и жидкостей, подобранных нейросетью.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
            {/* Search */}
            <div className="relative w-full" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {isSearching ? (
                  <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                ) : searchQuery.length > 1 ? (
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                ) : (
                  <Search className="h-4 w-4 text-[#B5B5B5]" />
                )}
              </div>
              <input
                id="product-search"
                type="text"
                placeholder="AI Поиск..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className={`w-full bg-[#171717] border rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#B5B5B5] focus:outline-none transition-all ${
                  searchQuery.length > 1 
                    ? 'border-[#3B82F6]/40 focus:border-[#3B82F6]/80 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'border-white/5 focus:border-white/10'
                }`}
              />
              
              {/* Autocomplete Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-[#171717] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                  >
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(suggestion);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-[#B5B5B5] hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2 border-b border-white/5 last:border-0"
                      >
                        <Search className="w-3.5 h-3.5 text-[#B5B5B5]" />
                        {suggestion}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Категории</h3>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeCategory === null 
                      ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                      : 'bg-[#171717] text-[#B5B5B5] hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  Все товары
                </button>
                {categories.map(category => (
                  <button 
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      activeCategory === category 
                        ? 'bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                        : 'bg-[#171717] text-[#B5B5B5] hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-sm font-medium text-white mb-4 uppercase tracking-wider">Сортировка</h3>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SlidersHorizontal className="h-4 w-4 text-[#B5B5B5]" />
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-[#171717] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer"
                >
                  <option value="featured">Популярные</option>
                  <option value="price-asc">Сначала дешевле</option>
                  <option value="price-desc">Сначала дороже</option>
                  <option value="rating">По рейтингу</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {productGroups.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productGroups.map(group => (
                  <ProductCard key={group[0].id} productGroup={group} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#171717] rounded-2xl border border-white/5">
                <Search className="w-12 h-12 text-[#B5B5B5] mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">Товары не найдены</h3>
                <p className="text-[#B5B5B5] mb-6">Мы не смогли найти ничего по запросу &quot;{searchQuery}&quot;</p>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                  Очистить поиск
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
