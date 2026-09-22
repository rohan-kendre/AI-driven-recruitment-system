import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card } from "../components/ui.jsx";
import {
  atsBreakdown,
  documentPreviewData,
  improvementRecommendations,
  resumeVersions,
  standoutInsights,
  targetRoleAlignment,
} from "../data/resumeData.js";

export function ResumeATSPage() {
  const [selectedVersion, setSelectedVersion] = useState(resumeVersions[0]);
  const [expandedRecId, setExpandedRecId] = useState("rec-1");
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSelectVersion = (versionItem) => {
    setSelectedVersion(versionItem);
    showToast(`Switched view to resume version ${versionItem.version}.`);
  };

  const toggleRecommendation = (id) => {
    setExpandedRecId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#16886A]/30 bg-[#0B1020] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16886A] text-white text-[10px]">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. PAGE HEADER                                                 */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
              Resume & ATS
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="text-xs text-[#56627A]">
              Placement Application Center
            </span>
          </div>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Make your resume application-ready.
          </h1>
          <p className="mt-1 text-sm text-[#56627A] max-w-2xl leading-relaxed">
            Review your active resume, understand its ATS readiness, and focus on
            the improvements that matter most for campus placements.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="secondary"
            onClick={() => setIsPreviewModalOpen(true)}
            className="text-xs font-semibold py-2 px-3.5 rounded-xl border-[#E4E7EF] hover:border-[#5146E5] text-[#0B1020]"
          >
            <svg
              className="h-3.5 w-3.5 text-[#56627A]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            View Document
          </Button>

          <Button
            variant="primary"
            onClick={() => setIsReplaceModalOpen(true)}
            className="text-xs font-semibold py-2 px-4 rounded-xl shadow-subtle"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            Replace Resume
          </Button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PRIMARY OBJECT: ACTIVE RESUME + ATS READINESS HERO          */}
      {/* ============================================================== */}
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-stretch">
        {/* Active Resume Card */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle flex flex-col justify-between relative overflow-hidden">
          {/* Subtle top accent */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#5146E5] to-[#818CF8]" />

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Active Resume
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F6F1] px-2.5 py-0.5 text-xs font-semibold text-[#16886A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                {selectedVersion.status === "Active"
                  ? "Active for Applications"
                  : `Viewing Archived (${selectedVersion.version})`}
              </span>
            </div>

            {/* Resume File Block */}
            <div className="mt-4 flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#EEF0FF] text-[#5146E5] border border-indigo-100">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>

              <div className="min-w-0">
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0B1020] truncate">
                  {selectedVersion.fileName}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#56627A]">
                  <span>Version {selectedVersion.version}</span>
                  <span>·</span>
                  <span>Updated {selectedVersion.date}</span>
                  <span>·</span>
                  <span>{selectedVersion.fileSize} PDF</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-[#56627A] leading-relaxed">
              {selectedVersion.summary}
            </p>

            {/* Change Note */}
            <div className="mt-4 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3 text-xs text-[#56627A]">
              <span className="font-bold text-[#0B1020]">Version Note: </span>
              {selectedVersion.changeNote}
            </div>
          </div>

          {/* Quick Resume Actions */}
          <div className="mt-6 border-t border-[#E4E7EF] pt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => setIsPreviewModalOpen(true)}
                className="text-xs font-semibold py-2 px-3.5 rounded-xl border-[#E4E7EF]"
              >
                Inspect Layout
              </Button>
              <Button
                variant="ghost"
                onClick={() => setIsReplaceModalOpen(true)}
                className="text-xs font-semibold py-2 px-3 rounded-xl"
              >
                Upload Update
              </Button>
            </div>

            <Link
              to="/student/profile"
              className="text-xs font-semibold text-[#5146E5] hover:underline flex items-center gap-1"
            >
              <span>Sync with Profile</span>
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* ATS Readiness Hero Card */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                ATS Readiness Evaluation
              </span>
              <Badge tone="indigo">{selectedVersion.matchRating}</Badge>
            </div>

            {/* Score Big Display */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-display text-5xl sm:text-6xl font-extrabold tracking-tight text-[#0B1020]">
                {selectedVersion.atsScore}%
              </span>
              <div>
                <p className="text-sm font-bold text-[#0B1020]">Overall Score</p>
                <p className="text-xs text-[#56627A]">Advisory Placement Index</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2.5 w-full rounded-full bg-[#F7F8FC] border border-[#E4E7EF] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5146E5] transition-all duration-500"
                style={{ width: `${selectedVersion.atsScore}%` }}
              />
            </div>

            <p className="mt-3.5 text-xs sm:text-sm text-[#56627A] leading-relaxed">
              Your resume is structurally ready for most campus placement drives.
              Headings, technical coursework, and capstone engineering projects
              are indexed cleanly by automated parsing filters.
            </p>
          </div>

          <div className="mt-6 border-t border-[#E4E7EF] pt-4 flex items-center justify-between text-xs text-[#56627A]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
              Machine-Readable Font Layer
            </span>
            <span className="font-semibold text-[#5146E5]">
              Advisory analysis only
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SIMPLIFIED EDITORIAL RESUME PREVIEW                          */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E7EF] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg font-bold text-[#0B1020]">
                Editorial Document Preview
              </h2>
              <span className="rounded-full border border-[#E4E7EF] bg-[#F7F8FC] px-2 py-0.5 text-[10px] font-semibold text-[#56627A]">
                Single-Page Standard
              </span>
            </div>
            <p className="text-xs text-[#56627A]">
              Standardized formatting structured for recruitment ATS parsers and technical interviewers
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#5146E5] hover:text-[#4338CA] transition-colors"
            >
              <span>Expand Full Document</span>
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Simplified Document Surface */}
        <div className="mt-6 rounded-xl border border-[#E4E7EF] bg-[#FAFAFC] p-4 sm:p-8">
          <div className="mx-auto max-w-3xl rounded-xl border border-[#E4E7EF] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            {/* Document Header */}
            <div className="border-b border-[#E4E7EF] pb-4 text-center space-y-1">
              <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-[#0B1020]">
                {documentPreviewData.candidate.name}
              </h3>
              <p className="text-xs font-semibold text-[#5146E5]">
                {documentPreviewData.candidate.role}
              </p>
              <p className="text-[11px] text-[#56627A]">
                {documentPreviewData.candidate.contact}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {documentPreviewData.candidate.links}
              </p>
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0B1020] border-b border-[#E4E7EF] pb-1">
                Education
              </h4>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                <span className="font-bold text-[#0B1020]">
                  {documentPreviewData.education.institution}
                </span>
                <span className="text-[#56627A]">
                  {documentPreviewData.education.timeline}
                </span>
              </div>
              <p className="text-xs text-[#56627A]">
                {documentPreviewData.education.degree}
              </p>
              <p className="text-[11px] font-semibold text-[#16886A]">
                {documentPreviewData.education.metrics}
              </p>
            </div>

            {/* Technical Skills */}
            <div className="space-y-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0B1020] border-b border-[#E4E7EF] pb-1">
                Technical Proficiencies
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-semibold text-[#0B1020]">Languages: </span>
                  <span className="text-[#56627A]">
                    {documentPreviewData.skills.languages}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#0B1020]">Web & Cloud: </span>
                  <span className="text-[#56627A]">
                    {documentPreviewData.skills.webBackend}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#0B1020]">Tools & DBs: </span>
                  <span className="text-[#56627A]">
                    {documentPreviewData.skills.databasesTools}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-[#0B1020]">Fundamentals: </span>
                  <span className="text-[#56627A]">
                    {documentPreviewData.skills.fundamentals}
                  </span>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#0B1020] border-b border-[#E4E7EF] pb-1">
                Technical Projects
              </h4>
              {documentPreviewData.projects.map((proj) => (
                <div key={proj.title} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs">
                    <span className="font-bold text-[#0B1020]">{proj.title}</span>
                    <span className="text-[10px] font-medium text-slate-400 font-mono">
                      {proj.stack}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-[#56627A] space-y-0.5">
                    {proj.highlights.map((h, i) => (
                      <li key={i} className="leading-relaxed">
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. ATS BREAKDOWN & KEY INSIGHTS (2 COLUMNS)                    */}
      {/* ============================================================== */}
      <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-start">
        {/* Left: Detailed ATS Category Breakdown */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle space-y-5">
          <div className="border-b border-[#E4E7EF] pb-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1020]">
                ATS Category Breakdown
              </h2>
              <span className="text-xs font-semibold text-[#5146E5]">
                6 Evaluation Factors
              </span>
            </div>
            <p className="mt-0.5 text-xs text-[#56627A]">
              Understand how each section of your resume contributes to overall parsability
            </p>
          </div>

          <div className="space-y-4">
            {atsBreakdown.map((item) => (
              <div
                key={item.category}
                className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/60 p-4 transition-colors hover:bg-white"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#0B1020]">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0B1020]">
                      {item.score}%
                    </span>
                    <Badge tone={item.tone}>{item.status}</Badge>
                  </div>
                </div>

                {/* Micro Progress Bar */}
                <div className="mt-2.5 h-1.5 w-full rounded-full bg-[#E4E7EF] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.tone === "emerald"
                        ? "bg-[#16886A]"
                        : item.tone === "indigo"
                          ? "bg-[#5146E5]"
                          : "bg-amber-500"
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-[#56627A] leading-relaxed">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Key Insights ("What Stands Out") */}
        <div className="space-y-6">
          <Card className="p-6 border-[#E4E7EF]">
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3.5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                  Key Insights
                </span>
                <h3 className="font-display text-base font-bold text-[#0B1020]">
                  What Stands Out
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-[#16886A] bg-[#E8F6F1] px-2 py-0.5 rounded-full">
                Positive Signals
              </span>
            </div>

            <div className="mt-4 space-y-4">
              {standoutInsights.map((insight) => (
                <div key={insight.id} className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                    <p className="font-bold text-[#0B1020]">{insight.title}</p>
                  </div>
                  <p className="text-[#56627A] pl-3.5 leading-relaxed">
                    {insight.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-[#E4E7EF] pt-4">
              <p className="text-[11px] text-[#56627A] leading-normal">
                These signals give automated campus drive filters high confidence in
                forwarding your application to human technical reviewers.
              </p>
            </div>
          </Card>

          {/* Advisory AI Positioning Note */}
          <div className="rounded-2xl border border-indigo-100 bg-[#EEF0FF]/60 p-5 text-xs text-[#56627A] space-y-2">
            <div className="flex items-center gap-2">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-[#5146E5] text-white text-[10px] font-bold">
                i
              </span>
              <span className="font-bold text-[#0B1020]">
                Responsible Advisory Guidance
              </span>
            </div>
            <p className="leading-relaxed">
              NexHire ATS scores provide preparation guidance based on recruitment patterns. Final interview shortlisting is conducted exclusively by authorized company recruiters and placement officers.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. PRIORITIZED IMPROVEMENT RECOMMENDATIONS                     */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle space-y-5">
        <div className="border-b border-[#E4E7EF] pb-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-[#0B1020]">
              Improvement Recommendations
            </h2>
            <span className="text-xs font-semibold text-[#5146E5]">
              Prioritized by Placement Impact
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[#56627A]">
            Actionable guidance to elevate your resume from qualified to top-quartile
          </p>
        </div>

        <div className="space-y-3.5">
          {improvementRecommendations.map((rec, index) => {
            const isExpanded = expandedRecId === rec.id;
            return (
              <div
                key={rec.id}
                className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50 transition-all overflow-hidden"
              >
                {/* Header row */}
                <button
                  onClick={() => toggleRecommendation(rec.id)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-white transition-colors"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="mt-0.5 font-display text-xs font-extrabold text-slate-400">
                      0{index + 1}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-[#0B1020]">
                          {rec.title}
                        </span>
                        <Badge tone={rec.priorityTone}>{rec.priority}</Badge>
                      </div>
                      <p className="text-xs text-[#56627A] leading-relaxed">
                        {rec.summary}
                      </p>
                    </div>
                  </div>

                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-[#E4E7EF] text-slate-400 hover:text-[#0B1020] text-xs">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>

                {/* Expanded guidance body */}
                {isExpanded && (
                  <div className="border-t border-[#E4E7EF] bg-white p-4 sm:p-5 pl-10 text-xs text-[#56627A] space-y-2 animate-fade-in">
                    <p className="font-semibold text-[#0B1020]">
                      Concrete Suggestion:
                    </p>
                    <p className="leading-relaxed bg-[#F7F8FC] p-3 rounded-lg border border-[#E4E7EF] text-[#0B1020]">
                      {rec.detail}
                    </p>
                    <p className="text-[11px] text-slate-400 pt-1">
                      Focus Area: {rec.category}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. TARGET ROLE ALIGNMENT & RESUME VERSION HISTORY (2 COLUMNS)   */}
      {/* ============================================================== */}
      <section className="grid gap-8 lg:grid-cols-2 items-start">
        {/* Role Alignment */}
        <Card className="p-6 border-[#E4E7EF]">
          <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3.5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Role Alignment
              </span>
              <h3 className="font-display text-base font-bold text-[#0B1020]">
                Target: {targetRoleAlignment.role}
              </h3>
            </div>
            <Badge tone="indigo">{targetRoleAlignment.matchScore}% Match</Badge>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            <div>
              <p className="font-bold text-[#0B1020] mb-2">
                Matched Engineering Signals:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {targetRoleAlignment.matchedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-md border border-[#E4E7EF] bg-[#F7F8FC] px-2.5 py-1 text-xs font-medium text-[#0B1020]"
                  >
                    ✓ {kw}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold text-[#56627A] mb-2">
                Recommended Optional Keywords:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {targetRoleAlignment.recommendedKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-md border border-dashed border-[#D1D5E3] bg-white px-2.5 py-1 text-xs font-medium text-[#56627A]"
                  >
                    + {kw}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-[#56627A] pt-2 border-t border-[#E4E7EF] leading-relaxed">
              {targetRoleAlignment.advisoryNote}
            </p>
          </div>
        </Card>

        {/* Resume Versions History */}
        <Card className="p-6 border-[#E4E7EF]">
          <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3.5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Version History
              </span>
              <h3 className="font-display text-base font-bold text-[#0B1020]">
                Resume Iterations
              </h3>
            </div>
            <span className="text-xs text-[#56627A]">3 Versions</span>
          </div>

          <div className="mt-4 space-y-3">
            {resumeVersions.map((v) => {
              const isCurrent = selectedVersion.version === v.version;
              return (
                <div
                  key={v.version}
                  onClick={() => handleSelectVersion(v)}
                  className={`cursor-pointer rounded-xl border p-3.5 text-xs transition-all ${
                    isCurrent
                      ? "border-[#5146E5] bg-[#EEF0FF]/40 shadow-xs"
                      : "border-[#E4E7EF] bg-[#F7F8FC]/50 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-sm text-[#0B1020]">
                        {v.version}
                      </span>
                      <Badge tone={v.status === "Active" ? "emerald" : "slate"}>
                        {v.status}
                      </Badge>
                    </div>
                    <span className="font-bold text-[#5146E5]">
                      {v.atsScore}% ATS
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-[#56627A]">
                    {v.date} · {v.fileSize}
                  </p>

                  <p className="mt-1.5 text-xs text-[#56627A] line-clamp-1">
                    {v.changeNote}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-[#56627A]">
              Click any version to inspect historical layout and scores
            </span>
          </div>
        </Card>
      </section>

      {/* ============================================================== */}
      {/* 7. FULL DOCUMENT PREVIEW MODAL                                 */}
      {/* ============================================================== */}
      {isPreviewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/70 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-[#E4E7EF] bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E4E7EF] px-6 py-4">
              <div>
                <h3
                  id="preview-modal-title"
                  className="font-display text-lg font-bold text-[#0B1020]"
                >
                  {selectedVersion.fileName}
                </h3>
                <p className="text-xs text-[#56627A]">
                  Full formatted document preview · Version {selectedVersion.version}
                </p>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B1020]"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Scrollable preview body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-xs bg-[#FAFAFC]">
              <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-[#E4E7EF] shadow-subtle space-y-5">
                <div className="text-center border-b border-[#E4E7EF] pb-4 space-y-1">
                  <h4 className="font-display text-2xl font-bold text-[#0B1020]">
                    {documentPreviewData.candidate.name}
                  </h4>
                  <p className="text-xs font-semibold text-[#5146E5]">
                    {documentPreviewData.candidate.role}
                  </p>
                  <p className="text-xs text-[#56627A]">
                    {documentPreviewData.candidate.contact}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {documentPreviewData.candidate.links}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h5 className="font-bold uppercase tracking-wider text-[#0B1020] border-b border-[#E4E7EF] pb-1">
                    Education & Placement Standing
                  </h5>
                  <p className="font-bold text-[#0B1020]">
                    {documentPreviewData.education.institution}
                  </p>
                  <p className="text-[#56627A]">
                    {documentPreviewData.education.degree} (
                    {documentPreviewData.education.timeline})
                  </p>
                  <p className="text-[#16886A] font-semibold">
                    {documentPreviewData.education.metrics}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h5 className="font-bold uppercase tracking-wider text-[#0B1020] border-b border-[#E4E7EF] pb-1">
                    Technical Proficiencies
                  </h5>
                  <p>
                    <span className="font-semibold">Languages: </span>
                    <span className="text-[#56627A]">
                      {documentPreviewData.skills.languages}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Web & Backend: </span>
                    <span className="text-[#56627A]">
                      {documentPreviewData.skills.webBackend}
                    </span>
                  </p>
                  <p>
                    <span className="font-semibold">Tools & Databases: </span>
                    <span className="text-[#56627A]">
                      {documentPreviewData.skills.databasesTools}
                    </span>
                  </p>
                </div>

                <div className="space-y-3">
                  <h5 className="font-bold uppercase tracking-wider text-[#0B1020] border-b border-[#E4E7EF] pb-1">
                    Featured Projects
                  </h5>
                  {documentPreviewData.projects.map((p) => (
                    <div key={p.title} className="space-y-1">
                      <p className="font-bold text-[#0B1020]">{p.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {p.stack}
                      </p>
                      <ul className="list-disc list-inside text-xs text-[#56627A] space-y-0.5">
                        {p.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-[#E4E7EF] px-6 py-4 flex items-center justify-end bg-white">
              <Button
                variant="secondary"
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-xs font-semibold py-2 px-4 rounded-xl"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. REPLACE RESUME MODAL                                        */}
      {/* ============================================================== */}
      {isReplaceModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="replace-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/70 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-4">
              <div>
                <h3
                  id="replace-modal-title"
                  className="font-display text-lg font-bold text-[#0B1020]"
                >
                  Upload Updated Resume
                </h3>
                <p className="text-xs text-[#56627A]">
                  Replace active resume for upcoming drive applications
                </p>
              </div>
              <button
                onClick={() => setIsReplaceModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B1020]"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Dropzone UI */}
            <div className="mt-5 rounded-xl border-2 border-dashed border-[#D1D5E3] bg-[#F7F8FC] p-8 text-center hover:border-[#5146E5] hover:bg-[#EEF0FF]/20 transition-all cursor-pointer">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white shadow-subtle text-[#5146E5] border border-[#E4E7EF]">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </div>
              <p className="mt-3 text-xs font-bold text-[#0B1020]">
                Click or drag & drop updated PDF here
              </p>
              <p className="mt-1 text-[11px] text-[#56627A]">
                Supported formats: PDF (Recommended), DOCX · Max 5MB
              </p>
            </div>

            {/* Guidelines notice */}
            <div className="mt-4 rounded-xl border border-indigo-100 bg-[#EEF0FF] p-3 text-[11px] text-[#5146E5] leading-relaxed">
              <span className="font-bold">ATS Tip:</span> Ensure your file maintains a
              single-column structure and standard system fonts for accurate automated
              indexing.
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5 pt-3 border-t border-[#E4E7EF]">
              <Button
                variant="secondary"
                onClick={() => setIsReplaceModalOpen(false)}
                className="text-xs font-semibold py-2 px-4 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsReplaceModalOpen(false);
                  showToast(
                    "Resume replacement uploaded. (Demo state: Ready for future backend service)",
                  );
                }}
                className="text-xs font-semibold py-2 px-5 rounded-xl shadow-subtle"
              >
                Confirm Upload
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
