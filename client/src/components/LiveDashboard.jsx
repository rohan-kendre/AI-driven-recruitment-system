import { Link } from "react-router-dom";

export function DashboardHeader({ eyebrow, title, description }) {
  return <header className="border-b border-[#E4E7EF] pb-6">
    <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">{eyebrow}</span>
    <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-[#0B1020] sm:text-4xl">{title}</h1>
    <p className="mt-1 text-sm text-[#56627A]">{description}</p>
  </header>;
}

export function DashboardMetrics({ items }) {
  return <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {items.map(({ label, value, to }) => {
      const content = <><p className="text-xs font-semibold text-[#56627A]">{label}</p><p className="mt-2 font-display text-3xl font-extrabold text-[#0B1020]">{value ?? "—"}</p></>;
      const className = "rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-subtle";
      return to ? <Link key={label} to={to} className={`${className} transition-colors hover:border-[#5146E5]/40`}>{content}</Link> : <div key={label} className={className}>{content}</div>;
    })}
  </section>;
}

export function DashboardList({ title, items, empty, to, renderItem }) {
  return <section className="rounded-2xl border border-[#E4E7EF] bg-white p-5 shadow-subtle sm:p-6">
    <div className="flex items-center justify-between gap-3 border-b border-[#E4E7EF] pb-3">
      <h2 className="font-display text-base font-bold text-[#0B1020]">{title}</h2>
      {to && <Link to={to} className="text-xs font-semibold text-[#5146E5] hover:underline">View all →</Link>}
    </div>
    {items.length ? <div className="divide-y divide-[#E4E7EF]">{items.map((item, index) => <div key={item.id || item._id || index} className="py-3.5 text-sm text-[#0B1020]">{renderItem(item)}</div>)}</div> : <p className="py-7 text-sm text-[#56627A]">{empty}</p>}
  </section>;
}

export function DashboardMessage({ error, loading }) {
  if (loading) return <p className="p-8 text-sm text-[#56627A]">Loading dashboard…</p>;
  if (error) return <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>;
  return null;
}
