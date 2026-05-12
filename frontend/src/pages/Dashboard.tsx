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
  const [search, setSearch] = useState('')

  //----------Carregamento----------
  useEffect(() => {
    courseService.list()
      .then(setCourses)
      .catch(() => setError('Erro ao carregar cursos.'))
      .finally(() => setLoading(false))
  }, [])

  //----------Filtro----------
  // Filtragem local: não faz nova requisição, apenas deriva do array já carregado.
  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50">

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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Cursos</h2>
          <button
            onClick={() => navigate('/courses/new')}
            className="bg-red-600 text-white text-sm px-4 py-2 rounded hover:bg-red-700"
          >
            Novo Curso
          </button>
        </div>

        <input
          type="text"
          placeholder="Buscar por nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-slate-300 rounded px-3 py-2 text-sm mb-6"
        />

        {loading && <p className="text-sm text-slate-400">Carregando...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && courses.length === 0 && (
          <p className="text-sm text-slate-400">Nenhum curso cadastrado ainda.</p>
        )}
        {!loading && !error && courses.length > 0 && filtered.length === 0 && (
          <p className="text-sm text-slate-400">Nenhum curso encontrado para "{search}".</p>
        )}

        <div className="flex flex-col gap-3">
          {filtered.map(course => (
            <button
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="bg-white border border-slate-200 rounded-lg p-4 text-left hover:border-slate-300 transition-colors"
            >
              <p className="font-medium text-slate-800">{course.name}</p>
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
