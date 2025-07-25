"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, RefreshCw, User } from "lucide-react"
import type { Quiz, QuizFeedback } from "@/lib/types"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"

export function QuizResults({
  quiz,
  score,
  total,
  feedback,
}: {
  quiz: Quiz
  score: number
  total: number
  feedback: QuizFeedback[]
}) {
  const [showConfetti, setShowConfetti] = useState(true)

  // Trigger confetti if score is good
  if (showConfetti && score / total >= 0.7) {
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }, 500)
    setShowConfetti(false)
  }

  const percentage = Math.round((score / total) * 100)

  let message = ""
  let messageColor = ""

  if (percentage >= 80) {
    message = "Excellent! You're a master of this topic!"
    messageColor = "text-green-600 dark:text-green-400"
  } else if (percentage >= 60) {
    message = "Good job! You have a solid understanding."
    messageColor = "text-blue-600 dark:text-blue-400"
  } else if (percentage >= 40) {
    message = "Not bad, but there's room for improvement."
    messageColor = "text-amber-600 dark:text-amber-400"
  } else {
    message = "Keep studying! You'll get better with practice."
    messageColor = "text-red-600 dark:text-red-400"
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Quiz Results</h2>
        <p className="text-slate-600 dark:text-slate-400">Topic: {quiz.topic}</p>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-lg text-center p-6">
          <div className="text-6xl font-bold mb-4">
            {score}/{total}
          </div>
          <div className="text-2xl font-medium mb-2">{percentage}%</div>
          <p className={`text-lg ${messageColor}`}>{message}</p>
        </Card>
      </motion.div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Question Breakdown</h3>

        {feedback.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="border-2 border-slate-100 dark:border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {item.yourAnswer === item.correctAnswer ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-2">{quiz.questions.find((q) => q.id === item.id)?.text}</p>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Your answer: </span>
                        <span
                          className={
                            item.yourAnswer === item.correctAnswer
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }
                        >
                          {item.yourAnswer}
                        </span>
                      </div>
                      {item.yourAnswer !== item.correctAnswer && (
                        <div>
                          <span className="font-medium">Correct answer: </span>
                          <span className="text-green-600 dark:text-green-400">{item.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-4 pt-4">
        <Link href="/dashboard">
              <Button variant="outline" className="gap-2">
                <User className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
        <Link href="/">
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <RefreshCw className="h-4 w-4" />
            New Quiz
          </Button>
        </Link>
      </div>
    </div>
  )
}
