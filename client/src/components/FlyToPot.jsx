import React, { useEffect, useState } from 'react'

function FlyToPot({ text, startRect, potRect, onComplete }) {
  const [phase, setPhase] = useState('flying')

  useEffect(() => {
    const flyTimer = setTimeout(() => setPhase('splash'), 700)
    const doneTimer = setTimeout(() => onComplete(), 1500)
    return () => { clearTimeout(flyTimer); clearTimeout(doneTimer) }
  }, [onComplete])

  if (!startRect || !potRect) return null

  const startX = startRect.left + startRect.width / 2
  const startY = startRect.top + startRect.height / 2
  const endX = potRect.left + potRect.width / 2
  const endY = potRect.top + potRect.height * 0.35

  // generate random burst bubbles
  const burstBubbles = [
    { dx: -45, dy: -35, size: 14, delay: 0 },
    { dx: 40, dy: -40, size: 18, delay: 0.05 },
    { dx: -20, dy: -55, size: 10, delay: 0.1 },
    { dx: 30, dy: -20, size: 12, delay: 0.08 },
    { dx: -50, dy: -10, size: 16, delay: 0.15 },
    { dx: 55, dy: -15, size: 11, delay: 0.12 },
    { dx: 0, dy: -60, size: 13, delay: 0.18 },
    { dx: -10, dy: -25, size: 9, delay: 0.2 },
  ]

  return (
    <>
      <style>{`
        @keyframes flyToPot {
          0% {
            left: ${startX}px; top: ${startY}px;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
          70% { opacity: 1; }
          100% {
            left: ${endX}px; top: ${endY}px;
            transform: translate(-50%, -50%) scale(0.15) rotate(360deg);
            opacity: 0.3;
          }
        }
        @keyframes ringRipple {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.9; border-width: 4px; }
          100% { transform: translate(-50%, -50%) scale(3); opacity: 0; border-width: 1px; }
        }
        @keyframes ringRipple2 {
          0% { transform: translate(-50%, -50%) scale(0.1); opacity: 0.7; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        @keyframes burstBubble {
          0% { transform: translate(-50%, -50%) translate(0, 0) scale(0.3); opacity: 0; }
          25% { opacity: 1; transform: translate(-50%, -50%) translate(0, 0) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.4); }
        }
        @keyframes flashGlow {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          30% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.8); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(2.5); }
        }
      `}</style>

      {phase === 'flying' && (
        <div style={{
          position: 'fixed',
          zIndex: 1000,
          maxWidth: '220px',
          padding: '10px 14px',
          background: '#FFFCF8',
          border: '0.5px solid #E8DDD0',
          borderRadius: '12px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          fontSize: '12px',
          color: '#3D2B1A',
          lineHeight: '1.4',
          pointerEvents: 'none',
          animation: 'flyToPot 0.7s cubic-bezier(0.55, 0, 0.85, 0.45) forwards'
        }}>
          "{text.length > 60 ? text.slice(0, 60) + '...' : text}"
        </div>
      )}

      {phase === 'splash' && (
        <>
          {/* warm flash glow on impact */}
          <div style={{
            position: 'fixed', left: endX, top: endY, zIndex: 998,
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,179,71,0.6) 0%, rgba(255,179,71,0) 70%)',
            pointerEvents: 'none',
            animation: 'flashGlow 0.6s ease-out forwards'
          }} />

          {/* expanding ripple rings */}
          <div style={{
            position: 'fixed', left: endX, top: endY, zIndex: 999,
            width: '50px', height: '50px', borderRadius: '50%',
            border: '3px solid #FFB347',
            pointerEvents: 'none',
            animation: 'ringRipple 0.6s ease-out forwards'
          }} />
          <div style={{
            position: 'fixed', left: endX, top: endY, zIndex: 999,
            width: '40px', height: '40px', borderRadius: '50%',
            border: '2px solid #FFD89B',
            pointerEvents: 'none',
            animation: 'ringRipple2 0.7s ease-out forwards',
            animationDelay: '0.1s'
          }} />

          {/* bursting bubbles flying outward */}
          {burstBubbles.map((b, i) => (
            <div key={i} style={{
              position: 'fixed',
              left: endX, top: endY,
              zIndex: 1000,
              width: `${b.size}px`, height: `${b.size}px`,
              borderRadius: '50%',
              background: i % 2 === 0 ? '#FFD89B' : '#FFB347',
              pointerEvents: 'none',
              '--dx': `${b.dx}px`,
              '--dy': `${b.dy}px`,
              animation: `burstBubble 0.6s ease-out forwards`,
              animationDelay: `${b.delay}s`
            }} />
          ))}
        </>
      )}
    </>
  )
}

export default FlyToPot