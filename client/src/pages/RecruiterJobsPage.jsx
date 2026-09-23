import { useState, useMemo, useEffect } from "react";
import { Badge, Button } from "../components/ui.jsx";
import { initialRecruiterJobs } from "../data/recruiterJobsData.js";

export function RecruiterJobsPage() {
  const [jobs, setJobs] = useState(initialRecruiterJobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'create' | 'edit' | null
  const [editingJob, setEditingJob] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Form state for Create / Edit
  const [formData, setFormData] = useState({
    role: "",
    domain: "",
    location: "Mumbai",
    workMode: "Hybrid / On campus drive",
    stipend: "₹45,000 / month",
    ctc: "18.5 LPA CTC",
    deadline: "2026-09-15",
    requiredSkills: "React, Node.js, TypeScript",
    eligibility: "B.Tech Computer Engineering / IT, CGPA >= 7.50, 0 active backlogs",
    selectionRounds: "Online Technical Screening, Technical Round 1, HR & Fitment",
    status: "Open",
  });

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      role: "",
      domain: "Core Engineering",
      location: "Mumbai Tech Park",
      workMode: "Hybrid / On campus drive",
      stipend: "₹45,000 / month",
      ctc: "18.5 LPA CTC",
      deadline: "2026-09-15",
      requiredSkills: "React, Node.js, TypeScript, Algorithms",
      eligibility: "B.Tech Computer Engineering / IT, CGPA >= 7.50, 0 active backlogs",
      selectionRounds: "Technical Screening, Technical Interview, HR Fitment",
      status: "Open",
    });
    setModalMode("create");
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      role: job.role,
      domain: job.domain,
      location: job.location,
      workMode: job.workMode,
      stipend: job.stipend,
      ctc: job.ctc,
      deadline: job.deadline,
      requiredSkills: Array.isArray(job.requiredSkills)
        ? job.requiredSkills.join(", ")
        : job.requiredSkills,
      eligibility: job.eligibility,
      selectionRounds: Array.isArray(job.selectionRounds)
        ? job.selectionRounds.join(", ")
        : job.selectionRounds,
      status: job.status,
    });
    setModalMode("edit");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const skillsArray = formData.requiredSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const roundsArray = formData.selectionRounds
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);

    if (modalMode === "create") {
      const newJob = {
        id: `JOB-${Date.now().toString().slice(-4)}`,
        company: "Acme Technologies",
        role: formData.role,
        domain: formData.domain,
        location: formData.location,
        workMode: formData.workMode,
        stipend: formData.stipend,
        ctc: formData.ctc,
        deadline: formData.deadline,
        requiredSkills: skillsArray,
        eligibility: formData.eligibility,
        selectionRounds: roundsArray,
        status: formData.status,
        applicantsCount: 0,
        shortlistedCount: 0,
        interviewsCount: 0,
        offersCount: 0,
        description: `Campus recruitment intake for ${formData.role} within ${formData.domain}.`,
      };
      setJobs((prev) => [newJob, ...prev]);
      showToast(`Position created: "${newJob.role}". Campus drive is now open.`);
    } else if (modalMode === "edit" && editingJob) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === editingJob.id
            ? {
                ...j,
                role: formData.role,
                domain: formData.domain,
                location: formData.location,
                workMode: formData.workMode,
                stipend: formData.stipend,
                ctc: formData.ctc,
                deadline: formData.deadline,
                requiredSkills: skillsArray,
                eligibility: formData.eligibility,
                selectionRounds: roundsArray,
                status: formData.status,
              }
            : j,
        ),
      );
      if (selectedJob && selectedJob.id === editingJob.id) {
        setSelectedJob((prev) => ({
          ...prev,
          role: formData.role,
          domain: formData.domain,
          location: formData.location,
          workMode: formData.workMode,
          stipend: formData.stipend,
          ctc: formData.ctc,
          deadline: formData.deadline,
          requiredSkills: skillsArray,
          eligibility: formData.eligibility,
          selectionRounds: roundsArray,
          status: formData.status,
        }));
      }
      showToast(`Position updated: "${formData.role}".`);
    }

    setModalMode(null);
  };

  // Close modals/drawers on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedJob(null);
        setModalMode(null);
      }
    }
    if (selectedJob || modalMode) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedJob, modalMode]);

  // Aggregate summary
  const summary = useMemo(() => {
    const totalApps = jobs.reduce((acc, j) => acc + (j.applicantsCount || 0), 0);
    const totalShortlisted = jobs.reduce((acc, j) => acc + (j.shortlistedCount || 0), 0);
    return {
      activeDrives: jobs.length,
      totalApps,
      totalShortlisted,
    };
  }, [jobs]);

  return (
    <div className="space-y-10 pb-16">
      {/* ============================================================== */}
      {/* 1. HEADER & ACTION STRIP                                       */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Recruiter workspace / Jobs
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Jobs
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Active hiring drives, position quotas, and campus recruitment pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="primary"
            onClick={openCreateModal}
            className="text-xs py-2.5 px-4 rounded-xl shadow-subtle flex items-center gap-1.5"
          >
            <span>+</span> Create job
          </Button>
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
      {/* 2. REFINED SUMMARY METRICS STRIP                               */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-2xs">
          <span className="text-xs font-semibold text-[#56627A]">
            Active recruitment drives
          </span>
          <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1020]">
            {summary.activeDrives}
          </p>
          <p className="mt-0.5 text-[11px] text-[#56627A]">
            Somaiya campus drives
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-2xs">
          <span className="text-xs font-semibold text-[#56627A]">
            Total applicants
          </span>
          <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1020]">
            {summary.totalApps}
          </p>
          <p className="mt-0.5 text-[11px] text-[#56627A]">
            Across all open positions
          </p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-2xs">
          <span className="text-xs font-semibold text-[#56627A]">
            Shortlisted candidates
          </span>
          <p className="mt-2 font-display text-2xl font-extrabold text-[#5146E5]">
            {summary.totalShortlisted}
          </p>
          <p className="mt-0.5 text-[11px] text-[#56627A]">
            Cleared technical screening
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. JOBS LIST (REFINED ROWS, NO LARGE CARDS)                    */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-7 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
          <div>
            <h2 className="font-display text-sm font-bold text-[#0B1020]">
              Active hiring drives
            </h2>
            <p className="text-xs text-[#56627A]">
              Select a position to view selection details, criteria, and applicant pipeline
            </p>
          </div>
          <span className="text-xs text-[#56627A]">
            {jobs.length} open drives
          </span>
        </div>

        <div className="divide-y divide-[#E4E7EF]">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedJob(job);
                }
              }}
              className="group flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4 px-2 -mx-2 rounded-xl transition-colors hover:bg-[#F7F8FC] cursor-pointer"
            >
              {/* Left: Role and Metadata */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-base font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors truncate">
                    {job.role}
                  </h3>
                  <Badge
                    tone={job.status === "Closing soon" ? "amber" : "emerald"}
                  >
                    {job.status}
                  </Badge>
                </div>
                <p className="text-xs text-[#56627A]">
                  {job.company} · {job.domain}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#56627A] pt-0.5">
                  <span>📍 {job.location}</span>
                  <span className="text-slate-300">·</span>
                  <span>{job.workMode}</span>
                  <span className="text-slate-300">·</span>
                  <span>Deadline: {job.deadline}</span>
                </div>
              </div>

              {/* Right: Metrics & Action */}
              <div className="flex items-center justify-between lg:justify-end gap-6 shrink-0 pt-2 lg:pt-0 border-t border-[#E4E7EF] lg:border-t-0">
                <div className="flex items-center gap-4 text-xs">
                  <div>
                    <span className="font-display font-extrabold text-[#0B1020]">
                      {job.applicantsCount}
                    </span>
                    <span className="text-[11px] text-[#56627A] ml-1">
                      applicants
                    </span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <div>
                    <span className="font-display font-extrabold text-[#5146E5]">
                      {job.shortlistedCount}
                    </span>
                    <span className="text-[11px] text-[#56627A] ml-1">
                      shortlisted
                    </span>
                  </div>
                  {job.interviewsCount !== undefined && (
                    <>
                      <span className="text-slate-300">·</span>
                      <div>
                        <span className="font-display font-extrabold text-[#16886A]">
                          {job.interviewsCount}
                        </span>
                        <span className="text-[11px] text-[#56627A] ml-1">
                          interviews
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <span className="text-xs font-semibold text-[#5146E5] group-hover:translate-x-0.5 transition-transform">
                  View details →
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. REFINED JOB DETAILS DRAWER                                  */}
      {/* ============================================================== */}
      {selectedJob && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-drawer-title"
          className="fixed inset-0 z-50 flex justify-end bg-[#0B1020]/40 backdrop-blur-xs transition-opacity duration-200"
        >
          <button
            onClick={() => setSelectedJob(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close job details"
          />

          <div className="relative z-10 w-full max-w-xl h-full bg-white border-l border-[#E4E7EF] shadow-2xl flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="border-b border-[#E4E7EF] p-6 bg-white space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#5146E5]">
                      {selectedJob.id}
                    </span>
                    <span className="text-xs text-[#56627A]">·</span>
                    <Badge
                      tone={
                        selectedJob.status === "Closing soon" ? "amber" : "emerald"
                      }
                    >
                      {selectedJob.status}
                    </Badge>
                  </div>
                  <h3
                    id="job-drawer-title"
                    className="mt-1 font-display text-2xl font-bold text-[#0B1020]"
                  >
                    {selectedJob.role}
                  </h3>
                  <p className="text-xs text-[#56627A]">
                    {selectedJob.company} · {selectedJob.domain}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B1020] transition-colors"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#56627A] bg-[#FAFAFC]">
              {/* Compensation & Schedule Strip */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Stipend & CTC
                  </span>
                  <p className="font-bold text-[#0B1020] text-sm mt-0.5">
                    {selectedJob.stipend}
                  </p>
                  <p className="text-[11px] text-[#56627A]">
                    Conversion: {selectedJob.ctc}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Application Deadline
                  </span>
                  <p className="font-bold text-[#0B1020] text-sm mt-0.5">
                    {selectedJob.deadline}
                  </p>
                  <p className="text-[11px] text-[#56627A]">
                    Mode: {selectedJob.workMode}
                  </p>
                </div>
              </div>

              {/* Applicant Pipeline Metric */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Pipeline Distribution
                </span>
                <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                  <div className="rounded-lg bg-[#F7F8FC] p-2">
                    <p className="font-display font-extrabold text-base text-[#0B1020]">
                      {selectedJob.applicantsCount}
                    </p>
                    <span className="text-[10px] text-[#56627A]">Applicants</span>
                  </div>
                  <div className="rounded-lg bg-[#EEF0FF] p-2">
                    <p className="font-display font-extrabold text-base text-[#5146E5]">
                      {selectedJob.shortlistedCount}
                    </p>
                    <span className="text-[10px] text-[#5146E5]">Shortlisted</span>
                  </div>
                  <div className="rounded-lg bg-[#E8F6F1] p-2">
                    <p className="font-display font-extrabold text-base text-[#16886A]">
                      {selectedJob.interviewsCount || 0}
                    </p>
                    <span className="text-[10px] text-[#16886A]">Interviews</span>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Required Skills
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedJob.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] px-2.5 py-1 text-xs font-semibold text-[#0B1020]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Eligibility Criteria
                </span>
                <p className="text-xs text-[#0B1020] leading-relaxed">
                  {selectedJob.eligibility}
                </p>
              </div>

              {/* Selection Process Rounds */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Selection Process
                </span>
                <div className="space-y-2 pt-1">
                  {selectedJob.selectionRounds.map((round, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F7F8FC] border border-[#E4E7EF]"
                    >
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#5146E5] text-[10px] font-bold text-white shrink-0">
                        {idx + 1}
                      </span>
                      <p className="font-semibold text-xs text-[#0B1020]">
                        {round}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-[#E4E7EF] p-4 bg-white flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                onClick={() => setSelectedJob(null)}
                className="text-xs py-2 px-3.5"
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  const jobToEdit = selectedJob;
                  setSelectedJob(null);
                  openEditModal(jobToEdit);
                }}
                className="text-xs py-2 px-4"
              >
                Edit job
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. CREATE / EDIT JOB MODAL                                     */}
      {/* ============================================================== */}
      {modalMode && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/50 backdrop-blur-xs transition-opacity duration-200"
        >
          <button
            onClick={() => setModalMode(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close modal"
          />

          <form
            onSubmit={handleFormSubmit}
            className="relative z-10 w-full max-w-xl rounded-2xl bg-white border border-[#E4E7EF] shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                {modalMode === "create" ? "New Campus Recruitment Drive" : "Update Recruitment Drive"}
              </span>
              <h3 className="mt-1 font-display text-xl font-bold text-[#0B1020]">
                {modalMode === "create" ? "Create job position" : `Edit ${editingJob?.role}`}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distributed Systems Engineer"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Domain / Department
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Platform Engineering"
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, domain: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Work Mode
                </label>
                <select
                  value={formData.workMode}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, workMode: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                >
                  <option value="Hybrid / On campus drive">Hybrid / On campus drive</option>
                  <option value="On campus">On campus</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Application Deadline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30 Sep 2026"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, deadline: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Stipend (Monthly)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹45,000 / month"
                  value={formData.stipend}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, stipend: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Full-Time CTC
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18.5 LPA CTC"
                  value={formData.ctc}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, ctc: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. React, Node.js, System Design"
                  value={formData.requiredSkills}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requiredSkills: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B.Tech Computer Engineering / IT, CGPA >= 7.50"
                  value={formData.eligibility}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      eligibility: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Selection Rounds (comma separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Technical Screening, Technical Round 1, HR & Fitment"
                  value={formData.selectionRounds}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      selectionRounds: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0B1020] mb-1">
                  Drive Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                >
                  <option value="Open">Open</option>
                  <option value="Closing soon">Closing soon</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E4E7EF]">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setModalMode(null)}
                className="text-xs py-2 px-3.5"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="text-xs py-2 px-4"
              >
                {modalMode === "create" ? "Create Job" : "Update Job"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
