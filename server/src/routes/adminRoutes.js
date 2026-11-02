import { Router } from "express";
import { adminController } from "../controllers/adminController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.use(authorizeRoles("ADMIN"));

router.get("/users", adminController.getUsers);
router.patch("/users/:id/status", adminController.updateUserStatus);
router.patch("/users/:id/approval", adminController.updateUserApproval);

export default router;
