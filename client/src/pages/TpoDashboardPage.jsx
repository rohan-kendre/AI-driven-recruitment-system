import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  tpoProfile,
  placementOverview,
  initialActiveDrives,
  initialAttentionItems,
  placementPipeline,
  recentActivity,
} from "../data/tpoData.js";

export function TpoDashboardPage() {
  const [drives] = useState(initialActiveDrives);
  const [attentionItems, setAttentionItems] = useState(initialAttentionItems);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [activeTab, setActiveTab] = useState("All"); // 'All' | 'Open' | 'Closing soon'

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // Filtered drives
  const filteredDrives = useMemo(() => {
    if (activeTab === "All") return drives;
    return drives.filter((d) => d.status === activeTab);
  }, [drives, activeTab]);

  // Handle attention item resolution (frontend only)
  const handleResolveAttention = (id, label) => {
    setAttentionItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, resolved: true } : item)),
    );
    showToast(`Action completed: ${label}. Record updated locally.`);
  };

  // Close drawer on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedDrive(null);
      }
    }
    if (selectedDrive) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedDrive]);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "Open":
        return "bg-[#F0FDF4] text-[#16886A] border-[#16886A]/20";
      case "Closing soon":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Draft review":
        return "bg-[#F0F2F7] text-[#56627A] border-[#E4E7EF]";
      default:
        return "bg-[#F7F8FC] text-[#56627A] border-[#E4E7EF]";
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#16886A]/20 bg-[#F0FDF4] px-4 py-3 text-xs font-semibold text-[#16886A] shadow-md animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-[#16886A]" />
          <span>{feedbackToast}</span>
          <button
            onClick={() => setFeedbackToast(null)}
            className="ml-2 text-[#16886A]/60 hover:text-[#16886A]"
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. HEADER                                                      */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 border-b border-[#E4E7EF] pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Placement workspace
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Placement overview
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            A clear view of current campus recruitment activity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
            {tpoProfile.institution}
          </span>
          <span className="text-xs font-semibold text-[#56627A]">
            AY {tpoProfile.academicYear}
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. CONCISE PLACEMENT OVERVIEW (VISUALLY SECONDARY)              */}
      {/* ============================================================== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-4 sm:p-5 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
            Active drives
          </span>
          <p className="font-display text-2xl font-bold text-[#0B1020] sm:text-3xl">
            {drives.length}
          </p>
          <p className="text-[11px] text-[#56627A]">Campus recruitment drives</p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-4 sm:p-5 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
            Students placed
          </span>
          <p className="font-display text-2xl font-bold text-[#16886A] sm:text-3xl">
            {placementOverview.studentsPlaced}
          </p>
          <p className="text-[11px] text-[#56627A]">{placementOverview.placedPercentage}</p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-4 sm:p-5 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
            Interviews this week
          </span>
          <p className="font-display text-2xl font-bold text-[#0B1020] sm:text-3xl">
            {placementOverview.interviewsThisWeek}
          </p>
          <p className="text-[11px] text-[#56627A]">Scheduled across 4 panels</p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-4 sm:p-5 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
            Pending approvals
          </span>
          <p className="font-display text-2xl font-bold text-[#5146E5] sm:text-3xl">
            {attentionItems.filter((i) => !i.resolved).length}
          </p>
          <p className="text-[11px] text-[#56627A]">Items require office review</p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. NEEDS ATTENTION SECTION                                     */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#0B1020]">
              Needs attention
            </h2>
            <p className="text-xs text-[#56627A]">
              Essential institutional actions requiring placement office clearance.
            </p>
          </div>
          <span className="rounded-full bg-[#5146E5]/10 px-2.5 py-0.5 text-xs font-semibold text-[#5146E5]">
            {attentionItems.filter((i) => !i.resolved).length} Pending
          </span>
        </div>

        <div className="divide-y divide-[#E4E7EF]">
          {attentionItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between transition-opacity ${
                item.resolved ? "opacity-40" : "opacity-100"
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      item.resolved
                        ? "bg-[#16886A]"
                        : item.type === "recruiter"
                          ? "bg-[#5146E5]"
                          : item.type === "drive"
                            ? "bg-amber-500"
                            : "bg-sky-500"
                    }`}
                  />
                  <p className="text-xs font-semibold text-[#0B1020]">
                    {item.title}
                  </p>
                </div>
                <p className="text-xs text-[#56627A] pl-4">{item.description}</p>
              </div>

              <div className="pl-4 sm:pl-0 shrink-0">
                {item.resolved ? (
                  <span className="text-xs font-semibold text-[#16886A]">
                    ✓ Completed
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleResolveAttention(item.id, item.actionLabel)}
                    className="rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0B1020] hover:border-[#5146E5] hover:text-[#5146E5] transition-colors"
                  >
                    {item.actionLabel}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. ACTIVE PLACEMENT DRIVES (MAIN SECTION)                      */}
      {/* ============================================================== */}
      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[#0B1020]">
              Active recruitment drives
            </h2>
            <p className="text-xs text-[#56627A]">
              Ongoing company hiring drives, current participation, and selection status.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="inline-flex rounded-xl border border-[#E4E7EF] bg-white p-1">
            {["All", "Open", "Closing soon"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-[#0B1020] text-white"
                    : "text-[#56627A] hover:text-[#0B1020]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Drives List */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white shadow-subtle overflow-hidden">
          <div className="border-b border-[#E4E7EF] bg-[#F7F8FC] px-6 py-3 flex items-center justify-between text-xs text-[#56627A]">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8F9CAE]">
              {filteredDrives.length} {filteredDrives.length === 1 ? "Active Drive" : "Active Drives"}
            </span>
            <span className="hidden sm:inline text-[#8F9CAE]">Click any drive to view institutional details</span>
          </div>

          <div className="divide-y divide-[#E4E7EF]">
            {filteredDrives.map((drive) => (
              <div
                key={drive.id}
                onClick={() => setSelectedDrive(drive)}
                className="group flex flex-col gap-4 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between hover:bg-[#F9FAFD] transition-colors cursor-pointer"
              >
                {/* Role & Company */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                      {drive.role}
                    </span>
                    <span className="text-xs text-[#8F9CAE]">·</span>
                    <span className="text-xs font-semibold text-[#56627A]">
                      {drive.company}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#56627A]">
                    <span>{drive.applicantsCount} applicants</span>
                    <span className="text-[#8F9CAE]">·</span>
                    <span>{drive.shortlistedCount} shortlisted</span>
                    <span className="text-[#8F9CAE]">·</span>
                    <span>{drive.interviewsCount} interviews</span>
                    {drive.offersCount > 0 && (
                      <>
                        <span className="text-[#8F9CAE]">·</span>
                        <span className="font-semibold text-[#16886A]">
                          {drive.offersCount} offer
                        </span>
                      </>
                    )}
                    <span className="text-[#8F9CAE]">·</span>
                    <span className="text-[#8F9CAE]">Closes: {drive.deadline}</span>
                  </div>
                </div>

                {/* Status & Action */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                      drive.status,
                    )}`}
                  >
                    {drive.status}
                  </span>
                  <span className="text-xs font-semibold text-[#5146E5] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Details
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PLACEMENT ACTIVITY PROGRESSION & RECENT AUDIT FEED          */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Placement Activity Summary (Minimal Progression) */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-5">
          <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B1020]">
                Placement activity progression
              </h2>
              <p className="text-xs text-[#56627A]">
                Cohort movement through institutional placement stages.
              </p>
            </div>
            <Link
              to="/recruiter/candidates"
              className="text-xs font-semibold text-[#5146E5] hover:underline"
            >
              View candidates →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {placementPipeline.map((step) => (
              <div
                key={step.label}
                className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3 text-center space-y-1"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  {step.label}
                </span>
                <p className="font-display text-xl font-bold text-[#0B1020]">
                  {step.count}
                </p>
                <p className="text-[10px] text-[#56627A] truncate">
                  {step.sublabel}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#E4E7EF] bg-[#F0FDF4] p-3 flex items-center justify-between text-xs text-[#16886A]">
            <span className="font-medium">
              Conversion rate: 23.7% of shortlisted candidates secured offers
            </span>
            <span className="font-bold">68% Cohort Goal</span>
          </div>
        </div>

        {/* Recent Activity Audit Feed */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B1020]">
                Recent activity
              </h2>
              <p className="text-xs text-[#56627A]">
                Verified events across recruiters, students, and drives.
              </p>
            </div>
            <button
              onClick={() => showToast("Exporting placement audit log...")}
              className="text-xs font-semibold text-[#56627A] hover:text-[#0B1020]"
            >
              View reports →
            </button>
          </div>

          <div className="space-y-3">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
                    <span className="font-semibold text-[#0B1020]">{act.title}</span>
                  </div>
                  <p className="text-[#56627A] pl-3.5">{act.entity}</p>
                </div>
                <span className="text-[11px] text-[#8F9CAE] shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. SLIDE-OVER DRIVE DETAIL DRAWER                              */}
      {/* ============================================================== */}
      {selectedDrive && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0B1020]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedDrive(null)}
          />

          {/* Drawer Content */}
          <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl border-l border-[#E4E7EF] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E4E7EF] bg-white/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#56627A]">
                  {selectedDrive.id}
                </span>
                <span className="text-xs text-[#8F9CAE]">·</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusBadge(
                    selectedDrive.status,
                  )}`}
                >
                  {selectedDrive.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedDrive(null)}
                className="rounded-lg p-1.5 text-[#56627A] hover:bg-[#F0F2F7] hover:text-[#0B1020] transition-colors"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            {/* Drive Summary */}
            <div className="p-6 border-b border-[#E4E7EF] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                {selectedDrive.company} · {selectedDrive.domain}
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0B1020]">
                {selectedDrive.role}
              </h2>
              <p className="text-xs text-[#56627A]">
                {selectedDrive.workMode} · {selectedDrive.location}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Participation Stats Card */}
              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Participation & Pipeline
                </p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="rounded-lg bg-white p-2 border border-[#E4E7EF]">
                    <span className="text-[10px] text-[#8F9CAE] block">Applicants</span>
                    <span className="font-display text-base font-bold text-[#0B1020]">
                      {selectedDrive.applicantsCount}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-2 border border-[#E4E7EF]">
                    <span className="text-[10px] text-[#8F9CAE] block">Shortlisted</span>
                    <span className="font-display text-base font-bold text-[#0B1020]">
                      {selectedDrive.shortlistedCount}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-2 border border-[#E4E7EF]">
                    <span className="text-[10px] text-[#8F9CAE] block">Interviews</span>
                    <span className="font-display text-base font-bold text-[#0B1020]">
                      {selectedDrive.interviewsCount}
                    </span>
                  </div>
                  <div className="rounded-lg bg-white p-2 border border-[#E4E7EF]">
                    <span className="text-[10px] text-[#8F9CAE] block">Offers</span>
                    <span className="font-display text-base font-bold text-[#16886A]">
                      {selectedDrive.offersCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Compensation & Timeline */}
              <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Commercial Terms & Deadlines
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8F9CAE] block">Internship Stipend</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedDrive.stipend}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Conversion Package</span>
                    <span className="font-semibold text-[#5146E5]">
                      {selectedDrive.ctc}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Application Deadline</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedDrive.deadline}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Institutional Status</span>
                    <span className="font-semibold text-[#16886A]">
                      Verified TPO Partner
                    </span>
                  </div>
                </div>
              </div>

              {/* Academic Eligibility */}
              <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Academic Eligibility Criteria
                </p>
                <p className="text-xs text-[#0B1020] font-medium leading-relaxed">
                  {selectedDrive.eligibility}
                </p>
              </div>

              {/* Selection Process */}
              <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Institutional Selection Sequence
                </p>
                <ol className="space-y-2 text-xs text-[#56627A]">
                  {selectedDrive.selectionRounds.map((round, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#F0F2F7] text-[10px] font-bold text-[#0B1020]">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{round}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EF] bg-white p-4">
              <button
                type="button"
                onClick={() => {
                  showToast(`Candidate registry exported for ${selectedDrive.role}.`);
                  setSelectedDrive(null);
                }}
                className="text-xs font-semibold text-[#5146E5] hover:underline"
              >
                Export candidates CSV →
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Drive criteria confirmed for ${selectedDrive.company}.`);
                    setSelectedDrive(null);
                  }}
                  className="rounded-xl bg-[#0B1020] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  Confirm criteria
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDrive(null)}
                  className="rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2 text-xs font-semibold text-[#56627A] hover:bg-[#F7F8FC]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
