import { useState, useEffect } from "react";
import { Badge, Button } from "../components/ui.jsx";
import { initialCompanyProfile } from "../data/recruiterJobsData.js";

export function RecruiterCompanyPage() {
  const [profile, setProfile] = useState(initialCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Edit form state
  const [formData, setFormData] = useState({
    name: profile.name,
    tagline: profile.tagline,
    location: profile.location,
    description: profile.description,
    website: profile.website,
    headquarters: profile.headquarters,
  });

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      ...formData,
    }));
    setIsEditing(false);
    showToast("Company profile updated successfully.");
  };

  // Close modal on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setIsEditing(false);
      }
    }
    if (isEditing) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isEditing]);

  return (
    <div className="space-y-10 pb-16 max-w-5xl">
      {/* ============================================================== */}
      {/* 1. HEADER & BREADCRUMB CONTEXT                                 */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Recruiter workspace / Company
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Company Profile
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Campus hiring partner identity and institutional placement alignment.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="secondary"
            onClick={() => {
              setFormData({
                name: profile.name,
                tagline: profile.tagline,
                location: profile.location,
                description: profile.description,
                website: profile.website,
                headquarters: profile.headquarters,
              });
              setIsEditing(true);
            }}
            className="text-xs py-2 px-3.5 rounded-xl"
          >
            Edit company
          </Button>
        </div>
      </section>

      {/* Temporary Feedback Notification Banner */}
      {feedbackToast && (
        <div className="rounded-xl border border-indigo-100 bg-[#EEF0FF] p-3.5 text-xs font-medium text-[#5146E5] flex items-center justify-between transition-all duration-200">
          <span>{feedbackToast}</span>
          <button
            onClick={() => setFeedbackToast(null)}
            className="text-[#5146E5] hover:opacity-75 font-semibold text-xs ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PRIMARY SHOWCASE: COMPANY PROFILE                           */}
      {/* ============================================================== */}
      <section
        aria-labelledby="company-name-heading"
        className="rounded-2xl border border-[#E4E7EF] bg-white p-7 sm:p-10 shadow-subtle relative overflow-hidden space-y-6"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#5146E5]" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#0B1020] text-xl font-extrabold text-white shadow-subtle">
              {profile.name.charAt(0)}
            </span>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2
                  id="company-name-heading"
                  className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1020]"
                >
                  {profile.name}
                </h2>
                <Badge tone="emerald">Verified Partner</Badge>
              </div>
              <p className="text-sm font-semibold text-[#5146E5]">
                {profile.tagline}
              </p>
              <p className="text-xs text-[#56627A] flex items-center gap-1.5 pt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                Location: {profile.location}
              </p>
            </div>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="border-t border-[#E4E7EF] pt-6 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
            About the company
          </span>
          <p className="text-sm text-[#0B1020] leading-relaxed max-w-3xl">
            {profile.description}
          </p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. COMPACT PROFILE SUMMARY                                     */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Institutional Campus Partnership */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
            Academic Liaison
          </span>
          <div className="space-y-2 pt-1 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#56627A]">
                Campus Partner
              </span>
              <p className="font-semibold text-[#0B1020] text-sm mt-0.5">
                {profile.campusPartner}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#56627A]">
                Recruitment Status
              </span>
              <p className="font-medium text-[#16886A] mt-0.5">
                {profile.campusTPOStatus}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#56627A]">
                Lead Liaison
              </span>
              <p className="font-semibold text-[#0B1020] mt-0.5">
                {profile.liaison}
              </p>
            </div>
          </div>
        </div>

        {/* Operational Overview */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
            Corporate Details
          </span>
          <div className="space-y-2 pt-1 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-[#56627A]">
                Industry Domain
              </span>
              <p className="font-semibold text-[#0B1020] text-sm mt-0.5">
                {profile.industry}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#56627A]">
                Headquarters
              </span>
              <p className="font-semibold text-[#0B1020] mt-0.5">
                {profile.headquarters}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-[#56627A]">
                Team Size & Foundation
              </span>
              <p className="font-semibold text-[#0B1020] mt-0.5">
                {profile.teamSize} · Founded {profile.founded}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. EDIT COMPANY MODAL (LOCAL FRONTEND ONLY)                    */}
      {/* ============================================================== */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/50 backdrop-blur-xs transition-opacity duration-200"
        >
          <button
            onClick={() => setIsEditing(false)}
            className="absolute inset-0 cursor-default"
            aria-label="Close modal"
          />

          <form
            onSubmit={handleEditSubmit}
            className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-[#E4E7EF] shadow-2xl p-6 sm:p-7 space-y-4"
          >
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                Company Settings
              </span>
              <h3 className="mt-1 font-display text-xl font-bold text-[#0B1020]">
                Edit company profile
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Tagline
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, tagline: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs py-2 px-3.5"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="text-xs py-2 px-4"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
