import { Router } from "express";
import { offerController } from "../controllers/offerController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", offerController.getOffers);
router.post("/", authorizeRoles("RECRUITER"), offerController.createOffer);
router.patch("/:id/status", authorizeRoles("STUDENT"), offerController.updateOfferStatus);

export default router;
