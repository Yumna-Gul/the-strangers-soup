import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Vent from './pages/Vent'
import MyResponses from './pages/MyResponses'
import { getSession } from './utils/session'
import API_BASE from './config'

function AppContent() {
  const { sessionId, veggieName } = getSession()
  const navigate = useNavigate()
  const [flavor, setFlavor] = useState(() => {
    return localStorage.getItem('flavor') || ''
  })
  const [country, setCountry] = useState('US')

 useEffect(() => {
  const cached = localStorage.getItem('country')
  if (cached) {
    setCountry(cached)
    return
  }
  fetch(`${API_BASE}/api/country`)
    .then(res => res.json())
    .then(data => {
      setCountry(data.country || 'US')
      localStorage.setItem('country', data.country || 'US')
    })
    .catch(() => setCountry('US'))
}, [])

  const handleSetFlavor = (f) => {
    setFlavor(f)
    localStorage.setItem('flavor', f)
  }

  return (
    <Routes>
      <Route path="/" element={
        <Landing
          veggieName={veggieName}
          flavor={flavor}
          setFlavor={handleSetFlavor}
          goTo={(page) => navigate('/' + page)}
        />}
      />
      <Route path="/vent" element={
        <Vent
          veggieName={veggieName}
          sessionId={sessionId}
          flavor={flavor}
          country={country}
          goTo={(page) => navigate('/' + page)}
        />}
      />
      <Route path="/myresponses" element={
        <MyResponses
          veggieName={veggieName}
          sessionId={sessionId}
          goTo={(page) => navigate('/' + page)}
        />}
      />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App