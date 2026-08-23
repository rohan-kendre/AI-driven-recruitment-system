# NexHire Implementation Plan

> **Status:** Initial implementation roadmap  
> **Companion source of truth:** `docs/architecture.md`  
> **Scope:** Documentation only. This plan does not authorize application code, dependencies, or infrastructure creation by itself.

## 1. Planning Principles

This roadmap implements NexHire as the approved modular MERN monolith: React/Vite/Tailwind on the client, Express/Mongoose on the server, MongoDB Atlas, Cloudinary, Gemini, Nodemailer, and PDFKit. Work proceeds as RAD increments: each increment produces a small usable vertical slice with UI, API, validation, authorization, persistence, and verification where applicable.

Use only the technologies in `architecture.md`. Do not add Redux, TanStack Query, Zod, Shadcn/UI, microservices, WebSockets, or Phase 2 Judge0 dependencies to MVP. Backend flows remain `Route → Middleware → Controller → Service → Model`; Gemini stays behind one central `aiService`; eligibility and ranking remain deterministic server logic.

### Exact dependency-aware build sequence

```text
Repository conventions and environment templates
→ MongoDB/Express/React foundations and shared error/API contracts
→ users, authentication, refresh sessions, approval state, RBAC
→ student profile and profile-completeness checks
→ resume versions, Cloudinary, extraction, cache-aware ATS advice
→ company/recruiter data, jobs, search/filter, deterministic eligibility
→ applications, status history, recruiter applicants, ranking foundation
→ interviews and persistent/email notifications
→ standalone AI mock interviews
→ offer PDFs, Cloudinary references, delivery email
→ aggregation analytics and Recharts dashboards
→ TPO/Admin operational modules, announcements, audit logs, complaints
→ full integration, security/performance hardening, test completion
→ production deployment and smoke testing
→ optional isolated Judge0 coding assessment
```

No phase may bypass its listed dependencies. In particular, AI work waits for the stable auth, profile, upload, error, and persistence foundations; applications wait for jobs and student data; offers wait for selected applications; dashboards wait for meaningful data.

## 2. Expected Project Structure

The implementation must remain small and understandable. Add a folder only when it has a clear, recurring responsibility.

```text
client/
  src/
    assets/                 # static assets
    components/             # reusable presentational components
    context/                # AuthContext and a minimal optional UI context
    data/                   # static option lists/constants safe for the browser
    features/               # domain components and domain hooks
    hooks/                  # generic reusable hooks
    layouts/                # PublicLayout and role-aware dashboard layouts
    pages/                  # route-level pages, grouped by public/student/recruiter/tpo/admin
    services/               # Axios instance and domain API modules
    types/                  # shared JSDoc or TypeScript-ready shapes, using one chosen convention
    utils/                  # formatting, dates, display/status helpers
    App.jsx
    main.jsx

server/
  src/
    config/                 # environment, database, Cloudinary, mail configuration
    constants/              # roles, enums, limits, status transition rules
    controllers/            # thin HTTP request/response adapters
    middleware/             # auth, RBAC, ownership, validation, uploads, errors, rate limits
    models/                 # Mongoose schemas and indexes
    routes/                 # domain routes and middleware composition
    services/               # business logic, integrations, aggregation/ranking services
    validators/             # request validation rules
    utils/                  # tokens, async wrapper, API errors, pagination, PDF helpers
    app.js                  # Express assembly
    server.js               # startup

docs/
  architecture.md           # approved architectural source of truth
  implementation-plan.md    # this roadmap
```

`features/` contains domain-specific UI (for example `features/resumes/ResumeUploadForm`) while `components/` contains reusable non-domain UI. `services/` on both client and server are deliberately direct, small modules—there is no repository or factory layer.

## 3. Development Phases

### Phase 0 — Project Foundation

**Purpose:** establish safe, consistent skeletons that every later vertical slice uses.

- **Features:** repository conventions, README contribution notes if needed, client/server application shells, `.env.example` files, common API response/error shape, role/status constants, public landing placeholder and shared layout primitives.
- **Backend:** configure Express JSON limits, Helmet, controlled CORS, rate-limit middleware, async error wrapper, API error middleware, health endpoint, MongoDB connection bootstrap, configuration validation, and route mounting pattern.
- **Frontend:** Vite/React shell, Tailwind setup, React Router structure, Axios instance with credentials support, public/dashboard layouts, generic loading/error/empty/form components, notification/toast display convention.
- **Database:** connect to development MongoDB; no business schemas required beyond a connection health check.
- **Integration:** verify browser-to-API health request and uniform error rendering.
- **Dependencies:** none.
- **Completion criteria:** client and server start independently; health endpoint succeeds; invalid API request returns safe standard JSON; no secrets committed; lint/format convention is documented; basic responsive shell renders.

### Phase 1 — Authentication & User Management

**Purpose:** establish identities, sessions, approval, and access boundaries before protected features.

