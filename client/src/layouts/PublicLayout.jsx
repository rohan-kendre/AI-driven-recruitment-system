import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "../components/ui.jsx";

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#0B1020] flex flex-col font-sans selection:bg-[#EEF0FF] selection:text-[#5146E5]">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E4E7EF]/80 bg-[#F7F8FC]/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5146E5] text-sm font-bold text-white shadow-subtle">
              N
            </span>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-[#0B1020]">
                NexHire
              </span>
              <span className="hidden rounded-full border border-[#E4E7EF] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#56627A] sm:inline-block">
                Campus
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {isHome && (
            <nav className="hidden items-center gap-8 md:flex">
              <a
                href="#overview"
                className="text-sm font-medium text-[#56627A] transition-colors hover:text-[#0B1020]"
              >
                Overview
              </a>
              <a
                href="#workflow"
                className="text-sm font-medium text-[#56627A] transition-colors hover:text-[#0B1020]"
              >
                Workflow
              </a>
              <a
                href="#showcase"
                className="text-sm font-medium text-[#56627A] transition-colors hover:text-[#0B1020]"
              >
                Platform
              </a>
              <a
                href="#perspectives"
                className="text-sm font-medium text-[#56627A] transition-colors hover:text-[#0B1020]"
              >
                Perspectives
              </a>
            </nav>
          )}

          {/* Desktop Right Actions */}
          <div className="hidden items-center gap-2.5 sm:flex">
            <Link to="/login">
              <Button variant="ghost" className="px-3.5 py-2 text-xs sm:text-sm">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" className="px-4 py-2 text-xs sm:text-sm">
                Get started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <Link to="/register">
              <Button variant="primary" className="px-3 py-1.5 text-xs">
                Get started
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="focus-ring grid h-9 w-9 place-items-center rounded-lg border border-[#E4E7EF] bg-white text-[#0B1020]"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-[#E4E7EF] bg-white px-5 py-4 sm:hidden">
            {isHome && (
              <div className="flex flex-col space-y-3 pb-4">
                <a
                  href="#overview"
                  onClick={closeMenu}
                  className="text-sm font-medium text-[#56627A] hover:text-[#0B1020]"
                >
                  Overview
                </a>
                <a
                  href="#workflow"
                  onClick={closeMenu}
                  className="text-sm font-medium text-[#56627A] hover:text-[#0B1020]"
                >
                  Workflow
                </a>
                <a
                  href="#showcase"
                  onClick={closeMenu}
                  className="text-sm font-medium text-[#56627A] hover:text-[#0B1020]"
                >
                  Platform
                </a>
                <a
                  href="#perspectives"
                  onClick={closeMenu}
                  className="text-sm font-medium text-[#56627A] hover:text-[#0B1020]"
                >
                  Perspectives
                </a>
              </div>
            )}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#E4E7EF]">
              <Link to="/login" onClick={closeMenu}>
                <Button variant="secondary" className="w-full justify-center">
                  Sign in
                </Button>
              </Link>
              <Link to="/register" onClick={closeMenu}>
                <Button variant="primary" className="w-full justify-center">
                  Get started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
