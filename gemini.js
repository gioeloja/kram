import {GEMINI_API_KEY} from "@env"


const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = GEMINI_API_KEY;
// Function to run chat with generative AI model
async function runChatWithInput(userInput) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "You will be given text translated from an image of a worksheet. Your job is to determine what is being learned and return new questions of the same type of question. MAKE SURE THE ANSWER IS RIGHT, AND NO 'ALL OF THE ABOVE'!!! MUST BE this format: { \"question\": \"{question}\",\"answer1\": \"ans1\", \"answer2\": \"ans2\", \"answer3\": \"ans3\", \"answer4\": \"ans4\", \"correct\": {NO  square brackets!!!! int for correct answer index in array }}, { \"question\": \"{question}\",\"answer1\": etc etc"}],
      },
      {
        role: "model",
        parts: [{ text: "Okay"}],
      },
      
    ],
  });

  const result = await chat.sendMessage(userInput);
  const response = result.response;
  return response.text();
}

module.exports = { runChatWithInput };
