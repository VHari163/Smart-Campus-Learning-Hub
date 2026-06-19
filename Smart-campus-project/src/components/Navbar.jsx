import { useEffect, useMemo, useState } from 'react'

function formatCount(n) {
  return Number.isFinite(n) ? n : 0
}

export default function Navbar({
  theme,
  onToggleTheme,
  activePage,
  setActivePage,
  studentName,
  globalSearch,
  setGlobalSearch,
  totals,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [activePage])

  const items = useMemo(
    () => [
      { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
      { key: 'notes', label: 'Notes', icon: '📚' },
      { key: 'videos', label: 'Videos', icon: '🎥' },
      { key: 'attendance', label: 'Attendance', icon: '🗓️' },
      { key: 'countdown', label: 'Exam Countdown', icon: '⏳' },
      { key: 'planner', label: 'Study Planner', icon: '✅' },
    ],
    [],
  )

  const hasQuery = globalSearch.trim().length > 0

  return (
    <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
      <div className="sidebarTop">
        <div className="brand">
          <div className="brandMark">SC</div>
          <div className="brandText">
            <div className="brandTitle">Smart Campus</div>
            <div className="brandSub">Learning Hub</div>
          </div>
        </div>

        <button
          className="mobileMenuBtn"
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
      </div>

      <div className="sidebarUser">
        <div className="studentProfilePill">
          <div className="avatar" aria-hidden="true">
            {studentName ? studentName.trim().slice(0, 1).toUpperCase() : 'S'}
          </div>
          <div className="studentMeta">
            <div className="studentName">{studentName ? studentName : 'Student'}</div>
            <div className="studentHint">Welcome back</div>
          </div>
        </div>

        <div className="sidebarStatsRow">
          <div className="miniStat">
            <div className="miniLabel">Notes</div>
            <div className="miniValue">{formatCount(totals.totalNotes)}</div>
          </div>
          <div className="miniStat">
            <div className="miniLabel">Videos</div>
            <div className="miniValue">{formatCount(totals.totalVideos)}</div>
          </div>
        </div>
      </div>

      <nav className="nav">
        {items.map((it) => (
          <button
            key={it.key}
            type="button"
            className={`navItem ${activePage === it.key ? 'active' : ''}`}
            onClick={() => setActivePage(it.key)}
          >
            <span className="navIcon" aria-hidden="true">
              {it.icon}
            </span>
            <span className="navLabel">{it.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebarBottom">
        <div className="searchBox">
          <span className="searchIcon" aria-hidden="true">
            🔎
          </span>
          <input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search notes, videos, tasks..."
            className="searchInput"
            aria-label="Global search"
          />
          {hasQuery && (
            <button
              type="button"
              className="clearSearch"
              onClick={() => setGlobalSearch('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="sidebarActions">
          <button type="button" className="ghostBtn" onClick={onToggleTheme}>
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <button type="button" className="dangerBtn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
