import type { Quiz, QuizWithAnswers, QuizResult, UserQuizHistory } from "./types"
import { getDatabase } from "./mongodb"

export async function saveQuiz(quiz: Quiz, correctAnswers: Record<string, string>, userId?: string): Promise<string> {
  try {
    const db = await getDatabase()
    const quizzesCollection = db.collection("quizzes")

    const quizWithAnswers: QuizWithAnswers = {
      ...quiz,
      correctAnswers,
      userId: userId || null,
      createdAt: new Date(),
    }

    await quizzesCollection.insertOne(quizWithAnswers)
    return quiz.quizId
  } catch (error) {
    console.error("Error saving quiz to MongoDB:", error)
    throw new Error("Failed to save quiz")
  }
}

export async function getQuizById(quizId: string): Promise<Quiz | null> {
  try {
    const db = await getDatabase()
    const quizzesCollection = db.collection("quizzes")

    const quiz = await quizzesCollection.findOne({ quizId })

    if (!quiz) {
      return null
    }

    return {
      quizId: quiz.quizId,
      topic: quiz.topic,
      questions: quiz.questions,
    }
  } catch (error) {
    console.error("Error fetching quiz from MongoDB:", error)
    return null
  }
}

export async function getQuizAnswers(quizId: string): Promise<Record<string, string> | null> {
  try {
    const db = await getDatabase()
    const quizzesCollection = db.collection("quizzes")

    const quiz = await quizzesCollection.findOne({ quizId })

    if (!quiz) {
      return null
    }

    return quiz.correctAnswers || null
  } catch (error) {
    console.error("Error fetching quiz answers from MongoDB:", error)
    return null
  }
}

export async function saveQuizResult(
  quizId: string,
  userAnswers: Record<string, string>,
  score: number,
  userId?: string,
): Promise<void> {
  try {
    const db = await getDatabase()
    const resultsCollection = db.collection("quiz_results")

    const result: QuizResult = {
      quizId,
      userId: userId || null,
      userAnswers,
      score,
      completedAt: new Date(),
    }

    await resultsCollection.insertOne(result)
  } catch (error) {
    console.error("Error saving quiz result to MongoDB:", error)
    throw new Error("Failed to save quiz result")
  }
}

export async function getUserQuizHistory(userId: string, topic?: string): Promise<UserQuizHistory[]> {
  try {
    const db = await getDatabase()
    const resultsCollection = db.collection("quiz_results")
    const quizzesCollection = db.collection("quizzes")

    // Get user's quiz results
    const results = await resultsCollection.find({ userId }).sort({ completedAt: -1 }).limit(50).toArray()

    const history: UserQuizHistory[] = []

    for (const result of results) {
      const quiz = await quizzesCollection.findOne({ quizId: result.quizId })
      if (quiz && (!topic || quiz.topic.toLowerCase().includes(topic.toLowerCase()))) {
        history.push({
          quizId: result.quizId,
          topic: quiz.topic,
          score: result.score,
          totalQuestions: Object.keys(quiz.correctAnswers || {}).length,
          completedAt: result.completedAt,
          percentage: Math.round((result.score / Object.keys(quiz.correctAnswers || {}).length) * 100),
        })
      }
    }

    return history
  } catch (error) {
    console.error("Error fetching user quiz history:", error)
    return []
  }
}

export async function getTopicHistory(userId: string, topic: string): Promise<UserQuizHistory[]> {
  return getUserQuizHistory(userId, topic)
}
