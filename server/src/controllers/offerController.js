import mongoose from "mongoose";
import { Offer } from "../models/Offer.js";
import { Application } from "../models/Application.js";

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export const offerController = {
  async getOffers(req, res, next) {
    try {
      const user = req.user;
      if (user.role === "STUDENT") {
        const offers = await Offer.find({ studentId: user._id })
          .populate({
            path: "jobId",
            select: "title location stipend ctc duration",
            populate: { path: "companyId", select: "name location" },
          })
          .sort({ createdAt: -1 });

        const mapped = offers.map((item) => {
          const job = item.jobId || {};
          const company = job.companyId || {};
          return {
            id: item._id.toString(),
            _id: item._id.toString(),
            applicationId: item.applicationId.toString(),
            role: job.title || "Position unavailable",
            company: company.name || "Company unavailable",
            compensation: item.ctc || job.ctc || "",
            stipend: item.stipend || job.stipend || "",
            duration: job.duration || "",
            location: job.location || "",
            joiningDate: item.joiningDate,
            deadline: item.deadline,
            status: item.status, // "PENDING", "ACCEPTED", "DECLINED"
          };
        });

        return res.status(200).json({ success: true, data: mapped });
      }

      if (user.role === "RECRUITER") {
        const offers = await Offer.find({ recruiterId: user._id })
          .populate("studentId", "name email")
          .populate({ path: "jobId", select: "title location domain workMode companyId", populate: { path: "companyId", select: "name" } })
          .sort({ createdAt: -1 });

        const mapped = offers.map((item) => {
          const student = item.studentId || {};
          const job = item.jobId || {};
          return {
            id: item._id.toString(),
            _id: item._id.toString(),
            applicationId: item.applicationId.toString(),
            candidateName: student.name || "Student",
            candidateEmail: student.email || "",
            role: job.title || "Position unavailable",
            company: job.companyId?.name || "Company unavailable",
            department: job.domain || "",
            workMode: job.workMode || "",
            location: job.location || "",
            ctc: item.ctc,
            compensation: item.ctc,
            stipend: item.stipend,
            joiningDate: item.joiningDate,
            deadline: item.deadline,
            decisionDeadline: item.deadline,
            issuedDate: item.createdAt?.toISOString().slice(0, 10) || "",
            status: item.status,
          };
        });

        return res.status(200).json({ success: true, data: mapped });
      }

      // Default
      const offers = await Offer.find({}).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, data: offers });
    } catch (err) {
      next(err);
    }
  },

  async createOffer(req, res, next) {
    try {
      const {
        applicationId,
        ctc,
        stipend,
        joiningDate,
        deadline,
      } = req.body;

      if (!applicationId || !mongoose.Types.ObjectId.isValid(applicationId)) {
        const error = new Error("Valid applicationId is required");
        error.statusCode = 400;
        throw error;
      }

      if (!ctc?.trim() || !joiningDate?.trim() || !deadline?.trim()) {
        const error = new Error("CTC, joining date, and decision deadline are required.");
        error.statusCode = 400;
        throw error;
      }
      const compensation = /^(?:₹\s*|INR\s*)?(\d[\d,]*(?:\.\d+)?)\s*(?:LPA|PA|CTC|INR|₹)?$/i.exec(ctc.trim());
      const amount = Number(compensation?.[1].replaceAll(",", ""));
      if (!compensation || !Number.isFinite(amount) || amount <= 0 || ctc.length > 100 || !validDate(joiningDate) || !validDate(deadline) || new Date(`${deadline}T23:59:59Z`) < new Date() || joiningDate < deadline) {
        const error = new Error("Enter a positive CTC, future decision deadline, and joining date on or after the deadline.");
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
        const error = new Error("Forbidden: You cannot issue offers for another recruiter's job");
        error.statusCode = 403;
        throw error;
      }
      if (!["SHORTLISTED", "INTERVIEW"].includes(application.status)) {
        const error = new Error("Only shortlisted or interviewed candidates may receive an offer.");
        error.statusCode = 400;
        throw error;
      }

      const existing = await Offer.findOne({ applicationId });
      if (existing) {
        const error = new Error("An offer has already been issued for this application");
        error.statusCode = 409;
        throw error;
      }

      const session = await mongoose.startSession();
      let offer;
      try {
        await session.withTransaction(async () => {
          const current = await Application.findById(applicationId).session(session);
          if (!["SHORTLISTED", "INTERVIEW"].includes(current?.status)) {
            const error = new Error("Application is no longer eligible for an offer.");
            error.statusCode = 409;
            throw error;
          }
          [offer] = await Offer.create([{
            applicationId: current._id, jobId: application.jobId._id,
            studentId: current.studentId, recruiterId: req.user._id,
            companyId: application.jobId.companyId,
            ctc: ctc.trim(), stipend: stipend?.trim() || "",
            joiningDate: joiningDate.trim(), deadline: deadline.trim(), status: "PENDING",
          }], { session });
          current.status = "OFFERED";
          current.statusHistory.push({ status: "OFFERED", changedAt: new Date(), changedBy: req.user._id, note: `Formal campus offer extended (${offer.ctc})` });
          await current.save({ session });
        });
      } finally {
        await session.endSession();
      }

      return res.status(201).json({
        success: true,
        message: "Offer extended successfully",
        data: offer,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateOfferStatus(req, res, next) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        const error = new Error("Invalid offer ID format");
        error.statusCode = 400;
        throw error;
      }
      const offer = await Offer.findById(req.params.id);
      if (!offer) {
        const error = new Error("Offer not found");
        error.statusCode = 404;
        throw error;
      }

      // Student can only update their own offer
      if (offer.studentId.toString() !== req.user._id.toString()) {
        const error = new Error("Forbidden: You cannot modify another student's offer");
        error.statusCode = 403;
        throw error;
      }

      const requestedStatus = (req.body.status || "").toUpperCase();
      if (!["ACCEPTED", "DECLINED"].includes(requestedStatus)) {
        const error = new Error("Invalid status. Allowed decisions: ACCEPTED, DECLINED");
        error.statusCode = 400;
        throw error;
      }

      if (offer.status !== "PENDING") {
        const error = new Error(`Offer has already been ${offer.status.toLowerCase()}`);
        error.statusCode = 400;
        throw error;
      }

      const session = await mongoose.startSession();
      let decidedOffer;
      try {
        await session.withTransaction(async () => {
          decidedOffer = await Offer.findOneAndUpdate(
            { _id: offer._id, studentId: req.user._id, status: "PENDING" },
            { $set: { status: requestedStatus } },
            { new: true, session },
          );
          if (!decidedOffer) {
            const error = new Error("Offer has already been decided.");
            error.statusCode = 409;
            throw error;
          }
          const application = await Application.findById(offer.applicationId).session(session);
          if (!application) {
            const error = new Error("Associated application not found.");
            error.statusCode = 409;
            throw error;
          }
          application.statusHistory.push({
            status: application.status,
            changedAt: new Date(),
            changedBy: req.user._id,
            note: `Student has ${requestedStatus.toLowerCase()} the campus offer.`,
          });
          await application.save({ session });
        });
      } finally { await session.endSession(); }

      return res.status(200).json({
        success: true,
        message: `Offer ${requestedStatus.toLowerCase()} successfully`,
        data: decidedOffer,
      });
    } catch (err) {
      next(err);
    }
  },
};
