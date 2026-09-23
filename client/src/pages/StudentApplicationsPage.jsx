import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "../components/ui.jsx";
import {
  applicationsSummary,
  initialApplications,
  pipelineStages,
} from "../data/applicationsData.js";

export function StudentApplicationsPage() {
  const [applications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  // Selected application for slide-over detail panel
  const [selectedApp, setSelectedApp] = useState(null);

  const hasActiveFilters = search.trim() !== "" || stageFilter !== "All";

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setStageFilter("All");
  }, []);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Keyword search
      const query = search.trim().toLowerCase();
      if (query) {
        const matchCompany = app.company.toLowerCase().includes(query);
        const matchRole = app.role.toLowerCase().includes(query);
        const matchId = app.id.toLowerCase().includes(query);
        if (!matchCompany && !matchRole && !matchId) return false;
      }

      // Stage filter
      if (stageFilter === "Active") {
        return app.stage !== "Closed";
      }
      if (stageFilter !== "All" && app.stage !== stageFilter) {
        return false;
      }

      return true;
    });
  }, [applications, search, stageFilter]);

  return (
    <div className="space-y-8 pb-12">
      {/* ============================================================== */}
      {/* 1. PAGE HEADER & CONTEXTUAL SUMMARY STRIP                      */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Student workspace
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Applications
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Track your placement applications, current stages, interviews, and next steps.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
            Somaiya TPO Verified
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#5146E5]">
            {applicationsSummary.total} Active
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PIPELINE PROGRESSION SUMMARY STRIP                          */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
          <div>
            <h2 className="font-display text-sm font-bold text-[#0B1020]">
              Placement Pipeline Progression
            </h2>
            <p className="text-xs text-[#56627A]">
              Current distribution of your applications across recruitment stages
            </p>
          </div>
          <span className="text-[11px] font-semibold text-[#5146E5]">
            Click a stage to filter
          </span>
        </div>

        {/* Pipeline Segment Track */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {pipelineStages.map((stage, idx) => {
            const isFilterActive = stageFilter === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() =>
                  setStageFilter(isFilterActive ? "All" : stage.id)
                }
                className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
                  isFilterActive
                    ? "border-[#5146E5] bg-[#EEF0FF]/40 ring-2 ring-[#EEF0FF]"
                    : "border-[#E4E7EF] bg-[#F7F8FC]/60 hover:bg-white hover:border-[#D1D5E3]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                    0{idx + 1}
                  </span>
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold ${
                      stage.count > 0
                        ? "bg-[#5146E5] text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {stage.count}
                  </span>
                </div>
                <p className="mt-2 text-xs font-bold text-[#0B1020]">
                  {stage.label}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SEARCH & FILTER CONTROLS                                    */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-subtle space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Keyword Search Field */}
          <div className="relative flex-1 max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9DA8BC]">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role, company, or application ID..."
              className="w-full rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] py-2.5 pl-9 pr-3 text-xs sm:text-sm text-[#0B1020] placeholder:text-[#9DA8BC] focus:border-[#5146E5] focus:bg-white focus:outline-none transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-[#0B1020] text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Stage Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            {["All", "Active", "Offer", "Interview", "Screening", "Closed"].map(
              (tab) => {
                const isActive = stageFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setStageFilter(tab)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0B1020] text-white shadow-subtle"
                        : "border border-[#E4E7EF] bg-white text-[#56627A] hover:bg-[#F7F8FC] hover:text-[#0B1020]"
                    }`}
                  >
                    {tab}
                  </button>
                );
              },
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-[#E4E7EF]/80 pt-2.5 text-xs">
            <span className="text-[#56627A]">
              Showing results for active filter:{" "}
              <span className="font-bold text-[#0B1020]">{stageFilter}</span>
              {search && <span> · "{search}"</span>}
            </span>
            <button
              onClick={handleResetFilters}
              className="font-semibold text-[#5146E5] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 4. STRUCTURED APPLICATION RECORDS LIST                         */}
      {/* ============================================================== */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-semibold text-[#56627A]">
            Showing{" "}
            <span className="font-bold text-[#0B1020]">
              {filteredApplications.length}
            </span>{" "}
            applications
          </p>
          <span className="text-[11px] text-[#56627A]">
            Active candidate: Aarav Kulkarni (ROLL-2022-CS-154)
          </span>
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D1D5E3] bg-white p-12 text-center space-y-3 shadow-2xs">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-[#EEF0FF] text-[#5146E5]">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-[#0B1020]">
              No applications match your filter
            </h3>
            <p className="text-xs text-[#56627A] max-w-sm mx-auto leading-relaxed">
              We couldn't find any placement applications matching your criteria.
              Try adjusting your filter or search query.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                onClick={handleResetFilters}
                className="text-xs font-semibold py-2 px-4 rounded-xl border-[#E4E7EF]"
              >
                Clear Filters
              </Button>
              <Link
                to="/student/jobs"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition-colors"
              >
                <span>Explore Jobs</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Application Cards / Rows */
          <div className="space-y-3">
            {filteredApplications.map((app) => {
              const isSelected = selectedApp?.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={`group cursor-pointer rounded-2xl border bg-white p-5 sm:p-6 transition-all shadow-subtle ${
                    isSelected
                      ? "border-[#5146E5] ring-2 ring-[#EEF0FF]"
                      : "border-[#E4E7EF] hover:border-[#5146E5]/40 hover:bg-[#FAFAFC]"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Monogram, Role, Company & Meta */}
                    <div className="flex items-start gap-4 min-w-0">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0B1020] text-white font-display text-sm font-bold shadow-subtle group-hover:bg-[#5146E5] transition-colors">
                        {app.company[0]}
                      </span>

                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-base sm:text-lg font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                            {app.role}
                          </h3>
                          <span className="text-xs text-[#56627A]">at</span>
                          <span className="font-semibold text-xs text-[#0B1020]">
                            {app.company}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {app.id}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#56627A]">
                          <span>Applied on {app.appliedOn}</span>
                          <span>·</span>
                          <span>{app.location}</span>
                          <span>·</span>
                          <span className="font-semibold text-[#0B1020]">
                            {app.stipend}
                          </span>
                        </div>

                        {/* Next Step / Action Callout */}
                        <div className="pt-1 flex items-center gap-2">
                          <span className="text-[11px] font-bold text-[#0B1020]">
                            Next:
                          </span>
                          <span
                            className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                              app.stage === "Offer"
                                ? "bg-[#E8F6F1] text-[#16886A]"
                                : app.stage === "Interview"
                                  ? "bg-[#EEF0FF] text-[#5146E5]"
                                  : app.stage === "Closed"
                                    ? "bg-slate-100 text-slate-500"
                                    : "bg-[#F7F8FC] border border-[#E4E7EF] text-[#56627A]"
                            }`}
                          >
                            {app.nextAction}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Stage Badge & View Action */}
                    <div className="flex flex-wrap lg:flex-col items-start lg:items-end justify-between lg:justify-center gap-2.5 border-t lg:border-t-0 border-[#E4E7EF]/80 pt-3 lg:pt-0 shrink-0">
                      <Badge tone={app.tone}>{app.status}</Badge>

                      <span className="text-xs font-semibold text-[#5146E5] group-hover:underline flex items-center gap-1">
                        <span>View timeline & details</span>
                        <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 5. APPLICATION DETAILS SLIDE-OVER DRAWER                       */}
      {/* ============================================================== */}
      {selectedApp && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="app-details-title"
          className="fixed inset-0 z-50 flex items-center justify-end bg-[#0B1020]/60 backdrop-blur-xs animate-fade-in"
        >
          {/* Backdrop button to close */}
          <button
            onClick={() => setSelectedApp(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close application details backdrop"
          />

          {/* Slide-over Content Container */}
          <div className="relative z-10 w-full max-w-xl h-full bg-white border-l border-[#E4E7EF] shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
            {/* Drawer Header */}
            <div className="border-b border-[#E4E7EF] p-6 bg-white space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#5146E5]">
                      {selectedApp.id}
                    </span>
                    <span className="text-xs text-[#56627A]">·</span>
                    <span className="text-xs font-semibold text-[#56627A]">
                      Applied {selectedApp.appliedOn}
                    </span>
                  </div>
                  <h3
                    id="app-details-title"
                    className="mt-1 font-display text-2xl font-bold text-[#0B1020]"
                  >
                    {selectedApp.role}
                  </h3>
                  <p className="text-xs font-semibold text-[#56627A]">
                    {selectedApp.company} · {selectedApp.location}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B1020]"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 pt-1">
                <Badge tone={selectedApp.tone}>{selectedApp.status}</Badge>
                <span className="text-xs text-[#56627A]">
                  Stage: <b className="text-[#0B1020]">{selectedApp.stage}</b>
                </span>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#56627A] bg-[#FAFAFC]">
              {/* "What Should I Do Next?" Callout */}
              <div
                className={`p-4 rounded-xl border space-y-1.5 ${
                  selectedApp.stage === "Offer"
                    ? "border-emerald-200 bg-[#E8F6F1]/60"
                    : selectedApp.stage === "Interview"
                      ? "border-indigo-100 bg-[#EEF0FF]/60"
                      : "border-[#E4E7EF] bg-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                    Recommended Action
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold text-[#0B1020]">
                  {selectedApp.nextAction}
                </h4>
                <p className="text-xs text-[#56627A] leading-relaxed">
                  {selectedApp.stage === "Offer"
                    ? "Review the formal compensation and internship commitment terms before accepting via Somaiya Placement Office."
                    : selectedApp.stage === "Interview"
                      ? "Review core React and system design concepts. Ensure your audio and webcam link are tested 10 minutes prior."
                      : "Your application is advancing through routine placement cell verification. No immediate student action required."}
                </p>
              </div>

              {/* Offer Details Callout (If in Offer Stage) */}
              {selectedApp.offer && (
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-2">
                    <span className="font-bold text-xs text-[#16886A]">
                      Official Campus Placement Offer
                    </span>
                    <Badge tone="emerald">Offer Valid</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#56627A]">
                        Compensation
                      </span>
                      <p className="font-bold text-[#0B1020] text-sm">
                        {selectedApp.offer.compensation}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#56627A]">
                        Duration
                      </span>
                      <p className="font-bold text-[#0B1020] text-sm">
                        {selectedApp.offer.duration}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#56627A]">
                        Location
                      </span>
                      <p className="font-semibold text-[#0B1020]">
                        {selectedApp.offer.location}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#56627A]">
                        Decision Deadline
                      </span>
                      <p className="font-bold text-amber-700">
                        {selectedApp.offer.deadline}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E4E7EF] pt-2">
                    <p className="text-[11px] text-[#56627A]">
                      {selectedApp.offer.note}
                    </p>
                    <Link
                      to="/student/offers"
                      className="text-xs font-semibold text-[#5146E5] hover:underline shrink-0 ml-3"
                    >
                      Review offer →
                    </Link>
                  </div>
                </div>
              )}

              {/* Interview Milestone Callout (If Interview Scheduled) */}
              {selectedApp.interview && (
                <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-2">
                    <span className="font-bold text-xs text-[#5146E5]">
                      Upcoming Interview Milestone
                    </span>
                    <Badge tone="indigo">Confirmed</Badge>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p className="font-bold text-xs text-[#0B1020]">
                      {selectedApp.interview.round}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#56627A]">
                      <span>📅 {selectedApp.interview.date}</span>
                      <span>⏱ {selectedApp.interview.time}</span>
                      <span>📍 {selectedApp.interview.mode}</span>
                    </div>
                    {selectedApp.interview.panel && (
                      <p className="text-[11px] text-[#56627A]">
                        <span className="font-semibold">Panel: </span>
                        {selectedApp.interview.panel}
                      </p>
                    )}
                    {selectedApp.interview.instructions && (
                      <p className="text-[11px] text-[#5146E5] bg-[#EEF0FF] p-2 rounded-lg mt-1">
                        {selectedApp.interview.instructions}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Application Progress Timeline */}
              <div className="bg-white p-5 rounded-xl border border-[#E4E7EF] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
                  <h4 className="font-bold text-xs text-[#0B1020]">
                    Application Progress Timeline
                  </h4>
                  <span className="text-[11px] text-[#56627A]">
                    {selectedApp.timeline.length} Recorded Milestones
                  </span>
                </div>

                {/* Vertical Timeline */}
                <div className="space-y-4 relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E4E7EF]">
                  {selectedApp.timeline.map((item, idx) => {
                    const isCompleted = item.state === "completed";
                    const isCurrent = item.state === "current";

                    return (
                      <div key={idx} className="relative">
                        {/* Dot indicator */}
                        <span
                          className={`absolute -left-5 top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${
                            isCompleted
                              ? "bg-[#16886A] text-white text-[10px]"
                              : isCurrent
                                ? "bg-[#5146E5] text-white text-[10px]"
                                : "bg-slate-200"
                          }`}
                        >
                          {isCompleted ? "✓" : isCurrent ? "●" : ""}
                        </span>

                        <div className="space-y-0.5">
                          <div className="flex items-baseline justify-between gap-2">
                            <p
                              className={`text-xs font-bold ${
                                isCurrent
                                  ? "text-[#5146E5]"
                                  : isCompleted
                                    ? "text-[#0B1020]"
                                    : "text-slate-400"
                              }`}
                            >
                              {item.step}
                            </p>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {item.date}
                            </span>
                          </div>
                          <p className="text-xs text-[#56627A] leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resume & Eligibility Snapshot */}
              <div className="bg-white p-4 rounded-xl border border-[#E4E7EF] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-2">
                  <span className="font-bold text-xs text-[#0B1020]">
                    Submitted Placement Credentials
                  </span>
                  <span className="text-[11px] text-[#16886A]">
                    TPO Verified
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#56627A]">Attached Resume:</span>
                    <Link
                      to="/student/resume"
                      className="font-bold text-[#5146E5] hover:underline flex items-center gap-1"
                    >
                      <span>{selectedApp.resumeVersion}</span>
                      <svg
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-[#F7F8FC] pt-1.5">
                    <span className="text-[#56627A]">Academic CGPA:</span>
                    <span className="font-bold text-[#0B1020]">
                      {selectedApp.eligibilitySnapshot.cgpa}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-[#F7F8FC] pt-1.5">
                    <span className="text-[#56627A]">Active Backlogs:</span>
                    <span className="font-bold text-[#16886A]">
                      {selectedApp.eligibilitySnapshot.backlogs} (Clean Record)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Sticky Footer */}
            <div className="border-t border-[#E4E7EF] p-5 bg-white flex items-center justify-between gap-3">
              <Link
                to="/student/jobs"
                className="text-xs font-semibold text-[#56627A] hover:text-[#5146E5] transition-colors"
              >
                ← Back to Jobs
              </Link>

              <Button
                variant="secondary"
                onClick={() => setSelectedApp(null)}
                className="text-xs font-semibold py-2 px-4 rounded-xl border-[#E4E7EF]"
              >
                Close Drawer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
