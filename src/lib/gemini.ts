import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeEmotion(text: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const prompt = `Analyze the emotional content of this journal entry. 
    Format your response as a JSON object with properties: "emotion", "keywords" (array of strings), and "summary".
    
    Journal Entry: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    // Clean potential markdown from JSON response
    const jsonString = responseText.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Gemini analysis error:", error);
    // Fallback if LLM fails or API key is missing
    return {
      emotion: "error",
      keywords: [],
      summary: "Analysis failed.",
    };
  }
}