- **Features:** student/recruiter registration, login/logout, access refresh, forgot/reset password, account status, approval queues, role-aware navigation and guards.
- **Backend:** `User` model; bcrypt password handling; JWT access/refresh helpers; hashed rotating refresh sessions; auth controller/service/routes; auth/RBAC middleware; password-reset mail service; initial Admin/TPO provisioning method; safe account management endpoints.
- **Frontend:** public landing, login, registration role selection/forms, forgot/reset pages, `AuthContext`, in-memory access token, one refresh-and-retry Axios rule, protected/role route wrappers.
- **Database:** `users`, plus minimal `students`/`recruiters` profile creation in the same registration workflow as approved; indexes on email and role/status.
- **Integration:** deployed-cookie-compatible CORS configuration is exercised locally; registration causes the correct pending profile/account state.
- **Dependencies:** Phase 0.
- **Completion criteria:** only approved active accounts can obtain sessions; refresh rotation/logout/reset revoke sessions correctly; unauthorized/forbidden/ownership responses are distinguishable; all four roles can be safely provisioned/tested.

### Phase 2 — Student Profile

**Purpose:** make student data authoritative for eligibility and resume context.

- **Features:** personal/education/CGPA/branch/backlogs/skills/projects/experience/certifications/achievements management and profile completeness indicator.
- **Backend:** complete `Student` model, profile routes/controller/service, ownership enforcement, validators for bounded CGPA/backlogs and structured arrays, safe profile projections.
- **Frontend:** student dashboard starter, profile page, profile sections/forms using React Hook Form, reusable chip/list editor where justified, save/cancel, loading/error/empty states.
- **Database:** finalize `students` indexes/validation; do not duplicate profile data in User.
- **Integration:** registered student reaches profile only after authentication; dashboard reads persisted summary.
- **Dependencies:** Phase 1.
- **Completion criteria:** a student can only view/edit their own profile; malformed or out-of-range data is rejected at client and server; a complete valid profile is available to later eligibility/resume services.

### Phase 3 — Resume Upload & ATS Analysis

**Purpose:** implement versioned, secure student resumes and advisory ATS results.

- **Features:** PDF/DOCX upload (maximum 5 MB), current/previous version list, authorized download/view, structured extraction display, ATS score/history/suggestions, retryable analysis status.
- **Backend:** `Resume` model; Multer validation; Cloudinary configuration/service; SHA-256 normalized-content hashing; PDF/DOCX text extraction utilities; `aiService` scaffold and prompt version storage; resume controller/service/routes; private-file access rules; cache lookups; external-service error handling/rate limits.
- **Frontend:** resume management page, upload form/progress state, version cards, ATS results page/panel, clear processing/failed/empty states. No Gemini key or Cloudinary secret reaches the browser.
- **Database:** `resumes` metadata, content hash, extraction, structured data, versioned analysis results, current-version rule and indexes.
- **Integration:** upload → validate → hash/cache → Cloudinary → extract → Gemini → persist works against controlled sample files; cache hit does not call Gemini.
- **Dependencies:** Phases 1–2 plus Cloudinary/Gemini configuration.
- **Completion criteria:** invalid/oversized files fail safely; only owner can access resume records/files; prior versions remain; Gemini failure preserves previous success and surfaces a retryable message.

### Phase 4 — Jobs & Eligibility

**Purpose:** let approved employers publish placement opportunities and students discover them.

- **Features:** company/recruiter foundations, job create/edit/publish/close, public-authorized job browse/search/filter/detail, deterministic eligibility preview/check.
- **Backend:** `Company`, complete `Recruiter`, and `Job` models; company/recruiter approval checks; jobs controller/service/routes; query pagination/filter/sort allowlist; eligibility service; job validators; recruiter-company ownership middleware.
- **Frontend:** recruiter company profile and job pages; create/edit job form; student jobs list/filter/search/detail; eligibility explanation component.
- **Database:** companies, recruiters, jobs, approved-status indexes and job list indexes/text index only if search needs it.
- **Integration:** approved recruiter can publish only for their company; student job details show backend-calculated eligibility, never client-calculated authority.
- **Dependencies:** Phases 1–2; TPO approval UI may arrive later, but seed/provision approved test company/recruiter data for this phase.
- **Completion criteria:** closed/expired/unapproved jobs cannot accept applications; query controls are paginated and safe; eligibility correctly applies CGPA, branch, and backlogs.

### Phase 5 — Applications & Recruiter Workflow

**Purpose:** deliver the core placement transaction and transparent recruitment pipeline.

- **Features:** apply with a resume version, duplicate prevention, student application tracking/timeline/withdrawal, recruiter applicant lists/details/filter/sort, permitted status progression, ranking view marked appropriately for absent coding score.
- **Backend:** `Application` model; application and ranking services; controlled transition constants; status-history append logic; candidate/job/company ownership checks; application routes/controllers/validators; transaction where application plus initial history requires atomicity; notification-service interface integration.
- **Frontend:** student applications and application-detail/timeline pages; recruiter jobs/applicants/applicant-detail workflow; status action controls with confirmation; ranking component displaying inputs and incomplete/available-weight policy.
- **Database:** applications compound unique `{student,job}`, pipeline/history indexes, eligibility snapshots and ranking component storage/projection.
- **Integration:** application retrieves authoritative current profile/job/resume data; every status change records actor/time and creates an in-app notification.
- **Dependencies:** Phases 2–4 and resume selection from Phase 3.
- **Completion criteria:** duplicate/unauthorized applications fail; withdrawal cutoff is enforced; recruiter cannot view another company’s applicants; arbitrary status updates are impossible; status history is complete.

### Phase 6 — Interviews & Notifications

**Purpose:** move eligible candidates through auditable scheduling while keeping users informed.

