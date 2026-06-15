import React, { useState } from 'react'
import Pot from '../components/Pot'
import { SoupButton } from '../components/PageShell'
import { FLAVORS } from '../theme'

function VeggiePill({ flavor, selected, onClick }) {
  const [hovered, setHovered] = useState(false)
  const [showTip, setShowTip] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {showTip && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 8px)',
          left: '50%', transform: 'translateX(-50%)',
          background: '#2C1A0E', color: '#FDF6EE',
          fontSize: 11, padding: '5px 10px', borderRadius: 8,
          whiteSpace: 'nowrap', zIndex: 99, pointerEvents: 'none',
          animation: 'tooltipFade 0.15s ease both',
          lineHeight: 1.4,
        }}>
          {flavor.meaning}
          <div style={{
            position: 'absolute', top: '100%', left: '50%',
            transform: 'translateX(-50%)',
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: '5px solid #2C1A0E',
          }} />
        </div>
      )}
      <button
        onClick={onClick}
        onMouseEnter={() => { setHovered(true); setShowTip(true) }}
        onMouseLeave={() => { setHovered(false); setShowTip(false) }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '7px 15px', borderRadius: 20,
          border: `1.5px solid ${selected ? flavor.color : hovered ? flavor.color : flavor.border}`,
          background: selected
            ? `linear-gradient(135deg, ${flavor.color}, ${flavor.border})`
            : hovered ? flavor.bg + 'ee' : flavor.bg,
          color: selected ? '#FFF8F0' : flavor.color,
          fontSize: 13, fontWeight: selected ? 600 : 400,
          cursor: 'pointer',
          transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
          transform: selected ? 'scale(1.09)' : hovered ? 'scale(1.04)' : 'scale(1)',
          boxShadow: selected ? `0 3px 14px ${flavor.color}55` : 'none',
        }}
      >
        <span style={{ fontSize: 15 }}>{flavor.veggie}</span>
        {flavor.name}
      </button>
    </div>
  )
}

