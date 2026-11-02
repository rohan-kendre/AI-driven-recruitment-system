import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [120, "Company name cannot exceed 120 characters"],
    },
    website: {
      type: String,
      trim: true,
      default: "",
      maxlength: 255,
      validate: {
        validator(value) {
          if (!value) return true;
          try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) && Boolean(url.hostname); }
          catch { return false; }
        },
        message: "Company website must be a valid HTTP or HTTPS URL",
      },
    },
    tagline: { type: String, trim: true, default: "", maxlength: 200 },
    headquarters: { type: String, trim: true, default: "", maxlength: 200 },
    industry: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "APPROVED",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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

companySchema.index({ name: 1, createdBy: 1 });

export const Company = mongoose.model("Company", companySchema);
