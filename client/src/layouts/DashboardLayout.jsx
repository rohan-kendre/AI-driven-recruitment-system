import { useRef, useState, useCallback } from "react";
import { Link, NavLink, Outlet, Navigate, useLocation } from "react-router-dom";
import { SearchField } from "../components/ui.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

// Refined navigation items with modern semantic outlined icons and defined routes
const navItems = [
  {
    label: "Overview",
    to: "/student",
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    label: "My Profile",
    to: "/student/profile",
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  {
    label: "Resume & ATS",
    to: "/student/resume",
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    label: "Jobs",
    to: "/student/jobs",
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
      </svg>
    ),
  },
  {
    label: "Applications",
    to: "/student/applications",
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    label: "Interviews",
    to: "/student/interviews",
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    label: "AI Mock Interview",
    to: "/student",
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    label: "Offers",
    to: "/student/offers",
    icon: (
      <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

export function DashboardLayout() {
  // useState: controls the responsive sidebar drawer.
  const [open, setOpen] = useState(false);
  const searchRef = useRef(null);
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");
  const location = useLocation();

  const handleSearchChange = useCallback(
    (event) => setSearch(event.target.value),
    [],
  );

  if (!user) return <Navigate to="/login" replace />;

  const currentSection =
    location.pathname === "/student/profile"
      ? "My Profile"
      : location.pathname === "/student/resume"
        ? "Resume & ATS"
        : location.pathname === "/student/jobs"
          ? "Jobs & Opportunities"
          : location.pathname === "/student/applications"
            ? "Applications"
            : location.pathname === "/student/interviews"
              ? "Interviews"
              : location.pathname === "/student/offers"
                ? "Offers"
                : "Overview";

  return (
    <div className="min-h-screen bg-[#F7F8FC] font-sans text-[#0B1020]">
      {/* ============================================================== */}
      {/* SIDEBAR NAVIGATION                                             */}
      {/* ============================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#1C2438] bg-[#0B1020] text-slate-300 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Area */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
          <NavLink
            to="/student"
            className="flex items-center gap-2.5"
            onClick={() => setOpen(false)}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5146E5] text-sm font-bold text-white shadow-subtle">
              N
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-white">
                NexHire
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-indigo-300">
                Student
              </span>
            </div>
          </NavLink>

          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white p-1"
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Placement Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.to === "/student/profile"
                  ? location.pathname === "/student/profile"
                  : item.to === "/student/resume"
                    ? location.pathname === "/student/resume"
                    : item.to === "/student/jobs"
                      ? location.pathname === "/student/jobs"
                      : item.to === "/student/applications"
                        ? location.pathname === "/student/applications"
                        : item.to === "/student/interviews"
                          ? location.pathname === "/student/interviews"
                          : item.to === "/student/offers"
                            ? location.pathname === "/student/offers"
                            : item.label === "Overview"
                              ? location.pathname === "/student"
                              : false;

              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => {
                    setOpen(false);
                    if (item.to === location.pathname) {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#5146E5]/20 text-white font-semibold border-l-2 border-[#5146E5]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span
                    className={`transition-colors ${
                      isActive ? "text-[#6257F5]" : "text-slate-400 group-hover:text-white"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar: User Identity & Sign Out */}
        <div className="mt-auto border-t border-white/10 p-3 bg-black/20">
          <div className="flex items-center justify-between rounded-xl p-2">
            <Link
              to="/student/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 min-w-0 hover:opacity-90 transition-opacity"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[#5146E5] text-xs font-bold text-white shadow-subtle">
                {user?.initials ?? "AK"}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">
                  {user?.name ?? "Aarav Kulkarni"}
                </p>
                <p className="truncate text-[10px] text-slate-400">
                  {user?.role ?? "STUDENT"} · B.Tech CS
                </p>
              </div>
            </Link>
            <button
              onClick={logout}
              className="ml-2 rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-rose-400 transition-colors"
              title="Sign out of demo session"
              aria-label="Sign out"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {open && (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-[#0B1020]/60 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ============================================================== */}
      {/* MAIN VIEWPORT WRAPPER                                          */}
      {/* ============================================================== */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-[#E4E7EF] bg-[#F7F8FC]/90 px-4 sm:px-8 backdrop-blur-md">
          {/* Left: Mobile trigger & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-xl border border-[#E4E7EF] bg-white text-[#0B1020] lg:hidden hover:bg-slate-50 transition-colors"
              aria-label="Open sidebar menu"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <div className="flex items-center gap-2 text-xs text-[#56627A]">
              <span>Student Workspace</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-[#0B1020]">{currentSection}</span>
            </div>
          </div>

          {/* Center: Search Field */}
          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <SearchField
              inputRef={searchRef}
              value={search}
              onChange={handleSearchChange}
              placeholder="Search applications, jobs, skills..."
            />
          </div>

          {/* Right: Quick actions and student badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => searchRef.current?.focus()}
              className="sm:hidden grid h-9 w-9 place-items-center rounded-xl border border-[#E4E7EF] bg-white text-[#56627A]"
              aria-label="Focus search input"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Notification button */}
            <button
              className="relative grid h-9 w-9 place-items-center rounded-xl border border-[#E4E7EF] bg-white text-[#56627A] hover:text-[#0B1020] hover:bg-slate-50 transition-colors"
              aria-label="Notifications"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
            </button>

            <span className="hidden sm:inline-block h-5 w-px bg-[#E4E7EF]" />

            {/* Student badge */}
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                to="/student/profile"
                className="grid h-8 w-8 place-items-center rounded-lg bg-[#EEF0FF] text-xs font-bold text-[#5146E5] hover:ring-2 hover:ring-[#5146E5]/30 transition-all"
                title="View your student profile"
              >
                {user?.initials ?? "AK"}
              </Link>
              <div className="text-left">
                <Link
                  to="/student/profile"
                  className="text-xs font-bold text-[#0B1020] leading-none hover:text-[#5146E5] transition-colors block"
                >
                  {user?.name ?? "Aarav Kulkarni"}
                </Link>
                <button
                  onClick={logout}
                  className="mt-1 text-[11px] text-[#56627A] hover:text-[#5146E5] block leading-none transition-colors"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-7 max-w-7xl w-full mx-auto">
          <Outlet context={{ globalSearch: search }} />
        </main>
      </div>
    </div>
  );
}
