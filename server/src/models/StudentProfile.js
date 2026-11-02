import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    rollNumber: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true,
    },
    cgpa: {
      type: Number,
      required: [true, "CGPA is required"],
      min: [0, "CGPA cannot be negative"],
      max: [10, "CGPA cannot exceed 10.0"],
    },
    backlogs: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Backlogs cannot be negative"],
      max: [100, "Backlogs cannot exceed 100"],
      validate: { validator: Number.isInteger, message: "Backlogs must be a whole number" },
    },
    graduationYear: {
      type: Number,
      required: [true, "Graduation year is required"],
      min: [2020, "Invalid graduation year"],
      max: [2035, "Invalid graduation year"],
    },
    skills: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
      default: "",
      maxlength: 2000,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
      maxlength: 25,
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

export const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
