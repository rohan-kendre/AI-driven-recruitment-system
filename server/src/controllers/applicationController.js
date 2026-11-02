import { applicationService } from "../services/applicationService.js";

export const applicationController = {
  async createApplication(req, res, next) {
    try {
      const application = await applicationService.createApplication(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        message: "Application submitted successfully",
        data: application,
      });
    } catch (err) {
      next(err);
    }
  },

  async getMyApplications(req, res, next) {
    try {
      const applications = await applicationService.getStudentApplications(req.user._id);
      return res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (err) {
      next(err);
    }
  },

  async getRecruiterCandidates(req, res, next) {
    try {
      const result = await applicationService.getRecruiterApplications(req.user._id);
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getJobApplications(req, res, next) {
    try {
      const applications = await applicationService.getJobApplications(
        req.params.jobId,
        req.user._id
      );
      return res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateApplicationStatus(req, res, next) {
    try {
      const application = await applicationService.updateApplicationStatus(
        req.params.id,
        req.user._id,
        req.body.status,
        req.body.note
      );
      return res.status(200).json({
        success: true,
        message: "Application status updated successfully",
        data: application,
      });
    } catch (err) {
      next(err);
    }
  },
};
