"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/loading-spinner"
import type { Quiz } from "@/lib/types"
import { motion } from "framer-motion"

export function QuizComponent({ quiz }: { quiz: Quiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0
  const hasAnsweredCurrent = answers[currentQuestion.id.toString()] !== undefined
  const hasAnsweredAll = quiz.questions.every((q) => answers[q.id.toString()] !== undefined)

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id.toString()]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/grade?quizId=${quiz.quizId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to grade quiz")
      }

      const data = await response.json()
      router.push(`/results/${quiz.quizId}?score=${data.correct}&total=${data.total}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quiz: {quiz.topic}</h2>
        <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>

      <div className="relative">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-2 border-purple-100 dark:border-purple-900/30 shadow-lg">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="text-xl font-medium">{currentQuestion.text}</h3>
                <RadioGroup value={answers[currentQuestion.id.toString()]} onValueChange={handleAnswer}>
                  {currentQuestion.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} className="text-purple-600" />
                      <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 pb-4">
              <Button variant="outline" onClick={handlePrevious} disabled={isFirstQuestion}>
                Previous
              </Button>
              <div className="flex space-x-2">
                {!isLastQuestion ? (
                  <Button
                    onClick={handleNext}
                    disabled={!hasAnsweredCurrent}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!hasAnsweredAll || loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {loading ? <LoadingSpinner /> : "Submit Quiz"}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md">{error}</div>
      )}

      <div className="flex justify-center mt-6">
        <div className="flex space-x-2">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentQuestionIndex
                  ? "bg-purple-600 scale-125"
                  : answers[quiz.questions[index].id.toString()] !== undefined
                    ? "bg-purple-300 dark:bg-purple-700"
                    : "bg-slate-300 dark:bg-slate-700"
              }`}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
