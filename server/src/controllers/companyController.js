import { Company } from "../models/Company.js";
import { resolveRecruiterCompany } from "../services/jobService.js";

export const companyController = {
  async getMyCompany(req, res, next) {
    try {
      const company = await resolveRecruiterCompany(req.user._id);
      return res.status(200).json({
        success: true,
        data: company,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateMyCompany(req, res, next) {
    try {
      const { name, website, industry, location, description } = req.body;
      let company = await Company.findOne({ createdBy: req.user._id });
      if (!company) {
        company = await resolveRecruiterCompany(req.user._id);
      }

      if (name) company.name = name.trim();
      if (website !== undefined) company.website = website.trim();
      if (industry !== undefined) company.industry = industry.trim();
      if (location !== undefined) company.location = location.trim();
      if (description !== undefined) company.description = description.trim();

      await company.save();

      return res.status(200).json({
        success: true,
        message: "Company profile updated successfully",
        data: company,
      });
    } catch (err) {
      next(err);
    }
  },
};