- **Features:** schedule/reschedule/cancel/complete interviews, recruiter feedback, student interview views, notification inbox/read state, emails for critical events, announcements read view.
- **Backend:** `Interview`, `Notification`, and `Announcement` models; interview service/routes/controllers/validators; notification/email services; notification list/read/archive endpoints; schedule transition checks and UTC handling; TPO/Admin announcement authorization.
- **Frontend:** student/recruiter interview pages and schedule/feedback forms; notifications page/bell; announcement listing; reusable status/timeline/date-time components.
- **Database:** indexes for application/company/interview schedule, recipient notification list, announcement publication status.
- **Integration:** every schedule change persists then creates notification/email; completed feedback can only update authorized application state via application service.
- **Dependencies:** Phase 5 plus SMTP configuration for email verification (in-app notifications remain usable if SMTP is unavailable).
- **Completion criteria:** conflicts/invalid dates/missing meeting information are validated; notices are recipient-scoped; schedule changes are visible in both role views; notification email failure does not roll back a valid core update but is logged safely.

### Phase 7 — AI Mock Interview

**Purpose:** add the independent, bounded-call practice interview experience.

- **Features:** domain selection, full question-set generation, answer saving, single final evaluation, score/suggestion review and session history.
- **Backend:** `MockInterviewSession` model; mock interview controller/service/routes/validators; add `generateInterviewQuestions` and `evaluateMockInterview` to central `aiService`; response JSON validation, prompt version metadata, rate limits, idempotent final submission protection.
- **Frontend:** student mock-interview landing, session/question/answer experience using `useReducer`, review/submit flow, persisted results/history, warning that AI is advisory.
- **Database:** sessions, question snapshots, answers, evaluation, state/timestamps/indexes.
- **Integration:** exactly one Gemini generation call per started session and one evaluation call per submitted complete session; saving individual answers does not call Gemini.
- **Dependencies:** Phases 1–2 and stable AI foundation from Phase 3.
- **Completion criteria:** student can access only own sessions; incomplete sessions cannot be evaluated; provider failures are recoverable without losing saved answers; no recruiter-selection data is altered by mock results.

### Phase 8 — Offer Letters

**Purpose:** generate authorized offer documentation and delivery records.

- **Features:** recruiter offer form, PDF preview/download, persisted offer record, email delivery status, student offer view.
- **Backend:** `Offer` model; PDFKit generator utility; offer service/controller/routes/validators; Cloudinary PDF storage; idempotency guard; application selected-state/ownership checks; notification/email integration.
- **Frontend:** recruiter selected-candidate offer form/list; student offers page/detail/download; clear generated/sent/failed delivery feedback.
- **Database:** offers with application uniqueness, candidate/company snapshots, PDF reference, email/delivery timestamps/status.
- **Integration:** generate → store/reference → persist → status/history update where appropriate → notify/email, with safe retry behavior.
- **Dependencies:** Phases 5–6 and Cloudinary/SMTP.
- **Completion criteria:** only authorized recruiter can create one valid offer for a selected application; document fields come from server-authorized data; generated PDF is accessible only to authorized roles.

### Phase 9 — Analytics

**Purpose:** turn persisted placement data into role-scoped, understandable dashboards and reports.

- **Features:** student progress, recruiter funnel, TPO placement/department/package/company metrics and reports, Admin platform activity summaries.
- **Backend:** analytics service with MongoDB aggregation pipelines; role-specific analytics routes/controllers; date/filter validators; report PDFKit utility where required; bounded pagination/projections.
- **Frontend:** dashboard completion for all roles; Recharts cards/funnels/trends; filter controls; empty/no-data and aggregation-error states.
- **Database:** no new core model required beyond indexes already defined; review indexes after sample aggregation explain plans.
- **Integration:** charts receive only authorized aggregate data; reports use same service results as dashboards.
- **Dependencies:** Phases 2–8; seed/demo data is needed for useful QA.
- **Completion criteria:** aggregates reconcile with underlying data for test fixtures; recruiter data is company-scoped; dashboards remain useful with zero records and do not expose raw private records.

### Phase 10 — TPO & Admin

**Purpose:** complete institution/platform governance without weakening module-level permissions.

- **Features:** TPO approvals, student/company monitoring, placement drives, announcements, reports; Admin users/companies, complaints, audit logs, platform announcements and analytics.
- **Backend:** `ActivityLog` and `Complaint` models; TPO/Admin routes/controllers/services/validators; audit-log helper for material Admin actions; approval operations call existing account/company services; placement-drive representation is initially a job grouping/status policy unless a distinct model becomes necessary.
- **Frontend:** TPO dashboard, approvals/students/companies/drives/announcements/analytics/reports; Admin dashboard/users/companies/complaints/audit/announcements/analytics.
- **Database:** activity logs, complaints, finalized announcements; do not add a `PlacementDrive` collection without an approved architecture update.
- **Integration:** administrative modifications emit audit records; approval changes immediately affect existing auth/job permissions.
- **Dependencies:** Phases 1, 4–6, and 9 for complete dashboards.
- **Completion criteria:** TPO institutional visibility and Admin platform authority are distinct; admin actions have minimum actor/action/target/timestamp records; complaint handling and announcements are recipient-safe.

### Phase 11 — System Integration & Hardening

**Purpose:** make independently built modules behave as one secure application.

