import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string | undefined;

if (!API_KEY) {
    console.error("VITE_GOOGLE_API_KEY is not set. Define it in your .env.local file.");
}

const genAI = new GoogleGenerativeAI(API_KEY || "");
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function analyzeLegalDoc(text: string): Promise<string | null> {
    try {
        const prompt = `
        You are an AI assistant simplifying legal documents.
        
        The user uploaded a rental or agreement document. Do the following:
        
        1. Identify important clauses from the text.
        2. For each clause, return:
           - "original": the exact clause text from the document
           - "explanation": a very simple explanation in plain English
        3. Categorize each clause into one of:
           - ✅ safe → standard, fair, harmless, or routine clauses.
           - ⚠️ doubtful → vague, unclear, or slightly restrictive clauses that may need review.
           - ❗ needs_attention → very one-sided, unfair, or high-risk clauses that could cause legal/financial harm.
        4. Highlight overall risks separately.
        
        ⚠️ Rules:
        - Do NOT classify basic details (e.g., rent amount, dates, parties, responsibilities) as "needs_attention" unless they clearly create unusual legal risk.
        - Be conservative: mark as "needs_attention" only if the clause is significantly risky.
        - Always include all three categories (use empty arrays if none).
        - Explanations must be short and simple (max 1–2 sentences).
        
        ⚠️ Important: Output ONLY valid JSON in this structure:
        
        {
          "summary": "...",
          "clauses": {
            "safe": [
              { "original": "...", "explanation": "..." }
            ],
            "doubtful": [
              { "original": "...", "explanation": "..." }
            ],
            "needs_attention": [
              { "original": "...", "explanation": "..." }
            ]
          },
          "risks": [
            "..."
          ]
        }
        `;


        if (!API_KEY) return null;

        const result = await model.generateContent({
            contents: [
                { role: "user", parts: [{ text: prompt }, { text }] },
            ],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        summary: { type: "string" },
                        clauses: {
                            type: "object",
                            properties: {
                                safe: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            original: { type: "string" },
                                            explanation: { type: "string" },
                                        },
                                        required: ["original", "explanation"]
                                    }
                                },
                                doubtful: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            original: { type: "string" },
                                            explanation: { type: "string" },
                                        },
                                        required: ["original", "explanation"]
                                    }
                                },
                                needs_attention: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            original: { type: "string" },
                                            explanation: { type: "string" },
                                        },
                                        required: ["original", "explanation"]
                                    }
                                },
                            },
                            required: ["safe", "doubtful", "needs_attention"]
                        },
                        risks: { type: "array", items: { type: "string" } },
                    },
                    required: ["summary", "clauses", "risks"],
                } as any,
            },
        });

        const response = result.response.text();

        return response;
    } catch (err) {
        console.error("Gemini API Error:", err);
        return null;
    }
}
