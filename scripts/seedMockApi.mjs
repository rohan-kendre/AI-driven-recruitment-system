import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const environmentFile = resolve(scriptDirectory, "../client/.env.local");

async function getBaseUrl() {
  if (process.env.VITE_MOCK_API_BASE_URL) return process.env.VITE_MOCK_API_BASE_URL;

  const environment = await readFile(environmentFile, "utf8");
  const match = environment.match(/^VITE_MOCK_API_BASE_URL=(.+)$/m);
  if (!match) throw new Error("VITE_MOCK_API_BASE_URL is missing from client/.env.local.");
  return match[1].trim();
}

const now = new Date().toISOString();
const users = [
  { name: "Aarav Kulkarni", email: "aarav.kulkarni@nexhire.demo", role: "STUDENT", initials: "AK", status: "Active", approvalStatus: "Approved", createdAt: now },
  { name: "Vikram Malhotra", email: "vikram.malhotra@nexhire.demo", role: "RECRUITER", initials: "VM", status: "Active", approvalStatus: "Approved", createdAt: now },
  { name: "Prof. K. R. Sharma", email: "tpo@nexhire.demo", role: "TPO", initials: "KS", status: "Active", approvalStatus: "Approved", createdAt: now },
  { name: "Aditi Sen", email: "admin@nexhire.demo", role: "ADMIN", initials: "AS", status: "Active", approvalStatus: "Approved", createdAt: now },
  { name: "Maya Nair", email: "maya.nair@nexhire.demo", role: "STUDENT", initials: "MN", status: "Active", approvalStatus: "Approved", createdAt: now },
  { name: "Rohan Das", email: "rohan.das@nexhire.demo", role: "STUDENT", initials: "RD", status: "Active", approvalStatus: "Approved", createdAt: now },
  { name: "Leena Kapoor", email: "leena.kapoor@nexhire.demo", role: "RECRUITER", initials: "LK", status: "Active", approvalStatus: "Approved", createdAt: now },
];

async function request(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { headers: { "Content-Type": "application/json" }, ...options });
  if (!response.ok) throw new Error(`${options.method || "GET"} ${path} failed: ${response.status} ${await response.text()}`);
  return response.json();
}

async function getOrCreateUser(baseUrl, user, cache) {
  const existing = cache.get(user.email);
  if (existing) return { record: existing, created: false };
  const created = await request(baseUrl, "/users", { method: "POST", body: JSON.stringify(user) });
  cache.set(user.email, created);
  return { record: created, created: true };
}

function recordKey(record) {
  if (record.type === "student" || record.type === "recruiter") {
    return `${record.type}::${record.email}`;
  }
  return `${record.type}::${record.name || ""}::${record.title || ""}`;
}

async function getOrCreateRecord(baseUrl, record, cache) {
  const key = recordKey(record);
  const existing = cache.get(key);
  if (existing) return { record: existing, created: false };
  const created = await request(baseUrl, "/records", { method: "POST", body: JSON.stringify(record) });
  cache.set(key, created);
  return { record: created, created: true };
}

const tracked = { users: 0, records: {} };
async function seedRecord(baseUrl, record, cache) {
  const result = await getOrCreateRecord(baseUrl, { ...record, createdAt: now, updatedAt: now }, cache);
  if (result.created) tracked.records[record.type] = (tracked.records[record.type] || 0) + 1;
  return result.record;
}

