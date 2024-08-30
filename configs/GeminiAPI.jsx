const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyDlnzwRPsEzpEgYJqO1aWuNiHlAmUCTr_g";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.7,
  topP: 0.9,
  topK: 50,
  maxOutputTokens: 200,
};

async function generateNotes(userInput) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: userInput, // Use user input directly
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("Generate notes.");
    const suggestions = (await result.response.text()).trim();

    return suggestions || "No suggestions available.";
  } catch (error) {
    console.error("Error generating suggestions:", error.message);
    return "Failed to generate suggestions.";
  }
}

module.exports = { generateNotes };
