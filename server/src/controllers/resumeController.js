import { analyzeUploadedResume, listResumeAnalyses } from '../services/resumeService.js'

export const resumeController = {
  async analyze(req, res, next) {
    try {
      const data = await analyzeUploadedResume(req.user._id, req.file, req.body.jobDescription)
      res.status(200).json({ success: true, data })
    } catch (error) { next(error) }
  },
  async list(req, res, next) {
    try {
      const data = await listResumeAnalyses(req.user._id)
      res.status(200).json({ success: true, data })
    } catch (error) { next(error) }
  },
}
