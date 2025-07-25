import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "./ui/button"
import { User } from "lucide-react"

export async function Header() {
  const user = await getCurrentUser()

  return (
    <header className="flex items-center justify-between py-6">
      <div>
        <Link href="/">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Topic Quiz Creator
          </h1>
        </Link>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Generate quizzes on any topic with AI</p>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        )}
        <ModeToggle />
      </div>
    </header>
  )
}
