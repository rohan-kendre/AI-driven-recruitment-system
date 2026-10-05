export const statsOverview = {
  totalStudents: "1,248",
  placed: "842",
  placementRate: "67.5%",
  inProcess: "214",
  unplaced: "192",
  offersReceived: "1,036",
  highestPackage: "₹28.5 LPA",
  averagePackage: "₹9.4 LPA",
  medianPackage: "₹8.2 LPA",
  lowestPackage: "₹3.6 LPA",
};

export const placementProgressData = [
  { month: "Aug", placed: 120 },
  { month: "Sep", placed: 245 },
  { month: "Oct", placed: 390 },
  { month: "Nov", placed: 525 },
  { month: "Dec", placed: 650 },
  { month: "Jan", placed: 748 },
  { month: "Feb", placed: 842 },
];

export const placementStatusData = [
  { name: "Placed", value: 842, color: "#16886A" },
  { name: "In Process", value: 214, color: "#5146E5" },
  { name: "Unplaced", value: 192, color: "#94A3B8" }, // slate-400
];

export const branchPlacementData = [
  { branch: "Computer", rate: 82 },
  { branch: "IT", rate: 78 },
  { branch: "AI & DS", rate: 74 },
  { branch: "Electronics", rate: 68 },
  { branch: "Mechanical", rate: 61 },
  { branch: "Civil", rate: 55 },
];

export const packageDistributionData = [
  { range: "0-5", count: 120 },
  { range: "5-10", count: 480 },
  { range: "10-15", count: 180 },
  { range: "15-20", count: 45 },
  { range: "20+", count: 17 },
];

export const topRecruiters = [
  { name: "Acme Technologies", selected: 82, offers: 86, avgPackage: "₹18.5 LPA" },
  { name: "PixelCraft Studio", selected: 58, offers: 64, avgPackage: "₹12.0 LPA" },
  { name: "Microsoft", selected: 40, offers: 42, avgPackage: "₹22.5 LPA" },
  { name: "Deloitte", selected: 38, offers: 38, avgPackage: "₹8.5 LPA" },
  { name: "TCS", selected: 35, offers: 35, avgPackage: "₹4.5 LPA" },
];

export const studentsList = [
  { id: "S001", name: "Rohan Mehta", branch: "Computer", cgpa: "9.2", apps: 12, interviews: 4, offers: 2, status: "Placed", package: "₹18.5 LPA" },
  { id: "S002", name: "Priya Sharma", branch: "IT", cgpa: "8.7", apps: 15, interviews: 5, offers: 1, status: "Placed", package: "₹12.0 LPA" },
  { id: "S003", name: "Aditya Patil", branch: "Mechanical", cgpa: "7.8", apps: 8, interviews: 2, offers: 0, status: "In Process", package: "-" },
  { id: "S004", name: "Neha Gupta", branch: "AI & DS", cgpa: "8.9", apps: 20, interviews: 7, offers: 3, status: "Placed", package: "₹22.5 LPA" },
  { id: "S005", name: "Vikram Singh", branch: "Civil", cgpa: "7.2", apps: 5, interviews: 0, offers: 0, status: "Unplaced", package: "-" },
  { id: "S006", name: "Aarav Kulkarni", branch: "Electronics", cgpa: "8.1", apps: 18, interviews: 3, offers: 0, status: "Unplaced", package: "-" },
  { id: "S007", name: "Kavya Desai", branch: "Computer", cgpa: "9.5", apps: 10, interviews: 6, offers: 4, status: "Placed", package: "₹28.5 LPA" },
  { id: "S008", name: "Rahul Verma", branch: "IT", cgpa: "8.4", apps: 14, interviews: 2, offers: 1, status: "Placed", package: "₹8.5 LPA" },
];

export const recentUpdates = [
  { id: 1, text: "Rohan Mehta received an offer from Acme Technologies.", time: "10 mins ago" },
  { id: 2, text: "42 students shortlisted for PixelCraft Studio.", time: "1 hour ago" },
  { id: 3, text: "Deloitte opened applications for Computer Engineering.", time: "3 hours ago" },
  { id: 4, text: "12 students completed their final interview.", time: "5 hours ago" },
  { id: 5, text: "8 new offers were recorded today.", time: "1 day ago" },
];

export const placementFunnel = [
  { stage: "Registered", count: 1248 },
  { stage: "Eligible", count: 1150 },
  { stage: "Applied", count: 1098 },
  { stage: "Shortlisted", count: 980 },
  { stage: "Interviewed", count: 910 },
  { stage: "Offered", count: 865 },
  { stage: "Placed", count: 842 },
];
