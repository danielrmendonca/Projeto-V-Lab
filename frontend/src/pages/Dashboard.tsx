// Página home pós-login: lista todos os cursos e permite criar um novo.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { courseService } from '../services/courseService'
import type { Course } from '../types'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  //----------Estado----------
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  //----------Carregamento----------
  // Lista todos os cursos ao montar o componente.
  // finally garante que loading seja desativado tanto em sucesso quanto em erro.
  useEffect(() => {
    courseService.list()
      .then(setCourses)
      .catch(() => setError('Erro ao carregar cursos.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header: nome do app, usuário logado e botão de logout */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-slate-800">CourseSphere</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500">{user?.name}</span>
          <button onClick={logout} className="text-sm text-slate-500 hover:text-red-500">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Cursos</h2>
          <button
            onClick={() => navigate('/courses/new')}
            className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
          >
            Novo Curso
          </button>
        </div>

        {/* Estados de feedback: loading, erro e lista vazia são mutuamente exclusivos */}
        {loading && <p className="text-sm text-slate-400">Carregando...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && courses.length === 0 && (
          <p className="text-sm text-slate-400">Nenhum curso cadastrado ainda.</p>
        )}

        {/* Cada card é um button para aproveitar acessibilidade e foco de teclado nativos */}
        <div className="flex flex-col gap-3">
          {courses.map(course => (
            <button
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="bg-white border border-slate-200 rounded-lg p-4 text-left hover:border-slate-300 transition-colors"
            >
              <p className="font-medium text-slate-800">{course.name}</p>
              {/* line-clamp-2 evita que descrições longas quebrem o layout da lista */}
              {course.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{course.description}</p>
              )}
              <p className="text-xs text-slate-400 mt-2">Criador: {course.creator.name}</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
