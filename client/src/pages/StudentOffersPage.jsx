import { useState, useMemo, useRef, useCallback, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { interviewsOffersApi } from "../services/mock/interviewsOffersApi.js";

export function StudentOffersPage() {
  const { user } = useContext(AuthContext);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [decisionModal, setDecisionModal] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const documentRef = useRef(null);

  const loadOffers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      setOffers(await interviewsOffersApi.getStudentOffers(user));
    } catch (error) {
      setLoadError(error.message || "Unable to load offers. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void Promise.resolve().then(loadOffers);
  }, [loadOffers]);

  const activeOffer = useMemo(() => offers.find((o) => o.isPrimary) || offers[0] || null, [offers]);

  const handleConfirmDecision = async (offerId, newStatus) => {
    setIsSaving(true);
    try {
      await interviewsOffersApi.updateOfferStatus(offerId, newStatus);
      setDecisionModal(null);
      await loadOffers();
      setFeedbackToast(newStatus === "Accepted" ? "Offer accepted. Record updated." : "Offer declined.");
      setTimeout(() => setFeedbackToast(null), 6000);
    } catch (error) {
      setFeedbackToast(error.message || "Unable to update the offer. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const scrollToDocument = () => {
    if (documentRef.current) documentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {/* 1. HEADER */}
      <header className="border-b border-[#E4E7EF] pb-8 pt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1020]">Offers</h1>
          <p className="text-sm text-[#56627A] mt-2">
            Official placement offers, terms, and decision milestones.
          </p>
        </div>
        {activeOffer && (
          <div className="text-xs font-bold px-3 py-1 bg-[#F7F8FC] rounded flex items-center gap-2">
            {activeOffer.status === "Accepted" ? (
              <span className="text-[#16886A]">Accepted</span>
            ) : activeOffer.status === "Declined" ? (
              <span className="text-rose-700">Declined</span>
            ) : (
              <span className="text-amber-700">Pending Review</span>
            )}
          </div>
        )}
      </header>

      {feedbackToast && (
        <div className="mt-4 bg-[#0B1020] text-white text-xs font-bold py-3 px-4 flex justify-between rounded animate-fade-in">
          <span>{feedbackToast}</span>
          <button onClick={() => setFeedbackToast(null)} className="opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      {/* 2. ACTIVE OFFER */}
      {isLoading ? (
        <div className="py-20 text-center text-sm text-[#56627A]">Loading offers…</div>
      ) : loadError ? (
        <div className="py-20 text-center">
          <p className="text-sm font-bold text-[#0B1020]">Could not load offers</p>
          <p className="mt-2 text-xs text-[#56627A]">{loadError}</p>
          <button onClick={loadOffers} className="mt-4 text-xs font-bold text-[#5146E5] underline underline-offset-4">Retry</button>
        </div>
      ) : !activeOffer ? (
        <div className="py-20 text-center">
          <p className="text-sm font-bold text-[#0B1020]">No offers yet</p>
          <div className="mt-4 space-x-4">
            <Link to="/student/applications" className="text-xs text-[#5146E5] font-bold underline underline-offset-4">View applications</Link>
          </div>
        </div>
      ) : (
        <div className="mt-12 space-y-16">
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 border-b border-[#E4E7EF] pb-12">
              <div className="space-y-4">
                <div>
                  <h2 className="text-4xl font-extrabold tracking-tight text-[#0B1020]">{activeOffer.company}</h2>
                  <p className="text-lg font-medium text-[#56627A] mt-1">{activeOffer.role}</p>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm text-[#0B1020] pt-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-[#56627A]">Stipend</span>
                    <span className="font-bold">{activeOffer.monthlyCompensation}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-[#56627A]">CTC</span>
                    <span className="font-bold">{activeOffer.ctc}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-[#56627A]">Deadline</span>
                    <span className="font-bold text-amber-700">{activeOffer.decisionDeadline}</span>
                  </div>
                </div>
                <div className="flex gap-4 text-xs font-medium text-[#56627A] pt-2">
                  <span>{activeOffer.location}</span>
                  <span>|</span>
                  <span>Joining: {activeOffer.joiningDate}</span>
                </div>
              </div>

              <div className="flex flex-col items-stretch sm:items-end gap-3 shrink-0 w-full sm:w-auto">
                {activeOffer.status === "Pending review" ? (
                  <>
                    <button
                      onClick={() => setDecisionModal({ type: "accept", offerId: activeOffer.id })}
                      className="bg-[#0B1020] hover:bg-[#1C2438] text-white px-8 py-3 text-sm font-bold w-full transition-colors"
                    >
                      Accept Offer
                    </button>
                    <button
                      onClick={() => setDecisionModal({ type: "decline", offerId: activeOffer.id })}
                      className="border border-[#E4E7EF] hover:border-[#0B1020] text-[#0B1020] px-8 py-3 text-sm font-bold w-full transition-colors"
                    >
                      Decline
                    </button>
                  </>
                ) : (
                  <>
                    <div className="bg-[#F7F8FC] text-[#0B1020] px-8 py-4 text-sm font-bold text-center w-full">
                      {activeOffer.status === "Accepted" ? "Offer Accepted ✓" : "Offer Declined ✕"}
                    </div>
                  </>
                )}
                <button onClick={scrollToDocument} className="text-xs font-bold text-[#5146E5] mt-2 underline underline-offset-4">
                  Review formal letter
                </button>
              </div>
            </div>
          </section>

          {/* 3. DETAILS */}
          <section className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-sm font-bold text-[#0B1020] mb-6 border-b border-[#E4E7EF] pb-2">Compensation details</h3>
              <div className="space-y-4">
                {activeOffer.compensationBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-bold text-xs text-[#0B1020]">{item.label}</p>
                      <p className="text-[11px] text-[#56627A]">{item.note}</p>
                    </div>
                    <p className="font-mono font-bold text-xs text-[#0B1020] shrink-0">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
               <h3 className="text-sm font-bold text-[#0B1020] mb-6 border-b border-[#E4E7EF] pb-2">Benefits & provisions</h3>
               <ul className="space-y-3">
                {activeOffer.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex gap-3 text-xs text-[#0B1020] leading-relaxed">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0B1020]" />
                    {benefit}
                  </li>
                ))}
               </ul>
            </div>
          </section>

          {/* 4. DOCUMENT PREVIEW */}
          <section ref={documentRef} className="pt-8">
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-xl font-bold text-[#0B1020]">Offer letter preview</h3>
              <button onClick={() => setFeedbackToast("Document ready for download")} className="text-xs font-bold text-[#5146E5] underline underline-offset-4">
                Download PDF
              </button>
            </div>

            <div className="bg-[#FAFAFC] p-8 sm:p-16 font-sans text-sm text-[#0B1020] leading-relaxed relative">
               <div className="absolute top-0 right-0 p-8 text-right font-mono text-[10px] text-slate-400">
                  {activeOffer.documentPreview.refNumber}<br/>
                  {activeOffer.documentPreview.issueDate}
               </div>
               
               <h4 className="text-2xl font-extrabold mb-12">Acme Technologies Ltd.</h4>

               <div className="mb-12 font-bold text-xs bg-white p-6 inline-block">
                 <p className="uppercase text-[#56627A] mb-1 text-[10px]">Candidate</p>
                 <p className="text-sm">{activeOffer.documentPreview.candidateName}</p>
                 <p className="text-[#56627A]">Roll: {activeOffer.documentPreview.candidateRoll}</p>
               </div>

               <p className="font-bold uppercase tracking-wider text-xs mb-8">Subject: Letter of Intent & Formal Placement Offer</p>
               
               <div className="space-y-6">
                 {activeOffer.documentPreview.paragraphs.map((p, idx) => <p key={idx}>{p}</p>)}
               </div>

               <div className="mt-16 pt-8 border-t border-[#E4E7EF] flex justify-between items-end">
                 <div>
                   <p className="font-bold">{activeOffer.documentPreview.signatory}</p>
                   <p className="text-xs text-[#56627A]">{activeOffer.documentPreview.signatoryRole}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[#16886A] font-bold text-xs">✓ TPO Verified Signature</p>
                 </div>
               </div>
            </div>
          </section>
        </div>
      )}

      {/* 5. MODAL */}
      {decisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/40 backdrop-blur-sm animate-fade-in">
          <button className="absolute inset-0 w-full h-full cursor-default" onClick={() => setDecisionModal(null)} />
          <div className="relative bg-white w-full max-w-md p-8 shadow-2xl animate-scale-in">
            <h3 className={`text-xl font-bold mb-4 ${decisionModal.type === 'accept' ? 'text-[#0B1020]' : 'text-rose-700'}`}>
              {decisionModal.type === "accept" ? "Accept Offer?" : "Decline Offer?"}
            </h3>
            <p className="text-sm text-[#56627A] mb-8 leading-relaxed">
              {decisionModal.type === "accept" 
                ? "Accepting this offer confirms your employment commitment and concludes your on-campus placement drive per Somaiya TPO regulations." 
                : "Declining will release this position to the next eligible candidate per institutional policy."}
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDecisionModal(null)} className="flex-1 py-3 text-xs font-bold border border-[#E4E7EF] hover:border-[#0B1020]">
                Cancel
              </button>
              <button 
                onClick={() => handleConfirmDecision(decisionModal.offerId, decisionModal.type === "accept" ? "Accepted" : "Declined")}
                disabled={isSaving}
                className={`flex-1 py-3 text-xs font-bold text-white ${decisionModal.type === 'accept' ? 'bg-[#0B1020] hover:bg-[#1C2438]' : 'bg-rose-700 hover:bg-rose-800'}`}
              >
                {isSaving ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
