import { GraduationCap } from 'lucide-react'

function App() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3 text-slate-800">
        <GraduationCap className="w-12 h-12 text-indigo-600" />
        <h1 className="text-2xl font-semibold">CourseSphere</h1>
        <p className="text-sm text-slate-500">Setup inicial — Tailwind e Lucide funcionando.</p>
      </div>
    </main>
  )
}

export default App
