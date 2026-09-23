import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { initialRecruiterInterviews } from "../data/recruiterInterviewsData.js";

const STATUS_FILTERS = ["All", "Upcoming", "Completed"];
const MODE_FILTERS = ["All Modes", "Virtual", "On campus"];

export function RecruiterInterviewsPage() {
  const [interviews, setInterviews] = useState(initialRecruiterInterviews);
  const [selectedStatus, setSelectedStatus] = useState("Upcoming");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(null); // { interviewId, candidateName, date, time } | null
  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // Filtered interviews list
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      if (selectedStatus === "Upcoming" && item.status !== "Upcoming") return false;
      if (selectedStatus === "Completed" && item.status !== "Completed") return false;
      if (selectedMode !== "All Modes" && item.mode.toLowerCase() !== selectedMode.toLowerCase()) return false;
      return true;
    });
  }, [interviews, selectedStatus, selectedMode]);

  // Counts for filter pills
  const statusCounts = useMemo(() => {
    return {
      All: interviews.length,
      Upcoming: interviews.filter((i) => i.status === "Upcoming").length,
      Completed: interviews.filter((i) => i.status === "Completed").length,
    };
  }, [interviews]);

  // Mark interview complete (local state update)
  const handleMarkComplete = (interviewId) => {
    setInterviews((prev) =>
      prev.map((i) => {
        if (i.id === interviewId) {
          return {
            ...i,
            status: "Completed",
            timeline: [
              ...i.timeline,
              { stage: "Interview", date: "Today", note: "Marked complete by recruiter panel." },
            ],
          };
        }
        return i;
      }),
    );

    if (selectedInterview && selectedInterview.id === interviewId) {
      setSelectedInterview((prev) => ({
        ...prev,
        status: "Completed",
        timeline: [
          ...prev.timeline,
          { stage: "Interview", date: "Today", note: "Marked complete by recruiter panel." },
        ],
      }));
    }

    showToast("Interview marked as completed. Candidate record updated.");
  };

  // Handle reschedule submit (frontend only)
  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!rescheduleModal) return;

    const { interviewId, date, time } = rescheduleModal;
    setInterviews((prev) =>
      prev.map((i) => {
        if (i.id === interviewId) {
          const parts = date.split(" ");
          return {
            ...i,
            date,
            day: parts[0] || i.day,
            month: (parts[1] || i.month).toUpperCase(),
            time,
          };
        }
        return i;
      }),
    );

    if (selectedInterview && selectedInterview.id === interviewId) {
      const parts = date.split(" ");
      setSelectedInterview((prev) => ({
        ...prev,
        date,
        day: parts[0] || prev.day,
        month: (parts[1] || prev.month).toUpperCase(),
        time,
      }));
    }

    setRescheduleModal(null);
    showToast(`Interview rescheduled to ${date} at ${time}.`);
  };

  // Close drawer on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedInterview(null);
        setRescheduleModal(null);
      }
    }
    if (selectedInterview || rescheduleModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedInterview, rescheduleModal]);

  return (
    <div className="space-y-8 pb-16">
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
            Recruiter Workspace / Interviews
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Interviews
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Upcoming evaluation rounds, candidate schedules, and panel allocations.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
            Somaiya TPO Panel Active
          </span>
          <span className="text-xs font-semibold text-[#56627A]">
            {statusCounts.Upcoming} Upcoming
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. MINIMAL FILTER CONTROLS                                     */}
      {/* ============================================================== */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "border border-[#5146E5] bg-[#5146E5]/10 text-[#5146E5]"
                    : "border border-[#E4E7EF] bg-white text-[#56627A] hover:border-[#D1D5E2] hover:text-[#0B1020]"
                }`}
              >
                <span>{status}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isSelected
                      ? "bg-[#5146E5] text-white"
                      : "bg-[#F0F2F7] text-[#56627A]"
                  }`}
                >
                  {statusCounts[status]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mode Filter Pills */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#8F9CAE]">Mode:</span>
          <div className="inline-flex rounded-xl border border-[#E4E7EF] bg-white p-0.5">
            {MODE_FILTERS.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  selectedMode === mode
                    ? "bg-[#0B1020] text-white"
                    : "text-[#56627A] hover:text-[#0B1020]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. CHRONOLOGICAL INTERVIEW LIST                                */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white shadow-subtle overflow-hidden">
        <div className="border-b border-[#E4E7EF] bg-[#F7F8FC] px-6 py-3 flex items-center justify-between text-xs text-[#56627A]">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8F9CAE]">
            Chronological Schedule · {filteredInterviews.length} {filteredInterviews.length === 1 ? "Interview" : "Interviews"}
          </span>
          <span className="hidden sm:inline text-[#8F9CAE]">Click any round to view panel details</span>
        </div>

        {filteredInterviews.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-[#0B1020]">No interviews found</p>
            <p className="mt-1 text-xs text-[#56627A]">
              There are no {selectedStatus.toLowerCase()} interviews matching "{selectedMode}".
            </p>
            <button
              onClick={() => {
                setSelectedStatus("All");
                setSelectedMode("All Modes");
              }}
              className="mt-4 text-xs font-semibold text-[#5146E5] hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E4E7EF]">
            {filteredInterviews.map((interview) => (
              <div
                key={interview.id}
                onClick={() => setSelectedInterview(interview)}
                className="group relative flex flex-col gap-4 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between hover:bg-[#F9FAFD] transition-colors cursor-pointer"
              >
                {/* Left: Compact Date Treatment + Candidate info */}
                <div className="flex items-start gap-4">
                  {/* Compact Date Box */}
                  <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] text-center transition-colors group-hover:border-[#5146E5]/40 group-hover:bg-[#5146E5]/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A] group-hover:text-[#5146E5]">
                      {interview.month}
                    </span>
                    <span className="font-display text-lg font-bold text-[#0B1020] leading-tight">
                      {interview.day}
                    </span>
                  </div>

                  {/* Candidate, Role & Round */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-base font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                        {interview.candidateName}
                      </span>
                      <span className="text-xs text-[#8F9CAE]">·</span>
                      <span className="text-xs font-semibold text-[#56627A]">
                        {interview.role}
                      </span>
                      {interview.status === "Completed" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] border border-[#16886A]/20 px-2 py-0.5 text-[10px] font-semibold text-[#16886A]">
                          Completed
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#56627A]">
                      <span className="font-medium text-[#0B1020]">{interview.round}</span>
                      <span className="text-[#8F9CAE]">·</span>
                      <span>{interview.time}</span>
                      <span className="text-[#8F9CAE]">·</span>
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            interview.mode === "Virtual" ? "bg-sky-500" : "bg-emerald-500"
                          }`}
                        />
                        {interview.mode}
                      </span>
                    </div>

                    <p className="text-xs text-[#8F9CAE] truncate max-w-md">
                      Panel: {interview.panel}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="text-xs font-semibold text-[#5146E5] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    View details
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 4. SLIDE-OVER DETAIL DRAWER                                    */}
      {/* ============================================================== */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0B1020]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedInterview(null)}
          />

          {/* Drawer Content */}
          <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl border-l border-[#E4E7EF] overflow-y-auto">
            {/* Drawer Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E4E7EF] bg-white/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#56627A]">
                  {selectedInterview.applicationId}
                </span>
                <span className="text-xs text-[#8F9CAE]">·</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    selectedInterview.status === "Completed"
                      ? "bg-[#F0FDF4] text-[#16886A] border border-[#16886A]/20"
                      : "bg-[#5146E5]/10 text-[#5146E5] border border-[#5146E5]/20"
                  }`}
                >
                  {selectedInterview.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedInterview(null)}
                className="rounded-lg p-1.5 text-[#56627A] hover:bg-[#F0F2F7] hover:text-[#0B1020] transition-colors"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            {/* Candidate & Round Summary */}
            <div className="p-6 border-b border-[#E4E7EF] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                {selectedInterview.round}
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0B1020]">
                {selectedInterview.candidateName}
              </h2>
              <p className="text-xs text-[#56627A]">
                {selectedInterview.role} · Application ID: {selectedInterview.applicationId}
              </p>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Schedule Details Card */}
              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Schedule & Venue
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8F9CAE] block">Date & Time</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedInterview.date} · {selectedInterview.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Duration</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedInterview.duration}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Format / Mode</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedInterview.mode} ({selectedInterview.platform})
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Location Details</span>
                    <span className="font-semibold text-[#0B1020] truncate block">
                      {selectedInterview.locationDetails}
                    </span>
                  </div>
                </div>
              </div>

              {/* Panel Allocation Card */}
              <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Evaluation Panel
                </p>
                <p className="text-xs font-semibold text-[#0B1020]">
                  {selectedInterview.panel}
                </p>
                <p className="text-xs text-[#56627A] pt-1 border-t border-[#E4E7EF]">
                  Focus: {selectedInterview.notes}
                </p>
              </div>

              {/* Simple Recruitment Timeline */}
              <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Recruitment Timeline
                </p>
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E4E7EF]">
                  {["Applied", "Screening", "Shortlisted", "Interview"].map((step, idx) => {
                    const isReached = true;
                    const isCurrent = step === "Interview";
                    return (
                      <div key={step} className="relative flex items-start gap-4 pl-8">
                        <div
                          className={`absolute left-1.5 top-1 h-3.5 w-3.5 rounded-full border-2 bg-white ${
                            isCurrent
                              ? "border-[#5146E5] ring-2 ring-[#5146E5]/20"
                              : isReached
                                ? "border-[#16886A] bg-[#16886A]"
                                : "border-[#E4E7EF]"
                          }`}
                        />
                        <div className="space-y-0.5">
                          <p
                            className={`text-xs font-semibold ${
                              isCurrent ? "text-[#5146E5]" : "text-[#0B1020]"
                            }`}
                          >
                            {step}
                          </p>
                          <p className="text-[11px] text-[#8F9CAE]">
                            {idx === 0 && "18 Aug 2026 · Institutional drive application"}
                            {idx === 1 && "20 Aug 2026 · Evaluation round cleared"}
                            {idx === 2 && "22 Aug 2026 · Advanced by recruiter"}
                            {idx === 3 && `${selectedInterview.date} · Scheduled round`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EF] bg-white p-4">
              <Link
                to="/recruiter/candidates"
                className="text-xs font-semibold text-[#5146E5] hover:underline"
              >
                View candidate profile →
              </Link>

              <div className="flex items-center gap-2">
                {selectedInterview.status === "Upcoming" && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setRescheduleModal({
                          interviewId: selectedInterview.id,
                          candidateName: selectedInterview.candidateName,
                          date: selectedInterview.date,
                          time: selectedInterview.time,
                        })
                      }
                      className="rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1020] hover:bg-[#F7F8FC] transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkComplete(selectedInterview.id)}
                      className="rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition-colors shadow-subtle"
                    >
                      Mark complete
                    </button>
                  </>
                )}
                {selectedInterview.status === "Completed" && (
                  <span className="text-xs font-semibold text-[#16886A]">
                    ✓ Round completed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. RESCHEDULE MODAL (LOCAL STATE ONLY)                         */}
      {/* ============================================================== */}
      {rescheduleModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0B1020]/40 backdrop-blur-xs"
            onClick={() => setRescheduleModal(null)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-2xl space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Reschedule Session
              </span>
              <h3 className="mt-1 font-display text-lg font-bold text-[#0B1020]">
                {rescheduleModal.candidateName}
              </h3>
              <p className="mt-1 text-xs text-[#56627A]">
                Update evaluation session timing. Changes are updated locally.
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  New Date
                </label>
                <input
                  type="text"
                  required
                  value={rescheduleModal.date}
                  onChange={(e) =>
                    setRescheduleModal((prev) => ({ ...prev, date: e.target.value }))
                  }
                  placeholder="e.g. 27 Aug 2026"
                  className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  New Time
                </label>
                <input
                  type="text"
                  required
                  value={rescheduleModal.time}
                  onChange={(e) =>
                    setRescheduleModal((prev) => ({ ...prev, time: e.target.value }))
                  }
                  placeholder="e.g. 03:30 PM"
                  className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModal(null)}
                  className="rounded-xl border border-[#E4E7EF] px-3.5 py-2 text-xs font-semibold text-[#56627A] hover:bg-[#F7F8FC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition-colors"
                >
                  Save schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
