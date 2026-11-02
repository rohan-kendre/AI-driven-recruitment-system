import { useEffect, useState } from "react";
import { studentApi } from "../services/studentApi.js";
import { useAuth } from "../hooks/useAuth.jsx";
import { DashboardHeader, DashboardMessage } from "../components/LiveDashboard.jsx";

const emptyProfile = { rollNumber: "", branch: "", cgpa: "", backlogs: 0, graduationYear: "", phone: "", bio: "", skills: "" };

export function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyProfile);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    studentApi.getProfile().then((data) => { if (active) setProfile(data); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load profile."); });
    return () => { active = false; };
  }, []);

  function edit() {
    setForm({ ...emptyProfile, ...profile, skills: (profile?.skills || []).join(", "), cgpa: profile?.cgpa ?? "", graduationYear: profile?.graduationYear ?? "" });
    setEditing(true);
    setError("");
    setMessage("");
  }

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const updated = await studentApi.updateProfile({ ...form, cgpa: Number(form.cgpa), backlogs: Number(form.backlogs), graduationYear: Number(form.graduationYear), skills: form.skills.split(",").map((skill) => skill.trim()).filter(Boolean) });
      setProfile(updated);
      setEditing(false);
      setMessage("Profile saved.");
    } catch (err) { setError(err.response?.data?.message || "Unable to save profile."); }
    finally { setSaving(false); }
  }

  if (!profile && !error) return <DashboardMessage loading />;
  return <div className="mx-auto max-w-5xl space-y-8 pb-16">
    <DashboardHeader eyebrow="Student workspace" title="My profile" description="Your academic and contact information for eligibility checks." />
    {error && <DashboardMessage error={error} />}
    {message && <p role="status" className="rounded-xl bg-[#E8F6F1] p-4 text-sm text-[#16886A]">{message}</p>}
    <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E7EF] pb-4">
        <div><h2 className="font-display text-xl font-bold text-[#0B1020]">{user?.name}</h2><p className="text-sm text-[#56627A]">{user?.email}</p></div>
        {!editing && <button onClick={edit} className="rounded-xl bg-[#0B1020] px-4 py-2 text-sm font-semibold text-white">{profile?.branch ? "Edit profile" : "Complete profile"}</button>}
      </div>
      {editing ? <form onSubmit={save} className="grid gap-5 pt-5 sm:grid-cols-2">
        {[
          ["rollNumber", "Roll number", "text"], ["branch", "Branch", "text"],
          ["cgpa", "CGPA (0–10)", "number"], ["backlogs", "Backlogs", "number"],
          ["graduationYear", "Graduation year", "number"], ["phone", "Phone", "tel"],
          ["skills", "Skills (comma separated)", "text"],
        ].map(([key, label, type]) => <label key={key} className="text-xs font-semibold text-[#56627A]">{label}<input type={type} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} required={["branch", "cgpa", "graduationYear"].includes(key)} min={key === "cgpa" || key === "backlogs" ? 0 : key === "graduationYear" ? 2020 : undefined} max={key === "cgpa" ? 10 : key === "graduationYear" ? 2035 : undefined} step={key === "cgpa" ? "0.01" : undefined} className="mt-1 block w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-sm text-[#0B1020]" /></label>)}
        <label className="text-xs font-semibold text-[#56627A] sm:col-span-2">Bio<textarea value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} className="mt-1 block w-full rounded-xl border border-[#E4E7EF] px-3 py-2 text-sm text-[#0B1020]" /></label>
        <div className="flex gap-3 sm:col-span-2"><button disabled={saving} type="submit" className="rounded-xl bg-[#0B1020] px-4 py-2 text-sm font-semibold text-white">{saving ? "Saving…" : "Save profile"}</button><button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-[#E4E7EF] px-4 py-2 text-sm">Cancel</button></div>
      </form> : profile?.branch ? <dl className="grid gap-5 pt-5 text-sm sm:grid-cols-2">
        {[["Branch", profile.branch], ["CGPA", profile.cgpa], ["Backlogs", profile.backlogs], ["Graduation year", profile.graduationYear], ["Roll number", profile.rollNumber], ["Phone", profile.phone], ["Skills", (profile.skills || []).join(", ")], ["Bio", profile.bio]].map(([label, value]) => <div key={label}><dt className="text-xs text-[#56627A]">{label}</dt><dd className="mt-1 font-medium text-[#0B1020]">{value || "Not provided"}</dd></div>)}
      </dl> : <p className="pt-5 text-sm text-[#56627A]">No academic profile yet. Complete it before applying for jobs.</p>}
    </section>
  </div>;
}
