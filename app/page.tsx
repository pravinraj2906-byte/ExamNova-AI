import Link from "next/link"
import { Sparkles, Bot, GraduationCap, LayoutDashboard, ArrowRight, Infinity as InfinityIcon } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-[100dvh] bg-slate-50 dark:bg-[#0B1220] relative overflow-hidden flex flex-col items-center justify-center">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/10 rounded-full blur-3xl animate-pulse mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl animate-pulse [animation-delay:2s] mix-blend-multiply dark:mix-blend-lighten pointer-events-none"></div>
      
      {/* Floating Interactive Icons (Hidden on small mobile for clarity) */}
      <div className="absolute hidden md:flex top-[20%] left-[15%] w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md items-center justify-center shadow-lg shadow-cyan-900/5 animate-bounce cursor-pointer hover:scale-110 hover:border-cyan-300 transition-all duration-300 group">
         <Bot className="w-8 h-8 text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 transition-colors" />
      </div>
      <div className="absolute hidden md:flex bottom-[25%] left-[20%] w-14 h-14 rounded-full bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md items-center justify-center shadow-lg shadow-purple-900/5 animate-bounce [animation-delay:1.5s] cursor-pointer hover:scale-110 hover:border-purple-300 transition-all duration-300 group">
         <GraduationCap className="w-7 h-7 text-purple-600 dark:text-purple-400 group-hover:text-purple-500 transition-colors" />
      </div>
      <div className="absolute hidden md:flex top-[30%] right-[15%] w-20 h-20 rounded-3xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md items-center justify-center shadow-lg shadow-blue-900/5 animate-bounce [animation-delay:0.7s] cursor-pointer hover:scale-110 hover:border-blue-300 transition-all duration-300 group">
         <Sparkles className="w-10 h-10 text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition-colors" />
      </div>
      <div className="absolute hidden md:flex bottom-[20%] right-[20%] w-16 h-16 rounded-2xl bg-white/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 backdrop-blur-md items-center justify-center shadow-lg shadow-emerald-900/5 animate-bounce [animation-delay:2.2s] cursor-pointer hover:scale-110 hover:border-emerald-300 transition-all duration-300 group">
         <LayoutDashboard className="w-8 h-8 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 transition-colors" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300 text-sm font-semibold tracking-wide uppercase mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
          Powered by Amazon Nova
        </div>

        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20">
            <InfinityIcon className="h-10 w-10" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-slate-100 mb-6 tracking-tighter leading-tight drop-shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          Master Any Subject with{' '}
          <br className="hidden md:block" />
          <span className="bg-gradient-to-br from-cyan-600 via-blue-600 to-orange-500 bg-clip-text text-transparent animate-gradient-x">
            AI-Powered Learning
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium mb-10 max-w-3xl mx-auto leading-relaxed">
          Personalized AI tutoring, intelligent problem solving, and highly adaptive learning paths designed just for you.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 hover:from-cyan-500 hover:via-blue-500 hover:to-cyan-600 text-white px-8 py-5 text-lg font-bold rounded-2xl shadow-lg shadow-cyan-600/30 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95 group relative overflow-hidden hover:shadow-2xl">
              <span className="relative z-10">Start Learning for Free</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-8 py-5 text-lg font-bold rounded-2xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm">
              Sign In Instead
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}