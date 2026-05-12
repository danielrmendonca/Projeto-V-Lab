# CourseSphere

Sistema Full Stack de gestão de cursos online.

---

## Stack

| Camada     | Tecnologia                                  |
|------------|---------------------------------------------|
| Backend    | Ruby on Rails 7.2 (API mode) + SQLite       |
| Frontend   | React + Vite + TypeScript + Tailwind CSS |
| Auth       | JWT (JSON Web Token)                        |
| Ícones     | lucide-react                                |
| HTTP       | axios                                       |
| Integração | RandomUser API (Instrutor Convidado)        |

O projeto foi desenvolvido com o auxilio do assistente de IA Gemini 3 (Raciocício e 3.1 Pro)

---

## Estrutura do Projeto

```
.
├── backend/      # API Rails (porta 3000)
│   ├── app/
│   ├── config/
│   ├── db/
│   └── Gemfile
├── frontend/     # SPA React + Vite (porta 5173)
│   ├── src/
│   ├── public/
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

Monorepo simples.

---

## Pré-requisitos

- **Ruby** 3.x (feito em 3.3.11)
- **Rails** 7.x (`gem install rails -v "~> 7.1"`)
- **Node.js**
- **npm**

---

## Como Rodar

### Backend

```bash
cd backend
bundle install
rails db:create db:migrate
rails s -p 3000
```

API disponível em `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App disponível em `http://localhost:5173`.

---

## Funcionalidades

- Registro e login com JWT
- Dashboard com listagem e **busca por nome** de curso
- Criação, edição e exclusão de cursos (somente o criador)
- Detalhes do curso com lista de aulas e **filtro por status** (Todos / Rascunho / Publicada)
- CRUD completo de aulas (somente o criador do curso)
- **Instrutor Convidado** gerado via RandomUser API em cada detalhe de curso

---

## Endpoints da API

### Autenticação

| Método | Rota      | Descrição              | Auth |
|--------|-----------|------------------------|------|
| POST   | /signup   | Criar conta            | —    |
| POST   | /login    | Autenticar e obter JWT | —    |
| GET    | /me       | Dados do usuário atual | JWT  |

### Cursos

| Método | Rota            | Descrição            | Auth         |
|--------|-----------------|----------------------|--------------|
| GET    | /courses        | Listar todos         | —            |
| GET    | /courses/:id    | Detalhes + aulas     | —            |
| POST   | /courses        | Criar curso          | JWT          |
| PATCH  | /courses/:id    | Editar curso         | JWT + criador|
| DELETE | /courses/:id    | Excluir curso        | JWT + criador|

### Aulas

| Método | Rota                              | Descrição    | Auth          |
|--------|-----------------------------------|--------------|---------------|
| POST   | /courses/:course_id/lessons       | Criar aula   | JWT + criador |
| PATCH  | /courses/:course_id/lessons/:id   | Editar aula  | JWT + criador |
| DELETE | /courses/:course_id/lessons/:id   | Excluir aula | JWT + criador |

---

## Decisões Técnicas

### Backend

- **SQLite** ao invés de Postgres: zero configuração no Windows, suficiente para o escopo do desafio.
- **API mode** no Rails: descarta views/assets/helpers, mantém apenas o necessário para servir JSON.
- **`secret_key_base` como chave JWT**: já gerada automaticamente pelo Rails, sem variável de ambiente extra.
- **`before_action` em cadeia**: `authenticate_request!` → `set_course` → `authorize_creator!` garante que a autorização só ocorra após o recurso ser encontrado, evitando vazamento de informação.
- **`head :no_content`** nas exclusões: retorna 204 sem corpo, seguindo o padrão REST.
- **Rotas aninhadas** (`resources :lessons` dentro de `resources :courses`): reflete a relação de posse no nível da URL, simplificando a autorização — basta carregar o curso pelo `course_id` para saber quem é o criador.
### Frontend

- **Filtragem local** (busca e filtro de status): os dados já estão em memória após o carregamento; filtrar no cliente evita requisições desnecessárias ao backend.
- **Custom hooks** (`useCourseDetail`, `useGuestInstructor`): separam lógica de estado e chamadas de API dos componentes visuais, que ficam responsáveis apenas pelo layout.
- **Serviços (`courseService`, `lessonService`)**: centralizam as chamadas Axios, evitando repetição de URLs e facilitando a troca de `baseURL` se necessário.
- **`PrivateRoute`** como HOC: protege rotas de forma declarativa no `App.tsx`, mantendo a lógica de autenticação fora de cada página.
- **Tailwind v3** em vez de v4: configuração mais estável e amplamente documentada.
