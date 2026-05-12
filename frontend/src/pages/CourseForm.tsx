// Página de criação e edição de curso.
// Quando id está presente na rota = modo edição, quando ausente = modo criação.

import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { courseService } from '../services/courseService'

export default function CourseForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  // isEditing derivado da presença do id na rota, evita comparações repetidas.
  const isEditing = Boolean(id)

  //----------Estado do formulário----------
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  //----------Pré-preenchimento em modo edição----------
  // Carrega os dados do curso existente para popular os campos.
  // O ?? '' garante que valores nulos do backend não quebrem os inputs.
  useEffect(() => {
    if (!isEditing) return
    courseService.get(Number(id)).then(course => {
      setName(course.name)
      setDescription(course.description ?? '')
      setStartDate(course.start_date ?? '')
      setEndDate(course.end_date ?? '')
    }).catch(() => setError('Erro ao carregar curso.'))
  }, [id, isEditing])

  //----------Submit----------
  // Decide entre create ou update com base em isEditing.
  // Na criação, redireciona para a página do novo curso usando o id retornado pela API.
  // Erros de validação do backend são extraídos de errors[0] e exibidos.
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const data = { name, description, start_date: startDate, end_date: endDate }
    try {
      if (isEditing) {
        await courseService.update(Number(id), data)
        navigate(`/courses/${id}`)
      } else {
        const course = await courseService.create(data)
        navigate(`/courses/${course.id}`)
      }
    } catch (err: any) {
      const msgs = err.response?.data?.errors
      setError(msgs ? msgs[0] : 'Erro ao salvar curso.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center pt-16 px-4">
      <div className="bg-white border border-slate-200 rounded-lg p-8 w-full max-w-md">

        {/* Título dinâmico reflete o modo atual */}
        <h1 className="text-lg font-semibold text-slate-800 mb-6">
          {isEditing ? 'Editar Curso' : 'Novo Curso'}
        </h1>

        {/* Exibe o primeiro erro retornado pelo backend ou mensagem genérica */}
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Nome</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full border border-slate-300 rounded px-3 py-2 text-sm resize-none"
              rows={3}
            />
          </div>

          {/* Datas lado a lado, validação end_date >= start_date ocorre no backend */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-slate-700 mb-1">Início</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-slate-700 mb-1">Fim</label>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                required
              />
            </div>
          </div>

          {/* navigate(-1) volta para a página anterior sem precisar conhecer a rota */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
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
      </div>
    </div>
  )
}
