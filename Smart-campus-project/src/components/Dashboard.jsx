import { useMemo } from 'react'

function Card({ className = '', children }) {
  return <div className={`glass card ${className}`}>{children}</div>
}

function StatTile({ label, value }) {
  return (
    <div className="statTile">
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
    </div>
  )
}

function ProgressBar({ pct }) {
  const safe = Math.max(0, Math.min(100, Number(pct) || 0))
  return (
    <div className="progressWrap">
      <div className="progressTop">
        <span className="progressLabel">Study Progress</span>
        <span className="progressPct">{safe}%</span>
      </div>
      <div className="progressTrack" aria-hidden="true">
        <div className="progressFill" style={{ width: `${safe}%` }} />
      </div>
    </div>
  )
}

export default function Dashboard({
  quoteOfDay,
  totals,
  streakCount,
  studentName,
  activity,
  searchResults,
}) {
  const welcome = useMemo(() => {
    const name = studentName ? studentName : 'Student'
    return `Welcome, ${name}`
  }, [studentName])

  return (
    <section className="dashboard">
      <div className="heroRow">
        <div className="heroLeft">
          <h2 className="dashWelcome">{welcome}</h2>
          <p className="dashSub">
            Your productivity hub for notes, videos, attendance, exams and daily tasks.
          </p>

          <div className="quoteCard glass card">
            <div className="quoteMark" aria-hidden="true">
              “
            </div>
            <div className="quoteText">{quoteOfDay}</div>
            <div className="quoteFooter">Motivation of the day</div>
          </div>
        </div>

        <div className="heroRight">
          <Card className="streakCard">
            <div className="streakTop">
              <div className="streakTitle">Study Streak</div>
              <div className="streakBadge">🔥</div>
            </div>
            <div className="streakValue">{streakCount}</div>
            <div className="streakHint">Complete a task today to keep it going.</div>
          </Card>

          <Card>
            <div className="statsRow">
              <StatTile label="Total Notes" value={totals.totalNotes} />
              <StatTile label="Total Videos" value={totals.totalVideos} />
            </div>
            <ProgressBar pct={totals.completionPct} />
          </Card>
        </div>
      </div>

      <div className="grid2">
        <Card>
          <div className="sectionHead">
            <div className="sectionTitle">Quick Navigation</div>
            <div className="sectionHint">Jump to what you need</div>
          </div>

          <div className="quickGrid">
            <div className="quickItem" role="button" tabIndex={0} aria-label="Open Notes">
              <div className="quickIcon">📚</div>
              <div className="quickText">Notes</div>
              <div className="quickMeta">Upload & search PDFs</div>
            </div>
            <div className="quickItem" role="button" tabIndex={0} aria-label="Open Videos">
              <div className="quickIcon">🎥</div>
              <div className="quickText">Videos</div>
              <div className="quickMeta">YouTube links & previews</div>
            </div>
            <div className="quickItem" role="button" tabIndex={0} aria-label="Open Attendance">
              <div className="quickIcon">🗓️</div>
              <div className="quickText">Attendance</div>
              <div className="quickMeta">Calculate % instantly</div>
            </div>
            <div className="quickItem" role="button" tabIndex={0} aria-label="Open Exam Countdown">
              <div className="quickIcon">⏳</div>
              <div className="quickText">Countdown</div>
              <div className="quickMeta">Remaining days</div>
            </div>
            <div className="quickItem" role="button" tabIndex={0} aria-label="Open Study Planner">
              <div className="quickIcon">✅</div>
              <div className="quickText">Planner</div>
              <div className="quickMeta">Daily tasks & progress</div>
            </div>
          </div>
          <div className="mutedSmall">
            Use the sidebar for navigation. Global search results appear below.
          </div>
        </Card>

        <Card>
          <div className="sectionHead">
            <div className="sectionTitle">Global Search</div>
            <div className="sectionHint">Matches across Notes, Videos & Tasks</div>
          </div>

          {(searchResults?.notes?.length || 0) +
            (searchResults?.videos?.length || 0) +
            (searchResults?.tasks?.length || 0) ===
          0 ? (
            <div className="emptyState">Type in the sidebar search to see results.</div>
          ) : (
            <div className="searchResults">
              {searchResults?.notes?.length ? (
                <div className="searchGroup">
                  <div className="searchGroupTitle">Notes</div>
                  {searchResults.notes.map((n) => (
                    <div key={n.id} className="searchRow">
                      <span className="pill">PDF</span>
                      <div className="searchRowMain">
                        <div className="searchRowTitle">{n.title}</div>
                        <div className="searchRowSub">{n.subject}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {searchResults?.videos?.length ? (
                <div className="searchGroup">
                  <div className="searchGroupTitle">Videos</div>
                  {searchResults.videos.map((v) => (
                    <div key={v.id} className="searchRow">
                      <span className="pill">YT</span>
                      <div className="searchRowMain">
                        <div className="searchRowTitle">{v.title}</div>
                        <div className="searchRowSub">{v.subject}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {searchResults?.tasks?.length ? (
                <div className="searchGroup">
                  <div className="searchGroupTitle">Tasks</div>
                  {searchResults.tasks.map((t) => (
                    <div key={t.id} className="searchRow">
                      <span className={`pill ${t.completed ? 'pillGreen' : ''}`}>
                        {t.completed ? 'Done' : 'Task'}
                      </span>
                      <div className="searchRowMain">
                        <div className="searchRowTitle">{t.text}</div>
                        <div className="searchRowSub">{t.dayISO}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </Card>
      </div>

      <div className="grid1">
        <Card className="activityCard">
          <div className="sectionHead">
            <div className="sectionTitle">Recent Activity</div>
            <div className="sectionHint">Your latest actions</div>
          </div>

          {activity?.length ? (
            <div className="activityList">
              {activity.map((a) => (
                <div key={a.id} className="activityRow">
                  <div className="activityDot" aria-hidden="true" />
                  <div className="activityText">{a.text}</div>
                  <div className="activityTime">
                    {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyState">No activity yet.</div>
          )}
        </Card>
      </div>
    </section>
  )
}
