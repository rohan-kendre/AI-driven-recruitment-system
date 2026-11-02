import { useEffect, useState } from "react";
import { tpoApi } from "../services/tpoApi.js";
import { DashboardHeader, DashboardMessage, DashboardMetrics } from "../components/LiveDashboard.jsx";

export function TpoDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    tpoApi.getStats().then((value) => { if (active) setStats(value); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load placement statistics."); });
    return () => { active = false; };
  }, []);
  if (!stats) return <DashboardMessage loading={!error} error={error} />;
  return <div className="space-y-8 pb-16">
    <DashboardHeader eyebrow="Placement workspace" title="Placement overview" description="Institution-wide statistics from current recruitment records." />
    <DashboardMetrics items={[
      { label: "Students", value: stats.totalStudents },
      { label: "Recruiters", value: stats.totalRecruiters },
      { label: "Open jobs", value: stats.openJobs },
      { label: "Applications", value: stats.totalApplications },
      { label: "Shortlisted", value: stats.shortlistedCount },
      { label: "Interviews", value: stats.interviewCount },
      { label: "Offers", value: stats.offersCount },
      { label: "Placement rate", value: `${stats.placementRate}%`, to: "/tpo/placement-analytics" },
    ]} />
    <p className="rounded-2xl border border-[#E4E7EF] bg-white p-6 text-sm text-[#56627A] shadow-subtle">{stats.totalStudents || stats.totalJobs ? "Charts and drive activity will appear when reporting data is available." : "No placement activity yet. Statistics will update as students and jobs are added."}</p>
  </div>;
}
