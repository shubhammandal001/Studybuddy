import { GoogleGenAI } from "@google/genai";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function generateAnswer(prompt,config) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const models = [
    process.env.GEMINI_MODEL,
    process.env.GEMINI_FALLBACK_MODEL,
  ].filter(Boolean);

  let lastErr;
  for (const model of models) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await ai.models.generateContent({ model, contents: prompt,config });
        return res.text;
      } catch (err) {
        lastErr = err;
        const busy = /503|UNAVAILABLE|high demand|429/i.test(err.message);
        if (!busy) throw err; // doosri tarah ka error ho to turant bahar
        await sleep(1500 * (attempt + 1)); // 1.5s, 3s, 4.5s ruk ke retry
      }
    }
  }
  throw lastErr;
}