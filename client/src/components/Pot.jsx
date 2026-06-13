import React from 'react'

function Pot({ size = 200, stirring = false }) {
  return (
    <div style={{ position: 'relative', width: size, height: size * 1.3, margin: '0 auto' }}>
      <style>{`
        @keyframes stirFast {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes flicker {
          0%,100% { transform: scaleY(1) scaleX(1) rotate(-2deg); opacity: 1; }
          25%  { transform: scaleY(1.18) scaleX(0.88) rotate(2deg); opacity: 0.9; }
          50%  { transform: scaleY(0.88) scaleX(1.12) rotate(-3deg); opacity: 1; }
          75%  { transform: scaleY(1.12) scaleX(0.93) rotate(3deg); opacity: 0.85; }
        }
        @keyframes flickerSmall {
          0%,100% { transform: scaleY(1) rotate(3deg); }
          50%  { transform: scaleY(1.25) rotate(-4deg); }
        }
        @keyframes bubble1 {
          0%   { transform: translateY(0) scale(0.5); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(-24px) scale(1.2); opacity: 0; }
        }
        @keyframes bubble2 {
          0%   { transform: translateY(0) scale(0.4); opacity: 0; }
          30%  { opacity: 0.9; }
          100% { transform: translateY(-20px) scale(1.1); opacity: 0; }
        }
        @keyframes steam {
          0%   { transform: translateY(0) translateX(0) scale(0.5); opacity: 0; }
          15%  { opacity: 0.55; }
          50%  { opacity: 0.38; }
          100% { transform: translateY(-75px) translateX(18px) scale(1.7); opacity: 0; }
        }
        @keyframes steamLeft {
          0%   { transform: translateY(0) translateX(0) scale(0.4); opacity: 0; }
          15%  { opacity: 0.5; }
          100% { transform: translateY(-70px) translateX(-20px) scale(1.6); opacity: 0; }
        }
        @keyframes bob {
          0%,100% { transform: translateY(0px) rotate(-3deg); }
          50%     { transform: translateY(-5px) rotate(3deg); }
        }
        @keyframes glow {
          0%,100% { opacity: 0.45; }
          50%     { opacity: 0.85; }
        }
      `}</style>

      {/* Steam */}
      <div style={{ position: 'absolute', top: size * 0.05, left: '50%', width: 0, height: 0, zIndex: 3 }}>
        {[
          { w: 34, l: -50, anim: 'steamLeft', dur: '3.2s', delay: '0s'   },
          { w: 42, l: -12, anim: 'steam',     dur: '3.6s', delay: '0.8s' },
          { w: 28, l:  22, anim: 'steamLeft', dur: '3s',   delay: '1.6s' },
          { w: 36, l: -30, anim: 'steam',     dur: '3.8s', delay: '2.4s' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s.w, height: s.w, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,250,240,0.92) 0%, rgba(255,250,240,0) 70%)',
            left: s.l,
            animation: `${s.anim} ${s.dur} ease-out infinite`,
            animationDelay: s.delay,
          }} />
        ))}
      </div>

      {/* Floating veggies */}
      {[
        { top: 0.32, left: 0.22, emoji: '🥕', dur: '2.6s', delay: '0s'   },
        { top: 0.30, left: 0.52, emoji: '🥬', dur: '3.1s', delay: '0.5s' },
        { top: 0.33, left: 0.68, emoji: '🧅', dur: '2.8s', delay: '1s'   },
      ].map((v, i) => (
        <div key={i} style={{
          position: 'absolute', top: size * v.top, left: size * v.left,
          fontSize: size * 0.12, zIndex: 2,
          animation: `bob ${v.dur} ease-in-out infinite`,
          animationDelay: v.delay,
        }}>
          {v.emoji}
        </div>
      ))}

      {/* SVG pot */}
      <svg width={size} height={size * 1.15} viewBox="0 0 200 230"
        style={{ position: 'relative', zIndex: 1 }}>
        <defs>
          {/* Richer, more saturated soup gradient */}
          <radialGradient id="soupGradient" cx="40%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#FFD166" />
            <stop offset="35%"  stopColor="#F4A12A" />
            <stop offset="70%"  stopColor="#D85A1A" />
            <stop offset="100%" stopColor="#9C3212" />
          </radialGradient>
          {/* Pot body gradient — deep, rich */}
          <linearGradient id="potGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#6A5040" />
            <stop offset="50%"  stopColor="#3E2D20" />
            <stop offset="100%" stopColor="#251810" />
          </linearGradient>
          <linearGradient id="potRim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#A08A70" />
            <stop offset="100%" stopColor="#5A4030" />
          </linearGradient>
          {/* Sheen on soup surface */}
          <radialGradient id="soupSheen" cx="35%" cy="30%" r="40%">
            <stop offset="0%"   stopColor="rgba(255,240,180,0.5)" />
            <stop offset="100%" stopColor="rgba(255,240,180,0)" />
          </radialGradient>
        </defs>

        {/* Drop shadow */}
        <ellipse cx="100" cy="157" rx="76" ry="13" fill="#000" opacity="0.10" />

        {/* Pot body */}
        <path d="M28 75 Q22 152 100 164 Q178 152 172 75 Z" fill="url(#potGradient)" />

        {/* Soup surface */}
        <ellipse cx="100" cy="75" rx="72" ry="16" fill="url(#soupGradient)" />
        {/* Sheen overlay */}
        <ellipse cx="100" cy="72" rx="72" ry="16" fill="url(#soupSheen)" />

        {/* Animated bubbles */}
        {[
          { cx: 76,  cy: 73, r: 3.5, fill: '#FFE866', anim: 'bubble1', dur: '1.8s', delay: '0s'   },
          { cx: 100, cy: 70, r: 4.5, fill: '#FFD046', anim: 'bubble2', dur: '2.2s', delay: '0.4s' },
          { cx: 122, cy: 74, r: 3,   fill: '#FFE866', anim: 'bubble1', dur: '2s',   delay: '0.8s' },
          { cx: 88,  cy: 76, r: 2.5, fill: '#FFD046', anim: 'bubble2', dur: '1.6s', delay: '1.2s' },
          { cx: 113, cy: 72, r: 3,   fill: '#FFE866', anim: 'bubble1', dur: '2.4s', delay: '0.2s' },
        ].map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill}
            style={{ animation: `${b.anim} ${b.dur} ease-in infinite`, animationDelay: b.delay }}
          />
        ))}

        {/* Rim */}
        <ellipse cx="100" cy="75" rx="78" ry="13" fill="none" stroke="url(#potRim)" strokeWidth="7" />

        {/* Spoon */}
        <g style={{
          transformOrigin: '100px 75px',
          animation: stirring ? 'stirFast 1s linear infinite' : 'bob 3.5s ease-in-out infinite',
        }}>
          <rect x="120" y="20" width="6" height="65" rx="3" fill="#C8B89A" transform="rotate(15 123 50)" />
          <ellipse cx="138" cy="35" rx="11" ry="16" fill="#D4C4B0" transform="rotate(15 138 35)" />
          <ellipse cx="138" cy="35" rx="7"  ry="11" fill="#B8A882" transform="rotate(15 138 35)" />
        </g>

        {/* Handles */}
        <rect x="10"  y="80" width="14" height="32" rx="7" fill="#7A6050" />
        <rect x="176" y="80" width="14" height="32" rx="7" fill="#7A6050" />

        {/* Legs */}
        <rect x="42"  y="158" width="10" height="14" rx="2" fill="#3A2E20" />
        <rect x="148" y="158" width="10" height="14" rx="2" fill="#3A2E20" />

        {/* Glow under pot */}
        <ellipse cx="100" cy="178" rx="56" ry="11" fill="#FF7A20" opacity="0.38"
          style={{ animation: 'glow 1.5s ease-in-out infinite' }} />

        {/* Logs */}
        <rect x="55"  y="186" width="48" height="9" rx="4" fill="#7A4A22" transform="rotate(-6 80 190)" />
        <rect x="100" y="186" width="48" height="9" rx="4" fill="#8A5A2E" transform="rotate(6 125 190)" />

        {/* Main fire */}
        <path d="M82 188 Q78 168 92 158 Q88 175 100 168 Q98 182 110 172 Q112 188 96 192 Q88 192 82 188Z"
          fill="#FF5E1A"
          style={{ transformOrigin: '95px 188px', animation: 'flicker 1.1s ease-in-out infinite' }}
        />
        <path d="M88 188 Q86 174 96 166 Q93 178 102 174 Q102 186 92 190Z"
          fill="#FFD01A"
          style={{ transformOrigin: '95px 188px', animation: 'flicker 0.8s ease-in-out infinite reverse' }}
        />
        {/* Inner hot white core */}
        <path d="M91 185 Q90 176 97 170 Q95 180 101 177 Q101 185 94 187Z"
          fill="#FFF8B0" opacity="0.7"
          style={{ transformOrigin: '95px 180px', animation: 'flicker 0.6s ease-in-out infinite' }}
        />

        {/* Side flames */}
        <path d="M115 192 Q112 178 122 172 Q120 184 128 180 Q130 192 120 195Z"
          fill="#FF8C2A"
          style={{ transformOrigin: '120px 192px', animation: 'flickerSmall 0.9s ease-in-out infinite' }}
        />
        <path d="M68 192 Q66 180 75 175 Q73 186 80 183 Q82 195 72 196Z"
          fill="#FF5E1A"
          style={{ transformOrigin: '72px 192px', animation: 'flickerSmall 1.2s ease-in-out infinite reverse' }}
        />
      </svg>
    </div>
  )
}

export default Pot
