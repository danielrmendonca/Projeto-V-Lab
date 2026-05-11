import { createContext, useContext, useEffect, useState } from 'react'
import api from '../lib/api'

// Usuário
interface User {
  id: number
  name: string
  email: string
}

// Definição dos métodos e estados expostos pelo contexto de autenticação.
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// Criação do contexto de autenticação, inicialmente nulo.
const AuthContext = createContext<AuthContextType | null>(null)

// Componente provedor de autenticação, responsável por gerenciar o estado do usuário e fornecer métodos de login, cadastro e logout.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Verifica se há um token de autenticação no localStorage ao montar o componente. Se houver, tenta obter os dados do usuário. Caso contrário, define o estado de loading como false.
  useEffect(() => {
    const token = localStorage.getItem('token')

    // Se não houver token, encerra o carregamento
    if (!token) {
      setLoading(false)
      return
    }

    // Valida o token com o back no endpoint /me
    api.get('/me')
      .then((res) => setUser(res.data.user))
      // Se o token for inválido ou expirou, removemos do storage
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  // Realiza o login, envia no formato esperado pelo Rails
  async function login(email: string, password: string) {
    const res = await api.post('/login', { user: { email, password } })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  // Cria um novo usuário, envia no formato esperado pelo Rails
  async function signup(name: string, email: string, password: string) {
    const res = await api.post('/signup', { user: { name, email, password } })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  // Finaliza a sessão do usuário, removendo o token do localStorage e limpando o estado do usuário.
  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook personalizado para acessar o contexto de autenticação, garantindo que seja usado dentro do provedor de autenticação. Se for usado fora do provedor, lança um erro.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
