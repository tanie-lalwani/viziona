'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface StageLight {
  color: string;
  glowColor: string;
  label: string;
}

const lights: StageLight[] = [
  { color: 'bg-purple-600', glowColor: 'rgba(147, 51, 234, 0.25)', label: 'Cyber Violet' },
  { color: 'bg-emerald-600', glowColor: 'rgba(5, 150, 105, 0.25)', label: 'Solar Emerald' },
  { color: 'bg-sky-600', glowColor: 'rgba(2, 132, 199, 0.25)', label: 'Nebula Blue' },
  { color: 'bg-rose-600', glowColor: 'rgba(225, 29, 72, 0.25)', label: 'Supernova Gold' }
];

export default function RockstarConcert() {
  const [step, setStep] = useState<'setup' | 'stage' | 'encore'>('setup');
  const [stageName, setStageName] = useState('MC CREATOR');
  const [genre, setGenre] = useState('Cyberpunk Synthwave');
  const [hype, setHype] = useState(50);
  const [audienceCount, setAudienceCount] = useState(95000);
  const [activeLight, setActiveLight] = useState<StageLight>(lights[0]);
  const [logMessages, setLogMessages] = useState<string[]>(['You step into the dark corridor... stage doors are opening.']);
  const [strobeActive, setStrobeActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number; life: number }[]>([]);

  // Sound Synthesizer via Web Audio API
  const playSound = (type: 'guitar' | 'pyro' | 'crowd' | 'feedback' | 'applause' | 'chime') => {
    if (typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (type === 'guitar') {
        const freqs = [196.00, 293.66, 392.00]; // G3, D4, G4 power chord
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const dist = ctx.createWaveShaper();
          
          const makeDistortionCurve = (amount = 80) => {
            const k = typeof amount === 'number' ? amount : 50;
            const n_samples = 44100;
            const curve = new Float32Array(n_samples);
            const deg = Math.PI / 180;
            for (let i = 0; i < n_samples; ++i) {
              const x = (i * 2) / n_samples - 1;
              curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
            }
            return curve;
          };
          
          dist.curve = makeDistortionCurve(100);
          dist.oversample = '4x';
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2 + idx * 0.15);
          
          osc.connect(dist);
          dist.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 1.5);
        });
      } else if (type === 'pyro') {
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 1.3);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === 'crowd') {
        const bufferSize = ctx.sampleRate * 2.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.8);
        filter.frequency.exponentialRampToValueAtTime(260, ctx.currentTime + 2.3);
        filter.Q.setValueAtTime(2.5, ctx.currentTime);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.4);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
      } else if (type === 'feedback') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2900, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(3100, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.008, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'applause') {
        for (let i = 0; i < 45; i++) {
          setTimeout(() => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(350 + Math.random() * 800, ctx.currentTime);
            gain.gain.setValueAtTime(0.015, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
          }, Math.random() * 1000);
        }
      } else if (type === 'chime') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Slowly decay hype over time
  useEffect(() => {
    if (step === 'stage') {
      const interval = setInterval(() => {
        setHype(h => Math.max(10, h - 2));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step]);

  // Particle explosion drawing loop
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const render = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const parts = particlesRef.current;
          
          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // gravity
            p.alpha -= 0.015;
            p.life--;
            
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            if (p.life <= 0 || p.alpha <= 0) {
              parts.splice(i, 1);
            }
          }
          animId = requestAnimationFrame(render);
        };
        render();
      }
    }
    return () => cancelAnimationFrame(animId);
  }, [step]);

  const addParticles = (color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const count = 40;
    const center = canvas.width / 2;
    const bottom = canvas.height - 20;

    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        x: center,
        y: bottom,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 12 - 4,
        color,
        size: Math.random() * 4 + 2,
        alpha: 1,
        life: Math.floor(Math.random() * 40) + 40
      });
    }
  };

  const addLog = (msg: string) => {
    setLogMessages(prev => [msg, ...prev.slice(0, 7)]);
  };

  const startConcert = () => {
    playSound('crowd');
    setHype(55);
    setAudienceCount(98000 + Math.floor(Math.random() * 5000));
    setStep('stage');
    setLogMessages(['Stage lights blink on!', 'A roaring audience of thousands chants your name.']);
  };

  // Concert Actions
  const handleShred = () => {
    playSound('guitar');
    const colorIdx = Math.floor(Math.random() * lights.length);
    setActiveLight(lights[colorIdx]);
    setHype(h => Math.min(100, h + 15));
    setAudienceCount(c => c + 400);
    addLog(`🎸 SHRED: You play a screaming G-minor guitar solo. Stage lights set to ${lights[colorIdx].label}!`);
  };

  const handlePyro = () => {
    playSound('pyro');
    setStrobeActive(true);
    setTimeout(() => setStrobeActive(false), 200);
    setTimeout(() => {
      setStrobeActive(true);
      setTimeout(() => setStrobeActive(false), 200);
    }, 400);

    setHype(h => Math.min(100, h + 20));
    setAudienceCount(c => c + 600);
    addParticles(activeLight.color.includes('purple') ? '#9333ea' : activeLight.color.includes('emerald') ? '#059669' : activeLight.color.includes('sky') ? '#0284c7' : '#e11d48');
    addLog(`💥 PYRO: Red and amber phosphorus lasers shoot from the rafters! The stage flares.`);
  };

  const handleStageDive = () => {
    playSound('crowd');
    setHype(h => Math.min(100, h + 25));
    setAudienceCount(c => c + 1200);
    addLog(`🌊 CROWD SURF: You launch off the monitor speaker. 100,000 hands support you in a wave of cosmic bliss!`);
  };

  const handleMicDrop = () => {
    playSound('feedback');
    setTimeout(() => {
      playSound('applause');
      playSound('crowd');
    }, 300);

    setHype(100);
    addLog(`🎤 MIC DROP: "THIS IS YOUR WORLD. EVERYONE IS JUST LIVING IN IT!" *Clatter* You drop the mic. Stand ovation.`);
    
    setTimeout(() => {
      setStep('encore');
      playSound('applause');
    }, 4500);
  };

  return (
    <div
      className={`min-h-screen w-full flex flex-col justify-between text-stone-850 font-sans transition-colors duration-300 ${
        strobeActive 
          ? 'bg-white' 
          : step === 'stage' 
            ? 'bg-[#FAF7F0]' 
            : 'bg-gradient-to-b from-[#FDFBF7] via-[#FAF6EE] to-[#F5EFE2]'
      }`}
    >
      
      {/* Top Navbar */}
      <header className={`flex items-center justify-between px-6 py-4 border-b transition-colors ${strobeActive ? 'border-black/10 text-black bg-white/20' : 'border-stone-250 bg-white/60'} z-20`}>
        <Link href="/" className={`${strobeActive ? 'text-black' : 'text-stone-500 hover:text-stone-800'} transition-colors text-sm flex items-center gap-2`}>
          ← Main Portal
        </Link>
        <span className={`text-sm font-extrabold tracking-widest uppercase ${strobeActive ? 'text-purple-800' : 'text-purple-800 drop-shadow-sm'}`}>
          🎸 Rockstar Stage Arena
        </span>
        <div className="w-20" />
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-4xl w-full mx-auto px-6 py-8 relative min-h-0">
        
        {/* Setup Screen */}
        {step === 'setup' && (
          <div className="w-full max-w-md space-y-6 bg-white border border-stone-200 rounded-3xl p-6 md:p-8 shadow-md animate-fadeIn">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-purple-850 font-mono">Concert Setup Protocol</span>
              <h2 className="text-3xl font-black mt-1 text-stone-850 tracking-tight">Step onto the Stage</h2>
              <p className="text-xs text-stone-500 mt-2">Enter your stage moniker and select your sound energy type.</p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide font-mono">Rockstar Moniker</label>
                <input
                  type="text"
                  value={stageName}
                  onChange={(e) => setStageName(e.target.value.toUpperCase())}
                  className="px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-800 placeholder-stone-400 outline-none text-sm transition-all focus:border-purple-650"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide font-mono">Energy Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-800 outline-none text-sm cursor-pointer"
                >
                  <option value="Cyberpunk Synthwave">Cyberpunk Synthwave</option>
                  <option value="Symphonic Nebula Metal">Symphonic Nebula Metal</option>
                  <option value="Hyperpop Cosmic Dance">Hyperpop Cosmic Dance</option>
                  <option value="Existential Post-Rock">Existential Post-Rock</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => startConcert()}
              className="w-full py-4.5 bg-gradient-to-r from-purple-700 to-fuchsia-800 text-white font-extrabold rounded-xl transition-all shadow-md"
            >
              Walk Stage Planks 🎤
            </button>
          </div>
        )}

        {/* Live Stage Console */}
        {step === 'stage' && (
          <div className="w-full space-y-6 animate-fadeIn relative">
            
            {/* Overlay pyrotechnics canvas */}
            <canvas
              ref={canvasRef}
              width={700}
              height={300}
              className="absolute inset-0 w-full h-[300px] pointer-events-none z-10"
            />

            {/* Stats Dashboard Banner */}
            <div className="grid grid-cols-3 gap-4 bg-white border border-stone-250 rounded-2xl p-4 shadow-sm">
              <div className="text-center border-r border-stone-200">
                <span className="text-[9px] text-stone-450 uppercase tracking-wider font-mono">ROCKSTAR</span>
                <div className="text-sm font-bold text-purple-800 truncate">{stageName}</div>
              </div>
              <div className="text-center border-r border-stone-200">
                <span className="text-[9px] text-stone-450 uppercase tracking-wider font-mono">ARENA ATTENDANCE</span>
                <div className="text-sm font-bold text-stone-800">{audienceCount.toLocaleString()} fans</div>
              </div>
              <div className="text-center">
                <span className="text-[9px] text-stone-450 uppercase tracking-wider font-mono">LIGHT ARRAY</span>
                <div className="text-sm font-bold text-emerald-700">{activeLight.label}</div>
              </div>
            </div>

            {/* Simulated Live Stage Lights View */}
            <div className="h-60 rounded-3xl relative overflow-hidden bg-stone-900 border border-stone-200 flex flex-col justify-between p-6 shadow-md">
              
              {/* Backlight beams */}
              <div className="absolute top-0 inset-x-0 flex justify-between px-12 pointer-events-none">
                <div className={`w-32 h-64 blur-3xl -translate-y-24 rotate-12 transition-all duration-500 ${activeLight.color} opacity-40`} />
                <div className={`w-32 h-64 blur-3xl -translate-y-24 -rotate-12 transition-all duration-500 ${activeLight.color} opacity-40`} />
              </div>

              {/* Hype Meter */}
              <div className="w-full bg-black/60 border border-white/5 rounded-xl p-3 z-10 backdrop-blur-md">
                <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                  <span className="text-white/60">🔥 ARENA HYPE</span>
                  <span className="text-purple-300 font-bold">{hype}% EXCITED</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-all duration-500"
                    style={{ width: `${hype}%` }}
                  />
                </div>
              </div>

              {/* Equalizer animation */}
              <div className="flex justify-center items-end gap-1.5 h-20 z-10 pointer-events-none">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 rounded-full transition-all duration-300 ${
                      activeLight.color.includes('purple') ? 'bg-purple-500' : activeLight.color.includes('emerald') ? 'bg-emerald-400' : activeLight.color.includes('sky') ? 'bg-sky-400' : 'bg-rose-500'
                    }`}
                    style={{
                      height: `${15 + Math.sin(i + hype) * 45 + Math.random() * 20}%`,
                      opacity: 0.8,
                    }}
                  />
                ))}
              </div>

              {/* Venue Tag */}
              <div className="flex justify-between items-center text-[9px] font-mono text-white/50 z-10">
                <span>// SOUND ENGINE: DISTORTED ANALOG</span>
                <span>GENRE: {genre.toUpperCase()}</span>
              </div>
            </div>

            {/* Action Buttons grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={handleShred}
                className="py-4 border border-stone-200 bg-white hover:border-purple-500/50 hover:bg-purple-50/50 rounded-xl font-bold transition-all text-xs flex flex-col items-center justify-center gap-1 text-stone-700 hover:text-purple-950 shadow-sm"
              >
                <span className="text-lg">🎸</span>
                <span>Shred Guitar Solo</span>
              </button>
              <button
                onClick={handlePyro}
                className="py-4 border border-stone-200 bg-white hover:border-fuchsia-500/50 hover:bg-fuchsia-50/50 rounded-xl font-bold transition-all text-xs flex flex-col items-center justify-center gap-1 text-stone-700 hover:text-fuchsia-950 shadow-sm"
              >
                <span className="text-lg">💥</span>
                <span>Blast Pyrotechnics</span>
              </button>
              <button
                onClick={handleStageDive}
                className="py-4 border border-stone-200 bg-white hover:border-sky-500/50 hover:bg-sky-50/50 rounded-xl font-bold transition-all text-xs flex flex-col items-center justify-center gap-1 text-stone-700 hover:text-sky-950 shadow-sm"
              >
                <span className="text-lg">🌊</span>
                <span>Crowd Surf Dive</span>
              </button>
              <button
                onClick={handleMicDrop}
                className="py-4 bg-gradient-to-r from-purple-700 to-fuchsia-800 hover:from-purple-600 hover:to-fuchsia-700 text-white font-extrabold rounded-xl transition-all text-xs flex flex-col items-center justify-center gap-1 shadow-md"
              >
                <span className="text-lg">🎤</span>
                <span>Speak & Mic Drop</span>
              </button>
            </div>

            {/* Concert Log messages */}
            <div className="bg-white border border-stone-250 rounded-2xl p-4 space-y-1.5 shadow-inner font-mono text-[10px] text-stone-500 h-36 overflow-y-auto">
              <div className="font-bold text-stone-400 text-[9px] border-b border-stone-150 pb-1 mb-1 uppercase tracking-wider">// LIVE PERFORMANCE TRANSCRIPT</div>
              {logMessages.map((msg, i) => (
                <div key={i} className={i === 0 ? 'text-purple-800 font-semibold' : ''}>
                  {msg}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Encore summary screen */}
        {step === 'encore' && (
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-6 md:p-8 text-center space-y-6 shadow-lg animate-fadeIn">
            <div className="w-20 h-20 bg-purple-50 border border-purple-200 text-purple-700 text-4xl rounded-full flex items-center justify-center mx-auto animate-pulse">
              🤘
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-stone-850">Legendary Gig Concluded!</h3>
              <p className="text-xs text-stone-500 font-mono">GENRE SET: <span className="text-purple-700 font-bold">{genre.toUpperCase()}</span></p>
              
              <p className="text-sm text-stone-600 leading-relaxed font-light pt-2">
                The echo of the mic drop is followed by deafening applause. 100,000 fans roar, lighting up the arena with glowing tablets.
                You conquered the stage. It is your universe, and they are just living in it.
              </p>
            </div>

            <div className="bg-[#FAF8F3] border border-stone-200 rounded-xl p-4 text-left font-mono text-[10px] text-stone-500 space-y-1">
              <div className="text-stone-400 font-bold uppercase tracking-wider text-[9px] mb-1">// Gig Summary Report</div>
              <div>Artist: <span className="text-stone-800">{stageName}</span></div>
              <div>Audience Size: <span className="text-stone-800">{audienceCount.toLocaleString()} Souls</span></div>
              <div>Rating: <span className="text-emerald-700 font-semibold">5.0/5 Stars (Universal Rave reviews)</span></div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep('setup');
                  playSound('chime');
                }}
                className="flex-1 py-4 border border-stone-200 hover:bg-stone-50 text-stone-500 font-bold rounded-xl transition-all text-xs"
              >
                Plan Encore Gig
              </button>
              <Link
                href="/manifest"
                className="flex-1 py-4 bg-gradient-to-r from-purple-700 to-fuchsia-800 text-white font-extrabold rounded-xl transition-all shadow-md text-center flex items-center justify-center text-xs"
              >
                Manifestation Orbit
              </Link>
            </div>

          </div>
        )}

      </main>

      {/* Concert Footer */}
      <footer className="py-6 text-center text-xs text-stone-400 tracking-wider font-light bg-stone-105 border-t border-stone-200/60">
        VIZIONA CONCERT STAGE • AMP ENGINE V12 • LOUDSPEAKERS ACTIVE
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
