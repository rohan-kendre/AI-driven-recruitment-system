import { Router } from "express";
import { interviewController } from "../controllers/interviewController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", interviewController.getInterviews);
router.post("/", authorizeRoles("RECRUITER"), interviewController.createInterview);
router.patch("/:id", authorizeRoles("RECRUITER"), interviewController.updateInterview);

export default router;
