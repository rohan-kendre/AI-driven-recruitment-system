import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card } from "../components/ui.jsx";
import { useAuth } from "../hooks/useAuth.jsx";

// Initial profile data grounded in the NexHire student domain
const initialProfile = {
  name: "Aarav Kulkarni",
  roleTag: "Final Year Undergraduate",
  degree: "B.Tech Computer Engineering",
  college: "K. J. Somaiya School of Engineering",
  location: "Mumbai, Maharashtra",
  email: "aarav.kulkarni@somaiya.edu",
  phone: "+91 98201 23456",
  rollNumber: "ROLL-2022-CS-154",
  batch: "2022 – 2026",
  graduationYear: "May 2026",
  currentSemester: "Semester VII",
  cgpa: "8.85",
  cgpaScale: "10.00",
  backlogs: 0,
  placementStatus: "Registered & Verified for Campus Drives",
  bio: "Final-year Computer Engineering undergraduate with deep interest in distributed systems, asynchronous job queues, and robust web applications. Actively seeking Software Development Engineer (SDE) campus placement opportunities.",
};

const initialSkills = {
  core: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Database Management (DBMS)",
    "Operating Systems",
    "Computer Networks",
  ],
  technologies: [
    "React.js",
    "Node.js",
    "TypeScript",
    "Tailwind CSS",
    "MongoDB",
    "REST APIs",
    "Redis",
    "Python",
  ],
};

