import { Router } from 'express'
import multer from 'multer'
import rateLimit from 'express-rate-limit'
import { protect, authorizeRoles } from '../middleware/authMiddleware.js'
import { resumeController } from '../controllers/resumeController.js'
import { MAX_RESUME_SIZE, isSupportedResume } from '../services/resumeService.js'

const router = Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_SIZE, files: 1 },
  fileFilter(_req, file, callback) {
    callback(null, isSupportedResume(file))
  },
})
const atsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 20,
  keyGenerator: (req) => req.user._id.toString(),
  message: { success: false, message: 'Too many resume analyses. Please try again later.' },
})

router.use(protect, authorizeRoles('STUDENT'))
router.get('/analyses', resumeController.list)
router.post('/ats', atsLimiter, upload.single('resume'), resumeController.analyze)
export default router
