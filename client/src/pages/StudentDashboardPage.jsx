import { useCallback, useMemo, useReducer, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Badge } from "../components/ui.jsx";
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

  // useState: controls the discreet educational hook reference panel.
  const [showHooks, setShowHooks] = useState(false);

  // useReducer: manages application filters, search, and selected application modal.
  const [state, dispatch] = useReducer(reducer, initial);

  // useMemo: filters applications based on active filter tab and search keyword.
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

  // useCallback: memoizes search input handler.
  const handleSearch = useCallback(
    (event) => dispatch({ type: "SET_SEARCH", payload: event.target.value }),
    [],
  );

  // useMemo: subtle chart representation of placement momentum.
  const chart = useMemo(
    () => [
      { name: "Cleared", value: 68 },
      { name: "In Progress", value: 32 },
    ],
    [],
  );

  // useMemo: recommended opportunities filtered by top-bar global search.
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

  const firstName = user?.name ? user.name.split(" ")[0] : "Aarav";

  return (
    <div className="space-y-10 pb-16">
      {/* ============================================================== */}
      {/* 1. GREETING & CONTEXT HEADER                                   */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Student workspace
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Good morning, {firstName}.
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Your placement readiness, active applications, and upcoming interviews in one calm workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Badge tone={isAuthenticated ? "emerald" : "slate"}>
            {isAuthenticated ? "Live Session" : "Guest View"}
          </Badge>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
            Profile Verified (CGPA 8.85)
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PRIMARY PLACEMENT READINESS & SUPPORTING METRICS            */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr] lg:items-center">
          {/* Left: Primary Readiness Gauge */}
          <div className="space-y-3 lg:border-r lg:border-[#E4E7EF] lg:pr-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Placement readiness
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16886A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                Strong Profile Match
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0B1020]">
                {stats.ats}%
              </span>
              <span className="text-xs font-semibold text-[#56627A]">
                ATS Resume Optimization (v2.4 Active)
              </span>
            </div>

            {/* Subtle Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-[#F7F8FC] border border-[#E4E7EF] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5146E5] transition-all duration-500"
                style={{ width: `${stats.ats}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#56627A]">Somaiya TPO Gate Cleared</span>
              <Link
                to="/student/resume"
                className="font-semibold text-[#5146E5] hover:text-[#4338CA] transition-colors inline-flex items-center gap-1"
              >
                <span>View ATS analysis</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Right: 3 Quiet Supporting Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Applications */}
            <Link
              to="/student/applications"
              className="group rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50 p-4 transition-all hover:bg-white hover:border-[#D1D5E3]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#56627A] group-hover:text-[#5146E5] transition-colors">
                  Applications
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-[#5146E5] transition-colors">
                  →
                </span>
              </div>
              <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1020]">
                {stats.applications}
              </p>
              <p className="mt-0.5 text-xs text-[#56627A]">
                {stats.shortlisted} Shortlisted · Active
              </p>
            </Link>

            {/* Interviews */}
            <Link
              to="/student/interviews"
              className="group rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50 p-4 transition-all hover:bg-white hover:border-[#D1D5E3]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#56627A] group-hover:text-[#5146E5] transition-colors">
                  Interviews
                </span>
                <span className="text-[11px] text-slate-400 group-hover:text-[#5146E5] transition-colors">
                  →
                </span>
              </div>
              <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1020]">
                {stats.interviews}
              </p>
              <p className="mt-0.5 text-xs text-[#56627A]">
                Next: 25 Aug (Virtual)
              </p>
            </Link>

            {/* Offers */}
            <Link
              to="/student/offers"
              className="group rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50 p-4 transition-all hover:bg-white hover:border-[#5146E5]/40 hover:shadow-2xs cursor-pointer block"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#56627A] group-hover:text-[#0B1020] transition-colors">
                  Offers
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
              </div>
              <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                {stats.offers}
              </p>
              <p className="mt-0.5 text-xs text-[#56627A] truncate">
                Acme Technologies
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CORE CONTENT: RECENT APPLICATIONS & UPCOMING INTERVIEWS     */}
      {/* ============================================================== */}
      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-start">
        {/* Left Column: Recent Applications */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E7EF] pb-4">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B1020]">
                Recent applications
              </h2>
              <p className="text-xs text-[#56627A]">
                Track stages, review timelines, or click for details.
              </p>
            </div>

            {/* Clean Segmented Filter Tabs */}
            <div className="flex items-center rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-1 self-start sm:self-auto">
              {["All", "Shortlisted", "Interview"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => dispatch({ type: "SET_FILTER", payload: filter })}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                    state.filter === filter
                      ? "bg-white text-[#0B1020] shadow-2xs"
                      : "text-[#56627A] hover:text-[#0B1020]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Scannable Application Search Input */}
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9DA8BC]">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </span>
            <input
              value={state.search}
              onChange={handleSearch}
              placeholder="Search applications by role or company..."
              className="w-full rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50 py-2 pl-9 pr-3 text-xs text-[#0B1020] placeholder:text-[#9DA8BC] focus:border-[#5146E5] focus:bg-white focus:outline-none transition-colors"
            />
          </div>

          {/* Clean Editorial Application Rows */}
          <div className="divide-y divide-[#E4E7EF]">
            {rows.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#56627A]">
                No applications match your filter criteria.
              </div>
            ) : (
              rows.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    dispatch({ type: "SELECT_APPLICATION", payload: item.id })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      dispatch({ type: "SELECT_APPLICATION", payload: item.id });
                    }
                  }}
                  className="group flex items-center justify-between py-3.5 px-2 -mx-2 rounded-xl transition-colors hover:bg-[#F7F8FC] cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#E4E7EF] bg-white font-display text-xs font-bold text-[#0B1020] shadow-2xs group-hover:border-[#5146E5]/40 transition-colors">
                      {item.company[0]}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                        {item.role}
                      </p>
                      <p className="truncate text-[11px] text-[#56627A]">
                        {item.company} · {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <Badge tone={item.tone}>{item.status}</Badge>
                    <span className="text-xs text-slate-300 group-hover:text-[#5146E5] transition-colors">
                      →
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-[#E4E7EF] flex items-center justify-between text-xs text-[#56627A]">
            <span>Showing {rows.length} of {applications.length} applications</span>
            <Link
              to="/student/applications"
              className="font-semibold text-[#5146E5] hover:text-[#4338CA] transition-colors inline-flex items-center gap-1"
            >
              <span>View all applications</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Upcoming Interviews + Subtle Momentum Indicator */}
        <div className="space-y-6">
          {/* Upcoming Interviews Card */}
          <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
              <div>
                <h2 className="font-display text-base font-bold text-[#0B1020]">
                  Upcoming interviews
                </h2>
                <p className="text-xs text-[#56627A]">
                  Scheduled rounds and panel modes.
                </p>
              </div>
              <Link
                to="/student/interviews"
                className="text-xs font-semibold text-[#5146E5] hover:text-[#4338CA] transition-colors inline-flex items-center gap-1"
              >
                <span>View all</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="space-y-3">
              {interviews.map((item, idx) => (
                <Link
                  key={item.company}
                  to="/student/interviews"
                  className="block rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50 p-3.5 transition-all hover:bg-white hover:border-[#D1D5E3]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold text-[#0B1020]">
                      {item.company}
                    </span>
                    <Badge tone={item.mode === "Virtual" ? "emerald" : "indigo"}>
                      {item.mode}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-[#56627A]">
                    {item.role}
                  </p>
                  <div className="mt-2.5 flex items-center justify-between border-t border-[#E4E7EF]/80 pt-2 text-[11px] text-[#56627A]">
                    <span className="font-mono font-medium text-[#0B1020]">{item.date} · {item.time}</span>
                    <span className="font-medium text-[#5146E5]">
                      {idx === 0 ? "Technical Round 1" : "HR & Fitment"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Subtle Placement Momentum Card */}
          <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-subtle flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                Momentum
              </span>
              <h3 className="font-display text-sm font-bold text-[#0B1020]">
                Drive Progression
              </h3>
              <p className="text-xs text-[#56627A]">
                68% of milestones cleared across active campus drives.
              </p>
            </div>

            {/* Subtle Recharts Donut */}
            <div className="h-16 w-16 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chart}
                    dataKey="value"
                    innerRadius={20}
                    outerRadius={28}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                    fill="#5146E5"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0B1020",
                      borderColor: "#1C2438",
                      borderRadius: "0.5rem",
                      fontSize: "10px",
                      color: "#FFFFFF",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SECONDARY CONTENT: RECOMMENDED OPPORTUNITIES                */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#0B1020]">
              Recommended opportunities
            </h2>
            <p className="text-xs text-[#56627A]">
              Verified campus drives matching your department eligibility.
            </p>
          </div>
          <Link
            to="/student/jobs"
            className="text-xs font-semibold text-[#5146E5] hover:text-[#4338CA] transition-colors inline-flex items-center gap-1"
          >
            <span>Explore all campus jobs</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="divide-y divide-[#E4E7EF]">
          {filteredRecommendedJobs.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#56627A]">
              No opportunities match your search.
            </div>
          ) : (
            filteredRecommendedJobs.map((job) => (
              <div
                key={job.company}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-2 -mx-2 rounded-xl transition-colors hover:bg-[#F7F8FC]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#E4E7EF] bg-white font-display text-xs font-bold text-[#5146E5] shadow-2xs">
                    {job.company[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-[#0B1020]">
                      {job.role}
                    </p>
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
                  <Link
                    to="/student/jobs"
                    className="text-xs font-semibold text-[#5146E5] hover:underline hidden sm:inline"
                  >
                    View drive
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
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
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="app-detail-title"
              className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1020]/40 p-4 backdrop-blur-xs animate-fadeIn"
            >
              <div className="w-full max-w-md rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-floating">
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#5146E5]">
                      {selected.id}
                    </span>
                    <h3
                      id="app-detail-title"
                      className="font-display text-lg font-bold text-[#0B1020]"
                    >
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

                {/* Modal Actions */}
                <div className="mt-6 flex items-center gap-2">
                  <button
                    onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
                    className="w-full rounded-xl bg-[#0B1020] py-2.5 text-xs font-semibold text-white hover:bg-[#1C2438] active:scale-[0.99] transition-all"
                  >
                    Close details
                  </button>
                  <Link
                    to="/student/applications"
                    onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
                    className="w-full text-center rounded-xl border border-[#E4E7EF] bg-white py-2.5 text-xs font-semibold text-[#0B1020] hover:bg-[#F7F8FC] transition-all"
                  >
                    View in tracker
                  </Link>
                </div>
              </div>
            </div>
          );
        })()}

      {/* ============================================================== */}
      {/* 6. EXPERIMENT 3.2 DEMO DRAWER (Discreet Academic Reference)    */}
      {/* ============================================================== */}
      <section className="border-t border-[#E4E7EF] pt-6">
        <div className="rounded-xl border border-[#E4E7EF] bg-white px-4 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
            <span className="font-semibold text-[#0B1020]">
              Academic Reference: Experiment 3.2
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[#56627A] hidden sm:inline">
              React Hooks Implementation
            </span>
          </div>

          <button
            onClick={() => setShowHooks((v) => !v)}
            className="font-semibold text-[#5146E5] hover:text-[#4338CA] transition-colors"
          >
            {showHooks ? "Hide reference" : "View implementation"}
          </button>
        </div>

        {showHooks && (
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4 text-xs">
            {[
              ["useState", "Controls sidebar drawer and academic toggle state."],
              ["useEffect", "Updates route-specific document title on navigation."],
              ["useContext", "Shares authentication session across the application."],
              ["useReducer", "Manages application filters, search, and selection."],
              ["useCallback", "Stabilizes the dashboard search input handler."],
              ["useMemo", "Derives statistics, chart data, and filtered listings."],
              ["useRef", "Provides keyboard and button focus to the search field."],
              ["useId", "Generates accessible form input identifiers in ui.jsx."],
            ].map(([hook, text]) => (
              <div key={hook} className="rounded-lg border border-[#E4E7EF] bg-white p-2.5">
                <b className="font-mono text-xs text-[#5146E5]">{hook}</b>
                <p className="mt-0.5 text-[11px] leading-relaxed text-[#56627A]">{text}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
