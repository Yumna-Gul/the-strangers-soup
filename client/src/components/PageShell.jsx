import React, { useEffect, useState } from 'react'
import { T } from '../theme'

// Global keyframes injected once
const GLOBAL_STYLES = `
  @keyframes pageFadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0%   { transform: scale(0.88); opacity: 0; }
    60%  { transform: scale(1.06); opacity: 1; }
    100% { transform: scale(1);    opacity: 1; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  * { box-sizing: border-box; }
`

let stylesInjected = false
function injectGlobalStyles() {
  if (stylesInjected) return
  const el = document.createElement('style')
  el.textContent = GLOBAL_STYLES
  document.head.appendChild(el)
  stylesInjected = true
}

// Animated page wrapper
export function PageShell({ children }) {
  useEffect(() => { injectGlobalStyles() }, [])
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(160deg, #FDF6EE 0%, #FFF3E0 40%, #FDE8CC 100%)`,
      animation: 'pageFadeUp 0.4s ease both',
    }}>
      {children}
    </div>
  )
}

// Top header bar
export function Header({ veggieName, leftAction, rightAction }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', padding: '14px 20px',
      borderBottom: `1px solid ${T.border}`,
      background: 'rgba(253,246,238,0.85)',
      backdropFilter: 'blur(8px)',
      position: 'sticky', top: 0, zIndex: 50,
    }}>
      {/* left */}
      <div style={{ minWidth: 64 }}>
        {leftAction && (
          <button onClick={leftAction.onClick} style={navBtnStyle}>
            {leftAction.label}
          </button>
        )}
      </div>

      {/* center wordmark */}
      <span style={{
        fontSize: '17px', fontWeight: '600',
        color: T.ink, letterSpacing: '-0.3px',
        fontFamily: T.fontSerif,
      }}>
        the stranger's soup
      </span>

      {/* right */}
      <div style={{ minWidth: 64, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        {rightAction && (
          <button onClick={rightAction.onClick} style={navBtnStyle}>
            {rightAction.label}
          </button>
        )}
        <VeggieBadge name={veggieName} />
      </div>
    </div>
  )
}

export function VeggieBadge({ name }) {
  return (
    <span style={{
      fontSize: '11px', fontWeight: '500',
      background: T.greenBg, color: T.green,
      padding: '4px 10px', borderRadius: '20px',
      border: `1px solid #C0DD97`,
      letterSpacing: '0.2px',
    }}>
      {name}
    </span>
  )
}

const navBtnStyle = {
  background: 'none', border: 'none',
  color: T.inkMid, fontSize: '13px',
  cursor: 'pointer', padding: '4px 0',
  fontFamily: T.fontSans,
  transition: 'color 0.15s',
}

// Pill button — for flavor tags
export function FlavorPill({ flavor, selected, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 16px',
        borderRadius: '20px',
        border: `1.5px solid ${selected ? flavor.color : hovered ? flavor.color : flavor.border}`,
        background: selected
          ? `linear-gradient(135deg, ${flavor.color}, ${flavor.border})`
          : hovered ? flavor.bg + 'dd' : flavor.bg,
        color: selected ? '#FDF8F2' : flavor.color,
        fontSize: '13px',
        fontWeight: selected ? '600' : '400',
        transition: 'all 0.18s cubic-bezier(0.34,1.56,0.64,1)',
        transform: selected ? 'scale(1.08)' : hovered ? 'scale(1.04)' : 'scale(1)',
        cursor: 'pointer',
        animation: selected ? 'popIn 0.25s ease' : 'none',
        boxShadow: selected ? `0 2px 12px ${flavor.color}44` : 'none',
        fontFamily: T.fontSans,
      }}
    >
      {flavor.name}
    </button>
  )
}

// Primary CTA button
export function SoupButton({ onClick, disabled, loading, children, variant = 'amber', fullWidth = true }) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const variants = {
    amber: { bg: '#C07810', hoverBg: '#A86408', color: '#FFF8EC', shadow: '#C0781044' },
    green: { bg: '#3B6D11', hoverBg: '#2D5509', color: '#EAF3DE', shadow: '#3B6D1144' },
    ghost: { bg: 'transparent', hoverBg: T.bgSurface, color: T.inkMid, shadow: 'transparent' },
  }
  const v = variants[variant]

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        width: fullWidth ? '100%' : 'auto',
        padding: '12px 20px',
        background: disabled ? '#E8DDD0' : hovered ? v.hoverBg : v.bg,
        border: 'none', borderRadius: '10px',
        color: disabled ? '#B4A090' : v.color,
        fontSize: '15px', fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        transform: pressed && !disabled ? 'scale(0.97)' : 'scale(1)',
        boxShadow: disabled || !hovered ? 'none' : `0 4px 16px ${v.shadow}`,
        letterSpacing: '0.1px',
        fontFamily: T.fontSans,
      }}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <LoadingDots /> {children}
        </span>
      ) : children}
    </button>
  )
}

function LoadingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3 }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'currentColor', display: 'inline-block',
          animation: `bounce 1.1s ease-in-out ${i * 0.18}s infinite`,
        }} />
      ))}
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </span>
  )
}

// Card container
export function SoupCard({ children, flavor, style = {} }) {
  const bg = flavor ? flavor.bg : T.bgCard
  const border = flavor ? `${flavor.color}30` : T.border
  return (
    <div style={{
      background: bg,
      borderRadius: '16px',
      border: `1px solid ${border}`,
      padding: '18px',
      ...style,
    }}>
      {children}
    </div>
  )
}

// Staggered list reveal
export function StaggerItem({ index, children }) {
  return (
    <div style={{
      animation: `pageFadeUp 0.35s ease both`,
      animationDelay: `${index * 80}ms`,
    }}>
      {children}
    </div>
  )
}

// Skeleton loader
export function SkeletonLine({ width = '100%', height = 14, style = {} }) {
  return (
    <div style={{
      width, height: height + 2,
      borderRadius: 6,
      background: 'linear-gradient(90deg, #F0E4D0 25%, #FAF0E0 50%, #F0E4D0 75%)',
      backgroundSize: '200% auto',
      animation: 'shimmer 1.6s linear infinite',
      ...style,
    }} />
  )
}

export function SafetyBanner({ message, helpline, variant = 'danger' }) {
  const styles = {
    danger: { bg: T.dangerBg, border: T.dangerBorder, color: T.danger },
    warning: { bg: '#FFF0E0', border: '#EF9F27', color: '#854F0B' },
  }
  const s = styles[variant]
  return (
    <div style={{
      background: s.bg, borderRadius: '12px',
      padding: '16px', marginBottom: '12px',
      border: `1px solid ${s.border}`,
      animation: 'pageFadeUp 0.3s ease both',
    }}>
      <p style={{ fontSize: '14px', color: s.color, marginBottom: helpline ? '8px' : 0, lineHeight: '1.5' }}>
        {message}
      </p>
      {helpline && (
        <p style={{ fontSize: '13px', fontWeight: '600', color: s.color }}>
          {helpline}
        </p>
      )}
    </div>
  )
}
