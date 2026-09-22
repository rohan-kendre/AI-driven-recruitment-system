import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Button } from "../components/ui.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

// ============================================================================
// Field Error Component
// ============================================================================
function FieldError({ error }) {
  if (!error) return null;
  return (
    <div className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600 animate-fadeIn">
      <svg
        className="h-3.5 w-3.5 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
        />
      </svg>
      <span>{error.message}</span>
    </div>
  );
}

// ============================================================================
// Shared Auth Shell (Two-column asymmetric layout)
// ============================================================================
function AuthShell({
  badgeText,
  headline,
  supportingText,
  productPreview,
  trustPoints,
  children,
}) {
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-8 sm:py-12 lg:py-16">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] xl:gap-20">
        {/* Left Column: Context, Narrative & Real Interface Fragment */}
        <div className="space-y-8">
          {/* Eyebrow & Headline */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E4E7EF] bg-white px-3 py-1 text-xs font-semibold text-[#5146E5] shadow-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
              {badgeText}
            </div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl lg:text-[2.75rem] leading-[1.12]">
              {headline}
            </h1>
            <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#56627A]">
              {supportingText}
            </p>
          </div>

          {/* Product Fragment Preview (Desktop & Tablet) */}
          <div className="hidden sm:block">{productPreview}</div>

          {/* Trust Points */}
          <div className="space-y-2.5 border-t border-[#E4E7EF] pt-6 text-xs text-[#56627A]">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-center gap-2.5">
                <div className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#E8F6F1] text-[#16886A]">
                  <svg
                    className="h-2.5 w-2.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Tactile Auth Form Card */}
        <div className="w-full max-w-lg mx-auto lg:max-w-none">
          <div className="rounded-2xl border border-[#E4E7EF] bg-white p-7 sm:p-9 shadow-elevated transition-all">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// LOGIN PAGE
// ============================================================================
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = () => {
    setIsSubmitting(true);
    setSuccessMsg("Signed in successfully. Redirecting to workspace...");
    login();
    setTimeout(() => {
      navigate("/student");
    }, 1500);
  };

  // Static product fragment for Login
  const loginPreview = (
    <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[#E4E7EF]/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#5146E5] text-xs font-bold text-white">
            AK
          </span>
          <div>
            <p className="text-xs font-bold text-[#0B1020]">Aarav Kulkarni</p>
            <p className="text-[11px] text-[#56627A]">
              B.Tech CS · CGPA 8.85
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F6F1] px-2 py-0.5 text-[10px] font-semibold text-[#16886A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
          Sprint Drive Active
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 text-xs">
        <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-2.5">
          <span className="block text-[10px] text-[#56627A]">ATS Score</span>
          <b className="font-display text-base text-[#0B1020]">82%</b>
          <span className="block text-[9px] text-[#16886A]">Strong match</span>
        </div>
        <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-2.5">
          <span className="block text-[10px] text-[#56627A]">Applications</span>
          <b className="font-display text-base text-[#0B1020]">4 Active</b>
          <span className="block text-[9px] text-[#56627A]">1 shortlisted</span>
        </div>
        <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-2.5">
          <span className="block text-[10px] text-[#56627A]">Interview</span>
          <b className="font-display text-base text-[#0B1020]">25 Aug</b>
          <span className="block text-[9px] text-[#5146E5]">Virtual panel</span>
        </div>
      </div>

      <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3 text-xs flex items-center justify-between">
        <div>
          <p className="font-semibold text-[#0B1020]">
            Acme Technologies · Software Engineer
          </p>
          <p className="text-[11px] text-[#56627A]">
            Eligibility: 100% verified criteria
          </p>
        </div>
        <Badge tone="indigo">Shortlisted</Badge>
      </div>
    </div>
  );

  return (
    <AuthShell
      badgeText="Placement Workspace"
      headline="Your placement journey, without the clutter."
      supportingText="Stay prepared, discover relevant opportunities, and keep every important application milestone in one focused workspace."
      productPreview={loginPreview}
      trustPoints={[
        "College-authenticated credentials and enrollment numbers",
        "Real-time interview alerts and direct meeting coordination",
        "Deterministic eligibility criteria with zero third-party fees",
      ]}
    >
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
          Welcome back
        </p>
        <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1020]">
          Sign in to NexHire
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#56627A]">
          Continue to your placement workspace.
        </p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#16886A]/20 bg-[#E8F6F1] p-3.5 text-xs text-[#16886A] animate-fadeIn">
          <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#16886A] text-white">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)}>
        {/* Email Field */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-[#56627A]"
            htmlFor="login-email"
          >
            College Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="you@college.edu"
            autoComplete="email"
            disabled={isSubmitting}
            className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0B1020] placeholder:text-[#9DA8BC] transition-all duration-150 ${
              errors.email
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                : "border-[#E4E7EF] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Please enter a valid email address",
              },
            })}
          />
          <FieldError error={errors.email} />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between">
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-[#56627A]"
              htmlFor="login-password"
            >
              Password
            </label>
          </div>
          <input
            id="login-password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isSubmitting}
            className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0B1020] placeholder:text-[#9DA8BC] transition-all duration-150 ${
              errors.password
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                : "border-[#E4E7EF] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <FieldError error={errors.password} />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="mt-2 w-full py-3 text-sm font-semibold shadow-elevated"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      {/* Switcher & Security Note */}
      <div className="mt-6 space-y-4 border-t border-[#E4E7EF] pt-5 text-center text-xs text-[#56627A]">
        <p>
          New to NexHire?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#5146E5] hover:text-[#4338CA] hover:underline"
          >
            Create an account
          </Link>
        </p>
        <p className="text-[11px] text-[#9DA8BC]">
          Protected by role-based access control and encrypted credentials.
        </p>
      </div>
    </AuthShell>
  );
}

