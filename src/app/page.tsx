'use client';

/**
 * Viziona Universe Entry Portal Page
 * 
 * Tracks the browser window scroll offset to calculate progress (0 to 1).
 * It feeds this value to a single unified 3D GlobeScene canvas which houses both 
 * the far-away Universe Backdrop and the close-up interactive Earth model.
 * 
 * HTML contents remain commented out to keep the focus entirely on the depth 
 * and parallax of the 3D celestial sphere space.
 */
// Force compilation reload trigger

import Link from 'next/link';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';

const GlobeScene = dynamic(() => import('@/experience/components/GlobeScene'), { ssr: false });

interface PortalOption {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  shadowColor: string;
}

const portals: PortalOption[] = [
  {
    title: 'Amazon Infinite',
    subtitle: 'THE SHOPPING VAULT',
    description: 'Acquire literally anything in the universe. If you can type it, you can buy it, own it, and ship it.',
    icon: '🛍️',
    href: '/shopping',
    color: 'from-amber-400 to-orange-500',
    shadowColor: 'rgba(245, 158, 11, 0.2)',
  },
  {
    title: 'Cosmic Manifestation',
    subtitle: '3D ORB SPACE',
    description: 'Focus your mind and manifest your career, relationships, and life goals in a 3D orbit field.',
    icon: '🌌',
    href: '/manifest',
    color: 'from-cyan-400 to-blue-500',
    shadowColor: 'rgba(6, 182, 212, 0.2)',
  },
  {
    title: 'Fancy Date',
    subtitle: 'LUXURY DATE SIMULATOR',
    description: 'Plan the ultimate rendezvous. Select your companion, choose hyper-luxurious dining, and sparks will fly.',
    icon: '🌹',
    href: '/date',
    color: 'from-pink-500 to-rose-600',
    shadowColor: 'rgba(244, 63, 94, 0.2)',
  },
  {
    title: 'Your Concert',
    subtitle: 'ROCKSTAR ARENA',
    description: 'Step into the spotlights. A crowd of 100,000 screaming fans is chanting your name. Unleash the pyrotechnics.',
    icon: '🎤',
    href: '/concert',
    color: 'from-purple-500 to-fuchsia-600',
    shadowColor: 'rgba(139, 92, 246, 0.2)',
  },
];

