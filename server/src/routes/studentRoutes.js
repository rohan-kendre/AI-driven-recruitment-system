import { Router } from "express";
import { studentController } from "../controllers/studentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/profile", authorizeRoles("STUDENT"), studentController.getProfile);
router.put("/profile", authorizeRoles("STUDENT"), studentController.updateProfile);

export default router;
