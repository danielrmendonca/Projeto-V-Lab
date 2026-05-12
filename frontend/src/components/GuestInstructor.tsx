// Card que exibe o instrutor convidado buscado da RandomUser API.

import { useGuestInstructor } from '../hooks/useGuestInstructor'

export default function GuestInstructor() {
  const { instructor, loading } = useGuestInstructor()

  //----------Estados de feedback----------
  if (loading) return <p className="text-sm text-slate-400">Carregando instrutor...</p>
  // Falha silenciosa: se a API externa não responder, o card simplesmente não aparece.
  if (!instructor) return null

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white">
      <p className="text-xs text-slate-400 uppercase tracking-wide mb-3">Instrutor Convidado</p>
      <div className="flex items-center gap-3">
        <img
          src={instructor.picture}
          alt={instructor.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-slate-800">{instructor.name}</p>
          <p className="text-xs text-slate-500">{instructor.email}</p>
          <p className="text-xs text-slate-400">{instructor.location}</p>
        </div>
      </div>
    </div>
  )
}
