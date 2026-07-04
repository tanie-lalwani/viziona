'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserStore, PurchasedItem } from '@/stores/userStore';

interface Product {
  name: string;
  price: number;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  specs: string[];
  reviews: { author: string; rating: number; text: string }[];
  gradient: string;
  emoji: string;
}

const defaultProducts: Product[] = [
  {
    name: 'Personal G-Class Solar System',
    price: 14500000000,
    category: 'Celestial Real Estate',
    description: 'Includes a stable yellow dwarf star, 3 habitable Goldilocks-zone planets, 2 asteroid belts for mining, and a gas giant for aesthetic planetary ring views.',
    rating: 4.9,
    reviewCount: 312,
    specs: ['Diameter: 2.1 Light Years', 'Planets: 8 Total', 'Atmosphere: 100% Breathable on Planet 3'],
    reviews: [
      { author: 'NovaDreamer', rating: 5, text: 'Absolutely spectacular! The ring views on the gas giant are breathtaking. Zero-g space yachting here is stellar.' },
      { author: 'SpaceLord', rating: 4, text: 'Had a slight issue with meteor showers in sector B, but the solar shield generator handled it. Great buy.' }
    ],
    gradient: 'from-amber-400 via-orange-500 to-rose-600',
    emoji: '🪐'
  },
  {
    name: 'Cup of Infinite Morning Espresso',
    price: 399,
    category: 'Cosmic Consumables',
    description: 'A beautifully crafted ceramic mug bound to a pocket dimension containing pure, fresh, organic espresso. Never runs empty, self-cleans, and stays at exactly 142°F.',
    rating: 4.8,
    reviewCount: 1542,
    specs: ['Material: Quantum Ceramic', 'Refill Rate: Instantaneous', 'Flavor Profile: Chocolate & Hazelnut Notes'],
    reviews: [
      { author: 'CaffeineFiend', rating: 5, text: 'I haven’t slept in three weeks and my startup is now valued at 4 billion. Thank you Amazon Infinite.' },
      { author: 'TeaLover', rating: 5, text: 'I don’t even like coffee, but this mug looks so sleek sitting on my floating desk. High quality.' }
    ],
    gradient: 'from-amber-800 to-amber-950',
    emoji: '☕'
  },
  {
    name: 'Miniature Loyal Velociraptor',
    price: 125000,
    category: 'Exotic Organisms',
    description: 'Genetically tailored dwarf velociraptor. Fully house-trained, understands 45 commands, and feeds entirely on negative thoughts and self-doubt. The perfect loyal guard pet.',
    rating: 4.7,
    reviewCount: 88,
    specs: ['Height: 65cm', 'Speed: 40 km/h', 'Lifespan: 120 Years'],
    reviews: [
      { author: 'Jurassica', rating: 5, text: 'So fluffy and loves cuddles! Also, since he eats my anxiety, I feel great. Everyone should have one.' },
      { author: 'NoRex', rating: 4, text: 'He chewed up my manifesting shoes, but then did a cute backflip so I couldn’t stay mad.' }
    ],
    gradient: 'from-emerald-400 to-teal-700',
    emoji: '🦖'
  },
  {
    name: 'True Love & Mutual Understanding',
    price: 0,
    category: 'Existential Treasures',
    description: 'An emotional frequency resonator that aligns your soul with a matching conscious entity in the cosmos. Guaranteed to spark a deep connection filled with trust, laughter, and zero drama.',
    rating: 5.0,
    reviewCount: 43900,
    specs: ['Chemistry: 99.9%', 'Side Effects: Warm fuzzy feelings', 'Drama Level: 0.0%'],
    reviews: [
      { author: 'LonelyBoy99', rating: 5, text: 'I was skeptical because it was listed for $0, but we met at a coffee shop the next day. It’s real.' },
      { author: 'SoulSearcher', rating: 5, text: 'Absolutely priceless. We just click. Best manifest transaction ever.' }
    ],
    gradient: 'from-pink-500 via-red-500 to-rose-500',
    emoji: '💖'
  }
];

