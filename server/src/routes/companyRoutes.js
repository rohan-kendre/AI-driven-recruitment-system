import { Router } from "express";
import { companyController } from "../controllers/companyController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);
router.get("/mine", authorizeRoles("RECRUITER"), companyController.getMyCompany);
router.put("/mine", authorizeRoles("RECRUITER"), companyController.updateMyCompany);

export default router;
