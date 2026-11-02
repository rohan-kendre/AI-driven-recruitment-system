import { useEffect, useState } from "react";
import { applicationsApi } from "../services/applicationsApi.js";
import { interviewsApi } from "../services/interviewsApi.js";
import { offersApi } from "../services/offersApi.js";
import { jobsApi } from "../services/jobsApi.js";
import { studentApi } from "../services/studentApi.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { DashboardHeader, DashboardList, DashboardMessage, DashboardMetrics } from "../components/LiveDashboard.jsx";

export function StudentDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      applicationsApi.getMyApplications(), interviewsApi.getInterviews(),
      offersApi.getOffers(), jobsApi.getJobs(), studentApi.getProfile(),
    ]).then(([applications, interviews, offers, jobs, profile]) => {
      if (active) setData({ applications, interviews, offers, jobs, profile });
    }).catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load dashboard data."); });
    return () => { active = false; };
  }, []);

  const message = <DashboardMessage loading={!data && !error} error={error} />;
  if (!data) return message;
  const upcoming = data.interviews.filter((item) => ["SCHEDULED", "RESCHEDULED"].includes(item.status));
  const eligible = data.jobs.filter((job) => job.status === "OPEN" && job.isEligible && !job.applied);
  return <div className="space-y-8 pb-16">
    <DashboardHeader eyebrow="Student workspace" title={`Welcome, ${user?.name?.split(" ")[0] || "Student"}.`} description="Your applications, interviews, offers, and eligible opportunities." />
    <DashboardMetrics items={[
      { label: "Applications", value: data.applications.length, to: "/student/applications" },
      { label: "Upcoming interviews", value: upcoming.length, to: "/student/interviews" },
      { label: "Offers", value: data.offers.length, to: "/student/offers" },
      { label: "Eligible open jobs", value: eligible.length, to: "/student/jobs" },
    ]} />
    <div className="grid gap-6 lg:grid-cols-2">
      <DashboardList title="Recent applications" items={data.applications.slice(0, 5)} empty="No applications yet. Explore jobs to begin." to="/student/applications" renderItem={(item) => <div className="flex justify-between gap-3"><span>{item.role} · {item.company}</span><span className="text-[#56627A]">{item.stage}</span></div>} />
      <DashboardList title="Upcoming interviews" items={upcoming.slice(0, 5)} empty="No interviews scheduled." to="/student/interviews" renderItem={(item) => <div className="flex justify-between gap-3"><span>{item.role} · {item.company}</span><span className="text-[#56627A]">{item.date}</span></div>} />
      <DashboardList title="Eligible jobs" items={eligible.slice(0, 5)} empty="No eligible open jobs right now." to="/student/jobs" renderItem={(item) => <div className="flex justify-between gap-3"><span>{item.title} · {item.company}</span><span className="text-[#56627A]">{item.location}</span></div>} />
      <DashboardList title="Profile" items={data.profile ? [data.profile] : []} empty="Complete your academic profile to check eligibility." to="/student/profile" renderItem={(profile) => <span>{profile.branch || "Branch not set"} · CGPA {profile.cgpa ?? "Not set"}</span>} />
    </div>
  </div>;
}
