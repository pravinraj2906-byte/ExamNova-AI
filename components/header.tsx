import { useAuth } from '@/lib/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export function Header() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0B1220]/80 px-4 md:px-8 shadow-sm backdrop-blur-md transition-all">
      <div className="flex flex-1 items-center gap-x-4 lg:gap-x-6">
        <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent truncate tracking-tight">
          Welcome back, {user?.name?.toUpperCase() || user?.email?.split('@')[0].toUpperCase() || 'STUDENT'}!
        </h2>
      </div>

      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded-full p-2.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-5 w-5 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-all" />
          ) : (
             <Moon className="h-5 w-5 hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] transition-all" />
          )}
        </button>

        {/* Separator */}
        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-700" aria-hidden="true" />

        {/* Profile */}
        <div className="flex items-center gap-x-4">
           <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-md ring-2 ring-white dark:ring-slate-800">
              <span className="sr-only">Your profile</span>
              <span aria-hidden="true">{(user?.name?.[0] || user?.email?.[0] || 'U').toUpperCase()}</span>
           </div>
        </div>
      </div>
    </header>
  )
}
