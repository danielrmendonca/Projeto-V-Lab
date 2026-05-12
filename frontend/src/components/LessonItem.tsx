// Componente que exibe os dados de uma aula em linha.
// Ações de edição e exclusão são exibidas apenas para o criador do curso.

import type { Lesson } from '../types'

// Mapa de tradução para os valores de status vindos do backend.
const STATUS_LABEL: Record<Lesson['status'], string> = {
  draft: 'Rascunho',
  published: 'Publicada',
}

//----------Props----------
// lesson: dados completos da aula a ser exibida.
// isCreator: controla a visibilidade dos botões de ação.
// onEdit: callback que recebe a aula para preencher o LessonForm em modo edição.
// onDelete: callback que recebe o id para disparar a exclusão no componente pai.
interface Props {
  lesson: Lesson
  isCreator: boolean
  onEdit: (lesson: Lesson) => void
  onDelete: (id: number) => void
}

export default function LessonItem({ lesson, isCreator, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-start gap-4">

      {/* Lado esquerdo: título e link opcional do vídeo */}
      <div>
        <p className="text-sm font-medium text-slate-800">{lesson.title}</p>
        {/* Link só é renderizado se video_url existir */}
        {lesson.video_url && (
          <a
            href={lesson.video_url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-500 hover:underline mt-1 block"
          >
            Ver vídeo
          </a>
        )}
      </div>

      {/* Lado direito: badge de status e ações do criador */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Badge com cor condicional: verde para publicada, cinza para rascunho */}
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            lesson.status === 'published'
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-100 text-slate-500'
          }`}
        >
          {STATUS_LABEL[lesson.status]}
        </span>

        {/* Botões de editar e excluir visíveis apenas para o criador do curso */}
        {isCreator && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(lesson)}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(lesson.id)}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
