export const APPLICATION_STATUS = {
  APPLIED: "APPLIED",
  SCREENING: "SCREENING",
  SHORTLISTED: "SHORTLISTED",
  INTERVIEW: "INTERVIEW",
  OFFERED: "OFFERED",
  REJECTED: "REJECTED",
  WITHDRAWN: "WITHDRAWN",
};

export const ALLOWED_STATUS_TRANSITIONS = {
  APPLIED: ["SCREENING", "SHORTLISTED", "REJECTED", "WITHDRAWN"],
  SCREENING: ["SHORTLISTED", "REJECTED", "WITHDRAWN"],
  SHORTLISTED: ["INTERVIEW", "OFFERED", "REJECTED", "WITHDRAWN"],
  INTERVIEW: ["OFFERED", "REJECTED", "WITHDRAWN"],
  OFFERED: ["REJECTED", "WITHDRAWN"],
  REJECTED: [],
  WITHDRAWN: [],
};

// Map UI status strings to canonical enum keys
export function normalizeStatus(raw) {
  if (!raw || typeof raw !== "string") return null;
  const clean = raw.trim().toUpperCase();
  if (clean === "DECLINED") return APPLICATION_STATUS.REJECTED;
  if (clean === "OFFER") return APPLICATION_STATUS.OFFERED;
  if (Object.values(APPLICATION_STATUS).includes(clean)) {
    return clean;
  }
  return null;
}
