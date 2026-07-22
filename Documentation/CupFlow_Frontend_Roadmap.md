# CupFlow ERP — Frontend Roadmap

**Stack:** Vite + React (JavaScript) + Plain CSS Modules + Context/Hooks (no state library)
**Approach:** You write the code. I explain the *why*, review what you build, flag mistakes, and help you debug — same mentor model as the backend.
**Goal:** Learn React deeply while building something real, not just glue together a UI.

---

## Global Folder Structure (locked for all phases)

```
cupflow-frontend/
├── src/
│   ├── api/
│   │   └── apiClient.js          # fetch wrapper, JWT injection, ApiResponse unwrapping
│   ├── context/
│   │   └── AuthContext.jsx       # login state, token, current user, role
│   ├── hooks/
│   │   └── useFetch.js           # generic data-fetching hook (loading/error/data/refetch)
│   ├── routes/
│   │   └── ProtectedRoute.jsx    # auth + role gating wrapper
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── materials/
│   │   ├── bom/
│   │   ├── inventory/
│   │   ├── orders/
│   │   ├── production/
│   │   └── dispatch/
│   │       (each module: Page.jsx, components/, api.js, *.module.css)
│   ├── App.jsx
│   └── main.jsx
```

This mirrors your backend package structure on purpose — when you're looking for "where does order creation live," the answer is the same shape on both sides.

---

## Phase F0 — Foundation & Setup

**Why first:** Every other phase depends on being able to call the API, know who's logged in, and route safely. Build this wrong and every later phase inherits the pain.

### Deliverables
1. **Project scaffold** — `npm create vite@latest` (React, JavaScript template)
2. **`apiClient.js`**
   - Wraps `fetch()`
   - Reads base URL from `import.meta.env.VITE_API_BASE_URL`
   - Attaches `Authorization: Bearer <token>` automatically if token exists
   - Unwraps your backend's `ApiResponse<T>` shape (`{ success, message, data }`) so callers just get `data` or a thrown error
   - Centralizes error handling: non-2xx → throw a normalized `ApiError` with status + message
