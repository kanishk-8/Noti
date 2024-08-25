const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.error("API key is missing");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 0.7, // Adjust temperature to balance creativity and coherence
  topP: 0.9, // Adjust topP for more diverse responses
  topK: 50, // Adjust topK to limit the number of choices considered
  maxOutputTokens: 200, // Limit the output to a reasonable length
  responseMimeType: "text/plain",
};

async function generateSuggestions(todos) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Here are some tasks: ${todos
                .map((todo) => todo.task)
                .join(
                  ", "
                )}. Can you provide some general task management tips?`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(
      "Generate general task management suggestions."
    );
    const suggestions = result.response.text().trim(); // Trim any leading or trailing whitespace

    // Return the suggestions directly
    return suggestions || "No suggestions available.";
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return "Failed to generate suggestions.";
  }
}

module.exports = { generateSuggestions };