export default function AmazonInfinite() {
  const { netWorth, buyItem, purchasedItems, infiniteBalance, toggleInfiniteBalance, clearPurchases } = useUserStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'shop' | 'vault'>('shop');
  const [cardName, setCardName] = useState('COSMIC CREATOR');
  
  // Sound synthesizer helper using Web Audio API
  const playSound = (type: 'cart' | 'success' | 'process') => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (type === 'cart') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === 'process') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 2);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.8);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 2);
      } else if (type === 'success') {
        // High chime
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
        gain1.gain.setValueAtTime(0.1, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start();
        osc1.stop(ctx.currentTime + 0.3);

        // Success chime follow-up
        setTimeout(() => {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1318.51, ctx.currentTime); // E6
          gain2.gain.setValueAtTime(0.08, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.4);
        }, 120);
      }
    } catch (e) {
      console.error('Audio context error', e);
    }
  };

  // Generate hash-based color from string
  const getGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 120) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 80%, 45%) 0%, hsl(${hue2}, 85%, 30%) 100%)`;
  };

  // Generate dynamic emoji based on keywords
  const getEmoji = (str: string) => {
    const lower = str.toLowerCase();
    if (lower.includes('planet') || lower.includes('space') || lower.includes('galaxy') || lower.includes('star')) return '🪐';
    if (lower.includes('coffee') || lower.includes('drink') || lower.includes('tea') || lower.includes('cup')) return '☕';
    if (lower.includes('love') || lower.includes('heart') || lower.includes('bf') || lower.includes('girlfriend') || lower.includes('boyfriend')) return '💖';
    if (lower.includes('velociraptor') || lower.includes('dinosaur') || lower.includes('pet') || lower.includes('dog') || lower.includes('cat')) return '🦖';
    if (lower.includes('car') || lower.includes('vehicle') || lower.includes('yacht') || lower.includes('jet') || lower.includes('plane')) return '🚀';
    if (lower.includes('house') || lower.includes('mansion') || lower.includes('castle') || lower.includes('island')) return '🏰';
    if (lower.includes('money') || lower.includes('cash') || lower.includes('gold') || lower.includes('bitcoin')) return '💰';
    if (lower.includes('food') || lower.includes('pizza') || lower.includes('burger')) return '🍔';
    if (lower.includes('music') || lower.includes('guitar') || lower.includes('concert') || lower.includes('instrument')) return '🎸';
    return '📦';
  };

  // Dynamic Product Generator
  const generateProduct = (query: string): Product => {
    const name = query.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    
    // Procedural Price Engine
    const lower = query.toLowerCase();
    let price = 1000; // default
    if (lower.includes('coffee') || lower.includes('burger') || lower.includes('apple') || lower.includes('beer') || lower.includes('shirt')) {
      price = parseFloat((5 + Math.random() * 45).toFixed(2));
    } else if (lower.includes('computer') || lower.includes('phone') || lower.includes('television') || lower.includes('watch') || lower.includes('guitar')) {
      price = Math.floor(250 + Math.random() * 2500);
    } else if (lower.includes('car') || lower.includes('tesla') || lower.includes('rolex') || lower.includes('house') || lower.includes('boat')) {
      price = Math.floor(80000 + Math.random() * 1500000);
    } else if (lower.includes('yacht') || lower.includes('mansion') || lower.includes('jet') || lower.includes('island')) {
      price = Math.floor(15000000 + Math.random() * 250000000);
    } else if (lower.includes('planet') || lower.includes('space') || lower.includes('galaxy') || lower.includes('black hole') || lower.includes('spaceship') || lower.includes('star')) {
      price = Math.floor(1000000000 + Math.random() * 850000000000);
    } else if (lower.includes('love') || lower.includes('boyfriend') || lower.includes('girlfriend') || lower.includes('happiness') || lower.includes('peace')) {
      price = 0; // Priceless or Free manifest
    } else {
      // Procedural random price depending on length
      price = Math.floor(Math.pow(name.length, 3) * (5 + Math.random() * 15));
    }

    // Determine category
    let category = 'Curated Manifestation';
    if (lower.includes('planet') || lower.includes('space') || lower.includes('galaxy')) category = 'Celestial Real Estate';
    else if (lower.includes('love') || lower.includes('boyfriend') || lower.includes('girlfriend') || lower.includes('happiness')) category = 'Existential Treasures';
    else if (lower.includes('coffee') || lower.includes('pizza') || lower.includes('food')) category = 'Cosmic Consumables';
    else if (lower.includes('dinosaur') || lower.includes('velociraptor') || lower.includes('pet')) category = 'Exotic Organisms';
    else if (lower.includes('car') || lower.includes('yacht') || lower.includes('jet')) category = 'Hyper-Luxe Transportation';
    else if (lower.includes('code') || lower.includes('software') || lower.includes('ai')) category = 'Digital Constructs';

    const rating = parseFloat((4.4 + Math.random() * 0.6).toFixed(1));
    const reviewCount = Math.floor(Math.random() * 9500) + 14;

    const specs = [
      `Source: Quantum Manifestation Engine`,
      `Quality: Grade-A Cosmic Standard`,
      `Dimensions: Customized to owner's spatial field`
    ];

    const reviews = [
      {
        author: 'InterstellarTraveler',
        rating: 5,
        text: `Super impressed with the build quality of this ${name}. It manifested on my porch literally immediately. Best deal ever!`
      },
      {
        author: 'CosmicReviewer',
        rating: Math.floor(Math.random() * 2) + 4,
        text: `Decent product, does exactly what it says. Just make sure you read the instructions regarding localized gravity distortion.`
      }
    ];

    return {
      name,
      price,
      category,
      description: `Premium procedural ${name} crafted out of refined cosmic energy and quantum particles. Optimized for immediate manifestation in this universe.`,
      rating,
      reviewCount,
      specs,
      reviews,
      gradient: '', // filled dynamically in render
      emoji: getEmoji(query)
    };
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const prod = generateProduct(searchQuery);
    setSelectedProduct(prod);
  };

  const handleAddToCart = (product: Product) => {
    setCart([...cart, product]);
    playSound('cart');
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
    playSound('cart');
  };

  const startCheckout = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutStep(1);
    playSound('process');
  };

  // Run payment processing steps
  useEffect(() => {
    if (isCheckingOut && checkoutStep > 0 && checkoutStep < 4) {
      const timer = setTimeout(() => {
        setCheckoutStep(prev => prev + 1);
        if (checkoutStep === 2) {
          playSound('process');
        }
        if (checkoutStep === 3) {
          // Finalize purchases in store
          cart.forEach(item => {
            buyItem(item.name, item.price, item.description, item.category);
          });
          setCart([]);
          playSound('success');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isCheckingOut, checkoutStep, cart, buyItem]);

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#FDFBF7] text-stone-800 font-sans overflow-x-hidden selection:bg-amber-200">
      
      {/* Header bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-xl border-b border-stone-200/60 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-stone-500 hover:text-stone-800 transition-colors text-sm flex items-center gap-2">
            ← Main Portal
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-widest text-amber-700 flex items-center gap-1.5 drop-shadow-sm">
              amazon<span className="text-stone-600 font-light text-base border border-amber-200 px-1.5 py-0.5 rounded ml-1 bg-amber-50">infinite</span>
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-4">
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all ${
              activeTab === 'shop' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/10' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            }`}
          >
            Cosmic Storefront
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-full text-sm font-semibold tracking-wide transition-all relative ${
              activeTab === 'vault' ? 'bg-amber-600 text-white shadow-md shadow-amber-600/10' : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
            }`}
          >
            My Acquisition Vault
            {purchasedItems.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FDFBF7]">
                {purchasedItems.length}
              </span>
            )}
          </button>
        </nav>

        {/* Stats Panel */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[9px] text-stone-400 uppercase tracking-widest font-semibold">Universe Credit Limit</div>
            <div className="text-sm font-bold text-emerald-600">
              {infiniteBalance ? '∞ INFINITE' : `$${netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            </div>
          </div>

          <button
            onClick={() => toggleInfiniteBalance()}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider border transition-colors ${
              infiniteBalance ? 'border-emerald-500/30 bg-emerald-50 text-emerald-700' : 'border-stone-300 text-stone-500 hover:bg-stone-50'
            }`}
          >
            {infiniteBalance ? 'INF ON' : 'INF OFF'}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setShowCart(true)}
            className="p-2.5 rounded-full bg-white border border-stone-200 hover:bg-stone-50 transition-all relative shadow-sm"
          >
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white font-extrabold text-[10px] w-5.5 h-5.5 rounded-full flex items-center justify-center border border-[#FDFBF7] animate-pulse">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {/* Mobile Tabs */}
        <div className="flex md:hidden gap-2 mb-6">
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold ${
              activeTab === 'shop' ? 'bg-amber-600 text-white' : 'bg-white text-stone-500 border border-stone-200'
            }`}
          >
            Storefront
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold ${
              activeTab === 'vault' ? 'bg-amber-600 text-white' : 'bg-white text-stone-500 border border-stone-200'
            }`}
          >
            My Vault ({purchasedItems.length})
          </button>
        </div>

        {activeTab === 'shop' ? (
          <div className="space-y-12">
            
            {/* Mega Search Banner */}
            <div className="relative overflow-hidden rounded-3xl border border-amber-100 bg-white p-8 md:p-12 text-center shadow-md shadow-amber-900/[0.01]">
              {/* Decorative glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-100/40 blur-[100px] pointer-events-none" />
              
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-stone-850">
                Buy Whatever You Dream
              </h2>
              <p className="text-sm md:text-base text-stone-500 max-w-xl mx-auto mb-8 font-light">
                Type anything into the universal search engine. Our quantum assemblers will value it, package it, and materialize it immediately.
              </p>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex flex-col md:flex-row gap-3 relative z-10">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search: a private star system, a pet dragon, a custom supercar, true love..."
                  className="flex-1 px-5 py-4 rounded-xl border border-stone-300 bg-white text-stone-800 placeholder-stone-400 outline-none text-base transition-all focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl transition-all shadow-md shadow-amber-600/10 shrink-0"
                >
                  Search Universe
                </button>
              </form>
            </div>

            {/* Product Detail view or Best Sellers */}
            {selectedProduct ? (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
                >
                  ← Back to best sellers
                </button>
                
                {/* Product Sheet */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-stone-200/80 rounded-3xl p-6 md:p-10 shadow-lg">
                  
                  {/* Left Column: Interactive Holographic Graphic */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] rounded-2xl relative overflow-hidden"
                       style={{
                         background: selectedProduct.gradient || getGradient(selectedProduct.name),
                       }}
                  >
                    {/* Pulsing circular grid background overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-black/30 to-black/60 mix-blend-multiply" />
                    
                    {/* Glowing Emoji */}
                    <div className="text-8xl md:text-9xl filter drop-shadow-[0_10px_35px_rgba(255,255,255,0.45)] animate-bounce select-none z-10">
                      {selectedProduct.emoji}
                    </div>

                    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200/50 text-[10px] font-mono tracking-widest text-amber-800 uppercase z-10">
                      // Hologram Manifest Active
                    </div>
                  </div>

                  {/* Right Column: Information */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-widest font-mono">
                        {selectedProduct.category}
                      </span>
                      <h3 className="text-3xl md:text-4xl font-extrabold mt-2 text-stone-850 tracking-tight">
                        {selectedProduct.name}
                      </h3>
                      
                      {/* Rating Row */}
                      <div className="flex items-center gap-2 mt-3 text-sm">
                        <span className="text-amber-500">★★★★★</span>
                        <span className="font-bold text-stone-800">{selectedProduct.rating}</span>
                        <span className="text-stone-500">({selectedProduct.reviewCount} customer reviews)</span>
                      </div>

                      <hr className="border-stone-200/60 my-6" />

                      {/* Pricing block */}
                      <div className="space-y-1">
                        <span className="text-xs text-stone-400 uppercase tracking-wider font-medium">Cosmic List Price</span>
                        <div className="text-3xl md:text-5xl font-black text-stone-850 flex items-baseline gap-2">
                          {selectedProduct.price === 0 ? (
                            <span className="text-emerald-600 tracking-wide font-extrabold uppercase">Priceless (Free Manifest)</span>
                          ) : (
                            <>
                              <span>${selectedProduct.price.toLocaleString(undefined, { minimumFractionDigits: selectedProduct.price < 100 ? 2 : 0 })}</span>
                              <span className="text-xs text-stone-400 font-normal">USD</span>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="mt-6 text-stone-600 text-sm md:text-base leading-relaxed font-light">
                        {selectedProduct.description}
                      </p>

                      {/* Specs */}
                      <div className="mt-6 bg-[#FAF8F3] border border-stone-200/60 rounded-xl p-4">
                        <h4 className="text-xs font-bold tracking-wider text-stone-500 uppercase mb-2">Technical Specifications</h4>
                        <ul className="text-xs space-y-1 text-stone-500 font-mono">
                          {selectedProduct.specs.map((spec, i) => (
                            <li key={i}>• {spec}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        onClick={() => handleAddToCart(selectedProduct)}
                        className="flex-1 py-4 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl transition-all shadow-md text-center"
                      >
                        Add to Cosmic Cart
                      </button>
                      <button
                        onClick={() => {
                          setCart([...cart, selectedProduct]);
                          setSelectedProduct(null);
                          setShowCart(true);
                          playSound('cart');
                        }}
                        className="flex-1 py-4 bg-[#FAF6EE] border border-amber-200/60 text-amber-800 hover:bg-amber-100/50 font-bold rounded-xl transition-all text-center"
                      >
                        Buy Instantly
                      </button>
                    </div>
                  </div>

                </div>

                {/* Simulated Reviews Section */}
                <div className="bg-white border border-stone-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
                  <h4 className="text-lg font-bold tracking-tight">Verified Buyer Manifestation Reviews</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedProduct.reviews.map((rev, idx) => (
                      <div key={idx} className="bg-[#FDFBF7] border border-stone-200/50 rounded-2xl p-5 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-stone-600">👤 {rev.author}</span>
                          <span className="text-amber-500 font-bold">{'★'.repeat(rev.rating)}</span>
                        </div>
                        <p className="text-sm font-light text-stone-500 italic">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Best Sellers List
              <div className="space-y-6">
                <h3 className="text-xl font-bold tracking-tight flex items-center gap-2">
                  🔥 Recommended manifest-best sellers
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {defaultProducts.map((prod) => (
                    <div
                      key={prod.name}
                      onClick={() => setSelectedProduct(prod)}
                      className="group border border-stone-200 bg-white rounded-2xl p-5 hover:border-amber-500 transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-md"
                    >
                      <div>
                        {/* Box graphic */}
                        <div className={`h-40 rounded-xl mb-4 flex items-center justify-center text-6xl relative overflow-hidden`}
                             style={{ background: getGradient(prod.name) }}
                        >
                          <div className="absolute inset-0 bg-black/10" />
                          <span className="filter drop-shadow-md z-10 transition-transform duration-300 group-hover:scale-110">
                            {prod.emoji}
                          </span>
                        </div>

                        <span className="text-[10px] font-mono text-amber-700 uppercase tracking-widest">
                          {prod.category}
                        </span>
                        <h4 className="font-bold text-sm text-stone-800 tracking-tight mt-1 group-hover:text-amber-700 transition-colors duration-200 line-clamp-1">
                          {prod.name}
                        </h4>
                        
                        {/* Star review */}
                        <div className="text-[10px] text-amber-500 mt-1">
                          ★★★★★ <span className="text-stone-400">({prod.reviewCount})</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="font-mono text-xs font-black text-stone-700">
                          {prod.price === 0 ? 'Free' : `$${prod.price.toLocaleString()}`}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(prod);
                          }}
                          className="px-3 py-1.5 bg-amber-600 text-white font-extrabold text-[10px] rounded hover:bg-amber-700 transition-colors shadow-sm"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          // Vault Tab (Purchased items list)
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-stone-200/60 pb-4">
              <div>
                <h3 className="text-xl font-bold tracking-tight">Cosmic Acquisition Vault</h3>
                <p className="text-xs text-stone-500">Physical manifests and cosmic parcels currently active in your sector.</p>
              </div>
              {purchasedItems.length > 0 && (
                <button
                  onClick={() => {
                    clearPurchases();
                    playSound('cart');
                  }}
                  className="px-3 py-1.5 border border-rose-300 text-rose-600 text-xs font-bold rounded hover:bg-rose-50 transition-all"
                >
                  Purge Vault Archives
                </button>
              )}
            </div>

            {purchasedItems.length === 0 ? (
              <div className="border border-dashed border-stone-300 rounded-3xl p-16 text-center max-w-xl mx-auto space-y-4">
                <div className="text-5xl">📦</div>
                <h4 className="text-lg font-bold text-stone-700">Your vault is empty</h4>
                <p className="text-sm text-stone-500 font-light">
                  Search and purchase cosmic items in the storefront. Once authorized and checked out, your manifest shipments will warp into this vault.
                </p>
                <button
                  onClick={() => setActiveTab('shop')}
                  className="px-6 py-2.5 bg-amber-600 text-white font-bold rounded-lg text-xs"
                >
                  Browse Store
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-stone-200 bg-white rounded-2xl p-5 flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-amber-700 uppercase tracking-widest">{item.category}</span>
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold">
                          {item.shippingStatus}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-base text-stone-850 tracking-tight mt-2 flex items-center gap-2">
                        <span>{getEmoji(item.name)}</span> {item.name}
                      </h4>
                      <p className="text-xs text-stone-500 mt-2 font-light line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="border-t border-stone-100 pt-4 mt-4 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                      <div>
                        Purchased: <span className="text-stone-600 font-bold">{item.datePurchased.split(',')[0]}</span>
                      </div>
                      <div className="text-stone-800 font-extrabold">
                        {item.price === 0 ? 'Priceless' : `$${item.price.toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Cart Drawer Panel */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md h-full bg-white border-l border-stone-200 p-6 flex flex-col justify-between shadow-2xl relative">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-4 left-4 p-2 text-stone-400 hover:text-stone-800 transition-colors text-xl font-bold"
            >
              ×
            </button>
            
            <div className="flex flex-col flex-1 mt-8 min-h-0">
              <h3 className="text-lg font-bold tracking-tight border-b border-stone-200 pb-4 mb-4 flex items-center gap-2">
                <span>🛒</span> Cosmic Shopping Cart
              </h3>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-4xl text-stone-300">🛒</span>
                  <p className="text-stone-500 text-sm font-light">Your cart is currently empty.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-[#FDFBF7] rounded-xl border border-stone-200 items-center justify-between">
                      <div className="flex gap-3 items-center min-w-0">
                        <span className="text-2xl shrink-0">{item.emoji}</span>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-stone-850 truncate">{item.name}</h4>
                          <span className="text-[10px] text-amber-700 font-mono uppercase">{item.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-xs font-bold text-stone-800">
                          {item.price === 0 ? 'Free' : `$${item.price.toLocaleString()}`}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(idx)}
                          className="text-stone-400 hover:text-rose-500 text-sm font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Total and Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-stone-200 pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center text-sm font-mono font-bold">
                  <span className="text-stone-500">Order Subtotal:</span>
                  <span className="text-stone-800 text-lg">${totalCartPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => startCheckout()}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl transition-all shadow-md text-center"
                >
                  Proceed to Cosmic Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Screen Overlay */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
            
            {checkoutStep < 4 && (
              <button
                onClick={() => setIsCheckingOut(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-stone-800 font-bold"
              >
                Cancel
              </button>
            )}

            {checkoutStep === 1 && (
              <div className="space-y-6">
                <div className="text-center">
                  <span className="text-xs font-bold tracking-widest text-amber-700 uppercase font-mono">Quantum Checkout</span>
                  <h3 className="text-xl font-bold mt-1 text-stone-850">Verify Cosmic Payment</h3>
                </div>

                {/* Elegant Black Card visualization */}
                <div className="h-52 w-full rounded-2xl bg-gradient-to-br from-stone-900 via-stone-950 to-black border border-amber-400/35 p-6 flex flex-col justify-between relative overflow-hidden shadow-xl">
                  {/* Subtle golden swoosh design */}
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start z-10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest font-mono">VIZIONA COSMIC CARD</span>
                      <span className="text-[7px] text-stone-500 tracking-wider">BLACK METAL LIMITLESS</span>
                    </div>
                    <div className="text-2xl text-amber-400">∞</div>
                  </div>

                  {/* Card Chip */}
                  <div className="w-10 h-8 rounded bg-gradient-to-r from-amber-200 to-amber-500 opacity-80" />

                  <div className="z-10">
                    <div className="text-lg font-mono tracking-widest text-white">4000 8888 9999 1111</div>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        <div className="text-[7px] text-stone-500 uppercase tracking-wider font-semibold">Cardholder</div>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          className="bg-transparent border-none text-[11px] font-mono tracking-widest text-amber-400 outline-none p-0 w-32"
                          placeholder="CREATOR NAME"
                        />
                      </div>
                      <div className="text-right">
                        <div className="text-[7px] text-stone-500 uppercase tracking-wider font-semibold">Security</div>
                        <div className="text-[11px] font-mono tracking-widest text-white">CVV: 777</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Details Mock */}
                <div className="bg-[#FAF8F3] border border-stone-200 rounded-xl p-4 space-y-2">
                  <h4 className="text-xs font-bold text-stone-600 tracking-wide uppercase">Manifest coordinates</h4>
                  <p className="text-xs font-mono text-stone-500 leading-normal">
                    User Domain: <span className="text-stone-800">Cloud 9, Dreamer Street, Sector 7</span><br />
                    Warp Shipping: <span className="text-emerald-700 font-semibold">Quantum Transit (0.0001 sec)</span>
                  </p>
                </div>

                {/* Summary */}
                <div className="flex justify-between items-center text-sm font-mono border-t border-stone-150 pt-4">
                  <span className="text-stone-500">Authorization Total:</span>
                  <span className="text-stone-850 font-extrabold text-lg">${totalCartPrice.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => setCheckoutStep(2)}
                  className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl transition-all shadow-md text-center"
                >
                  Swipe Card to Manifest
                </button>
              </div>
            )}

            {/* Animation sequence steps */}
            {checkoutStep === 2 && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                {/* Loader */}
                <div className="w-16 h-16 rounded-full border-4 border-amber-600/20 border-t-amber-600 animate-spin" />
                <div className="text-center space-y-2">
                  <h4 className="font-bold text-lg text-stone-800">Encrypting Quantum Channel...</h4>
                  <p className="text-xs text-stone-400 font-mono">Generating wormhole path coordinates...</p>
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-600/20 border-t-emerald-600 animate-spin" />
                <div className="text-center space-y-2">
                  <h4 className="font-bold text-lg text-emerald-700 font-mono">Deducting from Cosmic Reserve...</h4>
                  <p className="text-xs text-stone-400 font-mono">Confirming authorization payload...</p>
                </div>
              </div>
            )}

            {checkoutStep === 4 && (
              <div className="flex flex-col items-center justify-center py-8 space-y-6 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 text-4xl rounded-full flex items-center justify-center animate-pulse">
                  ✓
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black tracking-tight text-stone-850">Purchase Approved!</h3>
                  <p className="text-sm text-stone-500 max-w-xs mx-auto font-light leading-relaxed">
                    Your transactions have cleared the cosmic registry. The items are warping to your coordinates.
                  </p>
                </div>

                <div className="w-full bg-[#FAF8F3] border border-stone-200 rounded-xl p-4 text-left font-mono text-xs text-stone-500 space-y-1">
                  <div>Invoice ID: <span className="text-stone-800">#{Math.floor(Math.random()*900000)+100000}</span></div>
                  <div>Delivery Address: <span className="text-stone-800">Wormhole Node 7-A</span></div>
                  <div>Cargo Status: <span className="text-emerald-700 font-bold">Warp Transit Active</span></div>
                </div>

                <button
                  onClick={() => {
                    setIsCheckingOut(false);
                    setCheckoutStep(0);
                    setActiveTab('vault');
                  }}
                  className="w-full py-4.5 bg-amber-600 hover:bg-amber-500 text-white font-extrabold rounded-xl transition-all"
                >
                  View My Acquisitions Vault
                </button>
              </div>
            )}

          </div>
        </div>
      )}
      
      {/* Global CSS style tags for breathing effects */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
