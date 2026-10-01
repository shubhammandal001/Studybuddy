import express from "express";
import { register, login } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, (req, res) => {
  res.json({ message: "You have access to this protected route", user: req.user });
});

router.post("/register", register)
router.post("/login", login)

export default router