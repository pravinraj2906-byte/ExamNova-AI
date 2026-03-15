'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

interface Question {
  questionNumber: number
  questionText: string
  questionType: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export default function QuizPage() {
  const { token } = useAuth()
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleGenerateQuiz = async () => {
    if (!topic || !token) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic,
          difficulty,
          questionCount: 5,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await response.json()
      setQuestions(data.questions)
      setAnswers(new Array(data.questions.length).fill(''))
      setQuizStarted(true)
    } catch (error) {
      console.error('Quiz generation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  if (!quizStarted) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
          <Sidebar />

          <main className="flex-1 overflow-y-auto">
            <div className="p-8">
              <h1 className="text-4xl font-bold text-white mb-2">Quiz Master</h1>
              <p className="text-slate-400 mb-8">
                Test your knowledge with AI-generated quizzes
              </p>

              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm max-w-md">
                <CardHeader>
                  <CardTitle className="text-white">Create a New Quiz</CardTitle>
                  <CardDescription className="text-slate-400">
                    Choose a topic and difficulty level
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Topic</label>
                    <Input
                      placeholder="e.g., Biology, Algebra, History"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

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

                  <Button
                    onClick={handleGenerateQuiz}
                    disabled={!topic || isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Quiz'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <ProtectedRoute>
        <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
          <Sidebar />

          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <CardTitle className="text-4xl font-bold text-white mb-4">Quiz Complete!</CardTitle>
                  <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                    {score}%
                  </div>
                  <p className="text-slate-400">
                    You answered {answers.filter((a, i) => a === questions[i]?.correctAnswer).length} out of {questions.length} correctly
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {questions.map((question, index) => (
                      <Card key={index} className="bg-slate-700/50 border-slate-600">
                        <CardContent className="pt-4">
                          <p className="font-medium text-white mb-2">Question {index + 1}</p>
                          <p className="text-slate-200 mb-3">{question.questionText}</p>
                          <div className="space-y-2 mb-3">
                            <p className="text-sm text-slate-400">Your answer: {answers[index] || 'Not answered'}</p>
                            <p className="text-sm text-green-400">Correct answer: {question.correctAnswer}</p>
                          </div>
                          <p className="text-sm text-slate-300 bg-slate-800/50 p-2 rounded">
                            {question.explanation}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    onClick={() => {
                      setQuizStarted(false)
                      setTopic('')
                      setCurrentQuestion(0)
                      setShowResults(false)
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create New Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  const question = questions[currentQuestion]
  const selectedAnswer = answers[currentQuestion]

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-slate-400">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
                <p className="text-sm text-slate-400">{topic}</p>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 progress-container" style={{ '--progress-width': `${((currentQuestion + 1) / questions.length) * 100}%` } as React.CSSProperties}>
                <div className="progress-bar bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all" />
              </div>
            </div>

            {/* Question Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-2xl">{question.questionText}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option.charAt(0))}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        selectedAnswer === option.charAt(0)
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                      }`}
                    >
                      <p className="text-white">{option}</p>
                    </button>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                    variant="outline"
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700/50"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
