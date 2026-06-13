import React, { useEffect, useState } from 'react'

function VentSurface({ potRect, onComplete }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onComplete, 400)
    }, 1000)
    return () => clearTimeout(timer)
  }, [onComplete])

  if (!potRect) return null

  const x = potRect.left + potRect.width / 2
  const y = potRect.top + potRect.height * 0.35

  return (
    <>
      <style>{`
        @keyframes surface {
          0% { transform: translate(-50%, -50%) translateY(0) scale(0.3); opacity: 0; }
          30% { opacity: 1; transform: translate(-50%, -50%) translateY(-15px) scale(1.05); }
          60% { transform: translate(-50%, -50%) translateY(-25px) scale(1); }
          100% { opacity: 1; transform: translate(-50%, -50%) translateY(-30px) scale(1); }
        }
        @keyframes surfaceOut {
          0% { opacity: 1; transform: translate(-50%, -50%) translateY(-30px) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) translateY(-50px) scale(0.7); }
        }
        @keyframes bubbleUp {
          0% { transform: translate(-50%, -50%) translateY(0) scale(0.4); opacity: 0; }
          20% { opacity: 0.9; }
          100% { transform: translate(-50%, -50%) translateY(-40px) scale(1.2); opacity: 0; }
        }
      `}</style>

      {/* small bubbles rising before the vent appears */}
      {[-15, 0, 18].map((dx, i) => (
        <div key={i} style={{
          position: 'fixed', left: x + dx, top: y, zIndex: 998,
          width: '10px', height: '10px', borderRadius: '50%',
          background: '#FFD89B',
          pointerEvents: 'none',
          animation: 'bubbleUp 0.5s ease-out forwards',
          animationDelay: `${i * 0.08}s`
        }} />
      ))}

      {/* the surfacing vent bubble */}
      <div style={{
        position: 'fixed',
        left: x, top: y,
        zIndex: 999,
        width: '14px', height: '14px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #FFE0B0 0%, #FFB347 100%)',
        boxShadow: '0 2px 8px rgba(255,140,66,0.4)',
        pointerEvents: 'none',
        animation: visible 
          ? 'surface 0.6s ease-out forwards' 
          : 'surfaceOut 0.4s ease-in forwards',
        animationFillMode: 'forwards'
      }} />
    </>
  )
}

export default VentSurface