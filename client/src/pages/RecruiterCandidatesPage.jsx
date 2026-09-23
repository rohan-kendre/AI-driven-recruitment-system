import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Toast } from "../components/ui.jsx";
import { initialCandidates } from "../data/recruiterCandidatesData.js";

const STAGES = ["All", "Applied", "Screening", "Shortlisted", "Interview", "Offer"];

export function RecruiterCandidatesPage() {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedJobId, setSelectedJobId] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // Pipeline stage counts
  const stageCounts = useMemo(() => {
    const counts = { All: candidates.length };
    STAGES.slice(1).forEach((stage) => {
      counts[stage] = candidates.filter((c) => c.stage === stage).length;
    });
    return counts;
  }, [candidates]);

  // Filtered candidate list
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Stage match
      if (selectedStage !== "All" && c.stage !== selectedStage) {
        return false;
      }
      // Job match
      if (selectedJobId !== "All" && c.jobId !== selectedJobId) {
        return false;
      }
      // Search query match
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesRole = c.role.toLowerCase().includes(query);
        const matchesAppId = c.applicationId.toLowerCase().includes(query);
        const matchesSkill = c.skills.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesRole && !matchesAppId && !matchesSkill) {
          return false;
        }
      }
      return true;
    });
  }, [candidates, selectedStage, selectedJobId, searchQuery]);

  // Handle stage progression (local frontend state only)
  const handleAdvanceStage = (candidateId, nextStage, actionLabel) => {
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.id === candidateId) {
          const updatedTimeline = [
            ...c.timeline,
            {
              stage: nextStage,
              date: "Today",
              note: `Recruiter action: ${actionLabel}`,
            },
          ];
          return {
            ...c,
            stage: nextStage,
            timeline: updatedTimeline,
          };
        }
        return c;
      }),
    );

    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => ({
        ...prev,
        stage: nextStage,
        timeline: [
          ...prev.timeline,
          {
            stage: nextStage,
            date: "Today",
            note: `Recruiter action: ${actionLabel}`,
          },
        ],
      }));
    }

    showToast(`Candidate moved to ${nextStage}.`);
  };

  const handleDeclineCandidate = (candidateId) => {
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, stage: "Declined" } : c,
      ),
    );
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate((prev) => ({ ...prev, stage: "Declined" }));
    }
    showToast("Candidate marked as declined for this recruitment drive.");
  };

  // Close drawer on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedCandidate(null);
      }
    }
    if (selectedCandidate) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedCandidate]);

  const resetFilters = () => {
    setSelectedStage("All");
    setSelectedJobId("All");
    setSearchQuery("");
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Toast Feedback */}
      <Toast message={feedbackToast} onClose={() => setFeedbackToast(null)} tone="indigo" />

      {/* ============================================================== */}
      {/* 1. HEADER & PIPELINE CONTEXT                                   */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Recruiter workspace
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Candidates
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Review applicants and move through the hiring pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
            Somaiya TPO Pool
          </span>
          <span className="text-xs text-[#56627A]">
            {candidates.length} Registered
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. CLEAN CANDIDATE PIPELINE (SMALL & SECONDARY COUNTS)         */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-4 sm:p-5 shadow-subtle space-y-3">
        <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Hiring Pipeline
          </span>
          <span className="text-xs text-[#56627A]">
            Select stage to filter applicants
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {STAGES.map((stage) => {
            const isActive = selectedStage === stage;
            return (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`flex flex-col p-2.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? "border-[#5146E5] bg-[#EEF0FF]/50 ring-1 ring-[#5146E5] shadow-2xs"
                    : "border-[#E4E7EF] bg-[#F7F8FC]/50 hover:bg-white hover:border-slate-300"
                }`}
              >
                <span className="text-[11px] font-semibold text-[#56627A]">
                  {stage}
                </span>
                <span className="mt-1 font-display text-lg font-bold text-[#0B1020]">
                  {stageCounts[stage] || 0}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SEARCH & REFINED POSITION FILTER CONTROLS                   */}
      {/* ============================================================== */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9DA8BC]">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name, role, skill..."
            className="w-full rounded-xl border border-[#E4E7EF] bg-white py-2 pl-9 pr-3 text-xs text-[#0B1020] placeholder:text-[#9DA8BC] focus:border-[#5146E5] focus:outline-none transition-colors"
          />
        </div>

        {/* Position Filter Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="rounded-xl border border-[#E4E7EF] bg-white py-2 px-3 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
          >
            <option value="All">All Positions</option>
            <option value="JOB-1">Software Engineer Intern</option>
            <option value="JOB-2">Frontend Developer</option>
            <option value="JOB-3">Backend Systems Engineer</option>
          </select>

          {(searchQuery || selectedStage !== "All" || selectedJobId !== "All") && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-[#5146E5] hover:underline px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. REFINED CANDIDATE LIST (NO GIANT SPREADSHEET TABLE)         */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-7 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
          <span className="text-xs font-semibold text-[#56627A]">
            Showing {filteredCandidates.length} of {candidates.length} applicants
          </span>
          <span className="text-[11px] text-[#56627A]">
            Click any row to inspect candidate details
          </span>
        </div>

        {filteredCandidates.length === 0 ? (
          /* Simple Empty State */
          <div className="py-12 text-center space-y-3">
            <h3 className="font-display text-base font-bold text-[#0B1020]">
              No candidates found
            </h3>
            <p className="text-xs text-[#56627A] max-w-sm mx-auto leading-relaxed">
              Try adjusting your search keyword or selected pipeline filters.
            </p>
            <Button
              variant="secondary"
              onClick={resetFilters}
              className="text-xs py-1.5 px-3 mt-2"
            >
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-[#E4E7EF]">
            {filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedCandidate(candidate);
                  }
                }}
                className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 px-2 -mx-2 rounded-xl transition-colors hover:bg-[#F7F8FC] cursor-pointer"
              >
                {/* Left: Name, Role, CGPA & Skills */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display text-base font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors truncate">
                      {candidate.name}
                    </h3>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-bold text-[#0B1020]">
                      CGPA {candidate.cgpa}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16886A]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                      Eligible
                    </span>
                  </div>

                  <p className="text-xs text-[#56627A]">
                    {candidate.role} · Applied {candidate.appliedDate}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#56627A]">
                    {candidate.skills.slice(0, 4).map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded border border-[#E4E7EF] bg-[#F7F8FC] px-1.5 py-0.5"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Stage Badge & Action */}
                <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-2 lg:pt-0 border-t border-[#E4E7EF] lg:border-t-0">
                  <Badge
                    tone={
                      candidate.stage === "Offer"
                        ? "emerald"
                        : candidate.stage === "Interview"
                          ? "indigo"
                          : candidate.stage === "Shortlisted"
                            ? "amber"
                            : candidate.stage === "Screening"
                              ? "slate"
                              : candidate.stage === "Declined"
                                ? "rose"
                                : "slate"
                    }
                  >
                    {candidate.stage}
                  </Badge>

                  <span className="text-xs font-semibold text-[#5146E5] group-hover:translate-x-0.5 transition-transform">
                    View candidate →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 5. SLIDE-OVER CANDIDATE DETAIL DRAWER                          */}
      {/* ============================================================== */}
      {selectedCandidate && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="candidate-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-[#0B1020]/40 backdrop-blur-xs transition-opacity duration-200"
        >
          <button
            onClick={() => setSelectedCandidate(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close candidate details"
          />

          <div className="relative z-10 w-full max-w-xl h-full bg-white border-l border-[#E4E7EF] shadow-2xl flex flex-col overflow-hidden">
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
                              : selectedCandidate.stage === "Screening"
                                ? "slate"
                                : selectedCandidate.stage === "Declined"
                                  ? "rose"
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
              {/* Profile Alignment Strip (Restrained, NOT AI score) */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                    Profile Alignment
                  </span>
                  <p className="text-xs text-[#0B1020] mt-0.5">
                    Skills & requirements match for {selectedCandidate.role}
                  </p>
                </div>
                <span className="font-display text-2xl font-extrabold text-[#5146E5]">
                  {selectedCandidate.profileAlignment}%
                </span>
              </div>

              {/* Eligibility Section */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                    Eligibility
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16886A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                    {selectedCandidate.eligibility.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#56627A]">
                      CGPA Standing
                    </span>
                    <p className="font-bold text-[#0B1020] text-xs mt-0.5">
                      {selectedCandidate.cgpa} / 10.00
                    </p>
                    <p className="text-[10px] text-[#56627A]">7.50 required</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-[#56627A]">
                      Branch & Backlogs
                    </span>
                    <p className="font-semibold text-[#0B1020] text-xs mt-0.5">
                      {selectedCandidate.branch}
                    </p>
                    <p className="text-[10px] text-[#16886A]">0 active backlogs</p>
                  </div>
                </div>
              </div>

              {/* Verified Technical Skills */}
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

              {/* Resume Card */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Resume Document
                  </span>
                  <p className="font-semibold text-[#0B1020] text-xs mt-0.5">
                    {selectedCandidate.resume}
                  </p>
                  <p className="text-[10px] text-[#56627A]">Verified student upload</p>
                </div>
                <Link
                  to="/student/resume"
                  target="_blank"
                  className="rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] px-3 py-1.5 text-xs font-semibold text-[#5146E5] hover:bg-white transition-colors"
                >
                  View resume
                </Link>
              </div>

              {/* Application Timeline */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Application Timeline
                </span>
                <div className="space-y-3 pt-1">
                  {selectedCandidate.timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative">
                      {idx < selectedCandidate.timeline.length - 1 && (
                        <div className="absolute left-[7px] top-[16px] bottom-[-12px] w-[2px] bg-[#E4E7EF]" />
                      )}
                      <div className="relative z-10 mt-1">
                        <div className="h-3.5 w-3.5 rounded-full bg-[#5146E5] flex items-center justify-center text-white text-[8px] font-bold">
                          ✓
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-semibold text-xs text-[#0B1020]">
                            {step.stage}
                          </p>
                          <span className="text-[10px] text-[#56627A] font-mono">
                            {step.date}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#56627A] mt-0.5">
                          {step.note}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions (Stage Progression) */}
            <div className="border-t border-[#E4E7EF] p-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleDeclineCandidate(selectedCandidate.id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold py-2 px-3 text-center sm:text-left"
              >
                Decline candidate
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedCandidate(null)}
                  className="text-xs py-2 px-3.5"
                >
                  Close
                </Button>

                {selectedCandidate.stage === "Applied" && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleAdvanceStage(selectedCandidate.id, "Screening", "Moved to Screening")
                    }
                    className="text-xs py-2 px-4"
                  >
                    Move to screening
                  </Button>
                )}

                {selectedCandidate.stage === "Screening" && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleAdvanceStage(selectedCandidate.id, "Shortlisted", "Shortlisted Candidate")
                    }
                    className="text-xs py-2 px-4"
                  >
                    Shortlist candidate
                  </Button>
                )}

                {selectedCandidate.stage === "Shortlisted" && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleAdvanceStage(selectedCandidate.id, "Interview", "Scheduled Technical Interview")
                    }
                    className="text-xs py-2 px-4"
                  >
                    Schedule interview
                  </Button>
                )}

                {selectedCandidate.stage === "Interview" && (
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleAdvanceStage(selectedCandidate.id, "Offer", "Extended Placement Offer")
                    }
                    className="text-xs py-2 px-4 bg-[#16886A] hover:bg-[#13765c]"
                  >
                    Move to offer
                  </Button>
                )}

                {selectedCandidate.stage === "Offer" && (
                  <Badge tone="emerald">Offer Extended</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
