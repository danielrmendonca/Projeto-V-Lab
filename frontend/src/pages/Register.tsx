import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
Componente de Registro/SignUp.
Criação de novos usuários coletando nome, e-mail e senha.
*/

export default function Register() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  // Estados para capturar os dados de entrada
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Estados de controle de interface
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  /**
  Envia os dados de cadastro para a API Rails.
  Em caso de sucesso, o usuário é autenticado automaticamente e redirecionado para o dashboard.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(name, email, password)
      // Navega para a rota protegida após o sucesso
      navigate('/dashboard')
    } catch (err: any) {
      // O Rails retorna erros de validação em array (ex: ["Email já existe"]).
      setError(err.response?.data?.errors?.[0] || 'Erro ao criar conta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-lg border border-slate-200 p-8">
        <h1 className="text-xl font-semibold text-slate-800 mb-6">Criar conta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo Nome */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-red-500"
            />
          </div>

          {/* Campo E-mail */}
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

          {/* Campo Senha */}
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

          {/* Exibição de erros de validação */}
          {error && <p className="text-sm text-yellow-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-red-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar conta'}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-4 text-center">
          Já tem conta?{' '}
          <Link to="/login" className="text-red-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
