import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { PageShell, Header, SoupCard, StaggerItem, SkeletonLine } from '../components/PageShell'
import { FLAVOR_MAP, FLAVORS } from '../theme'
import MeltButton from '../components/MeltButton'

function MyResponses({ veggieName, sessionId, goTo }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [meltedId, setMeltedId] = useState(null)

  useEffect(() => { fetchMyResponses() }, [])

  const fetchMyResponses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/responses/my/${sessionId}`)
      setItems(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleMelt = async (confessionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/responses/my/${confessionId}`)
      setMeltedId(confessionId)
      setTimeout(() => {
        setItems(prev => prev.filter(item => item.confession._id !== confessionId))
        setMeltedId(null)
      }, 700)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <PageShell>
      <Header
        veggieName={veggieName}
        leftAction={{ label: '← back', onClick: () => goTo('vent') }}
      />

      <div style={{ padding: '20px' }}>

        {/* Page title */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '20px', fontWeight: '600', color: '#2C1A0E',
            fontFamily: 'Georgia, serif', margin: 0, marginBottom: 4,
          }}>
            your vents
          </h2>
          <p style={{ fontSize: '13px', color: '#B4926F', margin: 0 }}>
            strangers who held your words
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          items.map(({ confession, responses }, idx) => {
            const style = FLAVOR_MAP[confession.flavor] || FLAVOR_MAP['Lost']
            const isMelting = meltedId === confession._id

            return (
              <StaggerItem key={confession._id} index={idx}>
                <div style={{
                  marginBottom: '24px',
                  opacity: isMelting ? 0 : 1,
                  transform: isMelting ? 'scale(0.95) translateY(8px)' : 'scale(1)',
                  transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                }}>
                  {/* The vent itself */}
                  <SoupCard flavor={style} style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{
                        fontSize: '10px', fontWeight: '700',
                        color: style.color, textTransform: 'uppercase',
                        letterSpacing: '0.8px',
                      }}>
                        your vent · {confession.flavor}
                      </span>
                      <div style={{
                        flex: 1, height: '1px',
                        background: `linear-gradient(to right, ${style.color}40, transparent)`,
                      }} />
                    </div>
                    <p style={{
                      fontSize: '15px', color: '#2C1A0E',
                      lineHeight: '1.65', fontFamily: 'Georgia, serif',
                      margin: 0,
                    }}>
                      "{confession.text}"
                    </p>
                  </SoupCard>

                  {/* Responses */}
                  {responses.length > 0 && (
                    <div style={{ paddingLeft: 4 }}>
                      <p style={{
                        fontSize: '12px', color: '#B4926F',
                        marginBottom: '8px', fontWeight: '500',
                      }}>
                        {responses.length} stranger{responses.length !== 1 ? 's' : ''} held this with you
                      </p>
                      {responses.map((r, i) => {
                        const accentColor = FLAVORS[i % FLAVORS.length].color
                        return (
                          <div key={r._id} style={{
                            borderLeft: `3px solid ${accentColor}`,
                            padding: '10px 14px',
                            marginBottom: '8px',
                            background: '#FFFCF7',
                            borderRadius: '0 10px 10px 0',
                            animation: `pageFadeUp 0.35s ease both`,
                            animationDelay: `${(idx * 4 + i) * 60}ms`,
                          }}>
                            <p style={{
                              fontSize: '11px', color: '#B4926F',
                              marginBottom: '4px', fontWeight: '500',
                            }}>
                              a stranger
                            </p>
                            <p style={{
                              fontSize: '14px', color: '#2C1A0E',
                              lineHeight: '1.65', fontFamily: 'Georgia, serif',
                              margin: 0,
                            }}>
                              "{r.text}"
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Melt button — full 3-phase animation */}
                  {confession.removedFromPot && (
                    <MeltButton onMelt={() => handleMelt(confession._id)} />
                  )}

                  {/* Divider */}
                  {idx < items.length - 1 && (
                    <div style={{
                      height: '1px', marginTop: '20px',
                      background: 'linear-gradient(to right, transparent, #E4D0BC, transparent)',
                    }} />
                  )}
                </div>
              </StaggerItem>
            )
          })
        )}
      </div>
    </PageShell>
  )
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center', padding: '40px 20px',
      background: '#F5EAD8',
      borderRadius: '16px',
      border: '1px solid #E4D0BC',
      animation: 'pageFadeUp 0.4s ease both',
    }}>
      <div style={{ fontSize: '36px', marginBottom: '12px' }}>🍲</div>
      <p style={{
        fontSize: '15px', color: '#7A5C42',
        marginBottom: '6px', fontFamily: 'Georgia, serif',
      }}>
        still brewing...
      </p>
      <p style={{ fontSize: '13px', color: '#B4926F', lineHeight: '1.5' }}>
        strangers are reading your vents.<br />check back soon.
      </p>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div style={{ animation: 'pageFadeUp 0.3s ease both' }}>
      {[0, 1].map(i => (
        <div key={i} style={{ marginBottom: '24px' }}>
          <div style={{
            background: '#FFF3E0', borderRadius: '16px',
            padding: '18px', marginBottom: '10px',
            border: '1px solid #E4D0BC',
          }}>
            <SkeletonLine width="30%" height={10} style={{ marginBottom: 12 }} />
            <SkeletonLine width="90%" height={14} style={{ marginBottom: 6 }} />
            <SkeletonLine width="70%" height={14} />
          </div>
          <div style={{
            borderLeft: '3px solid #E4D0BC',
            padding: '12px 14px',
            background: '#FFFCF7', borderRadius: '0 10px 10px 0',
          }}>
            <SkeletonLine width="15%" height={10} style={{ marginBottom: 8 }} />
            <SkeletonLine width="85%" height={13} style={{ marginBottom: 4 }} />
            <SkeletonLine width="55%" height={13} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default MyResponses
