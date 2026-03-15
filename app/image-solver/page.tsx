/* eslint-disable @next/next/no-img-element */

'use client'

import { useState, useRef } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Loader2, ImageIcon } from 'lucide-react'

export default function ImageSolverPage() {
  const { token } = useAuth()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [solution, setSolution] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        setSelectedImage(base64)
        handleSolveImage(base64)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSolveImage = async (base64: string) => {
    if (!token) return

    setIsLoading(true)
    setSolution(null)

    try {
      const response = await fetch('/api/solve-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          base64Image: base64.split(',')[1],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to solve image')
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        fullContent += chunk
        setSolution(fullContent)
      }
    } catch (error) {
      console.error('Image solver error:', error)
      setSolution('Error processing image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-white mb-2">Image Problem Solver</h1>
            <p className="text-slate-400 mb-8">
              Upload a photo of a problem and get step-by-step solutions
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <div>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="text-white">Upload Problem</CardTitle>
                    <CardDescription className="text-slate-400">
                      Take a photo or upload an image
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-slate-500 transition-colors"
                    >
                      {selectedImage ? (
                        <div className="space-y-4">
                          <img
                            src={selectedImage}
                            alt="Selected problem"
                            className="max-h-96 mx-auto rounded-lg"
                          />
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              fileInputRef.current?.click()
                            }}
                            variant="outline"
                            className="w-full border-slate-600 text-slate-300 hover:bg-slate-700/50"
                          >
                            Choose Another Image
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-4 mx-auto">
                            <ImageIcon className="w-full h-full text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Click to upload</p>
                            <p className="text-sm text-slate-400">or drag and drop</p>
                          </div>
                          <p className="text-xs text-slate-500">PNG, JPG, JPEG up to 10MB</p>
                        </div>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      aria-label="Upload problem image"
                    />

                  </CardContent>
                </Card>
              </div>

              {/* Solution Section */}
              <div>
                <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="text-white">Solution</CardTitle>
                    <CardDescription className="text-slate-400">
                      Step-by-step explanation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                            <p className="text-slate-400">Analyzing problem...</p>
                          </div>
                        </div>
                      ) : solution ? (
                        <div className="prose prose-invert max-w-none">
                          <p className="text-slate-200 whitespace-pre-wrap text-sm leading-relaxed">
                            {solution}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center py-12 text-slate-400">
                          <p>Upload an image to see the solution</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
