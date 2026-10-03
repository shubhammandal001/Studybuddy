import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { generateQuiz } from "../controllers/quizController.js";

const router = express.Router();
router.post("/", protect, generateQuiz);

export default router;