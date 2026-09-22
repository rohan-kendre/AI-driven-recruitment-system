import { Link } from "react-router-dom";
import { Button } from "../components/ui.jsx";

export { LandingPage } from "./LandingPage.jsx";
export { LoginPage, RegisterPage } from "./AuthPages.jsx";

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#5146E5]">
        Error 404
      </span>
      <h1 className="mt-2 text-6xl sm:text-7xl font-display font-extrabold tracking-tight text-[#0B1020]">
        404
      </h1>
      <p className="mt-4 text-base font-medium text-[#56627A] max-w-sm">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="mt-8">
        <Button variant="primary">Back to NexHire</Button>
      </Link>
    </div>
  );
}
