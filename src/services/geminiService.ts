import { GoogleGenAI } from "@google/genai";

// Guard against missing API key in client-side execution
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
try {
  if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI", e);
}

export const generateHypothesis = async (problem: string): Promise<{ hypothesis: string, metric: string } | null> => {
  // If no key, return mock data (or handle error)
  if (!ai) {
    console.warn("Gemini API Key not found.");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      hypothesis: "If we optimize the onboarding flow, then retention will increase by 10%.",
      metric: "Day 7 Retention"
    };
  }

  try {
    const model = ai.models;
    const prompt = `
      You are a Senior Growth Marketing Strategist.
      I have a problem statement: "${problem}".
      
      Please generate a solid experimentation hypothesis in the format: "If [variable], then [outcome], because [rationale]."
      Also suggest the primary metric to track.
      
      Return the response in JSON format with keys: "hypothesis" and "metric".
    `;

    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return null;
  } catch (error) {
    console.error("Error generating hypothesis:", error);
    return null;
  }
};
