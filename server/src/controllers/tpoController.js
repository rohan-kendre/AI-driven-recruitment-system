import { User } from "../models/User.js";
import { Job } from "../models/Job.js";
import { Application } from "../models/Application.js";
import { Offer } from "../models/Offer.js";
import { Interview } from "../models/Interview.js";

export const tpoController = {
  async getStats(req, res, next) {
    try {
      const [
        totalStudents,
        totalRecruiters,
        totalJobs,
        openJobs,
        totalApplications,
        shortlistedCount,
        interviewCount,
        offersCount,
        acceptedOffers,
        placedStudentIds,
      ] = await Promise.all([
        User.countDocuments({ role: "STUDENT" }),
        User.countDocuments({ role: "RECRUITER" }),
        Job.countDocuments(),
        Job.countDocuments({ status: "OPEN" }),
        Application.countDocuments(),
        Application.countDocuments({ status: "SHORTLISTED" }),
        Interview.countDocuments(),
        Offer.countDocuments(),
        Offer.countDocuments({ status: "ACCEPTED" }),
        Offer.distinct("studentId", { status: "ACCEPTED" }),
      ]);

      // Placement rate counts distinct students with an accepted offer, over all registered students.
      const placedStudents = placedStudentIds.length;
      const placementRate =
        totalStudents > 0
          ? Math.min(100, Math.round((placedStudents / totalStudents) * 100))
          : 0;

      return res.status(200).json({
        success: true,
        data: {
          totalStudents,
          totalRecruiters,
          totalJobs,
          openJobs,
          totalApplications,
          shortlistedCount,
          interviewCount,
          offersCount,
          acceptedOffers,
          placedStudents,
          placementRate,
          averagePackage: null,
          highestPackage: null,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
