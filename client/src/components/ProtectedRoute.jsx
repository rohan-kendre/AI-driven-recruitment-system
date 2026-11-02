import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

export function ProtectedRoute({ allowedRoles = null }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FC]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#5146E5] border-t-transparent" />
          <p className="text-xs font-semibold text-[#56627A]">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const roleRoutes = {
      STUDENT: "/student",
      RECRUITER: "/recruiter",
      TPO: "/tpo",
      ADMIN: "/admin",
    };
    const fallback = roleRoutes[user.role] || "/student";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
