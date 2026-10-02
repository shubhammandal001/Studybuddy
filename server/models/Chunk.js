import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  document: { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true, index: true },
  index: Number,
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
});

export default mongoose.model("Chunk", chunkSchema);