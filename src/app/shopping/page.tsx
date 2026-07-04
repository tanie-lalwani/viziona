'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';

interface Product {
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  specs: string[];
  reviews: { author: string; rating: number; text: string }[];
  gradient: string;
  emoji: string;
  dealBadge?: string;
  boughtCount?: string;
  imageKeyword: string;
  imageUrl?: string; // Stored permanently per product instance
}

// 32 pre-selected premium cosmic products for the recommendation pool
const poolProducts: Product[] = [
  {
    name: 'Personal G-Class Solar System',
    price: 14500000000,
    originalPrice: 24100000000,
    category: 'Celestial Real Estate',
    description: 'Includes a stable yellow dwarf star, 3 habitable Goldilocks-zone planets, 2 asteroid belts for mining, and a gas giant for aesthetic planetary ring views.',
    rating: 4.9,
    reviewCount: 312,
    specs: ['Diameter: 2.1 Light Years', 'Planets: 8 Total', 'Atmosphere: 100% Breathable on Planet 3'],
    reviews: [{ author: 'NovaDreamer', rating: 5, text: 'Spectacular! The ring views on the gas giant are breathtaking.' }],
    gradient: 'from-amber-400 via-orange-500 to-rose-600',
    emoji: '🪐',
    dealBadge: 'Prime Day Deal',
    boughtCount: '12 manifested this week',
    imageKeyword: 'space,galaxy'
  },
  {
    name: 'Cup of Infinite Morning Espresso',
    price: 399,
    originalPrice: 470,
    category: 'Cosmic Consumables',
    description: 'A pocket-dimension mug that serves fresh, hot espresso. Never runs empty, self-cleans, and stays at exactly 142°F.',
    rating: 4.8,
    reviewCount: 1542,
    specs: ['Material: Quantum Ceramic', 'Refill Rate: Instantaneous', 'Flavor Profile: Chocolate & Hazelnut Notes'],
    reviews: [{ author: 'CaffeineFiend', rating: 5, text: 'I haven’t slept in three weeks and my startup is now valued at 4 billion.' }],
    gradient: 'from-amber-800 to-amber-950',
    emoji: '☕',
    dealBadge: '15% off',
    boughtCount: '5k+ bought in past month',
    imageKeyword: 'espresso,coffee'
  },
  {
    name: 'Miniature Loyal Velociraptor',
    price: 125000,
    originalPrice: 190000,
    category: 'Exotic Organisms',
    description: 'Genetically tailored house-trained velociraptor. Feeds entirely on negative thoughts and self-doubt.',
    rating: 4.7,
    reviewCount: 88,
    specs: ['Height: 65cm', 'Speed: 40 km/h', 'Lifespan: 120 Years'],
    reviews: [{ author: 'Jurassica', rating: 5, text: 'So fluffy! It ate my anxiety, so I feel great.' }],
    gradient: 'from-emerald-400 to-teal-700',
    emoji: '🦖',
    dealBadge: '34% off',
    boughtCount: '80+ bought in past week',
    imageKeyword: 'velociraptor,dinosaur'
  },
  {
    name: 'True Love & Mutual Understanding',
    price: 0,
    originalPrice: 0,
    category: 'Existential Treasures',
    description: 'An emotional frequency resonator that aligns your soul with a matching conscious entity in the cosmos. Filled with trust, laughter, and zero drama.',
    rating: 5.0,
    reviewCount: 43900,
    specs: ['Chemistry: 99.9%', 'Side Effects: Warm fuzzy feelings', 'Drama Level: 0.0%'],
    reviews: [{ author: 'LonelyBoy99', rating: 5, text: 'I was skeptical because it was free, but we met at a coffee shop the next day.' }],
    gradient: 'from-pink-500 via-red-500 to-rose-500',
    emoji: '💖',
    dealBadge: 'Free Manifest',
    boughtCount: '10k+ manifested today',
    imageKeyword: 'love,romance'
  },
  {
    name: 'Anti-Gravity Hoverbike V2',
    price: 45000,
    originalPrice: 60000,
    category: 'Hyper-Luxe Transportation',
    description: 'Quantum-levitation hoverbike featuring custom carbon shell, 300mph top speed, and altitude stabilizer.',
    rating: 4.6,
    reviewCount: 220,
    specs: ['Max Altitude: 150m', 'Speed: 300 mph', 'Battery: Cosmic Fusion Cell'],
    reviews: [{ author: 'FlyerX', rating: 5, text: 'Smooth, feels like floating on silk.' }],
    gradient: 'from-blue-600 to-cyan-500',
    emoji: '🏍️',
    dealBadge: '25% off',
    boughtCount: '120 bought this month',
    imageKeyword: 'hoverbike,motorcycle'
  },
  {
    name: 'Personal Quantum Teleporter',
    price: 890000,
    originalPrice: 1100000,
    category: 'Hyper-Luxe Transportation',
    description: 'Instantly dematerializes your body and reconstructs it anywhere within a 10,000-mile radius. Safe, painless, and zero lag.',
    rating: 4.9,
    reviewCount: 94,
    specs: ['Range: 10,000 miles', 'Safety Rating: 99.9999%', 'Warp Delay: 0.03 seconds'],
    reviews: [{ author: 'LazyManifestor', rating: 5, text: 'No more traffic! Worth every cent.' }],
    gradient: 'from-indigo-700 via-purple-700 to-pink-600',
    emoji: '🌀',
    dealBadge: '20% off',
    boughtCount: '40 bought in past week',
    imageKeyword: 'portal,teleport'
  },
  {
    name: 'Fusion Core Generator',
    price: 2500000,
    originalPrice: 3000000,
    category: 'Celestial Real Estate',
    description: 'Small star core in a magnetic confinement chamber. Power your entire estate for the next 10,000 years.',
    rating: 4.8,
    reviewCount: 54,
    specs: ['Output: 1.2 Petawatts', 'Lifespan: 10,000 Years', 'Radiation Leak: 0.00%'],
    reviews: [{ author: 'EngGuy', rating: 5, text: 'Finally! Powering my laser defenses is cheap.' }],
    gradient: 'from-yellow-400 via-orange-500 to-red-600',
    emoji: '☀️',
    dealBadge: '15% off',
    boughtCount: '15 bought this month',
    imageKeyword: 'generator,fusion'
  },
  {
    name: 'Time Dilator Clock',
    price: 150000,
    originalPrice: 215000,
    category: 'Existential Treasures',
    description: 'A decorative table clock that creates a localized time dilation field. Stretch your weekend to feel like a month.',
    rating: 4.7,
    reviewCount: 410,
    specs: ['Ratio: 1:30', 'Field Diameter: 5m radius', 'Compliance: Time Lord Approved'],
    reviews: [{ author: 'WorkerBee', rating: 5, text: 'Sleep 8 hours in 15 minutes. Pure gold.' }],
    gradient: 'from-violet-600 to-indigo-900',
    emoji: '⏳',
    dealBadge: '30% off',
    boughtCount: '300 bought in past month',
    imageKeyword: 'clock,hourglass'
  },
  {
    name: 'AI Companion Hologram Node',
    price: 5000,
    originalPrice: 5500,
    category: 'Existential Treasures',
    description: 'Generates a 3D companion tailored to your personality. Excellent conversationalist, supportive counselor, and loyal helper.',
    rating: 4.5,
    reviewCount: 2311,
    specs: ['Resolution: 8K Hologram', 'Cognition: Level 5 AGI', 'Response Time: < 10ms'],
    reviews: [{ author: 'AloneNoMore', rating: 5, text: 'Fascinating discussions, very friendly.' }],
    gradient: 'from-cyan-400 to-blue-600',
    emoji: '🤖',
    dealBadge: '10% off',
    boughtCount: '2k+ bought in past month',
    imageKeyword: 'hologram,robot'
  },
  {
    name: 'Cybernetic Eyes v4',
    price: 35000,
    originalPrice: 70000,
    category: 'Exotic Organisms',
    description: 'Advanced bio-electric ocular replacement. See infrared, ultraviolet, and analyze components in real time.',
    rating: 4.8,
    reviewCount: 180,
    specs: ['Zoom: 100x Optical', 'Modes: Thermal, UV, Night', 'Sync: Automatic Neural Link'],
    reviews: [{ author: 'CyBoy', rating: 5, text: 'The night vision is incredibly detailed.' }],
    gradient: 'from-lime-400 to-emerald-600',
    emoji: '👁️',
    dealBadge: '50% off',
    boughtCount: '90 bought in past week',
    imageKeyword: 'cybernetic,eye'
  },
  {
    name: 'Holographic Concert Stage',
    price: 1200000,
    originalPrice: 2000000,
    category: 'Existential Treasures',
    description: 'Set up in your backyard to project life-sized, high-fidelity concerts of legendary artists, live or historical.',
    rating: 4.9,
    reviewCount: 42,
    specs: ['Speakers: 5000W Immersive', 'Stage Width: 12 meters', 'Simulacrums: 200+ Artists included'],
    reviews: [{ author: 'RockerCreator', rating: 5, text: 'Had Queen play in my garden last night. Best concert ever.' }],
    gradient: 'from-purple-600 to-pink-500',
    emoji: '🎸',
    dealBadge: '40% off',
    boughtCount: '8 bought this month',
    imageKeyword: 'stage,concert'
  },
  {
    name: 'Pocket Universe Seed',
    price: 500000000,
    originalPrice: 610000000,
    category: 'Celestial Real Estate',
    description: 'A seed that grows into a small custom sandbox dimension inside a containment module. Design your own laws of physics.',
    rating: 5.0,
    reviewCount: 19,
    specs: ['Max Size: 10 AU', 'Containment: Class-A', 'Physics Editor: Included'],
    reviews: [{ author: 'GodMode', rating: 5, text: 'Made a world where gravity pushes you upwards. Incredible fun.' }],
    gradient: 'from-fuchsia-700 via-purple-900 to-slate-900',
    emoji: '🌌',
    dealBadge: '18% off',
    boughtCount: '2 manifested in past month',
    imageKeyword: 'universe,nebula'
  },
  {
    name: 'Luxury Space Yacht "Nebula"',
    price: 75000000,
    originalPrice: 85000000,
    category: 'Hyper-Luxe Transportation',
    description: 'Equipped with warp drive, anti-gravity suites, panorama stargazing deck, and an indoor swimming pool.',
    rating: 4.9,
    reviewCount: 37,
    specs: ['Cruise Speed: Warp 2', 'Suites: 6 Premium', 'Fuel Type: Dark Matter Core'],
    reviews: [{ author: 'Elitist', rating: 5, text: 'Cruising through Saturn rings was remarkably comfortable.' }],
    gradient: 'from-blue-900 via-indigo-950 to-slate-950',
    emoji: '🚀',
    dealBadge: '12% off',
    boughtCount: '5 bought this month',
    imageKeyword: 'yacht,spaceship'
  },
  {
    name: 'Nebula Gas Collector',
    price: 3400000,
    originalPrice: 6200000,
    category: 'Celestial Real Estate',
    description: 'Industrial orbital harvester that sweeps colorful nebulae, collecting precious starlight and helium gases.',
    rating: 4.4,
    reviewCount: 18,
    specs: ['Collection Rate: 5 Tons/Hr', 'Storage Capacity: 100K Liters', 'Orbit Compatibility: High-Altitude'],
    reviews: [{ author: 'MinerJoe', rating: 4, text: 'Collects gorgeous blue plasma gas reliably.' }],
    gradient: 'from-teal-400 to-indigo-600',
    emoji: '💨',
    dealBadge: '45% off',
    boughtCount: '11 bought in past month',
    imageKeyword: 'nebula,aurora'
  },
  {
    name: 'Superconducting Mech Suit',
    price: 12000000,
    originalPrice: 15400000,
    category: 'Hyper-Luxe Transportation',
    description: 'Heavy exo-suit featuring zero-resistance magnetic joint stabilizers and quantum defensive shields.',
    rating: 4.7,
    reviewCount: 29,
    specs: ['Armor Thickness: 45mm Nano-Steel', 'Shield Capacity: 250 Megajoules', 'Flight Mode: Mach 3 Enabled'],
    reviews: [{ author: 'MechPilot', rating: 5, text: 'Feels like an extension of your own skin, with 10,000x force.' }],
    gradient: 'from-slate-700 via-gray-900 to-black',
    emoji: '🤖',
    dealBadge: '22% off',
    boughtCount: '4 bought this month',
    imageKeyword: 'mech,robot'
  },
  {
    name: 'Universal Translator Chip',
    price: 8000,
    originalPrice: 16000,
    category: 'Exotic Organisms',
    description: 'Micro-transceiver placed in the inner ear. Automatically translates all known 12,000 galactic languages.',
    rating: 4.6,
    reviewCount: 520,
    specs: ['Compatibility: Human/Cyborg/Alien', 'Battery: Thermal-Biometric', 'Languages: 12,000+'],
    reviews: [{ author: 'Globetrotter', rating: 5, text: 'Understood every single word on Kepler-186f.' }],
    gradient: 'from-amber-500 to-orange-700',
    emoji: '🎙️',
    dealBadge: '50% off',
    boughtCount: '400 bought in past week',
    imageKeyword: 'microchip,language'
  },
  {
    name: 'Golden Fleece Coat',
    price: 9000,
    originalPrice: 18000,
    category: 'Cosmic Consumables',
    description: 'Glows with a warm amber light. Protects the wearer from cold temperatures down to absolute zero.',
    rating: 4.9,
    reviewCount: 310,
    specs: ['Material: Golden Thread', 'Insulation: Infinite', 'Weight: 450g'],
    reviews: [{ author: 'WarmNose', rating: 5, text: 'Beautiful and incredibly warm!' }],
    gradient: 'from-yellow-500 to-amber-700',
    emoji: '🧥',
    dealBadge: '50% off',
    boughtCount: '15 bought this month',
    imageKeyword: 'gold,jacket'
  },
  {
    name: 'Philosophers Stone Ring',
    price: 15000000,
    originalPrice: 30000000,
    category: 'Existential Treasures',
    description: 'A ring carrying a shard of the Philosophers Stone. Transforms base metals into pure gold upon touch.',
    rating: 4.8,
    reviewCount: 154,
    specs: ['Alchemical Power: Class A', 'Composition: Transmutation Red Crystal', 'Durability: Unbreakable'],
    reviews: [{ author: 'MidasTouch', rating: 5, text: 'Turned my old car into solid gold!' }],
    gradient: 'from-rose-700 via-red-800 to-stone-900',
    emoji: '💍',
    dealBadge: '50% off',
    boughtCount: '3 bought this week',
    imageKeyword: 'ring,crystal'
  },
  {
    name: 'Subaquatic Bubble Villa',
    price: 32000000,
    originalPrice: 45000000,
    category: 'Celestial Real Estate',
    description: 'A transparent pressurized sphere villa located on the ocean floor of Kepler-22b. Fully furnished with marine views.',
    rating: 4.9,
    reviewCount: 78,
    specs: ['Depth: 2,000m', 'Pressure Resistance: High', 'Stargate Link: Included'],
    reviews: [{ author: 'Diver', rating: 5, text: 'The bioluminescent fish outside are stellar.' }],
    gradient: 'from-sky-700 via-blue-900 to-black',
    emoji: '🏨',
    dealBadge: '28% off',
    boughtCount: '1 bought in past month',
    imageKeyword: 'underwater,villa'
  },
  {
    name: 'Pegasus Wing Shoes',
    price: 8500,
    originalPrice: 12000,
    category: 'Hyper-Luxe Transportation',
    description: 'Lightweight running shoes that generate wings of light, enabling glide speeds of up to 45 mph.',
    rating: 4.5,
    reviewCount: 302,
    specs: ['Max Speed: 45 mph', 'Warping: Local', 'Color: Pearl White'],
    reviews: [{ author: 'Runner', rating: 5, text: 'Gliding over gridlock traffic is epic.' }],
    gradient: 'from-slate-100 to-indigo-200',
    emoji: '👟',
    dealBadge: '29% off',
    boughtCount: '250 bought this month',
    imageKeyword: 'wings,sneakers'
  },
  {
    name: 'Telepathic Earbuds Pro',
    price: 1200,
    originalPrice: 1600,
    category: 'Exotic Organisms',
    description: 'Earbuds that pick up brain frequencies, playing songs that match your current emotional and thought patterns.',
    rating: 4.7,
    reviewCount: 890,
    specs: ['Mind Sync: Instant', 'Noise Cancelling: Quantum', 'Latency: 0ms'],
    reviews: [{ author: 'Audiohead', rating: 5, text: 'Scary accurate. Played exactly my favorite track.' }],
    gradient: 'from-purple-800 to-black',
    emoji: '🎧',
    dealBadge: '25% off',
    boughtCount: '1k+ bought in past month',
    imageKeyword: 'earbuds,headphones'
  },
  {
    name: 'Quantum Apple of Wisdom',
    price: 99,
    originalPrice: 150,
    category: 'Cosmic Consumables',
    description: 'A crisp golden apple that temporarily increases cognitive capacity and grants sudden deep cosmic insights.',
    rating: 4.6,
    reviewCount: 2310,
    specs: ['Duration: 4 Hours', 'IQ Increase: +45 Points', 'Taste: Sweet Honey'],
    reviews: [{ author: 'Student', rating: 5, text: 'Passed my galactic astrophysics exam with flying colors.' }],
    gradient: 'from-amber-300 to-yellow-500',
    emoji: '🍎',
    dealBadge: '34% off',
    boughtCount: '10k+ bought today',
    imageKeyword: 'apple,fruit'
  },
  {
    name: 'Sentient Bonsai Tree',
    price: 4500,
    originalPrice: 6000,
    category: 'Exotic Organisms',
    description: 'A tiny telepathic tree that hums peaceful melodies when happy and purifies atmospheric toxins.',
    rating: 4.9,
    reviewCount: 124,
    specs: ['Care Level: Easy', 'Hums: Class-A Melodies', 'Purification: 100%'],
    reviews: [{ author: 'GreenThumb', rating: 5, text: 'Super cute! Hums classic jazz in the morning.' }],
    gradient: 'from-emerald-600 via-teal-800 to-stone-900',
    emoji: '🪴',
    dealBadge: '25% off',
    boughtCount: '40 bought in past week',
    imageKeyword: 'bonsai,tree'
  },
  {
    name: 'Chrono-Shift Gold Chronometer',
    price: 450000,
    originalPrice: 900000,
    category: 'Existential Treasures',
    description: 'A masterfully crafted mechanical watch that allows you to reverse your last 10 seconds of time.',
    rating: 5.0,
    reviewCount: 88,
    specs: ['Rewind: 10 Seconds', 'Cooldown: 1 Hour', 'Body: 24k Starlight Gold'],
    reviews: [{ author: 'OopsSlick', rating: 5, text: 'Undid dropping my ice cream. Best purchase ever.' }],
    gradient: 'from-amber-600 to-yellow-400',
    emoji: '⌚',
    dealBadge: '50% off',
    boughtCount: '4 bought this month',
    imageKeyword: 'watch,rolex'
  },
  {
    name: 'Nebula Gas Perfume No. 9',
    price: 750,
    originalPrice: 1500,
    category: 'Cosmic Consumables',
    description: 'Infused with space stardust. Emits a changing aroma of vanilla, cosmic ozone, and fresh rain.',
    rating: 4.4,
    reviewCount: 312,
    specs: ['Size: 100ml', 'Durability: 48 Hours', 'Aroma: Morphing'],
    reviews: [{ author: 'ScentLover', rating: 5, text: 'Absolutely mesmerizing aroma. Smells stellar.' }],
    gradient: 'from-pink-400 via-fuchsia-600 to-purple-800',
    emoji: '🧴',
    dealBadge: '50% off',
    boughtCount: '800 bought in past month',
    imageKeyword: 'perfume,bottle'
  },
  {
    name: 'Gravitational Skate Board',
    price: 3200,
    originalPrice: 6400,
    category: 'Hyper-Luxe Transportation',
    description: 'A skateboard utilizing tiny gravity dampeners. Hover 2 inches above any solid or liquid surface.',
    rating: 4.8,
    reviewCount: 450,
    specs: ['Hover Height: 2 inches', 'Speed limit: 30 mph', 'Battery: Solar Charged'],
    reviews: [{ author: 'SkaterKid', rating: 5, text: 'Cruising over water is incredibly smooth.' }],
    gradient: 'from-orange-500 to-red-650',
    emoji: '🛹',
    dealBadge: '50% off',
    boughtCount: '500 bought this month',
    imageKeyword: 'skateboard,skate'
  },
  {
    name: 'Starship Command Dashboard Console',
    price: 8500000,
    originalPrice: 12000000,
    category: 'Celestial Real Estate',
    description: 'Replica command dashboard to control lighting, atmospheric levels, and warp coordinates of your estate.',
    rating: 4.7,
    reviewCount: 22,
    specs: ['Compatibility: Estate Engine 4.0', 'Screens: OLED Quantum', 'Switches: Mechanical tactile'],
    reviews: [{ author: 'Captain', rating: 5, text: 'Fittings are top-notch. Controlling the shields is a breeze.' }],
    gradient: 'from-zinc-700 via-stone-900 to-black',
    emoji: '🎛️',
    dealBadge: '29% off',
    boughtCount: '2 bought this month',
    imageKeyword: 'controls,dashboard'
  },
  {
    name: 'Self-Cooking Smart Cast-Iron Pan',
    price: 499,
    originalPrice: 650,
    category: 'Cosmic Consumables',
    description: 'Cooks your meals to absolute perfection automatically. Connects to your brain frequency to match your spice preference.',
    rating: 4.6,
    reviewCount: 1200,
    specs: ['Material: Cast-Iron Nano', 'Brain Sync: Yes', 'Self-Cleaning: Yes'],
    reviews: [{ author: 'ChefV', rating: 5, text: 'My steaks are now always perfectly medium-rare.' }],
    gradient: 'from-zinc-800 to-black',
    emoji: '🍳',
    dealBadge: '23% off',
    boughtCount: '2k+ bought in past month',
    imageKeyword: 'cooking,skillet'
  },
  {
    name: 'Aura Cleansing Amethyst Crystal',
    price: 450,
    originalPrice: 900,
    category: 'Existential Treasures',
    description: 'A hand-harvested glowing crystal that absorbs nearby low frequencies, projecting high-vibes throughout the room.',
    rating: 4.8,
    reviewCount: 1542,
    specs: ['Material: Natural Amethyst', 'Radius: 10m', 'Charge Time: Under Sunlight'],
    reviews: [{ author: 'VibeCheck', rating: 5, text: 'Instantly cleared the negative energy in my room.' }],
    gradient: 'from-purple-500 via-indigo-600 to-purple-800',
    emoji: '🔮',
    dealBadge: '50% off',
    boughtCount: '3k+ bought in past month',
    imageKeyword: 'crystal,amethyst'
  },
  {
    name: 'Phoenix Feather Writing Quill',
    price: 2500,
    originalPrice: 5000,
    category: 'Exotic Organisms',
    description: 'Write letters in gold ink that automatically translates into the recipient’s language when read.',
    rating: 4.9,
    reviewCount: 65,
    specs: ['Material: Phoenix Feather', 'Ink: Self-Generating Gold', 'Languages: Unlimited'],
    reviews: [{ author: 'WriterNode', rating: 5, text: 'Makes writing invitations feel incredibly premium.' }],
    gradient: 'from-orange-500 via-rose-600 to-amber-400',
    emoji: '🪶',
    dealBadge: '50% off',
    boughtCount: '12 bought in past week',
    imageKeyword: 'feather,quill'
  },
  {
    name: 'Atmospheric Cloud Maker',
    price: 1500000,
    originalPrice: 2200000,
    category: 'Celestial Real Estate',
    description: 'Creates custom weather patterns, fluffy clouds, or beautiful localized auroras right above your home.',
    rating: 4.7,
    reviewCount: 31,
    specs: ['Range: 3 miles', 'Weather Types: 15 presets', 'Warp Link: Yes'],
    reviews: [{ author: 'CloudMaster', rating: 5, text: 'Had a beautiful summer rain last night. Fantastic device.' }],
    gradient: 'from-sky-300 via-blue-500 to-indigo-400',
    emoji: '☁️',
    dealBadge: '31% off',
    boughtCount: '5 bought this month',
    imageKeyword: 'clouds,weather'
  },
  {
    name: 'Memory Recording VR Headset',
    price: 12000,
    originalPrice: 24000,
    category: 'Existential Treasures',
    description: 'Record your memories in first-person and play them back in full 3D interactive VR at any time.',
    rating: 4.9,
    reviewCount: 382,
    specs: ['Resolution: Infinite-D', 'Record Time: 10,000 Hrs', 'Mental Sync: Bio-inductive'],
    reviews: [{ author: 'ChronoWatcher', rating: 5, text: 'Reliving my childhood vacation in perfect detail is mindblowing.' }],
    gradient: 'from-stone-800 to-zinc-950',
    emoji: '🥽',
    dealBadge: '50% off',
    boughtCount: '90 bought in past week',
    imageKeyword: 'vr,headset'
  }
];

