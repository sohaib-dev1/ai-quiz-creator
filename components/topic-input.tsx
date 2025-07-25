"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"

export function TopicInput() {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) {
      setError("Please enter a topic")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/generate?topic=${encodeURIComponent(topic)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        let errorMessage = "Failed to generate quiz"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch {
          // If we can't parse the error response, use the default message
          errorMessage = `Server error: ${response.status} ${response.statusText}`
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (!data.quizId) {
        throw new Error("Invalid response from server")
      }

      router.push(`/quiz/${data.quizId}`)
    } catch (err) {
      console.error("Quiz generation error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-3">Create Your Quiz</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Enter any topic and our AI will generate a 5-question multiple-choice quiz for you to test your knowledge.
        </p>
      </div>

      <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-lg">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Input
                  placeholder="Enter a topic (e.g., Ancient Rome, Quantum Physics, Jazz Music)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="pl-4 pr-4 py-6 text-lg"
                  disabled={loading}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
            <Button
              type="submit"
              className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Quiz
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
