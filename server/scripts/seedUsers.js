import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { User } from "../src/models/User.js";
import { StudentProfile } from "../src/models/StudentProfile.js";
import { Company } from "../src/models/Company.js";
import { Job } from "../src/models/Job.js";
import { Application } from "../src/models/Application.js";
import { Interview } from "../src/models/Interview.js";
import { Offer } from "../src/models/Offer.js";
import { APPLICATION_STATUS } from "../src/constants/applicationStatuses.js";

export const DEMO_USERS = [
  {
    name: "Aarav Kulkarni",
    email: "student@nexhire.demo",
    password: "Password123!",
    role: "STUDENT",
    status: "ACTIVE",
    approvalStatus: "APPROVED",
  },
  {
    name: "Vikram Malhotra",
    email: "recruiter@nexhire.demo",
    password: "Password123!",
    role: "RECRUITER",
    status: "ACTIVE",
    approvalStatus: "APPROVED",
  },
  {
    name: "Pending Recruiter",
    email: "pending.recruiter@nexhire.demo",
    password: "Password123!",
    role: "RECRUITER",
    status: "ACTIVE",
    approvalStatus: "PENDING",
  },
  {
    name: "Prof. K. R. Sharma",
    email: "tpo@nexhire.demo",
    password: "Password123!",
    role: "TPO",
    status: "ACTIVE",
    approvalStatus: "APPROVED",
  },
  {
    name: "Aditi Sen",
    email: "admin@nexhire.demo",
    password: "Password123!",
    role: "ADMIN",
    status: "ACTIVE",
    approvalStatus: "APPROVED",
  },
];

