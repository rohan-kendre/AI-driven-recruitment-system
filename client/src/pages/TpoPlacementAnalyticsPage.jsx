import { useEffect, useState } from "react";
import { tpoApi } from "../services/tpoApi.js";
import { DashboardHeader, DashboardMessage, DashboardMetrics } from "../components/LiveDashboard.jsx";

export function TpoPlacementAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    tpoApi.getStats().then((value) => { if (active) setStats(value); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load placement analytics."); });
    return () => { active = false; };
  }, []);
  if (!stats) return <DashboardMessage loading={!error} error={error} />;
  return <div className="space-y-8 pb-16">
    <DashboardHeader eyebrow="Institutional dashboard" title="Placement analytics" description="Current counts and outcomes across the institution." />
    <DashboardMetrics items={[
      { label: "Total students", value: stats.totalStudents },
      { label: "Recruiters", value: stats.totalRecruiters },
      { label: "Total jobs", value: stats.totalJobs },
      { label: "Open jobs", value: stats.openJobs },
      { label: "Applications", value: stats.totalApplications },
      { label: "Shortlisted", value: stats.shortlistedCount },
      { label: "Interviews", value: stats.interviewCount },
      { label: "Accepted offers", value: stats.acceptedOffers },
      { label: "Placement rate", value: `${stats.placementRate}%` },
    ]} />
    <p className="rounded-2xl border border-[#E4E7EF] bg-white p-6 text-sm text-[#56627A] shadow-subtle">Salary distribution, department charts, and student rosters require reporting endpoints and are currently unavailable.</p>
  </div>;
}