async function main() {
  const baseUrl = await getBaseUrl();
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const existingUsers = await request(normalizedBaseUrl, "/users?page=1&limit=100");
  const userCache = new Map(existingUsers.map((user) => [user.email, user]));
  const accountMap = {};
  for (const user of users) {
    const result = await getOrCreateUser(normalizedBaseUrl, user, userCache);
    if (result.created) tracked.users += 1;
    accountMap[user.email] = result.record;
  }

  const existingRecords = await request(normalizedBaseUrl, "/records?page=1&limit=100");
  const recordCache = new Map(existingRecords.map((record) => [recordKey(record), record]));

  const students = {};
  students.aarav = await seedRecord(normalizedBaseUrl, { type: "student", name: "Aarav Kulkarni", email: "aarav.kulkarni@nexhire.demo", userId: accountMap["aarav.kulkarni@nexhire.demo"].id, branch: "Computer Engineering", cgpa: 8.85, status: "In Process", location: "Mumbai", description: "Final-year Computer Engineering student.", role: "STUDENT" }, recordCache);
  students.maya = await seedRecord(normalizedBaseUrl, { type: "student", name: "Maya Nair", email: "maya.nair@nexhire.demo", userId: accountMap["maya.nair@nexhire.demo"].id, branch: "Information Technology", cgpa: 8.62, status: "Placed", location: "Pune", description: "Final-year IT student.", role: "STUDENT" }, recordCache);
  students.rohan = await seedRecord(normalizedBaseUrl, { type: "student", name: "Rohan Das", email: "rohan.das@nexhire.demo", userId: accountMap["rohan.das@nexhire.demo"].id, branch: "AI and Data Science", cgpa: 8.31, status: "Unplaced", location: "Navi Mumbai", description: "Final-year AI and Data Science student.", role: "STUDENT" }, recordCache);

  const recruiters = {};
  recruiters.vikram = await seedRecord(normalizedBaseUrl, { type: "recruiter", name: "Vikram Malhotra", email: "vikram.malhotra@nexhire.demo", userId: accountMap["vikram.malhotra@nexhire.demo"].id, role: "Campus Hiring Manager", status: "Approved", description: "Primary recruiter contact." }, recordCache);
  recruiters.leena = await seedRecord(normalizedBaseUrl, { type: "recruiter", name: "Leena Kapoor", email: "leena.kapoor@nexhire.demo", userId: accountMap["leena.kapoor@nexhire.demo"].id, role: "Talent Partner", status: "Approved", description: "Campus talent partner." }, recordCache);

  const companies = {};
  companies.acme = await seedRecord(normalizedBaseUrl, { type: "company", name: "Acme Technologies", recruiterId: recruiters.vikram.id, title: "Acme Technologies", description: "Fictional product engineering company.", location: "Mumbai", status: "Approved" }, recordCache);
  companies.pixelcraft = await seedRecord(normalizedBaseUrl, { type: "company", name: "PixelCraft Studio", recruiterId: recruiters.leena.id, title: "PixelCraft Studio", description: "Fictional design systems studio.", location: "Pune", status: "Approved" }, recordCache);
  companies.cloudscale = await seedRecord(normalizedBaseUrl, { type: "company", name: "CloudScale Systems", recruiterId: recruiters.vikram.id, title: "CloudScale Systems", description: "Fictional distributed systems company.", location: "Bengaluru", status: "Approved" }, recordCache);

  const jobs = {};
  const jobDefinitions = [
    ["softwareEngineer", companies.acme, recruiters.vikram, "Software Engineer Intern", "Campus software engineering internship.", "Mumbai", "Hybrid", "18.5 LPA", "₹45,000 / month", "Open"],
    ["frontendDeveloper", companies.pixelcraft, recruiters.leena, "Frontend Developer", "React and design systems opportunity.", "Pune", "Hybrid", "16.0 LPA", "₹40,000 / month", "Open"],
    ["backendEngineer", companies.cloudscale, recruiters.vikram, "Backend Developer", "Backend and distributed systems opportunity.", "Bengaluru", "On campus", "20.0 LPA", "₹50,000 / month", "Open"],
    ["dataAnalyst", companies.acme, recruiters.vikram, "Data Analyst Intern", "Data analysis internship for campus hires.", "Mumbai", "Hybrid", "12.0 LPA", "₹35,000 / month", "Draft"],
    ["qaEngineer", companies.pixelcraft, recruiters.leena, "Quality Engineer Intern", "Quality engineering and automation internship.", "Pune", "Remote", "11.0 LPA", "₹30,000 / month", "Closed"],
  ];
  for (const [key, company, recruiter, title, description, location, workMode, ctc, stipend, status] of jobDefinitions) {
    jobs[key] = await seedRecord(normalizedBaseUrl, { type: "job", name: title, title, description, companyId: company.id, recruiterId: recruiter.id, location, workMode, ctc, stipend, deadline: "2026-11-15T00:00:00.000Z", status }, recordCache);
  }

  const applicationDefinitions = [
    [students.aarav, jobs.softwareEngineer, "Applied"], [students.aarav, jobs.frontendDeveloper, "Shortlisted"], [students.aarav, jobs.backendEngineer, "Interview"],
    [students.maya, jobs.softwareEngineer, "Offer"], [students.maya, jobs.dataAnalyst, "Rejected"], [students.maya, jobs.frontendDeveloper, "Screening"],
    [students.rohan, jobs.backendEngineer, "Screening"], [students.rohan, jobs.qaEngineer, "Applied"],
  ];
  const applications = [];
  for (const [student, job, status] of applicationDefinitions) {
    applications.push(await seedRecord(normalizedBaseUrl, { type: "application", name: `${student.name} · ${job.title}`, title: job.title, studentId: student.id, jobId: job.id, companyId: job.companyId, status, description: `Application for ${job.title}.` }, recordCache));
  }

  const interviewDefinitions = [
    [applications[2], students.aarav, jobs.backendEngineer, companies.cloudscale, "Technical Round 1", "Scheduled"],
    [applications[1], students.aarav, jobs.frontendDeveloper, companies.pixelcraft, "Frontend Systems Interview", "Scheduled"],
    [applications[3], students.maya, jobs.softwareEngineer, companies.acme, "Final Engineering Interview", "Completed"],
    [applications[6], students.rohan, jobs.backendEngineer, companies.cloudscale, "Screening Interview", "Cancelled"],
  ];
  for (const [application, student, job, company, title, status] of interviewDefinitions) {
    await seedRecord(normalizedBaseUrl, { type: "interview", name: `${student.name} · ${title}`, title, applicationId: application.id, studentId: student.id, jobId: job.id, companyId: company.id, date: "2026-11-10T10:00:00.000Z", location: "NexHire virtual meeting room", workMode: "Virtual", status, description: `${title} for ${job.title}.` }, recordCache);
  }

  const offerDefinitions = [
    [applications[3], students.maya, jobs.softwareEngineer, companies.acme, "Accepted"],
    [applications[1], students.aarav, jobs.frontendDeveloper, companies.pixelcraft, "Pending"],
    [applications[4], students.maya, jobs.dataAnalyst, companies.acme, "Declined"],
  ];
  for (const [application, student, job, company, status] of offerDefinitions) {
    await seedRecord(normalizedBaseUrl, { type: "offer", name: `${student.name} · ${job.title}`, title: job.title, applicationId: application.id, studentId: student.id, jobId: job.id, companyId: company.id, ctc: job.ctc, stipend: job.stipend, date: "2026-11-01T00:00:00.000Z", deadline: "2026-11-20T00:00:00.000Z", status, description: `Offer for ${job.title} at ${company.name}.` }, recordCache);
  }

  for (const [job, company, recruiter] of [[jobs.softwareEngineer, companies.acme, recruiters.vikram], [jobs.frontendDeveloper, companies.pixelcraft, recruiters.leena], [jobs.backendEngineer, companies.cloudscale, recruiters.vikram]]) {
    await seedRecord(normalizedBaseUrl, { type: "placementDrive", name: `${company.name} · ${job.title}`, title: `${company.name} Campus Drive`, companyId: company.id, jobId: job.id, recruiterId: recruiter.id, deadline: job.deadline, status: job.status, description: `Placement drive for ${job.title}.` }, recordCache);
  }

  const notificationDefinitions = [
    ["aarav.kulkarni@nexhire.demo", "Application submitted", "Your Software Engineer Intern application is recorded.", "Unread"],
    ["aarav.kulkarni@nexhire.demo", "Interview scheduled", "Your Backend Developer technical interview is scheduled.", "Unread"],
    ["maya.nair@nexhire.demo", "Offer accepted", "Your Software Engineer Intern offer is accepted.", "Read"],
    ["vikram.malhotra@nexhire.demo", "New application", "A new application is available for review.", "Unread"],
    ["tpo@nexhire.demo", "Drive deadline approaching", "One active placement drive closes soon.", "Unread"],
    ["admin@nexhire.demo", "Approval review needed", "A pending account requires review.", "Unread"],
  ];
  for (const [email, title, description, status] of notificationDefinitions) {
    await seedRecord(normalizedBaseUrl, { type: "notification", name: `${email} · ${title}`, title, description, userId: accountMap[email].id, status }, recordCache);
  }

  console.log(JSON.stringify({ baseUrl: normalizedBaseUrl, createdUsers: tracked.users, createdRecordsByType: tracked.records, message: "MockAPI seed completed without duplicating matching type/name/title records." }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
