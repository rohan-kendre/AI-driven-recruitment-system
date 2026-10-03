import { Link } from "react-router-dom";
import { Badge, Button } from "../components/ui.jsx";
import heroArchitecture from "../assets/hero-architecture.jpg";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#0B1020]">
      {/* ============================================================== */}
      {/* 1. IMMERSIVE HERO WITH ARCHITECTURAL BACKGROUND & FLOATING UI  */}
      {/* ============================================================== */}
      <section className="p-3 sm:p-5 lg:p-6">
        <div className="relative min-h-[88vh] sm:min-h-[92vh] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-[#E4E7EF] shadow-floating flex flex-col justify-between p-5 sm:p-10 lg:p-14">
          {/* Cinematic Background Layer */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={heroArchitecture}
              alt="Contemporary university campus architecture at twilight"
              className="h-full w-full object-cover object-center scale-[1.02] transform transition-transform duration-1000 ease-out"
            />
            {/* Cinematic Overlay: Keeps architecture visible while guaranteeing crisp text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1020]/95 via-[#0B1020]/55 to-[#0B1020]/35" />
            <div className="absolute inset-0 bg-[#0B1020]/20 backdrop-blur-[0.5px]" />
          </div>

          {/* Top: Floating Translucent Navigation Bar */}
          <div className="relative z-30 mx-auto w-full max-w-5xl lg:max-w-6xl">
            <nav className="flex h-14 items-center justify-between rounded-full border border-white/20 bg-[#0B1020]/60 px-3.5 sm:px-6 shadow-floating backdrop-blur-md transition-all gap-3 sm:gap-4">
              {/* Brand */}
              <Link
                to="/"
                className="flex items-center gap-2.5 transition-opacity hover:opacity-90 shrink-0"
              >
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#5146E5] text-xs font-bold text-white shadow-subtle">
                  N
                </span>
                <span className="font-display text-base font-bold tracking-tight text-white hidden xs:inline-block">
                  NexHire
                </span>
              </Link>

              {/* Navigation Options Directly on Navigation Bar */}
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 overflow-x-auto no-scrollbar py-1">
                <Link
                  to="/student"
                  className="rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  Student
                </Link>
                <Link
                  to="/recruiter"
                  className="rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  Recruiter
                </Link>
                <Link
                  to="/student/resume"
                  className="rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  Resume & ATS
                </Link>
                <Link
                  to="/student/applications"
                  className="rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  Applications
                </Link>
                <Link
                  to="/student/interviews"
                  className="rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  Interviews
                </Link>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-semibold text-white/80 hover:text-white px-2 sm:px-2.5 py-1.5 transition-colors whitespace-nowrap"
                >
                  Sign in
                </Link>
                <Link to="/register">
                  <Button
                    variant="primary"
                    className="rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm shadow-subtle whitespace-nowrap"
                  >
                    Get started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>

          {/* Center/Body: Hero Typography & Floating Real Product UI Fragment */}
          <div className="relative z-10 my-auto py-12 sm:py-16 grid lg:grid-cols-[1.25fr_0.75fr] items-end gap-10 max-w-6xl mx-auto w-full">
            {/* Left: Minimal Typography */}
            <div className="space-y-6 max-w-2xl">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-sm shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6257F5]" />
                Campus recruitment, made clearer
              </div>

              {/* Main Headline */}
              <h1 className="font-display text-4xl sm:text-6xl lg:text-[4.25rem] font-extrabold tracking-tight text-white leading-[1.08]">
                Better placement journeys <br />
                start with one calm workspace.
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                NexHire brings students, recruiters, and colleges into one focused placement workspace.
              </p>

              {/* Primary Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <Link to="/register" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0B1020] hover:bg-slate-100 shadow-elevated transition-all">
                    Get started
                    <span className="text-[#0B1020]/70 ml-1" aria-hidden="true">
                      →
                    </span>
                  </button>
                </Link>
                <Link to="/student" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 backdrop-blur-sm transition-all">
                    View workspace
                  </button>
                </Link>
              </div>
            </div>

            {/* Right: Floating Product UI Fragment */}
            <div className="flex justify-start lg:justify-end">
              <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0B1020]/75 p-5 text-white shadow-floating backdrop-blur-md transition-all hover:border-white/30">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                      Active Application
                    </span>
                    <h3 className="mt-0.5 font-display text-sm font-bold text-white">
                      Acme Technologies
                    </h3>
                    <p className="text-xs text-slate-300">
                      Software Engineer Intern
                    </p>
                  </div>
                  <span className="rounded-full bg-[#16886A]/25 border border-[#16886A]/50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300">
                    Shortlisted
                  </span>
                </div>

                <div className="pt-3 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Technical Round</span>
                    <span className="font-mono text-white">25 Aug · 11:00 AM</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Resume readiness</span>
                      <span className="font-bold text-emerald-400">82%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full w-[82%] rounded-full bg-[#5146E5]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Atmosphere Indicator */}
          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-slate-400">
            <span>Contemporary Campus Architecture · Verified Placement System</span>
            <span className="hidden sm:inline">Somaiya Institutional Placement Hub</span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. HERO PRODUCT VISUAL (CENTERPIECE)                           */}
      {/* ============================================================== */}
      <section className="px-5 sm:px-8 max-w-6xl mx-auto pt-12 sm:pt-16">
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-2.5 sm:p-3 shadow-floating transition-all">
          {/* Subtle Window Header */}
          <div className="flex items-center justify-between border-b border-[#E4E7EF] px-3.5 pb-2.5 pt-1 text-xs text-[#56627A]">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            </div>
            <div className="rounded-md bg-[#F7F8FC] border border-[#E4E7EF]/60 px-3 py-0.5 font-mono text-[11px] text-[#56627A]">
              nexhire.edu / student / workspace
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#16886A]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
              Drive Active
            </div>
          </div>

          {/* Product Surface */}
          <div className="bg-[#F7F8FC] rounded-xl p-4 sm:p-6 mt-2 space-y-5">
            {/* Workspace Context Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E7EF] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                    Student Workspace
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] text-[#56627A]">Somaiya College of Engineering</span>
                </div>
                <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#0B1020] mt-0.5">
                  Aarav Kulkarni
                </h2>
                <p className="text-xs text-[#56627A]">
                  B.Tech Computer Science · Batch 2026 · Verified CGPA 8.85
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="rounded-lg border border-[#E4E7EF] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1020] shadow-2xs">
                  1 Offer Extended
                </span>
                <span className="rounded-lg bg-[#EEF0FF] px-3 py-1.5 text-xs font-semibold text-[#5146E5]">
                  2 Interviews Scheduled
                </span>
              </div>
            </div>

            {/* Essential Dashboard Focal Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Element 1: Resume Readiness */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#56627A]">
                      Resume Readiness
                    </span>
                    <span className="text-[11px] font-bold text-[#16886A]">82%</span>
                  </div>
                  <p className="mt-2 font-display text-2xl font-extrabold text-[#0B1020]">
                    v2.4 Active
                  </p>
                  <p className="mt-0.5 text-xs text-[#56627A]">
                    Somaiya TPO Gate Cleared
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E4E7EF]">
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[82%] rounded-full bg-[#5146E5]" />
                  </div>
                </div>
              </div>

              {/* Element 2: Next Interview */}
              <div className="rounded-xl border border-[#5146E5]/30 bg-white p-4 shadow-subtle flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#5146E5]" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5146E5]">
                      Next Interview
                    </span>
                    <Badge tone="indigo">25 Aug</Badge>
                  </div>
                  <p className="mt-2 font-display text-sm font-bold text-[#0B1020]">
                    PixelCraft Studio
                  </p>
                  <p className="text-xs text-[#56627A]">
                    Frontend Developer · 11:00 AM
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E4E7EF] flex items-center justify-between text-[11px] text-[#56627A]">
                  <span>Technical Round 1</span>
                  <span className="font-semibold text-[#5146E5]">Virtual</span>
                </div>
              </div>

              {/* Element 3: Active Application */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#56627A]">
                      Application
                    </span>
                    <Badge tone="emerald">Shortlisted</Badge>
                  </div>
                  <p className="mt-2 font-display text-sm font-bold text-[#0B1020]">
                    Acme Technologies
                  </p>
                  <p className="text-xs text-[#56627A]">
                    Software Engineer Intern
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E4E7EF] flex items-center justify-between text-[11px] text-[#56627A]">
                  <span>APP-1048 · On campus</span>
                  <span className="font-mono text-[#0B1020]">₹45k/mo</span>
                </div>
              </div>

              {/* Element 4: Recommended Opportunity */}
              <div className="rounded-xl border border-[#E4E7EF] bg-white p-4 shadow-subtle flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#56627A]">
                      Curated Drive
                    </span>
                    <span className="text-[11px] font-bold text-[#5146E5]">91% Match</span>
                  </div>
                  <p className="mt-2 font-display text-sm font-bold text-[#0B1020]">
                    OrbitWorks
                  </p>
                  <p className="text-xs text-[#56627A]">
                    MERN Stack Intern · Hybrid
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E4E7EF] flex items-center justify-between text-[11px] text-[#56627A]">
                  <span>Eligible · 0 Backlogs</span>
                  <span className="font-semibold text-[#16886A]">Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SMALL WORKFLOW SECTION                                      */}
      {/* ============================================================== */}
      <section className="py-20 sm:py-28 max-w-5xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 border-t border-b border-[#E4E7EF] py-10 sm:py-14">
          <div className="space-y-1.5">
            <span className="font-mono text-xs font-bold text-[#5146E5] uppercase tracking-wider">
              01
            </span>
            <h3 className="font-display text-lg font-bold text-[#0B1020]">
              Prepare
            </h3>
            <p className="text-xs text-[#56627A] leading-relaxed">
              Verified academic records and resume readiness.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-xs font-bold text-[#5146E5] uppercase tracking-wider">
              02
            </span>
            <h3 className="font-display text-lg font-bold text-[#0B1020]">
              Discover
            </h3>
            <p className="text-xs text-[#56627A] leading-relaxed">
              Deterministic eligibility for every campus drive.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-mono text-xs font-bold text-[#5146E5] uppercase tracking-wider">
              03
            </span>
            <h3 className="font-display text-lg font-bold text-[#0B1020]">
              Move forward
            </h3>
            <p className="text-xs text-[#56627A] leading-relaxed">
              Synchronized interview rounds and confirmed offers.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SECOND PRODUCT VISUAL SECTION                               */}
      {/* ============================================================== */}
      <section className="py-10 sm:py-16 max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1020]">
            One workspace. <br />
            Every important placement step.
          </h2>
          <p className="mt-3 text-sm text-[#56627A]">
            From application submission to confirmed offer rollout, tracked with absolute clarity.
          </p>
        </div>

        {/* Cropped Interface Visual: Refined Stage Progression */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-8 shadow-elevated">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E7EF] pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[#5146E5]">APP-1041</span>
              <span className="text-xs text-[#56627A]">·</span>
              <span className="font-display text-sm font-bold text-[#0B1020]">PixelCraft Studio</span>
              <span className="text-xs text-[#56627A]">Frontend Developer</span>
            </div>
            <Badge tone="indigo">Technical Round 1 Scheduled</Badge>
          </div>

          {/* Stage progression horizontal strip */}
          <div className="pt-6 pb-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#16886A]" />
                  <span className="text-[11px] font-bold text-[#16886A]">01 · Submitted</span>
                </div>
                <p className="text-xs font-semibold text-[#0B1020]">Resume v2.4 Attached</p>
                <p className="text-[11px] text-[#56627A]">05 Aug 2026</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#16886A]" />
                  <span className="text-[11px] font-bold text-[#16886A]">02 · Verified</span>
                </div>
                <p className="text-xs font-semibold text-[#0B1020]">TPO Criteria Cleared</p>
                <p className="text-[11px] text-[#56627A]">10 Aug 2026</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#5146E5] ring-4 ring-[#EEF0FF]" />
                  <span className="text-[11px] font-bold text-[#5146E5]">03 · Round 1</span>
                </div>
                <p className="text-xs font-semibold text-[#0B1020]">25 Aug · 11:00 AM</p>
                <p className="text-[11px] text-[#56627A]">Virtual (Google Meet)</p>
              </div>

              <div className="space-y-1 opacity-60">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                  <span className="text-[11px] font-semibold text-slate-400">04 · Decision</span>
                </div>
                <p className="text-xs font-semibold text-[#0B1020]">Offer Finalization</p>
                <p className="text-[11px] text-[#56627A]">Expected 31 Aug</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. FINAL CTA                                                   */}
      {/* ============================================================== */}
      <section className="py-16 sm:py-24 max-w-4xl mx-auto px-5 sm:px-8">
        <div className="rounded-3xl border border-[#1C2438] bg-[#0B1020] p-8 sm:p-12 text-center text-white shadow-floating relative overflow-hidden">
          <div className="relative z-10 max-w-md mx-auto space-y-4">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready for what's next?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Step into a calm, structured campus placement workspace.
            </p>
            <div className="pt-2">
              <Link to="/register">
                <Button variant="primary" className="rounded-xl px-6 py-3 text-sm font-semibold shadow-subtle">
                  Get started
                  <span className="text-white/80 ml-1" aria-hidden="true">
                    →
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. MINIMAL FOOTER                                              */}
      {/* ============================================================== */}
      <footer className="border-t border-[#E4E7EF] bg-white py-12 px-5 sm:px-8 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-[#5146E5] text-[10px] font-bold text-white">
                N
              </span>
              <span className="font-display text-base font-bold text-[#0B1020]">
                NexHire
              </span>
            </div>
            <p className="text-xs text-[#56627A]">
              A focused placement workspace for students, recruiters, and institutions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#56627A]">
            <Link to="/login" className="hover:text-[#0B1020] transition-colors">
              Sign in
            </Link>
            <span>·</span>
            <Link to="/register" className="hover:text-[#5146E5] transition-colors">
              Get started
            </Link>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-8 pt-6 border-t border-[#E4E7EF]/60 text-center text-[11px] text-[#9DA8BC]">
          © 2026 NexHire. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
