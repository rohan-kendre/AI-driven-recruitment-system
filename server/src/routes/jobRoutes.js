import { Router } from "express";
import { jobController } from "../controllers/jobController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all job routes
router.use(protect);

router.get("/mine", authorizeRoles("RECRUITER"), jobController.getMyJobs);
router.get("/:id", jobController.getJobById);
router.get("/", jobController.getJobs);

router.post("/", authorizeRoles("RECRUITER"), jobController.createJob);
router.put("/:id", authorizeRoles("RECRUITER"), jobController.updateJob);
router.patch("/:id", authorizeRoles("RECRUITER"), jobController.updateJob);
router.patch("/:id/status", authorizeRoles("RECRUITER"), jobController.updateJobStatus);

export default router;
