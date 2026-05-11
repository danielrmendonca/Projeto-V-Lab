import axios from 'axios'

/*
Instância centralizada do Axios para comunicação com a API.
Centralizar a configuração permite alterar a URL base ou headers em um único lugar.
 */
const api = axios.create({
  // URL do rails server
  baseURL: 'http://localhost:3000',
})

/**
Interceptor de Requisição: Executado antes de cada chamada à API.
Ele verifica se existe um token JWT no armazenamento local e, caso positivo, injeta o cabeçalho de Autorização necessário para rotas protegidas no Rails.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
