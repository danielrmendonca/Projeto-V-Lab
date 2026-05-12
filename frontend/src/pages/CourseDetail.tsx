// Página de detalhes de um curso: exibe dados, lista de aulas e ações de CRUD.

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCourseDetail } from '../hooks/useCourseDetail'
import { lessonService } from '../services/lessonService'
import LessonForm from '../components/LessonForm'
import LessonItem from '../components/LessonItem'
import type { Lesson } from '../types'

export default function CourseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { course, error, isCreator, loadCourse, deleteCourse } = useCourseDetail(id)

  //----------Estado do formulário de aula----------
  // null = fechado, new = criando, Lesson = editando aula existente.
  // Um único estado controla abertura e modo do LessonForm.
  const [lessonEditing, setLessonEditing] = useState<Lesson | 'new' | null>(null)

  //----------Exclusão de aula----------
  // Após confirmar, remove a aula e recarrega o curso para atualizar a lista.
  async function handleDeleteLesson(lessonId: number) {
    if (!confirm('Excluir esta aula?')) return
    await lessonService.remove(Number(id), lessonId)
    loadCourse()
  }

  //----------Estados de carregamento e erro----------
  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-sm text-red-500">{error}</p>
    </div>
  )

  // course === null enquanto a requisição não retorna.
  if (!course) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-sm text-slate-400">Carregando...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header: navegação de volta e ações do criador (editar/excluir curso) */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          ← Cursos
        </button>
        {isCreator && (
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/courses/${id}/edit`)}
              className="text-sm text-slate-600 hover:text-slate-800"
            >
              Editar
            </button>
            <button
              onClick={deleteCourse}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Excluir
            </button>
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">

        {/* Dados do curso: nome, descrição opcional, datas e criador */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-800">{course.name}</h1>
          {course.description && (
            <p className="text-slate-600 mt-2">{course.description}</p>
          )}
          <p className="text-xs text-slate-400 mt-3">
            {course.start_date} → {course.end_date} · Criado por {course.creator.name}
          </p>
        </div>

        {/* Seção de aulas */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold text-slate-700">Aulas</h2>
            {/* Botão oculto enquanto o formulário está aberto para evitar múltiplos forms */}
            {isCreator && lessonEditing === null && (
              <button
                onClick={() => setLessonEditing('new')}
                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Nova Aula
              </button>
            )}
          </div>

          {/* Formulário montado somente quando há edição/criação ativa */}
          {lessonEditing !== null && (
            <LessonForm
              courseId={Number(id)}
              lesson={lessonEditing === 'new' ? undefined : lessonEditing}
              onSave={() => { setLessonEditing(null); loadCourse() }}
              onCancel={() => setLessonEditing(null)}
            />
          )}

          {/* Mensagem vazia exibida apenas quando o formulário também está fechado */}
          {course.lessons.length === 0 && lessonEditing === null && (
            <p className="text-sm text-slate-400">Nenhuma aula cadastrada.</p>
          )}

          <div className="flex flex-col gap-2">
            {course.lessons.map(lesson => (
              <LessonItem
                key={lesson.id}
                lesson={lesson}
                isCreator={isCreator}
                onEdit={setLessonEditing}
                onDelete={handleDeleteLesson}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