export default function EntryPortal() {
  const [mounted, setMounted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isXR, setIsXR] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 2.0,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      setScrollProgress(window.scrollY / totalHeight);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative w-full min-h-screen bg-black text-white font-sans selection:bg-amber-500/30 overflow-x-hidden">
      
      {/* Premium Glassmorphic XR Viewport Toggle Button (Absolute Top Layer) */}
      <button
        onClick={() => setIsXR(!isXR)}
        className="fixed top-5 left-5 z-50 pointer-events-auto bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 text-white px-4 py-2 rounded-full text-[11px] font-bold tracking-wider font-mono shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
      >
        <span>🕶️</span>
        <span>{isXR ? 'CLOSE XR VIEWPORT' : 'XR SBS VIEWPORT'}</span>
      </button>

      {/* 3D Unified Scene (covers background, fixed position) */}
      <div className="fixed inset-0 pointer-events-auto overflow-hidden z-0">
        <GlobeScene scrollProgress={scrollProgress} isXR={isXR} />
      </div>

      {/* Subtle deep nebula color glows on top of 3D stars */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[45vw] h-[45vw] rounded-full bg-purple-950/10 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[45vw] h-[45vw] rounded-full bg-amber-950/5 blur-[130px]" />
      </div>

      {/* SECTION 1: HERO VIEW */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center text-center px-6 z-20 pointer-events-none">
        
        {/* Section 1 Top Right Indicator */}
        <div className="absolute top-6 right-6 text-stone-500 font-mono text-xs uppercase tracking-widest pointer-events-auto select-none">
          // Section 1
        </div>

        {/* Commented out Hero Content 
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs font-semibold tracking-wider uppercase mb-8 shadow-[0_0_15px_rgba(245,158,11,0.1)] pointer-events-auto animate-bounce">
            ✨ Cosmic Creator Panel ✨
          </div>

          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
            "It's your world.
          </h1>
          <h2 className="text-3xl md:text-6xl font-extrabold tracking-tight mt-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            We're just living in it."
          </h2>
          
          <p className="mt-6 text-sm md:text-lg text-stone-400 max-w-xl font-light leading-relaxed">
            The stars align at your coordinate nodes. Scroll down to deploy your reality vectors.
          </p>

          <div className="absolute bottom-16 flex flex-col items-center gap-1.5 animate-bounce">
            <span className="text-[10px] font-bold tracking-widest text-amber-500/60 uppercase">Scroll Down</span>
            <span className="text-base text-amber-500">↓</span>
          </div>
        </div>
        */}
      </section>

      {/* SECTION 2: EXPLORATION VIEW */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center text-center px-6 z-20 pointer-events-none">
        
        {/* Section 2 Top Right Indicator */}
        <div className="absolute top-6 right-6 text-stone-500 font-mono text-xs uppercase tracking-widest pointer-events-auto select-none">
          // Section 2
        </div>

        {/* Commented out Explore Content
        <div className="flex flex-col items-center">
          <div className="mb-10 pointer-events-auto">
            <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              Start Exploring Your World
            </h2>
            <p className="text-xs md:text-lg text-stone-400 font-light mt-4 max-w-md mx-auto leading-relaxed">
              Deploy your vectors, acquire galactic goods, organize simulated events, and shape your universe.
            </p>
          </div>

          <div className="pointer-events-auto">
            <button
              onClick={() => setShowOverlay(true)}
              className="px-12 py-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-extrabold text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/20 tracking-widest uppercase hover:scale-105"
            >
              Explore Your World ✨
            </button>
          </div>
        </div>
        */}
      </section>

      {/* PORTALS OVERLAY MODAL (Commented out)
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6 overflow-y-auto animate-fadeIn">
          
          <div className="relative w-full max-w-5xl bg-[#06070c]/95 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col items-center backdrop-blur-xl">
            
            <button
              onClick={() => setShowOverlay(false)}
              className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-stone-400 hover:text-white hover:bg-white/5 transition-all font-bold text-lg"
            >
              ×
            </button>

            <div className="text-center mb-10">
              <span className="text-xs font-bold text-amber-400 tracking-widest uppercase font-mono">// Vector Portals Active</span>
              <h3 className="text-2xl md:text-4xl font-extrabold text-white mt-1">Select A Destination</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {portals.map((portal) => (
                <Link key={portal.title} href={portal.href} className="group block focus:outline-none">
                  <div
                    className="h-full relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/50 hover:bg-white/10 shadow-sm"
                  >
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0 border border-white/10">
                        {portal.icon}
                      </div>

                      <div>
                        <span className={`text-[10px] font-bold tracking-widest bg-gradient-to-r ${portal.color} bg-clip-text text-transparent uppercase`}>
                          {portal.subtitle}
                        </span>
                        
                        <h4 className="text-lg font-bold text-white mt-0.5 group-hover:text-amber-400 transition-colors">
                          {portal.title} →
                        </h4>

                        <p className="mt-2 text-xs text-stone-400 leading-relaxed font-light">
                          {portal.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>
      )}
      */}

      {/* Global CSS style tags for animation */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }

        /* Lenis smooth scrolling rules */
        html.lenis, html.lenis body {
          height: auto;
        }
        .lenis.lenis-smooth {
          scroll-behavior: auto !important;
        }
        .lenis.lenis-smooth [data-lenis-prevent] {
          overscroll-behavior: contain;
        }
        .lenis.lenis-stopped {
          overflow: hidden;
        }
        .lenis.lenis-smooth iframe {
          pointer-events: none;
        }
      `}</style>

    </div>
  );
}
