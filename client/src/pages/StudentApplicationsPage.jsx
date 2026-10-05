import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  applicationsSummary,
  initialApplications,
} from "../data/applicationsData.js";

export function StudentApplicationsPage() {
  const [applications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  const [selectedApp, setSelectedApp] = useState(null);

  const hasActiveFilters = search.trim() !== "" || stageFilter !== "All";

  const handleResetFilters = useCallback(() => {
    setSearch("");
    setStageFilter("All");
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const query = search.trim().toLowerCase();
      if (query) {
        const matchCompany = app.company.toLowerCase().includes(query);
        const matchRole = app.role.toLowerCase().includes(query);
        const matchId = app.id.toLowerCase().includes(query);
        if (!matchCompany && !matchRole && !matchId) return false;
      }
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
    <div className="max-w-5xl mx-auto pb-20">
      {/* 1. PAGE HEADER */}
      <header className="border-b border-[#E4E7EF] pb-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1020]">Applications</h1>
            <p className="text-sm text-[#56627A] mt-2">
              Track your placement applications, current stages, interviews, and next steps.
            </p>
          </div>
          <div className="text-xs text-[#56627A]">
            <span className="font-bold text-[#0B1020]">{applicationsSummary.total}</span> Active
          </div>
        </div>
      </header>

      {/* 2. PIPELINE PROGRESSION & FILTERS */}
      <section className="mt-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[#E4E7EF] pb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search role, company, or ID..."
            className="w-full sm:max-w-xs border-none py-2 text-sm text-[#0B1020] placeholder:text-slate-400 focus:outline-none bg-transparent"
          />
          <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar text-xs font-bold text-[#56627A]">
            {["All", "Active", "Screening", "Interview", "Offer", "Closed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStageFilter(tab)}
                className={`pb-4 border-b-2 transition-colors whitespace-nowrap ${
                  stageFilter === tab ? "border-[#0B1020] text-[#0B1020]" : "border-transparent hover:text-[#0B1020]"
                }`}
                style={{ marginBottom: "-17px" }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex justify-end">
            <button onClick={handleResetFilters} className="text-xs text-[#5146E5] hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* 3. APPLICATIONS LIST */}
      <section className="mt-8">
        <div className="text-xs text-[#56627A] mb-4">
          Showing {filteredApplications.length} applications
        </div>

        {filteredApplications.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-bold text-[#0B1020]">No applications found</p>
            <div className="mt-4 space-x-4">
              <button onClick={handleResetFilters} className="text-xs text-[#5146E5] underline underline-offset-4">Reset</button>
              <Link to="/student/jobs" className="text-xs text-[#0B1020] font-bold underline underline-offset-4">Explore Jobs</Link>
            </div>
          </div>
        ) : (
          <div className="border-t border-[#E4E7EF]">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="group cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-b border-[#E4E7EF] hover:bg-[#FAFAFC] transition-colors -mx-4 px-4 rounded"
              >
                <div className="flex gap-4 items-start sm:items-center">
                  <div className="w-10 h-10 shrink-0 bg-[#F7F8FC] rounded flex items-center justify-center font-bold text-[#0B1020] text-sm group-hover:bg-[#0B1020] group-hover:text-white transition-colors">
                    {app.company[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors flex items-center gap-2">
                      {app.role}
                      <span className="text-[10px] font-medium text-slate-400 font-mono tracking-wide">{app.id}</span>
                    </h3>
                    <p className="text-sm text-[#0B1020] font-medium mt-0.5">{app.company}</p>
                    <p className="text-xs text-[#56627A] mt-1">
                      Applied {app.appliedOn} · {app.location} · {app.stipend}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 text-xs shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#56627A]">Stage:</span>
                    <span className={`font-bold ${app.stage === 'Offer' ? 'text-[#16886A]' : app.stage === 'Closed' ? 'text-slate-400' : 'text-[#5146E5]'}`}>
                      {app.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="font-bold text-[#0B1020]">Next:</span>
                    <span className="text-[#56627A]">{app.nextAction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. DETAILS SLIDE-OVER */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0B1020]/40 backdrop-blur-sm animate-fade-in">
          <button className="absolute inset-0 w-full h-full cursor-default" onClick={() => setSelectedApp(null)} />
          
          <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            <div className="p-8 border-b border-[#E4E7EF] flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#56627A]">
                  <span className="font-mono text-[#0B1020] mr-2">{selectedApp.id}</span>
                  {selectedApp.company}
                </p>
                <h2 className="text-2xl font-bold text-[#0B1020] mt-1">{selectedApp.role}</h2>
                <div className="flex gap-4 mt-4 text-xs font-medium text-[#0B1020]">
                  <span>Applied {selectedApp.appliedOn}</span>
                  <span className={`font-bold ${selectedApp.stage === 'Offer' ? 'text-[#16886A]' : 'text-[#5146E5]'}`}>
                    Stage: {selectedApp.stage}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-black text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 text-[13px] text-[#0B1020]">
              
              {/* Action Callout */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#5146E5] mb-2">Recommended Action</h3>
                <p className="font-bold text-sm">{selectedApp.nextAction}</p>
                <p className="mt-1 text-[#56627A]">
                  {selectedApp.stage === "Offer"
                    ? "Review the formal compensation and internship commitment terms before accepting via Somaiya Placement Office."
                    : selectedApp.stage === "Interview"
                      ? "Review core concepts. Ensure your audio and webcam link are tested 10 minutes prior."
                      : "Your application is advancing through routine placement cell verification. No immediate student action required."}
                </p>
              </div>

              {/* Offer Details */}
              {selectedApp.offer && (
                <div className="p-6 bg-[#F7F8FC] rounded-lg">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-[#16886A] mb-4">Official Campus Offer</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-[#56627A] text-xs">Compensation</span><p className="font-bold">{selectedApp.offer.compensation}</p></div>
                    <div><span className="text-[#56627A] text-xs">Duration</span><p className="font-bold">{selectedApp.offer.duration}</p></div>
                    <div><span className="text-[#56627A] text-xs">Location</span><p className="font-bold">{selectedApp.offer.location}</p></div>
                    <div><span className="text-[#56627A] text-xs">Deadline</span><p className="font-bold text-amber-700">{selectedApp.offer.deadline}</p></div>
                  </div>
                  <Link to="/student/offers" className="block mt-6 text-xs font-bold text-[#5146E5] hover:underline">Review full offer →</Link>
                </div>
              )}

              {/* Interview Details */}
              {selectedApp.interview && (
                <div className="p-6 bg-[#F7F8FC] rounded-lg">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-[#5146E5] mb-4">Upcoming Interview</h3>
                  <p className="font-bold">{selectedApp.interview.round}</p>
                  <p className="mt-2 text-[#56627A]">{selectedApp.interview.date} · {selectedApp.interview.time} · {selectedApp.interview.mode}</p>
                  {selectedApp.interview.panel && <p className="mt-2 text-[#56627A]"><span className="font-bold">Panel:</span> {selectedApp.interview.panel}</p>}
                </div>
              )}

              {/* Timeline */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#56627A] mb-6">Progress Timeline</h3>
                <div className="space-y-6 relative before:absolute before:left-[3px] before:top-1.5 before:bottom-1 before:w-[2px] before:bg-[#E4E7EF]">
                  {selectedApp.timeline.map((item, idx) => {
                    const isCompleted = item.state === "completed";
                    const isCurrent = item.state === "current";
                    return (
                      <div key={idx} className="relative pl-6">
                        <span className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${isCompleted ? 'bg-[#16886A]' : isCurrent ? 'bg-[#5146E5] ring-4 ring-[#EEF0FF]' : 'bg-[#E4E7EF]'}`} />
                        <div className="flex justify-between items-baseline gap-4">
                          <p className={`font-bold ${isCurrent ? "text-[#5146E5]" : "text-[#0B1020]"}`}>{item.step}</p>
                          <span className="text-xs text-[#56627A] whitespace-nowrap">{item.date}</span>
                        </div>
                        <p className="text-[#56627A] mt-1">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Credentials */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#56627A] mb-4">Credentials Submitted</h3>
                <div className="space-y-2 text-[#0B1020]">
                  <p className="flex justify-between border-b border-[#E4E7EF] pb-2"><span className="text-[#56627A]">Resume</span> <Link to="/student/resume" className="font-bold text-[#5146E5] hover:underline">{selectedApp.resumeVersion}</Link></p>
                  <p className="flex justify-between border-b border-[#E4E7EF] pb-2 pt-2"><span className="text-[#56627A]">CGPA</span> <span className="font-bold">{selectedApp.eligibilitySnapshot.cgpa}</span></p>
                  <p className="flex justify-between pt-2"><span className="text-[#56627A]">Backlogs</span> <span className="font-bold">{selectedApp.eligibilitySnapshot.backlogs}</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
