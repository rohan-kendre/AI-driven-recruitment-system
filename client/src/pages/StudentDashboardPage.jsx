import { useCallback, useMemo, useReducer, useState } from "react";
import { useOutletContext } from "react-router-dom";
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
  // useState: controls the professional hook detail panel.
  const [showHooks, setShowHooks] = useState(false);
  // useReducer: manages application filters, search, and selected application.
  const [state, dispatch] = useReducer(reducer, initial);
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
  const chart = useMemo(
    () => [
      { name: "Progress", value: 68 },
      { name: "Remaining", value: 32 },
    ],
    [],
  );
  const cards = [
    ["ATS Resume Score", stats.ats + "%", "Strong profile match"],
    ["Applications", stats.applications, stats.shortlisted + " shortlisted"],
    ["Interviews", stats.interviews, "Next: 25 Aug"],
    ["Offers", stats.offers, "One active offer"],
  ];

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
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            Student workspace
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Good morning, {user?.name?.split(" ")[0] || "there"}.
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Here is a clear view of your placement progress.
          </p>
        </div>
        <Badge tone={isAuthenticated ? "emerald" : "slate"}>
          {isAuthenticated ? "Demo session active" : "Guest view"}
        </Badge>
      </section>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, detail]) => (
          <Card key={label} className="p-5">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-5 text-3xl font-bold tracking-tight">{value}</p>
            <p className="mt-1 text-xs text-slate-500">{detail}</p>
          </Card>
        ))}
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold">Recent applications</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Click a row to inspect the demo selection.
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600">
              View all
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {rows.map((item) => (
              <button
                key={item.id}
                onClick={() =>
                  dispatch({ type: "SELECT_APPLICATION", payload: item.id })
                }
                className="focus-ring flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-slate-50"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-sm font-bold">
                  {item.company[0]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">
                    {item.role}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {item.company} · {item.date}
                  </span>
                </span>
                <Badge tone={item.tone}>{item.status}</Badge>
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Application status</h2>
              <p className="text-xs text-slate-500">
                Your current placement momentum.
              </p>
            </div>
            <b className="text-indigo-600">68%</b>
          </div>
          <div className="mt-4 h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chart}
                  dataKey="value"
                  innerRadius={54}
                  outerRadius={72}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  fill="#4f46e5"
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            <b>{stats.shortlisted} shortlisted application</b> and{" "}
            <b>{interviews.length} upcoming interviews</b>.
          </p>
        </Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">Find an application</h2>
              <p className="text-xs text-slate-500">
                A real dashboard filter managed locally.
              </p>
            </div>
            <div className="flex gap-2">
              {["All", "Shortlisted", "Interview"].map((filter) => (
                <button
                  key={filter}
                  className={
                    state.filter === filter
                      ? "focus-ring rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white"
                      : "focus-ring rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                  }
                  onClick={() =>
                    dispatch({ type: "SET_FILTER", payload: filter })
                  }
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <SearchField value={state.search} onChange={handleSearch} />
          </div>
          {state.selectedApplication &&
            (() => {
              const selected = applications.find(
                (a) => a.id === state.selectedApplication,
              );
              if (!selected) return null;
              return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
                  <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">Application Details</h3>
                      <button
                        onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">ID</span>
                        <span className="font-medium">{selected.id}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Role</span>
                        <span className="font-medium">{selected.role}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Company</span>
                        <span className="font-medium">{selected.company}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Applied</span>
                        <span className="font-medium">{selected.date}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-500">Status</span>
                        <Badge tone={selected.tone}>{selected.status}</Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch({ type: "CLEAR_SELECTION" })}
                      className="focus-ring mt-6 w-full rounded-xl bg-slate-100 py-2.5 font-semibold text-slate-700 hover:bg-slate-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              );
            })()}
        </Card>
        <Card className="p-5">
          <h2 className="font-semibold">Upcoming interviews</h2>
          <div className="mt-4 space-y-3">
            {interviews.map((item) => (
              <div
                key={item.company}
                className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"
              >
                <b className="grid h-10 w-10 place-items-center rounded-lg bg-white text-xs text-indigo-600">
                  {item.date}
                </b>
                <span className="min-w-0 flex-1">
                  <b className="block truncate text-sm">{item.company}</b>
                  <span className="block text-xs text-slate-500">
                    {item.role} · {item.time}
                  </span>
                </span>
                <Badge tone="emerald">{item.mode}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <Card className="p-5">
          <h2 className="font-semibold">Recommended jobs</h2>
          <p className="text-xs text-slate-500">
            Demo matches based on your profile.
          </p>
          {filteredRecommendedJobs.length === 0 ? (
            <div className="mt-8 text-center text-sm text-slate-500">
              No opportunities found.
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {filteredRecommendedJobs.map((job) => (
                <article
                  key={job.company}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-100 p-3"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-600">
                    {job.company[0]}
                  </span>
                  <span className="min-w-40 flex-1">
                    <b className="block text-sm">{job.role}</b>
                    <span className="block text-xs text-slate-500">
                      {job.company} · {job.location}
                    </span>
                  </span>
                  <span className="text-xs text-slate-500">
                    Closes {job.deadline}
                  </span>
                  <Badge tone="indigo">{job.match}% match</Badge>
                </article>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <div className="flex justify-between gap-3">
            <div>
              <h2 className="font-semibold">React Hooks in NexHire</h2>
              <p className="text-xs text-slate-500">
                Implementation details, not tutorial examples.
              </p>
            </div>
            <button
              className="focus-ring text-sm font-semibold text-indigo-600"
              onClick={() => setShowHooks((v) => !v)}
            >
              {showHooks ? "Hide" : "View"}
            </button>
          </div>
          {showHooks ? (
            <div className="mt-4 grid gap-2">
              {[
                ["useState", "Controls local dashboard and UI state."],
                ["useEffect", "Updates route-specific document title."],
                [
                  "useContext",
                  "Shares demo authentication state across the application.",
                ],
                ["useReducer", "Manages application filters and selection."],
                [
                  "useCallback",
                  "Stabilizes the dashboard search/filter handler.",
                ],
                [
                  "useMemo",
                  "Derives dashboard statistics from application data.",
                ],
                ["useRef", "Focuses the dashboard search input."],
                ["useId", "Generates accessible form input identifiers."],
              ].map(([hook, text]) => (
                <div key={hook} className="rounded-lg bg-slate-50 px-3 py-2">
                  <b className="text-xs text-indigo-600">{hook}</b>
                  <p className="text-xs leading-5 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm leading-6 text-slate-500">
              Open this panel during the Experiment 3.2 demonstration.
            </p>
          )}
        </Card>
      </section>
    </div>
  );
}
