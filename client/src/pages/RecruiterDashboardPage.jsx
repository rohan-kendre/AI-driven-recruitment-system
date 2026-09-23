import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Badge, Button } from "../components/ui.jsx";
import {
  activeDrive,
  activeJobs,
  pipelineStages,
  recentCandidates,
  recruiterProfile,
  recruiterSummary,
  upcomingInterviews,
} from "../data/recruiterData.js";

export function RecruiterDashboardPage() {
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'createJob' | 'scheduleInterview' | null
  const [feedbackToast, setFeedbackToast] = useState(null);
  const candidatesRef = useRef(null);

  // Form states for quick actions (frontend mock only)
  const [newJobTitle, setNewJobTitle] = useState("");
  const [newJobDept, setNewJobDept] = useState("Engineering");
  const [interviewCandidate, setInterviewCandidate] = useState(
    recentCandidates[0]?.name || "",
  );
  const [interviewDate, setInterviewDate] = useState("2026-08-30");
  const [interviewRound, setInterviewRound] = useState("Technical Round 1");

  const scrollToCandidates = () => {
    if (candidatesRef.current) {
      candidatesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const showToast = useCallback((msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  }, []);

  // Filter candidates by pipeline stage
  const filteredCandidates = useMemo(() => {
    if (selectedStage === "All") return recentCandidates;
    return recentCandidates.filter((can) => can.stage === selectedStage);
  }, [selectedStage]);

  // Handle quick action submissions (frontend only)
  const handleCreateJobSubmit = (e) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;
    setActiveModal(null);
    showToast(`Draft position created: "${newJobTitle}". Ready for campus placement review.`);
    setNewJobTitle("");
  };

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setActiveModal(null);
    showToast(`Interview scheduled for ${interviewCandidate} (${interviewRound}) on ${interviewDate}.`);
  };

  // Close slide-over drawer on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedCandidate(null);
        setActiveModal(null);
      }
    }
    if (selectedCandidate || activeModal) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedCandidate, activeModal]);

  return (
    <div className="space-y-10 pb-16">
      {/* ============================================================== */}
      {/* 1. HEADER & GREETING                                           */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Recruiter workspace
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Good morning, {recruiterProfile.name.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Active hiring drives, candidate pipelines, and upcoming interviews in one focused workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
            {recruiterProfile.company}
          </span>
          <Badge tone="indigo">Campus Drive 2026</Badge>
        </div>
      </section>

      {/* Temporary Feedback Notification Banner */}
      {feedbackToast && (
        <div className="rounded-xl border border-indigo-100 bg-[#EEF0FF] p-3.5 text-xs font-medium text-[#5146E5] flex items-center justify-between transition-all duration-200">
          <span>{feedbackToast}</span>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-[#5146E5] hover:opacity-75 font-semibold text-xs ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PRIMARY AREA: ACTIVE HIRING DRIVE (DOMINANT ELEMENT)        */}
      {/* ============================================================== */}
      <section
        aria-labelledby="active-drive-heading"
        className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-9 shadow-subtle relative overflow-hidden"
      >
        {/* Subtle violet top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#5146E5]" />

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Left Column: Strong Typography & Metrics Hierarchy */}
          <div className="space-y-5 max-w-2xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Active hiring drive
              </span>
              <h2
                id="active-drive-heading"
                className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1020]"
              >
                {activeDrive.role}
              </h2>
              <p className="mt-1 text-base sm:text-lg font-semibold text-[#56627A]">
                {activeDrive.company} · {activeDrive.type}
              </p>
            </div>

            {/* Dominant Drive Metrics */}
            <div className="flex flex-wrap items-baseline gap-6 pt-1">
              <div>
                <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1020]">
                  {activeDrive.applicantsCount}
                </p>
                <span className="text-xs font-semibold text-[#56627A]">
                  applicants
                </span>
              </div>

              <div className="h-8 w-px bg-[#E4E7EF] hidden sm:block" />

              <div>
                <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#5146E5]">
                  {activeDrive.shortlistedCount}
                </p>
                <span className="text-xs font-semibold text-[#56627A]">
                  shortlisted
                </span>
              </div>

              <div className="h-8 w-px bg-[#E4E7EF] hidden sm:block" />

              <div>
                <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#16886A]">
                  {activeDrive.interviewsCount}
                </p>
                <span className="text-xs font-semibold text-[#56627A]">
                  interviews
                </span>
              </div>
            </div>

            {/* Location & Package Details */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#56627A] pt-1">
              <span className="inline-flex items-center gap-1.5 font-medium text-[#0B1020]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                {activeDrive.location}
              </span>
              <span className="text-slate-300">·</span>
              <span>Stipend: {activeDrive.stipend}</span>
              <span className="text-slate-300">·</span>
              <span>Decision deadline: {activeDrive.decisionDeadline}</span>
            </div>
          </div>

          {/* Right Column: Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <Button
              variant="primary"
              onClick={scrollToCandidates}
              className="rounded-xl px-5 py-2.5 text-xs font-semibold shadow-subtle justify-center"
            >
              View candidates
            </Button>
            <Button
              variant="secondary"
              onClick={() => setActiveModal("scheduleInterview")}
              className="rounded-xl px-5 py-2.5 text-xs font-semibold justify-center"
            >
              Schedule interview
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SUPPORTING INFORMATION (COMPACT SECONDARY METRICS)          */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#56627A]">
              Open positions
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1020]">
            {recruiterSummary.openPositions}
          </p>
          <p className="mt-0.5 text-[11px] text-[#56627A]">
            Active recruitment drives
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#56627A]">
              Candidates
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1020]">
            {recruiterSummary.totalCandidates}
          </p>
          <p className="mt-0.5 text-[11px] text-[#56627A]">
            Registered Somaiya applicants
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#56627A]">
              Interviews
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
          </div>
          <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1020]">
            {recruiterSummary.upcomingInterviews}
          </p>
          <p className="mt-0.5 text-[11px] text-[#56627A]">
            Scheduled rounds this week
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. CANDIDATE PIPELINE (CLEAN HORIZONTAL PROGRESSION)           */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
          <div>
            <h3 className="font-display text-sm font-bold text-[#0B1020]">
              Candidate pipeline
            </h3>
            <p className="text-xs text-[#56627A]">
              Distribution of applicants across recruitment progression stages
            </p>
          </div>

          {selectedStage !== "All" && (
            <button
              onClick={() => setSelectedStage("All")}
              className="text-xs font-semibold text-[#5146E5] hover:underline"
            >
              Reset filter
            </button>
          )}
        </div>

        {/* Pipeline Stage Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {pipelineStages.map((stage) => {
            const isSelected = selectedStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() =>
                  setSelectedStage((prev) => (prev === stage.id ? "All" : stage.id))
                }
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-[#5146E5] bg-[#EEF0FF]/50 shadow-2xs ring-1 ring-[#5146E5]"
                    : "border-[#E4E7EF] bg-[#F7F8FC]/50 hover:bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-[11px] font-semibold text-[#56627A]">
                  {stage.label}
                </span>
                <span className="mt-1 font-display text-xl font-bold text-[#0B1020]">
                  {stage.count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. MAIN WORKSPACE: RECENT CANDIDATES & UPCOMING INTERVIEWS     */}
      {/* ============================================================== */}
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] items-start">
        {/* Left Column: Recent Candidates & Active Drives */}
        <div className="space-y-10">
          {/* Recent Candidates List */}
          <section
            ref={candidatesRef}
            className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-[#0B1020]">
                  Recent candidates
                </h3>
                <p className="text-xs text-[#56627A]">
                  Showing {filteredCandidates.length} of {recentCandidates.length} applicants
                  {selectedStage !== "All" && ` in ${selectedStage}`}
                </p>
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                Somaiya TPO Pool
              </span>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#56627A]">
                No candidates in this pipeline stage.
              </div>
            ) : (
              <div className="divide-y divide-[#E4E7EF]">
                {filteredCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-2 -mx-2 rounded-xl transition-colors hover:bg-[#F7F8FC]"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-display text-sm font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                          {candidate.name}
                        </p>
                        <span className="text-[11px] font-mono text-[#56627A]">
                          CGPA {candidate.cgpa}
                        </span>
                      </div>
                      <p className="text-xs text-[#56627A]">
                        {candidate.role} · Applied {candidate.appliedDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                      <Badge
                        tone={
                          candidate.stage === "Offer"
                            ? "emerald"
                            : candidate.stage === "Interview"
                              ? "indigo"
                              : candidate.stage === "Shortlisted"
                                ? "amber"
                                : "slate"
                        }
                      >
                        {candidate.stage}
                      </Badge>

                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="text-xs font-semibold text-[#5146E5] hover:underline"
                      >
                        View candidate →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Active Recruitment Drives */}
          <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-[#0B1020]">
                  Active jobs
                </h3>
                <p className="text-xs text-[#56627A]">
                  Current on-campus recruitment positions
                </p>
              </div>

              <button
                onClick={() => setActiveModal("createJob")}
                className="text-xs font-semibold text-[#5146E5] hover:underline"
              >
                + Create job
              </button>
            </div>

            <div className="divide-y divide-[#E4E7EF]">
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-2 -mx-2 rounded-xl transition-colors hover:bg-[#F7F8FC]"
                >
                  <div className="space-y-0.5">
                    <p className="font-display text-sm font-bold text-[#0B1020]">
                      {job.role}
                    </p>
                    <p className="text-xs text-[#56627A]">
                      {job.department} · Deadline: {job.deadline}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="text-xs font-medium text-[#0B1020]">
                      {job.applicantsCount} applicants
                    </span>
                    <Badge
                      tone={job.status === "Closing soon" ? "amber" : "emerald"}
                    >
                      {job.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Upcoming Interviews & Quick Actions */}
        <div className="space-y-8">
          {/* Upcoming Interviews */}
          <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
              <div>
                <h3 className="font-display text-sm font-bold text-[#0B1020]">
                  Upcoming interviews
                </h3>
                <p className="text-xs text-[#56627A]">
                  Scheduled assessment rounds
                </p>
              </div>
              <span className="text-xs text-[#56627A]">
                {upcomingInterviews.length} rounds
              </span>
            </div>

            <div className="divide-y divide-[#E4E7EF]">
              {upcomingInterviews.map((item) => (
                <div key={item.id} className="py-3.5 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-bold text-[#0B1020]">
                      {item.candidateName}
                    </span>
                    <span className="font-semibold text-[#5146E5]">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-xs text-[#56627A]">
                    {item.role} · {item.round}
                  </p>
                  <p className="text-[11px] text-[#56627A] pt-0.5">
                    {item.time} · {item.mode}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-3">
            <div className="border-b border-[#E4E7EF] pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                Workspace Actions
              </span>
              <h3 className="font-display text-sm font-bold text-[#0B1020] mt-0.5">
                Quick actions
              </h3>
            </div>

            <div className="space-y-2 pt-1">
              <Button
                variant="primary"
                onClick={() => setActiveModal("createJob")}
                className="w-full text-xs justify-center py-2.5 rounded-xl"
              >
                Create job
              </Button>
              <Button
                variant="secondary"
                onClick={scrollToCandidates}
                className="w-full text-xs justify-center py-2.5 rounded-xl"
              >
                View candidates
              </Button>
              <Button
                variant="secondary"
                onClick={() => setActiveModal("scheduleInterview")}
                className="w-full text-xs justify-center py-2.5 rounded-xl"
              >
                Schedule interview
              </Button>
            </div>
          </section>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 6. CANDIDATE PROFILE SLIDE-OVER DRAWER                         */}
      {/* ============================================================== */}
      {selectedCandidate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="candidate-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-[#0B1020]/40 backdrop-blur-xs transition-opacity duration-200"
        >
          {/* Backdrop button */}
          <button
            onClick={() => setSelectedCandidate(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close candidate details"
          />

          <div className="relative z-10 w-full max-w-lg h-full bg-white border-l border-[#E4E7EF] shadow-2xl flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="border-b border-[#E4E7EF] p-6 bg-white space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#5146E5]">
                      {selectedCandidate.applicationId}
                    </span>
                    <span className="text-xs text-[#56627A]">·</span>
                    <Badge
                      tone={
                        selectedCandidate.stage === "Offer"
                          ? "emerald"
                          : selectedCandidate.stage === "Interview"
                            ? "indigo"
                            : selectedCandidate.stage === "Shortlisted"
                              ? "amber"
                              : "slate"
                      }
                    >
                      {selectedCandidate.stage}
                    </Badge>
                  </div>
                  <h3
                    id="candidate-drawer-title"
                    className="mt-1 font-display text-2xl font-bold text-[#0B1020]"
                  >
                    {selectedCandidate.name}
                  </h3>
                  <p className="text-xs text-[#56627A]">
                    {selectedCandidate.role} · Applied {selectedCandidate.appliedDate}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B1020] transition-colors"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#56627A] bg-[#FAFAFC]">
              {/* Institutional Academic Credentials */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Academic Verification
                </span>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#56627A]">
                      College
                    </span>
                    <p className="font-semibold text-[#0B1020] text-xs mt-0.5">
                      {selectedCandidate.college}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#56627A]">
                      CGPA Standing
                    </span>
                    <p className="font-bold text-[#0B1020] text-xs mt-0.5">
                      {selectedCandidate.cgpa} / 10.00
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Verified Skills
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCandidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] px-2.5 py-1 text-xs font-semibold text-[#0B1020]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recruiter Evaluation Note */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Evaluation Notes
                </span>
                <p className="text-xs text-[#0B1020] leading-relaxed">
                  {selectedCandidate.note}
                </p>
              </div>

              {/* Attached Resume */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Attached Resume
                  </span>
                  <p className="font-semibold text-[#0B1020] text-xs mt-0.5">
                    {selectedCandidate.resumeVersion}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => showToast(`Opening ${selectedCandidate.resumeVersion} (preview).`)}
                  className="text-xs py-1.5 px-3"
                >
                  View PDF
                </Button>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-[#E4E7EF] p-4 bg-white flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setSelectedCandidate(null);
                  showToast(`Candidate ${selectedCandidate.name} marked as reviewed.`);
                }}
                className="text-xs py-2 px-3.5"
              >
                Mark as Reviewed
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedCandidate(null);
                  showToast(`Advanced ${selectedCandidate.name} to the next interview round.`);
                }}
                className="text-xs py-2 px-3.5"
              >
                Advance Candidate
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 7. QUICK ACTION MODALS (FRONTEND PREVIEW ONLY)                 */}
      {/* ============================================================== */}
      {activeModal === "createJob" && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/50 backdrop-blur-xs"
        >
          <button
            onClick={() => setActiveModal(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close modal"
          />
          <form
            onSubmit={handleCreateJobSubmit}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#E4E7EF] shadow-2xl p-6 space-y-4"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                Campus Recruitment Drive
              </span>
              <h3 className="mt-1 font-display text-xl font-bold text-[#0B1020]">
                Create new position
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Infrastructure Intern"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Department
                </label>
                <select
                  value={newJobDept}
                  onChange={(e) => setNewJobDept(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                >
                  <option value="Engineering">Core Engineering</option>
                  <option value="Product">Product & Design</option>
                  <option value="Data">Data & Machine Learning</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-xs py-2 px-3.5"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="text-xs py-2 px-4"
              >
                Create Position
              </Button>
            </div>
          </form>
        </div>
      )}

      {activeModal === "scheduleInterview" && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/50 backdrop-blur-xs"
        >
          <button
            onClick={() => setActiveModal(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close modal"
          />
          <form
            onSubmit={handleScheduleSubmit}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#E4E7EF] shadow-2xl p-6 space-y-4"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                Candidate Assessment
              </span>
              <h3 className="mt-1 font-display text-xl font-bold text-[#0B1020]">
                Schedule interview round
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Candidate
                </label>
                <select
                  value={interviewCandidate}
                  onChange={(e) => setInterviewCandidate(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                >
                  {recentCandidates.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Round
                </label>
                <select
                  value={interviewRound}
                  onChange={(e) => setInterviewRound(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                >
                  <option value="Technical Round 1">Technical Round 1 (Algorithms & Architecture)</option>
                  <option value="Technical Round 2">Technical Round 2 (System Design)</option>
                  <option value="HR & Fitment">HR & Fitment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setActiveModal(null)}
                className="text-xs py-2 px-3.5"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="text-xs py-2 px-4"
              >
                Confirm Schedule
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
