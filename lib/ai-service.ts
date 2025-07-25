import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { AIQuizResponse } from "./types"

export async function generateQuizWithAI(topic: string): Promise<AIQuizResponse> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured")
  }

  try {
    const prompt = `Generate a 5-question multiple-choice quiz about "${topic}". 
    
    Requirements:
    - Each question should have exactly 4 options (A, B, C, D)
    - Questions should be educational and factual
    - Difficulty should be intermediate level
    - Cover different aspects of the topic
    - Avoid overly obscure or trivial questions
    
    Format your response as a JSON object with this exact structure:
    {
      "questions": [
        {
          "id": 1,
          "text": "Question text here?",
          "options": ["Correct answer", "Wrong option 1", "Wrong option 2", "Wrong option 3"]
        }
      ],
      "answers": {
        "1": "Correct answer"
      }
    }
    
    Important: 
    - The correct answer should always be the first option in the options array
    - Make sure all questions are related to "${topic}"
    - Ensure the JSON is valid and properly formatted`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt,
      temperature: 0.7,
    })

    // Parse the AI response
    let aiResponse: any
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error("No JSON found in AI response")
      }

      aiResponse = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error("Failed to parse AI response:", text)
      throw new Error("Invalid JSON response from AI")
    }

    // Validate the response structure
    if (!aiResponse.questions || !Array.isArray(aiResponse.questions) || aiResponse.questions.length !== 5) {
      throw new Error("AI response does not contain 5 questions")
    }

    if (!aiResponse.answers || typeof aiResponse.answers !== "object") {
      throw new Error("AI response does not contain answers")
    }

    // Validate each question
    for (let i = 0; i < aiResponse.questions.length; i++) {
      const question = aiResponse.questions[i]
      if (!question.text || !Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error(`Question ${i + 1} is malformed`)
      }

      // Ensure the question has an ID
      question.id = i + 1
    }

    return {
      questions: aiResponse.questions,
      answers: aiResponse.answers,
    }
  } catch (error) {
    console.error("Error generating quiz with AI:", error)
    throw error
  }
}

// Fallback function for when AI service fails
export function generateFallbackQuiz(topic: string): AIQuizResponse {
  const topicLower = topic.toLowerCase()

  let questions = []
  let answers: Record<string, string> = {}

  if (topicLower.includes("javascript") || topicLower.includes("programming")) {
    questions = [
      {
        id: 1,
        text: "What does 'DOM' stand for in web development?",
        options: [
          "Document Object Model",
          "Data Object Management",
          "Dynamic Object Method",
          "Document Oriented Model",
        ],
      },
      {
        id: 2,
        text: "Which method is used to add an element to the end of an array in JavaScript?",
        options: ["push()", "append()", "add()", "insert()"],
      },
      {
        id: 3,
        text: "What is the correct way to declare a constant in JavaScript?",
        options: ["const myVar = 5;", "constant myVar = 5;", "let myVar = 5;", "var myVar = 5;"],
      },
      {
        id: 4,
        text: "Which of these is NOT a JavaScript data type?",
        options: ["float", "string", "boolean", "number"],
      },
      {
        id: 5,
        text: "What does the '===' operator do in JavaScript?",
        options: ["Strict equality comparison", "Assignment", "Loose equality comparison", "Not equal comparison"],
      },
    ]
    answers = {
      "1": "Document Object Model",
      "2": "push()",
      "3": "const myVar = 5;",
      "4": "float",
      "5": "Strict equality comparison",
    }
  } else if (topicLower.includes("react")) {
    questions = [
      {
        id: 1,
        text: "What is JSX in React?",
        options: ["JavaScript XML syntax extension", "Java Syntax Extension", "JSON XML", "JavaScript eXtended"],
      },
      {
        id: 2,
        text: "Which hook is used to manage state in functional components?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
      },
      {
        id: 3,
        text: "What is the virtual DOM?",
        options: [
          "A JavaScript representation of the real DOM",
          "A new browser API",
          "A React component",
          "A CSS framework",
        ],
      },
      {
        id: 4,
        text: "How do you pass data from parent to child component?",
        options: ["Props", "State", "Context", "Refs"],
      },
      {
        id: 5,
        text: "What is the purpose of useEffect hook?",
        options: ["Handle side effects", "Manage state", "Create components", "Style components"],
      },
    ]
    answers = {
      "1": "JavaScript XML syntax extension",
      "2": "useState",
      "3": "A JavaScript representation of the real DOM",
      "4": "Props",
      "5": "Handle side effects",
    }
  } else {
    // Generic questions for any topic
    questions = [
      {
        id: 1,
        text: `What is a fundamental concept in ${topic}?`,
        options: [
          `Basic principles of ${topic}`,
          `Advanced theories only`,
          `Unrelated concepts`,
          `Historical background only`,
        ],
      },
      {
        id: 2,
        text: `Which approach is most effective when learning ${topic}?`,
        options: [
          `Start with fundamentals and build up`,
          `Jump to advanced topics`,
          `Memorize without understanding`,
          `Avoid practical application`,
        ],
      },
      {
        id: 3,
        text: `What makes ${topic} important in its field?`,
        options: [
          `Its practical applications and relevance`,
          `Its complexity alone`,
          `Its historical significance only`,
          `Its theoretical nature only`,
        ],
      },
      {
        id: 4,
        text: `When studying ${topic}, what should be prioritized?`,
        options: [
          `Understanding core concepts`,
          `Memorizing definitions`,
          `Learning advanced topics first`,
          `Focusing on exceptions only`,
        ],
      },
      {
        id: 5,
        text: `What is the best way to apply knowledge of ${topic}?`,
        options: [
          `Through practical exercises and real-world examples`,
          `Only through theoretical study`,
          `By avoiding hands-on practice`,
          `Through memorization alone`,
        ],
      },
    ]
    answers = {
      "1": `Basic principles of ${topic}`,
      "2": "Start with fundamentals and build up",
      "3": "Its practical applications and relevance",
      "4": "Understanding core concepts",
      "5": "Through practical exercises and real-world examples",
    }
  }

  return { questions, answers }
}
