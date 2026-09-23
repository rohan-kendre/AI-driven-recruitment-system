import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Badge, Button } from "../components/ui.jsx";
import { initialOffers } from "../data/offersData.js";

export function StudentOffersPage() {
  const [offers, setOffers] = useState(initialOffers);
  const [decisionModal, setDecisionModal] = useState(null); // { type: 'accept' | 'decline', offerId: string } | null
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [documentExpanded, setDocumentExpanded] = useState(false);
  const documentRef = useRef(null);

  // Active primary offer (the dominant hero of the page)
  const activeOffer = useMemo(() => {
    return offers.find((o) => o.isPrimary) || offers[0] || null;
  }, [offers]);

  // Handle local state decision (Accept / Decline)
  const handleConfirmDecision = (offerId, newStatus) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId ? { ...offer, status: newStatus } : offer,
      ),
    );
    setDecisionModal(null);
    setFeedbackToast(
      newStatus === "Accepted"
        ? "Offer accepted. Your institutional placement record has been updated."
        : "Offer declined. The seat has been marked for release per placement policy.",
    );
    setTimeout(() => setFeedbackToast(null), 6000);
  };

  const handleResetDecision = (offerId) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId ? { ...offer, status: "Pending review" } : offer,
      ),
    );
    setFeedbackToast("Offer status reset to Pending review (local preview).");
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  const scrollToDocument = () => {
    if (documentRef.current) {
      documentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSimulatedDownload = () => {
    setFeedbackToast("Offer letter document ready. Printed copy sent to your institutional email.");
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* ============================================================== */}
      {/* 1. HEADER & BREADCRUMB CONTEXT                                 */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-[#E4E7EF] pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Student workspace / Offers
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Offers
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Official placement offers, terms, and decision milestones.
          </p>
        </div>

        {activeOffer && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
              Somaiya TPO Verified
            </span>
            <Badge
              tone={
                activeOffer.status === "Accepted"
                  ? "emerald"
                  : activeOffer.status === "Declined"
                    ? "rose"
                    : "amber"
              }
            >
              {activeOffer.status}
            </Badge>
          </div>
        )}
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
      {/* 2. ACTIVE OFFER (THE DOMINANT HERO ELEMENT)                     */}
      {/* ============================================================== */}
      {!activeOffer ? (
        /* Minimal Empty State */
        <section className="rounded-2xl border border-[#E4E7EF] bg-white p-12 text-center space-y-4 shadow-subtle">
          <h2 className="font-display text-lg font-bold text-[#0B1020]">
            No offers yet
          </h2>
          <p className="text-xs text-[#56627A] max-w-sm mx-auto leading-relaxed">
            Your offers will appear here when an application reaches the offer stage.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link to="/student/applications">
              <Button variant="primary" className="text-xs">
                View applications
              </Button>
            </Link>
            <Link to="/student/jobs">
              <Button variant="secondary" className="text-xs">
                Browse jobs
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        <div className="space-y-10">
          {/* Active Offer Primary Card */}
          <section
            aria-labelledby="active-offer-heading"
            className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-9 shadow-subtle relative overflow-hidden"
          >
            {/* Top Accent Indicator */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${
                activeOffer.status === "Accepted"
                  ? "bg-[#16886A]"
                  : activeOffer.status === "Declined"
                    ? "bg-rose-500"
                    : "bg-[#5146E5]"
              }`}
            />

            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              {/* Left Column: Essential Offer Typography */}
              <div className="space-y-5 max-w-2xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                      Offer received
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-[#56627A]">
                      Issued {activeOffer.offerDate}
                    </span>
                  </div>
                  <h2
                    id="active-offer-heading"
                    className="mt-2 font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1020]"
                  >
                    {activeOffer.company}
                  </h2>
                  <p className="mt-1 text-base sm:text-lg font-semibold text-[#56627A]">
                    {activeOffer.role}
                  </p>
                </div>

                {/* Compensation & Decision Deadline Summary */}
                <div className="flex flex-wrap items-baseline gap-4 sm:gap-6 pt-1">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                      Internship Stipend
                    </span>
                    <p className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B1020]">
                      {activeOffer.monthlyCompensation}
                    </p>
                  </div>

                  <div className="h-8 w-px bg-[#E4E7EF] hidden sm:block" />

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                      Full-Time CTC
                    </span>
                    <p className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#0B1020]">
                      {activeOffer.ctc}
                    </p>
                  </div>

                  <div className="h-8 w-px bg-[#E4E7EF] hidden sm:block" />

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                      Decision Required By
                    </span>
                    <p className="font-display text-base sm:text-lg font-bold tracking-tight text-[#0B1020] flex items-center gap-1.5 mt-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      {activeOffer.decisionDeadline}
                    </p>
                  </div>
                </div>

                {/* Location, Mode & Joining Date */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[#56627A] pt-1">
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#0B1020]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                    {activeOffer.location}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span>Joining: {activeOffer.joiningDate}</span>
                  <span className="text-slate-300">·</span>
                  <span>{activeOffer.duration}</span>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
                <Button
                  variant="primary"
                  onClick={scrollToDocument}
                  className="rounded-xl px-5 py-2.5 text-xs font-semibold shadow-subtle justify-center"
                >
                  Review offer letter
                </Button>

                <Link
                  to="/student/applications"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl px-5 py-2.5 text-xs font-semibold justify-center"
                  >
                    View application
                  </Button>
                </Link>

                {activeOffer.status !== "Pending review" && (
                  <button
                    onClick={() => handleResetDecision(activeOffer.id)}
                    className="text-[11px] text-[#56627A] hover:text-[#5146E5] transition-colors pt-1 text-center lg:text-right"
                  >
                    Reset decision (preview mode)
                  </button>
                )}
              </div>
            </div>

            {/* Decision Bar / Confirmation State */}
            <div className="mt-8 pt-6 border-t border-[#E4E7EF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F8FC]/50 -mx-6 sm:-mx-9 -mb-6 sm:-mb-9 p-6 sm:p-9">
              {activeOffer.status === "Pending review" ? (
                <>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-[#0B1020]">
                      Decision pending student review
                    </p>
                    <p className="text-[11px] text-[#56627A]">
                      Review the institutional offer terms below before recording your decision.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setDecisionModal({ type: "decline", offerId: activeOffer.id })
                      }
                      className="rounded-xl px-4 py-2 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 hover:border-rose-200"
                    >
                      Decline offer
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() =>
                        setDecisionModal({ type: "accept", offerId: activeOffer.id })
                      }
                      className="rounded-xl px-5 py-2 text-xs font-semibold bg-[#16886A] hover:bg-[#13765c]"
                    >
                      Accept offer
                    </Button>
                  </div>
                </>
              ) : activeOffer.status === "Accepted" ? (
                <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-[#16886A] text-white text-xs font-bold">
                      ✓
                    </span>
                    <div>
                      <p className="font-bold text-[#0B1020]">
                        Offer accepted on {activeOffer.offerDate}
                      </p>
                      <p className="text-[11px] text-[#56627A]">
                        Your placement acceptance is confirmed with Somaiya TPO and Acme Technologies.
                      </p>
                    </div>
                  </div>
                  <Badge tone="emerald">Accepted</Badge>
                </div>
              ) : (
                <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                      ✕
                    </span>
                    <div>
                      <p className="font-bold text-[#0B1020]">
                        Offer declined
                      </p>
                      <p className="text-[11px] text-[#56627A]">
                        This offer was declined and the position released to eligible campus candidates.
                      </p>
                    </div>
                  </div>
                  <Badge tone="rose">Declined</Badge>
                </div>
              )}
            </div>
          </section>

          {/* ============================================================== */}
          {/* 3. ESSENTIAL OFFER DETAILS & COMPENSATION BREAKDOWN            */}
          {/* ============================================================== */}
          <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr] items-start">
            {/* Left: Essential Terms & Context Connections */}
            <div className="space-y-6">
              {/* Compensation Breakdown Card */}
              <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle space-y-4">
                <div className="border-b border-[#E4E7EF] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                    Financial Structure
                  </span>
                  <h3 className="font-display text-sm font-bold text-[#0B1020] mt-0.5">
                    Compensation details
                  </h3>
                </div>

                <div className="divide-y divide-[#E4E7EF]">
                  {activeOffer.compensationBreakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="py-3 flex items-start justify-between gap-4 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-[#0B1020]">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-[#56627A]">
                          {item.note}
                        </p>
                      </div>
                      <p className="font-mono font-bold text-[#0B1020] text-right shrink-0">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subtle Application & Interview Connections */}
              <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle space-y-4">
                <div className="border-b border-[#E4E7EF] pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                    Context & Progression
                  </span>
                  <h3 className="font-display text-sm font-bold text-[#0B1020] mt-0.5">
                    Placement origins
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Application Connection */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#56627A]">
                        Linked Application
                      </span>
                      <p className="font-mono font-bold text-[#0B1020] mt-0.5">
                        {activeOffer.applicationId}
                      </p>
                    </div>
                    <Link
                      to="/student/applications"
                      className="text-xs font-semibold text-[#5146E5] hover:underline"
                    >
                      View application →
                    </Link>
                  </div>

                  {/* Interview Connection */}
                  <div className="flex items-center justify-between p-3 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#56627A]">
                        Interview Completed
                      </span>
                      <p className="font-semibold text-[#0B1020] mt-0.5">
                        {activeOffer.interviewConnection.summary}
                      </p>
                      <p className="text-[11px] text-[#56627A]">
                        Completed on {activeOffer.interviewConnection.completedDate}
                      </p>
                    </div>
                    <Link
                      to="/student/interviews"
                      className="text-xs font-semibold text-[#5146E5] hover:underline shrink-0 ml-4"
                    >
                      View interview →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Benefits & Allowances */}
            <div className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle space-y-4">
              <div className="border-b border-[#E4E7EF] pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Comprehensive Provisions
                </span>
                <h3 className="font-display text-sm font-bold text-[#0B1020] mt-0.5">
                  Benefits & allowances
                </h3>
              </div>

              <div className="space-y-3">
                {activeOffer.benefits.map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/40 text-xs text-[#0B1020]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5] mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-indigo-100 bg-[#EEF0FF]/40 p-3.5 text-xs text-[#56627A] leading-relaxed">
                Institutional placement rules require students with active offers to confirm their acceptance prior to participating in further dream company drives.
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* 4. POLISHED OFFER LETTER DOCUMENT PREVIEW                       */}
          {/* ============================================================== */}
          <section ref={documentRef} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                  Official document
                </span>
                <h2 className="font-display text-xl font-bold tracking-tight text-[#0B1020]">
                  Offer letter preview
                </h2>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <Button
                  variant="secondary"
                  onClick={() => setDocumentExpanded((prev) => !prev)}
                  className="text-xs py-1.5 px-3 rounded-lg"
                >
                  {documentExpanded ? "Collapse document" : "Expand document"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSimulatedDownload}
                  className="text-xs py-1.5 px-3 rounded-lg"
                >
                  Download letter
                </Button>
              </div>
            </div>

            {/* The Document Sheet */}
            <div className="rounded-2xl border border-[#E4E7EF] bg-white p-7 sm:p-11 shadow-subtle space-y-8 font-sans">
              {/* Document Header */}
              <div className="border-b border-[#E4E7EF] pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded bg-[#0B1020] text-xs font-extrabold text-white">
                      A
                    </span>
                    <span className="font-display text-base font-extrabold tracking-tight text-[#0B1020]">
                      Acme Technologies Ltd.
                    </span>
                  </div>
                  <p className="text-[11px] text-[#56627A] mt-1">
                    Mumbai Technology Center · Campus Recruitment Division
                  </p>
                </div>

                <div className="text-right sm:text-right">
                  <span className="font-mono text-xs font-bold text-[#5146E5]">
                    {activeOffer.documentPreview.refNumber}
                  </span>
                  <p className="text-[11px] text-[#56627A]">
                    {activeOffer.documentPreview.issueDate}
                  </p>
                </div>
              </div>

              {/* Candidate Info Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-[#F7F8FC] border border-[#E4E7EF] text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Candidate
                  </span>
                  <p className="font-bold text-[#0B1020] text-sm mt-0.5">
                    {activeOffer.documentPreview.candidateName}
                  </p>
                  <p className="text-[11px] text-[#56627A]">
                    Roll: {activeOffer.documentPreview.candidateRoll}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#56627A]">
                    Academic Institution
                  </span>
                  <p className="font-bold text-[#0B1020] text-sm mt-0.5">
                    {activeOffer.documentPreview.institution}
                  </p>
                  <p className="text-[11px] text-[#56627A]">
                    {activeOffer.documentPreview.degree}
                  </p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#56627A]">
                  Subject: Letter of Intent & Formal Placement Offer — {activeOffer.role}
                </p>
              </div>

              {/* Letter Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm text-[#0B1020] leading-relaxed">
                {activeOffer.documentPreview.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}

                {documentExpanded && (
                  <>
                    <div className="pt-2 space-y-3">
                      <p className="font-semibold text-xs text-[#0B1020]">
                        Standard Institutional Terms & Conditions:
                      </p>
                      <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#56627A]">
                        <li>
                          The offer is subject to satisfactory verification of university credentials, academic transcripts, and background validation.
                        </li>
                        <li>
                          The internship stipend of ₹45,000 / month will be credited on the final working day of each calendar month.
                        </li>
                        <li>
                          Intellectual property developed during the course of the internship remains the sole proprietary asset of Acme Technologies Ltd.
                        </li>
                        <li>
                          This offer remains valid until 31 August 2026. Non-acceptance prior to this deadline will result in automatic expiration.
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Document Sign-off & Verification Seal */}
              <div className="border-t border-[#E4E7EF] pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                  <p className="font-display font-bold text-sm text-[#0B1020]">
                    {activeOffer.documentPreview.signatory}
                  </p>
                  <p className="text-xs text-[#56627A]">
                    {activeOffer.documentPreview.signatoryRole}
                  </p>
                  <p className="text-[11px] text-[#56627A]">
                    Acme Technologies Ltd.
                  </p>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-100 bg-[#E8F6F1]/50 text-xs text-[#16886A] self-start sm:self-auto">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#16886A] text-white text-[10px] font-bold">
                    ✓
                  </span>
                  <div>
                    <p className="font-bold">Somaiya TPO Digital Seal</p>
                    <p className="text-[10px] text-[#16886A]/80">
                      Tier 1 Campus Placement Verified
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. DECISION CONSEQUENCE CONFIRMATION MODAL                      */}
      {/* ============================================================== */}
      {decisionModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="decision-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/50 backdrop-blur-xs transition-opacity duration-200"
        >
          {/* Backdrop button */}
          <button
            onClick={() => setDecisionModal(null)}
            className="absolute inset-0 cursor-default"
            aria-label="Close modal"
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[#E4E7EF] shadow-2xl p-6 space-y-4">
            <div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  decisionModal.type === "accept"
                    ? "text-[#16886A]"
                    : "text-rose-600"
                }`}
              >
                {decisionModal.type === "accept"
                  ? "Confirm Acceptance"
                  : "Confirm Decline"}
              </span>
              <h3
                id="decision-modal-title"
                className="mt-1 font-display text-xl font-bold text-[#0B1020]"
              >
                {decisionModal.type === "accept"
                  ? "Accept placement offer from Acme Technologies?"
                  : "Decline placement offer from Acme Technologies?"}
              </h3>
            </div>

            <p className="text-xs text-[#56627A] leading-relaxed">
              {decisionModal.type === "accept"
                ? "Accepting this offer confirms your employment commitment with Acme Technologies and concludes your on-campus placement drive per Somaiya TPO regulations. Your student profile will be marked as Placed."
                : "Declining will decline this placement offer and release the position to the next eligible candidate in the Somaiya placement pool per institutional policy."}
            </p>

            <div className="p-3 rounded-xl border border-slate-200 bg-[#F7F8FC] text-xs text-[#0B1020] space-y-1">
              <p className="font-semibold">Role: Software Engineer Intern</p>
              <p className="text-[#56627A]">Compensation: ₹45,000 / month · 18.5 LPA CTC</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setDecisionModal(null)}
                className="text-xs py-2 px-3.5"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() =>
                  handleConfirmDecision(
                    decisionModal.offerId,
                    decisionModal.type === "accept" ? "Accepted" : "Declined",
                  )
                }
                className={`text-xs py-2 px-4 ${
                  decisionModal.type === "accept"
                    ? "bg-[#16886A] hover:bg-[#13765c]"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {decisionModal.type === "accept"
                  ? "Confirm & Accept"
                  : "Confirm & Decline"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
