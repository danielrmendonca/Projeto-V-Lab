// Camada de acesso à API para o recurso Lesson.
// Aulas são um recurso aninhado em Course, por isso courseId compõe todas as rotas.

import api from '../lib/api'
import type { Lesson } from '../types'

export const lessonService = {
  
  create: (courseId: number, data: Partial<Lesson>) =>
    api.post<Lesson>(`/courses/${courseId}/lessons`, { lesson: data }).then(r => r.data),

  update: (courseId: number, id: number, data: Partial<Lesson>) =>
    api.patch<Lesson>(`/courses/${courseId}/lessons/${id}`, { lesson: data }).then(r => r.data),

  // remove não retorna corpo; o chamador recarrega o curso após resolver.
  remove: (courseId: number, id: number) =>
    api.delete(`/courses/${courseId}/lessons/${id}`),
}
