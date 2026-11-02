import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      default: "",
    },
    mode: {
      type: String,
      enum: ["Virtual", "On Campus", "In Person", "VIRTUAL", "ON_CAMPUS", "IN_PERSON"],
      required: true,
    },
    location: {
      type: String,
      default: "",
    },
    meetingLink: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["SCHEDULED", "RESCHEDULED", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
      index: true,
    },
    notes: {
      type: String,
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

export const Interview = mongoose.model("Interview", interviewSchema);
