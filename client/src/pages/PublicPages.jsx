import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../components/ui.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
export function LandingPage() {
  return (
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_.9fr]">
      <section>
        <p className="mb-5 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
          Campus recruitment, made clearer
        </p>
        <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
          Better placement journeys start with one calm workspace.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          NexHire connects students, colleges, and recruiters through thoughtful
          workflows and responsible AI assistance.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/student">
            <Button>View student workspace</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Create an account</Button>
          </Link>
        </div>
      </section>
      <Card className="border-indigo-100 bg-gradient-to-br from-indigo-700 to-slate-950 p-7 text-white">
        <p className="text-sm font-semibold text-indigo-200">
          One placement platform
        </p>
        <p className="mt-6 text-3xl font-semibold leading-tight">
          Know what matters. Focus on what is next.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-2xl font-bold">82</p>
            <p className="mt-1 text-sm text-indigo-100">Resume readiness</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4">
            <p className="text-2xl font-bold">4</p>
            <p className="mt-1 text-sm text-indigo-100">Active applications</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
function AccountForm({ registerMode = false }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [successMsg, setSuccessMsg] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const submit = () => {
    if (registerMode) {
      setSuccessMsg("Demo registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setSuccessMsg("Demo login successful! Redirecting to workspace...");
      login();
      setTimeout(() => navigate("/student"), 1500);
    }
  };
  
  return (
    <Card className="mx-auto mt-10 max-w-md p-7 sm:mt-16 sm:p-9">
      <p className="text-sm font-semibold text-indigo-600">
        {registerMode ? "Start your placement journey" : "Welcome back"}
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        {registerMode ? "Create your account" : "Sign in to NexHire"}
      </h1>
      <p className="mt-2 mb-6 text-sm text-slate-500">
        Mock frontend form for Experiment 3.3 demonstration.
      </p>
      
      {successMsg && (
        <div className="mb-6 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700">
          {successMsg}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit(submit)}>
        {registerMode && (
          <div>
            <Input
              label="Full Name"
              placeholder="Your name"
              {...register("name", { 
                required: "Full Name is required",
                minLength: { value: 2, message: "Name must be at least 2 characters" }
              })}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-600">{errors.name.message}</p>
            )}
          </div>
        )}
        
        <div>
          <Input
            label="College Email"
            type="email"
            placeholder="you@college.edu"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Please enter a valid email address",
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p>
          )}
        </div>
        
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            {...register("password", { 
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>
        
        {registerMode && (
          <div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value, formValues) => value === formValues.password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-rose-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}
        
        {registerMode && (
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Role
              <select
                className="focus-ring mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                {...register("role", { required: "Role is required" })}
              >
                <option value="">Select a role...</option>
                <option value="Student">Student</option>
                <option value="Recruiter">Recruiter</option>
              </select>
            </label>
            {errors.role && (
              <p className="mt-1 text-xs text-rose-600">{errors.role.message}</p>
            )}
          </div>
        )}
        
        <Button className="mt-2 w-full" type="submit">
          {registerMode ? "Create account" : "Sign in"}
        </Button>
      </form>
      
      <p className="mt-6 text-center text-sm text-slate-500">
        {registerMode ? "Already registered?" : "New to NexHire?"}{" "}
        <Link
          className="font-semibold text-indigo-600 hover:underline"
          to={registerMode ? "/login" : "/register"}
        >
          {registerMode ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </Card>
  );
}
export function LoginPage() {
  return <AccountForm />;
}
export function RegisterPage() {
  return <AccountForm registerMode />;
}

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-bold text-slate-900">404</h1>
      <p className="mt-4 text-lg font-medium text-slate-600">
        This page doesn't exist.
      </p>
      <Link to="/" className="mt-8">
        <Button>Back to NexHire</Button>
      </Link>
    </div>
  );
}
