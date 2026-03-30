import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getJobMatches(resumeText: string, jobDescriptions: string[]) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Analyze the following resume text and match it against the provided list of job descriptions.
        Return a JSON array of indices representing the best matches (top 3), along with a brief explanation for each.
        
        Resume:
        ${resumeText}
        
        Jobs:
        ${jobDescriptions.map((desc, i) => `[Job ${i}]: ${desc}`).join('\n\n')}
      `,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Matching Error:", error);
    return [];
  }
}
