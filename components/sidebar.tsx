'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  MessageSquare,
  ImageIcon,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Home,
  Menu,
  Infinity as InfinityIcon
} from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

interface SidebarProps {
  className?: string
  collapsed?: boolean
  setCollapsed?: (collapsed: boolean) => void
}

export function Sidebar({ className, collapsed: externalCollapsed, setCollapsed: setExternalCollapsed }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()
  
  const [internalCollapsed, setInternalCollapsed] = useState(false)
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed
  const setIsCollapsed = setExternalCollapsed || setInternalCollapsed

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Chat', href: '/chat' },
    { icon: ImageIcon, label: 'Image Solver', href: '/image-solver' },
    { icon: BookOpen, label: 'Study Planner', href: '/study-planner' },
    { icon: BookOpen, label: 'Quiz', href: '/quiz' },
    { icon: BarChart3, label: 'Progress', href: '/progress' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ]

  const SidebarContent = () => (
    <div className={`flex flex-col h-full bg-slate-50 dark:bg-[#090f1a] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}> 
      {/* Brand Header */}
      <div className={`px-6 py-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}> 
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <InfinityIcon className="h-6 w-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">ExamNova</span>
              <span className="text-[10px] font-bold tracking-widest text-cyan-500 uppercase">AI Tutor</span>
            </div>
          )}
        </Link>
        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center pb-4">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'px-3 py-2' : 'px-4 py-4'} space-y-6 custom-scrollbar`}>
        <div className="px-2">
          <button
            onClick={() => router.push('/chat')}
            className={`w-full flex items-center justify-center ${isCollapsed ? 'h-11 w-11 p-0 rounded-xl mx-auto' : 'gap-2 px-4 py-3 rounded-xl'} bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md hover:shadow-lg transition-all duration-200 font-medium group`}
          >
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span className="text-sm font-semibold">New Chat</span>}
          </button>
        </div>

        <div className="space-y-1 mt-6">
          {!isCollapsed && <p className="px-4 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Workspace</p>}
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <button
                key={item.href}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center h-12 rounded-xl' : 'gap-3 px-3 py-2.5 rounded-lg'} transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800/60 text-slate-900 dark:text-white font-medium'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                }`}
                title={item.label}
              >
                {isActive && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-500 rounded-r-md" />
                )}
                {isActive && isCollapsed && (
                  <div className="absolute inset-y-2 left-0 w-1 bg-cyan-500 rounded-r-md" />
                )}
                <div className={`relative flex items-center justify-center ${isCollapsed ? 'w-10 h-10' : ''}`}>
                  <Icon className={`h-[18px] w-[18px] transition-colors duration-200 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                </div>
                {!isCollapsed && <span className="text-[14px] leading-tight flex-1 text-left">{item.label}</span>}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Footer / Logout */}
      <div className={`p-4 border-t border-slate-200 dark:border-slate-800 ${isCollapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center h-12 w-12 rounded-xl p-0' : 'gap-3 px-3 py-2.5 rounded-lg'} text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 group font-medium`}
          title="Log out"
        >
          <LogOut className="h-[18px] w-[18px] group-hover:text-red-500 transition-colors" />
          {!isCollapsed && <span className="text-[14px]">Log out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <aside className={`fixed lg:sticky top-0 left-0 z-40 h-[100dvh] shrink-0 transition-all duration-300 ease-in-out ${className || ''}`}>
      <SidebarContent />
    </aside>
  )
}
