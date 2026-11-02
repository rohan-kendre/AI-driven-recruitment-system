import { StudentProfile } from "../models/StudentProfile.js";
import { User } from "../models/User.js";

export const studentController = {
  async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user._id).select("name email role");
      const profile = await StudentProfile.findOne({ userId: req.user._id });

      return res.status(200).json({
        success: true,
        data: {
          ...(profile ? profile.toJSON() : {}),
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const {
        rollNumber,
        branch,
        cgpa,
        backlogs,
        graduationYear,
        skills,
        bio,
        phone,
      } = req.body;

      let profile = await StudentProfile.findOne({ userId: req.user._id });
      if (!profile) {
        profile = new StudentProfile({ userId: req.user._id });
      }

      if (rollNumber !== undefined) profile.rollNumber = rollNumber;
      if (branch !== undefined) profile.branch = branch;
      if (cgpa !== undefined) profile.cgpa = Number(cgpa);
      if (backlogs !== undefined) profile.backlogs = Number(backlogs);
      if (graduationYear !== undefined) profile.graduationYear = Number(graduationYear);
      if (skills !== undefined) {
        profile.skills = Array.isArray(skills)
          ? skills
          : String(skills).split(",").map((s) => s.trim()).filter(Boolean);
      }
      if (bio !== undefined) profile.bio = bio;
      if (phone !== undefined) profile.phone = phone;

      if (!profile.branch || profile.cgpa === undefined || !profile.graduationYear) {
        const error = new Error("Branch, CGPA, and graduation year are required to complete your profile.");
        error.statusCode = 400;
        throw error;
      }

      await profile.save();

      const user = await User.findById(req.user._id).select("name email");
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: {
          ...profile.toJSON(),
          name: user.name,
          email: user.email,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
