import { SignupForm } from "@/components/auth/signup-form"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Topic Quiz Creator
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Create an account to save your quiz history</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