async function seedAll() {
  console.log("Seeding demo data (Users, StudentProfile, Company, Jobs, Applications)...");
  await connectDB();

  // 1. Seed Users
  for (const demoUser of DEMO_USERS) {
    const existing = await User.findOne({ email: demoUser.email });
    if (!existing) {
      await User.create(demoUser);
      console.log(`[SEED] Created user: ${demoUser.name} (${demoUser.email})`);
    }
  }

  const studentUser = await User.findOne({ email: "student@nexhire.demo" });
  const recruiterUser = await User.findOne({ email: "recruiter@nexhire.demo" });

  // 2. Seed StudentProfile
  let studentProfile = null;
  if (studentUser) {
    studentProfile = await StudentProfile.findOne({ userId: studentUser._id });
    if (!studentProfile) {
      studentProfile = await StudentProfile.create({
        userId: studentUser._id,
        rollNumber: "SOMAIYA-2024-CS-042",
        branch: "Computer Engineering",
        cgpa: 8.7,
        backlogs: 0,
        graduationYear: 2028,
        skills: ["React", "Node.js", "JavaScript", "Python", "TypeScript", "SQL"],
        bio: "Undergraduate computer engineering student interested in full-stack web and distributed systems.",
        phone: "+91 98765 43210",
      });
      console.log(`[SEED] Created StudentProfile for ${studentUser.name}`);
    }
  }

  // 3. Seed Company for Recruiter
  let company = null;
  if (recruiterUser) {
    company = await Company.findOne({
      $or: [{ createdBy: recruiterUser._id }, { name: "Acme Technologies" }],
    });
    if (!company) {
      company = await Company.create({
        name: "Acme Technologies",
        website: "https://acme-technologies.demo",
        industry: "Enterprise Software & Cloud Platforms",
        location: "Mumbai",
        description: "Global enterprise software solutions provider partnering with campus talent.",
        status: "APPROVED",
        createdBy: recruiterUser._id,
      });
      console.log(`[SEED] Created Company: Acme Technologies`);
    }
  }

  // 4. Seed Jobs for Recruiter
  if (recruiterUser && company) {
    const defaultJobs = [
      {
        title: "Software Development Engineer - Intern",
        description:
          "Join Acme Technologies core engineering team. Build high-performance backend microservices and modern responsive interfaces using React, Node.js, and TypeScript.",
        companyId: company._id,
        recruiterId: recruiterUser._id,
        location: "Mumbai Tech Park",
        workMode: "HYBRID",
        employmentType: "Internship + FTE",
        domain: "Software Engineering",
        ctc: "18.5 LPA CTC",
        stipend: "₹45,000 / month",
        duration: "6 Months",
        deadline: new Date(Date.now() + 25 * 86400000), // 25 days left
        eligibility: {
          minCgpa: 7.5,
          allowedBranches: ["Computer Engineering", "Information Technology", "AI & Data Science"],
          maxBacklogs: 0,
          graduationYears: [2026, 2027, 2028],
        },
        requiredSkills: ["React", "Node.js", "TypeScript", "Algorithms"],
        preferredSkills: ["GraphQL", "Docker", "TailwindCSS"],
        selectionRounds: ["Online Technical Screening", "Technical Round 1", "HR & Fitment"],
        status: "OPEN",
      },
      {
        title: "Full-Stack Engineer - Early Career",
        description:
          "Design and deploy customer-facing recruitment applications. Collaborate with senior systems architects to deliver robust, secure web services.",
        companyId: company._id,
        recruiterId: recruiterUser._id,
        location: "Mumbai",
        workMode: "ONSITE",
        employmentType: "Full-time",
        domain: "Full-Stack",
        ctc: "16.0 LPA CTC",
        stipend: "₹40,000 / month",
        duration: "6 Months",
        deadline: new Date(Date.now() + 15 * 86400000), // 15 days left
        eligibility: {
          minCgpa: 7.0,
          allowedBranches: ["Computer Engineering", "Information Technology", "Electronics & Telecommunication"],
          maxBacklogs: 1,
          graduationYears: [2026, 2027, 2028],
        },
        requiredSkills: ["React", "Node.js", "MongoDB", "Express"],
        preferredSkills: ["Redis", "REST APIs", "Jest"],
        selectionRounds: ["Technical Screening", "System Design Basics", "Director Interview"],
        status: "OPEN",
      },
      {
        title: "Cloud Infrastructure & DevOps Trainee",
        description:
          "Work with cloud infrastructure automation, CI/CD pipelines, container orchestration, and monitoring tools for enterprise deployments.",
        companyId: company._id,
        recruiterId: recruiterUser._id,
        location: "Remote / Hybrid",
        workMode: "REMOTE",
        employmentType: "Full-time",
        domain: "Cloud & DevOps",
        ctc: "14.0 LPA CTC",
        stipend: "₹38,000 / month",
        duration: "6 Months",
        deadline: new Date(Date.now() + 30 * 86400000), // 30 days left
        eligibility: {
          minCgpa: 6.8,
          allowedBranches: ["Computer Engineering", "Information Technology"],
          maxBacklogs: 0,
          graduationYears: [2026, 2027, 2028],
        },
        requiredSkills: ["Docker", "Linux", "Python", "CI/CD"],
        preferredSkills: ["Kubernetes", "AWS", "Bash"],
        selectionRounds: ["Aptitude & Coding Assessment", "DevOps Practical Interview", "HR Round"],
        status: "OPEN",
      },
    ];

    for (const jobData of defaultJobs) {
      const existingJob = await Job.findOne({
        title: jobData.title,
        recruiterId: recruiterUser._id,
      });
      if (!existingJob) {
        await Job.create(jobData);
        console.log(`[SEED] Created Job: ${jobData.title}`);
      }
    }
  }

  // 5. Seed initial application, interview, and offer
  if (studentUser && studentProfile && recruiterUser && company) {
    const targetJob = await Job.findOne({
      title: "Full-Stack Engineer - Early Career",
      recruiterId: recruiterUser._id,
    });
    if (targetJob) {
      let app = await Application.findOne({
        jobId: targetJob._id,
        studentId: studentUser._id,
      });
      if (!app) {
        const now = new Date(Date.now() - 3 * 86400000); // 3 days ago
        app = await Application.create({
          jobId: targetJob._id,
          studentId: studentUser._id,
          studentProfileId: studentProfile._id,
          status: APPLICATION_STATUS.INTERVIEW,
          statusHistory: [
            {
              status: APPLICATION_STATUS.APPLIED,
              changedAt: now,
              changedBy: studentUser._id,
              note: "Application submitted.",
            },
            {
              status: APPLICATION_STATUS.SCREENING,
              changedAt: new Date(Date.now() - 2 * 86400000),
              changedBy: recruiterUser._id,
              note: "Candidate shortlisted for technical screening.",
            },
            {
              status: APPLICATION_STATUS.INTERVIEW,
              changedAt: new Date(Date.now() - 1 * 86400000),
              changedBy: recruiterUser._id,
              note: "Interview scheduled.",
            },
          ],
          appliedAt: now,
          notes: "Applicant possesses verified academic eligibility.",
        });
        console.log(`[SEED] Created demo application for ${studentUser.name} on ${targetJob.title}`);
      }

      // 6. Seed scheduled interview
      const existingInterview = await Interview.findOne({ applicationId: app._id });
      if (!existingInterview) {
        await Interview.create({
          applicationId: app._id,
          jobId: targetJob._id,
          studentId: studentUser._id,
          recruiterId: recruiterUser._id,
          title: "Technical Round 1",
          date: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
          time: "10:30 AM",
          mode: "Virtual",
          location: "NexHire virtual meeting room",
          meetingLink: "https://meet.google.com/nex-hire-interview",
          status: "SCHEDULED",
          notes: "Focus on React component architecture and Node.js REST API design.",
        });
        console.log(`[SEED] Created scheduled interview for ${studentUser.name}`);
      }

      // 7. Seed pending offer
      const existingOffer = await Offer.findOne({ applicationId: app._id });
      if (!existingOffer) {
        await Offer.create({
          applicationId: app._id,
          jobId: targetJob._id,
          studentId: studentUser._id,
          recruiterId: recruiterUser._id,
          companyId: company._id,
          ctc: "16.0 LPA CTC",
          stipend: "₹40,000 / month",
          joiningDate: "2026-07-01",
          deadline: "2026-06-15",
          status: "PENDING",
        });
        console.log(`[SEED] Created pending offer for ${studentUser.name}`);
      }
    }
  }

  const counts = {
    users: await User.countDocuments(),
    studentprofiles: await StudentProfile.countDocuments(),
    companies: await Company.countDocuments(),
    jobs: await Job.countDocuments(),
    applications: await Application.countDocuments(),
    interviews: await Interview.countDocuments(),
    offers: await Offer.countDocuments(),
  };

  console.log("[SEED] All demo data seeded successfully.");
  console.log("[SEED] Current document counts:", counts);

  await mongoose.disconnect();
}

seedAll()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
