import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  uploadDocument, getDocuments, deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

router.use(protect);
router.post("/", upload.single("file"), uploadDocument);
router.get("/", getDocuments);
router.delete("/:id", deleteDocument);

export default router;