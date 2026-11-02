import { useEffect, useState } from "react";
import { jobsApi } from "../services/jobsApi.js";
import { applicationsApi } from "../services/applicationsApi.js";
import { interviewsApi } from "../services/interviewsApi.js";
import { offersApi } from "../services/offersApi.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { DashboardHeader, DashboardList, DashboardMessage, DashboardMetrics } from "../components/LiveDashboard.jsx";

export function RecruiterDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([jobsApi.getMyJobs(), applicationsApi.getRecruiterCandidates(), interviewsApi.getInterviews(), offersApi.getOffers()])
      .then(([jobs, result, interviews, offers]) => { if (active) setData({ jobs, candidates: result.candidates || [], interviews, offers }); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load dashboard data."); });
    return () => { active = false; };
  }, []);
  if (!data) return <DashboardMessage loading={!error} error={error} />;
  const scheduled = data.interviews.filter((item) => ["SCHEDULED", "RESCHEDULED"].includes(item.status));
  return <div className="space-y-8 pb-16">
    <DashboardHeader eyebrow="Recruiter workspace" title={`Welcome, ${user?.name?.split(" ")[0] || "Recruiter"}.`} description="Your hiring drives, applicants, interviews, and offers." />
    <DashboardMetrics items={[
      { label: "Active jobs", value: data.jobs.filter((job) => job.status === "OPEN").length, to: "/recruiter/jobs" },
      { label: "Applications", value: data.candidates.length, to: "/recruiter/candidates" },
      { label: "Shortlisted candidates", value: data.candidates.filter((item) => item.status === "SHORTLISTED").length, to: "/recruiter/candidates" },
      { label: "Scheduled interviews", value: scheduled.length, to: "/recruiter/interviews" },
      { label: "Offers issued", value: data.offers.length, to: "/recruiter/offers" },
    ]} />
    <div className="grid gap-6 lg:grid-cols-2">
      <DashboardList title="Jobs" items={data.jobs.slice(0, 5)} empty="No jobs yet. Create your first position." to="/recruiter/jobs" renderItem={(item) => <div className="flex justify-between gap-3"><span>{item.title}</span><span className="text-[#56627A]">{item.status}</span></div>} />
      <DashboardList title="Recent applicants" items={data.candidates.slice(0, 5)} empty="No applications received yet." to="/recruiter/candidates" renderItem={(item) => <div className="flex justify-between gap-3"><span>{item.name} · {item.role}</span><span className="text-[#56627A]">{item.stage}</span></div>} />
      <DashboardList title="Upcoming interviews" items={scheduled.slice(0, 5)} empty="No interviews scheduled." to="/recruiter/interviews" renderItem={(item) => <div className="flex justify-between gap-3"><span>{item.candidateName} · {item.role}</span><span className="text-[#56627A]">{item.date}</span></div>} />
      <DashboardList title="Offers" items={data.offers.slice(0, 5)} empty="No offers issued yet." to="/recruiter/offers" renderItem={(item) => <div className="flex justify-between gap-3"><span>{item.candidateName} · {item.role}</span><span className="text-[#56627A]">{item.status}</span></div>} />
    </div>
  </div>;
}
