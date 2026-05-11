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

## Decisões Técnicas

- **SQLite** ao invés de Postgres: zero configuração no Windows, suficiente para o escopo do desafio.
- **API mode** no Rails: descarta views/assets/helpers, mantém apenas o necessário para servir JSON.
- **Tailwind v3** em vez de v4: configuração mais estável e amplamente documentada.