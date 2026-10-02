import pdf from "pdf-parse/lib/pdf-parse.js";
import Document from "../models/Document.js";

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No PDF uploaded" });

    const data = await pdf(req.file.buffer);
    const text = data.text.trim();

    console.log('pages:',data.numpages, '| text length:', text.length)
    
    if (!text)
      return res.status(400).json({ message: "No readable text found (scanned PDF?)" });

    const doc = await Document.create({
      user: req.user._id,
      title: req.file.originalname,
      pageCount: data.numpages,
      text,
    });

    res.status(201).json({
      _id: doc._id, title: doc.title,
      pageCount: doc.pageCount, createdAt: doc.createdAt,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user._id })
      .select("-text")
      .sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!doc) return res.status(404).json({ message: "Document not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};