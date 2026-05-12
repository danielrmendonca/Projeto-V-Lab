// Camada de acesso à API para o recurso Course.
// Todos os métodos retornam a Promise com o dado já extraído de r.data.

import api from '../lib/api'
import type { Course, CourseWithLessons } from '../types'

export const courseService = {
  // Retorna todos os cursos (listagem do dashboard).
  list: () =>
    api.get<Course[]>('/courses').then(r => r.data),

  // Retorna um curso com suas aulas aninhadas (usado em CourseDetail).
  get: (id: number) =>
    api.get<CourseWithLessons>(`/courses/${id}`).then(r => r.data),

  // O backend exige o dado dentro da chave `course` (Rails strong parameters).
  create: (data: Partial<Course>) =>
    api.post<Course>('/courses', { course: data }).then(r => r.data),

  update: (id: number, data: Partial<Course>) =>
    api.patch<Course>(`/courses/${id}`, { course: data }).then(r => r.data),

  // remove não retorna corpo; o chamador apenas aguarda a Promise resolver.
  remove: (id: number) =>
    api.delete(`/courses/${id}`),
}
