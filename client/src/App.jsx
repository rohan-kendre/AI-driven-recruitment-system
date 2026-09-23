import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { DashboardLayout } from "./layouts/DashboardLayout.jsx";
import { PublicLayout } from "./layouts/PublicLayout.jsx";
import { LandingPage, LoginPage, RegisterPage, NotFoundPage } from "./pages/PublicPages.jsx";
import { RecruiterDashboardPage } from "./pages/RecruiterDashboardPage.jsx";
import { RecruiterCompanyPage } from "./pages/RecruiterCompanyPage.jsx";
import { RecruiterJobsPage } from "./pages/RecruiterJobsPage.jsx";
import { RecruiterCandidatesPage } from "./pages/RecruiterCandidatesPage.jsx";
import { RecruiterInterviewsPage } from "./pages/RecruiterInterviewsPage.jsx";
import { RecruiterOffersPage } from "./pages/RecruiterOffersPage.jsx";
import { TpoDashboardPage } from "./pages/TpoDashboardPage.jsx";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.jsx";
import { StudentDashboardPage } from "./pages/StudentDashboardPage.jsx";
import { StudentProfilePage } from "./pages/StudentProfilePage.jsx";
import { ResumeATSPage } from "./pages/ResumeATSPage.jsx";
import { StudentJobsPage } from "./pages/StudentJobsPage.jsx";
import { StudentApplicationsPage } from "./pages/StudentApplicationsPage.jsx";
import { StudentInterviewsPage } from "./pages/StudentInterviewsPage.jsx";
import { StudentOffersPage } from "./pages/StudentOffersPage.jsx";

const titles = {
  "/": "NexHire | Campus recruitment, made clearer",
  "/login": "Sign in | NexHire",
  "/register": "Create account | NexHire",
  "/student": "Student dashboard | NexHire",
  "/student/profile": "My Profile | NexHire",
  "/student/resume": "Resume & ATS | NexHire",
  "/student/jobs": "Jobs & Opportunities | NexHire",
  "/student/applications": "Applications | NexHire",
  "/student/interviews": "Interviews | NexHire",
  "/student/offers": "Offers | NexHire",
  "/recruiter": "Recruiter workspace | NexHire",
  "/recruiter/company": "Company Profile | NexHire",
  "/recruiter/jobs": "Jobs & Drives | NexHire",
  "/recruiter/candidates": "Candidates | NexHire",
  "/recruiter/applications": "Candidates & Applications | NexHire",
  "/recruiter/interviews": "Interviews | NexHire",
  "/recruiter/offers": "Offers | NexHire",
  "/tpo": "Placement Workspace | NexHire",
  "/admin": "Administration | NexHire",
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
          <Route path="/student/profile" element={<StudentProfilePage />} />
          <Route path="/student/resume" element={<ResumeATSPage />} />
          <Route path="/student/jobs" element={<StudentJobsPage />} />
          <Route path="/student/applications" element={<StudentApplicationsPage />} />
          <Route path="/student/interviews" element={<StudentInterviewsPage />} />
          <Route path="/student/offers" element={<StudentOffersPage />} />
          <Route path="/recruiter" element={<RecruiterDashboardPage />} />
          <Route path="/recruiter/company" element={<RecruiterCompanyPage />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
          <Route path="/recruiter/candidates" element={<RecruiterCandidatesPage />} />
          <Route path="/recruiter/applications" element={<RecruiterCandidatesPage />} />
          <Route path="/recruiter/interviews" element={<RecruiterInterviewsPage />} />
          <Route path="/recruiter/offers" element={<RecruiterOffersPage />} />
          <Route path="/tpo" element={<TpoDashboardPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
