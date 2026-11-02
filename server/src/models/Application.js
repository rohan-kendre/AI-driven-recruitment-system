import mongoose from "mongoose";
import { APPLICATION_STATUS } from "../constants/applicationStatuses.js";

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job reference is required"],
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
      index: true,
    },
    studentProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: [true, "Student profile reference is required"],
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED,
      index: true,
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: [],
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    resumeVersion: {
      type: String,
      default: "",
    },
    eligibilitySnapshot: {
      branch: String,
      cgpa: Number,
      backlogs: Number,
      graduationYear: Number,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound unique index to prevent duplicate applications
applicationSchema.index({ jobId: 1, studentId: 1 }, { unique: true });
applicationSchema.index({ studentId: 1, status: 1 });
applicationSchema.index({ jobId: 1, status: 1 });

export const Application = mongoose.model("Application", applicationSchema);