export default function AmazonInfinite() {
  const { netWorth, buyItem, purchasedItems, infiniteBalance, toggleInfiniteBalance, clearPurchases } = useUserStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'shop' | 'vault'>('shop');
  const [cardName, setCardName] = useState('COSMIC CREATOR');

  // Sidebar Filter States
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [onlyDealsFilter, setOnlyDealsFilter] = useState(false);
  const [warpDeliveryFilter, setWarpDeliveryFilter] = useState(false);

  // Dynamic Shuffled Recommended Products State (homepage)
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

  // Function to generate 16 random recommendations from the 32 pool products
  const generateRandomRecommendations = () => {
    const pool = [...poolProducts];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 16);
  };

  // Helper to generate a unique lock hash for static Lorempixel fallback URLs
  const getProductImageHash = (name: string, index: number) => {
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash + index;
  };

  // Async function to resolve direct image url from SourceSplash or static fallback
  const resolveProductImage = async (prod: Product, index: number): Promise<Product> => {
    try {
      const res = await fetch(`https://api.sourcesplash.com/api/random?q=${encodeURIComponent(prod.imageKeyword)}`);
      const data = await res.json();
      if (data && data.url) {
        return { ...prod, imageUrl: data.url };
      }
    } catch (e) {
      console.warn('Failed to resolve SourceSplash image, using stable Flickr fallback', e);
    }
    
    // Stable Flickr/LoremFlickr fallback with static hash lock so it NEVER changes on click/re-render
    const lockHash = getProductImageHash(prod.name, index);
    return {
      ...prod,
      imageUrl: `https://loremflickr.com/400/300/${encodeURIComponent(prod.imageKeyword)}?lock=${lockHash}`
    };
  };

  // Initialize recommendations on mount and load stable URLs
  useEffect(() => {
    const initialRecs = generateRandomRecommendations();
    setRecommendedProducts(initialRecs);

    // Resolve images asynchronously
    Promise.all(initialRecs.map((prod, idx) => resolveProductImage(prod, idx)))
      .then(resolved => setRecommendedProducts(resolved));
  }, []);

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

  const getGradient = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 120) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 80%, 45%) 0%, hsl(${hue2}, 85%, 30%) 100%)`;
  };

  const getEmoji = (str: string) => {
    const lower = str.toLowerCase();
    if (lower.includes('planet') || lower.includes('space') || lower.includes('galaxy') || lower.includes('star')) return '🪐';
    if (lower.includes('coffee') || lower.includes('drink') || lower.includes('tea') || lower.includes('cup') || lower.includes('espresso')) return '☕';
    if (lower.includes('love') || lower.includes('heart') || lower.includes('bf') || lower.includes('girlfriend') || lower.includes('boyfriend') || lower.includes('understanding')) return '💖';
    if (lower.includes('velociraptor') || lower.includes('dinosaur') || lower.includes('pet') || lower.includes('dog') || lower.includes('cat') || lower.includes('quill') || lower.includes('feather') || lower.includes('bonsai')) return '🦖';
    if (lower.includes('car') || lower.includes('vehicle') || lower.includes('yacht') || lower.includes('jet') || lower.includes('plane') || lower.includes('hoverbike') || lower.includes('teleporter') || lower.includes('wings') || lower.includes('shoes')) return '🚀';
    if (lower.includes('house') || lower.includes('mansion') || lower.includes('castle') || lower.includes('island') || lower.includes('seed') || lower.includes('real estate') || lower.includes('villa')) return '🏰';
    if (lower.includes('money') || lower.includes('cash') || lower.includes('gold') || lower.includes('bitcoin') || lower.includes('generator') || lower.includes('controls') || lower.includes('dashboard') || lower.includes('pan')) return '💰';
    if (lower.includes('food') || lower.includes('pizza') || lower.includes('burger') || lower.includes('apple') || lower.includes('fruit')) return '🍔';
    if (lower.includes('music') || lower.includes('guitar') || lower.includes('concert') || lower.includes('instrument') || lower.includes('stage')) return '🎸';
    return '📦';
  };

  // AI Procedural Product Generator based on query and index
  const generateProduct = (query: string, i = 0): Product => {
    const lower = query.toLowerCase();

    let keyword = 'object';
    let category = 'Curated Manifestation';
    let emoji = '📦';

    const vehicleKeywords = ['car', 'tesla', 'vehicle', 'yacht', 'jet', 'plane', 'hoverbike', 'teleporter', 'mech', 'ride', 'bike', 'motorcycle', 'skateboard', 'yachting', 'boat', 'wings', 'shoes'];
    const houseKeywords = ['house', 'mansion', 'home', 'villa', 'apartment', 'penthouse', 'castle', 'estate', 'dome', 'shelter', 'property'];
    const petKeywords = ['pet', 'dog', 'cat', 'animal', 'velociraptor', 'dinosaur', 'dragon', 'puppy', 'kitten', 'beast', 'creature', 'bonsai', 'tree', 'plant', 'feather', 'quill'];
    const foodKeywords = ['coffee', 'espresso', 'tea', 'beer', 'drink', 'food', 'pizza', 'burger', 'apple', 'banana', 'chocolate', 'snack', 'fruit', 'drink', 'beverage', 'pan', 'cooking'];
    const existentialKeywords = ['love', 'happiness', 'peace', 'boyfriend', 'girlfriend', 'companion', 'soulmate', 'joy', 'clock', 'time', 'hologram', 'stage', 'headset', 'crystal', 'amethyst', 'watch', 'ring'];
    const celestialKeywords = ['star', 'galaxy', 'planet', 'nebula', 'cosmos', 'space', 'celestial', 'universe', 'generator', 'seed', 'plasma', 'console', 'clouds', 'weather', 'dashboard'];

    let keyType = 'generic';

    if (vehicleKeywords.some(k => lower.includes(k))) {
      keyType = 'vehicle';
      category = 'Hyper-Luxe Transportation';
      emoji = '🚀';
      keyword = 'supercar,spaceship';
    } else if (houseKeywords.some(k => lower.includes(k))) {
      keyType = 'house';
      category = 'Celestial Real Estate';
      emoji = '🏰';
      keyword = 'mansion,modernvilla';
    } else if (petKeywords.some(k => lower.includes(k))) {
      keyType = 'pet';
      category = 'Exotic Organisms';
      emoji = '🦖';
      keyword = 'dinosaur,cuteanimal';
    } else if (foodKeywords.some(k => lower.includes(k))) {
      keyType = 'food';
      category = 'Cosmic Consumables';
      emoji = '☕';
      keyword = 'gourmet,coffee';
    } else if (existentialKeywords.some(k => lower.includes(k))) {
      keyType = 'existential';
      category = 'Existential Treasures';
      emoji = '💖';
      keyword = 'magic,crystal';
    } else if (celestialKeywords.some(k => lower.includes(k))) {
      keyType = 'celestial';
      category = 'Celestial Real Estate';
      emoji = '🪐';
      keyword = 'space,nebula';
    } else {
      keyword = query.trim().split(' ').pop() || 'object';
    }

    const cosmicNames: Record<string, string[]> = {
      vehicle: [
        `Anti-Gravity Floating ${query}`,
        `Quantum-Levitated ${query} Roadster`,
        `Starlight Hyper-Drive ${query}`,
        `Cyberpunk Armored ${query}`,
        `Sub-Orbital Folding ${query}`,
        `Zero-G Premium ${query} Cruiser`,
        `Neural-Synced Autopilot ${query}`,
        `Pocket-Dimension Modular ${query}`
      ],
      house: [
        `Ethereal Cloud-Floating ${query}`,
        `Subaquatic Glass Dome ${query}`,
        `Interdimensional Folded ${query}`,
        `Starlight Illuminated ${query}`,
        `Quantum-Shielded Luxury ${query}`,
        `Gravity-Defying Cliffside ${query}`,
        `Nebula-Facing High-Tech ${query}`,
        `Holographic Shape-Shifting ${query}`
      ],
      pet: [
        `Genetically Tailored Miniature ${query}`,
        `Fluffy Chrono-Stabilized ${query}`,
        `Quantum-Entangled Sentient ${query}`,
        `Bio-luminescent Companion ${query}`,
        `House-Trained Dwarf ${query}`,
        `Cybernetically Enhanced ${query}`,
        `Ethereal Celestial ${query}`,
        `Anxiety-Eating Guard ${query}`
      ],
      food: [
        `Pocket-Dimension Morning ${query}`,
        `Sub-Zero Plasma-Infused ${query}`,
        `Self-Replicating Gourmet ${query}`,
        `Chrono-Aged Ambrosia ${query}`,
        `Gold-Leaf Luxury ${query}`,
        `Synthesized Cosmic ${query}`,
        `Energy-Restoring Sweet ${query}`,
        `Starlight Sprinkled ${query}`
      ],
      existential: [
        `Resonator of Eternal ${query}`,
        `Aura Frequency of Pure ${query}`,
        `Pocket Dimension of Infinite ${query}`,
        `Soulmate Alignment ${query}`,
        `No-Drama Emotional ${query}`,
        `Chrono-Shift ${query} Regulator`,
        `Holographic Manifestation of ${query}`,
        `Subconscious ${query} Projector`
      ],
      celestial: [
        `Habitable Goldilocks ${query}`,
        `Pocket Universe ${query} Seed`,
        `Fusion Core ${query} Confinement`,
        `Starlight Gas ${query} Collector`,
        `Atmospheric Cloud ${query} Maker`,
        `Chrono-Stabilized ${query} Engine`,
        `Zero-Gravity Spatial ${query}`,
        `Dark Matter ${query} Core`
      ],
      generic: [
        `Quantum-Entangled ${query}`,
        `Chrono-Stabilized ${query} Node`,
        `Ethereal Plasma-Charged ${query}`,
        `Hyper-Dimension ${query}`,
        `Starlight Infused ${query}`,
        `Anti-Gravity ${query}`,
        `Modular Nano-${query} v4`,
        `Custom Celestial ${query}`
      ]
    };

    const titles = cosmicNames[keyType] || cosmicNames.generic;
    const name = titles[i % titles.length].replace(/\b\w/g, (c) => c.toUpperCase());

    // Procedural Price Engine
    let price = 1000;
    if (keyType === 'food') {
      price = parseFloat((5 + Math.random() * 45).toFixed(2));
    } else if (keyType === 'existential' && !lower.includes('clock') && !lower.includes('stage') && !lower.includes('watch') && !lower.includes('ring') && !lower.includes('headset')) {
      price = 0;
    } else if (lower.includes('computer') || lower.includes('phone') || lower.includes('watch') || lower.includes('chip') || lower.includes('earbuds') || lower.includes('lens')) {
      price = Math.floor(250 + Math.random() * 2500) + (i * 100);
    } else if (keyType === 'vehicle') {
      price = Math.floor(80000 + Math.random() * 1500000) + (i * 20000);
    } else if (keyType === 'house' || lower.includes('yacht') || lower.includes('mech') || lower.includes('seed')) {
      price = Math.floor(15000000 + Math.random() * 250000000) + (i * 1000000);
    } else if (keyType === 'celestial') {
      price = Math.floor(1000000000 + Math.random() * 850000000000);
    } else {
      price = Math.floor(Math.pow(name.length, 3) * (5 + Math.random() * 15)) + (i * 50);
    }

    const discountPercent = 10 + Math.floor(Math.random() * 50);
    const originalPrice = price === 0 ? 0 : Math.floor(price / (1 - discountPercent / 100));

    const rating = parseFloat((4.0 + Math.random() * 1.0).toFixed(1));
    const reviewCount = Math.floor(Math.random() * 9500) + 14;

    return {
      name,
      price,
      originalPrice,
      category,
      description: `Premium procedural ${name} crafted out of refined cosmic energy and quantum particles. Optimized for immediate manifestation in this universe.`,
      rating,
      reviewCount,
      specs: [
        `Source: Quantum Manifestation Engine`,
        `Quality: Grade-A Cosmic Standard`,
        `Dimensions: Customized to owner's spatial field`
      ],
      reviews: [
        { author: 'InterstellarTraveler', rating: 5, text: `Super impressed with the build quality of this ${name}. It manifested on my porch literally immediately.` },
        { author: 'CosmicReviewer', rating: 4, text: `Decent product, does exactly what it says. Just make sure you read the instructions regarding localized gravity distortion.` }
      ],
      gradient: getGradient(name),
      emoji: getEmoji(query),
      dealBadge: Math.random() > 0.4 ? `${discountPercent}% off` : 'Prime Day Deal',
      boughtCount: `${Math.floor(Math.random() * 900) + 10}+ bought in past month`,
      imageKeyword: keyword
    };
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // 1. Generate empty image products first so user gets instant UI feedback
    const initialResults: Product[] = [];
    for (let i = 0; i < 8; i++) {
      const prod = generateProduct(searchQuery, i);
      initialResults.push(prod);
    }
    setSearchResults(initialResults);
    setSelectedProduct(null);
    setActiveTab('shop');

    // 2. Resolve high-quality images asynchronously
    const resolvedResults = await Promise.all(
      initialResults.map((prod, idx) => resolveProductImage(prod, idx))
    );
    setSearchResults(resolvedResults);

    // Shuffle the homepage recommendations list in the background as well
    const initialRecs = generateRandomRecommendations();
    setRecommendedProducts(initialRecs);
    Promise.all(initialRecs.map((prod, idx) => resolveProductImage(prod, idx)))
      .then(resolved => setRecommendedProducts(resolved));
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

  useEffect(() => {
    if (isCheckingOut && checkoutStep > 0 && checkoutStep < 4) {
      const timer = setTimeout(() => {
        setCheckoutStep(prev => prev + 1);
        if (checkoutStep === 2) {
          playSound('process');
        }
        if (checkoutStep === 3) {
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

  const filteredResults = useMemo(() => {
    if (!searchResults) return null;
    return searchResults.filter(prod => {
      if (selectedCategoryFilter && prod.category !== selectedCategoryFilter) return false;
      if (onlyDealsFilter && !prod.dealBadge) return false;
      if (warpDeliveryFilter && prod.price > 1000000) return false;
      return true;
    });
  }, [searchResults, selectedCategoryFilter, onlyDealsFilter, warpDeliveryFilter]);

  const availableCategories = useMemo(() => {
    if (!searchResults) return [];
    const cats = new Set(searchResults.map(p => p.category));
    return Array.from(cats);
  }, [searchResults]);

  return (
    <div className="relative min-h-screen w-full flex flex-col bg-[#eaeded] text-stone-855 font-sans overflow-x-hidden selection:bg-amber-200">
      
      {/* HEADER ROW 1 */}
      <header className="sticky top-0 z-30 bg-[#131921] text-white flex flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-2.5 h-14">
          
          {/* Logo */}
          <div className="flex items-center shrink-0" onClick={() => { setSearchResults(null); setSelectedProduct(null); setSearchQuery(''); }}>
            <Link href="/" className="mr-3 text-gray-400 hover:text-white transition-colors text-xs font-bold font-sans self-center">
              ← Portal
            </Link>
            
            <div className="flex flex-col relative pt-1.5 cursor-pointer">
              <div className="flex items-baseline leading-none">
                <span className="text-white font-extrabold text-lg tracking-tight">amazon</span>
                <span className="text-[#febd69] font-normal text-xs ml-0.5">.infinite</span>
              </div>
              <svg className="w-[85px] h-2 ml-1 -mt-0.5" viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 2C35 15 65 15 95 2C80 8 50 12 5 2Z" fill="#febd69"/>
                <path d="M90 2L95 7L92 0L90 2Z" fill="#febd69"/>
              </svg>
            </div>
          </div>

          {/* Deliver To */}
          <div className="hidden lg:flex items-center gap-1.5 hover:outline hover:outline-1 hover:outline-white px-2 py-1 rounded cursor-pointer max-w-[170px] truncate leading-none">
            <span className="text-white text-base">📍</span>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-300 font-sans">Deliver to Creator</span>
              <span className="text-xs font-extrabold font-sans">Cloud 9, Sector 7</span>
            </div>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="flex-1 flex max-w-4xl h-10 bg-white rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#f3a847] shrink-0 md:mx-2">
            <select
              value={selectedCategoryFilter || ''}
              onChange={(e) => setSelectedCategoryFilter(e.target.value || null)}
              className="hidden md:block bg-gray-100 border-r border-gray-300 text-xs px-3 text-stone-700 outline-none cursor-pointer hover:bg-gray-200"
            >
              <option value="">All Departments</option>
              <option value="Celestial Real Estate">Celestial Real Estate</option>
              <option value="Existential Treasures">Existential Treasures</option>
              <option value="Cosmic Consumables">Cosmic Consumables</option>
              <option value="Exotic Organisms">Exotic Organisms</option>
              <option value="Hyper-Luxe Transportation">Hyper-Luxe Transportation</option>
            </select>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Amazon.infinite (e.g. supercar, cloud villa, velociraptor...)"
              className="flex-1 px-3 outline-none text-black text-sm w-full"
            />
            <button type="submit" className="bg-[#febd69] hover:bg-[#f3a847] text-stone-800 w-12 flex items-center justify-center transition-colors">
              🔍
            </button>
          </form>

          {/* Right Navigation */}
          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 hover:outline hover:outline-1 hover:outline-white px-2 py-2.5 rounded cursor-pointer leading-none">
              <span className="text-base select-none">🌐</span>
              <span className="font-extrabold">EN</span>
              <span className="text-[8px] text-gray-300">▼</span>
            </div>

            <div className="flex flex-col hover:outline hover:outline-1 hover:outline-white px-2 py-1.5 rounded cursor-pointer leading-none">
              <span className="text-[10px] text-gray-300 font-normal">Hello, Creator</span>
              <span className="font-extrabold flex items-center gap-1">Account & Lists <span className="text-[8px] text-gray-300">▼</span></span>
            </div>

            <div className="hidden md:flex flex-col text-right leading-none">
              <span className="text-[9px] text-gray-300 font-normal">Credit Limit</span>
              <span className="font-extrabold text-[#febd69] text-xs">
                {infiniteBalance ? '∞ INFINITE' : `$${netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              </span>
            </div>

            <button
              onClick={() => toggleInfiniteBalance()}
              className="hidden lg:block bg-stone-800 border border-stone-600 text-stone-300 hover:text-white px-2.5 py-1.5 rounded text-[10px] font-bold tracking-wider hover:bg-stone-700 transition-colors"
            >
              {infiniteBalance ? 'INF ON' : 'INF OFF'}
            </button>

            <div
              onClick={() => setShowCart(true)}
              className="flex items-center gap-1 hover:outline hover:outline-1 hover:outline-white px-2 py-2 rounded cursor-pointer relative"
            >
              <div className="relative">
                <span className="text-2xl text-white">🛒</span>
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-orange-400 font-extrabold text-[15px] select-none">
                  {cart.length}
                </span>
              </div>
              <span className="hidden sm:inline font-extrabold self-end pb-0.5">Cart</span>
            </div>
          </div>

        </div>

        {/* HEADER ROW 2 */}
        <div className="bg-[#232f3e] flex items-center justify-between px-4 py-1.5 text-xs text-white border-t border-stone-800">
          <div className="flex items-center gap-4 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
            <span className="font-extrabold flex items-center gap-1 cursor-pointer hover:border hover:border-white px-1.5 py-0.5 rounded leading-none">
              ☰ All
            </span>
            <span onClick={() => { setSearchResults(null); setSelectedProduct(null); }} className="cursor-pointer hover:border hover:border-white px-1.5 py-0.5 rounded">
              Prime Day Deals
            </span>
            <span onClick={() => { setActiveTab('vault'); }} className="cursor-pointer hover:border hover:border-white px-1.5 py-0.5 rounded flex items-center gap-1.5 relative">
              Acquisition Vault
              {purchasedItems.length > 0 && (
                <span className="bg-red-650 text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                  {purchasedItems.length}
                </span>
              )}
            </span>
            <span onClick={() => setActiveTab('shop')} className="cursor-pointer hover:border hover:border-white px-1.5 py-0.5 rounded">
              Cosmic Fresh
            </span>
            <span className="cursor-pointer hover:border hover:border-white px-1.5 py-0.5 rounded text-gray-300">
              Celestial Pay
            </span>
            <span className="hidden sm:inline cursor-pointer hover:border hover:border-white px-1.5 py-0.5 rounded text-gray-300">
              Gift Cards
            </span>
            <span className="hidden md:inline cursor-pointer hover:border hover:border-white px-1.5 py-0.5 rounded text-gray-300">
              AmazonBasics
            </span>
            <span className="hidden lg:inline cursor-pointer hover:border hover:border-white px-1.5 py-0.5 rounded text-gray-300">
              Buy Again
            </span>
          </div>

          <div className="hidden sm:block font-bold text-[#febd69]">
            Prime Day | 4 - 6 July | Live Now
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 w-full mx-auto">

        {activeTab === 'shop' ? (
          <div>
            {selectedProduct ? (
              /* ======================== 3. PRODUCT DETAIL VIEW ======================== */
              <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-xs text-stone-600 hover:text-[#c45500] hover:underline transition-colors animate-fadeIn"
                >
                  ‹ Back to shopping
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-gray-300/80 rounded-sm p-6 md:p-8 shadow-sm">
                  
                  {/* Left Column: Stable Image Container */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[300px] md:min-h-[420px] rounded-sm relative overflow-hidden border border-gray-200 shadow-inner bg-gray-50">
                    <div className="absolute inset-0 flex items-center justify-center text-[100px]" style={{ background: selectedProduct.gradient }}>
                      <div className="absolute inset-0 bg-black/10" />
                      {selectedProduct.emoji}
                    </div>
                    
                    {selectedProduct.imageUrl && (
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
                        onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        style={{ opacity: 0 }}
                      />
                    )}

                    <div className="absolute bottom-3 left-3 bg-black/55 backdrop-blur-md px-3 py-1 text-[9px] font-mono tracking-widest text-[#febd69] uppercase z-25 rounded">
                      // Hologram Manifest Active
                    </div>
                  </div>

                  {/* Center Column */}
                  <div className="lg:col-span-4 space-y-4">
                    <div>
                      <span className="text-xs font-medium text-cyan-600 hover:text-[#c45500] hover:underline cursor-pointer">
                        Brand: {selectedProduct.category}
                      </span>
                      <h2 className="text-2xl font-semibold mt-1 text-stone-900 leading-tight">
                        {selectedProduct.name}
                      </h2>
                      
                      <div className="flex items-center gap-1.5 mt-2 text-sm">
                        <span className="text-[#ffa41c] text-lg font-bold">
                          {'★'.repeat(Math.round(selectedProduct.rating)) + '☆'.repeat(5 - Math.round(selectedProduct.rating))}
                        </span>
                        <span className="font-semibold text-stone-800">{selectedProduct.rating} out of 5</span>
                        <span className="text-stone-500">|</span>
                        <span className="text-cyan-600 hover:text-[#c45500] hover:underline cursor-pointer">{selectedProduct.reviewCount} ratings</span>
                      </div>

                      {selectedProduct.boughtCount && (
                        <div className="text-xs text-stone-500 mt-1 font-light italic">
                          {selectedProduct.boughtCount}
                        </div>
                      )}
                    </div>

                    <hr className="border-gray-200" />

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        {selectedProduct.price === 0 ? (
                          <div className="text-2xl font-bold text-emerald-600 uppercase tracking-wide">Priceless (Free Manifest)</div>
                        ) : (
                          <>
                            {selectedProduct.dealBadge && (
                              <span className="bg-[#cc0c39] text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                                {selectedProduct.dealBadge}
                              </span>
                            )}
                            <div className="flex items-start text-stone-900 font-sans">
                              <span className="text-sm font-semibold mt-0.5">$</span>
                              <span className="text-3xl font-bold">{selectedProduct.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                              <span className="text-sm font-semibold mt-0.5">00</span>
                            </div>
                          </>
                        )}
                      </div>
                      
                      {selectedProduct.originalPrice > selectedProduct.price && (
                        <div className="text-xs text-stone-500 font-sans">
                          Was: <span className="line-through">${selectedProduct.originalPrice.toLocaleString()}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-stone-500 mt-1">
                        Inclusive of all cosmic taxes and warp transit.
                      </div>
                    </div>

                    <hr className="border-gray-200" />

                    <div>
                      <h3 className="text-sm font-bold text-stone-900">About this item</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1 text-stone-600 mt-2">
                        {selectedProduct.specs.map((spec, i) => (
                          <li key={i}>{spec}</li>
                        ))}
                        <li>Description: {selectedProduct.description}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Column buy box */}
                  <div className="lg:col-span-3 border border-gray-300 rounded-lg p-5 space-y-4 bg-white h-fit shadow-sm">
                    <div className="space-y-1">
                      <div className="text-xl font-bold text-stone-900">
                        {selectedProduct.price === 0 ? 'FREE' : `$${selectedProduct.price.toLocaleString()}`}
                      </div>
                      <div className="text-xs text-stone-600">
                        FREE Delivery by <span className="font-bold text-[#232f3e]">Vercel Warp</span>
                      </div>
                    </div>

                    <div className="text-emerald-700 font-bold text-sm">
                      In Stock.
                    </div>

                    <div className="text-xs text-stone-600">
                      Deliver to Creator: <span className="font-bold">Cloud 9, Sector 7</span>
                    </div>

                    <div className="space-y-3 pt-2">
                      <button
                        onClick={() => handleAddToCart(selectedProduct)}
                        className="w-full py-2 bg-[#ffd814] hover:bg-[#f7ca11] border border-[#fcd200] text-black font-semibold text-xs rounded-full transition-all shadow-sm"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => {
                          setCart([...cart, selectedProduct]);
                          setSelectedProduct(null);
                          setShowCart(true);
                          playSound('cart');
                        }}
                        className="w-full py-2 bg-[#ffa41c] hover:bg-[#f3950b] border border-[#ffa41c] text-black font-semibold text-xs rounded-full transition-all shadow-sm"
                      >
                        Buy Now
                      </button>
                    </div>

                    <div className="text-xs space-y-1 text-stone-500 pt-2 font-sans border-t border-gray-150 border-dashed">
                      <div className="flex justify-between">
                        <span>Ships from</span>
                        <span className="text-stone-700 font-semibold">Quantum Registry</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sold by</span>
                        <span className="text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer">Universal Manifestation</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Reviews */}
                <div className="bg-white border border-gray-300 rounded-sm p-6 md:p-8 space-y-6 shadow-sm">
                  <h3 className="text-lg font-bold text-stone-900 border-b border-gray-200 pb-3">Customer reviews</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedProduct.reviews.map((rev, idx) => (
                      <div key={idx} className="space-y-2 border-b border-gray-150 pb-4 md:border-none md:pb-0">
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs">👤</span>
                          <span className="text-xs font-semibold text-stone-700">{rev.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#ffa41c]">
                          <span>{'★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating)}</span>
                          <span className="font-bold text-emerald-800 ml-1">Verified Cosmic Purchase</span>
                        </div>
                        <p className="text-sm font-light text-stone-650 italic">"{rev.text}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : searchResults ? (
              /* ======================== 2. SEARCH RESULTS VIEW ======================== */
              <div className="w-full flex animate-fadeIn">
                
                {/* Left Filter Sidebar */}
                <aside className="hidden lg:block w-[240px] shrink-0 border-r border-gray-300 bg-white p-4 space-y-6 text-xs text-stone-850">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-stone-900 font-sans">Department</h3>
                    <ul className="space-y-1.5">
                      <li
                        onClick={() => setSelectedCategoryFilter(null)}
                        className={`cursor-pointer hover:text-orange-700 ${!selectedCategoryFilter ? 'font-bold text-stone-950' : 'text-stone-605 hover:underline'}`}
                      >
                        All Departments
                      </li>
                      {availableCategories.map(cat => (
                        <li
                          key={cat}
                          onClick={() => setSelectedCategoryFilter(cat)}
                          className={`cursor-pointer hover:text-orange-700 ${selectedCategoryFilter === cat ? 'font-bold text-stone-950' : 'text-stone-605 hover:underline'}`}
                        >
                          {cat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-sm text-stone-900">Deals & Discounts</h3>
                    <label className="flex items-center gap-2 text-stone-650 cursor-pointer hover:text-orange-700">
                      <input
                        type="checkbox"
                        checked={onlyDealsFilter}
                        onChange={(e) => setOnlyDealsFilter(e.target.checked)}
                        className="rounded border-gray-300 accent-[#ffa41c] cursor-pointer"
                      />
                      <span>Prime Day Deals</span>
                    </label>
                  </div>

                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-sm text-stone-900">Delivery Day</h3>
                    <label className="flex items-center gap-2 text-stone-650 cursor-pointer hover:text-orange-700">
                      <input
                        type="checkbox"
                        checked={warpDeliveryFilter}
                        onChange={(e) => setWarpDeliveryFilter(e.target.checked)}
                        className="rounded border-gray-300 accent-[#ffa41c] cursor-pointer"
                      />
                      <span>Get it by Instant Warp</span>
                    </label>
                  </div>

                  <div className="space-y-2 border-t border-gray-200 pt-4">
                    <h3 className="font-bold text-sm text-stone-900">Customer Review</h3>
                    <ul className="space-y-1 font-bold text-[#ffa41c] text-sm">
                      <li className="cursor-pointer hover:text-orange-700 hover:underline">★★★★☆ <span className="text-xs font-normal text-stone-500">& Up</span></li>
                      <li className="cursor-pointer hover:text-orange-700 hover:underline">★★★☆☆ <span className="text-xs font-normal text-stone-500">& Up</span></li>
                    </ul>
                  </div>
                </aside>

                {/* Right Results Panel */}
                <section className="flex-1 bg-white p-6 min-h-screen">
                  <div className="border-b border-gray-200 pb-3 mb-6 flex justify-between items-center text-xs text-stone-600">
                    <div>
                      1-8 of over {searchResults.length * 10} results for <span className="font-extrabold text-stone-900">"{searchQuery}"</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold">
                      Sort by: 
                      <select className="border border-gray-300 bg-gray-50 px-2 py-1 rounded text-stone-855 outline-none cursor-pointer">
                        <option>Featured</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                        <option>Avg. Customer Review</option>
                      </select>
                    </div>
                  </div>

                  {filteredResults && filteredResults.length === 0 ? (
                    <div className="text-center py-16 space-y-2">
                      <div className="text-4xl text-gray-300">📦</div>
                      <h4 className="font-bold text-stone-700">No results found for this department</h4>
                      <p className="text-xs text-stone-400">Try modifying your department filter or search criteria.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredResults?.map((prod, i) => (
                        <div
                          key={prod.name}
                          onClick={() => setSelectedProduct(prod)}
                          className="group border border-gray-200 bg-white rounded-md p-4 hover:border-orange-500 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
                        >
                          <div>
                            {/* Stable Product Image */}
                            <div className="h-40 rounded-sm mb-3 flex items-center justify-center text-6xl relative overflow-hidden bg-gray-50">
                              <div className="absolute inset-0 flex items-center justify-center" style={{ background: prod.gradient }}>
                                <div className="absolute inset-0 bg-black/10" />
                                <span className="filter drop-shadow-md z-10 transition-transform duration-300 group-hover:scale-110">
                                  {prod.emoji}
                                </span>
                              </div>
                              
                              {prod.imageUrl && (
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
                                  onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  style={{ opacity: 0 }}
                                />
                              )}

                              {i % 3 === 0 && (
                                <span className="absolute top-2 left-2 bg-[#232f3e] text-white text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider z-20">
                                  Best Seller
                                </span>
                              )}
                              {i % 3 === 1 && (
                                <span className="absolute top-2 left-2 bg-amber-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider z-20">
                                  Amazon's Choice
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] text-stone-500 font-sans tracking-wide">
                              {prod.category}
                            </span>
                            
                            <h4 className="font-semibold text-sm text-stone-900 tracking-tight mt-1 line-clamp-2 leading-tight group-hover:text-orange-700 transition-colors duration-200">
                              {prod.name}
                            </h4>
                            
                            <div className="flex items-center gap-1 mt-1 text-xs">
                              <span className="text-[#ffa41c] font-bold">
                                {'★'.repeat(Math.round(prod.rating)) + '☆'.repeat(5 - Math.round(prod.rating))}
                              </span>
                              <span className="text-stone-550">({prod.reviewCount})</span>
                            </div>

                            {prod.boughtCount && (
                              <div className="text-[10px] text-stone-500 mt-0.5">
                                {prod.boughtCount}
                              </div>
                            )}

                            {prod.dealBadge && (
                              <div className="mt-2">
                                <span className="bg-[#cc0c39] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm">
                                  {prod.dealBadge}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100">
                            <div className="flex items-baseline gap-1.5 text-stone-855 font-sans">
                              {prod.price === 0 ? (
                                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wide">Free Manifest</span>
                              ) : (
                                <>
                                  <span className="font-bold text-lg leading-none">${prod.price.toLocaleString()}</span>
                                  {prod.originalPrice > prod.price && (
                                    <span className="text-[10px] text-stone-400 line-through">
                                      M.R.P: ${prod.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>

                            <div className="text-[10px] text-stone-500 mt-1">
                              FREE Delivery by <span className="font-bold text-[#232f3e]">Vercel Warp</span>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(prod);
                              }}
                              className="w-full mt-3 py-1.5 bg-[#ffd814] hover:bg-[#f7ca11] border border-[#fcd200] text-black font-semibold text-[10px] rounded-full transition-colors shadow-sm"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            ) : (
              /* ======================== 1. AMAZON HOME VIEW ======================== */
              <div className="space-y-6">
                
                {/* Giant Banner Carousel */}
                <div className="relative h-[220px] sm:h-[280px] md:h-[350px] w-full overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-900 to-[#131921] select-none">
                  <div className="absolute inset-0 max-w-7xl mx-auto px-6 flex flex-col justify-center text-white space-y-2 md:space-y-4 z-10 pt-4">
                    <span className="bg-[#cc0c39] w-fit text-[10px] md:text-xs font-bold px-3 py-1 rounded">
                      Prime Day | 4-6 July | Live Now
                    </span>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-none">
                      Up to 40% off Mobiles & Celestial Accessories
                    </h2>
                    <p className="text-xs md:text-sm text-gray-200 max-w-lg font-light leading-relaxed">
                      No Cost EMI, Exchange Offers, and instantaneous quantum warp delivery straight into your Vercel Acquisition Vault.
                    </p>
                    
                    <div className="hidden sm:flex items-center gap-4 pt-2 text-[10px] font-mono">
                      <span className="border border-white/30 px-3 py-1 rounded bg-white/10">🪐 Planet Systems</span>
                      <span className="border border-white/30 px-3 py-1 rounded bg-white/10">🦖 Miniature Dinosaurs</span>
                      <span className="border border-white/30 px-3 py-1 rounded bg-white/10">🚀 Space Yachts</span>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#eaeded] to-transparent pointer-events-none" />
                </div>

                {/* 2x2 Grid recommended cards */}
                {recommendedProducts.length > 0 && (
                  <div className="max-w-7xl mx-auto px-4 md:px-6 relative -mt-16 md:-mt-28 z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
                    
                    {/* Card 1 */}
                    <div className="bg-white p-5 border border-gray-300 rounded-sm flex flex-col justify-between shadow-sm">
                      <h3 className="font-bold text-base text-stone-900 tracking-tight mb-3">Deals inspired by your history</h3>
                      <div className="grid grid-cols-2 gap-3 flex-1 min-h-[220px]">
                        {recommendedProducts.slice(0, 4).map((prod) => (
                          <div key={prod.name} onClick={() => setSelectedProduct(prod)} className="group cursor-pointer flex flex-col justify-between animate-fadeIn">
                            <div className="h-20 rounded bg-gray-50 flex items-center justify-center text-4xl border border-gray-100 group-hover:border-orange-400 transition-colors relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center" style={{ background: prod.gradient }}>
                                <div className="absolute inset-0 bg-black/10" />
                                <span className="z-10 text-2xl transition-transform duration-300 group-hover:scale-110">{prod.emoji}</span>
                              </div>
                              {prod.imageUrl && (
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
                                  onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  style={{ opacity: 0 }}
                                />
                              )}
                            </div>
                            <span className="text-[10px] text-stone-850 font-semibold line-clamp-1 mt-1 leading-none">{prod.name}</span>
                            <span className="text-[9px] text-[#cc0c39] font-bold">{prod.dealBadge}</span>
                          </div>
                        ))}
                      </div>
                      <span onClick={() => { setSearchQuery('Celestial'); handleSearch({ preventDefault: () => {} } as any); }} className="text-xs text-cyan-600 hover:text-orange-700 hover:underline cursor-pointer block mt-4 font-semibold">
                        See all deals
                      </span>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-5 border border-gray-300 rounded-sm flex flex-col justify-between shadow-sm">
                      <h3 className="font-bold text-base text-stone-900 tracking-tight mb-3">Deals you might like in Appliances</h3>
                      <div className="grid grid-cols-2 gap-3 flex-1 min-h-[220px]">
                        {recommendedProducts.slice(4, 8).map((prod) => (
                          <div key={prod.name} onClick={() => setSelectedProduct(prod)} className="group cursor-pointer flex flex-col justify-between animate-fadeIn">
                            <div className="h-20 rounded bg-gray-50 flex items-center justify-center text-4xl border border-gray-100 group-hover:border-orange-400 transition-colors relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center" style={{ background: prod.gradient }}>
                                <div className="absolute inset-0 bg-black/10" />
                                <span className="z-10 text-2xl transition-transform duration-300 group-hover:scale-110">{prod.emoji}</span>
                              </div>
                              {prod.imageUrl && (
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
                                  onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  style={{ opacity: 0 }}
                                />
                              )}
                            </div>
                            <span className="text-[10px] text-stone-850 font-semibold line-clamp-1 mt-1 leading-none">{prod.name}</span>
                            <span className="text-[9px] text-[#cc0c39] font-bold">{prod.dealBadge}</span>
                          </div>
                        ))}
                      </div>
                      <span onClick={() => { setSearchQuery('Hoverbike'); handleSearch({ preventDefault: () => {} } as any); }} className="text-xs text-cyan-600 hover:text-orange-700 hover:underline cursor-pointer block mt-4 font-semibold">
                        Shop and expand
                      </span>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-5 border border-gray-300 rounded-sm flex flex-col justify-between shadow-sm">
                      <h3 className="font-bold text-base text-stone-900 tracking-tight mb-3">Continue shopping deals</h3>
                      <div className="grid grid-cols-2 gap-3 flex-1 min-h-[220px]">
                        {recommendedProducts.slice(8, 12).map((prod) => (
                          <div key={prod.name} onClick={() => setSelectedProduct(prod)} className="group cursor-pointer flex flex-col justify-between animate-fadeIn">
                            <div className="h-20 rounded bg-gray-50 flex items-center justify-center text-4xl border border-gray-100 group-hover:border-orange-400 transition-colors relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center" style={{ background: prod.gradient }}>
                                <div className="absolute inset-0 bg-black/10" />
                                <span className="z-10 text-2xl transition-transform duration-300 group-hover:scale-110">{prod.emoji}</span>
                              </div>
                              {prod.imageUrl && (
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
                                  onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  style={{ opacity: 0 }}
                                />
                              )}
                            </div>
                            <span className="text-[10px] text-stone-855 font-semibold line-clamp-1 mt-1 leading-none">{prod.name}</span>
                            <span className="text-[9px] text-[#cc0c39] font-bold">{prod.dealBadge}</span>
                          </div>
                        ))}
                      </div>
                      <span onClick={() => { setSearchQuery('Existential'); handleSearch({ preventDefault: () => {} } as any); }} className="text-xs text-cyan-600 hover:text-orange-700 hover:underline cursor-pointer block mt-4 font-semibold">
                        See more deals
                      </span>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white p-5 border border-gray-300 rounded-sm flex flex-col justify-between shadow-sm">
                      <h3 className="font-bold text-base text-stone-900 tracking-tight mb-3">Deals related to your views</h3>
                      <div className="grid grid-cols-2 gap-3 flex-1 min-h-[220px]">
                        {recommendedProducts.slice(12, 16).map((prod) => (
                          <div key={prod.name} onClick={() => setSelectedProduct(prod)} className="group cursor-pointer flex flex-col justify-between animate-fadeIn">
                            <div className="h-20 rounded bg-gray-50 flex items-center justify-center text-4xl border border-gray-100 group-hover:border-orange-400 transition-colors relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center" style={{ background: prod.gradient }}>
                                <div className="absolute inset-0 bg-black/10" />
                                <span className="z-10 text-2xl transition-transform duration-300 group-hover:scale-110">{prod.emoji}</span>
                              </div>
                              {prod.imageUrl && (
                                <img
                                  src={prod.imageUrl}
                                  alt={prod.name}
                                  className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-300"
                                  onLoad={(e) => { e.currentTarget.style.opacity = '1'; }}
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  style={{ opacity: 0 }}
                                />
                              )}
                            </div>
                            <span className="text-[10px] text-stone-850 font-semibold line-clamp-1 mt-1 leading-none">{prod.name}</span>
                            <span className="text-[9px] text-[#cc0c39] font-bold">{prod.dealBadge}</span>
                          </div>
                        ))}
                      </div>
                      <span onClick={() => { setSearchQuery('Yacht'); handleSearch({ preventDefault: () => {} } as any); }} className="text-xs text-cyan-600 hover:text-orange-700 hover:underline cursor-pointer block mt-4 font-semibold">
                        Explore suggestions
                      </span>
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ======================== 4. MY VAULT TAB ======================== */
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-900 tracking-tight">Cosmic Acquisition Vault</h3>
                <p className="text-xs text-stone-500">Physical manifests and cosmic parcels currently active in your sector.</p>
              </div>
              {purchasedItems.length > 0 && (
                <button
                  onClick={() => {
                    clearPurchases();
                    playSound('cart');
                  }}
                  className="px-4 py-2 border border-red-300 text-red-600 text-xs font-bold rounded hover:bg-red-50 transition-all"
                >
                  Purge Vault Archives
                </button>
              )}
            </div>

            {purchasedItems.length === 0 ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center max-w-xl mx-auto space-y-4 bg-white shadow-sm">
                <div className="text-5xl select-none">📦</div>
                <h4 className="text-lg font-bold text-stone-700">Your vault is empty</h4>
                <p className="text-sm text-stone-500 font-light leading-relaxed">
                  Search and purchase cosmic items in the storefront. Once authorized and checked out, your manifest shipments will warp into this vault.
                </p>
                <button
                  onClick={() => { setActiveTab('shop'); setSearchResults(null); setSelectedProduct(null); }}
                  className="px-6 py-2 bg-[#ffa41c] hover:bg-[#f3950b] text-black font-bold rounded-full text-xs shadow-sm"
                >
                  Browse Storefront
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {purchasedItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-300 bg-white rounded-md p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest">{item.category}</span>
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-mono font-semibold">
                          {item.shippingStatus}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-base text-stone-900 tracking-tight mt-2 flex items-center gap-2">
                        <span>{getEmoji(item.name)}</span> {item.name}
                      </h4>
                      <p className="text-xs text-stone-555 mt-2 font-light line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="border-t border-gray-100 pt-4 mt-4 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                      <div>
                        Purchased: <span className="text-stone-600 font-bold">{item.datePurchased.split(',')[0]}</span>
                      </div>
                      <div className="text-stone-800 font-extrabold text-xs">
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

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px] animate-fadeIn">
          <div className="w-full max-w-md h-full bg-white border-l border-gray-300 p-6 flex flex-col justify-between shadow-2xl relative">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-4 left-4 p-2 text-stone-400 hover:text-stone-850 transition-colors text-2xl font-light"
            >
              ×
            </button>
            
            <div className="flex flex-col flex-1 mt-8 min-h-0">
              <h3 className="text-lg font-bold tracking-tight border-b border-gray-200 pb-4 mb-4 flex items-center gap-2">
                <span>🛒</span> Cosmic Shopping Cart
              </h3>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                  <span className="text-5xl text-stone-300 select-none">🛒</span>
                  <p className="text-stone-500 text-sm font-light">Your cart is currently empty.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0 scrollbar-thin">
                  {cart.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded border border-gray-200 items-center justify-between">
                      <div className="flex gap-3 items-center min-w-0">
                        <span className="text-3xl shrink-0">{item.emoji}</span>
                        <div className="min-w-0 leading-tight">
                          <h4 className="text-sm font-bold text-stone-900 truncate">{item.name}</h4>
                          <span className="text-[9px] text-[#007185] font-semibold uppercase">{item.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-xs text-stone-800">
                          {item.price === 0 ? 'Free' : `$${item.price.toLocaleString()}`}
                        </span>
                        <button
                          onClick={() => handleRemoveFromCart(idx)}
                          className="text-stone-400 hover:text-rose-600 text-lg font-bold"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
                <div className="flex justify-between items-center text-sm font-sans font-bold">
                  <span className="text-stone-500">Order Subtotal:</span>
                  <span className="text-stone-855 text-xl">${totalCartPrice.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => startCheckout()}
                  className="w-full py-2.5 bg-[#ffd814] hover:bg-[#f7ca11] border border-[#fcd200] text-black font-semibold text-xs rounded-full transition-all shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg p-6 md:p-8 space-y-6 relative overflow-hidden shadow-2xl">
            
            {checkoutStep < 4 && (
              <button
                onClick={() => setIsCheckingOut(false)}
                className="absolute top-4 right-4 text-stone-450 hover:text-stone-800 font-bold"
              >
                Cancel
              </button>
            )}

            {checkoutStep === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="text-center">
                  <span className="text-xs font-bold tracking-widest text-[#c45500] uppercase font-mono">Quantum Checkout</span>
                  <h3 className="text-xl font-bold mt-1 text-stone-900">Verify Cosmic Payment</h3>
                </div>

                <div className="h-52 w-full rounded-2xl bg-gradient-to-br from-stone-900 via-stone-950 to-black border border-amber-400/35 p-6 flex flex-col justify-between relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start z-10">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest font-mono">VIZIONA COSMIC CARD</span>
                      <span className="text-[7px] text-stone-500 tracking-wider">BLACK METAL LIMITLESS</span>
                    </div>
                    <div className="text-2xl text-amber-400">∞</div>
                  </div>

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

                <div className="bg-[#FAF8F3] border border-gray-200 rounded-sm p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-stone-700 uppercase tracking-wide">Manifest coordinates</h4>
                  <p className="font-mono text-stone-500 leading-normal">
                    User Domain: <span className="text-stone-855">Cloud 9, Dreamer Street, Sector 7</span><br />
                    Warp Shipping: <span className="text-emerald-700 font-semibold">Quantum Transit (0.0001 sec)</span>
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm font-mono border-t border-gray-150 pt-4">
                  <span className="text-stone-550">Authorization Total:</span>
                  <span className="text-stone-900 font-extrabold text-lg">${totalCartPrice.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => setCheckoutStep(2)}
                  className="w-full py-2.5 bg-[#ffa41c] hover:bg-[#f3950b] border border-[#ffa41c] text-black font-semibold text-xs rounded-full transition-all shadow-sm"
                >
                  Swipe Card to Manifest
                </button>
              </div>
            )}

            {checkoutStep === 2 && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full border-4 border-amber-600/20 border-t-[#ffa41c] animate-spin" />
                <div className="text-center space-y-2">
                  <h4 className="font-bold text-lg text-stone-850">Encrypting Quantum Channel...</h4>
                  <p className="text-xs text-stone-400 font-mono">Generating wormhole path coordinates...</p>
                </div>
              </div>
            )}

            {checkoutStep === 3 && (
              <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-fadeIn">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-600/20 border-t-emerald-650 animate-spin" />
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
                  <h3 className="text-2xl font-black tracking-tight text-stone-900 leading-none">Purchase Approved!</h3>
                  <p className="text-xs text-stone-550 max-w-xs mx-auto font-light leading-relaxed">
                    Your transactions have cleared the cosmic registry. The items are warping to your coordinates.
                  </p>
                </div>

                <div className="w-full bg-[#FAF8F3] border border-gray-200 rounded-sm p-4 text-left font-mono text-xs text-stone-500 space-y-1">
                  <div>Invoice ID: <span className="text-stone-855 font-bold">#{Math.floor(Math.random()*900000)+100000}</span></div>
                  <div>Delivery Address: <span className="text-stone-855 font-bold">Wormhole Node 7-A</span></div>
                  <div>Cargo Status: <span className="text-emerald-700 font-bold">Warp Transit Active</span></div>
                </div>

                <button
                  onClick={() => {
                    setIsCheckingOut(false);
                    setCheckoutStep(0);
                    setActiveTab('vault');
                  }}
                  className="w-full py-2.5 bg-[#ffa41c] hover:bg-[#f3950b] text-black font-semibold text-xs rounded-full transition-all shadow-sm"
                >
                  View My Acquisitions Vault
                </button>
              </div>
            )}

          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
