import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { askQuestion } from "../controllers/chatController.js";

const router = express.Router();
router.post("/", protect, askQuestion);

export default router;