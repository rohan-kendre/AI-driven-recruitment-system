import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { interviewsApi } from "../services/interviewsApi.js";

const displayDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

export function StudentInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [filterTab, setFilterTab] = useState("Upcoming");
  const [selectedInterview, setSelectedInterview] = useState(null);

  const [checkedPrep, setCheckedPrep] = useState({
    "prep-resume": true,
    "prep-role": true,
    "prep-projects": false,
  });

  const loadInterviews = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const data = await interviewsApi.getInterviews();
      const mapped = data.map((item) => ({
        ...item,
        status: item.status === "COMPLETED" ? "Completed" : item.status === "CANCELLED" ? "Cancelled" : "Upcoming",
      }));
      setInterviews(mapped);
    } catch (error) {
      setLoadError(error.response?.data?.message || error.message || "Unable to load interviews. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadInterviews);
  }, [loadInterviews]);

  const togglePrep = useCallback((key) => {
    setCheckedPrep((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const nextInterview = useMemo(() => {
    return (
      interviews.find((item) => item.isNext && item.status === "Upcoming") ||
      interviews.find((item) => item.status === "Upcoming") ||
      null
    );
  }, [interviews]);

  const upcomingInterviews = useMemo(() => interviews.filter((item) => item.status === "Upcoming"), [interviews]);
  const completedInterviews = useMemo(() => interviews.filter((item) => item.status === "Completed"), [interviews]);
  const cancelledInterviews = useMemo(() => interviews.filter((item) => item.status === "Cancelled"), [interviews]);

  const displayedInterviews = useMemo(() => {
    if (filterTab === "Upcoming") return upcomingInterviews;
    if (filterTab === "Completed") return completedInterviews;
    if (filterTab === "Cancelled") return cancelledInterviews;
    return interviews;
  }, [filterTab, upcomingInterviews, completedInterviews, cancelledInterviews, interviews]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") setSelectedInterview(null);
    }
    if (selectedInterview) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedInterview]);

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* 1. HEADER */}
      <header className="border-b border-[#E4E7EF] pb-8 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0B1020]">Interviews</h1>
            <p className="text-sm text-[#56627A] mt-2">
              Your scheduled rounds and preparation.
            </p>
          </div>
          <div className="flex gap-6 text-xs font-bold text-[#56627A]">
             {["All", "Upcoming", "Completed", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`transition-colors ${
                  filterTab === tab ? "text-[#0B1020]" : "hover:text-[#0B1020]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. NEXT INTERVIEW (HERO) */}
      {nextInterview && (filterTab === "All" || filterTab === "Upcoming") && (
        <section className="mt-8 border-b border-[#E4E7EF] pb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#5146E5] mb-2">Next up</p>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight text-[#0B1020]">{nextInterview.company}</h2>
              <p className="text-lg font-medium text-[#56627A] mt-1">{nextInterview.role}</p>
              <div className="flex gap-3 text-sm mt-3 text-[#0B1020] font-medium">
                <span>{nextInterview.round}</span>
                <span className="text-[#E4E7EF]">|</span>
                <span>{displayDate(nextInterview.date)} · {nextInterview.time}</span>
                <span className="text-[#E4E7EF]">|</span>
                <span>{nextInterview.mode}</span>
              </div>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
              <button 
                onClick={() => setSelectedInterview(nextInterview)} 
                className="bg-[#0B1020] text-white px-6 py-3 text-sm font-bold w-full sm:w-auto text-center"
              >
                View details
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start mt-12">
        {/* 3. INTERVIEWS LIST */}
        <section>
          {isLoading ? (
            <div className="py-20 text-center text-sm text-[#56627A]">Loading interviews…</div>
          ) : loadError ? (
            <div className="py-20 text-center">
              <p className="text-sm font-bold text-[#0B1020]">Could not load interviews</p>
              <p className="mt-2 text-xs text-[#56627A]">{loadError}</p>
              <button onClick={loadInterviews} className="mt-4 text-xs font-bold text-[#5146E5] underline underline-offset-4">Retry</button>
            </div>
          ) : displayedInterviews.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-sm font-bold text-[#0B1020]">No {filterTab.toLowerCase()} interviews</p>
            </div>
          ) : (
            <div className="space-y-12">
              {(filterTab === "All" || filterTab === "Upcoming") && upcomingInterviews.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#0B1020] mb-6 border-b border-[#E4E7EF] pb-2">Upcoming</h3>
                  <div className="space-y-4">
                    {upcomingInterviews.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedInterview(item)}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-4 cursor-pointer"
                      >
                        <div className="flex items-center gap-6">
                          <div className="text-center w-12 shrink-0">
                            <span className="block text-sm font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">{displayDate(item.date)}</span>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-[#0B1020]">{item.company}</h4>
                            <p className="text-sm text-[#56627A] mt-0.5">{item.role} · {item.round}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold text-[#56627A] pl-[4.5rem] sm:pl-0">
                          {item.time} · {item.mode}
                          <span className="text-[#5146E5] opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(filterTab === "All" || filterTab === "Completed") && completedInterviews.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#56627A] mb-6 border-b border-[#E4E7EF] pb-2">Completed</h3>
                  <div className="space-y-4">
                    {completedInterviews.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedInterview(item)}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <div className="flex items-center gap-6">
                          <div className="text-center w-12 shrink-0 text-[#56627A]">
                            <span className="block text-sm font-bold">{displayDate(item.date)}</span>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-[#0B1020]">{item.company}</h4>
                            <p className="text-sm text-[#56627A] mt-0.5">{item.role} · {item.round}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#56627A] pl-[4.5rem] sm:pl-0">Completed</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(filterTab === "All" || filterTab === "Cancelled") && cancelledInterviews.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#56627A] mb-6 border-b border-[#E4E7EF] pb-2">Cancelled</h3>
                  <div className="space-y-4">
                    {cancelledInterviews.map((item) => <button key={item.id} type="button" onClick={() => setSelectedInterview(item)} className="flex w-full justify-between gap-4 py-4 text-left text-sm">
                      <span>{item.company} · {item.role} · {item.round}</span><span>{displayDate(item.date)} · Cancelled</span>
                    </button>)}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 4. PREPARATION */}
        <aside className="border-t lg:border-t-0 lg:border-l border-[#E4E7EF] pt-8 lg:pt-0 lg:pl-12">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#56627A] mb-6">Preparation</h3>
          <div className="space-y-6">
            {[
              { key: "prep-resume", title: "Review resume", desc: "Walk through every project and skill listed." },
              { key: "prep-role", title: "Review role", desc: "Revisit company mission and engineering requirements." },
              { key: "prep-projects", title: "Discuss projects", desc: "Structure technical talking points." },
            ].map((item) => {
              const isChecked = checkedPrep[item.key];
              return (
                <div key={item.key} onClick={() => togglePrep(item.key)} className="flex items-start gap-3 cursor-pointer group">
                  <div className={`mt-0.5 w-4 h-4 shrink-0 rounded-sm border ${isChecked ? 'bg-[#0B1020] border-[#0B1020]' : 'border-slate-400 group-hover:border-[#0B1020]'} flex items-center justify-center transition-colors`}>
                    {isChecked && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${isChecked ? 'text-[#56627A] line-through' : 'text-[#0B1020]'}`}>{item.title}</p>
                    <p className="text-xs text-[#56627A] mt-1">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-[#56627A] mt-8 bg-[#FAFAFC] p-4">Check your interview details and prepare for the scheduled round.</p>
        </aside>
      </div>

      {/* 5. DETAILS SLIDE-OVER */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#0B1020]/40 backdrop-blur-sm animate-fade-in">
          <button className="absolute inset-0 w-full h-full cursor-default" onClick={() => setSelectedInterview(null)} />
          
          <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            <div className="p-8 border-b border-[#E4E7EF] flex justify-between items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#56627A]">
                  <span className="font-mono text-[#0B1020] mr-2">{selectedInterview.id}</span>
                  App {selectedInterview.applicationId}
                </p>
                <h2 className="text-2xl font-bold text-[#0B1020] mt-1">{selectedInterview.company}</h2>
                <div className="flex gap-4 mt-4 text-xs font-medium text-[#0B1020]">
                  <span>{selectedInterview.role}</span>
                  <span className={`font-bold ${selectedInterview.status === 'Upcoming' ? 'text-[#5146E5]' : 'text-[#56627A]'}`}>
                    {selectedInterview.status}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedInterview(null)} className="text-slate-400 hover:text-black text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 text-[13px] text-[#0B1020]">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#56627A] mb-4">Logistics</h3>
                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#56627A]">Time</span>
                    <p className="font-bold mt-1">{displayDate(selectedInterview.date)} at {selectedInterview.time}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#56627A]">Mode</span>
                    <p className="font-bold mt-1">{selectedInterview.mode}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-xs uppercase tracking-widest text-[#56627A] mb-4">Instructions</h3>
                <p className="leading-relaxed bg-[#F7F8FC] p-4 text-[#0B1020]">{selectedInterview.notes}</p>
              </div>

              <div className="rounded-xl border border-[#E4E7EF] p-4 text-sm">
                <p className="font-bold">Interview status: {selectedInterview.status}</p>
                {selectedInterview.meetingLink && <a href={selectedInterview.meetingLink} target="_blank" rel="noreferrer" className="mt-2 block text-[#5146E5] underline">Join meeting</a>}
                {selectedInterview.location && <p className="mt-2">Location: {selectedInterview.location}</p>}
              </div>
            </div>

            <div className="p-8 border-t border-[#E4E7EF] bg-white flex flex-col sm:flex-row gap-4">
              <Link to="/student/applications" className="flex-1" onClick={() => setSelectedInterview(null)}>
                <button className="w-full py-3 border border-[#E4E7EF] hover:border-[#0B1020] transition-colors text-[#0B1020] font-bold text-sm">
                  View Application
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