- **Features:** end-to-end role journeys, cross-module error recovery, data cleanup safeguards, accessibility/responsive corrections, secure production settings.
- **Backend:** audit all routes for authentication/RBAC/ownership; finalize CORS/cookie/Helmet/rate limits/body limits; safe logging/redaction; pagination and query-limit review; index review; backup/retention operating notes.
- **Frontend:** route/navigation permissions audit, token-refresh edge cases, unified error boundaries/feedback, mobile/tablet QA, accessibility labels/keyboard paths.
- **Database:** migration/seed plan for development fixtures only; index verification; no production destructive cleanup without approval.
- **Integration:** test complete Student, Recruiter, TPO, and Admin journeys against one environment.
- **Dependencies:** MVP feature phases 0–10.
- **Completion criteria:** all documented endpoints have a security review; no secret/client-token leakage; role flows work after refresh/login/logout; defects found in integration are fixed or tracked with explicit severity.

### Phase 12 — Testing

**Purpose:** execute the incremental test plan comprehensively and capture evidence.

- **Features:** automated tests where team tooling permits, repeatable API/manual test checklist, regression matrix, UAT/demo scripts.
- **Backend:** unit tests for pure eligibility/ranking/transition/PDF utilities; integration tests for auth, authorization, uploads, application/interview/offer services; controlled mocks for Gemini/Cloudinary/SMTP.
- **Frontend:** page/form/route-guard tests where selected test tooling is added deliberately; otherwise structured manual browser test evidence for every feature.
- **Database:** isolated test database/configuration; fixtures for roles, jobs, applications, and boundary data.
- **Integration:** full regression against a staging-like deployment.
- **Dependencies:** Phases 0–11.
- **Completion criteria:** critical-path tests pass, high-severity defects are resolved, test results and known limitations are documented, and no regression is introduced by final fixes.

### Phase 13 — Deployment

**Purpose:** release the MVP safely to the approved free-tier stack.

- **Features:** Vercel client deployment, Render API deployment, Atlas/Cloudinary/Gemini/SMTP production configuration, smoke test and operating notes.
- **Backend:** production start/health configuration, production CORS allowlist, secure cookies, secret configuration, error/log verification.
- **Frontend:** production API base URL, Vercel routing fallback, environment-safe build, production UI smoke checks.
- **Database:** Atlas credentials/network configuration, required indexes confirmed, least-privilege application user where available.
- **Integration:** deployed cross-origin cookie refresh, private document access, Gemini, Cloudinary, email, and PDF flow tests.
- **Dependencies:** Phases 0–12.
- **Completion criteria:** all four role smoke paths work over HTTPS; no browser CORS/cookie errors; no secrets in repository/build; deployment URLs and rollback/redeploy steps are documented.

### Phase 14 — Phase 2 Coding Assessment (Optional)

**Purpose:** add Judge0-backed tests without making MVP depend on them.

- **Features:** coding test creation, questions, student submissions, execution result, score storage, optional ranking input.
- **Backend:** `CodingTest`, `Question`, `Submission` models; `codingAssessmentService` adapter; optional route mount; hidden-test protection; submission validation/rate controls; Judge0 error/timeout handling.
- **Frontend:** recruiter test builder; student test/submission views; result display; clearly indicated optional coding score.
- **Database:** Phase 2 indexes/retention rules from architecture; never send hidden test cases to clients.
- **Integration:** MVP ranking treats absent score as `null`; feature flag/config controls availability.
- **Dependencies:** Phases 4–5 and an approved Judge0 deployment/API configuration.
- **Completion criteria:** core NexHire continues to work when Judge0 is off/unavailable; execution data is scoped/secure; ranking policy for absent versus available scores is approved and tested.

## 4. Database Implementation Order

| Order | Model(s) | Why it is implemented at this point |
|---:|---|---|
| 1 | `User` | Owns identity, roles, account/approval state, and refresh sessions. |
| 2 | `Student` | Required for authenticated profile, eligibility, resumes, and applications. |
| 3 | `Company` | Establishes employer identity and approval boundary before recruiter work. |
| 4 | `Recruiter` | Links a recruiter user to a company and enables job ownership checks. |
| 5 | `Resume` | Depends on Student; needed before applications can select a version. |
| 6 | `Job` | Depends on Company/Recruiter; defines eligibility rules. |
| 7 | `Application` | Depends on Student, Job, and selected Resume; embeds status history/snapshots. |
| 8 | `Notification` | Consumed by application and later interview/offer actions. |
| 9 | `Interview` | Depends on authorized Application/Job/Student/Company relationships. |
| 10 | `MockInterviewSession` | Depends only on Student but is scheduled after stable AI/resume foundations. |
| 11 | `Offer` | Depends on selected Application and company/candidate snapshots. |
| 12 | `Announcement` | Needed by TPO/Admin and notification/read experiences. |
| 13 | `ActivityLog`, `Complaint` | Governance models depend on actor/users and Admin workflows. |
| 14 | `CodingTest`, `Question`, `Submission` | Strictly optional Phase 2; depends on Jobs, Students, and recruiters. |

Implement model validation and indexes at creation time. Each dependent service must query resources under the authenticated scope rather than trusting submitted ObjectIds.

## 5. Backend Domain Roadmap

