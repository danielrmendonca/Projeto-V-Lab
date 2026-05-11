import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
Página de autenticação do sistema.
Gerencia o estado do formulário de login, chamadas ao contexto de autenticação e redirecionamento pós-login.
 */

export default function Login() {
  // Hooks de contexto e navegação
  const { login } = useAuth()
  const navigate = useNavigate()
  // Estados locais para controle de formulário e feedback de UI
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

/*
Processa o envio do formulário.
Interage com o AuthContext e trata possíveis erros da API Rails.
@param {React.FormEvent} e ----- Evento de submissão do formulário.
*/
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Chama o método de login definido no AuthContext
      await login(email, password)
      // Se bem-sucedido, redireciona para a área administrativa/dashboard
      navigate('/dashboard')
    } catch (err: any) {
      // Captura a mensagem de erro da API
      setError(err.response?.data?.error || 'Erro ao fazer login.')
    } finally {
      // Estado de carregamento desativado
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-lg border border-slate-200 p-8">
        <h1 className="text-xl font-semibold text-slate-800 mb-6">Entrar</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Campo de E-mail */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-red-500"
            />
          </div>

          {/* Campo de Senha */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-red-500"
            />
          </div>

          {/* Feedback de erro */}
          {error && <p className="text-sm text-yellow-500">{error}</p>}

          {/* Botão de submissão com estado de loading */}
          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Navegação para registro */}
        <p className="text-sm text-slate-500 mt-4 text-center">
          Não tem conta?{' '}
          <Link to="/register" className="text-red-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  )
}
