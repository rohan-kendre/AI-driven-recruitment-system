import { Router } from "express";
import { applicationController } from "../controllers/applicationController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all application routes
router.use(protect);

// Student endpoints
router.post("/", authorizeRoles("STUDENT"), applicationController.createApplication);
router.get("/my", authorizeRoles("STUDENT"), applicationController.getMyApplications);

// Recruiter endpoints
router.get("/candidates", authorizeRoles("RECRUITER"), applicationController.getRecruiterCandidates);
router.get("/jobs/:jobId", authorizeRoles("RECRUITER"), applicationController.getJobApplications);
router.patch("/:id/status", authorizeRoles("RECRUITER"), applicationController.updateApplicationStatus);

export default router;
