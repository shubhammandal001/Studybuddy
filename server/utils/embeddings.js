import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-embedding-001";
const DIMS = 768;

export async function embedTexts(texts, taskType = "RETRIEVAL_DOCUMENT") {

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const all = [];
  const BATCH = 20;

  for (let i = 0; i < texts.length; i += BATCH) {
    const res = await ai.models.embedContent({
      model: MODEL,
      contents: texts.slice(i, i + BATCH),
      config: { taskType, outputDimensionality: DIMS },
    });
    all.push(...res.embeddings.map((e) => e.values));
  }
  
  return all;
}