| Domain | Models / API responsibility | Controllers and services | Middleware / validators / rules | Verification |
|---|---|---|---|---|
| Auth | User; registration/session/reset | `authController`, `authService`, token/email utilities | auth, rate limit; email/password/reset validation; bcrypt, rotating hashed refresh tokens, pending account block | login/refresh/logout/reset, expired/revoked tokens |
| Users | User account state/role-safe views | `userController`, `userService` | authenticate/RBAC/ownership; status/role validation; Admin provisioning/deactivation rules | no role escalation or private field exposure |
| Students | Student profile | `studentController`, `studentService` | student ownership; profile validators; CGPA 0–10, backlogs non-negative | own profile only, malformed nested data rejected |
| Recruiters | Recruiter membership/company profile | `recruiterController`, `recruiterService` | recruiter/company ownership; approval checks | recruiter cannot act for another company |
| Companies | Employer record/status | `companyController`, `companyService` | TPO/Admin approval or recruiter-scoped edit rules | unique normalized name; approval gates publishing |
| Jobs | Job CRUD/search/detail/eligibility | `jobController`, `jobService`, `eligibilityService` | authenticated roles; recruiter-company scope; query/job validators | pagination, deadline/status validation, deterministic eligibility |
| Resumes | Resume versions/download/ATS results | `resumeController`, `resumeService`, extraction/Cloudinary adapters | upload middleware; owner checks; PDF/DOCX/5 MB validation | cache hit, parsing/provider failure, private access |
| Applications | apply/withdraw/list/status/rank | `applicationController`, `applicationService`, `rankingService` | student/recruiter scope; application/status validators; fixed transitions | duplicate block, status history, cutoff, transparent score |
| Interviews | schedules/feedback | `interviewController`, `interviewService` | company/application ownership; date/mode/feedback validators | allowed lifecycle, notifications, UTC display |
| Offers | PDF generation/delivery/view | `offerController`, `offerService`, PDF/email/Cloudinary utilities | selected application/company scope; offer fields validators | idempotent creation, access, email failure behavior |
| Notifications | inbox/read/archive | `notificationController`, `notificationService`, `emailService` | recipient scope; read/archive validation | recipient isolation and non-blocking email failures |
| Analytics | role dashboards/reports | `analyticsController`, aggregation/report service | role/company scope; date/filter validators | aggregate reconciliation and zero-data behavior |
| TPO | approvals/monitoring/drives/reports | `tpoController`, `tpoService` | TPO RBAC; approval/action validators | institution-wide but not unrestricted Admin access |
| Admin | users, companies, complaints, audit | `adminController`, `adminService`, audit helper | Admin RBAC; destructive-action validation | audit actor/action/target and scoped complaint handling |
| AI | no raw provider proxy; resume/mock orchestration | `aiController`, central `aiService`, prompts | auth/owner checks; request bounds/rate limits; strict response parsing | malformed JSON, quota/timeout, cached result behavior |
| Coding assessment (Phase 2) | tests/questions/submissions | controllers/services plus `codingAssessmentService` | feature enablement, owner/student scope, hidden-test protection | Judge0 down does not affect MVP |

Tests are added with each domain rather than deferred: pure services first, then controller/route authorization and boundary cases. Controller code remains thin—business rules belong in the named service.

## 6. API Implementation Checklist

Endpoint names below are planning targets, not final payload contracts. All protected routes require the authentication/RBAC/ownership sequence from architecture.

### Auth and users

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me`
- `GET /api/users` and `PATCH /api/users/:id/status` (Admin-scoped)

### Profiles and companies

- `GET`, `PUT /api/students/profile`
- `GET`, `PUT /api/recruiters/profile`
- `GET /api/companies`, `GET /api/companies/:id`
- `POST /api/companies`, `PUT /api/companies/:id` (authorized workflow)
- approval endpoints under `/api/tpo` or `/api/admin`, not public company routes

### Jobs and applications

- `GET /api/jobs`, `GET /api/jobs/:id`
- `POST /api/jobs`, `PUT /api/jobs/:id`, `PATCH /api/jobs/:id/status`, `DELETE /api/jobs/:id` (authorized recruiter workflow)
- `GET /api/jobs/:id/eligibility`
- `POST /api/applications`, `GET /api/applications`, `GET /api/applications/:id`
- `PATCH /api/applications/:id/withdraw`
- `GET /api/jobs/:jobId/applications`, `PATCH /api/applications/:id/status`, `GET /api/jobs/:jobId/ranking`

### Resumes, interviews, offers, notifications

- `POST /api/resumes`, `GET /api/resumes`, `GET /api/resumes/:id`, `PATCH /api/resumes/:id/current`, `GET /api/resumes/:id/download`
- `GET /api/resumes/:id/analysis`, `POST /api/resumes/:id/analyze` only if explicit re-analysis policy is approved
- `POST /api/interviews`, `GET /api/interviews`, `GET /api/interviews/:id`, `PATCH /api/interviews/:id`, `PATCH /api/interviews/:id/cancel`, `PATCH /api/interviews/:id/complete`
- `POST /api/offers`, `GET /api/offers`, `GET /api/offers/:id`, `GET /api/offers/:id/download`, `POST /api/offers/:id/send-email`
- `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `PATCH /api/notifications/read-all`
- `GET /api/announcements`

### AI, analytics, TPO, and Admin

