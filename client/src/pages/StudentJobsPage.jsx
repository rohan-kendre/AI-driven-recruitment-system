import { useState, useMemo, useCallback } from "react";
import { Badge, Button } from "../components/ui.jsx";
import { initialJobs, jobsSummary } from "../data/jobsData.js";

export function StudentJobsPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [eligibilityFilter, setEligibilityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  // Selected job for slide-over detail panel
  const [selectedJob, setSelectedJob] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check if any filters are active
  const hasActiveFilters =
    search.trim() !== "" ||
    workModeFilter !== "All" ||
    categoryFilter !== "All" ||
    eligibilityFilter !== "All" ||
    statusFilter !== "All";

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setWorkModeFilter("All");
    setCategoryFilter("All");
    setEligibilityFilter("All");
    setStatusFilter("All");
    setSortBy("recommended");
    showToast("Filters reset to default.");
  }, []);

  // Filter and Sort opportunities
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        // Keyword Search
        const query = search.trim().toLowerCase();
        if (query) {
          const matchCompany = job.company.toLowerCase().includes(query);
          const matchRole = job.role.toLowerCase().includes(query);
          const matchSkills = job.requiredSkills.some((s) =>
            s.toLowerCase().includes(query),
          );
          const matchLocation = job.location.toLowerCase().includes(query);
          if (!matchCompany && !matchRole && !matchSkills && !matchLocation) {
            return false;
          }
        }

        // Work Mode filter
        if (workModeFilter !== "All" && job.workMode !== workModeFilter) {
          return false;
        }

        // Category filter
        if (categoryFilter !== "All" && job.roleCategory !== categoryFilter) {
          return false;
        }

        // Eligibility filter
        if (eligibilityFilter !== "All") {
          if (eligibilityFilter === "Eligible" && job.eligibility !== "Eligible")
            return false;
          if (
            eligibilityFilter === "Needs Review" &&
            job.eligibility !== "Needs Review"
          )
            return false;
          if (
            eligibilityFilter === "Not Eligible" &&
            job.eligibility !== "Not Eligible"
          )
            return false;
        }

        // Application status filter
        if (statusFilter !== "All") {
          if (statusFilter === "Applied" && !job.applied) return false;
          if (statusFilter === "Not Applied" && job.applied) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "recommended") {
          if (a.isRecommended && !b.isRecommended) return -1;
          if (!a.isRecommended && b.isRecommended) return 1;
          return b.profileMatch - a.profileMatch;
        }
        if (sortBy === "deadline") {
          return a.daysLeft - b.daysLeft;
        }
        if (sortBy === "profileMatch") {
          return b.profileMatch - a.profileMatch;
        }
        if (sortBy === "newest") {
          return b.daysLeft - a.daysLeft;
        }
        return 0;
      });
  }, [
    jobs,
    search,
    workModeFilter,
    categoryFilter,
    eligibilityFilter,
    statusFilter,
    sortBy,
  ]);

  // Handle local application submission
  const handleApply = (jobId) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, applied: true } : job)),
    );
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => ({ ...prev, applied: true }));
    }
    showToast(
      "Application submitted with Active Resume v2.4 (Demo Mode: Stored locally)",
    );
  };

  // Find recommended job for hero banner
  const recommendedJob = useMemo(
    () => jobs.find((j) => j.isRecommended) || jobs[0],
    [jobs],
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#16886A]/30 bg-[#0B1020] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16886A] text-white text-[10px]">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. PAGE HEADER & CONTEXTUAL METRICS                           */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Student workspace
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Jobs & Opportunities
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Explore verified campus recruitment drives, eligibility criteria, and deadlines.
          </p>
        </div>

        {/* High-Level Drive Metric Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
            Somaiya TPO Verified
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#5146E5]">
            {jobsSummary.totalOpportunities} Active Drives
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. FEATURED / RECOMMENDED OPPORTUNITY BANNER                   */}
      {/* ============================================================== */}
      {recommendedJob && (
        <section className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-white to-[#EEF0FF]/40 p-6 sm:p-7 shadow-subtle">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EEF0FF] px-2.5 py-0.5 text-xs font-bold text-[#5146E5]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
                  Top Recommendation for You
                </span>
                <span className="rounded-full border border-emerald-100 bg-[#E8F6F1] px-2.5 py-0.5 text-xs font-semibold text-[#16886A]">
                  {recommendedJob.profileMatch}% Profile Alignment
                </span>
                <span className="text-xs text-[#56627A]">
                  {recommendedJob.driveType}
                </span>
              </div>

              <div>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1020]">
                  {recommendedJob.role} · {recommendedJob.company}
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-[#56627A] leading-relaxed max-w-3xl">
                  {recommendedJob.matchRationale}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#56627A] pt-1">
                <span>📍 {recommendedJob.location}</span>
                <span>💰 {recommendedJob.stipend}</span>
                <span className="font-semibold text-amber-700">
                  ⏳ Closes in {recommendedJob.daysLeft} days ({recommendedJob.deadline})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0">
              <Button
                variant="primary"
                onClick={() => setSelectedJob(recommendedJob)}
                className="text-xs font-semibold py-2.5 px-4 rounded-xl shadow-subtle"
              >
                View Opportunity & Eligibility →
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 3. SEARCH, FILTERS & SORTING CONTROLS                          */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
        {/* Top Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Keyword Search Input */}
          <div className="relative flex-1 max-w-lg">
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
              placeholder="Search roles, companies, or skills (e.g., React, Acme, Backend)..."
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

          {/* Sort Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#56627A]">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-[#E4E7EF] bg-white px-3 py-2 text-xs font-semibold text-[#0B1020] focus:border-[#5146E5] focus:outline-none shadow-2xs"
            >
              <option value="recommended">Recommended (Match & Priority)</option>
              <option value="deadline">Deadline (Urgent First)</option>
              <option value="profileMatch">Profile Alignment (%)</option>
              <option value="newest">Newest Drives</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="border-t border-[#E4E7EF]/80 pt-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#56627A] mr-1">
              Filters:
            </span>

            {/* Work Mode Filter */}
            <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] px-2.5 py-1.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
            >
              <option value="All">All Work Modes</option>
              <option value="On Campus">On Campus</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>

            {/* Domain Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] px-2.5 py-1.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
            >
              <option value="All">All Domains</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Data Science">Data Science</option>
            </select>

            {/* Eligibility Filter */}
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] px-2.5 py-1.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
            >
              <option value="All">All Eligibility</option>
              <option value="Eligible">Eligible Only</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Not Eligible">Not Eligible</option>
            </select>

            {/* Application Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] px-2.5 py-1.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Not Applied">Not Applied</option>
              <option value="Applied">Already Applied</option>
            </select>
          </div>

          {/* Reset Filters CTA */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-[#5146E5] hover:text-[#4338CA] transition-colors underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. REFINED OPPORTUNITY WORKSPACE LIST                         */}
      {/* ============================================================== */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-semibold text-[#56627A]">
            Showing <span className="font-bold text-[#0B1020]">{filteredJobs.length}</span> campus opportunities
          </p>
          <span className="text-[11px] text-[#56627A]">
            Eligibility derived from Aarav Kulkarni (CGPA 8.85 · Batch 2026)
          </span>
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 ? (
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
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <h3 className="font-display text-base font-bold text-[#0B1020]">
              No campus opportunities match your criteria
            </h3>
            <p className="text-xs text-[#56627A] max-w-md mx-auto leading-relaxed">
              We couldn't find any drives matching your selected search query or
              filters. Try adjusting your filters to see more listings.
            </p>
            <div className="pt-2">
              <Button
                variant="secondary"
                onClick={handleResetFilters}
                className="text-xs font-semibold py-2 px-4 rounded-xl border-[#E4E7EF]"
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        ) : (
          /* Structured Rows */
          <div className="space-y-3">
            {filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`group cursor-pointer rounded-2xl border bg-white p-5 sm:p-6 transition-all shadow-subtle ${
                    isSelected
                      ? "border-[#5146E5] ring-2 ring-[#EEF0FF]"
                      : "border-[#E4E7EF] hover:border-[#5146E5]/40 hover:bg-[#FAFAFC]"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Role, Company & Meta */}
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-base sm:text-lg font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                          {job.role}
                        </span>
                        <span className="text-xs text-[#56627A]">at</span>
                        <span className="font-semibold text-xs text-[#0B1020]">
                          {job.company}
                        </span>
                        <span className="rounded-md border border-[#E4E7EF] bg-[#F7F8FC] px-2 py-0.5 text-[10px] font-medium text-[#56627A]">
                          {job.driveType}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#56627A]">
                        <span>📍 {job.location}</span>
                        <span>💰 {job.stipend}</span>
                        <span>⏱ {job.duration}</span>
                      </div>

                      {/* Required Skills Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {job.requiredSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-[#E4E7EF] bg-[#F7F8FC] px-2 py-0.5 text-[11px] font-medium text-[#56627A]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Badges, Deadline & CTA */}
                    <div className="flex flex-wrap lg:flex-col items-start lg:items-end justify-between lg:justify-center gap-3 border-t lg:border-t-0 border-[#E4E7EF]/80 pt-3 lg:pt-0 shrink-0">
                      <div className="flex items-center gap-2">
                        {/* Profile Alignment Badge */}
                        <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-[#EEF0FF] px-2.5 py-0.5 text-xs font-semibold text-[#5146E5]">
                          {job.profileMatch}% Profile Alignment
                        </span>

                        {/* Eligibility Badge */}
                        <Badge
                          tone={
                            job.eligibility === "Eligible"
                              ? "emerald"
                              : job.eligibility === "Needs Review"
                                ? "amber"
                                : "slate"
                          }
                        >
                          {job.eligibility}
                        </Badge>
                      </div>

                      {/* Deadline & Status */}
                      <div className="flex items-center gap-3 text-xs">
                        <span
                          className={`font-semibold ${
                            job.daysLeft <= 4 ? "text-amber-700" : "text-[#56627A]"
                          }`}
                        >
                          ⏳ Closes {job.deadline} ({job.daysLeft}d left)
                        </span>

                        {job.applied ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-[#16886A]">
                            <span>✓</span> Applied
                          </span>
                        ) : (
                          <span className="font-semibold text-[#5146E5] group-hover:underline flex items-center gap-1">
                            <span>View opportunity</span>
                            <span>→</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 5. JOB DETAILS SLIDE-OVER PANEL / MODAL                        */}
      {/* ============================================================== */}
      {selectedJob && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-details-title"
          className="fixed inset-0 z-50 flex items-center justify-end bg-[#0B1020]/60 backdrop-blur-xs animate-fade-in"
        >
          {/* Backdrop button to close */}
          <button
            onClick={() => setSelectedJob(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close job details backdrop"
          />

          {/* Slide-over Content Container */}
          <div className="relative z-10 w-full max-w-xl h-full bg-white border-l border-[#E4E7EF] shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
            {/* Panel Header */}
            <div className="border-b border-[#E4E7EF] p-6 bg-white space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                      {selectedJob.company}
                    </span>
                    <span className="rounded-md border border-[#E4E7EF] bg-[#F7F8FC] px-2 py-0.5 text-[10px] font-medium text-[#56627A]">
                      {selectedJob.driveType}
                    </span>
                  </div>
                  <h3
                    id="job-details-title"
                    className="mt-1 font-display text-2xl font-bold text-[#0B1020]"
                  >
                    {selectedJob.role}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B1020]"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>

              {/* Status & Match Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-[#EEF0FF] px-2.5 py-0.5 text-xs font-semibold text-[#5146E5]">
                  {selectedJob.profileMatch}% Profile Alignment
                </span>
                <Badge
                  tone={
                    selectedJob.eligibility === "Eligible"
                      ? "emerald"
                      : selectedJob.eligibility === "Needs Review"
                        ? "amber"
                        : "slate"
                  }
                >
                  {selectedJob.eligibility}
                </Badge>
                {selectedJob.applied && (
                  <Badge tone="emerald">Application Submitted</Badge>
                )}
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-[#56627A] bg-[#FAFAFC]">
              {/* Quick Overview Grid */}
              <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-[#E4E7EF]">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Location & Work Mode
                  </span>
                  <p className="mt-0.5 font-bold text-[#0B1020]">
                    {selectedJob.location}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Internship Stipend
                  </span>
                  <p className="mt-0.5 font-bold text-[#16886A]">
                    {selectedJob.stipend}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Duration
                  </span>
                  <p className="mt-0.5 font-bold text-[#0B1020]">
                    {selectedJob.duration}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Application Deadline
                  </span>
                  <p className="mt-0.5 font-bold text-amber-700">
                    {selectedJob.deadline} ({selectedJob.daysLeft} days left)
                  </p>
                </div>
              </div>

              {/* Eligibility Compliance Section */}
              <div className="bg-white p-4 rounded-xl border border-[#E4E7EF] space-y-2">
                <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-2">
                  <span className="font-bold text-xs text-[#0B1020]">
                    Eligibility Compliance Criteria
                  </span>
                  <span className="text-[11px] font-semibold text-[#16886A]">
                    Somaiya TPO Policy
                  </span>
                </div>
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span>Minimum CGPA Required:</span>
                    <span className="font-bold text-[#0B1020]">
                      {selectedJob.eligibilityCriteria.minCgpa} (Candidate: 8.85)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maximum Backlogs:</span>
                    <span className="font-bold text-[#0B1020]">
                      {selectedJob.eligibilityCriteria.maxBacklogs} (Candidate: 0)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eligible Batches:</span>
                    <span className="font-bold text-[#0B1020]">
                      {selectedJob.eligibilityCriteria.eligibleBatches.join(", ")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Eligible Branches:</span>
                    <span className="font-bold text-[#0B1020] text-right">
                      {selectedJob.eligibilityCriteria.eligibleBranches.join(", ")}
                    </span>
                  </div>
                  {selectedJob.eligibilityCriteria.note && (
                    <p className="text-[11px] text-[#5146E5] bg-[#EEF0FF] p-2 rounded-lg mt-2">
                      {selectedJob.eligibilityCriteria.note}
                    </p>
                  )}
                </div>
              </div>

              {/* About the Role */}
              <div className="bg-white p-4 rounded-xl border border-[#E4E7EF] space-y-2">
                <span className="font-bold text-xs text-[#0B1020]">
                  About the Role
                </span>
                <p className="leading-relaxed text-[#0B1020]">
                  {selectedJob.description}
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className="bg-white p-4 rounded-xl border border-[#E4E7EF] space-y-2">
                <span className="font-bold text-xs text-[#0B1020]">
                  Key Responsibilities
                </span>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed text-[#0B1020]">
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {/* Required & Preferred Skills */}
              <div className="bg-white p-4 rounded-xl border border-[#E4E7EF] space-y-3">
                <div>
                  <span className="font-bold text-xs text-[#0B1020] block mb-1.5">
                    Required Core Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-[#E4E7EF] bg-[#F7F8FC] px-2.5 py-1 text-xs font-semibold text-[#0B1020]"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-xs text-[#56627A] block mb-1.5">
                    Preferred Nice-to-Have Skills:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.preferredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-dashed border-[#D1D5E3] bg-white px-2 py-0.5 text-xs text-[#56627A]"
                      >
                        + {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Selection Process Rounds */}
              <div className="bg-white p-4 rounded-xl border border-[#E4E7EF] space-y-2">
                <span className="font-bold text-xs text-[#0B1020]">
                  Placement Selection Process
                </span>
                <div className="space-y-2 pt-1">
                  {selectedJob.selectionProcess.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEF0FF] text-[10px] font-bold text-[#5146E5]">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-[#0B1020]">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Sticky Footer / Application Action */}
            <div className="border-t border-[#E4E7EF] p-5 bg-white space-y-2">
              <div className="flex items-center justify-between text-[11px] text-[#56627A]">
                <span>Active Resume for Submission:</span>
                <span className="font-semibold text-[#0B1020]">
                  Aarav_Kulkarni_Resume_v2.4.pdf
                </span>
              </div>

              {selectedJob.applied ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-[#16886A] flex items-center gap-1.5">
                    <span>✓</span> Application active in recruiter pipeline
                  </span>
                  <Button
                    variant="secondary"
                    disabled
                    className="text-xs font-semibold py-2.5 px-4 rounded-xl opacity-70 cursor-not-allowed"
                  >
                    Application Submitted
                  </Button>
                </div>
              ) : selectedJob.eligibility === "Not Eligible" ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-rose-700">
                    Does not meet minimum CGPA requirement (9.00)
                  </span>
                  <Button
                    variant="secondary"
                    disabled
                    className="text-xs font-semibold py-2.5 px-4 rounded-xl opacity-60 cursor-not-allowed"
                  >
                    Not Eligible
                  </Button>
                </div>
              ) : (
                <Button
                  variant="primary"
                  onClick={() => handleApply(selectedJob.id)}
                  className="w-full text-xs font-semibold py-3 px-5 rounded-xl shadow-subtle"
                >
                  Submit Campus Application →
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
