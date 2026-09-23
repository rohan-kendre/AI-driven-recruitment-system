import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "../components/ui.jsx";

export function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAuth = location.pathname === "/login" || location.pathname === "/register";
  const isLogin = location.pathname === "/login";

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-[#0B1020] flex flex-col font-sans selection:bg-[#EEF0FF] selection:text-[#5146E5]">
      {/* On homepage, the floating navigation is rendered directly inside the immersive hero */}
      {!isHome && (
        <header className="sticky top-0 z-50 w-full border-b border-[#E4E7EF]/80 bg-[#F7F8FC]/85 backdrop-blur-md transition-all">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link
              to="/"
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

            {isAuth ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="text-xs sm:text-sm font-medium text-[#56627A] hover:text-[#0B1020] transition-colors flex items-center gap-1"
                >
                  <span>←</span> Back to website
                </Link>
                <span className="h-4 w-px bg-[#E4E7EF] hidden sm:inline-block" />
                {isLogin ? (
                  <div className="flex items-center gap-2">
                    <span className="hidden md:inline text-xs text-[#56627A]">
                      New here?
                    </span>
                    <Link to="/register">
                      <Button
                        variant="secondary"
                        className="px-3.5 py-1.5 text-xs sm:text-sm"
                      >
                        Create account
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="hidden md:inline text-xs text-[#56627A]">
                      Registered?
                    </span>
                    <Link to="/login">
                      <Button
                        variant="secondary"
                        className="px-3.5 py-1.5 text-xs sm:text-sm"
                      >
                        Sign in
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
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
            )}
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
