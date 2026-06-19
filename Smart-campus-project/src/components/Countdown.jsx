import { useEffect, useMemo, useState } from 'react'

function parseISODate(dateISO) {
  if (!dateISO) return null
  const d = new Date(dateISO)
  return Number.isNaN(d.getTime()) ? null : d
}

function daysBetween(from, to) {
  const a = new Date(from)
  const b = new Date(to)
  a.setHours(0, 0, 0, 0)
  b.setHours(0, 0, 0, 0)
  const ms = b.getTime() - a.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export default function Countdown({ exam, setExam, onAddActivity }) {
  const [name, setName] = useState(exam?.name ?? '')
  const [dateISO, setDateISO] = useState(exam?.dateISO ?? '')

  useEffect(() => {
    setName(exam?.name ?? '')
    setDateISO(exam?.dateISO ?? '')
  }, [exam])

  const remaining = useMemo(() => {
    const d = parseISODate(dateISO)
    if (!d) return null
    return daysBetween(new Date(), d)
  }, [dateISO])

  const status = useMemo(() => {
    if (remaining === null) return { label: '—', badgeClass: '' }
    if (remaining < 0) return { label: 'Exam passed', badgeClass: 'bad' }
    if (remaining === 0) return { label: 'Exam is today', badgeClass: 'ok' }
    if (remaining <= 7) return { label: `Hurry: ${remaining} days left`, badgeClass: 'warn' }
    return { label: `${remaining} days left`, badgeClass: '' }
  }, [remaining])

  function handleSave() {
    if (name.trim().length < 2) return
    const d = parseISODate(dateISO)
    if (!d) return

    const next = { name: name.trim(), dateISO }
    setExam(next)
    onAddActivity(`Exam set: ${next.name}`)
  }

  function handleClear() {
    setExam(null)
    onAddActivity('Cleared exam countdown')
    setName('')
    setDateISO('')
  }

  const datePretty = useMemo(() => {
    const d = parseISODate(dateISO)
    if (!d) return ''
    return d.toLocaleDateString()
  }, [dateISO])

  return (
    <section className="page">
      <div className="pageHead">
        <div>
          <div className="pageKicker">Exam Countdown</div>
          <h2 className="pageTitle">Never miss an exam date</h2>
          <p className="pageSub">Remaining days update automatically.</p>
        </div>
      </div>

      <div className="gridTwo">
        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Set Exam</div>
            <div className="sectionHint">Name + date</div>
          </div>

          <div className="row2">
            <label className="field">
              <span className="labelText">Exam Name</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Midterm - Unit 2"
              />
            </label>

            <label className="field">
              <span className="labelText">Exam Date</span>
              <input
                className="input"
                type="date"
                value={dateISO}
                onChange={(e) => setDateISO(e.target.value)}
              />
            </label>
          </div>

          <div className="smallNote muted">
            Your exam is stored in Local Storage.
          </div>

          <div className="rowActions">
            <button className="primaryBtn" type="button" onClick={handleSave}>
              Save Countdown
            </button>
            {exam?.name ? (
              <button className="ghostBtn" type="button" onClick={handleClear}>
                Clear
              </button>
            ) : null}
          </div>
        </div>

        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Countdown</div>
            <div className="sectionHint">Live status</div>
          </div>

          <div className="countdownBig">
            <div className={`countdownBadge ${status.badgeClass}`}>{status.label}</div>
            <div className="countdownName">{exam?.name ? exam.name : name ? name : 'Set an exam'}</div>
            <div className="countdownDate">{datePretty ? `On ${datePretty}` : dateISO ? `On ${dateISO}` : ''}</div>
          </div>

          <div className="divider" />

          <div className="countdownTips">
            <div className="tipRow">
              <span className="tipIcon" aria-hidden="true">
                🧠
              </span>
              <span>Start revising early and keep a daily task list.</span>
            </div>
            <div className="tipRow">
              <span className="tipIcon" aria-hidden="true">
                📌
              </span>
              <span>Use the Study Planner to stay consistent.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
