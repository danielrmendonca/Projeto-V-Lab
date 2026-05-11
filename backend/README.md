# CourseSphere — Backend (Rails API)

API REST construída com Ruby on Rails em modo API para o sistema de gestão de cursos CourseSphere.

---

## Passo a Passo de Configuração do Zero

Este guia documenta exatamente como este projeto foi criado, do zero ao servidor rodando.

### 1. Instalar o Ruby

Baixe e instale o Ruby via **RubyInstaller** (Windows):
- Acesse [rubyinstaller.org/downloads](https://rubyinstaller.org/downloads/)
- Baixe a versão **Ruby+Devkit 3.x.x (x64)** — a recomendada na página
- Durante a instalação, marque a opção de rodar o `ridk install` no final (instala dependências nativas necessárias)

Verifique a instalação:
```bash
ruby -v
gem -v
```

### 2. Instalar o Rails

```bash
gem install rails
```

Verifique:
```bash
rails -v
# Rails 7.2.x
```

### 3. Criar o Projeto em Modo API

O flag `--api` remove tudo que é desnecessário para uma API (views, assets, sessões de cookie, etc.) e gera um projeto mais enxuto.

```bash
rails new backend --api
cd backend
```

### 4. Adicionar as Gems Necessárias

Abra o `Gemfile` e adicione/descomente as seguintes gems:

```ruby
# Criptografia de senha
gem "bcrypt", "~> 3.1.7"

# Autenticação stateless via token
gem "jwt", "~> 2.8"

# Permite requisições do frontend (CORS)
gem "rack-cors"
```

Instale as gems:
```bash
bundle install
```

### 5. Configurar o CORS

O CORS permite que o frontend (React, rodando em outra porta) consiga chamar a API. Edite `config/initializers/cors.rb`:

```ruby
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:5173" # Vite
    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

### 6. Gerar as Migrations e Models

```bash
# Model User (com has_secure_password via bcrypt)
rails generate model User name:string email:string password_digest:string

# Model Course
rails generate model Course name:string description:text start_date:date end_date:date creator:references

# Model Lesson
rails generate model Lesson title:string status:string video_url:string course:references
```

### 7. Rodar as Migrations

Cria o banco de dados SQLite e as tabelas:

```bash
rails db:create
rails db:migrate
```

### 8. Iniciar o Servidor

```bash
rails server
# ou: rails s
```

A API estará disponível em `http://localhost:3000`.

---

## Endpoints Disponíveis

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/signup` | Criar conta | Não |
| POST | `/login` | Autenticar e receber token JWT | Não |
| GET | `/me` | Dados do usuário logado | Sim |

> Rotas autenticadas exigem o header: `Authorization: Bearer <token>`

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (já está no `.gitignore`):

```
JWT_SECRET=sua_chave_secreta_aqui
```

---

## Stack

- **Ruby** 3.x
- **Rails** 7.2.x (API mode)
- **SQLite3** (banco de dados local)
- **bcrypt** — hash de senha
- **jwt** — autenticação stateless
- **rack-cors** — Cross-Origin Resource Sharing
