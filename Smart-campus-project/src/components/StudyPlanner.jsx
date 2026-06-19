import { useMemo, useState } from 'react'

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

function dayISO(d = new Date()) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const pad = (n) => String(n).padStart(2, '0')
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`
}

export default function StudyPlanner({ tasks, setTasks, onAddActivity }) {
  const [text, setText] = useState('')
  const [selectedDay, setSelectedDay] = useState(dayISO())

  const tasksForDay = useMemo(() => {
    return tasks.filter((t) => t.dayISO === selectedDay)
  }, [tasks, selectedDay])

  const completedCount = useMemo(() => {
    return tasksForDay.filter((t) => t.completed).length
  }, [tasksForDay])

  const pct = useMemo(() => {
    const total = tasksForDay.length
    if (!total) return 0
    return Math.round((completedCount / total) * 100)
  }, [tasksForDay.length, completedCount])

  function handleAdd() {
    const t = text.trim()
    if (t.length < 2) return
    const entry = { id: makeId(), text: t, completed: false, dayISO: selectedDay, createdAt: new Date().toISOString() }
    setTasks((prev) => [entry, ...prev])
    setText('')
    onAddActivity(`Added task for ${selectedDay}: ${t}`)
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    )
    const task = tasks.find((x) => x.id === id)
    if (task) {
      onAddActivity(`${task.completed ? 'Reopened' : 'Completed'} task: ${task.text}`)
    }
  }

  function removeTask(id) {
    const task = tasks.find((x) => x.id === id)
    setTasks((prev) => prev.filter((t) => t.id !== id))
    if (task) onAddActivity(`Removed task: ${task.text}`)
  }

  return (
    <section className="page">
      <div className="pageHead">
        <div>
          <div className="pageKicker">Study Planner</div>
          <h2 className="pageTitle">Plan your day & track completion</h2>
          <p className="pageSub">Add tasks, mark done, and watch your progress.</p>
        </div>
      </div>

      <div className="gridTwo">
        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Add Daily Tasks</div>
            <div className="sectionHint">Stored per day</div>
          </div>

          <div className="row2">
            <label className="field">
              <span className="labelText">Date</span>
              <input
                className="input"
                type="date"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              />
            </label>
          </div>

          <label className="field">
            <span className="labelText">Task</span>
            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Solve 20 problems from Chapter 3"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd()
              }}
            />
          </label>

          <div className="rowActions">
            <button className="primaryBtn" type="button" onClick={handleAdd}>
              Add Task
            </button>
            <button
              className="ghostBtn"
              type="button"
              onClick={() => {
                setTasks((prev) => prev.filter((t) => t.dayISO !== selectedDay))
                onAddActivity(`Cleared tasks for ${selectedDay}`)
              }}
              disabled={!tasksForDay.length}
            >
              Clear Day
            </button>
          </div>

          <div className="smallNote">
            Progress for <b>{selectedDay}</b>
          </div>
        </div>

        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Progress</div>
            <div className="sectionHint">Completion bar</div>
          </div>

          <div className="progressWrap big">
            <div className="progressTop">
              <span className="progressLabel">Completion</span>
              <span className="progressPct">{pct}%</span>
            </div>
            <div className="progressTrack" aria-hidden="true">
              <div className="progressFill" style={{ width: `${pct}%` }} />
            </div>
            <div className="progressMeta">
              <span>
                Done <b>{completedCount}</b> / {tasksForDay.length || 0}
              </span>
            </div>
          </div>

          <div className="divider" />

          <div className="taskList" role="list">
            {tasksForDay.length ? (
              tasksForDay
                .slice()
                .sort((a, b) => Number(a.completed) - Number(b.completed))
                .map((t) => (
                  <div key={t.id} className={`taskRow ${t.completed ? 'done' : ''}`} role="listitem">
                    <button
                      type="button"
                      className="taskCheck"
                      aria-label={t.completed ? 'Mark as not completed' : 'Mark as completed'}
                      onClick={() => toggleTask(t.id)}
                    >
                      {t.completed ? '✓' : '○'}
                    </button>
                    <div className="taskMain">
                      <div className="taskText">{t.text}</div>
                      <div className="taskSub">{t.createdAt ? new Date(t.createdAt).toLocaleTimeString() : ''}</div>
                    </div>
                    <button type="button" className="taskRemove" onClick={() => removeTask(t.id)} aria-label="Remove task">
                      🗑️
                    </button>
                  </div>
                ))
            ) : (
              <div className="emptyState">No tasks for this date. Add one on the left.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
