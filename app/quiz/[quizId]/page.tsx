import { QuizComponent } from "@/components/quiz-component"
import { Header } from "@/components/header"
import { getQuizById } from "@/lib/quiz-service"
import { notFound } from "next/navigation"

export default async function QuizPage({ params }: { params: { quizId: string } }) {
  const quiz = await getQuizById(params.quizId)

  if (!quiz) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Header />
        <div className="mt-8">
          <QuizComponent quiz={quiz} />
        </div>
      </div>
    </main>
  )
}
