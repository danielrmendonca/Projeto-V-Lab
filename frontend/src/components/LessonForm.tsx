// Formulário reutilizável para criar ou editar uma aula.
// Quando lesson é passado = modo edição, quando omitido = modo criação.

import { useState } from 'react'
import { lessonService } from '../services/lessonService'
import type { Lesson } from '../types'

//----------Props----------
// courseId: id do curso pai, necessário para compor a rota da API.
// lesson: aula existente (modo edição) ou undefined (modo criação).
// onSave: callback chamado após salvar com sucesso para atualizar a lista.
// onCancel: callback chamado ao clicar em "Cancelar" para fechar o formulário.
interface Props {
  courseId: number
  lesson?: Lesson
  onSave: () => void
  onCancel: () => void
}

export default function LessonForm({ courseId, lesson, onSave, onCancel }: Props) {
  //----------Estado do formulário----------
  // Inicializado com os valores da aula em edição ou com defaults para criação.
  const [title, setTitle] = useState(lesson?.title ?? '')
  const [status, setStatus] = useState<Lesson['status']>(lesson?.status ?? 'draft')
  const [videoUrl, setVideoUrl] = useState(lesson?.video_url ?? '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  //----------Submit----------
  // Decide entre create ou update com base na presença de lesson.
  // Erros de validação do backend são extraídos de errors[0] e exibidos.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const data = { title, status, video_url: videoUrl }
    try {
      if (lesson) {
        await lessonService.update(courseId, lesson.id, data)
      } else {
        await lessonService.create(courseId, data)
      }
      onSave()
    } catch (err: any) {
      const msgs = err.response?.data?.errors
      setError(msgs ? msgs[0] : 'Erro ao salvar aula.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-lg p-4 mb-4 flex flex-col gap-3"
    >
      {/* Título dinâmico reflete o modo atual */}
      <h3 className="text-sm font-medium text-slate-700">
        {lesson ? 'Editar Aula' : 'Nova Aula'}
      </h3>

      {/* Exibe o primeiro erro retornado pelo backend ou mensagem genérica */}
      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Campo obrigatório */}
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border border-slate-300 rounded px-3 py-2 text-sm"
        required
      />

      {/* type="url" garante formato básico de URL no browser antes de enviar */}
      <input
        type="url"
        placeholder="URL do vídeo (https://...)"
        value={videoUrl}
        onChange={e => setVideoUrl(e.target.value)}
        className="border border-slate-300 rounded px-3 py-2 text-sm"
      />

      {/* Status mapeado para os valores aceitos pelo backend: draft e published */}
      <select
        value={status}
        onChange={e => setStatus(e.target.value as Lesson['status'])}
        className="border border-slate-300 rounded px-3 py-2 text-sm"
      >
        <option value="draft">Rascunho</option>
        <option value="published">Publicada</option>
      </select>

      {/* Cancelar fecha o formulário sem requisição, Salvar dispara o submit */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-slate-300 text-slate-600 text-sm py-2 rounded hover:bg-slate-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </form>
  )
}