const initialProjects = [
  {
    id: "proj-1",
    title: "NexHire Placement Management Portal",
    category: "Full-Stack Web Architecture",
    description:
      "End-to-end campus recruitment system featuring role-based workflows for students, recruiters, and placement officers. Includes automated application tracking, interview scheduling, and eligibility compliance gates.",
    techStack: ["React.js", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    status: "Cap-Stone Project · Sem VII",
    linkText: "View Repository",
  },
  {
    id: "proj-2",
    title: "Distributed Asynchronous Task Queue Engine",
    category: "Systems & Backend Engineering",
    description:
      "High-throughput background worker queue implemented in Node.js using Redis for message buffering, supporting exponential backoff retries, priority queues, and dead-letter queue recovery telemetry.",
    techStack: ["Node.js", "Redis", "Worker Threads", "Docker"],
    status: "Independent Systems Project",
    linkText: "View Documentation",
  },
  {
    id: "proj-3",
    title: "Campus Alumni Mentorship & Advisory Network",
    category: "Collaborative Platform",
    description:
      "Web portal connecting graduating engineering seniors with verified college alumni for placement prep, resume feedback, and mock interview guidance with real-time slot booking.",
    techStack: ["React.js", "REST APIs", "PostgreSQL", "Tailwind CSS"],
    status: "College Hackathon Finalist",
    linkText: "View Live Demo",
  },
];

export function StudentProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(initialProfile);
  const [skills, setSkills] = useState(initialSkills);
  const [projects] = useState(initialProjects);

  // Modal and edit form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [toastMessage, setToastMessage] = useState(null);

  // New skill inline input state
  const [newSkillText, setNewSkillText] = useState("");
  const [skillCategory, setSkillCategory] = useState("technologies");

  // Accessible IDs for edit modal
  const nameId = useId();
  const phoneId = useId();
  const locationId = useId();
  const bioId = useId();

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEditModal = () => {
    setFormData(profile);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(formData);
    setIsEditModalOpen(false);
    showToast("Profile details updated successfully.");
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillText.trim();
    if (!trimmed) return;

    if (skills[skillCategory].includes(trimmed)) {
      showToast(`"${trimmed}" is already in your skills list.`);
      return;
    }

    setSkills((prev) => ({
      ...prev,
      [skillCategory]: [...prev[skillCategory], trimmed],
    }));
    setNewSkillText("");
    showToast(`Added "${trimmed}" to your skills.`);
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    setSkills((prev) => ({
      ...prev,
      [category]: prev[category].filter((s) => s !== skillToRemove),
    }));
    showToast(`Removed "${skillToRemove}".`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#16886A]/30 bg-[#0B1020] px-4 py-3 text-xs font-semibold text-white shadow-xl animate-fade-in"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16886A] text-white text-[10px]">
            ✓
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. PROFILE HEADER / IDENTITY BLOCK                             */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-8 shadow-subtle">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Identity Group */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Monogram Badge */}
            <div className="relative">
              <div className="grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-2xl bg-[#0B1020] text-2xl sm:text-3xl font-bold tracking-tight text-white shadow-md border-2 border-white ring-4 ring-[#EEF0FF]">
                {user?.initials || "AK"}
              </div>
              <span
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#16886A] text-white ring-2 ring-white"
                title="Institutional Identity Verified"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
            </div>

            {/* Student Name & Meta */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0B1020]">
                  {profile.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-100 bg-[#EEF0FF] px-2.5 py-0.5 text-xs font-semibold text-[#5146E5]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#5146E5]" />
                  Active Placement Candidate
                </span>
              </div>

              <p className="text-sm font-semibold text-[#56627A]">
                {profile.degree} · Class of {profile.graduationYear.split(" ")[1]}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#56627A]">
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                  </svg>
                  {profile.college}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {profile.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  PRN: {profile.rollNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Actions & Verification Stamp */}
          <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
            <Button
              variant="secondary"
              onClick={handleOpenEditModal}
              className="text-xs font-semibold py-2 px-3.5 rounded-xl border-[#E4E7EF] hover:border-[#5146E5] text-[#0B1020]"
            >
              <svg className="h-3.5 w-3.5 text-[#56627A]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              Edit Profile Details
            </Button>

            <Link
              to="/student"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B1020] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1C2438] transition-colors shadow-subtle"
            >
              <span>Back to Workspace</span>
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bio / Summary Quote */}
        {profile.bio && (
          <div className="mt-6 border-t border-[#E4E7EF] pt-4">
            <p className="text-xs sm:text-sm text-[#56627A] leading-relaxed max-w-4xl">
              <span className="font-semibold text-[#0B1020] mr-1.5">Candidate Summary:</span>
              {profile.bio}
            </p>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 2. MAIN GRID: PROFILE CONTENT (LEFT) + READINESS (RIGHT)        */}
      {/* ============================================================== */}
      <div className="grid gap-8 lg:grid-cols-[1.9fr_1fr] items-start">
        {/* Left Column: Academic, Personal, Skills, Projects */}
        <div className="space-y-8 min-w-0">
          {/* A. Profile Readiness & Checklist Bar */}
          <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Placement Readiness Assessment
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#0B1020]">
                    86%
                  </span>
                  <span className="text-xs font-semibold text-[#56627A]">
                    Profile Completeness · Verified by TPO
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge tone="emerald">Drive Ready</Badge>
                <Badge tone="indigo">Tier-1 Qualified</Badge>
              </div>
            </div>

            {/* Progress Track */}
            <div className="mt-3.5 h-2 w-full rounded-full bg-[#F7F8FC] border border-[#E4E7EF] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5146E5] transition-all duration-500"
                style={{ width: "86%" }}
              />
            </div>

            {/* Completion Breakdown Checklist */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2 pt-2 border-t border-[#E4E7EF]/80">
              {/* Completed items */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#16886A]">
                  ✓ Verified & Complete
                </p>
                <ul className="space-y-1.5 text-xs text-[#0B1020]">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                    <span>Personal identity & college credentials</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                    <span>Official semester transcripts (CGPA 8.85)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                    <span>Core computer science skill profile</span>
                  </li>
                </ul>
              </div>

              {/* Needs Attention items */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  ⚠ Recommended Enhancements
                </p>
                <ul className="space-y-1.5 text-xs text-[#56627A]">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Active Resume v2.4 (1 advisory suggestion)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>Attach live demo links to Capstone projects</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* B. Academic Information Section */}
          <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle">
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0B1020]">
                  Academic Information & Performance
                </h2>
                <p className="text-xs text-[#56627A]">
                  Official department records synced with Somaiya Placement Cell
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#16886A] bg-[#E8F6F1] px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                Sem 1–6 Verified
              </span>
            </div>

            {/* Academic KPI Cards */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* CGPA */}
              <div className="rounded-xl border border-indigo-100 bg-[#EEF0FF]/60 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5146E5]">
                  Cumulative GPA
                </span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-black text-[#0B1020]">
                  {profile.cgpa}
                  <span className="text-xs font-semibold text-[#56627A]"> / 10.0</span>
                </p>
                <p className="mt-1 text-[11px] font-medium text-[#5146E5]">
                  Top 5% of Department
                </p>
              </div>

              {/* Branch */}
              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#56627A]">
                  Branch & Stream
                </span>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-[#0B1020] leading-tight">
                  Computer Engg.
                </p>
                <p className="mt-1 text-[11px] text-[#56627A]">
                  {profile.currentSemester}
                </p>
              </div>

              {/* Graduation Batch */}
              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC] p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#56627A]">
                  Graduation Year
                </span>
                <p className="mt-1 font-display text-base sm:text-lg font-bold text-[#0B1020]">
                  {profile.graduationYear.split(" ")[1]}
                </p>
                <p className="mt-1 text-[11px] text-[#56627A]">
                  Batch {profile.batch}
                </p>
              </div>

              {/* Active Backlogs */}
              <div className="rounded-xl border border-emerald-100 bg-[#E8F6F1]/50 p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#16886A]">
                  Active Backlogs
                </span>
                <p className="mt-1 font-display text-2xl sm:text-3xl font-black text-[#0B1020]">
                  {profile.backlogs}
                </p>
                <p className="mt-1 text-[11px] font-medium text-[#16886A]">
                  Clean Academic Record
                </p>
              </div>
            </div>

            {/* Detailed Academic Meta Table */}
            <div className="mt-6 border-t border-[#E4E7EF] pt-4">
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                <div className="flex justify-between border-b border-[#F7F8FC] py-1.5">
                  <dt className="text-[#56627A]">Institution</dt>
                  <dd className="font-semibold text-[#0B1020] text-right">{profile.college}</dd>
                </div>
                <div className="flex justify-between border-b border-[#F7F8FC] py-1.5">
                  <dt className="text-[#56627A]">Degree Program</dt>
                  <dd className="font-semibold text-[#0B1020] text-right">{profile.degree}</dd>
                </div>
                <div className="flex justify-between border-b border-[#F7F8FC] py-1.5">
                  <dt className="text-[#56627A]">Department Division</dt>
                  <dd className="font-semibold text-[#0B1020] text-right">Computer Engineering — Div A</dd>
                </div>
                <div className="flex justify-between border-b border-[#F7F8FC] py-1.5">
                  <dt className="text-[#56627A]">Academic Standing</dt>
                  <dd className="font-semibold text-[#16886A] text-right">First Class with Distinction</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* C. Personal & Institutional Information */}
          <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle">
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0B1020]">
                  Personal & Placement Credentials
                </h2>
                <p className="text-xs text-[#56627A]">
                  Information shared with participating campus recruitment partners
                </p>
              </div>
              <button
                onClick={handleOpenEditModal}
                className="text-xs font-semibold text-[#5146E5] hover:text-[#4338CA] transition-colors"
              >
                Edit Details →
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/60 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                  Full Legal Name
                </span>
                <p className="mt-1 text-sm font-bold text-[#0B1020]">{profile.name}</p>
                <p className="text-[11px] text-[#56627A]">As registered in University records</p>
              </div>

              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/60 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                  Institutional College Email
                </span>
                <p className="mt-1 text-sm font-bold text-[#0B1020] truncate">{profile.email}</p>
                <p className="text-[11px] text-[#16886A]">Verified Domain Address</p>
              </div>

              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/60 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                  Contact Phone Number
                </span>
                <p className="mt-1 text-sm font-bold text-[#0B1020]">{profile.phone}</p>
                <p className="text-[11px] text-[#56627A]">SMS & WhatsApp enabled</p>
              </div>

              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/60 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                  Current Location
                </span>
                <p className="mt-1 text-sm font-bold text-[#0B1020]">{profile.location}</p>
                <p className="text-[11px] text-[#56627A]">Open to Relocation / Hybrid</p>
              </div>

              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/60 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                  University Roll / PRN
                </span>
                <p className="mt-1 text-sm font-bold text-[#0B1020]">{profile.rollNumber}</p>
                <p className="text-[11px] text-[#56627A]">Enrolled Academic Year 2022</p>
              </div>

              <div className="rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/60 p-3.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#56627A]">
                  Placement Drive Status
                </span>
                <p className="mt-1 text-sm font-bold text-[#16886A]">{profile.placementStatus}</p>
                <p className="text-[11px] text-[#56627A]">Cleared for all Tier-1 drives</p>
              </div>
            </div>
          </section>

          {/* D. Verified Skills Section */}
          <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E7EF] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0B1020]">
                  Verified Skills & Core Proficiencies
                </h2>
                <p className="text-xs text-[#56627A]">
                  Skills indexed for ATS match calculation and recruiter search
                </p>
              </div>
              <Badge tone="indigo">
                {skills.core.length + skills.technologies.length} Verified Skills
              </Badge>
            </div>

            {/* Core Engineering Fundamentals */}
            <div className="mt-5 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#56627A]">
                Computer Science Fundamentals
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.core.map((skill) => (
                  <span
                    key={skill}
                    className="group inline-flex items-center gap-1.5 rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] px-3 py-1.5 text-xs font-medium text-[#0B1020] hover:border-[#5146E5] hover:bg-white transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill("core", skill)}
                      className="text-slate-400 hover:text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5"
                      title={`Remove ${skill}`}
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Web & Cloud Technologies */}
            <div className="mt-6 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#56627A]">
                Web, Data & Engineering Technologies
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {skills.technologies.map((skill) => (
                  <span
                    key={skill}
                    className="group inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-[#EEF0FF]/50 px-3 py-1.5 text-xs font-medium text-[#5146E5] hover:border-[#5146E5] hover:bg-[#EEF0FF] transition-colors"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => handleRemoveSkill("technologies", skill)}
                      className="text-indigo-400 hover:text-rose-500 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5"
                      title={`Remove ${skill}`}
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Add Skill Form */}
            <form
              onSubmit={handleAddSkill}
              className="mt-6 border-t border-[#E4E7EF] pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newSkillText}
                  onChange={(e) => setNewSkillText(e.target.value)}
                  placeholder="Add a new skill (e.g., Docker, GraphQL, Java)..."
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2 text-xs text-[#0B1020] placeholder:text-[#9DA8BC] focus:border-[#5146E5] focus:ring-2 focus:ring-[#EEF0FF] focus:outline-none transition-colors"
                />
              </div>

              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="rounded-xl border border-[#E4E7EF] bg-white px-3 py-2 text-xs font-medium text-[#56627A] focus:border-[#5146E5] focus:outline-none"
              >
                <option value="technologies">Technologies</option>
                <option value="core">CS Fundamentals</option>
              </select>

              <Button
                type="submit"
                variant="primary"
                className="text-xs font-semibold py-2 px-4 rounded-xl"
              >
                + Add Skill
              </Button>
            </form>
          </section>

          {/* E. Featured Projects Showcase */}
          <section className="rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4E7EF] pb-4">
              <div>
                <h2 className="font-display text-lg font-bold text-[#0B1020]">
                  Featured Technical Projects
                </h2>
                <p className="text-xs text-[#56627A]">
                  Verified project portfolio reviewed for technical campus interviews
                </p>
              </div>
              <Badge tone="slate">{projects.length} Projects Showcase</Badge>
            </div>

            {/* Projects List */}
            <div className="mt-5 space-y-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="group rounded-xl border border-[#E4E7EF] bg-[#F7F8FC]/50 p-5 hover:border-[#5146E5]/40 hover:bg-white transition-all shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5146E5]">
                        {proj.category}
                      </span>
                      <h3 className="font-display text-base font-bold text-[#0B1020] group-hover:text-[#5146E5] transition-colors">
                        {proj.title}
                      </h3>
                    </div>
                    <span className="inline-flex self-start sm:self-auto items-center rounded-md border border-[#E4E7EF] bg-white px-2 py-0.5 text-[10px] font-medium text-[#56627A]">
                      {proj.status}
                    </span>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-[#56627A] leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EF]/60 pt-3">
                    {/* Tech Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {proj.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md border border-[#E4E7EF] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#0B1020]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Action link placeholder */}
                    <span className="text-xs font-semibold text-[#5146E5] group-hover:underline cursor-pointer flex items-center gap-1">
                      {proj.linkText}
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ============================================================== */}
        {/* Right Column: Placement Readiness & Resume Sidebar             */}
        {/* ============================================================== */}
        <aside className="space-y-6">
          {/* 1. Resume & ATS Readiness Card */}
          <Card className="p-6 border-[#E4E7EF]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146E5]">
                Resume Status
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F6F1] px-2 py-0.5 text-[11px] font-semibold text-[#16886A]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
                Active v2.4
              </span>
            </div>

            <div className="mt-3">
              <p className="font-display text-3xl font-extrabold text-[#0B1020]">
                82%
              </p>
              <p className="text-xs font-semibold text-[#56627A]">
                ATS Optimization Score
              </p>
            </div>

            <p className="mt-2 text-xs text-[#56627A] leading-relaxed">
              Your active resume is linked to 4 campus drive applications and
              matches core engineering criteria.
            </p>

            <div className="mt-4 rounded-xl border border-indigo-100 bg-[#EEF0FF] p-3 text-xs text-[#5146E5]">
              <span className="font-bold">Recommendation:</span> Add quantitative
              metrics to your Redis Task Queue project description to gain +4% ATS score.
            </div>

            <Link
              to="/student/resume"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E4E7EF] bg-white py-2.5 text-xs font-semibold text-[#0B1020] hover:bg-[#F7F8FC] hover:border-[#5146E5] transition-colors"
            >
              <span>View Resume & ATS Insights</span>
              <svg className="h-3.5 w-3.5 text-[#56627A]" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </Card>

          {/* 2. Campus Placement Drive Eligibility Checklist */}
          <Card className="p-6 border-[#E4E7EF]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#56627A]">
              Placement Drive Eligibility
            </span>
            <h3 className="mt-1 font-display text-base font-bold text-[#0B1020]">
              Eligibility Gates (2026 Batch)
            </h3>

            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#16886A] text-[10px] font-bold text-white">
                  ✓
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-[#0B1020]">Min CGPA Threshold (≥ 7.50)</p>
                  <p className="text-[#56627A]">Candidate CGPA is 8.85 (Cleared)</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#16886A] text-[10px] font-bold text-white">
                  ✓
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-[#0B1020]">Backlog Verification (0 Allowed)</p>
                  <p className="text-[#56627A]">0 active backlogs recorded (Cleared)</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#16886A] text-[10px] font-bold text-white">
                  ✓
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-[#0B1020]">TPO Registration Fee & Attendance</p>
                  <p className="text-[#56627A]">Pre-placement training completed</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#16886A] text-[10px] font-bold text-white">
                  ✓
                </span>
                <div className="text-xs">
                  <p className="font-semibold text-[#0B1020]">Institutional ID & PRN Match</p>
                  <p className="text-[#56627A]">ROLL-2022-CS-154 confirmed</p>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[#E4E7EF] pt-4">
              <span className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#E8F6F1] py-2 text-xs font-semibold text-[#16886A]">
                <span>●</span> All Tier-1 Eligibility Gates Cleared
              </span>
            </div>
          </Card>

          {/* 3. Official Document Verification Status */}
          <Card className="p-6 border-[#E4E7EF]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#56627A]">
              TPO Document Vault
            </span>
            <h3 className="mt-1 font-display text-base font-bold text-[#0B1020]">
              Institutional Documents
            </h3>

            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] p-2.5">
                <span className="font-medium text-[#0B1020]">B.Tech Sem 1–6 Transcripts</span>
                <span className="text-[11px] font-semibold text-[#16886A]">Verified</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] p-2.5">
                <span className="font-medium text-[#0B1020]">Class 10 & 12 Certificates</span>
                <span className="text-[11px] font-semibold text-[#16886A]">Verified</span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[#E4E7EF] bg-[#F7F8FC] p-2.5">
                <span className="font-medium text-[#0B1020]">Government Identity (Aadhaar)</span>
                <span className="text-[11px] font-semibold text-[#16886A]">Verified</span>
              </div>
            </div>

            <p className="mt-3 text-[11px] text-[#56627A] leading-normal">
              Documents are locked and digitally stamped by Somaiya Training &
              Placement Office.
            </p>
          </Card>

          {/* 4. Placement Activity Snapshot */}
          <Card className="p-6 border-[#E4E7EF]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#56627A]">
              Placement Timeline
            </span>
            <h3 className="mt-1 font-display text-base font-bold text-[#0B1020]">
              Recent Profile Milestones
            </h3>

            <div className="mt-4 space-y-3.5 border-l-2 border-[#E4E7EF] pl-3.5 ml-1">
              <div className="relative">
                <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-[#5146E5] ring-2 ring-white" />
                <p className="text-xs font-bold text-[#0B1020]">Shortlisted for Acme Technologies</p>
                <p className="text-[11px] text-[#56627A]">12 Aug · Software Engineer Intern</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-[#16886A] ring-2 ring-white" />
                <p className="text-xs font-bold text-[#0B1020]">Interview Scheduled: PixelCraft</p>
                <p className="text-[11px] text-[#56627A]">25 Aug · 11:00 AM (Virtual)</p>
              </div>

              <div className="relative">
                <span className="absolute -left-[19px] top-1.5 h-2 w-2 rounded-full bg-slate-300 ring-2 ring-white" />
                <p className="text-xs font-bold text-[#0B1020]">Profile Verified by Somaiya TPO</p>
                <p className="text-[11px] text-[#56627A]">01 Aug · Academic standing confirmed</p>
              </div>
            </div>
          </Card>
        </aside>
      </div>

      {/* ============================================================== */}
      {/* 3. EDIT PROFILE MODAL (FRONTEND INTERACTION)                   */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/60 backdrop-blur-xs animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl border border-[#E4E7EF] bg-white p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E4E7EF] pb-4">
              <div>
                <h3 id="edit-profile-title" className="font-display text-lg font-bold text-[#0B1020]">
                  Edit Profile Information
                </h3>
                <p className="text-xs text-[#56627A]">
                  Update your contact preferences and candidate summary
                </p>
              </div>
              <button
                onClick={handleCloseEditModal}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-[#0B1020]"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              <div>
                <label htmlFor={nameId} className="block text-xs font-bold uppercase tracking-wider text-[#56627A] mb-1">
                  Full Name
                </label>
                <input
                  id={nameId}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={phoneId} className="block text-xs font-bold uppercase tracking-wider text-[#56627A] mb-1">
                    Contact Phone
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={locationId} className="block text-xs font-bold uppercase tracking-wider text-[#56627A] mb-1">
                    Location
                  </label>
                  <input
                    id={locationId}
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-[#E4E7EF] bg-white px-3.5 py-2.5 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor={bioId} className="block text-xs font-bold uppercase tracking-wider text-[#56627A] mb-1">
                  Candidate Summary / Bio
                </label>
                <textarea
                  id={bioId}
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full rounded-xl border border-[#E4E7EF] bg-white p-3 text-xs text-[#0B1020] focus:border-[#5146E5] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="rounded-xl border border-amber-200/70 bg-amber-50/70 p-3 text-[11px] text-amber-800">
                <span className="font-bold">Note:</span> Academic records (CGPA, Branch, PRN) are locked by Somaiya Placement Office and can only be amended via TPO verification.
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E4E7EF]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseEditModal}
                  className="text-xs font-semibold py-2 px-4 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="text-xs font-semibold py-2 px-5 rounded-xl shadow-subtle"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
