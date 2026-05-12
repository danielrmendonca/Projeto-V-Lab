// Hook que centraliza o estado e as ações da tela de detalhes de um curso.

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { courseService } from '../services/courseService'
import type { CourseWithLessons } from '../types'

// id vem do useParams(), que sempre retorna string | undefined.
export function useCourseDetail(id: string | undefined) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [course, setCourse] = useState<CourseWithLessons | null>(null)
  const [error, setError] = useState('')

  //----------Carregamento----------
  // Função nomeada para permitir rechamada após criar/editar/excluir uma aula.
  function loadCourse() {
    courseService.get(Number(id))
      .then(setCourse)
      .catch(() => setError('Curso não encontrado.'))
  }

  // Executa o carregamento inicial e sempre que o id da rota mudar.
  useEffect(() => { loadCourse() }, [id])

  //----------Exclusão do curso----------
  // Pede confirmação antes de remover, redireciona para o dashboard em caso de sucesso.
  async function deleteCourse() {
    if (!confirm('Excluir este curso e todas as suas aulas?')) return
    await courseService.remove(Number(id))
    navigate('/dashboard')
  }

  // Verdadeiro apenas quando o usuário logado é o criador do curso.
  const isCreator = !!user && !!course && user.id === course.creator_id

  return { course, error, isCreator, loadCourse, deleteCourse }
}
