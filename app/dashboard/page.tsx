'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/protected-route'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import {
  MessageSquare,
  ImageIcon,
  BookOpen,
  BarChart3,
  Clock,
  Target,
  Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const features = [
    {
      icon: MessageSquare,
      title: 'Chat with Nova',
      description: 'Get personalized tutoring for any subject with conversational AI',
      href: '/chat',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20'
    },
    {
      icon: ImageIcon,
      title: 'Image Solver',
      description: 'Upload a problem and get step-by-step visual solutions',
      href: '/image-solver',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20'
    },
    {
      icon: BookOpen,
      title: 'Study Planner',
      description: 'Create personalized and adaptive study schedules',
      href: '/study-planner',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20'
    },
    {
      icon: BarChart3,
      title: 'Quiz Master',
      description: 'Test your knowledge with AI-generated smart quizzes',
      href: '/quiz',
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20'
    },
  ]

  const stats = [
    { icon: Clock, label: "Today's Study Time", value: "0", unit: "mins", desc: "Keep it up!" },
    { icon: Target, label: "Problems Solved", value: "0", unit: "", desc: "Start solving problems" },
    { icon: Zap, label: "Accuracy Rate", value: "0", unit: "%", desc: "Take a quiz to start" }
  ]

  return (
    <ProtectedRoute>
      <div className="flex h-[100dvh] bg-slate-50 dark:bg-[#0B1220] overflow-hidden font-sans text-slate-900 dark:text-slate-100 selection:bg-cyan-500/30">
        <Sidebar className="hidden lg:block shrink-0" collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          
          <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
            <div className="px-6 py-8 md:px-10 md:py-12 max-w-[1400px] mx-auto w-full">
              
              {/* Features Grid */}
              <div className="mb-8 flex items-center justify-between">
                 <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">Quick Actions</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <div
                      key={feature.href}
                      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => router.push(feature.href)}
                    >
                      <div className="relative z-10">
                        <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} ${feature.borderColor} border`}>
                          <Icon className={`h-6 w-6 ${feature.color}`} />
                        </div>
                        <h4 className="mb-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {feature.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                          {feature.description}
                        </p>
                      </div>
                      <div className="relative z-10 mt-auto">
                        <Button className="w-full bg-slate-100 dark:bg-slate-800/50 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 text-slate-700 dark:text-slate-300 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all py-5 font-semibold shadow-none border border-transparent hover:border-cyan-200 dark:hover:border-cyan-500/30 rounded-xl">
                          Get Started
                        </Button>
                      </div>
                      
                      {/* Hover Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                    </div>
                  )
                })}
              </div>

              {/* Stats Section */}
              <div className="mb-8 flex items-center justify-between">
                 <h3 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">Study Progress</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
                {stats.map((stat, i) => (
                   <div key={i} className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80">
                         <stat.icon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                       </div>
                       <h4 className="text-sm font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase">{stat.label}</h4>
                     </div>
                     <div>
                       <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{stat.value}</span>
                          {stat.unit && <span className="text-xl font-bold text-cyan-500">{stat.unit}</span>}
                       </div>
                       <p className="text-sm font-medium text-slate-500 dark:text-slate-500 mt-2">{stat.desc}</p>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
