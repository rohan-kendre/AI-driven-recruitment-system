import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, FilterTabs } from "../components/ui.jsx";
import { initialInterviews } from "../data/interviewsData.js";

export function StudentInterviewsPage() {
  const [interviews] = useState(initialInterviews);
  const [filterTab, setFilterTab] = useState("Upcoming"); // 'All' | 'Upcoming' | 'Completed'
  const [selectedInterview, setSelectedInterview] = useState(null);

  // Preparation checklist state for student peace of mind
  const [checkedPrep, setCheckedPrep] = useState({
    "prep-resume": true,
    "prep-role": true,
    "prep-projects": false,
  });

  const togglePrep = useCallback((key) => {
    setCheckedPrep((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Primary next interview (dominant visual hierarchy)
  const nextInterview = useMemo(() => {
    return (
      interviews.find((item) => item.isNext && item.status === "Upcoming") ||
      interviews.find((item) => item.status === "Upcoming") ||
      null
    );
  }, [interviews]);

  // Derived filtered lists
  const upcomingInterviews = useMemo(
    () => interviews.filter((item) => item.status === "Upcoming"),
    [interviews],
  );

  const completedInterviews = useMemo(
    () => interviews.filter((item) => item.status === "Completed"),
    [interviews],
  );

  const displayedInterviews = useMemo(() => {
    if (filterTab === "Upcoming") return upcomingInterviews;
    if (filterTab === "Completed") return completedInterviews;
    return interviews;
  }, [filterTab, upcomingInterviews, completedInterviews, interviews]);

  // Close drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedInterview(null);
      }
    }
    if (selectedInterview) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedInterview]);

  return (
    <div className="space-y-10 pb-16">
      {/* ============================================================== */}
      {/* 1. HEADER & MINIMAL FILTERING                                  */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Student workspace
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Interviews
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Your scheduled rounds, panel timelines, and focused preparation.
          </p>
        </div>

        {/* Minimal Tab Filter */}
        <FilterTabs
          tabs={["All", "Upcoming", "Completed"]}
          activeTab={filterTab}
          onChange={setFilterTab}
        />
      </section>

      {/* ============================================================== */}
      {/* 2. WHAT IS MY NEXT INTERVIEW? (DOMINANT VISUAL ELEMENT)        */}
      {/* ============================================================== */}
      {nextInterview && filterTab !== "Completed" && (
        <section aria-labelledby="next-interview-title">
          <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-9 shadow-subtle relative overflow-hidden">
            {/* Subtle violet top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#5146E5]" />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left: Strong Typography Hierarchy */}
              <div className="space-y-4 max-w-xl">
                <div>
                  <span
                    id="next-interview-title"
                    className="text-xs font-bold uppercase tracking-wider text-[#5146E5]"
                  >
                    Next interview
                  </span>
                  <h2 className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1020]">
                    {nextInterview.company}
                  </h2>
                  <p className="mt-0.5 text-base sm:text-lg font-semibold text-[#56627A]">
                    {nextInterview.role}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded-lg bg-[#EEF0FF] px-3 py-1 font-semibold text-[#5146E5]">
                    {nextInterview.round}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="font-medium text-[#0B1020]">
                    {nextInterview.date} · {nextInterview.time}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#56627A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                    {nextInterview.mode}
                  </span>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
                <Button
                  variant="primary"
                  onClick={() => setSelectedInterview(nextInterview)}
                  className="rounded-xl px-5 py-2.5 text-xs font-semibold shadow-subtle justify-center"
                >
                  View interview
                </Button>
                <Link
                  to="/student/applications"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl px-5 py-2.5 text-xs font-semibold justify-center"
                  >
                    View application
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 3. MAIN WORKSPACE: SCHEDULED LISTS & UNDERSTATED PREPARATION   */}
      {/* ============================================================== */}
      <div className="grid gap-10 lg:grid-cols-[1fr_320px] items-start">
        {/* Left Column: Chronological Rows */}
        <section className="space-y-8">
          {displayedInterviews.length === 0 ? (
            /* Minimal Empty State */
            <div className="rounded-2xl border border-[#E4E7EF] bg-white p-10 text-center space-y-3">
              <h3 className="font-display text-base font-bold text-[#0B1020]">
                No upcoming interviews
              </h3>
              <p className="text-xs text-[#56627A] max-w-sm mx-auto leading-relaxed">
                Interview schedules will appear here when an application moves to the interview stage.
              </p>
              <div className="pt-2">
                <Link to="/student/applications">
                  <Button variant="secondary" className="text-xs">
                    Browse applications
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Upcoming Interviews Section */}
              {filterTab !== "Completed" && upcomingInterviews.length > 0 && (
                <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-2">
                  <div className="border-b border-[#E4E7EF] pb-3 flex items-center justify-between">
                    <h2 className="font-display text-sm font-bold text-[#0B1020]">
                      Upcoming interviews
                    </h2>
                    <span className="text-xs text-[#56627A]">
                      {upcomingInterviews.length} scheduled
                    </span>
                  </div>

                  <div className="divide-y divide-[#E4E7EF]">
                    {upcomingInterviews.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedInterview(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedInterview(item);
                          }
                        }}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 px-2 -mx-2 rounded-xl transition-colors hover:bg-[#F7F8FC] cursor-pointer"
                      >
                        {/* Date numeral + details */}
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="shrink-0 flex flex-col items-center justify-center w-12 pt-0.5 text-center">
                            <span className="font-display text-xl font-extrabold tracking-tight text-[#0B1020] group-hover:text-[#5146E5] transition-colors leading-none">
                              {item.day}
                            </span>
                            <span className="text-[10px] font-bold tracking-wider uppercase text-[#56627A]">
                              {item.month}
                            </span>
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <h3 className="font-display text-sm font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                              {item.company}
                            </h3>
                            <p className="text-xs text-[#56627A]">
                              {item.role}
                            </p>
                            <p className="text-[11px] text-[#56627A] pt-0.5">
                              {item.round} · {item.time} · {item.mode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center pl-16 sm:pl-0">
                          <Badge tone={item.isNext ? "indigo" : "emerald"}>
                            {item.status}
                          </Badge>
                          <span className="text-xs text-[#56627A] group-hover:text-[#5146E5] transition-colors">
                            →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completed Interviews Section (Visually Secondary) */}
              {filterTab !== "Upcoming" && completedInterviews.length > 0 && (
                <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-2 opacity-90">
                  <div className="border-b border-[#E4E7EF] pb-3 flex items-center justify-between">
                    <h2 className="font-display text-sm font-bold text-[#56627A]">
                      Completed interviews
                    </h2>
                    <span className="text-xs text-slate-400">
                      {completedInterviews.length} completed
                    </span>
                  </div>

                  <div className="divide-y divide-[#E4E7EF]">
                    {completedInterviews.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedInterview(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedInterview(item);
                          }
                        }}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-2 -mx-2 rounded-xl transition-colors hover:bg-slate-50 cursor-pointer"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="shrink-0 flex flex-col items-center justify-center w-12 pt-0.5 text-center text-slate-400">
                            <span className="font-display text-lg font-bold leading-none">
                              {item.day}
                            </span>
                            <span className="text-[10px] font-semibold uppercase">
                              {item.month}
                            </span>
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <h3 className="text-xs font-bold text-[#0B1020]">
                              {item.company}
                            </h3>
                            <p className="text-xs text-[#56627A]">
                              {item.role} · {item.round}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center pl-16 sm:pl-0">
                          <Badge tone="slate">Completed</Badge>
                          <span className="text-xs text-slate-300">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Right Column: Understated Preparation Section */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="border-b border-[#E4E7EF] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                Guidance
              </span>
              <h2 className="font-display text-sm font-bold text-[#0B1020] mt-0.5">
                Before your interview
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  key: "prep-resume",
                  title: "Review your resume",
                  desc: "Walk through every project, skill, and bullet point listed on your verified resume.",
                },
                {
                  key: "prep-role",
                  title: "Review the role",
                  desc: "Revisit company mission, engineering requirements, and domain expectations.",
                },
                {
                  key: "prep-projects",
                  title: "Be ready to discuss your projects",
                  desc: "Structure technical talking points around challenges, choices, and outcomes.",
                },
              ].map((item) => {
                const isChecked = checkedPrep[item.key] || false;
                return (
                  <div
                    key={item.key}
                    onClick={() => togglePrep(item.key)}
                    className="flex items-start gap-3 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50 p-3 transition-colors hover:bg-white cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => togglePrep(item.key)}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#5146E5] focus:ring-[#EEF0FF] cursor-pointer"
                      aria-label={item.title}
                    />
                    <div className="space-y-0.5 text-xs">
                      <p
                        className={`font-semibold ${
                          isChecked ? "line-through text-[#56627A]" : "text-[#0B1020]"
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#56627A] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-xl border border-indigo-100 bg-[#EEF0FF]/40 p-3 text-xs text-[#56627A] leading-relaxed">
              Institutional interviews require verified Somaiya college credentials. Ensure your environment is prepared 10 minutes prior.
            </div>
          </div>
        </aside>
      </div>

      {/* ============================================================== */}
      {/* 4. REFINED DETAIL DRAWER / MODAL                               */}
      {/* ============================================================== */}
      {selectedInterview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-interview-title"
          className="fixed inset-0 z-50 flex justify-end bg-[#0B1020]/40 backdrop-blur-xs transition-opacity duration-200"
        >
          {/* Backdrop button */}
          <button
            onClick={() => setSelectedInterview(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close interview details"
          />

          {/* Slide-over Content Container */}
          <div className="relative z-10 w-full max-w-xl h-full bg-white border-l border-[#E4E7EF] shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
            {/* Drawer Header */}
            <div className="border-b border-[#E4E7EF] p-6 bg-white space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#5146E5]">
                      {selectedInterview.id}
                    </span>
                    <span className="text-xs text-[#56627A]">·</span>
                    <span className="text-xs font-semibold text-[#56627A]">
                      Application {selectedInterview.applicationId}
                    </span>
                  </div>
                  <h3
                    id="drawer-interview-title"
                    className="mt-1 font-display text-2xl font-bold text-[#0B1020]"
                  >
                    {selectedInterview.company}
                  </h3>
                  <p className="text-xs font-semibold text-[#56627A]">
                    {selectedInterview.role} · {selectedInterview.round}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedInterview(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B1020] transition-colors"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>

              {/* Status & Timing Pill */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge
                  tone={
                    selectedInterview.status === "Completed"
                      ? "slate"
                      : "indigo"
                  }
                >
                  {selectedInterview.status}
                </Badge>
                <span className="text-xs text-[#56627A]">
                  {selectedInterview.date} at {selectedInterview.time} ({selectedInterview.duration})
                </span>
              </div>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#56627A] bg-[#FAFAFC]">
              {/* Essential Interview Details */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Interview Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#56627A]">
                      Mode
                    </span>
                    <p className="font-semibold text-[#0B1020] text-xs mt-0.5">
                      {selectedInterview.mode} ({selectedInterview.platform})
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#56627A]">
                      Platform / Location
                    </span>
                    <p className="font-semibold text-[#0B1020] text-xs mt-0.5">
                      {selectedInterview.locationDetails}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase text-[#56627A]">
                      Panel Evaluators
                    </span>
                    <p className="font-semibold text-[#0B1020] text-xs mt-0.5">
                      {selectedInterview.panel}
                    </p>
                  </div>
                </div>
              </div>

              {/* Minimal 4-Step Timeline */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                    Recruitment Stage Timeline
                  </span>
                  <span className="text-[10px] text-[#56627A]">Placement Progress</span>
                </div>

                <div className="space-y-4 pt-1">
                  {selectedInterview.timeline.map((step, idx) => {
                    const isCompleted = step.state === "completed";
                    const isCurrent = step.state === "current";
                    return (
                      <div key={idx} className="flex items-start gap-3 relative">
                        {idx < selectedInterview.timeline.length - 1 && (
                          <div className="absolute left-[7px] top-[18px] bottom-[-16px] w-[2px] bg-[#E4E7EF]" />
                        )}

                        <div className="relative z-10 mt-1">
                          {isCompleted ? (
                            <div className="h-4 w-4 rounded-full bg-[#16886A] text-white flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </div>
                          ) : isCurrent ? (
                            <div className="h-4 w-4 rounded-full border-2 border-[#5146E5] bg-white flex items-center justify-center">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
                            </div>
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-slate-300 bg-white" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p
                              className={`font-semibold ${
                                isCurrent
                                  ? "text-[#5146E5] font-bold"
                                  : "text-[#0B1020]"
                              }`}
                            >
                              {step.step}
                            </p>
                            <span className="text-[10px] text-[#56627A] font-mono shrink-0">
                              {step.date}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#56627A] mt-0.5">
                            {step.note}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Instructions */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Round Instructions
                </span>
                <p className="text-xs text-[#0B1020] leading-relaxed">
                  {selectedInterview.notes}
                </p>
              </div>
            </div>

            {/* Drawer Actions */}
            <div className="border-t border-[#E4E7EF] p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                to="/student/applications"
                className="w-full sm:w-auto"
                onClick={() => setSelectedInterview(null)}
              >
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto text-xs py-2 px-3.5"
                >
                  View application
                </Button>
              </Link>

              {selectedInterview.status === "Upcoming" && (
                <Link
                  to="/student/ai-interview"
                  className="w-full sm:w-auto"
                  onClick={() => setSelectedInterview(null)}
                >
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto text-xs py-2 px-3.5"
                  >
                    Prepare for interview
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
