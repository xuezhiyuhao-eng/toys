import { GoogleGenAI, Type } from "@google/genai";
import { CartItem, Product } from "../types";

// Initialize Gemini safely
const apiKey = process.env.API_KEY || '';
// Only initialize if key exists to prevent immediate crash, otherwise functions will handle the error
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
const modelName = 'gemini-2.5-flash';

export const generateSmartOrderSummary = async (cartItems: CartItem[]): Promise<string> => {
  if (!ai) return "⚠️ API Key missing. Please configure Vercel environment variables.";
  if (cartItems.length === 0) return "No items in cart.";

  const cartDetails = cartItems.map(item => 
    `- ${item.quantity}x ${item.name} @ $${item.price} each`
  ).join('\n');

  const prompt = `
    You are a professional sales assistant. 
    Create a clean, polite, and formatted text summary of the following order to be sent via WhatsApp or Email.
    Include the total price.
    Add a very short, polite thank you note at the end.
    Do not use markdown formatting like bolding (**), just plain text suitable for a chat app.
    
    Order Details:
    ${cartDetails}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Error generating order summary. Please check your connection.";
  }
};

export const smartFilterProducts = async (query: string, allProducts: Product[]): Promise<string[]> => {
  if (!ai) {
    console.warn("API Key missing for search");
    return [];
  }

  // We send a simplified list to the model to save tokens
  const productContext = allProducts.map(p => ({
    id: p.id,
    name: p.name,
    desc: p.description,
    tags: p.tags.join(', '),
    cat: p.category
  }));

  const prompt = `
    User Query: "${query}"
    
    Based on the user query, select the IDs of the products that are most relevant.
    Return ONLY a JSON array of strings (IDs). If nothing matches, return an empty array.
    
    Products:
    ${JSON.stringify(productContext)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
      }
    });
    
    const jsonText = response.text;
    if (!jsonText) return [];
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Gemini Search Error:", error);
    return [];
  }
};