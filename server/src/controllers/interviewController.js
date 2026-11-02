import mongoose from "mongoose";
import { Interview } from "../models/Interview.js";
import { Application } from "../models/Application.js";
import { ALLOWED_STATUS_TRANSITIONS } from "../constants/applicationStatuses.js";

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
            role: job.title || "Software Engineer",
            company: company.name || "Acme Technologies",
            date: item.date,
            time: item.time,
            mode: item.mode,
            location: item.location,
            meetingLink: item.meetingLink,
            status: item.status,
            panel: "Technical Hiring Team",
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
            role: job.title || "Software Engineer",
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

      const interview = await Interview.create({
        applicationId: application._id,
        jobId: application.jobId._id,
        studentId: application.studentId,
        recruiterId: req.user._id,
        title: title || "Technical Interview Round 1",
        date: date || new Date().toISOString().slice(0, 10),
        time: time || "10:00 AM",
        mode: mode || "Virtual",
        location: location || "NexHire virtual meeting room",
        meetingLink: meetingLink || "https://meet.google.com/nex-hire-interview",
        status: "SCHEDULED",
        notes: notes || "",
      });

      // Phase 5 integration: Update Application status to INTERVIEW if valid transition
      const currentStatus = application.status;
      if (currentStatus !== "INTERVIEW") {
        const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
        if (allowed.includes("INTERVIEW") || currentStatus === "APPLIED" || currentStatus === "SCREENING" || currentStatus === "SHORTLISTED") {
          application.status = "INTERVIEW";
          application.statusHistory.push({
            status: "INTERVIEW",
            changedAt: new Date(),
            changedBy: req.user._id,
            note: `Interview scheduled: ${interview.title}`,
          });
          await application.save();
        }
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

      const { status, date, time, location, mode } = req.body;
      if (status) {
        const s = status.toUpperCase();
        if (["SCHEDULED", "RESCHEDULED", "COMPLETED", "CANCELLED"].includes(s)) {
          interview.status = s;
        }
      }
      if (date) interview.date = date;
      if (time) interview.time = time;
      if (location) interview.location = location;
      if (mode) interview.mode = mode;

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
