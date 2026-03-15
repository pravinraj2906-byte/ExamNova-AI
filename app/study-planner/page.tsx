'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, Calendar, Target, BookOpen } from 'lucide-react'

interface StudyDay {
  dayNumber: number
  topic: string
  content: string
  exercises: string[]
}

interface StudyPlan {
  topics: string[]
  days: StudyDay[]
}

export default function StudyPlannerPage() {
  const { token } = useAuth()
  const [subject, setSubject] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [durationDays, setDurationDays] = useState('7')
  const [goals, setGoals] = useState('Master the fundamentals')
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGeneratePlan = async () => {
    if (!subject || !token) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-study-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          difficulty,
          durationDays: parseInt(durationDays),
          goals,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate study plan')
      }

      const data = await response.json()
      setStudyPlan(data.plan)
    } catch (error) {
      console.error('Study plan generation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const [collapsed, setCollapsed] = useState(false)
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className={`flex-1 overflow-y-auto ${collapsed ? 'ml-16' : 'ml-60'}`}> 
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Study Planner</h1>
            <p className="text-slate-400 mb-8">
              Create personalized study schedules tailored to your goals
            </p>

            {!studyPlan ? (
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-2xl">
                <CardHeader>
                  <CardTitle className="text-white">Create Study Plan</CardTitle>
                  <CardDescription className="text-slate-400">
                    Customize your learning path
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Subject</label>
                    <Input
                      placeholder="e.g., Calculus, Biology, Spanish"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md p-2"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-200">Duration (Days)</label>
                      <Input
                        type="number"
                        min="1"
                        max="30"
                        value={durationDays}
                        onChange={(e) => setDurationDays(e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Learning Goal</label>
                    <Input
                      placeholder="e.g., Prepare for exam, Master fundamentals"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <Button
                    onClick={handleGeneratePlan}
                    disabled={!subject || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Plan...
                      </>
                    ) : (
                      'Generate Study Plan'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex gap-3">
                  <Button
                    onClick={() => setStudyPlan(null)}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    Create New Plan
                  </Button>
                </div>

                {/* Topics Overview */}
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Topics to Learn
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {studyPlan.topics.map((topic, index) => (
                        <div
                          key={index}
                          className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm text-blue-300"
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Study Schedule */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Study Schedule
                  </h2>

                  {studyPlan.days.map((day) => (
                    <Card key={day.dayNumber} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-white">
                              Day {day.dayNumber}: {day.topic}
                            </CardTitle>
                          </div>
                          <div className="px-3 py-1 bg-slate-700/50 rounded-full text-sm text-slate-400">
                            <BookOpen className="w-4 h-4 inline mr-1" />
                            {day.exercises.length} exercises
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-400 mb-2">Content Overview</p>
                          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                            {day.content}
                          </p>
                        </div>

                        {day.exercises.length > 0 && (
                          <div>
                            <p className="text-sm text-slate-400 mb-2">Exercises</p>
                            <ul className="space-y-2">
                              {day.exercises.map((exercise, index) => (
                                <li key={index} className="text-sm text-slate-200 flex items-start gap-2">
                                  <span className="text-blue-400 mt-1">•</span>
                                  <span>{exercise}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Button
                          variant="outline"
                          className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
                        >
                          Mark as Complete
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
