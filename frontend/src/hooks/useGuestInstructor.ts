// Hook que busca um usuário aleatório da RandomUser API para exibir como instrutor convidado.

import { useEffect, useState } from 'react'

//----------Tipos----------
// Subconjunto dos dados retornados pela RandomUser API que o componente precisa.
export interface GuestInstructor {
  name: string
  email: string
  picture: string
  location: string
}

export function useGuestInstructor() {
  const [instructor, setInstructor] = useState<GuestInstructor | null>(null)
  const [loading, setLoading] = useState(true)

  //----------Busca----------
  // Executa uma única vez ao montar o componente que usa o hook.
  // Em caso de erro de rede, instructor permanece null e o componente não exibe o card.
  useEffect(() => {
    fetch('https://randomuser.me/api/')
      .then(r => r.json())
      .then(data => {
        const u = data.results[0]
        setInstructor({
          name:     `${u.name.first} ${u.name.last}`,
          email:    u.email,
          picture:  u.picture.medium,
          // Concatena cidade e país para uma localização legível.
          location: `${u.location.city}, ${u.location.country}`,
        })
      })
      .catch(() => setInstructor(null))
      .finally(() => setLoading(false))
  }, [])

  return { instructor, loading }
}