function Landing({ veggieName, flavor, setFlavor, goTo }) {
  const selectedFlavor = FLAVORS.find(f => f.name === flavor)

  return (
    <div style={{ minHeight: '100vh', background: '#FDF6EE' }}>
      <style>{`
        @keyframes tooltipFade {
          from { opacity:0; transform:translateX(-50%) translateY(4px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        @keyframes pageFadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes gentlePulse {
          0%,100% { opacity:0.7; }
          50%     { opacity:1; }
        }
        @keyframes shimmerHdr {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* ── HEADER ── rich gradient, not flat */}
      <div style={{
        background: 'linear-gradient(135deg, #7A3B10 0%, #B05A10 35%, #C07818 65%, #8B4513 100%)',
        backgroundSize: '300% 300%',
        animation: 'shimmerHdr 8s ease infinite',
        padding: '14px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 3px 20px rgba(122,59,16,0.35)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        {/* Wordmark */}
        <div>
          <div style={{
            fontSize: 20, fontWeight: 700, color: '#FFF8EC',
            fontFamily: 'Georgia, serif', letterSpacing: '-0.3px',
            lineHeight: 1.1, textShadow: '0 1px 4px rgba(0,0,0,0.25)',
          }}>
            🍲 the stranger's soup
          </div>
          <div style={{
            fontSize: 10, color: '#FFD9A0', letterSpacing: '1.2px',
            marginTop: 2, fontWeight: 500,
          }}>
            anonymous · ephemeral · warm
          </div>
        </div>

        {/* Identity badge — stands out on dark header */}
        <div style={{ textAlign: 'right' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            border: '1.5px solid rgba(255,220,150,0.5)',
            borderRadius: 24, padding: '6px 14px',
          }}>
            <span style={{ fontSize: 14 }}>🌿</span>
            <span style={{
              fontSize: 13, fontWeight: 700, color: '#FFF8EC',
              letterSpacing: '0.2px',
            }}>
              {veggieName}
            </span>
          </div>
          <div style={{
            fontSize: 9, color: '#FFD9A0', marginTop: 3,
            letterSpacing: '0.4px',
          }}>
            your secret name
          </div>
        </div>
      </div>

      {/* ── TRUST STRIP ── coloured accent bar below header */}
      <div style={{
        background: 'linear-gradient(90deg, #FFF3E0, #FFEACC, #FFF3E0)',
        borderBottom: '1px solid #F0D8B0',
        padding: '10px 20px',
        display: 'flex', justifyContent: 'center',
        flexWrap: 'wrap', gap: 10,
      }}>
        {[
          { icon: '👤', text: 'no account, no name' },
          { icon: '🔒', text: 'only strangers read this' },
          { icon: '✨', text: 'disappears after 3 responses' },
        ].map((p, i) => (
          <span key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 12, color: '#7A4A10', fontWeight: 500,
            background: 'rgba(255,255,255,0.7)',
            border: '1px solid #E8C88A',
            borderRadius: 20, padding: '4px 12px',
          }}>
            <span style={{ fontSize: 13 }}>{p.icon}</span>
            {p.text}
          </span>
        ))}
      </div>

      {/* ── HERO — two-column on wide, stacked naturally on mobile ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        alignItems: 'center', justifyContent: 'center',
        gap: 0, padding: '0',
        minHeight: 360,
      }}>

        {/* Left: headline + how-it-works */}
        <div style={{
          flex: '1 1 300px', maxWidth: 460,
          padding: '36px 28px 28px',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: '#C07810',
            letterSpacing: '1.4px', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            you are known here as {veggieName}
          </div>

          <h1 style={{
            fontSize: 30, fontWeight: 700, color: '#2C1A0E',
            fontFamily: 'Georgia, serif', lineHeight: 1.25,
            letterSpacing: '-0.5px', marginBottom: 20, marginTop: 0,
          }}>
            your thoughts,<br />held by strangers<br />who care.
          </h1>

          {/* How it works — left-aligned list, not centered */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '🫙', text: 'drop your feelings in the pot — totally anonymous' },
              { icon: '👥', text: 'strangers read them. nobody knows who you are.' },
              { icon: '💬', text: 'they write back with warmth, not judgment.' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '10px 14px',
                background: '#FFFCF7',
                borderRadius: 12,
                border: '1px solid #ECD8BC',
                animation: `pageFadeUp 0.4s ease both`,
                animationDelay: `${i * 100}ms`,
              }}>
                <span style={{ fontSize: 18, marginTop: 1 }}>{item.icon}</span>
                <span style={{ fontSize: 13, color: '#6B4A28', lineHeight: 1.55 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: pot — sits naturally next to the copy */}
        <div style={{
          flex: '0 0 auto',
          padding: '20px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Pot size={260} />
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{
        height: 2,
        background: 'linear-gradient(90deg, transparent, #E4C89A, #C07810, #E4C89A, transparent)',
        margin: '0 24px',
        borderRadius: 2,
      }} />

      {/* ── VEGGIE FLAVOR PICKER ── */}
      <div style={{ padding: '28px 20px 40px', textAlign: 'center' }}>

        <div style={{ marginBottom: 20 }}>
          <p style={{
            fontSize: 15, color: '#2C1A0E', fontWeight: 600,
            marginBottom: 4, fontFamily: 'Georgia, serif',
          }}>
            every feeling is a veggie in the pot.
          </p>
          <p style={{ fontSize: 13, color: '#9A6A40' }}>
            hover any to see what it means. pick what you're carrying today.
          </p>
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap',
          gap: 8, marginBottom: 22,
          justifyContent: 'center',
        }}>
          {FLAVORS.map(f => (
            <VeggiePill
              key={f.name}
              flavor={f}
              selected={flavor === f.name}
              onClick={() => setFlavor(f.name)}
            />
          ))}
        </div>

        {/* Selected flavor meaning card */}
        {selectedFlavor && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            background: selectedFlavor.bg,
            border: `2px solid ${selectedFlavor.color}55`,
            borderRadius: 14, padding: '14px 18px',
            marginBottom: 18,
            boxShadow: `0 2px 18px ${selectedFlavor.color}22`,
            animation: 'pageFadeUp 0.3s ease both',
          }}>
            <span style={{ fontSize: 28 }}>{selectedFlavor.veggie}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: selectedFlavor.color, letterSpacing: '0.3px',
                marginBottom: 2,
              }}>
                {selectedFlavor.name}
              </div>
              <div style={{
                fontSize: 13, color: selectedFlavor.color + 'bb',
                fontStyle: 'italic',
              }}>
                {selectedFlavor.meaning}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        {flavor ? (
          <div style={{ animation: 'pageFadeUp 0.3s ease both', maxWidth: 400, margin: '0 auto' }}>
            <SoupButton onClick={() => goTo('vent')} variant="amber">
              drop it in the pot →
            </SoupButton>
            <p style={{ fontSize: 11, color: '#B4926F', marginTop: 8 }}>
              no one will ever know it was you.
            </p>
          </div>
        ) : (
          <p style={{
            fontSize: 13, color: '#B4926F',
            animation: 'gentlePulse 2.5s ease-in-out infinite',
          }}>
            pick a feeling to begin
          </p>
        )}
      </div>

    </div>
  )
}

export default Landing
