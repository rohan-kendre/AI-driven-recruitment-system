import mongoose from 'mongoose'

const resumeAnalysisSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalFileName: { type: String, required: true, maxlength: 255 },
  mimeType: { type: String, required: true },
  fileSize: { type: Number, required: true, min: 1, max: 5 * 1024 * 1024 },
  contentHash: { type: String, required: true },
  contextHash: { type: String, required: true },
  atsScore: { type: Number, required: true, min: 0, max: 100 },
  strengths: { type: [String], default: [] },
  weaknesses: { type: [String], default: [] },
  missingSections: { type: [String], default: [] },
  keywordFeedback: { type: [String], default: [] },
  formattingFeedback: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  jobMatchScore: { type: Number, min: 0, max: 100 },
  missingKeywords: { type: [String], default: [] },
  model: { type: String, required: true },
  promptVersion: { type: String, required: true },
}, { timestamps: true })

resumeAnalysisSchema.index({ studentId: 1, contentHash: 1, contextHash: 1, model: 1, promptVersion: 1 }, { unique: true })
resumeAnalysisSchema.index({ studentId: 1, createdAt: -1 })

export const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema)
