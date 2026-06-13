import React, { useState } from 'react'

/*
  MeltButton — three phases:
  1. idle        → warm amber button, gentle shimmer
  2. melting     → full-screen calm overlay, droplets drip down, breathing animation
  3. dissolved   → soft "released" confirmation fades in
*/

export function MeltButton({ onMelt }) {
  const [phase, setPhase] = useState('idle')  // idle | confirm | melting | dissolved

  const handleClick = () => {
    if (phase === 'idle') {
      setPhase('confirm')
      return
    }
    if (phase === 'confirm') {
      setPhase('melting')
      // after the melt animation, call the real delete + show dissolved
      setTimeout(() => {
        onMelt()
        setPhase('dissolved')
      }, 3800)
    }
  }

  const cancel = () => setPhase('idle')

  return (
    <>
      <style>{`
        @keyframes meltDrip {
          0%   { transform: translateY(-8px) scaleY(0.4); opacity:0; }
          20%  { opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translateY(60px) scaleY(1.6) scaleX(0.6); opacity:0; }
        }
        @keyframes meltRipple {
          0%   { transform: translate(-50%,-50%) scale(0); opacity:0.7; }
          100% { transform: translate(-50%,-50%) scale(4); opacity:0; }
        }
        @keyframes breathe {
          0%,100% { transform: scale(1);    opacity:0.9; }
          50%     { transform: scale(1.04); opacity:1;   }
        }
        @keyframes dissolveIn {
          from { opacity:0; transform:translateY(10px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes overlayIn {
          from { opacity:0; }
          to   { opacity:1; }
        }
        @keyframes shimmerBtn {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes dropletBob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-3px); }
        }
      `}</style>

      {/* IDLE / CONFIRM STATE */}
      {(phase === 'idle' || phase === 'confirm') && (
        <div style={{ marginTop: 14 }}>
          {phase === 'confirm' && (
            <div style={{
              background: 'linear-gradient(135deg, #FFF8EC, #FFF0D6)',
              border: '1.5px solid #EF9F27',
              borderRadius: 12, padding: '14px 16px',
              marginBottom: 10,
              animation: 'dissolveIn 0.3s ease both',
            }}>
              <p style={{
                fontSize: 13, color: '#7A4A06', lineHeight: 1.6,
                margin: '0 0 4px',
                fontFamily: 'Georgia, serif', fontStyle: 'italic',
              }}>
                this will release these words forever — gently, like steam.
              </p>
              <p style={{ fontSize: 11, color: '#B4926F', margin: 0 }}>
                are you ready to let go?
              </p>
            </div>
          )}

          <button
            onClick={handleClick}
            style={{
              width: '100%', padding: '13px',
              background: phase === 'confirm'
                ? 'linear-gradient(135deg, #F5C842, #E89010)'
                : 'linear-gradient(270deg, #FAEEDA, #FFE099, #FAEEDA)',
              backgroundSize: phase === 'confirm' ? 'auto' : '200% auto',
              animation: phase === 'idle' ? 'shimmerBtn 3s linear infinite' : 'none',
              border: `1.5px solid ${phase === 'confirm' ? '#C07810' : '#EF9F27'}`,
              borderRadius: 10, color: '#633806',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: phase === 'confirm' ? '0 4px 20px #C0781040' : 'none',
            }}
          >
            {phase === 'idle' ? '🫧 let it melt · release this forever' : '✨ yes, release it'}
          </button>

          {phase === 'confirm' && (
            <button
              onClick={cancel}
              style={{
                width: '100%', marginTop: 8, padding: '8px',
                background: 'none', border: 'none',
                color: '#B4926F', fontSize: 13,
                cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              not yet
            </button>
          )}

          <p style={{
            fontSize: 11, color: '#C8B89A',
            textAlign: 'center', marginTop: 8,
          }}>
            once released, these words return to the soup
          </p>
        </div>
      )}

      {/* MELTING OVERLAY */}
      {phase === 'melting' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'linear-gradient(160deg, #FFF8F0 0%, #FFF3E0 50%, #FDE8CC 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          animation: 'overlayIn 0.6s ease both',
        }}>
          {/* Ripple rings */}
          {[0, 0.4, 0.8].map((delay, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 120, height: 120,
              borderRadius: '50%',
              border: `2px solid #EF9F27${['60','40','25'][i]}`,
              animation: `meltRipple 2.4s ease-out ${delay}s infinite`,
              pointerEvents: 'none',
            }} />
          ))}

          {/* Central vessel */}
          <div style={{
            position: 'relative',
            animation: 'breathe 2.2s ease-in-out infinite',
            marginBottom: 32,
          }}>
            {/* Dripping droplets */}
            {[
              { left: '30%', delay: '0s',    size: 14, color: '#FFD166' },
              { left: '50%', delay: '0.5s',  size: 18, color: '#F4A12A' },
              { left: '68%', delay: '1.1s',  size: 12, color: '#FFE866' },
              { left: '42%', delay: '1.7s',  size: 16, color: '#FFB347' },
              { left: '58%', delay: '2.3s',  size: 11, color: '#FFD166' },
            ].map((d, i) => (
              <div key={i} style={{
                position: 'absolute',
                top: 60, left: d.left,
                width: d.size, height: d.size * 1.4,
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                background: d.color,
                opacity: 0,
                animation: `meltDrip 1.6s ease-in ${d.delay} infinite`,
              }} />
            ))}

            {/* The emoji/icon */}
            <div style={{
              fontSize: 72,
              filter: 'drop-shadow(0 8px 24px rgba(192,120,16,0.3))',
              animation: 'dropletBob 2s ease-in-out infinite',
            }}>
              🫧
            </div>
          </div>

          {/* Words */}
          <div style={{ textAlign: 'center', padding: '0 40px' }}>
            <p style={{
              fontSize: 20, fontWeight: 700, color: '#2C1A0E',
              fontFamily: 'Georgia, serif', marginBottom: 10,
              lineHeight: 1.3,
            }}>
              dissolving back into the soup.
            </p>
            <p style={{
              fontSize: 14, color: '#7A5C42', lineHeight: 1.7,
              fontStyle: 'italic',
            }}>
              what you carried is melting away.<br />
              it held its purpose.<br />
              now it returns to the warmth.
            </p>
          </div>

          {/* Progress drip bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #FFD166, #F4A12A, #D85A1A)',
            backgroundSize: '200% auto',
            animation: 'shimmerBtn 1.2s linear infinite',
          }} />
        </div>
      )}

      {/* DISSOLVED STATE */}
      {phase === 'dissolved' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'linear-gradient(160deg, #F0F9EC 0%, #E8F5E0 50%, #EAF3DE 100%)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          animation: 'dissolveIn 0.8s ease both',
        }}>
          <div style={{
            fontSize: 64, marginBottom: 24,
            animation: 'breathe 3s ease-in-out infinite',
          }}>
            🌿
          </div>
          <div style={{ textAlign: 'center', padding: '0 40px' }}>
            <p style={{
              fontSize: 22, fontWeight: 700, color: '#2C1A0E',
              fontFamily: 'Georgia, serif', marginBottom: 12,
              lineHeight: 1.3,
            }}>
              released.
            </p>
            <p style={{
              fontSize: 15, color: '#3B6D11', lineHeight: 1.8,
              fontStyle: 'italic',
            }}>
              those words have melted.<br />
              you are lighter now.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default MeltButton
