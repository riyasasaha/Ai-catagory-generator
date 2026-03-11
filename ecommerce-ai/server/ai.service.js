const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `You are a strict JSON API for an Applied AI Sustainable Commerce platform. 
Your primary goal is to categorize products, generate SEO tags, and identify sustainability filters based on the product name and description.

INPUT FORMAT: You will receive the product name, description, and an array of allowed primary categories.

OUTPUT FORMAT: You MUST return a purely valid JSON string with the following schema:
{
  "primary_category": "string (must be chosen exactly from the allowed primary categories)",
  "sub_category": "string",
  "seo_tags": ["string", "string", "string", "string", "string"], 
  "sustainability_filters": ["string", "string"]
}

RULES:
- Do not wrap the JSON in markdown formatting (like \`\`\`json). Just the raw JSON.
- The seo_tags array should contain 5-10 descriptive strings.
- The sustainability_filters array should contain filters like "Eco-friendly", "Cruelty-free", "Vegan", "Organic", "Recycled Materials", etc. if applicable based on the product description. 
- The output MUST parse cleanly with JSON.parse().`;

const callGemini = async (productData) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const userInput = JSON.stringify(productData);

        // Combining System prompt with user input to ensure the AI follows the schema structure.
        const prompt = `${systemPrompt}\n\nUSER INPUT:\n${userInput}`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Strip markdown codeblock backticks if present
        responseText = responseText.replace(/```json\n?|```/gi, '').trim();

        return {
            systemPrompt: systemPrompt,
            userInput: userInput,
            rawAiResponse: responseText,
        };
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};

module.exports = { callGemini };
