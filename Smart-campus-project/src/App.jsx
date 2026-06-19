import { useEffect, useMemo, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Notes from './components/Notes'
import Videos from './components/Videos'
import AttendanceFixed from './components/AttendanceFixed'
import Countdown from './components/Countdown'
import StudyPlanner from './components/StudyPlanner'
import Home from './components/Home'

const LS = {
  theme: 'scmh_theme',
  auth: 'scmh_auth',
  notes: 'scmh_notes',
  videos: 'scmh_videos',
  tasks: 'scmh_tasks',
  exam: 'scmh_exam',
  attendance: 'scmh_attendance',
  activity: 'scmh_activity',
  streak: 'scmh_streak',
}

function safeParse(json, fallback) {
  try {
    const v = JSON.parse(json)
    return v ?? fallback
  } catch {
    return fallback
  }
}

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

function dayISO(d = new Date()) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const pad = (n) => String(n).padStart(2, '0')
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`
}

const QUOTES = [
  'Small steps every day.',
  'Consistency beats intensity.',
  'Focus on what you can control.',
  'Learn. Apply. Repeat.',
  'Progress, not perfection.',
  'Make today count.',
  'Discipline is motivation in action.',
]

export default function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(LS.theme)
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem(LS.auth)
    if (!stored) return null
    return safeParse(stored, null)
  })

  const [activePage, setActivePage] = useState('dashboard')
  const [globalSearch, setGlobalSearch] = useState('')
  const [showLogin, setShowLogin] = useState(false)

  const [notes, setNotes] = useState(() => safeParse(localStorage.getItem(LS.notes), []))
  const [videos, setVideos] = useState(() =>
    safeParse(localStorage.getItem(LS.videos), []),
  )
  const [tasks, setTasks] = useState(() => safeParse(localStorage.getItem(LS.tasks), []))
  const [exam, setExam] = useState(() => safeParse(localStorage.getItem(LS.exam), null))
  const [attendance, setAttendance] = useState(() =>
    safeParse(localStorage.getItem(LS.attendance), null),
  )
  const [activity, setActivity] = useState(() =>
    safeParse(localStorage.getItem(LS.activity), []),
  )
  const [streak, setStreak] = useState(() => safeParse(localStorage.getItem(LS.streak), { lastCompletedDayISO: null, count: 0 }))

  useEffect(() => {
    localStorage.setItem(LS.theme, theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    localStorage.setItem(LS.auth, JSON.stringify(auth))
  }, [auth])

  useEffect(() => {
    localStorage.setItem(LS.notes, JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem(LS.videos, JSON.stringify(videos))
  }, [videos])

  useEffect(() => {
    localStorage.setItem(LS.tasks, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(LS.exam, JSON.stringify(exam))
  }, [exam])

  useEffect(() => {
    localStorage.setItem(LS.attendance, JSON.stringify(attendance))
  }, [attendance])

  useEffect(() => {
    localStorage.setItem(LS.activity, JSON.stringify(activity))
  }, [activity])

  useEffect(() => {
    localStorage.setItem(LS.streak, JSON.stringify(streak))
  }, [streak])

  const quoteOfDay = useMemo(() => {
    const d = new Date()
    const key = Number(`${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`)
    return QUOTES[key % QUOTES.length]
  }, [])

  function pushActivity(text) {
    const entry = { id: makeId(), text, createdAt: new Date().toISOString() }
    setActivity((prev) => [entry, ...prev].slice(0, 12))
  }

  // Update streak when tasks completed for "today"
  useEffect(() => {
    const today = dayISO()
    const completedToday = tasks.some((t) => t.completed && t.dayISO === today)
    setStreak((prev) => {
      if (!completedToday) return prev
      if (prev.lastCompletedDayISO === today) return prev
      return { lastCompletedDayISO: today, count: (prev.count || 0) + 1 }
    })
  }, [tasks])

  const totals = useMemo(() => {
    const totalNotes = notes.length
    const totalVideos = videos.length
    const totalTasks = tasks.length
    const completedTasks = tasks.filter((t) => t.completed).length
    const completionPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
    return { totalNotes, totalVideos, completionPct, totalTasks, completedTasks }
  }, [notes, videos, tasks])

  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase()
    if (!q) return { notes: [], videos: [], tasks: [] }

    const matchedNotes = notes.filter((n) => {
      const hay = `${n.title} ${n.subject} ${n.description}`.toLowerCase()
      return hay.includes(q)
    })

    const matchedVideos = videos.filter((v) => {
      const hay = `${v.title} ${v.subject}`.toLowerCase()
      return hay.includes(q)
    })

    const matchedTasks = tasks.filter((t) => {
      const hay = `${t.text} ${t.dayISO}`.toLowerCase()
      return hay.includes(q)
    })

    return { notes: matchedNotes.slice(0, 5), videos: matchedVideos.slice(0, 5), tasks: matchedTasks.slice(0, 5) }
  }, [globalSearch, notes, videos, tasks])

  function handleLogout() {
    setAuth(null)
    setActivePage('dashboard')
    setGlobalSearch('')
    pushActivity('Logged out')
  }

  if (!auth) {
    if (!showLogin) {
      return (
        <div className="appRoot">
          <Home
            onGetStarted={() => {
              setShowLogin(true)
            }}
          />
        </div>
      )
    }

    return (
      <div className="appRoot">
        <Login
          onLogin={(username) => {
            setAuth({ username })
            setActivePage('dashboard')
            pushActivity(`Logged in as ${username}`)
          }}
        />
      </div>
    )
  }

  return (
    <div className="appShell">
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        activePage={activePage}
        setActivePage={setActivePage}
        studentName={auth?.username}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        totals={totals}
        onLogout={handleLogout}
      />

      <main className="content">
        <Dashboard
          quoteOfDay={quoteOfDay}
          totals={totals}
          streakCount={streak?.count || 0}
          studentName={auth?.username}
          activity={activity}
          searchResults={searchResults}
        />

        {activePage === 'notes' && (
          <Notes
            notes={notes}
            setNotes={setNotes}
            onAddActivity={(t) => pushActivity(t)}
          />
        )}

        {activePage === 'videos' && (
          <Videos
            videos={videos}
            setVideos={setVideos}
            onAddActivity={(t) => pushActivity(t)}
          />
        )}

        {activePage === 'attendance' && (
          <AttendanceFixed
            attendance={attendance}
            setAttendance={setAttendance}
            onAddActivity={(t) => pushActivity(t)}
          />
        )}

        {activePage === 'countdown' && (
          <Countdown exam={exam} setExam={setExam} onAddActivity={(t) => pushActivity(t)} />
        )}

        {activePage === 'planner' && (
          <StudyPlanner
            tasks={tasks}
            setTasks={setTasks}
            onAddActivity={(t) => pushActivity(t)}
          />
        )}
      </main>
    </div>
  )
}
