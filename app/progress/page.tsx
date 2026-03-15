'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Sidebar } from '@/components/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Award, Clock } from 'lucide-react'

interface ProgressData {
  totalQuizzes: number
  totalQuestions: number
  correctAnswers: number
  accuracy: number
  studyPlansCreated: number
}

export default function ProgressPage() {
  const { token } = useAuth()
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      if (!token) return

      try {
        const response = await fetch('/api/progress', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch progress')
        }

        const data = await response.json()
        setProgress(data.progress)
      } catch (error) {
        console.error('Progress fetch error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProgress()
  }, [token])

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Your Progress</h1>
            <p className="text-slate-400 mb-8">
              Track your learning journey and celebrate your achievements
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full border-4 border-slate-600 border-t-blue-500 animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-400">Loading progress...</p>
                </div>
              </div>
            ) : progress ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Accuracy Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-white">{progress.accuracy.toFixed(1)}%</p>
                      <p className="text-xs text-slate-500 mt-1">Based on {progress.totalQuestions} questions</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        Quizzes Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-white">{progress.totalQuizzes}</p>
                      <p className="text-xs text-slate-500 mt-1">Assessment attempts</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        Correct Answers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-white">{progress.correctAnswers}</p>
                      <p className="text-xs text-slate-500 mt-1">Total correct responses</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-sm text-slate-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Study Plans
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold text-white">{progress.studyPlansCreated}</p>
                      <p className="text-xs text-slate-500 mt-1">Plans created</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Stats */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Learning Statistics</CardTitle>
                    <CardDescription className="text-slate-400">
                      Detailed breakdown of your performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-slate-300">Overall Accuracy</p>
                          <p className="text-sm font-medium text-slate-200">{progress.accuracy.toFixed(1)}%</p>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                            style={{ width: `${progress.accuracy}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4">
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Quiz Performance</p>
                          <p className="text-2xl font-bold text-white">
                            {progress.totalQuestions > 0
                              ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
                              : 0}
                            %
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Questions Attempted</p>
                          <p className="text-2xl font-bold text-white">{progress.totalQuestions}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Achievements</CardTitle>
                    <CardDescription className="text-slate-400">
                      Unlock badges as you reach milestones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { icon: '🏆', label: 'First Steps', unlocked: progress.totalQuestions >= 1 },
                        { icon: '⭐', label: 'Quick Learner', unlocked: progress.totalQuizzes >= 3 },
                        { icon: '🎯', label: 'Accuracy Master', unlocked: progress.accuracy >= 90 },
                        { icon: '🚀', label: 'Dedicated Learner', unlocked: progress.studyPlansCreated >= 2 },
                      ].map((achievement, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 text-center transition-all ${
                            achievement.unlocked
                              ? 'border-yellow-500/50 bg-yellow-500/10'
                              : 'border-slate-600 bg-slate-700/20 opacity-50'
                          }`}
                        >
                          <div className="text-3xl mb-2">{achievement.icon}</div>
                          <p className="text-xs font-medium text-slate-200">{achievement.label}</p>
                          {!achievement.unlocked && (
                            <p className="text-xs text-slate-500 mt-1">Locked</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <p className="text-slate-400">Failed to load progress data</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
