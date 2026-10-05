import { useState, useId } from "react";
import { Link } from "react-router-dom";
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
  const [skills] = useState(initialSkills);
  const [projects] = useState(initialProjects);

  // Modal and edit form state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [toastMessage, setToastMessage] = useState(null);

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

  return (
    <div className="max-w-5xl mx-auto pb-20">
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

      {/* 1. PROFILE HEADER / IDENTITY BLOCK */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E4E7EF] pb-8 pt-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-[#0B1020] text-white flex items-center justify-center text-3xl font-bold shrink-0">
            {user?.initials || "AK"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0B1020] mb-2">{profile.name}</h1>
            <p className="text-sm font-medium text-[#56627A]">
              {profile.degree} · {profile.college}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#16886A] bg-[#E8F6F1] px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16886A]" />
              Active placement candidate
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleOpenEditModal} className="text-sm font-semibold text-[#0B1020] underline underline-offset-4 hover:text-[#5146E5] transition-colors">
            Edit profile
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="space-y-16 min-w-0">
          
          {/* Academic Information */}
          <section>
            <h2 className="text-base font-bold text-[#0B1020] mb-6 uppercase tracking-wider text-xs">Academic Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-3xl font-bold text-[#0B1020]">{profile.cgpa}</p>
                <p className="text-xs text-[#56627A] mt-1 font-medium">CGPA</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#0B1020] mt-1.5">Computer Engg.</p>
                <p className="text-xs text-[#56627A] mt-1 font-medium">Branch</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#0B1020] mt-1.5">{profile.graduationYear.split(" ")[1]}</p>
                <p className="text-xs text-[#56627A] mt-1 font-medium">Graduation</p>
              </div>
              <div>
                <p className="text-xl font-bold text-[#0B1020] mt-1.5">{profile.backlogs}</p>
                <p className="text-xs text-[#56627A] mt-1 font-medium">Backlogs</p>
              </div>
            </div>
          </section>

          {/* Personal Information */}
          <section>
            <h2 className="text-base font-bold text-[#0B1020] mb-6 uppercase tracking-wider text-xs border-t border-[#E4E7EF] pt-12">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div className="flex flex-col py-1">
                <span className="text-xs text-[#56627A]">Full name</span>
                <span className="text-sm font-medium text-[#0B1020] mt-1">{profile.name}</span>
              </div>
              <div className="flex flex-col py-1">
                <span className="text-xs text-[#56627A]">College email</span>
                <span className="text-sm font-medium text-[#0B1020] mt-1">{profile.email}</span>
              </div>
              <div className="flex flex-col py-1">
                <span className="text-xs text-[#56627A]">Phone</span>
                <span className="text-sm font-medium text-[#0B1020] mt-1">{profile.phone}</span>
              </div>
              <div className="flex flex-col py-1">
                <span className="text-xs text-[#56627A]">Location</span>
                <span className="text-sm font-medium text-[#0B1020] mt-1">{profile.location}</span>
              </div>
              <div className="flex flex-col py-1">
                <span className="text-xs text-[#56627A]">University Roll / PRN</span>
                <span className="text-sm font-medium text-[#0B1020] mt-1">{profile.rollNumber}</span>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-base font-bold text-[#0B1020] mb-6 uppercase tracking-wider text-xs border-t border-[#E4E7EF] pt-12">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {[...skills.core, ...skills.technologies].map(skill => (
                <span key={skill} className="text-xs font-medium text-[#0B1020] bg-white px-3 py-1.5 rounded border border-[#E4E7EF]">
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-base font-bold text-[#0B1020] mb-8 uppercase tracking-wider text-xs border-t border-[#E4E7EF] pt-12">Featured Projects</h2>
            <div className="space-y-10">
              {projects.map(proj => (
                <div key={proj.id} className="group">
                  <h3 className="text-base font-bold text-[#0B1020]">
                    {proj.title}
                  </h3>
                  <p className="text-sm text-[#56627A] mt-2 max-w-2xl leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs">
                    <span className="text-[#56627A] font-medium">{proj.techStack.join(" · ")}</span>
                    <span className="text-[#E4E7EF]">|</span>
                    <span className="text-[#5146E5] font-medium hover:underline cursor-pointer">{proj.linkText}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column / Sidebar */}
        <aside>
          <div className="sticky top-8">
            <h2 className="text-xs font-bold text-[#0B1020] uppercase tracking-wider mb-6">Placement Readiness</h2>
            
            <div className="bg-[#F7F8FC] rounded-2xl p-6 border border-[#E4E7EF]">
              <div className="mb-8">
                <div className="flex items-end justify-between mb-3">
                  <span className="text-sm font-bold text-[#0B1020]">Profile completeness</span>
                  <span className="text-xl font-bold text-[#5146E5]">86%</span>
                </div>
                <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-[#E4E7EF]">
                  <div className="h-full bg-[#5146E5] w-[86%] transition-all duration-500"></div>
                </div>
                <p className="text-xs text-[#56627A] mt-4 font-medium">
                  Verified profile information. <br/> <span className="text-amber-700">3 areas could be improved.</span>
                </p>
              </div>

              <div className="space-y-5 pt-6 border-t border-[#E4E7EF]">
                <div>
                  <p className="text-sm font-bold text-[#0B1020]">Resume</p>
                  <p className="text-xs text-[#56627A] mt-0.5">82% ATS Score</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1020]">Eligibility</p>
                  <p className="text-xs text-[#56627A] mt-0.5">Cleared Tier-1</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0B1020]">Documents</p>
                  <p className="text-xs text-[#56627A] mt-0.5">Verified by TPO</p>
                </div>
              </div>

              <Link to="/student/resume" className="mt-8 flex items-center gap-2 group text-sm font-semibold text-[#5146E5]">
                <span className="group-hover:underline">View Resume & ATS</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1020]/40 backdrop-blur-sm animate-fade-in"
        >
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl font-bold text-[#0B1020]">
                Edit Profile
              </h3>
              <button
                onClick={handleCloseEditModal}
                className="text-slate-400 hover:text-[#0B1020] text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label htmlFor={nameId} className="block text-xs font-semibold text-[#56627A] mb-1.5">
                  Full Name
                </label>
                <input
                  id={nameId}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-b border-[#E4E7EF] bg-transparent py-2 text-sm text-[#0B1020] focus:border-[#5146E5] focus:outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor={phoneId} className="block text-xs font-semibold text-[#56627A] mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-b border-[#E4E7EF] bg-transparent py-2 text-sm text-[#0B1020] focus:border-[#5146E5] focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor={locationId} className="block text-xs font-semibold text-[#56627A] mb-1.5">
                    Location
                  </label>
                  <input
                    id={locationId}
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border-b border-[#E4E7EF] bg-transparent py-2 text-sm text-[#0B1020] focus:border-[#5146E5] focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor={bioId} className="block text-xs font-semibold text-[#56627A] mb-1.5">
                  Summary / Bio
                </label>
                <textarea
                  id={bioId}
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border-b border-[#E4E7EF] bg-transparent py-2 text-sm text-[#0B1020] focus:border-[#5146E5] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="text-sm font-semibold text-[#56627A] hover:text-[#0B1020] px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="text-sm font-semibold text-white bg-[#0B1020] hover:bg-[#1C2438] px-6 py-2 rounded-full transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
