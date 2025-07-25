import { type NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { saveQuiz } from "@/lib/quiz-service"
import { generateQuizWithAI, generateFallbackQuiz } from "@/lib/ai-service"
import { getCurrentUser } from "@/lib/auth"
import type { Quiz } from "@/lib/types"

export async function GET(request: NextRequest) {
  const topic = request.nextUrl.searchParams.get("topic")

  if (!topic) {
    return NextResponse.json({ message: "Topic is required" }, { status: 400 })
  }

  try {
    const user = await getCurrentUser()
    const quizId = uuidv4()
    let quizData
    let useAI = false

    // Try to use AI service first
    if (process.env.OPENAI_API_KEY) {
      try {
        console.log(`Generating AI quiz for topic: ${topic}`)
        quizData = await generateQuizWithAI(topic)
        useAI = true
        console.log("Successfully generated quiz with AI")
      } catch (aiError) {
        console.warn("AI service failed, using fallback:", aiError)
        quizData = generateFallbackQuiz(topic)
      }
    } else {
      console.log("OpenAI API key not configured, using fallback")
      quizData = generateFallbackQuiz(topic)
    }

    const quiz: Quiz = {
      quizId,
      topic,
      questions: quizData.questions,
    }

    // Save the quiz to MongoDB with user ID if logged in
    await saveQuiz(quiz, quizData.answers, user?.userId)

    return NextResponse.json({
      quizId: quiz.quizId,
      questions: quiz.questions,
      generatedBy: useAI ? "AI" : "fallback",
    })
  } catch (error) {
    console.error("Error generating quiz:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to generate quiz",
      },
      { status: 500 },
    )
  }
}
