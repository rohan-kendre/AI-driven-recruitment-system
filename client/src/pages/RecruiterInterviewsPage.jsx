import { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { interviewsApi } from "../services/interviewsApi.js";
import { applicationsApi } from "../services/applicationsApi.js";

const STATUS_FILTERS = ["All", "Upcoming", "Completed"];
const MODE_FILTERS = ["All Modes", "Virtual", "On campus"];
const isUpcoming = (item) => ["SCHEDULED", "RESCHEDULED"].includes(item.status);
const localDateValue = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const displayDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export function RecruiterInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedule, setSchedule] = useState({ applicationId: "", title: "", date: "", time: "", mode: "Virtual", location: "", meetingLink: "", notes: "" });
  const [minScheduleDate] = useState(() => localDateValue(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("Upcoming");
  const [selectedMode, setSelectedMode] = useState("All Modes");
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(null); // { interviewId, candidateName, date, time } | null
  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  const loadInterviews = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const [data, candidateData] = await Promise.all([interviewsApi.getInterviews(), applicationsApi.getRecruiterCandidates()]);
      setInterviews(data);
      setCandidates((candidateData.candidates || []).filter((candidate) => ["SHORTLISTED", "INTERVIEW"].includes(candidate.status)));
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message || "Unable to load interviews. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadInterviews);
  }, [loadInterviews]);

  // Filtered interviews list
  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      if (selectedStatus === "Upcoming" && !isUpcoming(item)) return false;
      if (selectedStatus === "Completed" && item.status !== "COMPLETED") return false;
      if (selectedMode !== "All Modes" && item.mode.toLowerCase() !== selectedMode.toLowerCase()) return false;
      return true;
    });
  }, [interviews, selectedStatus, selectedMode]);

  // Counts for filter pills
  const statusCounts = useMemo(() => {
    return {
      All: interviews.length,
      Upcoming: interviews.filter(isUpcoming).length,
      Completed: interviews.filter((i) => i.status === "COMPLETED").length,
    };
  }, [interviews]);

  const handleMarkComplete = async (interviewId) => {
    setIsSaving(true);
    try {
      await interviewsApi.updateInterview(interviewId, { status: "COMPLETED" });
      setSelectedInterview(null);
      await loadInterviews();
      showToast("Interview marked as completed.");
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Unable to complete the interview. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async (interviewId) => {
    setIsSaving(true);
    try {
      await interviewsApi.updateInterview(interviewId, { status: "CANCELLED" });
      setSelectedInterview(null);
      await loadInterviews();
      showToast("Interview cancelled.");
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Unable to cancel the interview.");
    } finally { setIsSaving(false); }
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();
    const scheduledAt = new Date(`${schedule.date}T${schedule.time}`);
    if (!Number.isFinite(scheduledAt.getTime()) || scheduledAt.getTime() <= Date.now()) {
      showToast("Choose a future interview date and time.");
      return;
    }
    if (schedule.mode === "Virtual" && !/^https:\/\//i.test(schedule.meetingLink)) {
      showToast("A virtual interview requires an HTTPS meeting link.");
      return;
    }
    if (schedule.mode !== "Virtual" && !schedule.location.trim()) {
      showToast("Enter the interview location.");
      return;
    }
    setIsSaving(true);
    try {
      await interviewsApi.createInterview({ ...schedule, date: scheduledAt.toISOString(), time: schedule.time });
      setShowSchedule(false);
      setSchedule({ applicationId: "", title: "", date: "", time: "", mode: "Virtual", location: "", meetingLink: "", notes: "" });
      await loadInterviews();
      showToast("Interview scheduled.");
    } catch (error) {
      showToast(error.response?.data?.message || "Unable to schedule interview.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleModal) return;

    const { interviewId, date, time, location, meetingLink, workMode } = rescheduleModal;
    const when = new Date(`${date}T${time}`);
    if (!Number.isFinite(when.getTime()) || when.getTime() <= Date.now()) { showToast("Choose a future date and time."); return; }
    setIsSaving(true);
    try {
      await interviewsApi.updateInterview(interviewId, { status: "RESCHEDULED", date: when.toISOString(), time, location, meetingLink, mode: workMode });
      setRescheduleModal(null);
      setSelectedInterview(null);
      await loadInterviews();
      showToast(`Interview rescheduled to ${date} at ${time}.`);
    } catch (error) {
      showToast(error.response?.data?.message || error.message || "Unable to reschedule the interview. Please try again.");
    } finally {
      setIsSaving(false);
    }
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
            Recruiter workspace
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Interviews
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Upcoming evaluation rounds and candidate schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button type="button" onClick={() => setShowSchedule((value) => !value)} className="rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white">Schedule interview</button>
          <span className="text-xs font-semibold text-[#56627A]">
            {statusCounts.Upcoming} Upcoming
          </span>
        </div>
      </section>

      {showSchedule && <form onSubmit={handleScheduleSubmit} className="grid gap-4 rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:grid-cols-2">
        <label className="text-xs font-semibold">Candidate application<select required value={schedule.applicationId} onChange={(event) => setSchedule({ ...schedule, applicationId: event.target.value })} className="mt-1 w-full rounded-lg border p-2"><option value="">Select application</option>{candidates.map((candidate) => <option key={candidate.applicationId} value={candidate.applicationId}>{candidate.name} · {candidate.role}</option>)}</select></label>
        <label className="text-xs font-semibold">Round/title<input required maxLength={120} value={schedule.title} onChange={(event) => setSchedule({ ...schedule, title: event.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label>
        <label className="text-xs font-semibold">Date<input required type="date" min={minScheduleDate} value={schedule.date} onChange={(event) => setSchedule({ ...schedule, date: event.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label>
        <label className="text-xs font-semibold">Time (your local time)<input required type="time" value={schedule.time} onChange={(event) => setSchedule({ ...schedule, time: event.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label>
        <label className="text-xs font-semibold">Mode<select value={schedule.mode} onChange={(event) => setSchedule({ ...schedule, mode: event.target.value })} className="mt-1 w-full rounded-lg border p-2"><option>Virtual</option><option>On Campus</option><option>In Person</option></select></label>
        {schedule.mode === "Virtual" ? <label className="text-xs font-semibold">Meeting URL<input required type="url" value={schedule.meetingLink} onChange={(event) => setSchedule({ ...schedule, meetingLink: event.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label> : <label className="text-xs font-semibold">Location<input required value={schedule.location} onChange={(event) => setSchedule({ ...schedule, location: event.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label>}
        <label className="text-xs font-semibold sm:col-span-2">Notes<textarea value={schedule.notes} onChange={(event) => setSchedule({ ...schedule, notes: event.target.value })} className="mt-1 w-full rounded-lg border p-2" /></label>
        <div className="sm:col-span-2"><button disabled={isSaving || !candidates.length} type="submit" className="rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white">{isSaving ? "Scheduling…" : "Save interview"}</button>{!candidates.length && <p className="mt-2 text-xs text-[#56627A]">Shortlist a candidate before scheduling.</p>}</div>
      </form>}

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

        {isLoading ? (
          <div className="py-16 text-center text-sm text-[#56627A]">Loading interviews…</div>
        ) : loadError ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-[#0B1020]">Could not load interviews</p>
            <p className="mt-1 text-xs text-[#56627A]">{loadError}</p>
            <button onClick={loadInterviews} className="mt-4 text-xs font-semibold text-[#5146E5] hover:underline">Retry</button>
          </div>
        ) : filteredInterviews.length === 0 ? (
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
                      {new Date(interview.date).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="font-display text-lg font-bold text-[#0B1020] leading-tight">
                      {new Date(interview.date).getDate()}
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
                      {interview.status === "COMPLETED" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] border border-[#16886A]/20 px-2 py-0.5 text-[10px] font-semibold text-[#16886A]">
                          Completed
                        </span>
                      )}
                      {interview.status === "CANCELLED" && <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">Cancelled</span>}
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

                    {interview.notes && <p className="text-xs text-[#8F9CAE] truncate max-w-md">{interview.notes}</p>}
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
                    selectedInterview.status === "COMPLETED"
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
                      {displayDate(selectedInterview.date)} · {selectedInterview.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Format / Mode</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedInterview.mode}
                    </span>
                  </div>
                  {selectedInterview.location && <div><span className="text-[#8F9CAE] block">Location</span><span className="font-semibold text-[#0B1020] truncate block">{selectedInterview.location}</span></div>}
                  {selectedInterview.meetingLink && <div><span className="text-[#8F9CAE] block">Meeting link</span><a className="font-semibold text-[#5146E5] underline break-all" href={selectedInterview.meetingLink} target="_blank" rel="noreferrer">Open meeting</a></div>}
                </div>
              </div>

              {selectedInterview.notes && <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-2"><p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">Notes</p><p className="text-xs text-[#56627A]">{selectedInterview.notes}</p></div>}

              <div className="rounded-xl border border-[#E4E7EF] p-4 text-xs text-[#56627A]">
                {displayDate(selectedInterview.date)} · {selectedInterview.time} · {selectedInterview.status}
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
                {isUpcoming(selectedInterview) && (
                  <>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() =>
                        setRescheduleModal({
                          interviewId: selectedInterview.id,
                          candidateName: selectedInterview.candidateName,
                          date: localDateValue(selectedInterview.date),
                          time: selectedInterview.time,
                          location: selectedInterview.location,
                          meetingLink: selectedInterview.meetingLink,
                          workMode: selectedInterview.mode,
                        })
                      }
                      className="rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2 text-xs font-semibold text-[#0B1020] hover:bg-[#F7F8FC] transition-colors"
                    >
                      Reschedule
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleMarkComplete(selectedInterview.id)}
                      className="rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition-colors shadow-subtle"
                    >
                      Mark complete
                    </button>
                    <button type="button" disabled={isSaving} onClick={() => handleCancel(selectedInterview.id)} className="rounded-xl border border-rose-200 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50">Cancel</button>
                  </>
                )}
                {selectedInterview.status === "COMPLETED" && (
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
                Update evaluation session timing.
              </p>
            </div>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleModal.date}
                  onChange={(e) =>
                    setRescheduleModal((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  New Time
                </label>
                <input
                  type="time"
                  required
                  value={rescheduleModal.time}
                  onChange={(e) =>
                    setRescheduleModal((prev) => ({ ...prev, time: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  {rescheduleModal.workMode === "Virtual" ? "Meeting URL" : "Location"}
                </label>
                <input
                  type={rescheduleModal.workMode === "Virtual" ? "url" : "text"}
                  required
                  value={rescheduleModal.workMode === "Virtual" ? rescheduleModal.meetingLink || "" : rescheduleModal.location || ""}
                  onChange={(e) => setRescheduleModal((prev) => ({ ...prev, [rescheduleModal.workMode === "Virtual" ? "meetingLink" : "location"]: e.target.value }))}
                  className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Mode
                </label>
                <select
                  value={rescheduleModal.workMode || "Virtual"}
                  onChange={(e) => setRescheduleModal((prev) => ({ ...prev, workMode: e.target.value }))}
                  className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none bg-white"
                >
                  <option value="Virtual">Virtual</option>
                  <option value="On Campus">On Campus</option>
                  <option value="In Person">In Person</option>
                </select>
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
                  disabled={isSaving}
                  className="rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition-colors"
                >
                  {isSaving ? "Saving…" : "Save schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
