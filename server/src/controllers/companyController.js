import { Company } from "../models/Company.js";

export const companyController = {
  async getMyCompany(req, res, next) {
    try {
      const company = await Company.findOne({ createdBy: req.user._id });
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
      const { name, website, industry, location, description, tagline, headquarters } = req.body;
      let company = await Company.findOne({ createdBy: req.user._id });
      if (!company) {
        if (!name?.trim()) {
          const error = new Error("Company name is required to create a company profile.");
          error.statusCode = 400;
          throw error;
        }
        company = new Company({ name: name.trim(), createdBy: req.user._id });
      }

      if (name) company.name = name.trim();
      if (website !== undefined) company.website = website.trim();
      if (industry !== undefined) company.industry = industry.trim();
      if (location !== undefined) company.location = location.trim();
      if (description !== undefined) company.description = description.trim();
      if (tagline !== undefined) company.tagline = tagline.trim();
      if (headquarters !== undefined) company.headquarters = headquarters.trim();

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
