'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { user, token } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [gradeLevel, setGradeLevel] = useState('')
  const [learningStyle, setLearningStyle] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [subjectInput, setSubjectInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return

      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }

        const data = await response.json()
        setName(data.user.name || '')
        setGradeLevel(data.user.gradeLevel || '')
        setLearningStyle(data.user.learningStyle || '')
        setSubjects(data.user.preferredSubjects || [])
      } catch (error) {
        console.error('Profile fetch error:', error)
      }
    }

    fetchProfile()
  }, [token])

  const handleAddSubject = () => {
    if (subjectInput.trim() && !subjects.includes(subjectInput.trim())) {
      setSubjects([...subjects, subjectInput.trim()])
      setSubjectInput('')
    }
  }

  const handleRemoveSubject = (subject: string) => {
    setSubjects(subjects.filter((s) => s !== subject))
  }

  const handleSaveProfile = async () => {
    if (!token) return

    setIsSaving(true)
    setSaveSuccess(false)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          gradeLevel,
          learningStyle,
          preferredSubjects: subjects,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save profile')
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Profile save error:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const [collapsed, setCollapsed] = useState(false)
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <main className={`flex-1 overflow-y-auto ${collapsed ? 'ml-16' : 'ml-60'}`}> 
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
            <p className="text-slate-400 mb-8">
              Customize your learning experience
            </p>

            <div className="space-y-6 max-w-2xl">
              {/* Profile Section */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                  <CardDescription className="text-slate-400">
                    Update your personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Full Name</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Email</label>
                    <Input
                      value={user?.email || ''}
                      disabled
                      className="bg-slate-700/30 border-slate-600 text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Grade Level</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md p-2"
                    >
                      <option value="">Select grade level</option>
                      <option value="elementary">Elementary School</option>
                      <option value="middle">Middle School</option>
                      <option value="high">High School</option>
                      <option value="college">College</option>
                      <option value="adult">Adult Learner</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Learning Style</label>
                    <select
                      value={learningStyle}
                      onChange={(e) => setLearningStyle(e.target.value)}
                      className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-md p-2"
                    >
                      <option value="">Select learning style</option>
                      <option value="visual">Visual Learner</option>
                      <option value="auditory">Auditory Learner</option>
                      <option value="kinesthetic">Kinesthetic Learner</option>
                      <option value="reading">Reading/Writing Learner</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Preferred Subjects */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Preferred Subjects</CardTitle>
                  <CardDescription className="text-slate-400">
                    Select subjects you want to focus on
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a subject"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSubject()
                        }
                      }}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <Button
                      onClick={handleAddSubject}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add
                    </Button>
                  </div>

                  {subjects.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {subjects.map((subject) => (
                        <div
                          key={subject}
                          className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-sm text-blue-300 flex items-center gap-2"
                        >
                          {subject}
                          <button
                            onClick={() => handleRemoveSubject(subject)}
                            className="text-blue-400 hover:text-blue-300 ml-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {subjects.length === 0 && (
                    <p className="text-sm text-slate-400">No subjects added yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>

                {saveSuccess && (
                  <div className="px-4 py-2 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm flex items-center">
                    ✓ Changes saved successfully
                  </div>
                )}
              </div>

              {/* Account Section */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm border-red-600/30">
                <CardHeader>
                  <CardTitle className="text-white">Danger Zone</CardTitle>
                  <CardDescription className="text-slate-400">
                    Irreversible actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="border-red-600/50 text-red-400 hover:bg-red-500/10"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
