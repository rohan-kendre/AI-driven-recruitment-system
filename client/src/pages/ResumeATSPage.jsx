import { useState } from "react";
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

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded border border-[#16886A]/30 bg-[#0B1020] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16886A] text-white text-[10px]">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. PAGE HEADER */}
      <header className="border-b border-[#E4E7EF] pb-8 pt-4">
        <h1 className="text-3xl font-bold text-[#0B1020]">Resume & ATS</h1>
        <p className="text-sm text-[#56627A] mt-2">
          Manage your resume and understand how it performs against campus opportunities.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-16 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-16 min-w-0">
          
          {/* 2. CURRENT RESUME */}
          <section>
            <h2 className="text-xs font-bold text-[#56627A] uppercase tracking-wider mb-6">
              Current Resume
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-start gap-5">
              <div className="hidden sm:flex mt-1 shrink-0">
                <svg
                  className="h-8 w-8 text-[#0B1020]"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1020] truncate">
                  {selectedVersion.fileName}
                </h3>
                <p className="text-sm text-[#56627A] mt-1.5">
                  {selectedVersion.status === "Active" ? "Active" : "Archived"} · Version {selectedVersion.version} · Updated {selectedVersion.date} · {selectedVersion.fileSize}
                </p>
                <div className="mt-5 flex items-center gap-5">
                  <button
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="text-sm font-medium text-[#0B1020] hover:text-[#5146E5] underline underline-offset-4 transition-colors"
                  >
                    View resume
                  </button>
                  <button
                    onClick={() => setIsReplaceModalOpen(true)}
                    className="text-sm font-medium text-[#0B1020] hover:text-[#5146E5] underline underline-offset-4 transition-colors"
                  >
                    Upload new version
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* 3. ATS READINESS */}
          <section className="pt-12 border-t border-[#E4E7EF]">
            <h2 className="text-xs font-bold text-[#56627A] uppercase tracking-wider mb-8">
              ATS Readiness
            </h2>
            
            <div className="mb-10">
              <div className="flex items-end justify-between mb-3">
                <span className="text-4xl font-bold text-[#0B1020]">{selectedVersion.atsScore}%</span>
              </div>
              <div className="h-0.5 w-full bg-[#E4E7EF] overflow-hidden">
                <div
                  className="h-full bg-[#0B1020] transition-all duration-700"
                  style={{ width: `${selectedVersion.atsScore}%` }}
                />
              </div>
              <p className="text-sm text-[#56627A] mt-4">
                Matched against active campus opportunities. {selectedVersion.matchRating}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
              {atsBreakdown.map((item) => (
                <div key={item.category} className="flex justify-between items-center py-2 border-b border-[#F7F8FC]">
                  <span className="text-sm text-[#56627A]">{item.category}</span>
                  <span className="text-sm font-medium text-[#0B1020]">{item.status}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <h3 className="text-sm font-bold text-[#0B1020] mb-4">What Stands Out</h3>
              <ul className="space-y-3">
                {standoutInsights.map((insight) => (
                  <li key={insight.id} className="text-sm">
                    <span className="font-medium text-[#0B1020]">{insight.title}: </span>
                    <span className="text-[#56627A]">{insight.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-[#E4E7EF] pt-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#56627A] mb-5">
                Target Alignment: {targetRoleAlignment.role}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-medium text-[#0B1020] mb-2">Matched Signals</p>
                  <p className="text-sm text-[#56627A] leading-relaxed">
                    {targetRoleAlignment.matchedKeywords.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0B1020] mb-2">Recommended Additions</p>
                  <p className="text-sm text-[#56627A] leading-relaxed">
                    {targetRoleAlignment.recommendedKeywords.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 4. IMPROVEMENT SUGGESTIONS */}
          <section className="pt-12 border-t border-[#E4E7EF]">
            <h2 className="text-xs font-bold text-[#56627A] uppercase tracking-wider mb-8">
              Recommended Improvements
            </h2>
            <div className="space-y-6">
              {improvementRecommendations.map((rec, index) => (
                <div key={rec.id} className="flex gap-5">
                  <span className="text-sm font-bold text-slate-300 pt-0.5">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#0B1020]">{rec.title}</p>
                    <p className="text-sm text-[#56627A] mt-1.5 leading-relaxed">{rec.summary} {rec.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <aside className="space-y-12">
          {/* Resume History */}
          <div>
            <h2 className="text-xs font-bold text-[#0B1020] uppercase tracking-wider mb-5">
              Resume History
            </h2>
            <div className="space-y-1">
              {resumeVersions.map((v) => {
                const isCurrent = selectedVersion.version === v.version;
                return (
                  <div
                    key={v.version}
                    onClick={() => handleSelectVersion(v)}
                    className={`flex items-center justify-between cursor-pointer group py-2.5 px-3 -mx-3 rounded transition-colors ${
                      isCurrent ? "bg-[#F7F8FC]" : "hover:bg-[#F7F8FC]"
                    }`}
                  >
                    <div>
                      <p className={`text-sm ${isCurrent ? "font-bold text-[#0B1020]" : "font-medium text-[#56627A] group-hover:text-[#0B1020]"}`}>
                        {v.version}
                        {v.status === "Active" && (
                          <span className="ml-2 text-[10px] font-semibold text-[#0B1020] uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-[#56627A]">{v.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Advisory */}
          <div className="pt-8 border-t border-[#E4E7EF]">
            <p className="text-xs font-bold text-[#0B1020] mb-2">AI-assisted analysis</p>
            <p className="text-xs text-[#56627A] leading-relaxed">
              ATS scores provide preparation guidance based on recruitment patterns. Final interview shortlisting is conducted exclusively by authorized company recruiters.
            </p>
          </div>
        </aside>
      </div>

      {/* 5. REPLACE RESUME MODAL */}
      {isReplaceModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/40 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-md bg-white p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#0B1020]">Replace current resume</h3>
              <button
                onClick={() => setIsReplaceModalOpen(false)}
                className="text-slate-400 hover:text-[#0B1020] text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="border border-[#E4E7EF] bg-[#FAFAFC] p-10 text-center cursor-pointer hover:border-[#0B1020] transition-colors">
              <p className="text-sm font-medium text-[#0B1020]">Upload PDF or DOCX</p>
              <p className="text-xs text-[#56627A] mt-2">Max 5MB</p>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsReplaceModalOpen(false)}
                className="text-sm font-medium text-[#56627A] hover:text-[#0B1020] px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsReplaceModalOpen(false);
                  showToast("Resume replacement uploaded. (Demo state)");
                }}
                className="text-sm font-medium bg-[#0B1020] text-white px-5 py-2 hover:bg-[#1C2438] transition-colors"
              >
                Choose file
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. FULL DOCUMENT PREVIEW MODAL */}
      {isPreviewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/60 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-8 py-5 border-b border-[#E4E7EF] bg-white">
              <h3 className="text-base font-bold text-[#0B1020] truncate">
                {selectedVersion.fileName}
              </h3>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-slate-400 hover:text-[#0B1020] text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 sm:p-12 bg-[#F7F8FC]">
              {/* Document Surface */}
              <div className="max-w-2xl mx-auto bg-white p-10 sm:p-14 shadow-sm border border-[#E4E7EF] min-h-[800px] text-[13px] text-[#0B1020]">
                {/* Header */}
                <div className="text-center pb-6 border-b border-[#0B1020]">
                  <h4 className="text-3xl font-bold uppercase tracking-wide">
                    {documentPreviewData.candidate.name}
                  </h4>
                  <p className="mt-2 text-sm">
                    {documentPreviewData.candidate.contact} | {documentPreviewData.candidate.links}
                  </p>
                </div>

                {/* Education */}
                <div className="mt-6">
                  <h5 className="font-bold uppercase tracking-widest border-b border-[#E4E7EF] pb-1 mb-3 text-xs">
                    Education
                  </h5>
                  <div className="flex justify-between items-baseline font-bold">
                    <span>{documentPreviewData.education.institution}</span>
                    <span className="text-xs font-normal text-[#56627A]">
                      {documentPreviewData.education.timeline}
                    </span>
                  </div>
                  <p className="mt-1">{documentPreviewData.education.degree}</p>
                  <p className="mt-1">{documentPreviewData.education.metrics}</p>
                </div>

                {/* Skills */}
                <div className="mt-6">
                  <h5 className="font-bold uppercase tracking-widest border-b border-[#E4E7EF] pb-1 mb-3 text-xs">
                    Technical Skills
                  </h5>
                  <div className="space-y-1.5 leading-relaxed">
                    <p>
                      <span className="font-bold">Languages:</span> {documentPreviewData.skills.languages}
                    </p>
                    <p>
                      <span className="font-bold">Web & Cloud:</span> {documentPreviewData.skills.webBackend}
                    </p>
                    <p>
                      <span className="font-bold">Tools & DBs:</span> {documentPreviewData.skills.databasesTools}
                    </p>
                  </div>
                </div>

                {/* Projects */}
                <div className="mt-6">
                  <h5 className="font-bold uppercase tracking-widest border-b border-[#E4E7EF] pb-1 mb-3 text-xs">
                    Projects
                  </h5>
                  <div className="space-y-5">
                    {documentPreviewData.projects.map((p) => (
                      <div key={p.title}>
                        <div className="flex justify-between items-baseline font-bold">
                          <span>{p.title}</span>
                        </div>
                        <p className="italic text-xs text-[#56627A] mt-0.5">
                          {p.stack}
                        </p>
                        <ul className="list-disc list-outside ml-4 mt-2 space-y-1 text-[#0B1020] leading-relaxed">
                          {p.highlights.map((h, i) => (
                            <li key={i}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
