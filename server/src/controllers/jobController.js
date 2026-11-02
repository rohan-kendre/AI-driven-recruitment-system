import { jobService } from "../services/jobService.js";

export const jobController = {
  async getJobs(req, res, next) {
    try {
      const user = req.user;
      if (user?.role === "STUDENT") {
        const jobs = await jobService.getJobsForStudent(user._id);
        return res.status(200).json({ success: true, data: jobs });
      }
      if (user?.role === "RECRUITER") {
        const jobs = await jobService.getJobsForRecruiter(user._id);
        return res.status(200).json({ success: true, data: jobs });
      }
      // Fallback for TPO/ADMIN: return all jobs
      const jobs = await jobService.getJobsForStudent(user?._id);
      return res.status(200).json({ success: true, data: jobs });
    } catch (err) {
      next(err);
    }
  },

  async getMyJobs(req, res, next) {
    try {
      const jobs = await jobService.getJobsForRecruiter(req.user._id);
      return res.status(200).json({ success: true, data: jobs });
    } catch (err) {
      next(err);
    }
  },

  async getJobById(req, res, next) {
    try {
      const job = await jobService.getJobById(req.params.id);
      if (req.user.role === "STUDENT" && (job.status !== "OPEN" || new Date(job.deadline) < new Date())) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
      if (req.user.role === "RECRUITER" && job.recruiterId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
      return res.status(200).json({ success: true, data: job });
    } catch (err) {
      next(err);
    }
  },

  async createJob(req, res, next) {
    try {
      const job = await jobService.createJob(req.user._id, req.body);
      return res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateJob(req, res, next) {
    try {
      const job = await jobService.updateJob(req.params.id, req.user._id, req.body);
      return res.status(200).json({
        success: true,
        message: "Job updated successfully",
        data: job,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateJobStatus(req, res, next) {
    try {
      const job = await jobService.updateJobStatus(req.params.id, req.user._id, req.body.status);
      return res.status(200).json({
        success: true,
        message: "Job status updated successfully",
        data: job,
      });
    } catch (err) {
      next(err);
    }
  },
};
