import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout.jsx";
import { PublicLayout } from "./layouts/PublicLayout.jsx";
import { LandingPage, LoginPage, RegisterPage, NotFoundPage } from "./pages/PublicPages.jsx";
import { RecruiterPage } from "./pages/RecruiterPage.jsx";
import { StudentDashboardPage } from "./pages/StudentDashboardPage.jsx";
const titles = {
  "/": "NexHire | Campus recruitment, made clearer",
  "/login": "Sign in | NexHire",
  "/register": "Create account | NexHire",
  "/student": "Student dashboard | NexHire",
  "/recruiter": "Recruiter workspace | NexHire",
};
function PageTitle() {
  const { pathname } = useLocation();
  // useEffect: handles the document title side effect for each route.
  useEffect(() => {
    document.title = titles[pathname] || "NexHire";
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <>
      <PageTitle />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<DashboardLayout />}>
          <Route path="/student" element={<StudentDashboardPage />} />
          <Route path="/recruiter" element={<RecruiterPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
