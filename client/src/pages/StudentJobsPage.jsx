import { useState, useMemo, useCallback } from "react";
import { initialJobs, jobsSummary } from "../data/jobsData.js";

export function StudentJobsPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState("");
  const [workModeFilter, setWorkModeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [eligibilityFilter, setEligibilityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");

  const [selectedJob, setSelectedJob] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const query = search.trim().toLowerCase();
        if (query) {
          const matchCompany = job.company.toLowerCase().includes(query);
          const matchRole = job.role.toLowerCase().includes(query);
          const matchSkills = job.requiredSkills.some((s) => s.toLowerCase().includes(query));
          const matchLocation = job.location.toLowerCase().includes(query);
          if (!matchCompany && !matchRole && !matchSkills && !matchLocation) return false;
        }
        if (workModeFilter !== "All" && job.workMode !== workModeFilter) return false;
        if (categoryFilter !== "All" && job.roleCategory !== categoryFilter) return false;
        if (eligibilityFilter !== "All") {
          if (eligibilityFilter === "Eligible" && job.eligibility !== "Eligible") return false;
          if (eligibilityFilter === "Needs Review" && job.eligibility !== "Needs Review") return false;
          if (eligibilityFilter === "Not Eligible" && job.eligibility !== "Not Eligible") return false;
        }
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
        if (sortBy === "deadline") return a.daysLeft - b.daysLeft;
        if (sortBy === "profileMatch") return b.profileMatch - a.profileMatch;
        if (sortBy === "newest") return b.daysLeft - a.daysLeft;
        return 0;
      });
  }, [jobs, search, workModeFilter, categoryFilter, eligibilityFilter, statusFilter, sortBy]);

  const handleApply = (jobId) => {
    setJobs((prev) => prev.map((job) => (job.id === jobId ? { ...job, applied: true } : job)));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob((prev) => ({ ...prev, applied: true }));
    }
    showToast("Application submitted with Active Resume v2.4");
  };



  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded border border-[#16886A]/30 bg-[#0B1020] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16886A] text-white text-[10px]">✓</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <header className="border-b border-[#E4E7EF] pb-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1020]">Jobs & Opportunities</h1>
            <p className="text-sm text-[#56627A] mt-2">
              Explore verified campus recruitment drives, eligibility criteria, and deadlines.
            </p>
          </div>
          <div className="text-xs text-[#56627A]">
            <span className="font-bold text-[#0B1020]">{jobsSummary.totalOpportunities}</span> Active Drives
          </div>
        </div>
      </header>

      {/* 2. SEARCH & FILTERS (MINIMAL) */}
      <section className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles, companies, or skills..."
            className="w-full sm:max-w-md border-b border-[#E4E7EF] py-2 text-sm text-[#0B1020] placeholder:text-slate-400 focus:border-[#0B1020] focus:outline-none transition-colors bg-transparent"
          />
          <div className="flex items-center gap-4 text-xs font-medium text-[#56627A] overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
             <select
              value={workModeFilter}
              onChange={(e) => setWorkModeFilter(e.target.value)}
              className="bg-transparent text-[#0B1020] focus:outline-none cursor-pointer"
            >
              <option value="All">All Modes</option>
              <option value="On Campus">On Campus</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Remote">Remote</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent text-[#0B1020] focus:outline-none cursor-pointer"
            >
              <option value="All">All Domains</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Full-Stack">Full-Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
            </select>
            <select
              value={eligibilityFilter}
              onChange={(e) => setEligibilityFilter(e.target.value)}
              className="bg-transparent text-[#0B1020] focus:outline-none cursor-pointer"
            >
              <option value="All">All Eligibility</option>
              <option value="Eligible">Eligible Only</option>
              <option value="Needs Review">Needs Review</option>
              <option value="Not Eligible">Not Eligible</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-[#0B1020] focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Not Applied">Not Applied</option>
              <option value="Applied">Already Applied</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-[#0B1020] font-bold focus:outline-none cursor-pointer ml-auto"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="deadline">Sort: Deadline</option>
              <option value="profileMatch">Sort: Alignment</option>
              <option value="newest">Sort: Newest</option>
            </select>
          </div>
        </div>
        {hasActiveFilters && (
          <button onClick={handleResetFilters} className="text-xs text-[#5146E5] hover:underline">
            Reset Filters
          </button>
        )}
      </section>

      {/* 3. LIST OF JOBS */}
      <section className="mt-8">
        <div className="text-xs text-[#56627A] mb-4">
          Showing {filteredJobs.length} opportunities
        </div>

        {filteredJobs.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-bold text-[#0B1020]">No opportunities match your filters</p>
            <button onClick={handleResetFilters} className="text-xs text-[#5146E5] mt-2 underline underline-offset-4">Reset All</button>
          </div>
        ) : (
          <div className="border-t border-[#E4E7EF]">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className="group cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-6 py-6 border-b border-[#E4E7EF] hover:bg-[#FAFAFC] transition-colors -mx-4 px-4 rounded"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                      {job.role}
                    </h3>
                    {job.isRecommended && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#5146E5] bg-[#EEF0FF] px-2 py-0.5 rounded">
                        Top Pick
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#0B1020] font-medium">{job.company}</p>
                  <p className="text-xs text-[#56627A]">
                    {job.location} · {job.workMode} · {job.stipend}
                  </p>
                  <p className="text-xs text-[#56627A] pt-1">
                    {job.requiredSkills.join(", ")}
                  </p>
                </div>
                
                <div className="flex flex-col lg:items-end justify-between gap-3 text-xs shrink-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[#0B1020] font-bold">{job.profileMatch}% Match</span>
                    <span className={job.eligibility === 'Eligible' ? 'text-[#16886A]' : job.eligibility === 'Not Eligible' ? 'text-rose-700' : 'text-amber-700'}>
                      {job.eligibility}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={job.daysLeft <= 4 ? "text-amber-700 font-bold" : "text-[#56627A]"}>
                      Closes {job.deadline}
                    </span>
                    {job.applied ? (
                      <span className="text-[#16886A] font-bold">✓ Applied</span>
                    ) : (
                      <span className="font-bold text-[#0B1020] group-hover:text-[#5146E5]">View →</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. DETAILS SLIDE-OVER */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0B1020]/40 backdrop-blur-sm animate-fade-in">
          <button className="absolute inset-0 w-full h-full cursor-default" onClick={() => setSelectedJob(null)} />
          
          <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            <div className="p-8 border-b border-[#E4E7EF] flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#56627A]">{selectedJob.company}</p>
                <h2 className="text-2xl font-bold text-[#0B1020] mt-1">{selectedJob.role}</h2>
                <div className="flex gap-4 mt-4 text-xs font-medium text-[#0B1020]">
                  <span>{selectedJob.profileMatch}% Match</span>
                  <span className={selectedJob.eligibility === 'Eligible' ? 'text-[#16886A]' : 'text-rose-700'}>
                    {selectedJob.eligibility}
                  </span>
                  {selectedJob.applied && <span className="text-[#16886A]">✓ Applied</span>}
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-black text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 text-[13px] text-[#0B1020]">
              <div className="grid grid-cols-2 gap-6 pb-6 border-b border-[#E4E7EF]">
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">Location</p>
                   <p className="mt-1 font-medium">{selectedJob.location} ({selectedJob.workMode})</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">Stipend</p>
                   <p className="mt-1 font-medium">{selectedJob.stipend}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">Duration</p>
                   <p className="mt-1 font-medium">{selectedJob.duration}</p>
                 </div>
                 <div>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">Deadline</p>
                   <p className="mt-1 font-medium text-amber-700">{selectedJob.deadline}</p>
                 </div>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#56627A] mb-3">About the Role</h3>
                <p className="leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#56627A] mb-3">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1.5 leading-relaxed">
                  {selectedJob.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#56627A] mb-3">Skills</h3>
                <p><span className="font-bold">Required:</span> {selectedJob.requiredSkills.join(", ")}</p>
                <p className="mt-2 text-[#56627A]"><span className="font-bold">Preferred:</span> {selectedJob.preferredSkills.join(", ")}</p>
              </div>
              
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#56627A] mb-3">Eligibility</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="w-40 inline-block text-[#56627A]">Min CGPA:</span> {selectedJob.eligibilityCriteria.minCgpa}</p>
                  <p><span className="w-40 inline-block text-[#56627A]">Max Backlogs:</span> {selectedJob.eligibilityCriteria.maxBacklogs}</p>
                  <p><span className="w-40 inline-block text-[#56627A]">Batches:</span> {selectedJob.eligibilityCriteria.eligibleBatches.join(", ")}</p>
                  <p><span className="w-40 inline-block text-[#56627A]">Branches:</span> {selectedJob.eligibilityCriteria.eligibleBranches.join(", ")}</p>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-[#E4E7EF] bg-white">
              {selectedJob.applied ? (
                <button disabled className="w-full py-3 bg-[#EEF0FF] text-[#5146E5] font-bold text-sm cursor-not-allowed text-center">
                  Application Submitted ✓
                </button>
              ) : selectedJob.eligibility === "Not Eligible" ? (
                <button disabled className="w-full py-3 bg-slate-100 text-rose-700 font-bold text-sm cursor-not-allowed text-center">
                  Not Eligible
                </button>
              ) : (
                <button
                  onClick={() => handleApply(selectedJob.id)}
                  className="w-full py-3 bg-[#0B1020] hover:bg-[#1C2438] transition-colors text-white font-bold text-sm text-center"
                >
                  Submit Application →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
