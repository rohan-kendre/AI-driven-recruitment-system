import { Router } from "express";
import { tpoController } from "../controllers/tpoController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/stats", authorizeRoles("TPO", "ADMIN"), tpoController.getStats);

export default router;
