import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { initialRecruiterOffers } from "../data/recruiterOffersData.js";
import { initialCandidates } from "../data/recruiterCandidatesData.js";
import { initialRecruiterJobs } from "../data/recruiterJobsData.js";

const OFFER_STATUS_TABS = ["All", "Awaiting response", "Sent", "Accepted", "Draft", "Declined"];

export function RecruiterOffersPage() {
  const [offers, setOffers] = useState(initialRecruiterOffers);
  const [selectedStatusTab, setSelectedStatusTab] = useState("All");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Form state for Create Offer modal
  const [newCandidateId, setNewCandidateId] = useState(initialCandidates[0]?.id || "");
  const [newRoleId, setNewRoleId] = useState(initialRecruiterJobs[0]?.id || "");
  const [newStipend, setNewStipend] = useState("₹45,000 / month");
  const [newCtc, setNewCtc] = useState("18.5 LPA");
  const [newJoiningDate, setNewJoiningDate] = useState("15 Jan 2027");
  const [newDeadline, setNewDeadline] = useState("10 Sep 2026");

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // Filtered offers list
  const filteredOffers = useMemo(() => {
    if (selectedStatusTab === "All") return offers;
    return offers.filter((o) => o.status === selectedStatusTab);
  }, [offers, selectedStatusTab]);

  // Status counts for tabs
  const statusCounts = useMemo(() => {
    const counts = { All: offers.length };
    OFFER_STATUS_TABS.slice(1).forEach((st) => {
      counts[st] = offers.filter((o) => o.status === st).length;
    });
    return counts;
  }, [offers]);

  // Handle local state Create Offer submit
  const handleCreateOfferSubmit = (e) => {
    e.preventDefault();
    const candidateObj = initialCandidates.find((c) => c.id === newCandidateId) || {
      name: "Selected Candidate",
      applicationId: "APP-NEW",
    };
    const jobObj = initialRecruiterJobs.find((j) => j.id === newRoleId) || {
      role: "Software Engineer Intern",
      department: "Engineering",
    };

    const newOffer = {
      id: `OFR-REC-${Date.now().toString().slice(-4)}`,
      candidateId: candidateObj.id,
      applicationId: candidateObj.applicationId || "APP-NEW",
      candidateName: candidateObj.name,
      role: jobObj.role,
      company: "Acme Technologies",
      stipend: newStipend,
      ctc: newCtc,
      status: "Draft",
      joiningDate: newJoiningDate,
      decisionDeadline: newDeadline,
      issuedDate: "Just drafted",
      department: jobObj.department || "Core Platform",
      location: "Acme Tech Park, Mumbai",
      workMode: "Hybrid",
      notes: "Newly drafted campus placement offer awaiting final internal review.",
      compensationBreakdown: [
        { label: "Internship Stipend", value: newStipend, period: "Internship phase" },
        { label: "Full-Time CTC", value: newCtc, period: "Annual base upon conversion" },
      ],
    };

    setOffers((prev) => [newOffer, ...prev]);
    setCreateModalOpen(false);
    showToast(`Draft offer created for ${candidateObj.name}. Ready for placement office review.`);
  };

  // Local state status change (e.g. Release Draft or Revoke)
  const handleUpdateStatus = (offerId, nextStatus) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: nextStatus } : o)),
    );
    if (selectedOffer && selectedOffer.id === offerId) {
      setSelectedOffer((prev) => ({ ...prev, status: nextStatus }));
    }
    showToast(`Offer status updated to ${nextStatus}.`);
  };

  // Close drawer on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedOffer(null);
        setCreateModalOpen(false);
      }
    }
    if (selectedOffer || createModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedOffer, createModalOpen]);

  // Status badge styling helper
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-[#F0FDF4] text-[#16886A] border-[#16886A]/20";
      case "Awaiting response":
      case "Sent":
        return "bg-[#5146E5]/10 text-[#5146E5] border-[#5146E5]/20";
      case "Draft":
        return "bg-[#F0F2F7] text-[#56627A] border-[#E4E7EF]";
      case "Declined":
      case "Expired":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-[#F7F8FC] text-[#56627A] border-[#E4E7EF]";
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#16886A]/20 bg-[#F0FDF4] px-4 py-3 text-xs font-semibold text-[#16886A] shadow-md animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-[#16886A]" />
          <span>{feedbackToast}</span>
          <button
            onClick={() => setFeedbackToast(null)}
            className="ml-2 text-[#16886A]/60 hover:text-[#16886A]"
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. HEADER & PRIMARY ACTION                                     */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 border-b border-[#E4E7EF] pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Recruiter workspace
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Offers
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Draft, release, and track employment offers and candidate acceptance status.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white shadow-subtle hover:bg-[#4338CA] transition-colors"
          >
            <span>+</span>
            <span>Create offer</span>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. MINIMAL STATUS TABS                                         */}
      {/* ============================================================== */}
      <section className="flex flex-wrap items-center gap-2">
        {OFFER_STATUS_TABS.map((status) => {
          const isSelected = selectedStatusTab === status;
          return (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatusTab(status)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                isSelected
                  ? "border border-[#5146E5] bg-[#5146E5]/10 text-[#5146E5]"
                  : "border border-[#E4E7EF] bg-white text-[#56627A] hover:border-[#D1D5E2] hover:text-[#0B1020]"
              }`}
            >
              <span>{status}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  isSelected
                    ? "bg-[#5146E5] text-white"
                    : "bg-[#F0F2F7] text-[#56627A]"
                }`}
              >
                {statusCounts[status] || 0}
              </span>
            </button>
          );
        })}
      </section>

      {/* ============================================================== */}
      {/* 3. CLEAN OFFERS LIST                                           */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white shadow-subtle overflow-hidden">
        <div className="border-b border-[#E4E7EF] bg-[#F7F8FC] px-6 py-3 flex items-center justify-between text-xs text-[#56627A]">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8F9CAE]">
            Active Offers · {filteredOffers.length} {filteredOffers.length === 1 ? "Record" : "Records"}
          </span>
          <span className="hidden sm:inline text-[#8F9CAE]">Click any offer to inspect details</span>
        </div>

        {filteredOffers.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm font-semibold text-[#0B1020]">No offers found</p>
            <p className="mt-1 text-xs text-[#56627A]">
              There are no offers currently marked with status "{selectedStatusTab}".
            </p>
            <button
              onClick={() => setSelectedStatusTab("All")}
              className="mt-4 text-xs font-semibold text-[#5146E5] hover:underline"
            >
              View all offers
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#E4E7EF]">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => setSelectedOffer(offer)}
                className="group relative flex flex-col gap-4 p-5 sm:p-6 sm:flex-row sm:items-center sm:justify-between hover:bg-[#F9FAFD] transition-colors cursor-pointer"
              >
                {/* Left: Candidate, Role, Compensation */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-base font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                      {offer.candidateName}
                    </span>
                    <span className="text-xs text-[#8F9CAE]">·</span>
                    <span className="text-xs font-semibold text-[#56627A]">
                      {offer.role}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#56627A]">
                    <span className="font-medium text-[#0B1020]">{offer.stipend}</span>
                    <span className="text-[#8F9CAE]">·</span>
                    <span className="font-medium text-[#0B1020]">{offer.ctc}</span>
                    <span className="text-[#8F9CAE]">·</span>
                    <span>Joining: {offer.joiningDate}</span>
                    <span className="text-[#8F9CAE]">·</span>
                    <span className="text-[#8F9CAE]">Deadline: {offer.decisionDeadline}</span>
                  </div>
                </div>

                {/* Right: Status badge & trigger */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusBadgeStyle(
                      offer.status,
                    )}`}
                  >
                    {offer.status}
                  </span>
                  <span className="text-xs font-semibold text-[#5146E5] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    View details
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 4. SLIDE-OVER OFFER DETAIL DRAWER                              */}
      {/* ============================================================== */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#0B1020]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedOffer(null)}
          />

          {/* Drawer Content */}
          <div className="relative z-10 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl border-l border-[#E4E7EF] overflow-y-auto">
            {/* Drawer Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E4E7EF] bg-white/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#56627A]">
                  {selectedOffer.applicationId}
                </span>
                <span className="text-xs text-[#8F9CAE]">·</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusBadgeStyle(
                    selectedOffer.status,
                  )}`}
                >
                  {selectedOffer.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="rounded-lg p-1.5 text-[#56627A] hover:bg-[#F0F2F7] hover:text-[#0B1020] transition-colors"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            {/* Candidate & Role Summary */}
            <div className="p-6 border-b border-[#E4E7EF] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                {selectedOffer.company} · Campus Placement Offer
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0B1020]">
                {selectedOffer.candidateName}
              </h2>
              <p className="text-xs text-[#56627A]">
                {selectedOffer.role} ({selectedOffer.department}) · {selectedOffer.workMode}
              </p>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Compensation Summary Card */}
              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Compensation Structure
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8F9CAE] block">Internship Stipend</span>
                    <span className="font-display text-base font-bold text-[#0B1020]">
                      {selectedOffer.stipend}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Full-Time Conversion CTC</span>
                    <span className="font-display text-base font-bold text-[#5146E5]">
                      {selectedOffer.ctc}
                    </span>
                  </div>
                </div>

                {selectedOffer.compensationBreakdown && (
                  <div className="pt-3 border-t border-[#E4E7EF] space-y-2">
                    {selectedOffer.compensationBreakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs text-[#56627A]"
                      >
                        <span>{item.label}</span>
                        <span className="font-semibold text-[#0B1020]">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Milestones & Dates */}
              <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Milestones & Deadlines
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[#8F9CAE] block">Expected Joining</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedOffer.joiningDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Decision Deadline</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedOffer.decisionDeadline}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Issued Date</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedOffer.issuedDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8F9CAE] block">Location</span>
                    <span className="font-semibold text-[#0B1020]">
                      {selectedOffer.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Offer Notes */}
              <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Administrative Notes
                </p>
                <p className="text-xs text-[#56627A] leading-relaxed">
                  {selectedOffer.notes}
                </p>
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EF] bg-white p-4">
              <div className="flex items-center gap-3">
                <Link
                  to="/recruiter/candidates"
                  className="text-xs font-semibold text-[#5146E5] hover:underline"
                >
                  View candidate →
                </Link>
                <Link
                  to="/recruiter/applications"
                  className="text-xs font-semibold text-[#56627A] hover:underline"
                >
                  View application →
                </Link>
              </div>

              <div className="flex items-center gap-2">
                {selectedOffer.status === "Draft" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOffer.id, "Sent")}
                    className="rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition-colors shadow-subtle"
                  >
                    Release offer
                  </button>
                )}
                {selectedOffer.status === "Sent" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOffer.id, "Awaiting response")}
                    className="rounded-xl border border-[#E4E7EF] px-3.5 py-2 text-xs font-semibold text-[#0B1020] hover:bg-[#F7F8FC]"
                  >
                    Mark awaiting response
                  </button>
                )}
                {selectedOffer.status === "Awaiting response" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOffer.id, "Accepted")}
                    className="rounded-xl bg-[#16886A] px-4 py-2 text-xs font-semibold text-white hover:bg-[#13745a] transition-colors"
                  >
                    Mark accepted
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2 text-xs font-semibold text-[#56627A] hover:bg-[#F7F8FC]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. CREATE OFFER MODAL (LOCAL STATE ONLY)                       */}
      {/* ============================================================== */}
      {createModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0B1020]/40 backdrop-blur-xs"
            onClick={() => setCreateModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-2xl space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Campus Recruitment
              </span>
              <h3 className="mt-1 font-display text-xl font-bold text-[#0B1020]">
                Draft Placement Offer
              </h3>
              <p className="mt-1 text-xs text-[#56627A]">
                Prepare an employment offer for an eligible student. Changes are saved locally.
              </p>
            </div>

            <form onSubmit={handleCreateOfferSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                    Candidate
                  </label>
                  <select
                    value={newCandidateId}
                    onChange={(e) => setNewCandidateId(e.target.value)}
                    className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none bg-white"
                  >
                    {initialCandidates.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                    Position Role
                  </label>
                  <select
                    value={newRoleId}
                    onChange={(e) => setNewRoleId(e.target.value)}
                    className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none bg-white"
                  >
                    {initialRecruiterJobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                    Monthly Stipend
                  </label>
                  <input
                    type="text"
                    required
                    value={newStipend}
                    onChange={(e) => setNewStipend(e.target.value)}
                    placeholder="e.g. ₹45,000 / month"
                    className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                    Full-Time CTC
                  </label>
                  <input
                    type="text"
                    required
                    value={newCtc}
                    onChange={(e) => setNewCtc(e.target.value)}
                    placeholder="e.g. 18.5 LPA"
                    className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                    Expected Joining Date
                  </label>
                  <input
                    type="text"
                    required
                    value={newJoiningDate}
                    onChange={(e) => setNewJoiningDate(e.target.value)}
                    placeholder="e.g. 15 Jan 2027"
                    className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0B1020] mb-1">
                    Decision Deadline
                  </label>
                  <input
                    type="text"
                    required
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. 10 Sep 2026"
                    className="w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-xs focus:border-[#5146E5] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E4E7EF]">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-[#E4E7EF] px-3.5 py-2 text-xs font-semibold text-[#56627A] hover:bg-[#F7F8FC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#5146E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition-colors shadow-subtle"
                >
                  Save draft offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