- `POST /api/ai/mock-interviews`, `GET /api/ai/mock-interviews`, `GET /api/ai/mock-interviews/:id`
- `PATCH /api/ai/mock-interviews/:id/answers`, `POST /api/ai/mock-interviews/:id/submit`
- `GET /api/analytics/student`, `/recruiter`, `/tpo`, `/admin`; authorized report endpoint(s) as finalized
- `/api/tpo/approvals`, `/students`, `/companies`, `/announcements`, `/reports` for TPO actions
- `/api/admin/users`, `/companies`, `/complaints`, `/activity-logs`, `/announcements`, `/analytics` for Admin actions
- **Phase 2 only:** `/api/coding-tests`, nested/authorized question and submission routes

## 7. Frontend Route and Component Roadmap

All pages use role-aware layouts, Axios domain services, and a consistent loading/error/empty-state pattern. `AuthContext` is the only required global state; page data normally uses local state/hooks. Forms use React Hook Form with matching client validation and server error display.

| Area/page | API dependencies and major components | State, forms, and verification states |
|---|---|---|
| Public: landing | none initially; Hero, role overview, CTA | local navigation only; responsive/accessible layout |
| Public: login/register/forgot/reset | auth endpoints; AuthForm, PasswordField, role selector | AuthContext; RHF validation; submitting/error/success/expired-token states |
| Student: dashboard | `/analytics/student`, profile/resume summaries | local fetch state; metric cards/progress; zero-data/error states |
| Student: profile | student profile endpoints; ProfileSection, Skill/Project editors | RHF + local list state; required/range validation; loading/saving/empty states |
| Student: resume/ATS | resume endpoints; UploadForm, VersionList, AnalysisPanel | upload/processing/retry state; MIME/size messaging; no-resume/analysis-failed states |
| Student: jobs/detail | job list/detail/eligibility; JobFilters, JobCard, EligibilityPanel | filter/query local state; pagination, loading/no matches/ineligible explanation |
| Student: applications/detail | application endpoints; ApplicationTable, StatusTimeline, WithdrawDialog | local list/detail state; withdrawal confirmation, empty timeline/error states |
| Student: interviews | interviews endpoint; InterviewCard, schedule details | local filters; date/mode states; no-interview state |
| Student: mock interview | AI mock endpoints; DomainForm, QuestionStepper, AnswerEditor, Results | `useReducer` session state; save/submitting/provider-failure/review states |
| Student: offers/notifications | offer/notification endpoints; OfferCard, NotificationList | read updates local state; empty/download/email-status states |
| Recruiter: dashboard | `/analytics/recruiter` | cards/funnel charts; company-scoped zero/error states |
| Recruiter: company profile | recruiter/company endpoints; CompanyProfileForm | RHF; pending/approved state; ownership errors |
| Recruiter: jobs/create/edit | job endpoints; JobTable, JobForm, StatusControl | RHF arrays/date/numbers; draft/published/closed/loading/error states |
| Recruiter: applicants/detail | job applications/ranking/status endpoints; ApplicantTable, FilterBar, CandidatePanel, Timeline | filters/sort/pagination local state; transition confirmation/errors; transparent ranking presentation |
| Recruiter: interviews/offers | interview/offer endpoints; ScheduleForm, FeedbackForm, OfferForm/PDF action | RHF; selected-candidate enforcement shown; generated/sent/retry state |
| Recruiter: analytics | `/analytics/recruiter`; Recharts funnel/trend | date filter state; no-data/error states |
| TPO: dashboard/approvals | TPO analytics/approval endpoints; ApprovalTable, StatusAction | local queue/filter state; confirmation, audit-safe errors, empty queues |
| TPO: students/companies/drives | TPO monitor/job grouping endpoints; tables/detail panels | paginated filters; no-data/permission states |
| TPO: announcements/analytics/reports | TPO announcement/analytics/report endpoints; AnnouncementForm, charts, report action | RHF/date filters; publish/report download/error states |
| Admin: dashboard/users/companies | Admin analytics/user/company endpoints; tables/status actions | local filter/pagination; deactivation/delete confirmation only where policy allows |
| Admin: complaints/audit/announcements | Admin complaint/log/announcement endpoints; ComplaintPanel, AuditTable, AnnouncementForm | local data; resolution/publish validation; immutable audit display and empty states |

Keep API calls in domain modules such as `services/authApi.js`, `services/jobsApi.js`, not inside presentation components. Route guards are UX guards; endpoint enforcement remains on the server.

## 8. AI Implementation Plan

AI begins only after Phase 3’s normal upload/extraction/persistence path is stable.

1. Create one backend-only `aiService` and a prompt directory near it. Store prompt identifiers/versions as constants; never store API keys or call Gemini from React.
2. Define request/response shapes for extracted resume data, ATS analysis, question generation, and final mock evaluation. Validate parsed structured output before persistence.
3. Implement resume text extraction first using `pdf-parse`/`mammoth`, with clear unsupported/empty/corrupt-file outcomes.
4. Hash normalized file content; find a successful matching result before requesting Gemini. Persist cache-relevant hash, model, prompt version, timestamps, and result status.
5. Call `extractResumeData` and `analyzeResume` through the resume service only. Store safe advisory outputs; preserve previous success if a newer call fails.
6. Add bounded timeouts and retry only safe transient provider failures. Apply rate limits to expensive AI endpoints and return safe retry guidance.
7. Add mock questions as one generation call when starting a session. Save answers normally. Send all completed answers in one final evaluation call only.
8. Mock provider responses in tests for normal, malformed JSON, timeout, quota, and partial-result cases. Verify AI never updates eligibility, ranking, or selection.

