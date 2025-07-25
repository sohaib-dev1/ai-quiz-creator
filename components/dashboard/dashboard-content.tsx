"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from "@/components/mode-toggle"
import { TopicInput } from "@/components/topic-input"
import type { AuthUser, UserQuizHistory } from "@/lib/types"
import { LogOut, Trophy, Clock, Target, TrendingUp, Calendar, Award } from "lucide-react"

interface DashboardContentProps {
  user: AuthUser
  quizHistory: UserQuizHistory[]
}

export function DashboardContent({ user, quizHistory }: DashboardContentProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setLoading(true)
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate stats
  const totalQuizzes = quizHistory.length
  const averageScore =
    totalQuizzes > 0 ? Math.round(quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) / totalQuizzes) : 0
  const bestScore = totalQuizzes > 0 ? Math.max(...quizHistory.map((quiz) => quiz.percentage)) : 0
  const recentQuizzes = quizHistory.slice(0, 5)

  // Group quizzes by topic for comparison
  const topicGroups = quizHistory.reduce(
    (groups, quiz) => {
      const topic = quiz.topic
      if (!groups[topic]) {
        groups[topic] = []
      }
      groups[topic].push(quiz)
      return groups
    },
    {} as Record<string, UserQuizHistory[]>,
  )

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome back, {user.name}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Track your quiz progress and improve your knowledge</p>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button variant="outline" onClick={handleLogout} disabled={loading} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Score</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bestScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topics Covered</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(topicGroups).length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create New Quiz */}
        <div className="space-y-6">
          <Card className="border-2 border-purple-100 dark:border-purple-900/30">
            <CardHeader>
              <CardTitle>Create New Quiz</CardTitle>
              <CardDescription>Generate a new quiz on any topic to test your knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <TopicInput />
            </CardContent>
          </Card>
        </div>

        {/* Recent Quiz History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Quizzes
              </CardTitle>
              <CardDescription>Your latest quiz attempts and scores</CardDescription>
            </CardHeader>
            <CardContent>
              {recentQuizzes.length > 0 ? (
                <div className="space-y-4">
                  {recentQuizzes.map((quiz, index) => (
                    <div
                      key={`${quiz.quizId}-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{quiz.topic}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {quiz.score}/{quiz.totalQuestions} correct
                        </p>
                        <p className="text-xs text-slate-500">{new Date(quiz.completedAt).toLocaleDateString()}</p>
                      </div>
                      <Badge
                        variant={
                          quiz.percentage >= 80 ? "default" : quiz.percentage >= 60 ? "secondary" : "destructive"
                        }
                      >
                        {quiz.percentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No quizzes taken yet</p>
                  <p className="text-sm">Create your first quiz to get started!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Topic Progress */}
      {Object.keys(topicGroups).length > 0 && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Topic Progress & Comparison
              </CardTitle>
              <CardDescription>See how you're improving in different topics over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(topicGroups).map(([topic, quizzes]) => {
                  const sortedQuizzes = quizzes.sort(
                    (a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime(),
                  )
                  const latestScore = sortedQuizzes[sortedQuizzes.length - 1].percentage
                  const firstScore = sortedQuizzes[0].percentage
                  const improvement = latestScore - firstScore
                  const averageForTopic = Math.round(
                    quizzes.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizzes.length,
                  )

                  return (
                    <div key={topic} className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold">{topic}</h4>
                        <Badge variant="outline">{quizzes.length} attempts</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Latest Score</p>
                          <p className="text-lg font-semibold">{latestScore}%</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Average Score</p>
                          <p className="text-lg font-semibold">{averageForTopic}%</p>
                        </div>
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Improvement</p>
                          <p
                            className={`text-lg font-semibold ${
                              improvement > 0 ? "text-green-600" : improvement < 0 ? "text-red-600" : "text-slate-600"
                            }`}
                          >
                            {improvement > 0 ? "+" : ""}
                            {improvement}%
                          </p>
                        </div>
                      </div>

                      {/* Quiz History for this topic */}
                      <div className="mt-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Recent attempts:</p>
                        <div className="flex gap-2 flex-wrap">
                          {sortedQuizzes.slice(-5).map((quiz, index) => (
                            <div
                              key={`${quiz.quizId}-${index}`}
                              className="flex items-center gap-1 text-xs bg-white dark:bg-slate-700 px-2 py-1 rounded"
                            >
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(quiz.completedAt).toLocaleDateString()}</span>
                              <Badge size="sm" variant={quiz.percentage >= 80 ? "default" : "secondary"}>
                                {quiz.percentage}%
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