// ============================================================================
// REGISTER PAGE
// ============================================================================
export function RegisterPage() {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submit = () => {
    setIsSubmitting(true);
    setSuccessMsg("Account created successfully. Redirecting to sign in...");
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  // Static product fragment for Register
  const registerPreview = (
    <div className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-subtle space-y-4">
      <div className="flex items-center justify-between border-b border-[#E4E7EF]/80 pb-3">
        <div>
          <p className="text-xs font-bold text-[#0B1020]">
            Institutional Onboarding
          </p>
          <p className="text-[11px] text-[#56627A]">
            Campus verification pipeline
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#EEF0FF] px-2 py-0.5 text-[10px] font-semibold text-[#5146E5]">
          Verified Roles
        </span>
      </div>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-start gap-3 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[#5146E5] text-[10px] font-bold text-white">
            1
          </span>
          <div>
            <b className="text-[#0B1020]">Profile & Enrollment Check</b>
            <p className="text-[11px] text-[#56627A] mt-0.5">
              Email domain and roll numbers authenticated by your institution.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[#5146E5] text-[10px] font-bold text-white">
            2
          </span>
          <div>
            <b className="text-[#0B1020]">Deterministic Eligibility</b>
            <p className="text-[11px] text-[#56627A] mt-0.5">
              CGPA, branch, and backlog criteria calculated transparently.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3">
          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[#5146E5] text-[10px] font-bold text-white">
            3
          </span>
          <div>
            <b className="text-[#0B1020]">Placement Readiness</b>
            <p className="text-[11px] text-[#56627A] mt-0.5">
              Advisory ATS resume review and practice mock interview tools.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-3 text-xs flex items-center justify-between">
        <span className="text-[11px] text-[#56627A]">
          Selection transparency:
        </span>
        <span className="font-semibold text-[#16886A]">
          100% Explainable Rules
        </span>
      </div>
    </div>
  );

  return (
    <AuthShell
      isRegister
      badgeText="Institutional Onboarding"
      headline="Start with a workspace built around your journey."
      supportingText="Create your NexHire account and bring your preparation, applications, and placement milestones into one focused place."
      productPreview={registerPreview}
      trustPoints={[
        "Dedicated roles for Students, Recruiters, TPOs & Administrators",
        "College-governed drive approvals and authenticated student data",
        "Direct communication without placement agency intermediaries",
      ]}
    >
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
          Start your placement journey
        </p>
        <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1020]">
          Create your account
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-[#56627A]">
          Set up your NexHire workspace.
        </p>
      </div>

      {/* Success banner */}
      {successMsg && (
        <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#16886A]/20 bg-[#E8F6F1] p-3.5 text-xs text-[#16886A] animate-fadeIn">
          <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#16886A] text-white">
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="3"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{successMsg}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(submit)}>
        {/* Full Name */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-[#56627A]"
            htmlFor="register-name"
          >
            Full Name
          </label>
          <input
            id="register-name"
            type="text"
            placeholder="e.g. Aarav Kulkarni"
            autoComplete="name"
            disabled={isSubmitting}
            className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0B1020] placeholder:text-[#9DA8BC] transition-all duration-150 ${
              errors.name
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                : "border-[#E4E7EF] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none"
            }`}
            {...register("name", {
              required: "Full Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
          <FieldError error={errors.name} />
        </div>

        {/* Email */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-[#56627A]"
            htmlFor="register-email"
          >
            College Email
          </label>
          <input
            id="register-email"
            type="email"
            placeholder="you@college.edu"
            autoComplete="email"
            disabled={isSubmitting}
            className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0B1020] placeholder:text-[#9DA8BC] transition-all duration-150 ${
              errors.email
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                : "border-[#E4E7EF] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none"
            }`}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Please enter a valid email address",
              },
            })}
          />
          <FieldError error={errors.email} />
        </div>

        {/* Password */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-[#56627A]"
            htmlFor="register-password"
          >
            Password
          </label>
          <input
            id="register-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isSubmitting}
            className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0B1020] placeholder:text-[#9DA8BC] transition-all duration-150 ${
              errors.password
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                : "border-[#E4E7EF] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none"
            }`}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          <FieldError error={errors.password} />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-[#56627A]"
            htmlFor="register-confirm-password"
          >
            Confirm Password
          </label>
          <input
            id="register-confirm-password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isSubmitting}
            className={`mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#0B1020] placeholder:text-[#9DA8BC] transition-all duration-150 ${
              errors.confirmPassword
                ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                : "border-[#E4E7EF] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none"
            }`}
            {...register("confirmPassword", {
              required: "Confirm Password is required",
              validate: (value, formValues) =>
                value === formValues.password || "Passwords do not match",
            })}
          />
          <FieldError error={errors.confirmPassword} />
        </div>

        {/* Role Selector */}
        <div>
          <label
            className="block text-xs font-semibold uppercase tracking-wider text-[#56627A]"
            htmlFor="register-role"
          >
            Account Role
          </label>
          <div className="relative mt-1.5">
            <select
              id="register-role"
              disabled={isSubmitting}
              className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-9 text-sm text-[#0B1020] transition-all duration-150 ${
                errors.role
                  ? "border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 focus:outline-none"
                  : "border-[#E4E7EF] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none"
              }`}
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select your role...</option>
              <option value="Student">Student (Placement Candidate)</option>
              <option value="Recruiter">Recruiter (Hiring Partner)</option>
              <option value="TPO">TPO (Training &amp; Placement Officer)</option>
              <option value="Admin">Admin (System Administrator)</option>
            </select>
            {/* Custom chevron */}
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </div>
          <FieldError error={errors.role} />
          <p className="mt-1 text-[11px] text-[#9DA8BC]">
            Your role determines your workspace tools and drive access.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="mt-3 w-full py-3 text-sm font-semibold shadow-elevated"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Switcher & Security Note */}
      <div className="mt-6 space-y-4 border-t border-[#E4E7EF] pt-5 text-center text-xs text-[#56627A]">
        <p>
          Already registered?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#5146E5] hover:text-[#4338CA] hover:underline"
          >
            Sign in
          </Link>
        </p>
        <p className="text-[11px] text-[#9DA8BC]">
          By continuing, you agree to your institution's placement governance
          guidelines.
        </p>
      </div>
    </AuthShell>
  );
}
