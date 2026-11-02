import { User } from "../models/User.js";

export const adminController = {
  async getUsers(req, res, next) {
    try {
      const users = await User.find({})
        .select("-password")
        .sort({ createdAt: -1 });

      const mapped = users.map((u) => u.toSafeObject());
      return res.status(200).json({
        success: true,
        data: mapped,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["ACTIVE", "INACTIVE", "SUSPENDED"].includes(status)) {
        const error = new Error("Invalid status. Must be ACTIVE, INACTIVE, or SUSPENDED");
        error.statusCode = 400;
        throw error;
      }

      // Prevent admin from suspending themselves
      if (id === req.user._id.toString() && status !== "ACTIVE") {
        const error = new Error("Forbidden: You cannot deactivate or suspend your own admin account");
        error.statusCode = 403;
        throw error;
      }

      const user = await User.findById(id);
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      user.status = status;
      await user.save();

      return res.status(200).json({
        success: true,
        message: `User status updated to ${status}`,
        data: user.toSafeObject(),
      });
    } catch (err) {
      next(err);
    }
  },

  async updateUserApproval(req, res, next) {
    try {
      const { id } = req.params;
      const { approvalStatus } = req.body;

      if (!["APPROVED", "PENDING", "REJECTED"].includes(approvalStatus)) {
        const error = new Error("Invalid approval status. Must be APPROVED, PENDING, or REJECTED");
        error.statusCode = 400;
        throw error;
      }

      const user = await User.findById(id);
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      user.approvalStatus = approvalStatus;
      await user.save();

      return res.status(200).json({
        success: true,
        message: `User approval status updated to ${approvalStatus}`,
        data: user.toSafeObject(),
      });
    } catch (err) {
      next(err);
    }
  },
};
