import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [150, "Job title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company reference is required"],
      index: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recruiter reference is required"],
      index: true,
    },
    location: {
      type: String,
      trim: true,
      default: "Mumbai",
    },
    workMode: {
      type: String,
      enum: ["ONSITE", "HYBRID", "REMOTE"],
      default: "HYBRID",
    },
    employmentType: {
      type: String,
      default: "Full-time",
    },
    domain: {
      type: String,
      trim: true,
      default: "Software Engineering",
    },
    ctc: {
      type: String,
      trim: true,
      default: "18.5 LPA CTC",
    },
    stipend: {
      type: String,
      trim: true,
      default: "₹45,000 / month",
    },
    duration: {
      type: String,
      trim: true,
      default: "6 Months",
    },
    deadline: {
      type: Date,
      required: [true, "Application deadline is required"],
      index: true,
    },
    eligibility: {
      minCgpa: {
        type: Number,
        default: 0,
        min: 0,
        max: 10,
      },
      allowedBranches: {
        type: [String],
        default: [],
      },
      maxBacklogs: {
        type: Number,
        default: 0,
        min: 0,
      },
      graduationYears: {
        type: [Number],
        default: [],
      },
    },
    requiredSkills: {
      type: [String],
      default: [],
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    selectionRounds: {
      type: [String],
      default: ["Technical Screening", "Technical Interview", "HR Fitment"],
    },
    responsibilities: {
      type: [String],
      default: [
        "Design and build scalable campus recruitment software systems.",
        "Collaborate with multi-functional teams on real-world engineering tasks.",
      ],
    },
    status: {
      type: String,
      enum: ["DRAFT", "OPEN", "CLOSED"],
      default: "OPEN",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        // provide role alias for frontend compatibility
        ret.role = ret.title;
        delete ret.__v;
        return ret;
      },
    },
  }
);

jobSchema.index({ status: 1, deadline: 1 });
jobSchema.index({ recruiterId: 1, status: 1 });

export const Job = mongoose.model("Job", jobSchema);
