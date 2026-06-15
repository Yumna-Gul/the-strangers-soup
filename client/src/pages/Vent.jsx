import React, { useState, useRef } from 'react'
import FlyToPot from '../components/FlyToPot'
import Pot from '../components/Pot'
import VentSurface from '../components/VentSurface'
import { PageShell, Header, SoupButton, SoupCard, SafetyBanner } from '../components/PageShell'
import { FLAVOR_MAP } from '../theme'
import axios from 'axios'
import API_BASE from '../config'
function Vent({ veggieName, sessionId, flavor, country, goTo }) {
  const [text, setText] = useState('')
  const [ventSubmitted, setVentSubmitted] = useState(false)
  const [confession, setConfession] = useState(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [responseSent, setResponseSent] = useState(false)
  const [status, setStatus] = useState('')
  const [helpline, setHelpline] = useState('')
  const [safetyMessage, setSafetyMessage] = useState('')
  const [kindnessWarning, setKindnessWarning] = useState('')
  const [flyingVent, setFlyingVent] = useState(null)
  const [stirring, setStirring] = useState(false)
  const [showSurface, setShowSurface] = useState(false)
  const [charFocused, setCharFocused] = useState(false)

  const textareaRef = useRef(null)
  const potRef = useRef(null)

  const flavorStyle = FLAVOR_MAP[flavor] || FLAVOR_MAP['Lost']
  const charLeft = 280 - text.length
  const charColor = charLeft < 40 ? '#D85A30' : charLeft < 80 ? '#C07810' : '#B4926F'

  const submitVent = async () => {
    if (!text.trim()) return
    const startRect = textareaRef.current?.getBoundingClientRect()
    const potRect = potRef.current?.getBoundingClientRect()
    if (startRect && potRect) setFlyingVent({ text, startRect, potRect })
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/api/confessions`, {
        veggieName, flavor, text, sessionId, country
      })
      if (res.data.status === 'dangerous') {
        setStatus('dangerous')
        setSafetyMessage(res.data.message)
        setHelpline(res.data.helpline)
        setFlyingVent(null)
      } else if (res.data.status === 'disturbing') {
        setStatus('disturbing')
        setSafetyMessage(res.data.message)
        setHelpline(res.data.helpline)
        setVentSubmitted(true)
      } else {
        setVentSubmitted(true)
      }
    } catch (err) {
      console.error(err)
      setFlyingVent(null)
    } finally {
      setLoading(false)
    }
  }

  const stirPot = async () => {
    setStirring(true)
    try {
      const res = await axios.get(`${API_BASE}/api/confessions/random`, {
        params: { sessionId }
      })
      setTimeout(() => setShowSurface(true), 1000)
      setTimeout(() => {
        setStirring(false)
        setConfession(res.data)
      }, 1600)
    } catch (err) {
      console.error(err)
      setStirring(false)
      alert('The pot is empty right now. Check back soon.')
    }
  }

  const submitResponse = async () => {
    if (!response.trim()) return
    setLoading(true)
    try {
      const res = await axios.post(`${API_BASE}/api/responses`, {
        confessionId: confession._id,
        sessionId,
        text: response
      })
      if (res.data.status === 'unkind') {
        setStatus('unkind')
        setKindnessWarning(res.data.message)
        setResponse(res.data.suggestion || '')
      } else {
        setResponseSent(true)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageShell>
      <Header
        veggieName={veggieName}
        leftAction={{ label: '← back', onClick: () => goTo('') }}
        rightAction={{ label: 'my responses →', onClick: () => goTo('myresponses') }}
      />

      <div style={{ padding: '20px 20px 0' }}>
        {/* Vent card */}
        <SoupCard flavor={flavorStyle} style={{ marginBottom: '4px' }}>
          {/* Flavor label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '12px' }}>
            <span style={{
              fontSize: '11px', fontWeight: '700',
              color: flavorStyle.color,
              textTransform: 'uppercase', letterSpacing: '0.8px',
            }}>
              {flavor}
            </span>
            <div style={{
              flex: 1, height: '1px',
              background: `linear-gradient(to right, ${flavorStyle.color}40, transparent)`,
            }} />
          </div>

          {/* Safety banner — dangerous (blocks submit) */}
          {status === 'dangerous' && (
            <SafetyBanner message={safetyMessage} helpline={helpline} variant="danger" />
          )}

          {!ventSubmitted ? (
            <>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={e => setText(e.target.value.slice(0, 280))}
                onFocus={() => setCharFocused(true)}
                onBlur={() => setCharFocused(false)}
                placeholder="what's weighing on you? this is a safe pot..."
                style={{
                  width: '100%', height: '108px',
                  border: `1.5px solid ${charFocused ? flavorStyle.color : flavorStyle.color + '50'}`,
                  borderRadius: '10px', padding: '12px',
                  fontSize: '15px', lineHeight: '1.65',
                  background: '#FFFCF8', color: '#2C1A0E',
                  resize: 'none', fontFamily: 'Georgia, serif',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease',
                  outline: 'none',
                }}
              />
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginTop: '6px', marginBottom: '12px',
              }}>
                <span style={{ fontSize: '11px', color: '#B4926F' }}>
                  speak freely · anonymous
                </span>
                <span style={{
                  fontSize: '12px', fontWeight: '500',
                  color: charColor,
                  transition: 'color 0.2s',
                }}>
                  {charLeft}
                </span>
              </div>
              <SoupButton
                onClick={submitVent}
                disabled={!text.trim()}
                loading={loading}
                variant="amber"
              >
                {loading ? 'mixing' : 'mix into the pot'}
              </SoupButton>
            </>
          ) : (
            <div style={{
              textAlign: 'center', padding: '10px 0',
              animation: 'pageFadeUp 0.4s ease both',
            }}>
              <p style={{
                fontSize: '15px', color: flavorStyle.color,
                fontFamily: 'Georgia, serif', lineHeight: '1.6',
              }}>
                your words are in the pot.
                <br />
                <span style={{ fontSize: '13px', color: '#B4926F' }}>
                  strangers will hold them.
                </span>
              </p>
            </div>
          )}

          {/* Disturbing warning — shown after submit */}
          {status === 'disturbing' && helpline && (
            <SafetyBanner message={safetyMessage} helpline={helpline} variant="warning" style={{ marginTop: 12 }} />
          )}
        </SoupCard>

        {/* Pot */}
        <div ref={potRef} style={{ padding: '6px 0 16px' }}>
          <Pot size={220} stirring={stirring} />
        </div>

        {/* Stir section */}
        {ventSubmitted && (
          <div style={{
            background: '#F5EAD8',
            borderRadius: '16px',
            padding: '18px',
            border: '1px solid #E4D0BC',
            marginBottom: '32px',
            animation: 'pageFadeUp 0.5s ease both',
          }}>
            <p style={{
              fontSize: '13px', fontWeight: '600',
              color: '#7A4A06', marginBottom: '14px',
              textTransform: 'uppercase', letterSpacing: '0.6px',
            }}>
              stir the pot · read a stranger's vent
            </p>

            {!confession ? (
              <SoupButton onClick={stirPot} variant="amber">
                stir the pot
              </SoupButton>
            ) : (
              <div style={{ animation: 'pageFadeUp 0.4s ease both' }}>
                {/* Stranger's confession */}
                <div style={{
                  background: '#FFFCF7', borderRadius: '12px',
                  padding: '14px', marginBottom: '12px',
                  border: '1px solid #E4D0BC',
                }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '11px', background: '#EAF3DE',
                      color: '#3B6D11', padding: '3px 10px',
                      borderRadius: '20px', fontWeight: '500',
                    }}>
                      {confession.veggieName}
                    </span>
                    {confession.flavor && (
                      <span style={{
                        fontSize: '11px',
                        color: FLAVOR_MAP[confession.flavor]?.color || '#5F5E5A',
                        fontWeight: '500',
                      }}>
                        {confession.flavor}
                      </span>
                    )}
                  </div>
                  <p style={{
                    fontSize: '15px', color: '#2C1A0E',
                    lineHeight: '1.65', fontFamily: 'Georgia, serif',
                  }}>
                    "{confession.text}"
                  </p>
                </div>

                {/* Response area */}
                {!responseSent ? (
                  <>
                    {kindnessWarning && (
                      <SafetyBanner message={kindnessWarning} variant="warning" />
                    )}
                    <textarea
                      value={response}
                      onChange={e => setResponse(e.target.value)}
                      placeholder="write something warm..."
                      style={{
                        width: '100%', height: '88px',
                        border: '1.5px solid #C9A87C',
                        borderRadius: '10px', padding: '12px',
                        fontSize: '15px', background: '#FFFCF7',
                        color: '#2C1A0E', resize: 'none',
                        fontFamily: 'Georgia, serif', boxSizing: 'border-box',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        marginBottom: '10px',
                      }}
                      onFocus={e => e.target.style.borderColor = '#3B6D11'}
                      onBlur={e => e.target.style.borderColor = '#C9A87C'}
                    />
                    <SoupButton
                      onClick={submitResponse}
                      disabled={!response.trim()}
                      loading={loading}
                      variant="green"
                    >
                      {loading ? 'sending' : 'send warmth →'}
                    </SoupButton>
                  </>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    animation: 'pageFadeUp 0.4s ease both',
                  }}>
                    {/* Confetti burst */}
                    <ConfettiBurst />
                    <p style={{
                      fontSize: '16px', color: '#3B6D11',
                      marginBottom: '16px', fontFamily: 'Georgia, serif',
                    }}>
                      your warmth is in the pot. 🌿
                    </p>
                    <button
                      onClick={() => goTo('myresponses')}
                      style={{
                        background: 'none', border: 'none',
                        color: '#C07810', fontSize: '14px',
                        fontWeight: '600', cursor: 'pointer',
                      }}
                    >
                      see responses to your vent →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {flyingVent && (
        <FlyToPot
          text={flyingVent.text}
          startRect={flyingVent.startRect}
          potRect={flyingVent.potRect}
          onComplete={() => setFlyingVent(null)}
        />
      )}
      {showSurface && (
        <VentSurface
          potRect={potRef.current?.getBoundingClientRect()}
          onComplete={() => setShowSurface(false)}
        />
      )}
    </PageShell>
  )
}

// Mini confetti component
function ConfettiBurst() {
  const pieces = ['🌿', '✨', '🍃', '💛', '🌱']
  return (
    <div style={{ position: 'relative', height: 50, overflow: 'hidden', marginBottom: 8 }}>
      <style>{`
        @keyframes confettiFly {
          0%   { transform: translateY(0) rotate(0deg) scale(0.5); opacity: 1; }
          100% { transform: translateY(-44px) rotate(360deg) scale(1); opacity: 0; }
        }
      `}</style>
      {pieces.map((p, i) => (
        <span key={i} style={{
          position: 'absolute',
          left: `${15 + i * 16}%`,
          top: '40%',
          fontSize: '18px',
          animation: `confettiFly 0.7s ease-out both`,
          animationDelay: `${i * 70}ms`,
        }}>
          {p}
        </span>
      ))}
    </div>
  )
}

export default Vent
