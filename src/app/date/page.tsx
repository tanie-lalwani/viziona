'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  intro: string;
}

interface Location {
  id: string;
  name: string;
  description: string;
  bgGradient: string;
  emoji: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  emoji: string;
}

const partners: Partner[] = [
  {
    id: 'aurelia',
    name: 'Aurelia',
    role: 'The Mysterious Billionaire',
    description: 'Sleek, sharp, owns three shipping galaxies, but is tired of fake sycophants and seeks a genuine soul connection.',
    avatar: '💎',
    color: 'from-amber-600 to-yellow-800',
    intro: "I booked this entire rooftop because I wanted quiet. But... seeing you here, I'm glad I didn't cancel."
  },
  {
    id: 'julian',
    name: 'Julian',
    role: 'The Passionate Artist',
    description: 'Dreamy eyes, paints glowing nebulae on canvases, and communicates feelings through deep stargazing and poems.',
    avatar: '🎨',
    color: 'from-rose-600 to-pink-800',
    intro: "I was looking at the constellation of Lyra and trying to sketch it, but your entrance completely distracted me."
  },
  {
    id: 'zephyr',
    name: 'Zephyr',
    role: 'The Multiverse Scholar',
    description: 'Brilliant physicist and historian. Loves clever banter, quantum theories, and ancient Earth vinyl records.',
    avatar: '🌌',
    color: 'from-blue-600 to-indigo-800',
    intro: "Statistically speaking, the odds of us meeting across infinite dimensions were 1 in 10²⁴. I like those odds."
  }
];

const locations: Location[] = [
  {
    id: 'tokyo',
    name: 'Neo-Tokyo Skylounge',
    description: 'A glass-floored lounge suspended 200 floors above glowing purple cybernetic highways and neon rain.',
    bgGradient: 'from-[#FAF8F5] via-[#F3EDDF] to-[#EBE2D0]',
    emoji: '🌃'
  },
  {
    id: 'venice',
    name: 'Cosmic Venice Gondola',
    description: 'Floating down liquid-silver canals reflecting three moons and surrounded by floating bioluminescent lilies.',
    bgGradient: 'from-[#FDFBF7] via-[#F4F0E6] to-[#E9E3D5]',
    emoji: '🛶'
  },
  {
    id: 'cloud',
    name: 'Sky-High Rose Garden',
    description: 'A floating marble patio suspended over pastel pink clouds during an eternal, warm golden-hour sunset.',
    bgGradient: 'from-[#FAF5EF] via-[#FAF0E6] to-[#EFE2D6]',
    emoji: '🌸'
  }
];

const starters: MenuItem[] = [
  { id: 'caviar', name: 'Stardust Caviar', description: 'Glows with a soft blue light; dissolves on the tongue in a burst of elderberry and sea-spray.', price: '$12,500', emoji: '🥗' },
  { id: 'pasta', name: 'Quantum Truffle Pasta', description: 'Hand-rolled ribbons that exist in two places at once, coated in a rich gold-leaf butter.', price: '$8,900', emoji: '🍝' }
];

const drinks: MenuItem[] = [
  { id: 'champagne', name: 'Liquid Gold Champagne', description: 'Harvested from a high-orbit solar winery. Bubbles sparkle like actual tiny stars.', price: '$18,000', emoji: '🥂' },
  { id: 'elixir', name: 'Nebula Frequency Elixir', description: 'A glowing color-changing liquor that resonates at the vibration of pure euphoria.', price: '$22,500', emoji: '🍹' }
];

const desserts: MenuItem[] = [
  { id: 'souffle', name: 'Dream-weaver Soufflé', description: 'Served floating 2 inches above the plate. Tastes like your happiest childhood memory.', price: '$6,500', emoji: '🧁' },
  { id: 'orb', name: 'Supernova Chocolate Orb', description: 'A dark chocolate sphere melted at the table by hot caramel, revealing a glowing berry core.', price: '$9,200', emoji: '🍨' }
];

