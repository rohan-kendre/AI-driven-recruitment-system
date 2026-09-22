import { useCallback, useMemo, useReducer, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge, Card, SearchField } from "../components/ui.jsx";
import {
  applications,
  interviews,
  recommendedJobs,
} from "../data/dashboardData.js";
import { useAuth } from "../hooks/useAuth.jsx";

const initial = { filter: "All", search: "", selectedApplication: null };

function reducer(state, action) {
  if (action.type === "SET_FILTER") return { ...state, filter: action.payload };
  if (action.type === "SET_SEARCH") return { ...state, search: action.payload };
  if (action.type === "SELECT_APPLICATION")
    return { ...state, selectedApplication: action.payload };
  if (action.type === "CLEAR_SELECTION")
    return { ...state, selectedApplication: null };
  return state;
}

export function StudentDashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { globalSearch = "" } = useOutletContext() || {};

  // useState: controls the educational hook reference panel.
  const [showHooks, setShowHooks] = useState(false);

  // useReducer: manages application filters, search, and selected application.
  const [state, dispatch] = useReducer(reducer, initial);

  // useMemo: filters applications based on current filter and local search.
  const rows = useMemo(
    () =>
      applications.filter(
        (item) =>
          (state.filter === "All" || item.status === state.filter) &&
          (item.role + item.company)
            .toLowerCase()
            .includes(state.search.toLowerCase()),
      ),
    [state.filter, state.search],
  );

  // useMemo: derives dashboard statistics from mock applications.
  const stats = useMemo(
    () => ({
      ats: 82,
      applications: rows.length,
      interviews:
        rows.filter((x) => x.status === "Interview").length + interviews.length,
      offers: 1,
      shortlisted: rows.filter((x) => x.status === "Shortlisted").length,
    }),
    [rows],
  );

  // useCallback: memoizes the filter handler passed to SearchField.
  const handleSearch = useCallback(
    (event) => dispatch({ type: "SET_SEARCH", payload: event.target.value }),
    [],
  );

  // useMemo: chart representation of placement momentum.
  const chart = useMemo(
    () => [
      { name: "Progress", value: 68 },
      { name: "Remaining", value: 32 },
    ],
    [],
  );

  // useMemo: recommended jobs filtered by top-bar global search.
  const filteredRecommendedJobs = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();
    if (!query) return recommendedJobs;
    return recommendedJobs.filter((job) =>
      [job.role, job.company, job.location]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [globalSearch]);

  return (
    <div className="space-y-8">
      {/* ============================================================== */}
      {/* 1. WORKSPACE HEADER & PROFILE STATUS                           */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
              Student Workspace
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs text-[#56627A]">
              Campus Drive Active
            </span>
          </div>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Good morning, {user?.name?.split(" ")[0] || "Aarav"}.
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Track your preparation, active applications, and upcoming interview
            milestones from one calm workspace.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge tone={isAuthenticated ? "emerald" : "slate"}>
            {isAuthenticated ? "Session Active" : "Guest View"}
          </Badge>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
            Profile Verified (CGPA 8.85)
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PRIMARY PLACEMENT READINESS HERO + SUPPORTING METRICS       */}
      {/* ============================================================== */}
      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Primary Placement Readiness Banner */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Placement Readiness
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F6F1] px-2.5 py-0.5 text-xs font-semibold text-[#16886A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                Strong Profile Match
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0B1020]">
                {stats.ats}%
              </span>
              <span className="text-sm font-semibold text-[#56627A]">
                ATS Resume Optimization Score
              </span>
            </div>

            <p className="mt-2 text-xs sm:text-sm text-[#56627A] leading-relaxed">
              Your resume aligns with verified core engineering campus drive
              requirements. Coursework, projects, and key technical skills are
              indexed.
            </p>

            {/* Progress Bar */}
            <div className="mt-4 h-2 w-full rounded-full bg-[#F7F8FC] border border-[#E4E7EF] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5146E5] transition-all duration-500"
                style={{ width: `${stats.ats}%` }}
              />
            </div>

            {/* Verified Skills Chips */}
            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#0B1020] mr-1">
                Verified:
              </span>
              {["React.js", "Node.js", "Data Structures", "REST APIs", "MongoDB"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-[#E4E7EF] bg-[#F7F8FC] px-2 py-0.5 text-[11px] font-medium text-[#56627A]"
                  >
                    {skill}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="mt-6 border-t border-[#E4E7EF] pt-4 flex items-center justify-between text-xs text-[#56627A]">
            <span>Resume v2.4 (Active for applications)</span>
            <Link
              to="/student/resume"
              className="font-semibold text-[#5146E5] hover:underline flex items-center gap-1"
            >
              <span>View ATS Analysis</span>
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </Link>
          </div>
        </div>

        {/* 3 Supporting Key Metrics Column */}
        <div className="grid gap-3.5 sm:grid-cols-3 lg:grid-cols-1">
          {/* Applications */}
          <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#56627A]">
                Active Applications
              </span>
              <Badge tone="indigo">{stats.shortlisted} Shortlisted</Badge>
            </div>
            <div className="mt-3">
              <p className="font-display text-2xl font-bold text-[#0B1020]">
                {stats.applications} in Pipeline
              </p>
              <p className="mt-0.5 text-xs text-[#56627A]">
                1 shortlisted, 1 screening, 1 interview, 1 applied
              </p>
            </div>
          </div>

          {/* Interviews */}
          <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#56627A]">
                Upcoming Interviews
              </span>
              <Badge tone="emerald">Next: 25 Aug</Badge>
            </div>
            <div className="mt-3">
              <p className="font-display text-2xl font-bold text-[#0B1020]">
                {stats.interviews} Scheduled
              </p>
              <p className="mt-0.5 text-xs text-[#56627A]">
                PixelCraft Studio (Virtual) · Acme Technologies (On-campus)
              </p>
            </div>
          </div>

          {/* Offers */}
          <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-subtle flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#56627A]">
                Offer Letters
              </span>
              <Badge tone="amber">Pending Review</Badge>
            </div>
            <div className="mt-3">
              <p className="font-display text-2xl font-bold text-[#0B1020]">
                {stats.offers} Active Offer
              </p>
              <p className="mt-0.5 text-xs text-[#56627A]">
                Acme Technologies · Software Engineer Intern
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. RECENT APPLICATIONS + APPLICATION MOMENTUM CHART             */}
      {/* ============================================================== */}
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Applications Management Card */}
        <Card className="p-5 sm:p-6 flex flex-col justify-between">
          <div>
            {/* Header + Integrated Search & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E4E7EF] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0B1020]">
                  Placement Applications
                </h2>
                <p className="text-xs text-[#56627A]">
                  Click any application to inspect detailed timeline and criteria.
                </p>
              </div>

              {/* Segmented Filter Buttons */}
              <div className="flex items-center rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-1 self-start sm:self-auto">
                {["All", "Shortlisted", "Interview"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => dispatch({ type: "SET_FILTER", payload: filter })}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                      state.filter === filter
                        ? "bg-white text-[#0B1020] shadow-subtle"
                        : "text-[#56627A] hover:text-[#0B1020]"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Local Search Field */}
            <div className="mt-4">
              <SearchField
                value={state.search}
                onChange={handleSearch}
                placeholder="Search by role or company..."
              />
            </div>

            {/* Interactive Applications List */}
            <div className="mt-4 divide-y divide-[#E4E7EF]">
              {rows.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#56627A]">
                  No applications match your filter criteria.
                </div>
              ) : (
                rows.map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      dispatch({ type: "SELECT_APPLICATION", payload: item.id })
                    }
                    className="group flex w-full items-center justify-between py-3.5 text-left transition-all hover:bg-[#F7F8FC] rounded-xl px-2.5 -mx-2.5"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#E4E7EF] bg-white font-display text-xs font-bold text-[#0B1020] shadow-subtle group-hover:border-[#5146E5]/40 transition-colors">
                        {item.company[0]}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-[#0B1020]">
                          {item.role}
                        </p>
                        <p className="truncate text-[11px] text-[#56627A]">
                          {item.company} · Applied {item.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <Badge tone={item.tone}>{item.status}</Badge>
                      <span className="text-xs text-[#56627A] group-hover:text-[#5146E5] transition-colors">
                        →
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E4E7EF] flex items-center justify-between text-xs text-[#56627A]">
            <span>Showing {rows.length} of 4 applications</span>
            <span className="text-[11px]">Updated in real time</span>
          </div>
        </Card>

        {/* Placement Momentum & Donut Chart */}
        <Card className="p-5 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0B1020]">
                  Placement Momentum
                </h2>
                <p className="text-xs text-[#56627A]">
                  Current stage distribution across all drives.
                </p>
              </div>
              <span className="font-display text-xl font-extrabold text-[#5146E5]">
                68%
              </span>
            </div>

            {/* Recharts Pie Chart */}
            <div className="mt-4 h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chart}
                    dataKey="value"
                    innerRadius={54}
                    outerRadius={72}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    fill="#5146E5"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1020",
                      borderColor: "#1C2438",
                      borderRadius: "0.75rem",
                      fontSize: "11px",
                      color: "#FFFFFF",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown interpretation */}
            <div className="mt-4 space-y-2 rounded-xl bg-[#F7F8FC] border border-[#E4E7EF] p-3 text-xs text-[#56627A]">
              <div className="flex items-center justify-between">
                <span>Shortlisted for next stage:</span>
                <b className="text-[#0B1020]">{stats.shortlisted}</b>
              </div>
              <div className="flex items-center justify-between">
                <span>Upcoming interview rounds:</span>
                <b className="text-[#0B1020]">{interviews.length}</b>
              </div>
              <div className="flex items-center justify-between">
                <span>Active formal offers:</span>
                <b className="text-[#16886A]">{stats.offers}</b>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-[#56627A] text-center">
            Evaluated by college placement officer policy
          </p>
        </Card>
      </section>

      {/* ============================================================== */}
      {/* 4. UPCOMING INTERVIEWS + RECOMMENDED OPPORTUNITIES              */}
      {/* ============================================================== */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Upcoming Interviews */}
        <Card className="p-5 sm:p-6">
          <div className="border-b border-[#E4E7EF] pb-4">
            <h2 className="font-display text-lg font-bold text-[#0B1020]">
              Upcoming Interviews
            </h2>
            <p className="text-xs text-[#56627A]">
              Synchronized panel timings and meeting instructions.
            </p>
          </div>

          <div className="mt-4 space-y-3">
            {interviews.map((item, idx) => (
              <div
                key={item.company}
                className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3.5 transition-all hover:border-[#D1D5E3]"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-[#5146E5] px-2.5 py-1 font-mono text-[11px] font-bold text-white shadow-subtle">
                    {item.date}
                  </span>
                  <Badge tone={item.mode === "Virtual" ? "emerald" : "indigo"}>
                    {item.mode}
                  </Badge>
                </div>

                <div className="mt-2.5">
                  <h3 className="text-sm font-bold text-[#0B1020]">
                    {item.company}
                  </h3>
                  <p className="text-xs text-[#56627A]">
                    {item.role} · {item.time}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#E4E7EF] pt-2 text-[11px] text-[#56627A]">
                  <span>{idx === 0 ? "Panel: Technical Round 1" : "Panel: HR & Fitment"}</span>
                  <span className="font-semibold text-[#5146E5]">
                    {idx === 0 ? "Link Prepared" : "Campus Hall 4"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommended Campus Opportunities */}
        <Card className="p-5 sm:p-6">
          <div className="border-b border-[#E4E7EF] pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0B1020]">
                Recommended Opportunities
              </h2>
              <p className="text-xs text-[#56627A]">
                Verified campus drives matching your branch and CGPA.
              </p>
            </div>
            <span className="rounded-full border border-[#E4E7EF] bg-[#F7F8FC] px-2.5 py-0.5 text-[11px] font-semibold text-[#56627A]">
              {filteredRecommendedJobs.length} active
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {filteredRecommendedJobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#56627A]">
                No opportunities match your search.
              </div>
            ) : (
              filteredRecommendedJobs.map((job) => (
                <div
                  key={job.company}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3.5 hover:border-[#D1D5E3] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white border border-[#E4E7EF] font-display text-xs font-bold text-[#5146E5] shadow-subtle">
                      {job.company[0]}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <b className="truncate text-xs text-[#0B1020]">
                          {job.role}
                        </b>
                      </div>
                      <p className="truncate text-[11px] text-[#56627A]">
                        {job.company} · {job.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <span className="text-[11px] text-[#56627A]">
                      Closes {job.deadline}
                    </span>
                    <Badge tone="indigo">{job.match}% match</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </section>

      {/* ============================================================== */}
      {/* 5. APPLICATION DETAILS MODAL (Preserved Interaction)           */}
      {/* ============================================================== */}
      {state.selectedApplication &&
        (() => {
          const selected = applications.find(
            (a) => a.id === state.selectedApplication,
          );
          if (!selected) return null;
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/50 p-4 backdrop-blur-sm animate-fadeIn">
              <div className="w-full max-w-md rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-floating">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#5146E5]">
                      {selected.id}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#0B1020]">
                      Application Details
                    </h3>
                  </div>
                  <button
                    onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
                    className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B1020] transition-colors"
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Data Rows */}
                <div className="mt-4 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-[#E4E7EF]/80 pb-2.5">
                    <span className="text-[#56627A]">Position</span>
                    <span className="font-semibold text-[#0B1020] text-right">
                      {selected.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E4E7EF]/80 pb-2.5">
                    <span className="text-[#56627A]">Company</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selected.company}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E4E7EF]/80 pb-2.5">
                    <span className="text-[#56627A]">Date Submitted</span>
                    <span className="font-medium text-[#0B1020]">
                      {selected.date}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-[#E4E7EF]/80 pb-2.5">
                    <span className="text-[#56627A]">Current Stage</span>
                    <Badge tone={selected.tone}>{selected.status}</Badge>
                  </div>

                  <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3 text-[11px] text-[#56627A]">
                    <b className="text-[#0B1020]">Eligibility Status:</b> 100% verified. Meets CGPA ≥ 7.5 requirement, 0 active backlogs, and CS branch criteria.
                  </div>
                </div>

                {/* Modal Close CTA */}
                <button
                  onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
                  className="mt-6 w-full rounded-xl bg-[#0B1020] py-2.5 text-xs font-semibold text-white hover:bg-[#1C2438] active:scale-[0.99] transition-all"
                >
                  Close details
                </button>
              </div>
            </div>
          );
        })()}

      {/* ============================================================== */}
      {/* 6. EXPERIMENT 3.2 DEMO DRAWER (De-emphasized Academic Panel)   */}
      {/* ============================================================== */}
      <section className="border-t border-[#E4E7EF] pt-6">
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#56627A]">
                Developer Reference: Experiment 3.2
              </p>
              <h3 className="text-sm font-semibold text-[#0B1020]">
                React Hooks Architecture in NexHire
              </h3>
            </div>
            <button
              onClick={() => setShowHooks((v) => !v)}
              className="text-xs font-semibold text-[#5146E5] hover:underline"
            >
              {showHooks ? "Hide architecture reference" : "View implementation details"}
            </button>
          </div>

          {showHooks && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 pt-3 border-t border-[#E4E7EF]">
              {[
                ["useState", "Controls sidebar drawer and drawer toggle state."],
                ["useEffect", "Updates route-specific document title on navigation."],
                ["useContext", "Shares authentication context across the application."],
                ["useReducer", "Manages application filters, search, and selection."],
                ["useCallback", "Stabilizes the dashboard search input handler."],
                ["useMemo", "Derives statistics, chart data, and filtered listings."],
                ["useRef", "Provides keyboard and button focus to the search field."],
                ["useId", "Generates accessible form input identifiers in ui.jsx."],
              ].map(([hook, text]) => (
                <div key={hook} className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3">
                  <b className="font-mono text-xs text-[#5146E5]">{hook}</b>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#56627A]">{text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
