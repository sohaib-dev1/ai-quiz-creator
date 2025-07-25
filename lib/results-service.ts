import type { QuizFeedback } from "./types"
import { getDatabase } from "./mongodb"

export async function getQuizResults(quizId: string): Promise<QuizFeedback[]> {
  try {
    const db = await getDatabase()
    const resultsCollection = db.collection("quiz_results")

    // Get the most recent result for this quiz
    const result = await resultsCollection.findOne({ quizId }, { sort: { completedAt: -1 } })

    if (!result) {
      return []
    }

    // Get the correct answers
    const quizzesCollection = db.collection("quizzes")
    const quiz = await quizzesCollection.findOne({ quizId })

    if (!quiz) {
      return []
    }

    const correctAnswers = quiz.correctAnswers || {}
    const userAnswers = result.userAnswers || {}

    return Object.keys(correctAnswers).map((questionId) => ({
      id: Number.parseInt(questionId),
      yourAnswer: userAnswers[questionId] || "Not answered",
      correctAnswer: correctAnswers[questionId],
    }))
  } catch (error) {
    console.error("Error fetching quiz results from MongoDB:", error)
    return []
  }
}