export default function FancyDate() {
  const [step, setStep] = useState<'setup' | 'menu' | 'date' | 'climax'>('setup');
  const [partner, setPartner] = useState<Partner>(partners[0]);
  const [location, setLocation] = useState<Location>(locations[0]);
  const [selectedStarter, setSelectedStarter] = useState<MenuItem>(starters[0]);
  const [selectedDrink, setSelectedDrink] = useState<MenuItem>(drinks[0]);
  const [selectedDessert, setSelectedDessert] = useState<MenuItem>(desserts[0]);
  
  const [chemistry, setChemistry] = useState(50);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [reactionText, setReactionText] = useState('');

  // Audio synthesis helper for Date Simulator
  const playSound = (type: 'clink' | 'sparkle' | 'chime' | 'success') => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (type === 'clink') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'sparkle') {
        for (let i = 0; i < 4; i++) {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1400 + Math.random() * 800, ctx.currentTime);
            gain.gain.setValueAtTime(0.03, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.25);
          }, i * 120);
        }
      } else if (type === 'chime') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'success') {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
          }, idx * 150);
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startDialogue = () => {
    playSound('chime');
    setStep('date');
    setDialogueIndex(0);
    setReactionText('');
    setChemistry(50);
  };

  // Chat/Dialogue Scenes
  const scenes = [
    {
      id: 0,
      partnerText: () => `${partner.intro} So tell me... with the whole universe at your disposal, what made you seek out my company tonight?`,
      choices: [
        {
          text: 'I wanted to see if the stars were as bright as your reputation.',
          mod: 15,
          reply: () => `A subtle blush crosses ${partner.name}’s face. "Flattery... but you carry it off well."`
        },
        {
          text: 'Honestly, I felt a dimensional tug. It was destiny.',
          mod: 20,
          reply: () => `${partner.name} smiles warmly. "Destiny is a powerful manifest. I like that you trust your instincts."`
        },
        {
          text: 'My other option was building Excel sheets. So, you win.',
          mod: 5,
          reply: () => `${partner.name} laughs softly. "Pragmatic. I appreciate a sense of humor."`
        }
      ]
    },
    {
      id: 1,
      partnerText: () => `The waiter materializes and pours the ${selectedDrink.name}, placing down the ${selectedStarter.name}. ${partner.name} raises their glass: "To taking a pause in a fast universe. What shall we toast to?"`,
      choices: [
        {
          text: 'To this perfect evening and the coordinates that aligned us.',
          mod: 15,
          reply: () => `Your glasses clink. "A toast I can fully get behind."`
        },
        {
          text: 'To absolute control. To building our own worlds.',
          mod: 10,
          reply: () => `Your glasses clink. "Power is sweet, but sharing it is sweeter."`
        },
        {
          text: 'To the food! It costs more than my childhood home.',
          mod: 20,
          reply: () => `Your glasses clink. ${partner.name} chuckles. "Indeed! Let's make sure we savor every quantum calorie."`
        }
      ]
    },
    {
      id: 2,
      partnerText: () => `As you savor the ${selectedDessert.name}, ${partner.name} looks deep into your eyes. "If you could manifest one truth, one thing that is absolutely permanent in your world, what would it be?"`,
      choices: [
        {
          text: 'A safe haven of warmth and peace, shared with you.',
          mod: 25,
          reply: () => `${partner.name} is quiet for a moment, visibly touched. "No one has said that to me in a millennium."`
        },
        {
          text: 'Infinite knowledge. To understand the gears of time.',
          mod: 10,
          reply: () => `${partner.name} nods. "An ambitious mind. That is rare and attractive."`
        },
        {
          text: 'Endless supplies of velociraptor pets and spaceship fuel.',
          mod: 15,
          reply: () => `${partner.name} grins. "Never lose that child-like spark. It keeps the universe young."`
        }
      ]
    }
  ];

  const handleChoice = (mod: number, reply: string) => {
    playSound('clink');
    const newChem = Math.min(100, Math.max(0, chemistry + mod));
    setChemistry(newChem);
    setReactionText(reply);

    setTimeout(() => {
      setReactionText('');
      if (dialogueIndex < scenes.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        setStep('climax');
        playSound('success');
      }
    }, 3500);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between text-stone-850 font-sans transition-all duration-1000 bg-gradient-to-b ${
        step === 'setup' || step === 'menu' ? 'from-[#FDFBF7] via-[#FAF6EE] to-[#F5EFE2]' : location.bgGradient
      }`}
    >
      
      {/* Top Navbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white/60 backdrop-blur-md z-20">
        <Link href="/" className="text-stone-500 hover:text-stone-800 transition-colors text-sm flex items-center gap-2">
          ← Main Portal
        </Link>
        <span className="text-sm font-extrabold tracking-widest text-rose-700 uppercase drop-shadow-sm">
          🌹 Fancy Date Simulator
        </span>
        <div className="w-20" />
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-6 py-8 relative">
        
        {/* Setup Stage */}
        {step === 'setup' && (
          <div className="w-full space-y-8 animate-fadeIn">
            <div className="text-center">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight bg-clip-text bg-gradient-to-r from-rose-600 to-rose-800 text-transparent">
                Design Your Perfect Date
              </h2>
              <p className="text-sm text-stone-500 mt-2 font-light">
                Select your celestial companion and setting before boarding the luxury quantum transit.
              </p>
            </div>

            {/* Step 1: Select Partner */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-700 font-mono">1. Select Your Companion</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {partners.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setPartner(p);
                      playSound('chime');
                    }}
                    className={`group cursor-pointer border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between ${
                      partner.id === p.id
                        ? 'border-rose-500 bg-rose-50/50 shadow-md shadow-rose-950/[0.02]'
                        : 'border-stone-200 bg-white hover:border-stone-350'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="text-4xl">{p.avatar}</div>
                      <h4 className="font-bold text-lg text-stone-850 group-hover:text-rose-700 transition-colors">
                        {p.name}
                      </h4>
                      <span className={`text-[10px] font-mono tracking-widest uppercase bg-gradient-to-r ${p.color} bg-clip-text text-transparent`}>
                        {p.role}
                      </span>
                      <p className="text-xs text-stone-500 font-light leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Select Location */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-700 font-mono">2. Select Setting Coordinates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {locations.map((loc) => (
                  <div
                    key={loc.id}
                    onClick={() => {
                      setLocation(loc);
                      playSound('clink');
                    }}
                    className={`cursor-pointer border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between bg-white ${
                      location.id === loc.id
                        ? 'border-rose-500 bg-rose-50/50 shadow-md shadow-rose-950/[0.02]'
                        : 'border-stone-200 hover:border-stone-350'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="text-4xl">{loc.emoji}</div>
                      <h4 className="font-bold text-lg text-stone-850">{loc.name}</h4>
                      <p className="text-xs text-stone-500 font-light leading-relaxed">
                        {loc.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <div className="pt-4 text-center">
              <button
                onClick={() => {
                  setStep('menu');
                  playSound('chime');
                }}
                className="px-10 py-4 bg-gradient-to-r from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-extrabold rounded-xl transition-all shadow-md shadow-rose-950/10"
              >
                Assemble Menu Cuisine →
              </button>
            </div>

          </div>
        )}

        {/* Menu Culinary Selection */}
        {step === 'menu' && (
          <div className="w-full max-w-2xl space-y-8 animate-fadeIn">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 font-mono">Gastronomic Protocol</span>
              <h2 className="text-2xl md:text-4xl font-extrabold mt-1 text-stone-850">Select Star-Grade Dishes</h2>
              <p className="text-xs text-stone-500">Order high-end food and drinks for you and {partner.name} to share.</p>
            </div>

            {/* Starters */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono">// Luxury Cuisine</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {starters.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedStarter(item);
                      playSound('clink');
                    }}
                    className={`cursor-pointer p-4 border rounded-xl flex gap-3 items-center justify-between transition-all bg-white ${
                      selectedStarter.id === item.id ? 'border-rose-500 bg-rose-50/50' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-stone-850 truncate">{item.name}</h4>
                        <p className="text-[10px] text-stone-500 truncate leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 font-mono">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drinks */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono">// Cellar Reserve</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {drinks.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedDrink(item);
                      playSound('clink');
                    }}
                    className={`cursor-pointer p-4 border rounded-xl flex gap-3 items-center justify-between transition-all bg-white ${
                      selectedDrink.id === item.id ? 'border-rose-500 bg-rose-50/50' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-stone-850 truncate">{item.name}</h4>
                        <p className="text-[10px] text-stone-500 truncate leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 font-mono">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desserts */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest font-mono">// Final Sweetness</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {desserts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedDessert(item);
                      playSound('clink');
                    }}
                    className={`cursor-pointer p-4 border rounded-xl flex gap-3 items-center justify-between transition-all bg-white ${
                      selectedDessert.id === item.id ? 'border-rose-500 bg-rose-50/50' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-stone-850 truncate">{item.name}</h4>
                        <p className="text-[10px] text-stone-500 truncate leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-700 font-mono">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back & Forward Button */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep('setup')}
                className="flex-1 py-4 border border-stone-200 hover:bg-stone-50 text-stone-500 font-bold rounded-xl transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => startDialogue()}
                className="flex-1 py-4 bg-gradient-to-r from-rose-600 to-rose-800 text-white font-extrabold rounded-xl transition-all shadow-md"
              >
                Arrive at the Restaurant! 🥂
              </button>
            </div>

          </div>
        )}

        {/* Date Conversation Dialogue Interface */}
        {step === 'date' && (
          <div className="w-full max-w-xl space-y-6 animate-fadeIn">
            
            {/* Location Banner header */}
            <div className="text-center bg-white/80 border border-stone-200 rounded-2xl py-3 px-4 backdrop-blur-md flex items-center justify-center gap-2 text-xs text-stone-500 font-light shadow-sm">
              <span>{location.emoji}</span> Located: <span className="font-semibold text-stone-800">{location.name}</span>
            </div>

            {/* Chemistry Indicator */}
            <div className="bg-white/95 border border-stone-200 rounded-2xl p-4 space-y-2 backdrop-blur-md shadow-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-400 font-mono font-bold">// CHEMISTRY FIELD</span>
                <span className="text-rose-600 font-extrabold font-mono">{chemistry}% Spark</span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-pink-500 transition-all duration-700"
                  style={{ width: `${chemistry}%` }}
                />
              </div>
            </div>

            {/* Character Stage representation */}
            <div className="h-64 flex flex-col items-center justify-center relative overflow-hidden bg-white/70 border border-stone-200/80 rounded-3xl p-6 backdrop-blur-sm shadow-sm">
              {/* Animated star sparkles */}
              <div className="absolute top-1/4 left-1/4 text-amber-500/20 text-lg animate-pulse">✦</div>
              <div className="absolute top-1/3 right-1/4 text-pink-500/20 text-lg animate-pulse">✦</div>
              
              <div className="text-6xl mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.05)] animate-bounce select-none">
                {partner.avatar}
              </div>
              <h3 className="font-extrabold text-lg text-stone-850 tracking-tight">{partner.name}</h3>
              <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">{partner.role}</span>
            </div>

            {/* Chat Bubble dialogue */}
            <div className="bg-rose-50/40 border border-rose-200/60 rounded-2xl p-5 min-h-[100px] flex items-center justify-center relative shadow-sm">
              
              {reactionText ? (
                <p className="text-sm md:text-base font-light text-rose-800 italic text-center leading-relaxed animate-pulse">
                  {reactionText}
                </p>
              ) : (
                <p className="text-sm md:text-base font-light text-stone-800 text-center leading-relaxed">
                  "{scenes[dialogueIndex].partnerText()}"
                </p>
              )}

              {/* Decorative quote mark */}
              <span className="absolute -top-3 left-4 text-4xl text-rose-500/10 select-none font-serif">“</span>
            </div>

            {/* Choices list */}
            {!reactionText && (
              <div className="space-y-3">
                {scenes[dialogueIndex].choices.map((c, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleChoice(c.mod, c.reply())}
                    className="w-full text-left p-4 rounded-xl border border-stone-200 bg-white hover:border-rose-500 hover:bg-rose-50/50 transition-all text-xs md:text-sm font-light text-stone-600 hover:text-rose-950 leading-relaxed shadow-sm hover:shadow"
                  >
                    <span className="font-mono text-rose-600 mr-2">[{idx + 1}]</span>
                    {c.text}
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

        {/* Climax Ending screen */}
        {step === 'climax' && (
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-lg animate-fadeIn relative overflow-hidden">
            
            {/* Stars spark background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.03)_0%,transparent_80%)] pointer-events-none" />

            <div className="w-20 h-20 bg-rose-50 border border-rose-200 text-rose-600 text-4xl rounded-full flex items-center justify-center mx-auto animate-pulse">
              🌹
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-stone-850">An Exquisite Evening!</h3>
              <p className="text-xs text-stone-500 font-mono">CHEMISTRY SCORE: <span className="text-rose-600 font-bold">{chemistry}% SPARK</span></p>
              
              <p className="text-sm text-stone-600 leading-relaxed font-light pt-2">
                As the night draws to a close, {partner.name} leans in, looking at the starry horizon. 
                "I haven't felt this alive in ages. Let's do this again, in this life or the next."
              </p>
            </div>

            {/* Menu summary */}
            <div className="bg-[#FAF8F3] border border-stone-200 rounded-xl p-4 text-left font-mono text-[10px] text-stone-500 space-y-1">
              <div className="text-stone-400 font-bold uppercase tracking-wider text-[9px] mb-1">// Event Manifest Report</div>
              <div>Setting: <span className="text-stone-800">{location.name}</span></div>
              <div>Cuisine Order: <span className="text-stone-800">{selectedStarter.name}, {selectedDrink.name}, {selectedDessert.name}</span></div>
              <div>Status: <span className="text-emerald-700 font-semibold">Synchronized Connection Registered</span></div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep('setup');
                  playSound('chime');
                }}
                className="flex-1 py-4 border border-stone-200 hover:bg-stone-50 text-stone-500 font-bold rounded-xl transition-all text-xs"
              >
                Re-Plan Date
              </button>
              <Link
                href="/manifest"
                className="flex-1 py-4 bg-gradient-to-r from-rose-600 to-rose-800 text-white font-extrabold rounded-xl transition-all shadow-md text-center flex items-center justify-center text-xs"
              >
                Back to Manifest
              </Link>
            </div>

          </div>
        )}

      </main>

      {/* Date Footer */}
      <footer className="py-6 text-center text-xs text-stone-400 tracking-wider font-light bg-stone-100/50 border-t border-stone-200/60">
        VIZIONA DATING GATE • VER 2.1 • SENSORY SIMULATOR ACTIVE
      </footer>

      {/* Embedded styles for transitions */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
