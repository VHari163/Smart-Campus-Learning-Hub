# Smart Campus Learning Hub - TODO

## Phase 1: App scaffold + navigation
- [ ] Replace `src/App.jsx` boilerplate with full app shell (state, localStorage integration, global search, routing via internal state).
- [ ] Create `src/components/Navbar.jsx` (sidebar navigation + dark mode toggle + responsive behavior).
- [ ] Create `src/components/Dashboard.jsx` (welcome, counts, study progress card, quick navigation cards, streak, profile, activity).

## Phase 2: Notes management
- [ ] Create `src/components/Notes.jsx` (upload notes incl. PDF to localStorage, list, subject search, download).
- [ ] Wire notes count + global search for notes + activity logging.

## Phase 3: Video learning
- [ ] Create `src/components/Videos.jsx` (add YouTube link, embed preview, search).
- [ ] Wire videos count + global search for videos + activity logging.

## Phase 4: Attendance calculator
- [ ] Create `src/components/Attendance.jsx` (compute % and color status).
- [ ] Wire attendance status into dashboard cards if needed + activity logging.

## Phase 5: Exam countdown
- [ ] Create `src/components/Countdown.jsx` (exam date picker + remaining days computation).
- [ ] Wire into dashboard + activity logging.

## Phase 6: Study planner
- [ ] Create `src/components/StudyPlanner.jsx` (daily tasks add/complete + progress bar).
- [ ] Wire global search for tasks + activity logging.

## Phase 7: Dark mode + styling
- [ ] Update `src/index.css` (glassmorphism base styles + theme hooks).
- [ ] Update `src/App.css` (glass cards, sidebar, transitions, animations).
- [ ] Ensure dark mode toggle persists via localStorage.

## Phase 8: Login
- [ ] Create `src/components/Login.jsx` (username/password form; on success navigates to Dashboard; persists auth in localStorage).

## Phase 9: Verify
- [ ] Run `npm run dev` and validate:
  - [ ] Login → dashboard navigation
  - [ ] Dark mode persistence
  - [ ] Notes upload/list/search/download
  - [ ] Video embed/search
  - [ ] Attendance calculator correctness + colors
  - [ ] Exam countdown days
  - [ ] Study planner progress
  - [ ] Global search across Notes/Videos/Tasks
- [ ] Run `npm run build` to ensure no errors.