3. **`AuthContext.jsx`**
   - Holds `user`, `token`, `role`, `isAuthenticated`
   - `login(email, password)` → calls `/api/auth/login`, stores token (start with `localStorage`, we'll discuss tradeoffs)
   - `logout()` → clears state + storage
   - Persists across refresh (read token on mount, decode or fetch user)
4. **`useFetch.js`**
   - Generic hook: `const { data, loading, error, refetch } = useFetch(fetchFn, deps)`
   - This is your substitute for React Query — you'll call `refetch()` manually after mutations. This is the most important pattern in the whole app since we have no library doing it for us.
5. **`ProtectedRoute.jsx`**
   - Redirects to `/login` if not authenticated
   - Optionally accepts `allowedRoles` array, redirects to a "not authorized" page otherwise
6. **Base Layout** — Navbar (shows user email + logout), Sidebar (nav links, later filtered by role), content outlet
7. **React Router setup** — route skeleton for all future pages (can be placeholder pages initially)

### Key Learning Targets
- Context API mechanics (provider, consumer, avoiding unnecessary re-renders)
- Custom hooks as the core React abstraction pattern
- `fetch()` API, async/await error handling
- Environment variables in Vite
- Client-side routing and route guarding
- Token storage tradeoffs (localStorage vs memory vs httpOnly cookie) — worth a real discussion before you pick

### Exit Criteria
You can log in, see a protected placeholder dashboard, refresh the page without losing session, and log out.

---

## Phase F1 — Auth + User Management

**Why second:** Smallest real module. Validates your F0 patterns (apiClient, useFetch, ProtectedRoute) against real endpoints before you scale to bigger modules. Cheap to get wrong here.

### Deliverables
1. **Login page** — controlled form (email/password), validation, error display on 401, submits to `AuthContext.login`
2. **Role-aware Sidebar** — nav links filtered by `role` from AuthContext (e.g., "Users" only visible to ADMIN)
3. **User list page** (Admin only) — table via `useFetch(GET /api/users)`
4. **Create user form** — role dropdown; **note:** your backend enum has `'FLOOR SUPERVISOR'` with a space — decide now whether the frontend dropdown value matches that literal string or you translate `FLOOR_SUPERVISOR` ↔ `'FLOOR SUPERVISOR'` at the API boundary
5. **Activate/Deactivate actions** — PATCH call + `refetch()` on success, confirmation before deactivating

### Key Learning Targets
- Controlled form patterns in React (single source of truth per input)
- Conditional rendering based on role
- PATCH mutations + the manual-refetch discipline
- Handling backend enum quirks cleanly at the API boundary rather than scattering special cases through the UI

### Exit Criteria
Admin can log in, view all users, create a new user with any role, and toggle active status — full loop, no page reload needed.

---

## Phase F2 — Materials + BOM

**Why third:** Pure CRUD, but introduces the **reusable table/form component patterns** you'll reuse in every later phase. Get the shape right here once.

### Deliverables
1. **Material list** — table (type, unit, minThreshold)
2. **Create/Edit material form** — reusable for both (same component, different submit handler)
3. **BOM entry list by cup type** — `GET /api/bom/{cupType}` — likely a cup-type selector driving the fetch
4. **Create BOM entry form** — cup type input + material dropdown (fetched from materials list) + qtyPerUnit
5. **Delete BOM entry** — confirmation modal/dialog pattern (you'll reuse this in F6 too)

### Key Learning Targets
- Designing a reusable `<DataTable />` or similar (props-driven columns/rows) without a library
- Select inputs populated from a second API call (dependent data)
- Confirmation-before-destructive-action UX pattern
- Deciding: build one generic form component, or separate components per entity? (worth discussing tradeoffs before coding)

### Exit Criteria
You can define materials and build out a full BOM for a cup type entirely through the UI.

---

## Phase F3 — Inventory

**Why fourth:** First **dashboard-style** (read-heavy, derived-data) screen, and first place `useFetch` + manual refetch really gets tested across multiple triggers.

### Deliverables
1. **Stock summary dashboard** — table of all materials with `availableQty` vs `minThreshold`, visually flagged (color/badge) when below threshold
2. **Stock-in form** — material select, quantity, supplier name, notes; optional `orderId` query param support
3. **Refetch wiring** — after stock-in succeeds, the summary table must refresh — this is your first real test of coordinating state across two components

### Key Learning Targets
- Presenting derived/computed values (available vs threshold) clearly in UI
- Conditional styling based on data values (low-stock highlighting)
- Deciding where "refetch the dashboard" logic should live — lifted state vs context vs prop callback (real architectural decision, we should talk through options)

### Exit Criteria
Recording a stock-in immediately reflects in the dashboard without a manual page refresh.

---

## Phase F4 — Orders

**Why fifth:** The most complex form in the app, and the first place you deal with a **non-trivial response shape** (success + warnings array).

### Deliverables
1. **Order list page** — table with order code, customer, cup type, current stage (as a badge), stock status
2. **Create order form** — customer name, cup type, quantity, expected delivery (date input)
3. **Warning handling** — on successful creation, if `warnings[]` is non-empty, show a distinct banner/modal (order still succeeded — this is not an error state, so don't style it like one)
4. **Order detail page** — full order info, will later link out to production stage view (F5) and dispatch (F6)

### Key Learning Targets
- Designing UI for a response that's "successful but needs attention" — a common real-world pattern most tutorials skip
- Date input handling and formatting (`LocalDate` on backend ↔ `<input type="date">` on frontend)
- Structuring a detail page that will grow (production + dispatch info gets added to this same page in later phases)

### Exit Criteria
You can create an order, see low-stock warnings surfaced clearly if triggered, and view it in both list and detail form.

---

## Phase F5 — Production

**Why sixth:** The visual centerpiece of the app. This is where "plain CSS" earns its keep — building a custom stage stepper from scratch teaches you more than importing one ever would.

### Deliverables
1. **Stage stepper component** — visual representation of all 9 stages, current stage highlighted, completed stages marked distinctly, future stages dimmed
2. **Advance-stage action** — button + modal (quantityReported, notes), calls the advance endpoint, refetches order
3. **Stage log history** — table/timeline of all past transitions (from → to, performed by, timestamp)
4. **Guard states in UI:**
   - At `READY_TO_DISPATCH`: hide/disable "advance" button, show a message pointing to dispatch instead
   - At `DISPATCHED`: fully read-only view, no actions

### Key Learning Targets
- Building a stepper/timeline purely with CSS (flexbox/grid + pseudo-elements for connecting lines) — genuinely useful CSS skill
- Deriving UI state from an enum's ordinal position (matching your backend's `values()[ordinal + 1]` logic conceptually on the frontend, for rendering only — the backend remains the source of truth)
- Designing clear "why can't I click this" affordances (disabled state + explanation) instead of silently hiding actions

### Exit Criteria
An order visibly progresses through all 9 stages via the UI, with full history visible, and correctly locks out actions at the boundary stages.

---

## Phase F6 — Dispatch

**Why seventh:** Small scope, but closes the entire order lifecycle loop — good phase to consolidate everything learned so far.

### Deliverables
1. **Dispatch form** — dispatch date, transporter name, vehicle number, notes; only rendered/enabled when `order.currentStage === 'READY_TO_DISPATCH'`
2. **Dispatch record display** — shown on order detail page once dispatched
3. **Post-dispatch read-only state** — order detail page reflects DISPATCHED as a terminal, non-editable state

### Key Learning Targets
- Combining two related resources (order + its dispatch record) cleanly in one detail view
- Final-state UI design (nothing else can happen to this order — make that obvious, not just technically enforced)

### Exit Criteria
Full lifecycle — create order → advance through all stages → dispatch — is achievable entirely through the UI, end to end.

---

## Phase F7 — Polish & Hardening

**Why last:** Cross-cutting concerns are easiest to get right once you've seen the real patterns repeat across 6 modules. Doing this first would mean guessing; doing it last means refining what you already know works.

### Deliverables
1. **Route guarding audit** — every route checked against `allowedRoles`, unauthorized attempts redirect cleanly (not just a blank page)
2. **Global error boundary** — catches render-time crashes, shows a fallback instead of a white screen
3. **Consistent loading/empty states** — every `useFetch` consumer handles all three states (loading, empty, error) the same way — worth extracting a shared `<AsyncState>` wrapper here now that you've seen the repetition
4. **Global notification/toast system** — built with Context (no library) for success/error feedback after mutations, replacing any ad-hoc alerts from earlier phases
5. **401 / token-expiry handling** — centralized in `apiClient.js`: on 401, clear auth state and redirect to login from anywhere in the app
6. **Responsive pass** — nav collapses on mobile, tables scroll horizontally instead of breaking layout

### Key Learning Targets
- Error boundaries (a React feature most tutorials skip)
- Recognizing repeated patterns across a codebase and extracting them *after* seeing real duplication, not prematurely
- Centralizing cross-cutting concerns (auth expiry) instead of handling them per-component

### Exit Criteria
The app feels cohesive rather than like 7 separately-built modules stitched together.

---

## Working Process (per phase, same as backend)

1. We discuss the phase's architecture and any decisions with multiple valid options (state shape, component boundaries, prop drilling vs context) — decided together before code
2. You build it
3. You share what you've built (code, screenshots, or behavior description) and I review — flag bugs, anti-patterns, or places where a "convenient" shortcut will bite you later
4. We close the phase only when the exit criteria are met
5. At the end of each phase, I'll generate a resume-prompt summary (like we did for the backend) so we can pick up cleanly in a new chat if needed

---

**Next step:** Start Phase F0. First decision to make together: token storage strategy (localStorage vs in-memory vs alternatives) — small decision, real tradeoffs, worth 5 minutes before you write the `AuthContext`.
