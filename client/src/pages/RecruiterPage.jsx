import { Card } from "../components/ui.jsx";
export function RecruiterPage() {
  return (
    <div className="py-16 text-center">
      <Card className="mx-auto max-w-xl p-8">
        <p className="text-sm font-semibold text-indigo-600">
          Recruiter workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold">Foundation route ready</h1>
        <p className="mt-3 text-slate-500">
          Recruiter jobs and applicant workflows begin in later phases.
        </p>
      </Card>
    </div>
  );
}
