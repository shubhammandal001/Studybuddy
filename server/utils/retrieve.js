import mongoose from "mongoose";
import Chunk from "../models/Chunk.js";
import { embedTexts } from "./embeddings.js";

export async function retrieveChunks(question, userId, documentId, limit = 5) {
  // sawal ko bhi numbers mein badle rhe hai kuki (taskType alag hota hai)
  const [queryVector] = await embedTexts([question], "RETRIEVAL_QUERY");

  return Chunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector,
        numCandidates: 100,
        limit,
        filter: {
          $and: [
            { user: { $eq: new mongoose.Types.ObjectId(userId) } },
            { document: { $eq: new mongoose.Types.ObjectId(documentId) } },
          ],
        },
      },
    },
    {
      $project: {
        text: 1,
        index: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);
}