## 9. RAD Increments

| Increment | Usable outcome / demo | Completed dependencies | Test focus |
|---|---|---|---|
| 1 — Foundation + Authentication | public shell; approved users can register/login/refresh/logout and see role shell | Phase 0–1 | auth security, cookies, RBAC, route guards, standard errors |
| 2 — Student Profile + Resume | student creates profile, uploads resume, sees versioned ATS advice | Phases 2–3 | ownership, profile bounds, upload/parser/cache/AI failures |
| 3 — Jobs + Eligibility | approved recruiter publishes jobs; student searches and sees server eligibility | Phase 4 | job ownership, filtering/pagination, eligibility boundaries |
| 4 — Applications + Recruiter Workflow | student applies/tracks; recruiter views and progresses own applicants | Phase 5 | duplicate prevention, transitions/history, withdrawal, company isolation |
| 5 — Interviews + Notifications | recruiters schedule/feedback; students receive and read notices | Phase 6 | scheduling transitions, recipient isolation, mail failure behavior |
| 6 — AI Mock Interview + Offers | student completes practice session; selected candidate receives PDF offer | Phases 7–8 | two-call AI rule, saved answers, PDF authorization/idempotency |
| 7 — Analytics + TPO/Admin | dashboards/reports; approvals, announcements, complaints, audits work | Phases 9–10 | aggregation correctness, role boundaries, audit records |
| 8 — Integration + Testing + Deployment | secure end-to-end deployed MVP | Phases 11–13 | regression, responsive UI, production cookie/CORS/external-service smoke tests |

At the end of each increment, demonstrate the named path with seeded non-sensitive data, run its regression checklist, and record defects before accepting the next increment.

## 10. Suggested Four-Person Parallelization

All members share this architecture and agree route contracts before parallel coding. No person owns a private architecture branch.

| Member | Primary responsibility | Parallel-safe work | Mandatory integration points |
|---|---|---|---|
| A — Core/backend | foundation, auth/users, middleware, error/config patterns | Phase 0–2 backend, test fixtures, security reviews | defines API conventions with all; supports every auth/RBAC merge |
| B — Student/frontend | shared UI, auth screens, student profile/resume/applications UI | client layouts/components, student feature pages | aligns upload/forms with A/D APIs; owns responsive regression support |
| C — Recruitment | companies/recruiters/jobs/applications/interviews backend+UI | recruiter flow, eligibility/ranking, application transitions | shares status constants with A; integrates notification calls with D |
| D — Services/operations | resumes/AI, notifications/email, offers, analytics, TPO/Admin | external integrations and dashboards after API foundations | uses A’s error/config contracts; coordinates data shapes with B/C |

Suggested sequencing: everyone collaborates on Phase 0; A+B deliver Increment 1; C can begin job UI contracts while A completes profile foundations; D begins mocked AI/PDF service design only after core error/config patterns exist. Merge vertical slices frequently into `develop`; resolve API contract changes before starting dependent screens. At least two people review auth, authorization, and data-deletion changes.

## 11. Incremental Testing Strategy

- **API:** test success, validation, malformed IDs, pagination/filter limits, not-found, conflict, and standardized error shape per domain.
- **Authentication:** wrong password, pending/rejected/inactive accounts, expiry, refresh rotation/reuse, logout, password reset, cookie attributes.
- **RBAC and ownership:** for every protected action, test allowed role, wrong role, and same-role foreign-resource access.
- **Forms:** required, type/range/date, nested list, and server-validation feedback; preserve entered data on safe recoverable failures.
- **Files:** PDF/DOCX valid files, wrong type/extension, 5 MB boundary, corrupt/empty files, Cloudinary/parser failure, private download authorization.
- **AI:** cache hit, malformed structured response, quota, timeout, retry, persisted prompt/model metadata, and proof that no AI result alters deterministic rules.
- **Eligibility/ranking:** CGPA/branch/backlog boundaries; duplicate applications; Phase 2 coding score `null` behavior; all permitted and prohibited application transitions.
- **Interviews/offers/notifications:** date validation, company scope, schedule lifecycle, selected-only offer, PDF output, email failure, notification recipient/read state.
- **Analytics:** compare aggregates with known fixtures; empty results; role/company filtering; date ranges and large-list pagination.
- **UI:** current browsers plus mobile/tablet layouts, keyboard navigation, labels, readable loading/error/empty states.
- **Deployment smoke:** HTTPS, Vercel-to-Render CORS, refresh cookie, Atlas connection, Cloudinary access, Gemini failure behavior, SMTP and private downloads.

Testing starts in each phase. Keep a simple test matrix mapping feature, happy path, edge path, authorization path, result, tester, and date.

## 12. Project-wide Definition of Done

A feature is complete only when it has a usable UI (when user-facing), working API/service, Mongoose persistence, client and server validation, authentication/RBAC/ownership enforcement, loading/error/empty states, safe edge-case handling, and documented basic test/manual verification. It must introduce no browser console or server errors, use no secrets in source, preserve existing modules in regression checks, and conform to the directory/API/error conventions in `architecture.md`.

## 13. Environment and Configuration Staging

Commit `.env.example` files with placeholders only. Validate required values at server startup.

