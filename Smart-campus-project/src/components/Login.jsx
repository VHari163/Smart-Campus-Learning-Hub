import { useMemo, useState } from 'react'

const LS_KEY = 'scmh_auth'

function pushAuth(username) {
  localStorage.setItem(LS_KEY, JSON.stringify({ username }))
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => {
    return username.trim().length >= 2 && password.trim().length >= 1
  }, [username, password])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (username.trim().length < 2) {
      setError('Enter a valid username.')
      return
    }
    if (password.trim().length < 1) {
      setError('Enter your password.')
      return
    }

    // Client-side demo auth (no backend as per requirements)
    pushAuth(username.trim())
    onLogin(username.trim())
  }

  return (
    <div className="loginWrap">
      <div className="loginCard glass">
        <div className="loginHeader">
          <div className="loginBadge">Smart Campus</div>
          <h1 className="loginTitle">Learning Hub</h1>
          <p className="loginSubtitle">
            Sign in to manage notes, videos, attendance, exams and your daily study plan.
          </p>
        </div>

        <form className="loginForm" onSubmit={handleSubmit}>
          <label className="field">
            <span className="labelText">Username</span>
            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoComplete="username"
            />
          </label>

          <label className="field">
            <span className="labelText">Password</span>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </label>

          {error && <div className="loginError">{error}</div>}

          <button className="primaryBtn" type="submit" disabled={!canSubmit}>
            Login
          </button>
        </form>

        <div className="loginFooter">
          <div className="loginHint">Tip: Your data is stored locally in this browser.</div>
        </div>
      </div>
    </div>
  )
}
