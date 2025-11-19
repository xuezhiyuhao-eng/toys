import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, Category, CartItem } from './types';
import { ProductCard } from './components/ProductCard';
import { CartSidebar } from './components/CartSidebar';
import { ShoppingCart, Search, Sparkles, SlidersHorizontal } from 'lucide-react';
import { smartFilterProducts } from './services/geminiService';

export default function App() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    // Small haptic feedback or visual cue could go here
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const clearCart = () => setCart([]);

  // Regular filtering
  useEffect(() => {
    let filtered = MOCK_PRODUCTS;

    // Category Filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Basic Search Filter (if not using AI search result overrides)
    if (searchQuery && !isSearchingAI) {
      const lowerQ = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(lowerQ) || 
        p.description.toLowerCase().includes(lowerQ)
      );
    }

    setProducts(filtered);
  }, [selectedCategory, searchQuery, isSearchingAI]);

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearchingAI(true);
    // Reset category to ALL to search everything
    setSelectedCategory('All'); 
    
    const matchedIds = await smartFilterProducts(searchQuery, MOCK_PRODUCTS);
    
    if (matchedIds.length > 0) {
      const matchedProducts = MOCK_PRODUCTS.filter(p => matchedIds.includes(p.id));
      setProducts(matchedProducts);
    } else {
      // Fallback if AI returns nothing or fails
      const lowerQ = searchQuery.toLowerCase();
      const fallback = MOCK_PRODUCTS.filter(p => p.name.toLowerCase().includes(lowerQ));
      setProducts(fallback);
    }
    
    setIsSearchingAI(false);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setProducts(MOCK_PRODUCTS);
    setIsSearchingAI(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={resetFilters}>
            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
              <ShoppingBagIcon />
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight hidden sm:block">EasyOrder Pro</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4 relative group">
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search products or describe what client needs..." 
                className="w-full pl-10 pr-24 py-2.5 bg-gray-100 border-transparent focus:bg-white border focus:border-blue-500 rounded-full outline-none transition-all text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
              />
              <button 
                onClick={handleAISearch}
                disabled={!searchQuery || isSearchingAI}
                className="absolute right-1.5 top-1.5 bottom-1.5 bg-white hover:bg-blue-50 text-blue-600 px-3 rounded-full text-xs font-medium border border-gray-200 shadow-sm flex items-center gap-1 transition-colors"
              >
                {isSearchingAI ? <span className="animate-pulse">Thinking...</span> : <><Sparkles size={12} /> AI Find</>}
              </button>
            </div>
          </div>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors shadow-lg shadow-gray-200 flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                {cartCount}
              </span>
            )}
            <span className="hidden sm:inline text-sm font-medium">Cart</span>
          </button>
        </div>
        
        {/* Category Tabs */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto no-scrollbar">
            <div className="flex space-x-1 py-2">
              <button 
                onClick={() => { setSelectedCategory('All'); setProducts(MOCK_PRODUCTS); setSearchQuery(''); }}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === 'All' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                All Items
              </button>
              {Object.values(Category).filter(c => c !== 'All').map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {selectedCategory === 'All' && !searchQuery ? 'Featured Products' : 
             searchQuery ? `Results for "${searchQuery}"` : `${selectedCategory}`}
          </h2>
          <span className="text-sm text-gray-500">{products.length} results</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Search className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No products found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or category.</p>
            <button onClick={resetFilters} className="mt-4 text-blue-600 font-medium hover:underline">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onAdd={addToCart}
                quantityInCart={cart.find(c => c.id === product.id)?.quantity || 0}
              />
            ))}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateQuantity}
        onClearCart={clearCart}
      />
    </div>
  );
}

// Helper icon component
function ShoppingBagIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <path d="M16 10a4 4 0 0 1-8 0"></path>
    </svg>
  );
}
