import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi } from "../services/adminApi.js";
import { DashboardHeader, DashboardList, DashboardMessage, DashboardMetrics } from "../components/LiveDashboard.jsx";

export function AdminDashboardPage() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const loadUsers = useCallback(async () => {
    const result = await adminApi.getUsers();
    setUsers(result);
    setError("");
  }, []);
  useEffect(() => { void Promise.resolve().then(loadUsers).catch((err) => setError(err.response?.data?.message || "Unable to load users.")); }, [loadUsers]);
  const filtered = useMemo(() => (users || []).filter((user) =>
    (role === "All" || user.role === role) &&
    `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
  ), [users, role, search]);
  async function changeUser(id, action) {
    setBusyId(id);
    try {
      await action();
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update the account.");
    } finally { setBusyId(""); }
  }
  if (!users) return <DashboardMessage loading={!error} error={error} />;
  return <div className="space-y-8 pb-16">
    <DashboardHeader eyebrow="Administration" title="Platform governance" description="Manage real accounts and institutional approvals." />
    {error && <DashboardMessage error={error} />}
    <DashboardMetrics items={[
      { label: "Users", value: users.length },
      { label: "Students", value: users.filter((u) => u.role === "STUDENT").length },
      { label: "Recruiters", value: users.filter((u) => u.role === "RECRUITER").length },
      { label: "Pending approvals", value: users.filter((u) => u.approvalStatus === "PENDING").length },
    ]} />
    <div className="flex flex-wrap gap-3">
      <input aria-label="Search users" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" className="rounded-xl border border-[#E4E7EF] bg-white px-3 py-2 text-sm" />
      <select aria-label="Filter role" value={role} onChange={(event) => setRole(event.target.value)} className="rounded-xl border border-[#E4E7EF] bg-white px-3 py-2 text-sm">
        {["All", "STUDENT", "RECRUITER", "TPO", "ADMIN"].map((item) => <option key={item}>{item}</option>)}
      </select>
    </div>
    <DashboardList title="Users and approvals" items={filtered} empty={users.length ? "No users match this filter." : "No users yet. New registrations will appear here."} renderItem={(user) => <div className="flex flex-wrap items-center justify-between gap-3">
      <div><p className="font-semibold">{user.name} <span className="text-xs text-[#56627A]">· {user.role}</span></p><p className="text-xs text-[#56627A]">{user.email} · {user.status} · {user.approvalStatus}</p></div>
      <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#5146E5]">
        {user.approvalStatus === "PENDING" && <><button disabled={busyId === user.id} onClick={() => changeUser(user.id, () => adminApi.updateUserApproval(user.id, "APPROVED"))}>Approve</button><button disabled={busyId === user.id} onClick={() => changeUser(user.id, () => adminApi.updateUserApproval(user.id, "REJECTED"))}>Reject</button></>}
        {user.role !== "ADMIN" && <button disabled={busyId === user.id} onClick={() => changeUser(user.id, () => adminApi.updateUserStatus(user.id, user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"))}>{user.status === "ACTIVE" ? "Suspend" : "Activate"}</button>}
      </div>
    </div>} />
    <p className="text-xs text-[#56627A]">Audit events and system uptime are unavailable until their backend endpoints exist.</p>
  </div>;
}
