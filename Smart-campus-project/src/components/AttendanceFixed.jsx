import { useMemo, useState } from 'react'

export default function AttendanceFixed({ attendance, setAttendance, onAddActivity }) {
  const [attended, setAttended] = useState(attendance?.attended ?? '')
  const [total, setTotal] = useState(attendance?.total ?? '')
  const [exText, setExText] = useState(attendance?.exText ?? '')
  const [touched, setTouched] = useState(false)
  const [showEx, setShowEx] = useState(false)

  const parsed = useMemo(() => {
    const a = Number(attended)
    const t = Number(total)

    const ok =
      Number.isFinite(a) && Number.isFinite(t) && t > 0 && a >= 0 && a <= t

    const pct = ok ? Math.round((a / t) * 100) : null
    return { a, t, ok, pct }
  }, [attended, total])

  const status = useMemo(() => {
    if (!parsed.ok) return { label: '—', colorClass: '' }
    if ((parsed.pct ?? 0) >= 75) return { label: 'Good Attendance (Green)', colorClass: 'ok' }
    return { label: 'Needs Improvement (Red)', colorClass: 'bad' }
  }, [parsed])

  const exDisplay = useMemo(() => {
    const a = exText && exText.trim()
    if (a) return a
    const fromStorage = attendance?.exText && attendance.exText.trim()
    return fromStorage || ''
  }, [exText, attendance?.exText])

  const handleCalculate = () => {
    setTouched(true)
    if (!parsed.ok) return

    const next = {
      attended: parsed.a,
      total: parsed.t,
      exText: exText.trim(),
      updatedAt: new Date().toISOString(),
    }

    setAttendance(next)
    onAddActivity(`Calculated attendance: ${parsed.pct}% (${parsed.a}/${parsed.t})`)
  }

  return (
    <section className="page">
      <div className="pageHead">
        <div>
          <div className="pageKicker">Attendance Calculator</div>
          <h2 className="pageTitle">Find your attendance percentage</h2>
          <p className="pageSub">Green if attendance is at least 75%, otherwise red.</p>
        </div>
      </div>

      <div className="gridTwo">
        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Enter Classes</div>
            <div className="sectionHint">Update numbers anytime</div>
          </div>

          <div className="row2">
            <label className="field">
              <span className="labelText">Attended Classes</span>
              <input
                className="input"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                inputMode="numeric"
                placeholder="e.g. 20"
              />
            </label>

            <label className="field">
              <span className="labelText">Total Classes</span>
              <input
                className="input"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                inputMode="numeric"
                placeholder="e.g. 24"
              />
            </label>
          </div>

          <label className="field">
            <span className="labelText">EX / What to do</span>
            <textarea
              className="textarea"
              value={exText}
              onChange={(e) => setExText(e.target.value)}
              placeholder="Example: If attendance is low, revise today + solve 10 questions."
            />
            <div className="smallNote" style={{ marginTop: 6 }}>
              Optional. Leave empty if not needed.
            </div>
          </label>

          {touched && !parsed.ok ? (
            <div className="formError">
              Enter valid values: total must be greater than 0 and attended must be between 0 and total.
            </div>
          ) : null}

          <button className="primaryBtn" type="button" onClick={handleCalculate}>
            Calculate
          </button>

          <div className="smallNote">Tip: attended should not exceed total.</div>
        </div>

        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Result</div>
            <div className="sectionHint">Instant status</div>
          </div>

          <div className="resultBig">
            <div className={`resultStatus ${status.colorClass}`}>
              <div className="resultPct">
                {parsed.ok ? `${parsed.pct}%` : '—'}
              </div>
              <div className="resultLabel">{status.label}</div>
            </div>
          </div>

          <div className="divider" />

          <div className="resultMeta">
            <div className="metaRow">
              <div className="metaKey">Attended</div>
              <div className="metaVal">{parsed.ok ? parsed.a : '—'}</div>
            </div>
            <div className="metaRow">
              <div className="metaKey">Total</div>
              <div className="metaVal">{parsed.ok ? parsed.t : '—'}</div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <button type="button" className="ghostBtn" onClick={() => setShowEx((v) => !v)}>
              {showEx ? 'Hide EX' : 'Show EX'}
            </button>

            {showEx ? (
              <div className="glass" style={{ padding: 12, marginTop: 10 }}>
                <div className="sectionTitle" style={{ fontSize: 14 }}>
                  EX / What to do
                </div>
                <div className="listDesc" style={{ marginTop: 6 }}>
                  {exDisplay ? exDisplay : <span className="muted">No EX added for attendance yet.</span>}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
