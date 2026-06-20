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
  const seededNotes = useMemo(() => {
    const now = new Date().toISOString()
    return [
      {
        id: 'seed-chem-101',
        title: 'Chemistry - Reaction Basics',
        subject: 'Chemistry',
        description:
          'A quick starting pack for reaction basics. Add your own PDF when ready.\n\n' +
          'Theory: Reactions proceed according to conservation of atoms and energy principles. ' +
          'Focus on identifying reactants/products, balancing equations, and learning common reaction patterns ' +
          '(acid-base, redox, substitution). After reading the concepts, reinforce understanding by writing ' +
          'balanced equations and solving practice problems.',
        exText: 'EX: Rewrite 10 reactions from this topic, then do 15 practice problems.',
        pdfDataUrl: '',
        fileName: '',
        createdAt: now,
      },
      {
        id: 'seed-math-101',
        title: 'Mathematics - Limits Starter',
        subject: 'Mathematics',
        description:
          'Begin with limit concepts and common problem patterns.\n\n' +
          'Theory: Limits describe the value a function approaches as the input gets close to a point. ' +
          'Learn direct substitution, algebraic simplification, and when to use techniques like factoring, ' +
          'rationalization, standard limit identities, and L’Hôpital’s rule (where applicable). Master solving ' +
          'step-by-step by checking indeterminate forms and interpreting the graph/behavior near the point.',
        exText: 'EX: Watch/skim your notes, then solve: 5 direct limits + 5 indeterminate forms.',
        pdfDataUrl: '',
        fileName: '',
        createdAt: now,
      },
      {
        id: 'seed-phy-101',
        title: 'Physics - Motion Formula Sheet',
        subject: 'Physics',
        description:
          'A formula-focused reminder pack. Upload PDFs to replace these placeholders.\n\n' +
          'Theory: Motion in 1D is governed by kinematics equations relating displacement, velocity, acceleration, ' +
          'and time. Identify what quantities are given, choose the correct equation (or combination), maintain sign ' +
          'conventions, and apply units consistently. For each problem, draw/label the situation, decide whether ' +
          'acceleration is constant, and verify the result for reasonableness.',
        exText: 'EX: Make 1-page summary + solve 12 numericals using the equations of motion.',
        pdfDataUrl: '',
        fileName: '',
        createdAt: now,
      },
    ]
  }, [])

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(LS.theme)
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
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
  const seededVideos = useMemo(() => {
    const now = new Date().toISOString()
    const videos = [
      {
        id: 'seed-video-1',
        title: 'Video 1',
        subject: 'General',
        url: 'https://youtu.be/d530rd7m_1E?si=HcoUqH9L962CHl-1',
        exText: '',
        createdAt: now,
      },
      {
        id: 'seed-video-2',
        title: 'Video 2',
        subject: 'General',
        url: 'https://youtu.be/wjFgd8JJ8NM?si=i78bWVq7eX7BhVik',
        exText: '',
        createdAt: now,
      },
      {
        id: 'seed-video-3',
        title: 'Video 3',
        subject: 'General',
        url: 'https://youtu.be/dIoSEswZNPk?si=byrtOzq5wU8Wxm2k',
        exText: '',
        createdAt: now,
      },
    ]

    // Add precomputed embed field for the existing Videos component.
    // (Videos.jsx can still extract embed from url at runtime if embed is missing.)
    return videos.map((v) => {
      try {
        const u = new URL(v.url)
        const host = u.hostname.replace('www.', '')
        let id = ''
        if (host === 'youtu.be') {
          id = u.pathname.split('/').filter(Boolean)[0] || ''
        } else if (host.endsWith('youtube.com')) {
          id = u.searchParams.get('v') || ''
          if (!id && u.pathname.startsWith('/embed/')) {
            id = u.pathname.split('/embed/')[1]?.split('/')[0] || ''
          }
          if (!id && u.pathname.startsWith('/shorts/')) {
            id = u.pathname.split('/shorts/')[1]?.split('/')[0] || ''
          }
        }
        return { ...v, embed: id ? `https://www.youtube.com/embed/${id}` : '' }
      } catch {
        return { ...v, embed: '' }
      }
    })
  }, [])

  const [videos, setVideos] = useState(() => safeParse(localStorage.getItem(LS.videos), []))

  const [tasks, setTasks] = useState(() => safeParse(localStorage.getItem(LS.tasks), []))
  const [exam, setExam] = useState(() => safeParse(localStorage.getItem(LS.exam), null))
  const [attendance, setAttendance] = useState(() => safeParse(localStorage.getItem(LS.attendance), null))
  const [activity, setActivity] = useState(() => safeParse(localStorage.getItem(LS.activity), []))
  const [streak, setStreak] = useState(() =>
    safeParse(localStorage.getItem(LS.streak), { lastCompletedDayISO: null, count: 0 }),
  )

  useEffect(() => {
    localStorage.setItem(LS.theme, theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    localStorage.setItem(LS.auth, JSON.stringify(auth))
  }, [auth])

  // Seed once (only if empty), then localStorage persistence runs normally.
  useEffect(() => {
    const existingNotes = safeParse(localStorage.getItem(LS.notes), [])
    if (Array.isArray(existingNotes) && existingNotes.length === 0) {
      setNotes(seededNotes)
    }

    const existingVideos = safeParse(localStorage.getItem(LS.videos), [])
    if (Array.isArray(existingVideos) && existingVideos.length === 0) {
      setVideos(seededVideos)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


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

    return {
      notes: matchedNotes.slice(0, 5),
      videos: matchedVideos.slice(0, 5),
      tasks: matchedTasks.slice(0, 5),
    }
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
          <Notes notes={notes} setNotes={setNotes} onAddActivity={(t) => pushActivity(t)} />
        )}

        {activePage === 'videos' && (
          <Videos videos={videos} setVideos={setVideos} onAddActivity={(t) => pushActivity(t)} />
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
          <StudyPlanner tasks={tasks} setTasks={setTasks} onAddActivity={(t) => pushActivity(t)} />
        )}
      </main>
    </div>
  )
}

