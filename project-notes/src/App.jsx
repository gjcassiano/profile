import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

// Extrai a chave do path: /note/test → "test"
function getKey() {
  const parts = window.location.pathname.replace(/^\/note\/?/, '').split('/')
  return parts[0] || 'default'
}

async function loadNote(key) {
  try {
    const res = await fetch(`/api/note/${key}`)
    const data = await res.json()
    return data.value ?? ''
  } catch {
    return localStorage.getItem(`note:${key}`) || ''
  }
}

async function saveNote(key, value) {
  try {
    await fetch(`/api/note/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    })
  } catch {
    // fallback para localStorage se API não estiver disponível
    localStorage.setItem(`note:${key}`, value)
  }
}

function App() {
  const key = getKey()
  const [text, setText] = useState('')
  const [savedTime, setSavedTime] = useState('')
  const saveTimer = useRef(null)
  const toastTimer = useRef(null)

  // Carrega o conteúdo ao montar
  useEffect(() => {
    loadNote(key).then(setText)
  }, [key])

  const handleChange = useCallback((e) => {
    const val = e.target.value
    setText(val)

    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await saveNote(key, val)
      const now = new Date()
      const h = String(now.getHours()).padStart(2, '0')
      const m = String(now.getMinutes()).padStart(2, '0')
      const s = String(now.getSeconds()).padStart(2, '0')
      setSavedTime(`${h}h${m}m${s}s`)
      clearTimeout(toastTimer.current)
      toastTimer.current = setTimeout(() => setSavedTime(''), 1800)
    }, 800)
  }, [key])

  return (
    <>
      <div className="header">
        <h1>Notes / {key} - </h1>
      </div>
      <textarea
        value={text}
        onChange={handleChange}
        placeholder="..."
        autoFocus
      />
      <div className={`toast ${savedTime ? 'show' : ''}`}>Saved {savedTime}</div>
    </>
  )
}

export default App
