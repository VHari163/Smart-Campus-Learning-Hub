import { useMemo, useRef, useState } from 'react'

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

export default function Notes({ notes, setNotes, onAddActivity }) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [exText, setExText] = useState('')
  const [fileDataUrl, setFileDataUrl] = useState('')
  const [fileName, setFileName] = useState('')
  const [searchSubject, setSearchSubject] = useState('')
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const [expandedExIds, setExpandedExIds] = useState(() => ({}))

  const subjects = useMemo(() => {
    const set = new Set(notes.map((n) => n.subject).filter(Boolean))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [notes])

  const filteredNotes = useMemo(() => {
    const q = searchSubject.trim().toLowerCase()
    if (!q) return notes
    return notes.filter((n) => (n.subject || '').toLowerCase().includes(q))
  }, [notes, searchSubject])

  function resetForm() {
    setTitle('')
    setSubject('')
    setDescription('')
    setExText('')
    setFileDataUrl('')
    setFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handlePdfSelected(file) {
    setError('')
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.')
      setFileDataUrl('')
      setFileName('')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setFileDataUrl(String(reader.result || ''))
      setFileName(file.name)
    }
    reader.onerror = () => {
      setError('Failed to read the PDF. Please try again.')
      setFileDataUrl('')
      setFileName('')
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (title.trim().length < 2) return setError('Enter a Note Title (min 2 characters).')
    if (subject.trim().length < 2) return setError('Enter a Subject Name (min 2 characters).')
    if (description.trim().length < 5) return setError('Enter a Description (min 5 characters).')
    if (!fileDataUrl) return setError('Upload a PDF file.')

    const entry = {
      id: makeId(),
      title: title.trim(),
      subject: subject.trim(),
      description: description.trim(),
      exText: exText.trim() || '',
      pdfDataUrl: fileDataUrl,
      fileName: fileName || `${title.trim()}.pdf`,
      createdAt: new Date().toISOString(),
    }

    setNotes((prev) => [entry, ...prev])
    onAddActivity(`Uploaded note: ${entry.title}`)
    resetForm()
  }

  function downloadNote(n) {
    if (!n?.pdfDataUrl) return
    const a = document.createElement('a')
    a.href = n.pdfDataUrl
    a.download = n.fileName || `${n.title}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const quickTemplates = useMemo(() => {
    return [
      { subject: 'Chemistry', title: 'Reaction Basics', hint: 'EX after you upload your PDF' },
      { subject: 'Mathematics', title: 'Limits Starter', hint: 'Practice sets for limits' },
      { subject: 'Physics', title: 'Motion Formula Sheet', hint: 'Summary + numericals' },
    ]
  }, [])

  function applyQuickFilter(subjectName) {
    setSearchSubject(subjectName)
    const el = document.querySelector('.list')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }


  return (
    <section className="page">
      <div className="pageHead">
        <div>
          <div className="pageKicker">Notes Management</div>
          <h2 className="pageTitle">Upload and organize study PDFs</h2>
          <p className="pageSub">Saved in Local Storage. Search by subject and download anytime.</p>
        </div>
      </div>

      <div className="gridTwo">
        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Upload Notes</div>
            <div className="sectionHint">Title, subject, description + PDF</div>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="row2">
              <label className="field">
                <span className="labelText">Note Title</span>
                <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Organic Chemistry Notes" />
              </label>

              <label className="field">
                <span className="labelText">Subject Name</span>
                <input className="input" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Chemistry" />
              </label>
            </div>

            <label className="field">
              <span className="labelText">Description</span>
              <textarea
                className="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description about the note..."
              />
            </label>

            <label className="field">
              <span className="labelText">EX / What to do</span>
              <textarea
                className="textarea"
                value={exText}
                onChange={(e) => setExText(e.target.value)}
                placeholder="Example: Solve 20 problems from this PDF after reading the concepts..."
              />
              <div className="smallNote" style={{ marginTop: 6 }}>
                Optional. Leave empty if not needed.
              </div>
            </label>

            <label className="field">
              <span className="labelText">PDF File Upload</span>
              <input
                ref={fileInputRef}
                className="fileInput"
                type="file"
                accept="application/pdf"
                onChange={(e) => handlePdfSelected(e.target.files?.[0])}
              />
              {fileName ? <div className="fileMeta">Selected: {fileName}</div> : <div className="fileMeta muted">No file selected</div>}
            </label>

            {error ? <div className="formError">{error}</div> : null}

            <button className="primaryBtn" type="submit">
              Save Note
            </button>
          </form>
        </div>

        <div className="glass card">
          <div className="formHead">
            <div className="sectionTitle">Your Uploaded Notes</div>
            <div className="sectionHint">Search by subject</div>
          </div>

          <div className="searchInline">
            <input
              className="input"
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              placeholder="Search subject..."
            />
            {searchSubject.trim() ? (
              <button className="ghostBtn" type="button" onClick={() => setSearchSubject('')}>
                Clear
              </button>
            ) : null}
          </div>

          <div className="glass" style={{ padding: 12, marginTop: 10 }}>
            <div className="sectionTitle" style={{ fontSize: 14 }}>
              Quick templates
            </div>
            <div className="sectionHint" style={{ marginTop: 6 }}>
              One-click subject filters (fast start)
            </div>
            <div className="chipsRow" style={{ marginTop: 10 }} aria-label="Quick templates">
              {quickTemplates.map((t) => (
                <button
                  key={t.subject}
                  type="button"
                  className={`chip ${searchSubject.toLowerCase() === t.subject.toLowerCase() ? 'chipActive' : ''}`}
                  onClick={() => applyQuickFilter(t.subject)}
                >
                  {t.subject}
                </button>
              ))}
            </div>
          </div>

          {subjects.length ? (
            <div className="chipsRow" aria-label="Subject filters">
              {subjects.slice(0, 8).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`chip ${searchSubject.toLowerCase() === s.toLowerCase() ? 'chipActive' : ''}`}
                  onClick={() => setSearchSubject(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          ) : null}


          <div className="list">
            {filteredNotes.length ? (
              filteredNotes.map((n) => (
                <div key={n.id} className="listRow">
                  <div className="listRowMain">
                    <div className="listTitle">{n.title}</div>
                    <div className="listSub">
                      <span className="pill">{n.subject}</span>
                      <span className="muted">• {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="listDesc">{n.description}</div>

                    <div style={{ marginTop: 10 }}>
                      <button
                        type="button"
                        className={`ghostBtn ${expandedExIds[n.id] ? '' : ''}`}
                        onClick={() =>
                          setExpandedExIds((prev) => ({
                            ...prev,
                            [n.id]: !prev[n.id],
                          }))
                        }
                        aria-expanded={!!expandedExIds[n.id]}
                      >
                        {expandedExIds[n.id] ? 'Hide EX' : 'Show EX'}
                      </button>

                      {expandedExIds[n.id] ? (
                        <div className="glass" style={{ padding: 12, marginTop: 10 }}>
                          <div className="sectionTitle" style={{ fontSize: 14 }}>
                            EX / What to do
                          </div>
                          <div className="listDesc" style={{ marginTop: 6 }}>
                            {n.exText ? n.exText : <span className="muted">No EX added for this note yet.</span>}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="listRowActions">
                      <button
                        className="secondaryBtn"
                        type="button"
                        onClick={() => downloadNote(n)}
                        disabled={!n?.pdfDataUrl}
                        title={!n?.pdfDataUrl ? 'Upload a PDF to enable download' : 'Download PDF'}
                      >
                        Download
                      </button>

                  </div>
                </div>
              ))
            ) : (
              <div className="emptyState">No notes found. Upload your first PDF.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
