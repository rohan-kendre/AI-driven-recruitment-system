import { useState, useMemo, useEffect } from "react";
import { FilterTabs, Toast } from "../components/ui.jsx";
import {
  adminProfile,
  overviewMetrics,
  roleDistribution,
  initialApprovals,
  initialUsers,
  systemActivity,
  auditEntries,
} from "../data/adminData.js";

export function AdminDashboardPage() {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [users, setUsers] = useState(initialUsers);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 5000);
  };

  // Keyboard escape listener for open drawers
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setSelectedApproval(null);
        setSelectedUser(null);
      }
    }
    if (selectedApproval || selectedUser) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [selectedApproval, selectedUser]);

  // Handle local approval
  const handleApprove = (id, name, role) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Approved" } : item)),
    );
    if (selectedApproval?.id === id) {
      setSelectedApproval((prev) => (prev ? { ...prev, status: "Approved" } : null));
    }
    showToast(`Account approved: ${name} granted ${role} access.`);
  };

  // Handle local rejection
  const handleReject = (id, name) => {
    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Rejected" } : item)),
    );
    if (selectedApproval?.id === id) {
      setSelectedApproval((prev) => (prev ? { ...prev, status: "Rejected" } : null));
    }
    showToast(`Account rejected: ${name} request marked as declined.`);
  };

  // Handle user status toggle
  const handleToggleUserStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "Suspended" ? "Active" : "Suspended";
          showToast(`Account status updated for ${u.name} to ${newStatus}.`);
          return { ...u, status: newStatus };
        }
        return u;
      }),
    );
    if (selectedUser?.id === userId) {
      setSelectedUser((prev) =>
        prev
          ? {
              ...prev,
              status: prev.status === "Suspended" ? "Active" : "Suspended",
            }
          : null,
      );
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesRole =
        userRoleFilter === "All" ||
        (userRoleFilter === "Students" && u.role === "Student") ||
        (userRoleFilter === "Recruiters" && u.role === "Recruiter") ||
        (userRoleFilter === "TPO" && u.role === "TPO") ||
        (userRoleFilter === "Admins" && u.role === "Admin");

      const q = userSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.organization.toLowerCase().includes(q);

      return matchesRole && matchesSearch;
    });
  }, [users, userRoleFilter, userSearchQuery]);

  const pendingApprovalsCount = approvals.filter(
    (a) => a.status === "Pending review",
  ).length;

  const getRoleBadge = (role) => {
    switch (role) {
      case "Student":
        return "bg-[#EEF0FF] text-[#5146E5] border-[#5146E5]/20";
      case "Recruiter":
        return "bg-[#F0FDF4] text-[#16886A] border-[#16886A]/20";
      case "TPO":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Admin":
        return "bg-[#0B1020] text-white border-[#0B1020]";
      default:
        return "bg-[#F7F8FC] text-[#56627A] border-[#E4E7EF]";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
      case "Approved":
        return "bg-[#F0FDF4] text-[#16886A] border-[#16886A]/20";
      case "Pending review":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Suspended":
      case "Rejected":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-[#F7F8FC] text-[#56627A] border-[#E4E7EF]";
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Toast Feedback */}
      <Toast message={feedbackToast} onClose={() => setFeedbackToast(null)} tone="success" />

      {/* ============================================================== */}
      {/* 1. HEADER                                                      */}
      {/* ============================================================== */}
      <section className="flex flex-col justify-between gap-4 border-b border-[#E4E7EF] pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
            Administration
          </span>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">
            Platform governance
          </h1>
          <p className="mt-1 text-sm text-[#56627A]">
            Manage platform access, accounts, and system activity.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-medium text-[#0B1020]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
            Operational
          </span>
          <span className="text-xs font-semibold text-[#56627A]">
            Uptime {overviewMetrics.systemUptime}
          </span>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. OVERVIEW METRICS                                            */}
      {/* ============================================================== */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-4 sm:p-5 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
            Users
          </span>
          <p className="font-display text-2xl font-bold text-[#0B1020] sm:text-3xl">
            {overviewMetrics.totalUsers}
          </p>
          <p className="text-[11px] text-[#56627A]">Registered accounts</p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-4 sm:p-5 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
            Pending approvals
          </span>
          <p className="font-display text-2xl font-bold text-[#5146E5] sm:text-3xl">
            {pendingApprovalsCount}
          </p>
          <p className="text-[11px] text-[#56627A]">Awaiting administrator review</p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-4 sm:p-5 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
            Active recruiters
          </span>
          <p className="font-display text-2xl font-bold text-[#16886A] sm:text-3xl">
            {overviewMetrics.activeRecruiters}
          </p>
          <p className="text-[11px] text-[#56627A]">Vetted corporate partners</p>
        </div>

        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-4 sm:p-5 shadow-subtle space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
            System activity
          </span>
          <p className="font-display text-2xl font-bold text-[#0B1020] sm:text-3xl">
            {overviewMetrics.systemActivityToday}
          </p>
          <p className="text-[11px] text-[#56627A]">Platform actions logged today</p>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. ACCOUNT APPROVALS (NEEDS ATTENTION)                         */}
      {/* ============================================================== */}
      <section id="approvals" className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#0B1020]">
              Account approvals
            </h2>
            <p className="text-xs text-[#56627A]">
              Requests awaiting administrative authorization and role assignment.
            </p>
          </div>
          <span className="rounded-full bg-[#5146E5]/10 px-2.5 py-0.5 text-xs font-semibold text-[#5146E5]">
            {pendingApprovalsCount} Pending
          </span>
        </div>

        <div className="divide-y divide-[#E4E7EF]">
          {approvals.map((item) => {
            const isPending = item.status === "Pending review";
            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* User & Request Info */}
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-xs text-[#0B1020]">
                      {item.name}
                    </span>
                    <span className="text-xs text-[#8F9CAE]">·</span>
                    <span className="text-xs text-[#56627A] truncate">
                      {item.email}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.2 text-[10px] font-semibold ${getRoleBadge(
                        item.role,
                      )}`}
                    >
                      {item.role}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#56627A]">
                    <span>{item.organization}</span>
                    <span className="text-[#8F9CAE]">·</span>
                    <span className="text-[#8F9CAE]">Submitted {item.submitted}</span>
                    <span className="text-[#8F9CAE]">·</span>
                    <span className="text-emerald-700 font-medium">
                      {item.verificationDocs}
                    </span>
                  </div>
                </div>

                {/* Actions & Status */}
                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  {!isPending ? (
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedApproval(item)}
                        className="rounded-xl border border-[#E4E7EF] bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1020] hover:bg-[#F7F8FC] transition-colors"
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleApprove(item.id, item.name, item.role)}
                        className="rounded-xl bg-[#0B1020] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReject(item.id, item.name)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. ROLE DISTRIBUTION (COMPACT SUMMARY)                         */}
      {/* ============================================================== */}
      <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
          <div>
            <h2 className="font-display text-base font-bold text-[#0B1020]">
              Role distribution
            </h2>
            <p className="text-xs text-[#56627A]">
              Active platform participant distribution by authorized governance level.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#56627A]">
            {overviewMetrics.totalUsers} Total Accounts
          </span>
        </div>

        {/* Multi-segment progress bar */}
        <div className="space-y-3">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#E4E7EF]">
            <div style={{ width: "78.6%" }} className="bg-[#5146E5]" title="Students 78.6%" />
            <div style={{ width: "13.7%" }} className="bg-[#16886A]" title="Recruiters 13.7%" />
            <div style={{ width: "6.9%" }} className="bg-amber-500" title="TPO Officers 6.9%" />
            <div style={{ width: "0.8%" }} className="bg-[#0B1020]" title="Admins 0.8%" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {roleDistribution.map((item) => (
              <div
                key={item.role}
                className="flex items-center justify-between rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                  <span className="font-semibold text-[#0B1020]">{item.role}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[#0B1020]">{item.count}</span>
                  <span className="text-[11px] text-[#8F9CAE] block">
                    {item.percentage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. USER MANAGEMENT (CLEAN USER LIST)                           */}
      {/* ============================================================== */}
      <section id="users" className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[#0B1020]">
              Platform users
            </h2>
            <p className="text-xs text-[#56627A]">
              Directory of students, corporate recruiters, and academic officers.
            </p>
          </div>

          {/* Role Filter Tabs */}
          <FilterTabs
            tabs={["All", "Students", "Recruiters", "TPO", "Admins"]}
            activeTab={userRoleFilter}
            onChange={setUserRoleFilter}
          />
        </div>

        {/* User Search & Summary */}
        <div className="flex items-center justify-between rounded-2xl border border-[#E4E7EF] bg-white px-4 py-3 shadow-subtle gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <svg
              className="h-4 w-4 text-[#8F9CAE]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
              placeholder="Search user name, email, department..."
              className="w-full text-xs text-[#0B1020] placeholder-[#8F9CAE] focus:outline-none"
            />
          </div>
          <span className="text-xs text-[#8F9CAE]">
            {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"} listed
          </span>
        </div>

        {/* Users Table / List */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white shadow-subtle overflow-hidden">
          <div className="border-b border-[#E4E7EF] bg-[#F7F8FC] px-6 py-3 flex items-center justify-between text-xs text-[#56627A]">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-[#8F9CAE]">
              Account Record
            </span>
            <span className="hidden sm:inline text-[#8F9CAE]">
              Click user to view governance profile
            </span>
          </div>

          <div className="divide-y divide-[#E4E7EF]">
            {filteredUsers.map((userItem) => (
              <div
                key={userItem.id}
                onClick={() => setSelectedUser(userItem)}
                className="group flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-[#F9FAFD] transition-colors cursor-pointer"
              >
                {/* User Identifiers */}
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display text-sm font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                      {userItem.name}
                    </span>
                    <span className="text-xs text-[#8F9CAE]">·</span>
                    <span className="text-xs text-[#56627A] truncate">
                      {userItem.email}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.2 text-[10px] font-semibold ${getRoleBadge(
                        userItem.role,
                      )}`}
                    >
                      {userItem.role}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#56627A]">
                    <span>{userItem.organization}</span>
                    <span className="text-[#8F9CAE]">·</span>
                    <span className="text-[#8F9CAE]">Joined {userItem.createdDate}</span>
                    <span className="text-[#8F9CAE]">·</span>
                    <span className="text-slate-600 font-medium">{userItem.details}</span>
                  </div>
                </div>

                {/* Status & Action Trigger */}
                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge(
                      userItem.status,
                    )}`}
                  >
                    {userItem.status}
                  </span>
                  <span className="text-xs font-semibold text-[#5146E5] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                    Inspect
                    <span>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. SYSTEM ACTIVITY & AUDIT LOG                                 */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Activity Feed */}
        <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B1020]">
                System activity
              </h2>
              <p className="text-xs text-[#56627A]">
                Chronological platform events and workflow progressions.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-[#16886A]">
              Live Feed
            </span>
          </div>

          <div className="space-y-3.5">
            {systemActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
                    <span className="font-semibold text-[#0B1020] truncate">
                      {act.title}
                    </span>
                  </div>
                  <p className="text-[#56627A] pl-3.5">{act.entity}</p>
                </div>
                <span className="text-[11px] text-[#8F9CAE] shrink-0">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log */}
        <div id="audit" className="rounded-2xl border border-[#E4E7EF] bg-white p-5 sm:p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-3">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B1020]">
                Audit log
              </h2>
              <p className="text-xs text-[#56627A]">
                Security checkpoints, permission elevations, and policy checks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast("Exporting security audit log snapshot...")}
              className="text-xs font-semibold text-[#5146E5] hover:underline"
            >
              Export audit log →
            </button>
          </div>

          <div className="space-y-3">
            {auditEntries.map((aud) => (
              <div
                key={aud.id}
                className="flex flex-col gap-1 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-[#0B1020]">
                    {aud.action}
                  </span>
                  <span className="text-[10px] text-[#8F9CAE]">{aud.timestamp}</span>
                </div>
                <div className="flex flex-wrap items-center justify-between text-[#56627A] text-[11px]">
                  <span>By {aud.actor}</span>
                  <span className="text-[#8F9CAE]">Target: {aud.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. SLIDE-OVER REVIEW DRAWER (APPROVALS)                        */}
      {/* ============================================================== */}
      {selectedApproval && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#0B1020]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedApproval(null)}
          />

          <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl border-l border-[#E4E7EF] overflow-y-auto">
            {/* Drawer Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E4E7EF] bg-white/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#56627A]">
                  {selectedApproval.id}
                </span>
                <span className="text-xs text-[#8F9CAE]">·</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusBadge(
                    selectedApproval.status,
                  )}`}
                >
                  {selectedApproval.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedApproval(null)}
                className="rounded-lg p-1.5 text-[#56627A] hover:bg-[#F0F2F7] hover:text-[#0B1020] transition-colors"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            {/* Applicant Summary */}
            <div className="p-6 border-b border-[#E4E7EF] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                {selectedApproval.role} Application
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0B1020]">
                {selectedApproval.name}
              </h2>
              <p className="text-xs text-[#56627A]">
                {selectedApproval.email} · {selectedApproval.organization}
              </p>
            </div>

            {/* Details Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Verification Details
                </p>
                <div className="space-y-2 text-[#0B1020]">
                  <div className="flex justify-between">
                    <span className="text-[#56627A]">Institutional Clearance:</span>
                    <span className="font-semibold">{selectedApproval.verificationDocs}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#56627A]">Requested Role:</span>
                    <span className="font-semibold">{selectedApproval.requestedRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#56627A]">Submission Time:</span>
                    <span>{selectedApproval.submitted}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Onboarding Justification
                </p>
                <p className="text-[#56627A] leading-relaxed">
                  {selectedApproval.reason}
                </p>
              </div>

              <div className="rounded-xl border border-[#16886A]/20 bg-[#F0FDF4] p-4 space-y-2 text-[#16886A]">
                <p className="text-[11px] font-bold uppercase tracking-wider">
                  Security Assessment
                </p>
                <p className="text-[11px] leading-relaxed">
                  Email domain and organizational affiliation matched with accredited institutional registry. Safe to authorize.
                </p>
              </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-[#E4E7EF] bg-white p-4">
              <button
                type="button"
                onClick={() => setSelectedApproval(null)}
                className="rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2 text-xs font-semibold text-[#56627A] hover:bg-[#F7F8FC]"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {selectedApproval.status === "Pending review" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReject(selectedApproval.id, selectedApproval.name)}
                      className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleApprove(
                          selectedApproval.id,
                          selectedApproval.name,
                          selectedApproval.role,
                        )
                      }
                      className="rounded-xl bg-[#0B1020] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                      Authorize account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 8. SLIDE-OVER USER INSPECTION DRAWER                           */}
      {/* ============================================================== */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-[#0B1020]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedUser(null)}
          />

          <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl border-l border-[#E4E7EF] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E4E7EF] bg-white/95 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#56627A]">
                  {selectedUser.id}
                </span>
                <span className="text-xs text-[#8F9CAE]">·</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getStatusBadge(
                    selectedUser.status,
                  )}`}
                >
                  {selectedUser.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-lg p-1.5 text-[#56627A] hover:bg-[#F0F2F7] hover:text-[#0B1020] transition-colors"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            {/* User Heading */}
            <div className="p-6 border-b border-[#E4E7EF] space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                {selectedUser.role} Profile
              </span>
              <h2 className="font-display text-2xl font-bold tracking-tight text-[#0B1020]">
                {selectedUser.name}
              </h2>
              <p className="text-xs text-[#56627A]">
                {selectedUser.email} · {selectedUser.organization}
              </p>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Account Governance
                </p>
                <div className="space-y-2 text-[#0B1020]">
                  <div className="flex justify-between">
                    <span className="text-[#56627A]">Joined Platform:</span>
                    <span>{selectedUser.createdDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#56627A]">Governance Scope:</span>
                    <span className="font-semibold">{selectedUser.details}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#56627A]">Auth Protocol:</span>
                    <span className="font-mono text-[11px]">SAML 2.0 / SSO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#56627A]">MFA Security:</span>
                    <span className="text-emerald-700 font-semibold">Enforced</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#E4E7EF] p-4 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#8F9CAE]">
                  Administrative Actions
                </p>
                <p className="text-xs text-[#56627A]">
                  Suspend or reinstate account access without permanently revoking record history.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleUserStatus(selectedUser.id)}
                    className={`rounded-xl border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      selectedUser.status === "Suspended"
                        ? "border-[#16886A]/20 bg-[#F0FDF4] text-[#16886A] hover:bg-emerald-100"
                        : "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                    }`}
                  >
                    {selectedUser.status === "Suspended"
                      ? "Reactivate account"
                      : "Suspend account access"}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-[#E4E7EF] bg-white p-4">
              <span className="text-[11px] text-[#8F9CAE]">
                Audited by {adminProfile.name}
              </span>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border border-[#E4E7EF] bg-white px-4 py-2 text-xs font-semibold text-[#0B1020] hover:bg-[#F7F8FC]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
