import { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'

// ── Room from URL path: /poker/my-room → "my-room" ───────────────────────────
function getRoom() {
  const parts = window.location.pathname.replace(/^\/poker\/?/, '').split('/')
  return parts[0] || 'default'
}

const VOTE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "?"]

// ── API helpers ───────────────────────────────────────────────────────────────
async function apiJoin(room, name, avatar) {
  await fetch(`/api/poker/${room}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, avatar }),
  })
}

async function apiUsers(room) {
  const res = await fetch(`/api/poker/${room}/users`)
  const data = await res.json()
  return data.users ?? []
}

async function apiVote(room, name, vote) {
  await fetch(`/api/poker/${room}/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, vote }),
  })
}

async function apiGetVotes(room) {
  const res = await fetch(`/api/poker/${room}/votes`)
  const data = await res.json()
  return data.votes ?? []
}

async function apiReset(room) {
  await fetch(`/api/poker/${room}/votes`, { method: 'DELETE' })
}

async function apiGetState(room) {
  const res = await fetch(`/api/poker/${room}/state`)
  return await res.json()
}

async function apiSetState(room, status) {
  await fetch(`/api/poker/${room}/state`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
}

// ── CardIcon SVG ──────────────────────────────────────────────────────────────
function CardIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="2" y="4" width="17" height="22" rx="3" fill="url(#cg1)" opacity="0.9" />
      <rect x="9" y="2" width="17" height="22" rx="3" fill="url(#cg2)" />
      <text x="17.5" y="17" textAnchor="middle" fontSize="9" fontWeight="800" fill="white">SP</text>
      <defs>
        <linearGradient id="cg1" x1="2" y1="4" x2="19" y2="26" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a78bfa" />
          <stop offset="1" stopColor="#7c6aff" />
        </linearGradient>
        <linearGradient id="cg2" x1="9" y1="2" x2="26" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c6aff" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

const AVATAR_ICONS = [
  "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🐛", "🦋", "🐌", "🐞", "🐜", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍", "🦧", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🐈", "🐓", "🦃", "🦚", "🦜", "🦢", "🦩", "🕊", "🐇", "🦝", "🦨", "🦡", "🦦", "🦥", "🐁", "🐀", "🐿", "🦔",
  "👽", "👻", "🤖", "🤡", "👹", "👺", "💀", "👾", "🎃", "💩", "🦄", "🧜‍♂️", "🧚‍♀️", "🧛‍♂️"
]

function UserAvatar({ iconName, name, size = 28 }) {
  if (iconName && AVATAR_ICONS.includes(iconName)) {
    return (
      <div className="avatar" style={{ width: size, height: size, background: 'rgba(255,255,255,0.1)', fontSize: `${size * 0.65}px` }}>
        {iconName}
      </div>
    )
  }
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: `${size * 0.3}px` }}>
      {getInitials(name)}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const room = getRoom()

  const [name, setName] = useState(() => localStorage.getItem('poker-name') || '')
  const [avatar, setAvatar] = useState(() => localStorage.getItem('poker-avatar') || '🐶')
  const [inputName, setInputName] = useState(() => localStorage.getItem('poker-name') || '')
  const [inputAvatar, setInputAvatar] = useState(() => localStorage.getItem('poker-avatar') || '🐶')
  const [joined, setJoined] = useState(() => !!localStorage.getItem('poker-name'))

  const [users, setUsers] = useState([])     // { name, lastSeen }
  const [votes, setVotes] = useState([])     // { name, vote }
  const [myVote, setMyVote] = useState(null)
  const [revealed, setRevealed] = useState(false)

  const heartbeatRef = useRef(null)
  const syncRef = useRef(null)
  const localResetAt = useRef(0)

  // ── Join handler ──────────────────────────────────────────────────────────
  const handleJoin = useCallback(async () => {
    const n = inputName.trim()
    if (!n) return
    setName(n)
    setAvatar(inputAvatar)
    localStorage.setItem('poker-name', n)
    localStorage.setItem('poker-avatar', inputAvatar)
    await apiJoin(room, n, inputAvatar)
    setJoined(true)
  }, [inputName, inputAvatar, room])

  // ── Sync loop (every 3s) ──────────────────────────────────────────────────
  const sync = useCallback(async (currentName, currentAvatar) => {
    if (!currentName) return
    try {
      await apiJoin(room, currentName, currentAvatar)       // heartbeat
      const [fetchedUsers, fetchedVotes, fetchedState] = await Promise.all([
        apiUsers(room),
        apiGetVotes(room),
        apiGetState(room),
      ])
      setUsers(fetchedUsers)
      setVotes(fetchedVotes)

      // Restaura o voto se o usuário deu refresh
      const myServerVote = fetchedVotes.find(v => v.name === currentName)?.vote
      if (myServerVote !== undefined) {
        setMyVote(prev => prev === null ? myServerVote : prev)
      }

      setRevealed(fetchedState.status === 'revealed')
      if (fetchedState.resetAt > localResetAt.current) {
        setMyVote(null)
        localResetAt.current = fetchedState.resetAt
      }
    } catch (e) {
      console.error('sync error', e)
    }
  }, [room])

  useEffect(() => {
    if (!joined) return
    sync(name, avatar)                               // immediate first sync
    syncRef.current = setInterval(() => sync(name, avatar), 1000)
    return () => clearInterval(syncRef.current)
  }, [joined, name, avatar, sync])

  // ── Vote handler ──────────────────────────────────────────────────────────
  const handleVote = useCallback(async (v) => {
    setMyVote(v)
    await apiVote(room, name, v)
    const fetchedVotes = await apiGetVotes(room)
    setVotes(fetchedVotes)
  }, [room, name])

  // ── Reveal / Reset ────────────────────────────────────────────────────────
  const handleReveal = async () => {
    setRevealed(true)
    await apiSetState(room, 'revealed')
  }

  const handleReset = useCallback(async () => {
    await apiReset(room)
    setMyVote(null)
    setRevealed(false)
    const [fetchedVotes, fetchedState] = await Promise.all([
      apiGetVotes(room),
      apiGetState(room)
    ])
    setVotes(fetchedVotes)
    localResetAt.current = fetchedState.resetAt
  }, [room])

  // ── Derived state ─────────────────────────────────────────────────────────
  const voteMap = Object.fromEntries(votes.map(v => [v.name, v.vote]))
  const votedNames = new Set(votes.map(v => v.name))
  const allVoted = users.length > 0 && users.every(u => votedNames.has(u.name))

  const numericVotes = votes.map(v => v.vote).filter(v => typeof v === 'number')
  const avg = numericVotes.length
    ? (numericVotes.reduce((a, b) => a + b, 0) / numericVotes.length).toFixed(1)
    : '—'
  const max = numericVotes.length ? Math.max(...numericVotes) : '—'
  const min = numericVotes.length ? Math.min(...numericVotes) : '—'

  // ── Dialog ────────────────────────────────────────────────────────────────
  if (!joined) {
    return (
      <div className="dialog-overlay">
        <div className="dialog" role="dialog" aria-modal="true" aria-label="Join Room">
          <div className="dialog-logo">
            <CardIcon size={36} />
            <span>Poker Plan</span>
          </div>
          <h2>Join Room</h2>
          <p>Room: <strong style={{ color: 'var(--accent2)' }}>/{room}</strong></p>
          <label htmlFor="name-input">Your name</label>
          <input
            id="name-input"
            type="text"
            placeholder="E.g. John Doe"
            value={inputName}
            onChange={e => setInputName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleJoin()}
            maxLength={20}
            autoFocus
          />

          <label>Your icon</label>
          <div className="icon-grid">
            {AVATAR_ICONS.map(emoji => (
              <button
                key={emoji}
                className={`icon-btn ${inputAvatar === emoji ? 'selected' : ''}`}
                onClick={() => setInputAvatar(emoji)}
                aria-label={emoji}
                style={{ fontSize: '3rem' }}
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            id="join-btn"
            className="btn btn-primary"
            onClick={handleJoin}
            disabled={!inputName.trim()}
          >
            Join Room
          </button>
        </div>
      </div>
    )
  }

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="header-logo">
            <CardIcon size={28} />
            <span>Poker Plan</span>
          </div>
          <div className="header-room">
            Room: <strong>/{room}</strong>
          </div>
        </div>
        <div className="header-right">
          <div
            className="user-badge"
            onClick={() => setJoined(false)}
            style={{ cursor: 'pointer' }}
            title="Change name"
          >
            <UserAvatar iconName={avatar} name={name} size={28} />
            {name}
          </div>
        </div>
      </header>

      <main className="main">
        {/* Room info & actions */}
        <div className="room-info">
          <div className="room-title">
            <span className="room-label">Voting in</span>
            <h1 className="room-name"><span>/</span>{room}</h1>
          </div>
          <div className="room-actions">
            {!revealed && (
              <button
                id="reveal-btn"
                className="btn btn-success"
                onClick={handleReveal}
                title={allVoted ? 'Everyone voted!' : 'Reveal votes now'}
              >
                {allVoted ? '✓ Everyone voted — Reveal' : 'Reveal votes'}
              </button>
            )}
            <button
              id="reset-btn"
              className="btn btn-danger"
              onClick={handleReset}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Online users */}
        <div className="users-panel">
          <div className="panel-title">
            <span className="online-dot" />
            {users.length} {users.length === 1 ? 'person' : 'people'} in room
          </div>
          <div className="users-list">
            {users.length === 0 && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Nobody in the room yet…
              </span>
            )}
            {users.map(u => (
              <div
                key={u.name}
                className={`user-chip ${votedNames.has(u.name) ? 'voted' : 'not-voted'}`}
              >
                <UserAvatar iconName={u.avatar} name={u.name} size={88} />
                <span className="vote-indicator" />
                {u.name}
                {votedNames.has(u.name) && ' ✓'}
              </div>
            ))}
          </div>
        </div>

        {/* Reveal panel */}
        {revealed && (
          <div className="reveal-panel">
            <div className="panel-title">
              🃏 Votes revealed
            </div>
            <div className="reveal-grid">
              {users.map(u => (
                <div
                  key={u.name}
                  className={`reveal-card ${voteMap[u.name] != null ? 'has-vote' : 'no-vote'}`}
                >
                  <span className="rc-vote">
                    {voteMap[u.name] != null ? voteMap[u.name] : '—'}
                  </span>
                  <span className="rc-name">{u.name}</span>
                </div>
              ))}
            </div>
            {Object.keys(voteMap).length > 0 && (
              <div className="reveal-summary">
                <div className="reveal-stat">
                  <span className="reveal-stat-label">Average</span>
                  <span className="reveal-stat-value">{avg}</span>
                </div>
                <div className="reveal-stat">
                  <span className="reveal-stat-label">Min</span>
                  <span className="reveal-stat-value">{min}</span>
                </div>
                <div className="reveal-stat">
                  <span className="reveal-stat-label">Max</span>
                  <span className="reveal-stat-value">{max}</span>
                </div>
                <div className="reveal-stat">
                  <span className="reveal-stat-label">Voted</span>
                  <span className="reveal-stat-value">{Object.keys(voteMap).length}/{users.length}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vote cards */}
        {!revealed && (
          <div className="vote-section">
            <div className="vote-section-title">
              {myVote != null
                ? `Your vote: ${myVote} — click to change`
                : 'Choose your vote'}
            </div>
            <div className="vote-grid">
              {VOTE_OPTIONS.map(v => (
                <button
                  key={v}
                  id={`vote-${v}`}
                  className={`vote-card ${myVote === v ? 'selected' : ''}`}
                  onClick={() => handleVote(v)}
                  aria-label={`Vote ${v}`}
                  aria-pressed={myVote === v}
                >
                  <span>{v}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
