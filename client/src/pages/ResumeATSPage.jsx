import { DashboardHeader } from "../components/LiveDashboard.jsx";

export function ResumeATSPage() {
  return <div className="mx-auto max-w-5xl space-y-8 pb-16">
    <DashboardHeader eyebrow="Student workspace" title="Resume & ATS" description="Resume management and analysis." />
    <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle">
      <h2 className="font-display text-base font-bold text-[#0B1020]">No resume on file</h2>
      <p className="mt-2 text-sm text-[#56627A]">Resume upload and ATS analysis are not available yet. Your profile and application records remain available.</p>
    </section>
  </div>;
}
