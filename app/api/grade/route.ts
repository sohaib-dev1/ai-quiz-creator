import { type NextRequest, NextResponse } from "next/server"
import { getQuizAnswers, saveQuizResult } from "@/lib/quiz-service"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const quizId = request.nextUrl.searchParams.get("quizId")

  if (!quizId) {
    return NextResponse.json({ message: "Quiz ID is required" }, { status: 400 })
  }

  try {
    const user = await getCurrentUser()
    const { answers } = await request.json()

    if (!answers || typeof answers !== "object") {
      return NextResponse.json({ message: "Answers are required" }, { status: 400 })
    }

    // Get the correct answers from MongoDB
    const correctAnswers = await getQuizAnswers(quizId)

    if (!correctAnswers) {
      return NextResponse.json({ message: "Quiz not found" }, { status: 404 })
    }

    // Calculate the score
    let correct = 0
    const feedback = Object.keys(correctAnswers).map((questionId) => {
      const isCorrect = answers[questionId] === correctAnswers[questionId]
      if (isCorrect) correct++

      return {
        id: Number.parseInt(questionId),
        yourAnswer: answers[questionId] || "Not answered",
        correctAnswer: correctAnswers[questionId],
      }
    })

    // Save the quiz result to MongoDB with user ID if logged in
    await saveQuizResult(quizId, answers, correct, user?.userId)

    return NextResponse.json({
      correct,
      total: Object.keys(correctAnswers).length,
      feedback,
    })
  } catch (error) {
    console.error("Error grading quiz:", error)
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to grade quiz",
      },
      { status: 500 },
    )
  }
}
