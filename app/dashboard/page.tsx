import { getCurrentUser } from "@/lib/auth"
import { getUserQuizHistory } from "@/lib/quiz-service"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const quizHistory = await getUserQuizHistory(user.userId)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <DashboardContent user={user} quizHistory={quizHistory} />
    </div>
  )
}
