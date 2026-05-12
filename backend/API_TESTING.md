# Testando a API no Postman / Insomnia

Roteiro manual para validar todos os fluxos da API. Siga a ordem — cada etapa depende da anterior.

## Pré-requisitos

1. Subir o servidor:
   ```bash
   cd backend
   rails s -p 3000
   ```
   (Ou simplesmente rails server)
2. API disponível em `http://localhost:3000`.
3. Todas as requests com body usam o header `Content-Type: application/json`.

---

## Etapa 1 — Autenticação

### Request 1.1 — Cadastro (`POST /signup`)

| Campo   | Valor                            |
|---------|----------------------------------|
| Method  | `POST`                           |
| URL     | `http://localhost:3000/signup`   |

**Body:**
```json
{
  "user": {
    "name": "Daniel",
    "email": "daniel@example.com",
    "password": "secret123"
  }
}
```

**Resposta esperada (`201 Created`):**
```json
{
  "user": { "id": 1, "name": "Daniel", "email": "daniel@example.com" },
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

> Copie o valor de `token` — você vai colá-lo manualmente nas requests protegidas.

---

### Request 1.2 — Login (`POST /login`)

| Campo   | Valor                          |
|---------|--------------------------------|
| Method  | `POST`                         |
| URL     | `http://localhost:3000/login`  |

**Body:**
```json
{ "email": "daniel@example.com", "password": "secret123" }
```

**Resposta esperada (`200 OK`):** mesmo formato do signup, com um novo token.

**Senha errada (`401`):**
```json
{ "error": "E-mail ou senha inválidos" }
```

---

### Request 1.3 — Rota protegida (`GET /me`)

| Campo   | Valor                                       |
|---------|---------------------------------------------|
| Method  | `GET`                                       |
| URL     | `http://localhost:3000/me`                  |
| Headers | `Authorization: Bearer <COLE_O_TOKEN_AQUI>` |

**Resposta esperada (`200 OK`):**
```json
{ "id": 1, "name": "Daniel", "email": "daniel@example.com" }
```

---

## Etapa 2 — Cursos

Use o header `Authorization: Bearer <token>` em todas as requests abaixo.

### Request 2.1 — Criar curso (`POST /courses`)

**Body:**
```json
{
  "course": {
    "name": "Ruby on Rails do Zero",
    "description": "Curso introdutório de Rails em modo API.",
    "start_date": "2026-06-01",
    "end_date": "2026-07-01"
  }
}
```

**Resposta esperada (`201 Created`):**
```json
{
  "id": 1,
  "name": "Ruby on Rails do Zero",
  "description": "Curso introdutório de Rails em modo API.",
  "start_date": "2026-06-01",
  "end_date": "2026-07-01",
  "creator_id": 1
}
```

> Anote o `id` do curso para as próximas requests.

---

### Request 2.2 — Listar cursos (`GET /courses`)

Nenhum body. Retorna array com todos os cursos.

---

### Request 2.3 — Exibir curso (`GET /courses/1`)

Substitua `1` pelo id do curso criado.

---

### Request 2.4 — Atualizar curso (`PUT /courses/1`)

**Body:**
```json
{
  "course": {
    "description": "Descrição atualizada."
  }
}
```

**Resposta esperada (`200 OK`):** curso com os dados atualizados.

**Com usuário diferente do criador (`403 Forbidden`):**
```json
{ "error": "Acesso negado" }
```

---

### Request 2.5 — Excluir curso (`DELETE /courses/1`)

Nenhum body. **Resposta esperada (`204 No Content`).**

---

## Etapa 3 — Aulas

Use o mesmo header de autenticação. Substitua `1` pelo id de um curso existente.

### Request 3.1 — Criar aula (`POST /courses/1/lessons`)

**Body:**
```json
{
  "lesson": {
    "title": "Introdução ao Rails",
    "status": "draft",
    "video_url": "https://www.youtube.com/watch?v=exemplo"
  }
}
```

**Resposta esperada (`201 Created`):**
```json
{
  "id": 1,
  "title": "Introdução ao Rails",
  "status": "draft",
  "video_url": "https://www.youtube.com/watch?v=exemplo",
  "course_id": 1
}
```

> Anote o `id` da aula para as próximas requests.

---

### Request 3.2 — Listar aulas (`GET /courses/1/lessons`)

Nenhum body. Retorna array de aulas do curso.

---

### Request 3.3 — Atualizar aula (`PUT /courses/1/lessons/1`)

**Body:**
```json
{
  "lesson": {
    "status": "published"
  }
}
```

**Resposta esperada (`200 OK`):** aula com `status: "published"`.

---

### Request 3.4 — Excluir aula (`DELETE /courses/1/lessons/1`)

Nenhum body. **Resposta esperada (`204 No Content`).**

---

## Casos de erro para conferir

| Cenário                              | Status | Corpo esperado                                      |
|--------------------------------------|--------|-----------------------------------------------------|
| Signup sem password                  | 422    | `{ "errors": ["Password can't be blank"] }`         |
| Signup com email duplicado           | 422    | `{ "errors": ["Email has already been taken"] }`    |
| Signup com email inválido            | 422    | `{ "errors": ["Email is invalid"] }`                |
| Login com email inexistente          | 401    | `{ "error": "E-mail ou senha inválidos" }`          |
| `/me` sem header Authorization       | 401    | `{ "error": "Não autorizado" }`                     |
| Criar curso sem `name`               | 422    | `{ "errors": ["Name is too short (minimum is 3 characters)"] }` |
| `end_date` anterior a `start_date`   | 422    | `{ "errors": ["End date must be greater than or equal to start date"] }` |
| Editar/excluir curso de outro usuário| 403    | `{ "error": "Acesso negado" }`                      |
| Criar aula com `video_url` inválida  | 422    | `{ "errors": ["Video url is invalid"] }`            |
| Aula com `title` menor que 3 chars  | 422    | `{ "errors": ["Title is too short (minimum is 3 characters)"] }` |
