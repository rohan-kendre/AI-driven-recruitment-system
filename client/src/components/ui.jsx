import { useId } from "react";

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}) {
  const styles = {
    primary:
      "bg-[#5146E5] text-white hover:bg-[#4338CA] active:scale-[0.99] shadow-subtle",
    secondary:
      "border border-[#E4E7EF] bg-white text-[#0B1020] hover:bg-[#F7F8FC] hover:border-[#D1D5E3] active:scale-[0.99]",
    ghost:
      "text-[#56627A] hover:text-[#0B1020] hover:bg-slate-100/80 active:scale-[0.99]",
    dark:
      "bg-[#0B1020] text-white hover:bg-[#1C2438] active:scale-[0.99] shadow-subtle",
    outlineDark:
      "border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 active:scale-[0.99]",
    danger:
      "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 active:scale-[0.99]",
    success:
      "border border-[#16886A]/20 bg-[#F0FDF4] text-[#16886A] hover:bg-emerald-100 active:scale-[0.99]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-4 py-2.5 text-xs sm:text-sm rounded-xl gap-2",
    lg: "px-5 py-3 text-sm rounded-xl gap-2.5",
  };

  return (
    <button
      className={`focus-ring inline-flex items-center justify-center font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${styles[variant] || styles.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    />
  );
}

export function Input({ label, id: providedId, className = "", ...props }) {
  const generatedId = useId();
  const id = providedId || generatedId;
  return (
    <label className="block text-xs font-semibold text-[#0B1020]" htmlFor={id}>
      {label && <span className="mb-1.5 block">{label}</span>}
      <input
        id={id}
        className={`focus-ring w-full rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2.5 text-sm text-[#0B1020] placeholder-[#8F9CAE] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none transition-colors ${className}`}
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
  indigo: "bg-[#EEF0FF] text-[#5146E5] border border-[#5146E5]/20",
  emerald: "bg-[#F0FDF4] text-[#16886A] border border-[#16886A]/20",
  amber: "bg-amber-50 text-amber-700 border border-amber-200",
  slate: "bg-[#F7F8FC] text-[#56627A] border border-[#E4E7EF]",
  rose: "bg-rose-50 text-rose-700 border border-rose-200",
  dark: "bg-[#0B1020] text-white border border-[#0B1020]",
};

export function Badge({ children, tone = "slate", className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone] || tones.slate} ${className}`}
    >
      {children}
    </span>
  );
}

export function SearchField({
  inputRef,
  value,
  onChange,
  placeholder = "Search opportunities...",
}) {
  return (
    <div className="relative w-full max-w-md">
      <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9DA8BC]">
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
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </span>
      <input
        ref={inputRef}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#E4E7EF] bg-white py-2 pl-9 pr-3 text-xs sm:text-sm text-[#0B1020] placeholder:text-[#9DA8BC] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none transition-colors"
      />
    </div>
  );
}

export function FilterTabs({ tabs, activeTab, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-[#E4E7EF] bg-white p-1 shadow-2xs">
      {tabs.map((tab) => {
        const label = typeof tab === "string" ? tab : tab.label;
        const value = typeof tab === "string" ? tab : tab.value;
        const count = typeof tab === "object" ? tab.count : undefined;
        const isActive = activeTab === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? "bg-[#0B1020] text-white"
                : "text-[#56627A] hover:text-[#0B1020]"
            }`}
          >
            {label}
            {count !== undefined && (
              <span
                className={`ml-1.5 text-[10px] ${
                  isActive ? "text-slate-300" : "text-[#8F9CAE]"
                }`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Toast({ message, onClose, tone = "success" }) {
  if (!message) return null;
  const toneStyles = {
    success: "border-[#16886A]/20 bg-[#F0FDF4] text-[#16886A]",
    indigo: "border-[#5146E5]/20 bg-[#EEF0FF] text-[#5146E5]",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };
  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-xs font-semibold shadow-md animate-fade-in ${toneStyles[tone] || toneStyles.success}`}
    >
      <span className="flex h-2 w-2 rounded-full bg-current" />
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 opacity-60 hover:opacity-100 cursor-pointer"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="py-12 text-center space-y-2">
      <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-[#5146E5] border-t-transparent" />
      <p className="text-xs font-medium text-[#56627A]">{label}</p>
    </div>
  );
}

export function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E4E7EF] bg-white/60 p-8 sm:p-12 text-center space-y-3">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F7F8FC] text-[#8F9CAE]">
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      </div>
      <div className="space-y-1">
        <p className="font-display text-sm font-bold text-[#0B1020]">{title}</p>
        {description && (
          <p className="text-xs text-[#56627A] max-w-sm mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 flex items-center gap-2">
      <span className="h-1.5 w-1.5 rounded-full bg-rose-600" />
      <span>{message}</span>
    </div>
  );
}
