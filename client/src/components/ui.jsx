import { useId } from "react";
export function Button({ className = "", variant = "primary", ...props }) {
  const styles = {
    primary:
      "bg-[#5146E5] text-white hover:bg-[#4338CA] active:scale-[0.99] shadow-subtle",
    secondary:
      "border border-[#E4E7EF] bg-white text-[#0B1020] hover:bg-[#F7F8FC] hover:border-[#D1D5E3] active:scale-[0.99]",
    ghost: "text-[#56627A] hover:text-[#0B1020] hover:bg-slate-100/80",
    dark: "bg-[#0B1020] text-white hover:bg-[#1C2438] active:scale-[0.99] shadow-subtle",
    outlineDark:
      "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 active:scale-[0.99]",
  };
  return (
    <button
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-150 ${styles[variant] || styles.primary} ${className}`}
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
      className={`rounded-2xl border border-[#E4E7EF] bg-white shadow-subtle ${className}`}
    >
      {children}
    </section>
  );
}
const tones = {
  indigo: "bg-[#EEF0FF] text-[#5146E5] border border-indigo-100",
  emerald: "bg-[#E8F6F1] text-[#16886A] border border-emerald-100",
  amber: "bg-amber-50 text-amber-700 border border-amber-200/60",
  slate: "bg-slate-100 text-[#56627A] border border-slate-200/80",
  rose: "bg-rose-50 text-rose-700 border border-rose-100",
};
export function Badge({ children, tone = "slate" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone] || tones.slate}`}
    >
      {children}
    </span>
  );
}
export function SearchField({ inputRef, value, onChange, placeholder = "Search opportunities" }) {
  return (
    <div className="relative w-full max-w-md">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9DA8BC]">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </span>
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E4E7EF] bg-white py-2 pl-9 pr-3 text-sm text-[#0B1020] placeholder:text-[#9DA8BC] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none transition-colors"
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
