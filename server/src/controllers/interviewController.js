import mongoose from "mongoose";
import { Interview } from "../models/Interview.js";
import { Application } from "../models/Application.js";

const VALID_MODES = ["Virtual", "On Campus", "In Person"];
function validateSchedule({ date, time, mode, location, meetingLink }) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(date)) {
    const error = new Error("Choose a valid future interview date and time.");
    error.statusCode = 400;
    throw error;
  }
  const when = new Date(date);
  if (!date || Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
    const error = new Error("Choose a valid future interview date and time.");
    error.statusCode = 400;
    throw error;
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time || "") || !VALID_MODES.includes(mode)) {
    const error = new Error("A valid time and interview mode are required.");
    error.statusCode = 400;
    throw error;
  }
  let meetingUrl;
  try { meetingUrl = new URL(meetingLink); } catch { meetingUrl = null; }
  if (mode === "Virtual" ? meetingUrl?.protocol !== "https:" || !meetingUrl.hostname : !location?.trim()) {
    const error = new Error(mode === "Virtual" ? "An HTTPS meeting link is required." : "An interview location is required.");
    error.statusCode = 400;
    throw error;
  }
}

export const interviewController = {
  async getInterviews(req, res, next) {
    try {
      const user = req.user;
      if (user.role === "STUDENT") {
        const interviews = await Interview.find({ studentId: user._id })
          .populate({
            path: "jobId",
            select: "title location stipend ctc",
            populate: { path: "companyId", select: "name location" },
          })
          .sort({ createdAt: -1 });

        const mapped = interviews.map((item) => {
          const job = item.jobId || {};
          const company = job.companyId || {};
          return {
            id: item._id.toString(),
            _id: item._id.toString(),
            applicationId: item.applicationId.toString(),
            title: item.title,
            round: item.title,
            role: job.title || "Position unavailable",
            company: company.name || "Company unavailable",
            date: item.date,
            time: item.time,
            mode: item.mode,
            location: item.location,
            meetingLink: item.meetingLink,
            status: item.status,
            panel: item.panel || "",
            notes: item.notes || "",
          };
        });

        return res.status(200).json({ success: true, data: mapped });
      }

      if (user.role === "RECRUITER") {
        const interviews = await Interview.find({ recruiterId: user._id })
          .populate("studentId", "name email")
          .populate("jobId", "title location")
          .sort({ createdAt: -1 });

        const mapped = interviews.map((item) => {
          const student = item.studentId || {};
          const job = item.jobId || {};
          return {
            id: item._id.toString(),
            _id: item._id.toString(),
            applicationId: item.applicationId.toString(),
            candidateName: student.name || "Student",
            candidateEmail: student.email || "",
            role: job.title || "Position unavailable",
            title: item.title,
            round: item.title,
            date: item.date,
            time: item.time,
            mode: item.mode,
            location: item.location,
            meetingLink: item.meetingLink,
            status: item.status,
            notes: item.notes,
          };
        });

        return res.status(200).json({ success: true, data: mapped });
      }

      // Default fallback
      const interviews = await Interview.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: interviews });
    } catch (err) {
      next(err);
    }
  },

  async createInterview(req, res, next) {
    try {
      const {
        applicationId,
        title,
        date,
        time,
        mode,
        location,
        meetingLink,
        notes,
      } = req.body;

      if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
        const error = new Error("Valid applicationId is required");
        error.statusCode = 400;
        throw error;
      }

      if (!title?.trim() || title.length > 120 || !date || !time || !mode) {
        const error = new Error("Interview title, date, time, and mode are required.");
        error.statusCode = 400;
        throw error;
      }
      validateSchedule({ date, time, mode, location, meetingLink });

      const application = await Application.findById(applicationId).populate("jobId");
      if (!application) {
        const error = new Error("Application not found");
        error.statusCode = 404;
        throw error;
      }

      if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
        const error = new Error("Forbidden: You cannot schedule interviews for another recruiter's job");
        error.statusCode = 403;
        throw error;
      }

      if (!["SHORTLISTED", "INTERVIEW"].includes(application.status)) {
        const error = new Error("Only shortlisted or interviewing candidates can be scheduled.");
        error.statusCode = 400;
        throw error;
      }

      const session = await mongoose.startSession();
      let interview;
      try {
        await session.withTransaction(async () => {
          const current = await Application.findById(applicationId).session(session);
          if (!["SHORTLISTED", "INTERVIEW"].includes(current?.status)) {
            const error = new Error("Application is no longer eligible for scheduling.");
            error.statusCode = 409;
            throw error;
          }
          [interview] = await Interview.create([{
            applicationId: current._id, jobId: application.jobId._id,
            studentId: current.studentId, recruiterId: req.user._id,
            title: title.trim(), date, time, mode,
            location: location || "", meetingLink: meetingLink || "",
            status: "SCHEDULED", notes: notes || "",
          }], { session });
          if (current.status === "SHORTLISTED") {
            current.status = "INTERVIEW";
            current.statusHistory.push({ status: "INTERVIEW", changedAt: new Date(), changedBy: req.user._id, note: `Interview scheduled: ${interview.title}` });
            await current.save({ session });
          }
        });
      } finally {
        await session.endSession();
      }

      return res.status(201).json({
        success: true,
        message: "Interview scheduled successfully",
        data: interview,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateInterview(req, res, next) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error("Invalid interview ID format");
        error.statusCode = 400;
        throw error;
      }
      const interview = await Interview.findById(req.params.id);
      if (!interview) {
        const error = new Error("Interview not found");
        error.statusCode = 404;
        throw error;
      }

      if (interview.recruiterId.toString() !== req.user._id.toString()) {
        const error = new Error("Forbidden: You cannot modify another recruiter's interview");
        error.statusCode = 403;
        throw error;
      }

      const { status, date, time, location, mode, meetingLink, notes } = req.body;
      if (status) {
        const s = String(status).toUpperCase();
        const allowed = { SCHEDULED: ["RESCHEDULED", "COMPLETED", "CANCELLED"], RESCHEDULED: ["RESCHEDULED", "COMPLETED", "CANCELLED"], COMPLETED: [], CANCELLED: [] };
        if (!allowed[interview.status]?.includes(s)) {
          const error = new Error("Invalid interview status transition.");
          error.statusCode = 400;
          throw error;
        }
        interview.status = s;
      }
      if (date || time || mode || location || meetingLink) validateSchedule({ date: date || interview.date, time: time || interview.time, mode: mode || interview.mode, location: location || interview.location, meetingLink: meetingLink || interview.meetingLink });
      if (date) interview.date = date;
      if (time) interview.time = time;
      if (location) interview.location = location;
      if (mode) interview.mode = mode;
      if (meetingLink) interview.meetingLink = meetingLink;
      if (notes !== undefined) interview.notes = String(notes).slice(0, 2000);

      await interview.save();

      return res.status(200).json({
        success: true,
        message: "Interview updated successfully",
        data: interview,
      });
    } catch (err) {
      next(err);
    }
  },
};
