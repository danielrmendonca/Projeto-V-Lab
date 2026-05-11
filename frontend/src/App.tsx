import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'

/**
Componente temporário de Dashboard.
*/

function Dashboard() {
  const { user, logout } = useAuth()
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center flex flex-col gap-3">
        <p className="text-slate-800 font-medium">Olá, {user?.name}</p>
        <button
          onClick={logout}
          className="text-sm text-slate-500 hover:text-red-500"
        >
          Sair
        </button>
      </div>
    </main>
  )
}


/*
HOC para Proteção de Rotas, autentica o usuário antes de renderizar o conteúdo.
Verifica se o usuário está autenticado antes de renderizar o conteúdo.
*/
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  /*
  Carregamento, adicionar ui
  */
  if (loading) return null
  // Se não estiver carregando e não houver usuário, redireciona para o login
  return user ? <>{children}</> : <Navigate to="/login" replace />
}


/*
Componente Principal da Aplicação.
Define a estrutura de roteamento e envolve a app com o provedor de autenticação.
*/
export default function App() {
  return (
    <BrowserRouter>
      {/* AuthProvider deve estar dentro do Router para permitir navegação interna se necessário */}
      <AuthProvider>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Rota Protegida */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          {/* Redirecionamento padrão para rotas inexistentes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
