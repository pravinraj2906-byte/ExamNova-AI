'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { ProtectedRoute } from '@/components/protected-route'
import { Sidebar } from '@/components/sidebar'
import { Send, Sparkles, Paperclip, Bot } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const { token } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || !token) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: input },
          ],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
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
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullContent,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
      setInput(suggestion)
  }

  return (
    <ProtectedRoute>
      <div className="flex h-[100dvh] bg-slate-50 overflow-hidden font-sans">
        <Sidebar className="shrink-0" />

        <main className="flex-1 flex flex-col relative min-w-0 bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.02)]">
          {/* Top Header */}
          <header className="h-16 shrink-0 flex items-center justify-between px-4 sm:px-6 bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="md:hidden w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white text-xs font-black">EN</span>
              </div>
              <h1 className="text-lg font-bold text-slate-800 tracking-tight hidden md:block">ExamNova AI Tutor</h1>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
               <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
               <span className="text-xs font-semibold text-slate-600">Amazon Nova Powered</span>
            </div>
          </header>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth custom-scrollbar">
            <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-4">
              {messages.length === 0 ? (
                <div className="h-full flex items-center justify-center min-h-[50vh]">
                  <div className="text-center max-w-lg fade-in-up">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 rotate-12 transition-transform hover:scale-105 cursor-pointer">
                       <Sparkles className="w-10 h-10 text-white -rotate-12" />
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">How can I help you today?</h2>
                    <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                      ExamNova AI Tutor is ready to answer your questions and help you solve complex problems.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                       <button onClick={() => handleSuggestionClick("Explain calculus derivatives")} className="px-6 py-3 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:text-cyan-600 hover:shadow-md active:scale-95">Explain calculus derivatives</button>
                       <button onClick={() => handleSuggestionClick("Help me understand photosynthesis")} className="px-6 py-3 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:text-cyan-600 hover:shadow-md active:scale-95">Help me understand photosynthesis</button>
                       <button onClick={() => handleSuggestionClick("How do I solve quadratic equations?")} className="px-6 py-3 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-500/50 hover:text-cyan-600 hover:shadow-md active:scale-95">How do I solve quadratic equations?</button>
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 md:gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm mt-1">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] px-6 py-4 whitespace-pre-wrap leading-relaxed text-base ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-2xl rounded-br-sm shadow-md'
                          : 'bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))
              )}

              {isLoading && (
                <div className="flex justify-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-sm mt-1">
                     <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 border border-slate-200 text-slate-800 px-5 py-5 rounded-[20px] rounded-tl-[4px] shadow-sm flex items-center h-auto">
                    <div className="flex items-center gap-1.5 h-full">
                      <div className="bg-cyan-500 w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="bg-cyan-500 w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="bg-cyan-500 w-2 h-2 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} className="h-4" />
            </div>
          </div>

          {/* Sticky Input Area */}
          <div className="p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent sticky bottom-0 z-10 block pointer-events-none">
            <div className="max-w-5xl mx-auto relative pointer-events-auto">
              <form onSubmit={handleSendMessage} className="relative flex items-center shadow-lg shadow-slate-200/50 group">
                <button type="button" className="absolute left-4 text-slate-400 hover:text-cyan-600 transition-colors p-2 z-10 focus:outline-none focus:text-cyan-600">
                  <Paperclip className="w-6 h-6" />
                </button>
                <input
                  type="text"
                  placeholder="Message ExamNova Tutor..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  className="w-full bg-white md:bg-white/95 backdrop-blur-md border border-slate-200 focus:border-cyan-300 text-slate-900 placeholder:text-slate-400 rounded-full py-5 pl-[64px] pr-[72px] focus:outline-none focus:ring-4 focus:ring-cyan-500/10 transition-all font-medium text-lg leading-relaxed shadow-sm"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-3 p-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white disabled:bg-slate-100 disabled:text-slate-400 transition-all duration-300 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-white"
                >
                  <Send className="w-[18px] h-[18px] ml-0.5" />
                </button>
              </form>
              <p className="text-[11px] text-center text-slate-500 mt-3 md:mt-4 hidden md:block">
                 AI responses can be occasionally inaccurate. Please verify important information.
              </p>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
