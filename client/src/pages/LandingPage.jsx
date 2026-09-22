import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "../components/ui.jsx";
import {
  applications,
  interviews,
  recommendedJobs,
} from "../data/dashboardData.js";

export function LandingPage() {
  const [activeShowcaseTab, setActiveShowcaseTab] = useState("applications");
  const [activePerspective, setActivePerspective] = useState("student");

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      {/* ============================================================== */}
      {/* 1. HERO SECTION                                                */}
      {/* ============================================================== */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1.1fr] lg:gap-14 xl:gap-20">
            {/* Left Column: Hero Copy */}
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E4E7EF] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#5146E5] shadow-subtle">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
                Campus recruitment, made clearer
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-[#0B1020] sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem] leading-[1.08]">
                Better placement journeys start with one calm workspace.
              </h1>

              {/* Supporting Description */}
              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[#56627A]">
                NexHire brings students, colleges, and recruiters into one
                structured workflow. Built for clear preparation, transparent
                eligibility, and organized recruitment drives.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/register">
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto px-6 py-3 text-sm font-semibold shadow-elevated"
                  >
                    Get started
                    <span className="text-white/80" aria-hidden="true">
                      →
                    </span>
                  </Button>
                </Link>
                <Link to="/student">
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto px-5 py-3 text-sm font-semibold"
                  >
                    View student workspace
                  </Button>
                </Link>
              </div>

              {/* Micro-proof Trust Indicators */}
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-[#E4E7EF] pt-6 text-xs text-[#56627A]">
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#16886A]" />
                  <span>Single campus platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#16886A]" />
                  <span>Deterministic eligibility</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#16886A]" />
                  <span>Advisory AI assistance</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Product Preview */}
            <div className="relative">
              {/* Subtle background container framing */}
              <div className="relative rounded-2xl border border-[#E4E7EF] bg-white p-2.5 sm:p-3 shadow-floating transition-all duration-300">
                {/* Simulated App Frame Header */}
                <div className="flex items-center justify-between border-b border-[#E4E7EF] px-3 pb-2.5 pt-1 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                  </div>
                  <div className="rounded-md bg-[#F7F8FC] px-2.5 py-0.5 font-mono text-[11px] text-[#56627A]">
                    nexhire.edu / student / workspace
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F6F1] px-2 py-0.5 text-[10px] font-semibold text-[#16886A]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                    Live Drive
                  </span>
                </div>

                {/* Simulated Student Workspace Surface */}
                <div className="space-y-4 bg-[#F7F8FC] p-3 sm:p-4 rounded-xl mt-2">
                  {/* Student Snapshot Bar */}
                  <div className="flex items-center justify-between border-b border-[#E4E7EF]/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5146E5] text-xs font-bold text-white">
                        AK
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#0B1020]">
                          Aarav Kulkarni
                        </p>
                        <p className="text-[11px] text-[#56627A]">
                          B.Tech Computer Science · CGPA 8.85
                        </p>
                      </div>
                    </div>
                    <Badge tone="indigo">Drive Active</Badge>
                  </div>

                  {/* 4 Metric Cards Grid */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-xl border border-[#E4E7EF] bg-white p-2.5">
                      <p className="text-[10px] font-medium text-[#56627A]">
                        ATS Readiness
                      </p>
                      <p className="mt-1 font-display text-lg font-bold text-[#0B1020]">
                        82%
                      </p>
                      <div className="mt-1 h-1 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full w-[82%] rounded-full bg-[#5146E5]" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-[#E4E7EF] bg-white p-2.5">
                      <p className="text-[10px] font-medium text-[#56627A]">
                        Applications
                      </p>
                      <p className="mt-1 font-display text-lg font-bold text-[#0B1020]">
                        4 Active
                      </p>
                      <p className="mt-1 text-[10px] text-[#56627A]">
                        1 shortlisted
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#E4E7EF] bg-white p-2.5">
                      <p className="text-[10px] font-medium text-[#56627A]">
                        Interviews
                      </p>
                      <p className="mt-1 font-display text-lg font-bold text-[#0B1020]">
                        25 Aug
                      </p>
                      <p className="mt-1 text-[10px] text-[#16886A] font-medium">
                        Next: Virtual
                      </p>
                    </div>

                    <div className="rounded-xl border border-[#E4E7EF] bg-white p-2.5">
                      <p className="text-[10px] font-medium text-[#56627A]">
                        Offers
                      </p>
                      <p className="mt-1 font-display text-lg font-bold text-[#0B1020]">
                        1 Offer
                      </p>
                      <p className="mt-1 text-[10px] text-[#56627A]">
                        Pending review
                      </p>
                    </div>
                  </div>

                  {/* Active Applications Table Fragment */}
                  <div className="rounded-xl border border-[#E4E7EF] bg-white p-3">
                    <div className="flex items-center justify-between pb-2 border-b border-[#E4E7EF]/80 text-xs">
                      <span className="font-semibold text-[#0B1020]">
                        Placement Pipeline
                      </span>
                      <span className="text-[11px] text-[#5146E5] font-medium">
                        4 in progress
                      </span>
                    </div>
                    <div className="divide-y divide-[#E4E7EF]/60 pt-1">
                      {applications.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2 text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="truncate font-medium text-[#0B1020]">
                              {item.role}
                            </p>
                            <p className="text-[11px] text-[#56627A]">
                              {item.company} · {item.date}
                            </p>
                          </div>
                          <Badge tone={item.tone}>{item.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Layer: Deterministic Eligibility Badge */}
              <div className="mt-3 sm:absolute sm:-bottom-5 sm:-right-4 sm:mt-0 max-w-xs rounded-xl border border-[#E4E7EF] bg-white p-3 shadow-elevated">
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#E8F6F1] text-[#16886A]">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0B1020]">
                      Verified Eligibility: 100%
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-[#56627A]">
                      Deterministic match on CGPA ≥ 7.5, zero backlogs, and CS
                      branch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. SECTION 2 — PRODUCT VALUE / ONE PLACEMENT PLATFORM          */}
      {/* ============================================================== */}
      <section id="overview" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Section Header */}
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
              One placement platform
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
              Everything important, in one clear workflow.
            </h2>
            <p className="mt-3 text-base text-[#56627A]">
              Designed specifically for institutional campus recruitment to
              replace disjointed forms, manual spreadsheet updates, and unclear
              selection steps.
            </p>
          </div>

          {/* Three Core Audiences Editorial Grid */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* 01 — Students */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle hover:border-[#D1D5E3] transition-colors">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#5146E5]">
                  01 — Students
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-[#0B1020]">
                  Preparation to offer in one place
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#56627A]">
                  Maintain a single verified profile, receive advisory ATS
                  resume feedback, check your exact eligibility before applying,
                  and track every stage from screening to offer.
                </p>
              </div>
              <div className="mt-6 border-t border-[#E4E7EF] pt-4">
                <span className="text-xs font-semibold text-[#0B1020]">
                  Features:{" "}
                </span>
                <span className="text-xs text-[#56627A]">
                  Deterministic checks · ATS score · Interview calendar
                </span>
              </div>
            </div>

            {/* 02 — Recruiters */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle hover:border-[#D1D5E3] transition-colors">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#5146E5]">
                  02 — Recruiters
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-[#0B1020]">
                  Qualified candidates, zero noise
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#56627A]">
                  Publish job requirements with exact criteria. Candidates are
                  automatically verified against college-authenticated records
                  so hiring teams review only eligible applicants.
                </p>
              </div>
              <div className="mt-6 border-t border-[#E4E7EF] pt-4">
                <span className="text-xs font-semibold text-[#0B1020]">
                  Features:{" "}
                </span>
                <span className="text-xs text-[#56627A]">
                  Verified records · Pipeline tracking · Offer dispatch
                </span>
              </div>
            </div>

            {/* 03 — Placement Teams / TPOs */}
            <div className="flex flex-col justify-between rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle hover:border-[#D1D5E3] transition-colors">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#5146E5]">
                  03 — Placement Offices
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-[#0B1020]">
                  Total institutional visibility
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#56627A]">
                  Coordinate campus drives, approve recruiter partners, monitor
                  department-wise placement statistics, and maintain a complete
                  audit log for institutional reporting.
                </p>
              </div>
              <div className="mt-6 border-t border-[#E4E7EF] pt-4">
                <span className="text-xs font-semibold text-[#0B1020]">
                  Features:{" "}
                </span>
                <span className="text-xs text-[#56627A]">
                  Department analytics · Drive governance · Compliance logs
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SECTION 3 — WORKFLOW SEQUENCE                               */}
      {/* ============================================================== */}
      <section id="workflow" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Header */}
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
              Workflow sequence
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
              A structured journey from day one to offer.
            </h2>
            <p className="mt-3 text-base text-[#56627A]">
              Every transition in NexHire is deterministic and transparent. No
              silent rejections, no lost submissions.
            </p>
          </div>

          {/* Stepper Grid (Horizontal on desktop, vertical on mobile) */}
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                step: "01",
                title: "Build profile",
                desc: "Verified coursework, CGPA, backlogs, skills, and versioned resume.",
              },
              {
                step: "02",
                title: "Discover drives",
                desc: "Browse verified opportunities with instant eligibility calculation.",
              },
              {
                step: "03",
                title: "Apply & track",
                desc: "One-click application with full timestamped status history.",
              },
              {
                step: "04",
                title: "Interview",
                desc: "Coordinated virtual and on-campus panels with structured notes.",
              },
              {
                step: "05",
                title: "Receive offer",
                desc: "Verified offer letter dispatch, compensation breakdown, and status.",
              },
            ].map((item, idx) => (
              <div
                key={item.step}
                className="group relative rounded-xl border border-[#E4E7EF] bg-white p-5 transition-all hover:border-[#5146E5]/40 hover:shadow-subtle"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#5146E5]">
                    {item.step}
                  </span>
                  {idx < 4 && (
                    <span className="hidden lg:inline text-xs font-medium text-slate-300">
                      →
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-base font-bold text-[#0B1020]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#56627A]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SECTION 4 — PRODUCT SHOWCASE                                */}
      {/* ============================================================== */}
      <section id="showcase" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Platform preview
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
                Designed for high-stakes placement seasons.
              </h2>
              <p className="mt-3 text-base text-[#56627A]">
                Inspect key parts of the student workspace and recruitment
                management interface.
              </p>
            </div>

            {/* Interactive Showcase Tabs */}
            <div className="flex rounded-xl border border-[#E4E7EF] bg-white p-1 shadow-subtle self-start md:self-auto">
              {[
                { id: "applications", label: "Applications" },
                { id: "interviews", label: "Interviews" },
                { id: "jobs", label: "Opportunities" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveShowcaseTab(tab.id)}
                  className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    activeShowcaseTab === tab.id
                      ? "bg-[#5146E5] text-white shadow-subtle"
                      : "text-[#56627A] hover:text-[#0B1020]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Showcase Display Canvas */}
          <div className="mt-8 rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-8 shadow-elevated">
            {activeShowcaseTab === "applications" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E7EF] pb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0B1020]">
                      Application Pipeline Tracker
                    </h3>
                    <p className="text-xs text-[#56627A]">
                      Complete visibility into every drive application stage.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#5146E5]">
                      Annotation: Immutable Status History
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E4E7EF] text-[#56627A]">
                        <th className="pb-3 font-semibold">Application ID</th>
                        <th className="pb-3 font-semibold">Role & Company</th>
                        <th className="pb-3 font-semibold">Applied Date</th>
                        <th className="pb-3 font-semibold">Current Stage</th>
                        <th className="pb-3 font-semibold text-right">
                          Eligibility
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E4E7EF]/80">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-[#F7F8FC]">
                          <td className="py-3 font-mono font-medium text-[#56627A]">
                            {app.id}
                          </td>
                          <td className="py-3 font-semibold text-[#0B1020]">
                            {app.role}
                            <span className="block text-[11px] font-normal text-[#56627A]">
                              {app.company}
                            </span>
                          </td>
                          <td className="py-3 text-[#56627A]">{app.date}</td>
                          <td className="py-3">
                            <Badge tone={app.tone}>{app.status}</Badge>
                          </td>
                          <td className="py-3 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16886A]">
                              ✓ Verified
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Annotation Detail Card */}
                <div className="rounded-xl border border-indigo-100 bg-[#F5F6FF] p-4 text-xs text-[#5146E5]">
                  <b className="font-semibold">Why this matters:</b> When status
                  changes from Screening to Shortlisted or Interview, an
                  in-app notification and email are generated automatically.
                  Students never have to ask whether an update has occurred.
                </div>
              </div>
            )}

            {activeShowcaseTab === "interviews" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E7EF] pb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0B1020]">
                      Upcoming Interview Schedule
                    </h3>
                    <p className="text-xs text-[#56627A]">
                      Synchronized panel timings, instructions, and room links.
                    </p>
                  </div>
                  <span className="rounded-md bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#5146E5]">
                    Annotation: Timezone & Mode Coordination
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {interviews.map((item) => (
                    <div
                      key={item.company}
                      className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-md bg-[#5146E5] px-2 py-1 font-mono text-[11px] font-bold text-white">
                          {item.date}
                        </span>
                        <Badge tone="emerald">{item.mode}</Badge>
                      </div>
                      <h4 className="mt-3 text-sm font-bold text-[#0B1020]">
                        {item.company}
                      </h4>
                      <p className="text-xs text-[#56627A]">
                        {item.role} · {item.time}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-[#E4E7EF] pt-2 text-[11px] text-[#56627A]">
                        <span>Panel: Technical Round 1</span>
                        <span className="font-semibold text-[#5146E5]">
                          Details Ready
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-indigo-100 bg-[#F5F6FF] p-4 text-xs text-[#5146E5]">
                  <b className="font-semibold">Workflow detail:</b> Interview
                  schedules require recruiter authorization and immediately update
                  the candidate's timeline. Upon interview completion, panel
                  feedback is recorded directly into the application record.
                </div>
              </div>
            )}

            {activeShowcaseTab === "jobs" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E7EF] pb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#0B1020]">
                      Verified Campus Drive Opportunities
                    </h3>
                    <p className="text-xs text-[#56627A]">
                      Pre-calculated deterministic eligibility before you submit.
                    </p>
                  </div>
                  <span className="rounded-md bg-[#EEF0FF] px-2.5 py-1 text-xs font-semibold text-[#5146E5]">
                    Annotation: Strict Backend Criteria
                  </span>
                </div>

                <div className="grid gap-3">
                  {recommendedJobs.map((job) => (
                    <div
                      key={job.company}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4 hover:border-[#D1D5E3] transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#0B1020]">
                            {job.role}
                          </span>
                          <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-[#56627A] border border-[#E4E7EF]">
                            {job.location}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#56627A]">
                          {job.company} · Closes {job.deadline}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge tone="indigo">{job.match}% Profile Match</Badge>
                        <span className="rounded-lg bg-white border border-[#E4E7EF] px-3 py-1 text-xs font-semibold text-[#0B1020]">
                          Eligible
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-indigo-100 bg-[#F5F6FF] p-4 text-xs text-[#5146E5]">
                  <b className="font-semibold">Deterministic rule:</b> Eligibility
                  is computed on the server as `CGPA &gt;= minCGPA && branch in
                  allowedBranches &amp;&amp; backlogs &lt;= maxBacklogs`. No candidate
                  applies blindly to a role they cannot be considered for.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. SECTION 5 — ROLE-BASED EXPERIENCE                          */}
      {/* ============================================================== */}
      <section id="perspectives" className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {/* Header */}
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
              Role-based perspectives
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
              Built around each participant's actual responsibilities.
            </h2>
            <p className="mt-3 text-base text-[#56627A]">
              NexHire provides dedicated, clean interfaces tailored to how
              students, recruiters, and placement directors operate.
            </p>
          </div>

          {/* Segmented Perspective Switcher */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-[#E4E7EF] pb-4">
            {[
              { id: "student", label: "Student Perspective" },
              { id: "recruiter", label: "Recruiter Perspective" },
              { id: "tpo", label: "College & TPO Perspective" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePerspective(tab.id)}
                className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activePerspective === tab.id
                    ? "bg-[#0B1020] text-white shadow-subtle"
                    : "bg-white border border-[#E4E7EF] text-[#56627A] hover:text-[#0B1020] hover:bg-[#F7F8FC]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Perspective Content */}
          <div className="mt-6 rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-9 shadow-subtle">
            {activePerspective === "student" && (
              <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                  <div className="font-mono text-xs font-bold text-[#5146E5] uppercase">
                    Stage progression
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-[#0B1020]">
                    Prepare → Discover → Apply → Interview → Offer
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#56627A]">
                    Students manage a single authoritative profile with academic
                    records, coursework, and versioned resumes. Every job card
                    explains eligibility beforehand, preventing rejected
                    applications due to hidden criteria.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-[#E4E7EF] p-3 bg-[#F7F8FC]">
                      <b className="block text-[#0B1020]">Advisory ATS Feedback</b>
                      <span className="mt-1 block text-[#56627A]">
                        Actionable keyword and structure suggestions before drive
                        submissions.
                      </span>
                    </div>
                    <div className="rounded-xl border border-[#E4E7EF] p-3 bg-[#F7F8FC]">
                      <b className="block text-[#0B1020]">Application Timeline</b>
                      <span className="mt-1 block text-[#56627A]">
                        Timestamped status changes with withdrawal controls when
                        permitted.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#56627A]">
                      Student Principle
                    </span>
                    <p className="mt-2 font-display text-lg font-bold text-[#0B1020]">
                      "No guessing whether your application was received or what
                      stage comes next."
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E4E7EF]">
                    <Link to="/student">
                      <Button variant="secondary" className="w-full text-xs">
                        Open student dashboard demo
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activePerspective === "recruiter" && (
              <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                  <div className="font-mono text-xs font-bold text-[#5146E5] uppercase">
                    Stage progression
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-[#0B1020]">
                    Publish → Review → Shortlist → Interview → Hire
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#56627A]">
                    Recruiters configure specific recruitment drives with exact
                    eligibility rules. Only institution-approved students meeting
                    the criteria can apply, keeping candidate pools pre-screened
                    and verified.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-[#E4E7EF] p-3 bg-[#F7F8FC]">
                      <b className="block text-[#0B1020]">Verified Student Data</b>
                      <span className="mt-1 block text-[#56627A]">
                        Direct validation against college-approved roll numbers
                        and CGPAs.
                      </span>
                    </div>
                    <div className="rounded-xl border border-[#E4E7EF] p-3 bg-[#F7F8FC]">
                      <b className="block text-[#0B1020]">Interview Feedback</b>
                      <span className="mt-1 block text-[#56627A]">
                        Structured evaluation records attached directly to candidate
                        profiles.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#56627A]">
                      Recruiter Principle
                    </span>
                    <p className="mt-2 font-display text-lg font-bold text-[#0B1020]">
                      "A clean pipeline for hiring candidates meeting your
                      institution-verified standards."
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E4E7EF]">
                    <Link to="/recruiter">
                      <Button variant="secondary" className="w-full text-xs">
                        Open recruiter workspace
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {activePerspective === "tpo" && (
              <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
                <div>
                  <div className="font-mono text-xs font-bold text-[#5146E5] uppercase">
                    Stage progression
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-bold text-[#0B1020]">
                    Coordinate → Approve → Monitor → Report
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-[#56627A]">
                    Training & Placement Officers oversee institutional drive
                    calendars, approve company registrations, resolve candidate
                    concerns, and generate real-time placement statistics across
                    departments.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-[#E4E7EF] p-3 bg-[#F7F8FC]">
                      <b className="block text-[#0B1020]">Drive Governance</b>
                      <span className="mt-1 block text-[#56627A]">
                        Institutional policies on application limits, interview
                        scheduling, and offer acceptance.
                      </span>
                    </div>
                    <div className="rounded-xl border border-[#E4E7EF] p-3 bg-[#F7F8FC]">
                      <b className="block text-[#0B1020]">Department Analytics</b>
                      <span className="mt-1 block text-[#56627A]">
                        Live funnel reports on placed percentage, packages, and
                        company participation.
                      </span>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#56627A]">
                      Institutional Principle
                    </span>
                    <p className="mt-2 font-display text-lg font-bold text-[#0B1020]">
                      "Complete placement transparency across every academic
                      department and recruiting partner."
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E4E7EF]">
                    <Link to="/register">
                      <Button variant="secondary" className="w-full text-xs">
                        Explore college setup
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. SECTION 6 — RESPONSIBLE TECHNOLOGY & TRUST                  */}
      {/* ============================================================== */}
      <section className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-2xl border border-[#E4E7EF] bg-white p-7 sm:p-10 shadow-subtle">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Responsible technology
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1020]">
                Technology that assists the process, without taking the decision
                away from people.
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#56627A]">
                NexHire uses AI strictly for candidate preparation and advisory
                assistance. Core hiring decisions, eligibility calculations, and
                rankings remain 100% explainable, deterministic, and human-owned.
              </p>
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-3 border-t border-[#E4E7EF] pt-8">
              <div>
                <span className="font-mono text-xs font-bold text-[#5146E5]">
                  01 / Advisory AI
                </span>
                <h3 className="mt-2 text-sm font-bold text-[#0B1020]">
                  Advisory, not automated rejection
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#56627A]">
                  AI evaluates resume clarity, missing keywords, and mock interview
                  responses for candidate practice. It never auto-rejects an
                  applicant or makes selection decisions.
                </p>
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-[#5146E5]">
                  02 / Explainability
                </span>
                <h3 className="mt-2 text-sm font-bold text-[#0B1020]">
                  Deterministic backend rules
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#56627A]">
                  Every eligibility check runs on clear, verifiable logic:
                  minimum CGPA, active backlogs, and permitted branches. Criteria
                  are transparent to candidates before applying.
                </p>
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-[#5146E5]">
                  03 / Accountability
                </span>
                <h3 className="mt-2 text-sm font-bold text-[#0B1020]">
                  Authenticated audit trails
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#56627A]">
                  Every status progression, interview schedule, and offer dispatch
                  is attributed to a verified user account with timestamped
                  audit records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. SECTION 7 — FINAL CTA                                       */}
      {/* ============================================================== */}
      <section className="scroll-mt-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-3xl border border-[#1C2438] bg-[#0B1020] p-8 sm:p-12 lg:p-16 text-white shadow-floating relative overflow-hidden">
            {/* Subtle structural accent line */}
            <div className="absolute top-0 right-0 h-40 w-40 bg-[#5146E5]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-2xl">
              <span className="inline-block rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold text-indigo-300">
                Placement season ready
              </span>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                Make the next placement step clearer.
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-300">
                Bring preparation, verified opportunities, and placement
                workflows into one focused workspace.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/register">
                  <Button
                    variant="primary"
                    className="w-full sm:w-auto px-6 py-3 text-sm font-semibold"
                  >
                    Get started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outlineDark"
                    className="w-full sm:w-auto px-5 py-3 text-sm font-semibold"
                  >
                    Sign in to workspace
                  </Button>
                </Link>
              </div>

              <p className="mt-6 text-xs text-slate-400">
                Designed for single-institution campus hiring · Transparent
                student eligibility
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. FOOTER                                                      */}
      {/* ============================================================== */}
      <footer className="border-t border-[#E4E7EF] bg-white pt-14 pb-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#5146E5] text-xs font-bold text-white">
                  N
                </span>
                <span className="font-display text-base font-bold tracking-tight text-[#0B1020]">
                  NexHire
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[#56627A]">
                Structured campus recruitment and placement platform connecting
                students, colleges, and recruiters through clear workflows.
              </p>
              <div className="mt-4">
                <Badge tone="indigo">MVP Phase 0</Badge>
              </div>
            </div>

            {/* Column 2: Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1020]">
                Workspaces
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-[#56627A]">
                <li>
                  <Link
                    to="/student"
                    className="hover:text-[#5146E5] transition-colors"
                  >
                    Student Workspace
                  </Link>
                </li>
                <li>
                  <Link
                    to="/recruiter"
                    className="hover:text-[#5146E5] transition-colors"
                  >
                    Recruiter Workspace
                  </Link>
                </li>
                <li>
                  <a
                    href="#workflow"
                    className="hover:text-[#5146E5] transition-colors"
                  >
                    Placement Workflow
                  </a>
                </li>
                <li>
                  <a
                    href="#showcase"
                    className="hover:text-[#5146E5] transition-colors"
                  >
                    Platform Preview
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Platform Architecture */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1020]">
                Architecture
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-[#56627A]">
                <li className="text-[#56627A]">Deterministic Eligibility</li>
                <li className="text-[#56627A]">Advisory AI Engine</li>
                <li className="text-[#56627A]">Role-Based Access Control</li>
                <li className="text-[#56627A]">Immutable Status History</li>
              </ul>
            </div>

            {/* Column 4: Account */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1020]">
                Access
              </h4>
              <ul className="mt-3 space-y-2 text-xs text-[#56627A]">
                <li>
                  <Link
                    to="/login"
                    className="hover:text-[#5146E5] transition-colors"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="hover:text-[#5146E5] transition-colors"
                  >
                    Create account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student"
                    className="hover:text-[#5146E5] transition-colors"
                  >
                    Demo student session
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-[#E4E7EF] pt-6 text-xs text-[#56627A]">
            <p>© 2026 NexHire. Built with precision for campus recruitment.</p>
            <p className="mt-2 sm:mt-0">
              Connecting Students, Colleges, and Recruiters through AI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
