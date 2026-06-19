import { useMemo, useState } from 'react'

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

function extractYouTubeEmbed(url) {
  // Supports: youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>
  if (!url) return ''
  try {
    const u = new URL(url)
    const host = u.hostname.replace('www.', '')
    let id = ''

    if (host === 'youtu.be') {
      id = u.pathname.split('/').filter(Boolean)[0] || ''
    } else if (host.endsWith('youtube.com')) {
      // watch?v=
      id = u.searchParams.get('v') || ''
      // /embed/<id>
      if (!id && u.pathname.startsWith('/embed/')) {
        id = u.pathname.split('/embed/')[1]?.split('/')[0] || ''
      }
      // /shorts/<id>
      if (!id && u.pathname.startsWith('/shorts/')) {
        id = u.pathname.split('/shorts/')[1]?.split('/')[0] || ''
      }
    }

    if (!id) return ''
    return `https://www.youtube.com/embed/${id}`
  } catch {
    return ''
  }
}

export default function Videos({ videos, setVideos, onAddActivity }) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [url, setUrl] = useState('')
  const [exText, setExText] = useState('')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  const [expandedExIds, setExpandedExIds] = useState(() => ({}))

  const subjects = useMemo(() => {
    const set = new Set(videos.map((v) => v.subject).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [videos])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return videos
    return videos.filter((v) => {
      const hay = `${v.title} ${v.subject}`.toLowerCase()
      return hay.includes(q)
    })
  }, [videos, search])

  const embedUrl = useMemo(() => extractYouTubeEmbed(url.trim()), [url])

  function resetForm() {
    setTitle('')
    setSubject('')
    setUrl('')
    setExText('')
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (title.trim().length < 2) return setError('Enter a valid Video Title (min 2 chars).')
    if (subject.trim().length < 2) return setError('Enter a valid Subject Category (min 2 chars).')
    if (!url.trim()) return setError('Paste a YouTube link.')

    const embed = extractYouTubeEmbed(url.trim())
    if (!embed) return setError('Invalid YouTube link. Paste a YouTube link and try again.')

    const entry = {
      id: makeId(),
      title: title.trim(),
      subject: subject.trim(),
      url: url.trim(),
      exText: exText.trim() || '',
      embed: embed,
      createdAt: new Date().toISOString(),
    }

    setVideos((prev) => [entry, ...prev])
    onAddActivity(`Added video: ${entry.title}`)
    resetForm()
  }

  return (
    <section className="page">
      <div className="pageHead">
        <div>
          <div className="pageKicker">Video Learning</div>
          <h2 className="pageTitle">Add YouTube links and preview learning</h2>
          <p className="pageSub">Saved in Local Storage. Search by subject or title.</p>
        </div>
      </div>

      <div className="gridTwo">
        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Add YouTube Video</div>
            <div className="sectionHint">Paste link → embed preview</div>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="row2">
              <label className="field">
                <span className="labelText">Video Title</span>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Derivatives - Easy Explanation" />
              </label>

              <label className="field">
                <span className="labelText">Subject Category</span>
                <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" />
              </label>
            </div>

            <label className="field">
              <span className="labelText">YouTube Video Link</span>
              <input
                className="input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </label>

            <label className="field">
              <span className="labelText">EX / What to do</span>
              <textarea
                className="textarea"
                value={exText}
                onChange={(e) => setExText(e.target.value)}
                placeholder="Example: Watch + note key formulas, then attempt 10 questions."
              />
              <div className="smallNote" style={{ marginTop: 6 }}>
                Optional. Leave empty if not needed.
              </div>
            </label>

            {error ? <div className="formError">{error}</div> : null}

            <div className="previewWrap">
              {embedUrl ? (
                <div className="videoPreview glass">
                  <iframe
                    title="Video preview"
                    src={embedUrl}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="videoPreview glass empty">
                  Paste a YouTube link to preview.
                </div>
              )}
            </div>

            <button className="primaryBtn" type="submit">
              Save Video
            </button>
          </form>
        </div>

        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Search Videos</div>
            <div className="sectionHint">Filter by title or subject</div>
          </div>

          <div className="searchInline">
            <input
              className="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
            />
            {search.trim() ? (
              <button className="ghostBtn" type="button" onClick={() => setSearch('')}>
                Clear
              </button>
            ) : null}
          </div>

          {subjects.length ? (
            <div className="chipsRow">
              {subjects.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`chip ${search.toLowerCase() === s.toLowerCase() ? 'chipActive' : ''}`}
                  onClick={() => setSearch(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}

          <div className="list">
            {filtered.length ? (
              filtered.map((v) => (
                <div key={v.id} className="listRow">
                  <div className="listRowMain">
                    <div className="listTitle">{v.title}</div>
                    <div className="listSub">
                      <span className="pill">{v.subject}</span>
                      <span className="muted">• {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="listDesc">
                      <span className="muted">Link:</span>{' '}
                      <a className="link" href={v.url} target="_blank" rel="noreferrer">
                        {v.url}
                      </a>
                    </div>

                    <div style={{ marginTop: 10 }}>
                      <button
                        type="button"
                        className="ghostBtn"
                        onClick={() =>
                          setExpandedExIds((prev) => ({
                            ...prev,
                            [v.id]: !prev[v.id],
                          }))
                        }
                        aria-expanded={!!expandedExIds[v.id]}
                      >
                        {expandedExIds[v.id] ? 'Hide EX' : 'Show EX'}
                      </button>

                      {expandedExIds[v.id] ? (
                        <div className="glass" style={{ padding: 12, marginTop: 10 }}>
                          <div className="sectionTitle" style={{ fontSize: 14 }}>
                            EX / What to do
                          </div>
                          <div className="listDesc" style={{ marginTop: 6 }}>
                            {v.exText ? v.exText : <span className="muted">No EX added for this video yet.</span>}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="listRowActions">
                    <button
                      type="button"
                      className="secondaryBtn"
                      onClick={() => {
                        const embed = extractYouTubeEmbed(v.url) || v.embed
                        window.open(embed ? `https://www.youtube.com/watch?v=${embed.split('/embed/')[1]}` : v.url, '_blank', 'noopener,noreferrer')
                      }}
                    >
                      Watch
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="emptyState">No videos found. Add one on the left.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
