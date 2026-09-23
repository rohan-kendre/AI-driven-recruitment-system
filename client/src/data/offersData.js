// Centralized mock data for Student Placement Offers Workspace
// Aligned with applicationsData.js (APP-1048), interviewsData.js, and dashboardData.js

export const initialOffers = [
  {
    id: "OFR-401",
    applicationId: "APP-1048",
    company: "Acme Technologies",
    role: "Software Engineer Intern",
    status: "Pending review", // 'Pending review' | 'Accepted' | 'Declined' | 'Expired'
    offerDate: "22 Aug 2026",
    decisionDeadline: "31 Aug 2026",
    joiningDate: "15 Jan 2027",
    location: "Acme Tech Park, Mumbai",
    workMode: "Hybrid / On campus drive",
    monthlyCompensation: "₹45,000 / month",
    ctc: "18.5 LPA CTC",
    duration: "6 Months Internship + Pre-Placement Offer (PPO)",
    isPrimary: true,
    compensationBreakdown: [
      { label: "Internship Stipend", value: "₹45,000 / month", note: "Duration: Jan 2027 – Jun 2027" },
      { label: "Full-Time Base Salary", value: "₹14,00,000 / annum", note: "Fixed component upon graduation" },
      { label: "Joining Allowance", value: "₹1,50,000", note: "One-time payout on first pay cycle" },
      { label: "Performance & Retention", value: "₹3,00,000", note: "Annual appraisal pool" },
    ],
    benefits: [
      "Comprehensive medical & health coverage (₹5,00,000 institutional pool)",
      "Relocation & initial lodging support in Mumbai tech corridor",
      "Annual technical certification and learning budget (₹50,000)",
      "Provisioned Apple MacBook Pro & developer workspace hardware",
    ],
    interviewConnection: {
      summary: "Technical Round 1 & HR Fitment",
      completedDate: "20 Aug 2026",
      roundNotes: "Cleared system data structures and Node.js concurrency evaluation.",
    },
    documentPreview: {
      refNumber: "ACM-IN/2026/PPO-048",
      issueDate: "22 August 2026",
      candidateName: "Aarav Kulkarni",
      candidateRoll: "SOM-2026-CE-042",
      degree: "B.Tech Computer Engineering",
      institution: "K.J. Somaiya College of Engineering",
      signatory: "Vikram Malhotra",
      signatoryRole: "Head of University Relations & Talent Acquisition",
      paragraphs: [
        "We are pleased to extend this formal offer of employment on behalf of Acme Technologies Ltd. following your commendable performance throughout the campus placement process conducted with the K.J. Somaiya Training & Placement Office.",
        "You are offered the position of Software Engineer Intern within the Core Platform Engineering Group at our Mumbai Tech Park Center. Your internship commences on 15 January 2027 with a monthly stipend of ₹45,000. Upon successful completion of your internship and graduation requirements, your role will convert to full-time Software Engineer with a total CTC of 18.5 LPA.",
        "This offer is issued under Somaiya TPO institutional guidelines. Please review the enclosed terms and record your acceptance through the NexHire placement platform on or before 31 August 2026.",
      ],
    },
  },
];
