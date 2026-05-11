# Testando a API no Postman / Insomnia

Roteiro manual para validar o fluxo de autenticação (signup → login → rota protegida).

## Pré-requisitos

1. Subir o servidor:
   ```bash
   cd backend
   rails s -p 3000
   ```
2. API disponível em `http://localhost:3000`.

## Endpoints disponíveis nesta etapa

| Método | Rota      | Auth obrigatória? | Descrição                          |
|--------|-----------|-------------------|------------------------------------|
| POST   | `/signup` | Não               | Cria um usuário e retorna o token  |
| POST   | `/login`  | Não               | Autentica e retorna o token        |
| GET    | `/me`     | Sim (Bearer)      | Retorna o usuário do token atual   |

---

## Request 1 — Cadastro (`POST /signup`)

| Campo   | Valor                                  |
|---------|----------------------------------------|
| Method  | `POST`                                 |
| URL     | `http://localhost:3000/signup`         |
| Headers | `Content-Type: application/json`       |

**Body (raw JSON):**
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
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjox..."
}
```

> Copie o valor do `token` — usaremos no `/me`.

---

## Request 2 — Login (`POST /login`)

| Campo   | Valor                            |
|---------|----------------------------------|
| Method  | `POST`                           |
| URL     | `http://localhost:3000/login`    |
| Headers | `Content-Type: application/json` |

**Body:**
```json
{ "email": "daniel@example.com", "password": "secret123" }
```

**Resposta esperada (`200 OK`):** mesmo formato do signup, com um token novo.

**Senha errada (`401 Unauthorized`):**
```json
{ "error": "E-mail ou senha inválidos" }
```

---

## Request 3 — Rota protegida (`GET /me`)

| Campo   | Valor                                            |
|---------|--------------------------------------------------|
| Method  | `GET`                                            |
| URL     | `http://localhost:3000/me`                       |
| Headers | `Authorization: Bearer <COLE_O_TOKEN_AQUI>`      |

**Resposta esperada (`200 OK`):**
```json
{ "id": 1, "name": "Daniel", "email": "daniel@example.com" }
```

**Sem o header `Authorization` ou com token inválido (`401`):**
```json
{ "error": "Não autorizado" }
```

---

## Dica — salvar o token automaticamente

### Postman
Na request de **Login**, aba **Tests**, cole:
```javascript
const data = pm.response.json();
pm.environment.set("token", data.token);
```
Depois, em outras requests, use o header `Authorization: Bearer {{token}}`.

### Insomnia
Crie um Environment, e nas requests protegidas use o template tag **Response → Body Attribute** apontando para a request de Login, atributo `token`.

---

## Casos de erro para conferir

| Cenário                              | Status | Corpo esperado                                      |
|--------------------------------------|--------|-----------------------------------------------------|
| Signup sem password                  | 422    | `{ "errors": ["Password can't be blank", ...] }`    |
| Signup com email duplicado           | 422    | `{ "errors": ["Email has already been taken"] }`    |
| Signup com email inválido            | 422    | `{ "errors": ["Email is invalid"] }`                |
| Login com email inexistente          | 401    | `{ "error": "E-mail ou senha inválidos" }`          |
| `/me` sem header `Authorization`     | 401    | `{ "error": "Não autorizado" }`                     |
| `/me` com token expirado (24h)       | 401    | `{ "error": "Não autorizado" }`                     |
