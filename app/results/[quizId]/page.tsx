import { Header } from "@/components/header"
import { QuizResults } from "@/components/quiz-results"
import { getQuizById } from "@/lib/quiz-service"
import { getQuizResults } from "@/lib/results-service"
import { notFound } from "next/navigation"

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: { quizId: string }
  searchParams: { score: string; total: string }
}) {
  const quiz = await getQuizById(params.quizId)

  if (!quiz) {
    notFound()
  }

  const score = Number.parseInt(searchParams.score || "0")
  const total = Number.parseInt(searchParams.total || "5")
  const feedback = await getQuizResults(params.quizId)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
        <div className="mt-8">
          <QuizResults quiz={quiz} score={score} total={total} feedback={feedback} />
        </div>
      </div>
    </main>
  )
}
