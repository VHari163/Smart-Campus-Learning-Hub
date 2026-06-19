export default function Home({ onGetStarted }) {
  function StudentAvatar({ variant, name }) {
    const palette = [
      { a: '#7c3aed', b: '#06b6d4', c: '#22c55e' },
      { a: '#f97316', b: '#ec4899', c: '#60a5fa' },
      { a: '#0ea5e9', b: '#a78bfa', c: '#f59e0b' },
    ][variant % 3]

    const initials = (name || 'S')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0]?.toUpperCase())
      .join('')

    return (
      <svg
        className="studentSvg"
        width="120"
        height="120"
        viewBox="0 0 120 120"
        role="img"
        aria-label={name}
      >
        <defs>
          <linearGradient id={`g-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={palette.a} stopOpacity="0.95" />
            <stop offset="1" stopColor={palette.b} stopOpacity="0.95" />
          </linearGradient>
          <filter id={`f-${variant}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.25" />
          </filter>
        </defs>

        <rect x="10" y="10" width="100" height="100" rx="28" fill={`url(#g-${variant})`} filter={`url(#f-${variant})`} />

        <circle cx="60" cy="52" r="22" fill="rgba(255,255,255,0.92)" />
        <path
          d="M25 108c7-26 24-40 35-40s28 14 35 40"
          fill="rgba(255,255,255,0.86)"
        />

        <circle cx="52" cy="48" r="3.6" fill="#0b1020" />
        <circle cx="68" cy="48" r="3.6" fill="#0b1020" />

        <text x="60" y="84" textAnchor="middle" fontSize="18" fontWeight="900" fill="rgba(11,16,32,0.85)">
          {initials || 'S'}
        </text>

        <path
          d="M47 60c3 3 6 4 13 4s10-1 13-4"
          stroke={palette.c}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
      </svg>
    )
  }

  return (
    <div className="homeWrap">
      <div className="homeHero glass">
        <div className="homeHeroLeft">
          <div className="homeKicker">
            <span className="spark">✦</span> Smart Campus Learning Hub
          </div>
          <h1 className="homeTitle">
            Notes. Videos. Attendance. Exams.
            <span className="homeTitleAccent"> All in one place.</span>
          </h1>
          <p className="homeSubtitle">
            A modern productivity dashboard for students — built to keep your learning
            organized and your progress visible every day.
          </p>

          <div className="homeCtas">
            <button type="button" className="primaryBtn homePrimary" onClick={onGetStarted}>
              Get Started
            </button>
            <a className="secondaryLink" href="#features">
              Explore features →
            </a>
          </div>

          <div className="homeHighlights">
            <div className="highlightPill">
              <div className="hpIcon">📚</div>
              <div className="hpText">
                <div className="hpTitle">Notes Vault</div>
                <div className="hpSub">Upload PDFs & search by subject</div>
              </div>
            </div>
            <div className="highlightPill">
              <div className="hpIcon">🎥</div>
              <div className="hpText">
                <div className="hpTitle">Video Library</div>
                <div className="hpSub">Embed YouTube & find instantly</div>
              </div>
            </div>
            <div className="highlightPill">
              <div className="hpIcon">✅</div>
              <div className="hpText">
                <div className="hpTitle">Planner + Streak</div>
                <div className="hpSub">Task completion & momentum</div>
              </div>
            </div>
          </div>
        </div>

        <div className="homeHeroRight">
          <div className="homeStudentsCard glass">
            <div className="studentsTitleRow">
              <div className="studentsTitle">Meet your study team</div>
              <div className="studentsBadge">Students</div>
            </div>
            <div className="studentsRow">
              <div className="studentTile">
                <StudentAvatar variant={0} name="Aarav" />
                <div className="studentName">Aarav</div>
                <div className="studentMeta">Notes + PDFs</div>
              </div>
              <div className="studentTile">
                <StudentAvatar variant={1} name="Meera" />
                <div className="studentName">Meera</div>
                <div className="studentMeta">Attendance</div>
              </div>
              <div className="studentTile">
                <StudentAvatar variant={2} name="Karthik" />
                <div className="studentName">Karthik</div>
                <div className="studentMeta">Exam Countdown</div>
              </div>
            </div>
          </div>

          <div className="homeBadgeRow">
            <div className="tinyBadge">🧊 Glass UI</div>
            <div className="tinyBadge">📱 Mobile Ready</div>
            <div className="tinyBadge">🌙 Dark Mode</div>
          </div>
        </div>
      </div>

      <section className="homeSection" id="features">
        <div className="homeSectionHead">
          <div className="homeSectionKicker">Why students love it</div>
          <h2 className="homeSectionTitle">Everything you need to study smarter</h2>
        </div>

        <div className="featureGrid">
          <div className="featureCard glass">
            <div className="featureIcon">🔐</div>
            <div className="featureTitle">Login & Personal Dashboard</div>
            <div className="featureDesc">
              Your learning tools are organized in one place after sign-in.
            </div>
          </div>
          <div className="featureCard glass">
            <div className="featureIcon">📌</div>
            <div className="featureTitle">Study Progress</div>
            <div className="featureDesc">
              Track totals, completion %, tasks, and keep a streak going.
            </div>
          </div>
          <div className="featureCard glass">
            <div className="featureIcon">🗂️</div>
            <div className="featureTitle">Upload Notes (PDF)</div>
            <div className="featureDesc">
              Save notes locally and download anytime — even offline.
            </div>
          </div>
          <div className="featureCard glass">
            <div className="featureIcon">🧠</div>
            <div className="featureTitle">Video Learning</div>
            <div className="featureDesc">
              Add YouTube links, preview instantly, and search by subject.
            </div>
          </div>
          <div className="featureCard glass">
            <div className="featureIcon">🗓️</div>
            <div className="featureTitle">Attendance Calculator</div>
            <div className="featureDesc">
              Get a clear percentage and status color instantly.
            </div>
          </div>
          <div className="featureCard glass">
            <div className="featureIcon">⏳</div>
            <div className="featureTitle">Exam Countdown</div>
            <div className="featureDesc">
              Pick an exam date and see remaining days automatically.
            </div>
          </div>
        </div>
      </section>

      <section className="homeSection" id="contact">
        <div className="homeSectionHead">
          <div className="homeSectionKicker">Contact us</div>
          <h2 className="homeSectionTitle">Have feedback or questions?</h2>
        </div>

        <div className="contactGrid">
          <div className="contactCard glass">
            <div className="contactTitle">Get in touch</div>
            <div className="contactRow">
              <div className="contactIcon">✉️</div>
              <div className="contactText">
                <div className="contactKey">Email</div>
                <div className="contactVal">smartcampus@example.com</div>
              </div>
            </div>
            <div className="contactRow">
              <div className="contactIcon">📍</div>
              <div className="contactText">
                <div className="contactKey">Location</div>
                <div className="contactVal">Smart Campus, Worldwide</div>
              </div>
            </div>
            <div className="contactRow">
              <div className="contactIcon">💬</div>
              <div className="contactText">
                <div className="contactKey">Support</div>
                <div className="contactVal">Mon–Fri, 9am–5pm</div>
              </div>
            </div>
            <div className="contactNote">
              This app stores your data locally in your browser.
            </div>
          </div>

          <div className="contactForm glass" aria-label="Contact form (demo)">
            <div className="contactTitle">Send a message</div>
            <div className="contactFormGrid">
              <label className="field">
                <span className="labelText">Name</span>
                <input className="input" placeholder="Your name" />
              </label>
              <label className="field">
                <span className="labelText">Email</span>
                <input className="input" placeholder="you@example.com" type="email" />
              </label>
              <label className="field" style={{ gridColumn: '1 / -1' }}>
                <span className="labelText">Message</span>
                <textarea className="textarea" placeholder="Write your message..." />
              </label>
              <button type="button" className="primaryBtn" onClick={onGetStarted}>
                Contact & Get Started
              </button>
            </div>
            <div className="contactFormHint">
              Demo form — click “Get Started” to sign in.
            </div>
          </div>
        </div>
      </section>

      <footer className="homeFooter">
        <div className="homeFooterInner">
          <div className="footerBrand">
            <span className="footerMark">SC</span>
            <span className="footerText">Smart Campus Learning Hub</span>
          </div>
          <div className="footerCopy">© {new Date().getFullYear()} • Built for students</div>
        </div>
      </footer>
    </div>
  )
}
