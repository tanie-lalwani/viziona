'use client';

import { useState, useEffect } from 'react';
import { useUserStore, Manifestation } from '@/stores/userStore';

export default function Dashboard() {
  const {
    netWorth,
    manifestationPoints,
    manifestations,
    selectedId,
    setSelectedId,
    addManifestation,
    updateManifestationStatus,
    incrementFocusTime,
  } = useUserStore();

  const [newDreamText, setNewDreamText] = useState('');
  const [newDreamCategory, setNewDreamCategory] = useState<'career' | 'relationship' | 'general'>('general');
  const [isFocusing, setIsFocusing] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(0);

  const selectedManifestation = manifestations.find((m) => m.id === selectedId);

  // Focus mode timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFocusing && selectedId) {
      interval = setInterval(() => {
        setFocusSeconds((prev) => prev + 1);
        incrementFocusTime(selectedId, 1);
      }, 1000);
    } else {
      setFocusSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isFocusing, selectedId, incrementFocusTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDreamText.trim()) return;
    addManifestation(newDreamText.trim(), newDreamCategory);
    setNewDreamText('');
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // Allow clicking through to R3F Canvas
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px',
        boxSizing: 'border-box',
        fontFamily: "'Outfit', 'Inter', sans-serif",
        color: '#fff',
        zIndex: 10,
      }}
    >
      {/* Top Header Row */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'auto',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 800,
              letterSpacing: '3px',
              background: 'linear-gradient(45deg, #00f2fe, #f857a6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0,242,254,0.3)',
            }}
          >
            VIZIONA
          </h1>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>
            3D MANIFESTATION SPACE
          </span>
        </div>

        {/* Stats Panel */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            background: 'rgba(10, 11, 22, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '12px 24px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Wealth Manifested
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#00f2fe' }}>
              ${netWorth.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Vibe Points
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#f857a6' }}>
              {manifestationPoints.toLocaleString()}
            </div>
          </div>
        </div>
      </header>

      {/* Main content grid */}
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '24px',
          marginBottom: '24px',
          minHeight: 0,
        }}
      >
        {/* Left Side: Manifestation Detail Card */}
        <div style={{ width: '400px', pointerEvents: 'auto' }}>
          {selectedManifestation ? (
            <div
              style={{
                background: 'rgba(10, 11, 22, 0.75)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${selectedManifestation.orbColor}55`,
                borderRadius: '24px',
                padding: '28px',
                boxShadow: `0 12px 40px ${selectedManifestation.orbColor}15`,
                animation: 'fadeIn 0.3s ease-out',
                position: 'relative',
              }}
            >
              {/* Category tag */}
              <div
                style={{
                  display: 'inline-block',
                  background: `${selectedManifestation.orbColor}22`,
                  border: `1px solid ${selectedManifestation.orbColor}`,
                  color: selectedManifestation.orbColor,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '16px',
                }}
              >
                {selectedManifestation.category}
              </div>

              {/* Manifestation Text */}
              <p
                style={{
                  margin: '0 0 20px 0',
                  fontSize: '18px',
                  lineHeight: '1.6',
                  fontWeight: 500,
                  color: '#f3f4f6',
                }}
              >
                "{selectedManifestation.text}"
              </p>

              {/* Stats & Status Row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  padding: '12px',
                  borderRadius: '12px',
                }}
              >
                <div>
                  Status:{' '}
                  <span style={{ fontWeight: 600, color: selectedManifestation.status === 'manifested' ? '#4caf50' : '#fff' }}>
                    {selectedManifestation.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  Focus Time:{' '}
                  <span style={{ fontWeight: 600, color: '#fff' }}>
                    {Math.floor(selectedManifestation.focusTime / 60)}m {selectedManifestation.focusTime % 60}s
                  </span>
                </div>
              </div>

              {/* Focus Mode Section */}
              {isFocusing ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 0',
                  }}
                >
                  {/* Breathing / Focus Ring */}
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: `4px solid ${selectedManifestation.orbColor}22`,
                      borderTop: `4px solid ${selectedManifestation.orbColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 700,
                      animation: 'spin 2s linear infinite',
                      marginBottom: '16px',
                    }}
                  >
                    <span style={{ animation: 'counterSpin 2s linear infinite' }}>
                      {formatTime(focusSeconds)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255,255,255,0.7)',
                      fontStyle: 'italic',
                      marginBottom: '20px',
                      animation: 'pulse 3s ease-in-out infinite',
                    }}
                  >
                    Inhale the dream... Exhale the doubt.
                  </div>
                  <button
                    onClick={() => setIsFocusing(false)}
                    style={{
                      width: '100%',
                      background: '#ff3b30',
                      border: 'none',
                      color: '#white',
                      padding: '14px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(255,59,48,0.3)',
                      transition: 'all 0.2s',
                    }}
                  >
                    Stop Focus Session
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setIsFocusing(true)}
                    style={{
                      flex: 1,
                      background: `linear-gradient(135deg, ${selectedManifestation.orbColor}, #a18cd1)`,
                      border: 'none',
                      color: '#white',
                      padding: '14px',
                      borderRadius: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: `0 4px 15px ${selectedManifestation.orbColor}33`,
                      transition: 'all 0.2s',
                    }}
                  >
                    ⚡ Focus & Meditate
                  </button>
                  {selectedManifestation.status !== 'manifested' && (
                    <button
                      onClick={() => updateManifestationStatus(selectedManifestation.id, 'manifested')}
                      style={{
                        background: 'rgba(76, 175, 80, 0.15)',
                        border: '1px solid #4caf50',
                        color: '#4caf50',
                        padding: '14px 20px',
                        borderRadius: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      title="Mark as Manifested!"
                    >
                      ✓ Manifest
                    </button>
                  )}
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedId(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '20px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(10, 11, 22, 0.4)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '32px',
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✨</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 600 }}>Explore Your Universe</h3>
              <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.5' }}>
                Rotate the cosmic space and click on any floating manifestation orb to zoom in, focus, or mark it as realized.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Control Drawer */}
      <footer
        style={{
          display: 'flex',
          gap: '24px',
          pointerEvents: 'auto',
          width: '100%',
          alignItems: 'flex-end',
        }}
      >
        {/* Manifestation Form */}
        <div
          style={{
            flex: 1,
            background: 'rgba(10, 11, 22, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '24px',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          }}
        >
          <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Release a New Manifestation
          </h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={newDreamText}
              onChange={(e) => setNewDreamText(e.target.value)}
              placeholder="What do you want to manifest? (e.g. build an indie-hacker project, get fit...)"
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                transition: 'border 0.2s',
              }}
              onFocus={(e) => (e.target.style.border = '1px solid #00f2fe')}
              onBlur={(e) => (e.target.style.border = '1px solid rgba(255,255,255,0.1)')}
            />
            <select
              value={newDreamCategory}
              onChange={(e: any) => setNewDreamCategory(e.target.value)}
              style={{
                background: 'rgba(10, 11, 22, 0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '0 16px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="general">General</option>
              <option value="career">Career / Clients</option>
              <option value="relationship">Relationship / BF</option>
            </select>
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #00f2fe, #4facfe)',
                border: 'none',
                color: '#fff',
                padding: '0 24px',
                borderRadius: '12px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,242,254,0.2)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Release ✨
            </button>
          </form>
        </div>

        {/* Sidebar Mini List */}
        <div
          style={{
            width: '320px',
            background: 'rgba(10, 11, 22, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '20px',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            maxHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '12px',
            }}
          >
            My Dreams ({manifestations.length})
          </div>
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {manifestations.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: selectedId === m.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${m.orbColor}`,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedId !== m.id) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== m.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                }}
              >
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: m.status === 'manifested' ? '#4caf50' : 'rgba(255,255,255,0.3)',
                  }}
                />
                <div
                  style={{
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    flex: 1,
                    color: m.status === 'manifested' ? 'rgba(255,255,255,0.4)' : '#fff',
                    textDecoration: m.status === 'manifested' ? 'line-through' : 'none',
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </footer>

      {/* Global CSS Inject for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes counterSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
