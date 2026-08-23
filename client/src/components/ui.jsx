import { useId } from "react";
export function Button({ className = "", variant = "primary", ...props }) {
  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
  };
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
export function Input({ label, id: providedId, ...props }) {
  // useId: creates accessible input IDs.
  const generatedId = useId();
  const id = providedId || generatedId;
  return (
    <label className="block text-sm font-medium text-slate-700" htmlFor={id}>
      {label && <span className="mb-1.5 block">{label}</span>}
      <input
        id={id}
        className="focus-ring w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
        {...props}
      />
    </label>
  );
}
export function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-slate-200/80 bg-white shadow-soft ${className}`}
    >
      {children}
    </section>
  );
}
const tones = {
  indigo: "bg-indigo-50 text-indigo-700",
  emerald: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-600",
};
export function Badge({ children, tone = "slate" }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
export function SearchField({ inputRef, value, onChange }) {
  return (
    <div className="relative w-full max-w-md">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
        ⌕
      </span>
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        placeholder="Search opportunities"
        className="focus-ring w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm placeholder:text-slate-400"
      />
    </div>
  );
}
export function LoadingState({ label = "Loading..." }) {
  return <p className="py-10 text-center text-sm text-slate-500">{label}</p>;
}
export function EmptyState({ title, description }) {
  return (
    <div className="py-10 text-center">
      <p className="font-semibold">{title}</p>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
export function ErrorState({ message }) {
  return (
    <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{message}</p>
  );
}