| Stage | Variables required or introduced |
|---|---|
| Foundation | `NODE_ENV`, `PORT`, `MONGO_URI`, `CLIENT_URL`, client `VITE_API_BASE_URL` |
| Auth | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, plus SMTP placeholders for reset mail |
| Resume/AI/files | `GEMINI_API_KEY`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` |
| Email/offers | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` |
| Deployment | production values for all above; exact Vercel `CLIENT_URL`; Render/Atlas provider configuration |
| Phase 2 only | a Judge0 configuration key only if the optional module is approved/enabled |

Never expose server secrets as `VITE_*` variables. Development may use local client origins and appropriate local cookie behavior; production requires HTTPS, exact allowed origins, and secure cookies.

## 14. Practical Git Workflow

Use `main` for stable, demonstrable code; `develop` for integrated work; and short-lived `feature/<name>` branches for focused changes. Create `develop` only when implementation begins. Branch from current `develop`, make one coherent change, run relevant checks, open/review a pull request when team workflow supports it, then merge back. Avoid force pushes to shared branches and avoid large mixed-purpose commits.

Examples:

- `chore: initialize client and server foundations`
- `feat(auth): add rotating refresh token sessions`
- `feat(resume): add versioned upload validation`
- `fix(applications): enforce recruiter company ownership`
- `test(eligibility): cover CGPA branch and backlog boundaries`
- `docs: document deployment smoke checklist`

Commit `architecture.md` only for real architectural changes. Update this roadmap when execution order or acceptance criteria genuinely change.

## 15. Milestone Checkpoints

| Checkpoint | Acceptance checklist |
|---|---|
| 1 — Foundation works | client/server launch; health call works; config/error/CORS conventions are verified; no secrets committed |
| 2 — Authentication works | registration/approval/login/refresh/logout/reset tested; four-role protections and account statuses work |
| 3 — Student resume + ATS works | profile persisted; valid versioned upload works; access is private; extraction/cache/AI failure paths tested |
| 4 — Jobs + applications work | approved jobs browse/filter; server eligibility correct; apply/withdraw/history/duplicate safeguards work |
| 5 — Recruiter workflow works | recruiter company isolation; applicant filters/status transitions/ranking presentation; notifications generated |
| 6 — Interview + AI mock works | schedules/feedback/notifications work; mock interview has exactly generation/final-evaluation calls and preserves answers |
| 7 — Offers + analytics + TPO/Admin work | selected-only PDFs/email; role-scoped charts/reports; approvals/announcements/complaints/audits work |
| 8 — Production works | Vercel/Render/Atlas integrations pass HTTPS CORS/cookie, file, AI, email, and four-role smoke tests |

## 16. Phase 2 Isolation

`CodingTest`, `Question`, `Submission`, and Judge0 are implemented only after MVP deployment. Keep their models/routes/services behind Phase 2 naming and enablement. The coding service returns a normalized score/result, but `rankingService` handles unavailable coding data explicitly. Hidden test cases are server-only. No MVP migration, application transition, job form, dashboard, or core availability depends on Judge0.

## 17. Practical Risks and Mitigations

| Risk | Simple mitigation |
|---|---|
| Gemini quota, latency, inconsistent JSON | hash-cache successful resume work; version prompts; strict response validation; safe timeouts/rate limits/retry messages; mock provider tests |
| PDF/DOCX parsing failure | validate type/size; detect empty/corrupt extraction; retain uploaded version/status; show actionable retry/support message |
| Cloudinary upload/delivery failure | persist only after successful upload; compensate/reconcile metadata where possible; surface safe retry and restrict file access |
| Refresh cookie / CORS problems | test deployed HTTPS early; use exact origins, Axios credentials, `SameSite=None; Secure`; do not fall back to localStorage without architecture review |
| Render cold starts | show client loading states; keep health endpoint; avoid long synchronous operations where possible; communicate expected delay |
| SMTP limits/delivery failures | keep in-app notification authoritative; record email status; use configured verified sender and test with real inboxes |
| Ranking without coding score | display incomplete score or approved available-weight normalization; never silently treat absent score as zero |
| Large queries/slow dashboards | paginate lists, whitelist filters/sorts, project needed fields, add planned indexes, verify aggregation plans with representative data |
| Cross-module authorization gaps | add wrong-role and foreign-resource tests to every protected endpoint; review service query scoping |
| Resume privacy/retention ambiguity | authorize every file read; keep assets private; obtain policy decision before production deletion/retention automation |

## 18. Unresolved Planning Decisions to Resolve Before Their Implementation

1. Confirm whether rank display without Phase 2 coding uses available-weight normalization or an explicit incomplete score only.
2. Confirm the college’s approval policy: proposed default is TPO approves students and companies/recruiters; Admin provisions/manages TPO/Admin accounts.
3. Confirm institution branch list, application withdrawal cutoff, and required profile fields before Phase 2–5 validators are finalized.
4. Select SMTP provider/sender and resume retention/deletion policy before production deployment.
5. Decide whether placement drives need a separate model; this plan intentionally treats them as job grouping/status until a demonstrated requirement warrants an architecture change.

## 19. Operating Rule

Before starting any implementation task, read `docs/architecture.md` and the relevant sections of this plan. Build the smallest complete vertical slice in the listed order, verify it against its completion criteria, and update documentation only when the underlying architecture or practical roadmap has genuinely changed.
