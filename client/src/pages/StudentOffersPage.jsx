import { useCallback, useEffect, useState } from "react";
import { offersApi } from "../services/offersApi.js";
import { DashboardHeader, DashboardList, DashboardMessage } from "../components/LiveDashboard.jsx";

export function StudentOffersPage() {
  const [offers, setOffers] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const load = useCallback(async () => {
    const result = await offersApi.getOffers();
    setOffers(result);
    setError("");
  }, []);
  useEffect(() => { void Promise.resolve().then(load).catch((err) => setError(err.response?.data?.message || "Unable to load offers.")); }, [load]);

  async function decide(offer, status) {
    setBusyId(offer.id);
    setError("");
    try {
      await offersApi.updateOfferStatus(offer.id, status);
      await load();
      setMessage(`Offer ${status.toLowerCase()}.`);
    } catch (err) { setError(err.response?.data?.message || "Unable to update offer."); }
    finally { setBusyId(""); }
  }

  return <div className="mx-auto max-w-5xl space-y-8 pb-16">
    <DashboardHeader eyebrow="Student workspace" title="Offers" description="Review real placement offers and record your decision." />
    {error && <DashboardMessage error={error} />}
    {message && <p role="status" className="rounded-xl bg-[#E8F6F1] p-4 text-sm text-[#16886A]">{message}</p>}
    {!offers && !error ? <DashboardMessage loading /> : <DashboardList title="Your offers" items={offers || []} empty="No offers yet." renderItem={(offer) => <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="font-semibold">{offer.role} · {offer.company}</p><p className="mt-1 text-xs text-[#56627A]">{offer.compensation || "Compensation not provided"} · Joining {offer.joiningDate || "Not set"} · {offer.status}</p></div>
      {offer.status === "PENDING" && <div className="flex gap-3 text-xs font-semibold"><button disabled={busyId === offer.id} onClick={() => decide(offer, "ACCEPTED")} className="text-[#16886A]">Accept</button><button disabled={busyId === offer.id} onClick={() => decide(offer, "DECLINED")} className="text-rose-700">Decline</button></div>}
    </div>} />}
    <p className="text-xs text-[#56627A]">A downloadable PDF letter will appear when document generation is available.</p>
  </div>;
}
