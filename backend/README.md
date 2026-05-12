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
      expose: ["Authorization"], # Permite que o front leia o header Authorization na resposta
      methods: [:get, :post, :put, :patch, :delete, :options, :head]
  end
end
```

### 6. Criar o Service de JWT

Crie o diretório `app/services/` e o arquivo `app/services/json_web_token.rb`:

```ruby
class JsonWebToken
  SECRET_KEY = Rails.application.secret_key_base
  DEFAULT_EXP = 24.hours.from_now

  def self.encode(payload, exp = DEFAULT_EXP)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY)
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY).first
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::DecodeError
    nil
  end
end
```

> O `secret_key_base` é gerado automaticamente pelo Rails e armazenado em `config/credentials.yml.enc`. Não é necessário nenhum arquivo `.env`.

### 7. Gerar as Migrations e Models

```bash
# Model User (com has_secure_password via bcrypt)
rails generate model User name:string email:string password_digest:string

# Model Course
rails generate model Course name:string description:text start_date:date end_date:date creator:references

# Model Lesson
rails generate model Lesson title:string status:string video_url:string course:references
```

### 8. Rodar as Migrations

Cria o banco de dados SQLite e as tabelas:

```bash
rails db:create
rails db:migrate
```

### 9. Iniciar o Servidor

```bash
rails server
# ou: rails s
```

A API estará disponível em `http://localhost:3000`.

---

## Endpoints Disponíveis

| Método | Rota                                  | Auth?        | Descrição                                           |
|--------|---------------------------------------|--------------|-----------------------------------------------------|
| POST   | `/signup`                             | Não          | Cria usuário e retorna token JWT                    |
| POST   | `/login`                              | Não          | Autentica e retorna token JWT                       |
| GET    | `/me`                                 | Sim          | Retorna dados do usuário autenticado                |
| GET    | `/courses`                            | Não          | Lista todos os cursos                               |
| POST   | `/courses`                            | Sim          | Cria um curso                                       |
| GET    | `/courses/:id`                        | Não          | Exibe curso com suas aulas embutidas                |
| PUT    | `/courses/:id`                        | Sim (criador)| Atualiza um curso                                   |
| DELETE | `/courses/:id`                        | Sim (criador)| Exclui um curso e todas as suas aulas               |
| POST   | `/courses/:course_id/lessons`         | Sim (criador)| Cria uma aula dentro de um curso                    |
| PUT    | `/courses/:course_id/lessons/:id`     | Sim (criador)| Atualiza uma aula                                   |
| DELETE | `/courses/:course_id/lessons/:id`     | Sim (criador)| Exclui uma aula                                     |

> Rotas autenticadas exigem o header: `Authorization: Bearer <token>`  
> "criador" significa que apenas o usuário que criou o curso pode executar a ação.  
> As aulas não têm rota própria de listagem — elas vêm embutidas na resposta de `GET /courses/:id`.

---

## Stack

- **Ruby** 3.x
- **Rails** 7.2.x (API mode)
- **SQLite3** — banco de dados local
- **bcrypt** — hash de senha com `has_secure_password`
- **jwt** — autenticação stateless
- **rack-cors** — Cross-Origin Resource Sharing

---

## Conceitos de Ruby on Rails Aplicados

### Convention over Configuration

O Rails segue o princípio de "convenção sobre configuração": ao nomear um model `Course`, o Rails automaticamente sabe que a tabela no banco se chama `courses`, que o controller é `CoursesController` e que as rotas seguem o padrão REST. Isso elimina a necessidade de configuração explícita para a maioria dos casos.

### API Mode

Criado com `rails new --api`, o projeto carrega apenas o subconjunto de middlewares necessário para uma API REST — sem views, assets, cookies ou sessões. O `ApplicationController` herda de `ActionController::API` em vez de `ActionController::Base`.

### Active Record (ORM)

O Active Record é a camada de acesso ao banco de dados do Rails. Cada model é uma classe Ruby que representa uma tabela:

```ruby
# Associações declarativas — o Rails gera os métodos de join automaticamente
class Course < ApplicationRecord
  belongs_to :creator, class_name: "User"
  has_many :lessons, dependent: :destroy
end
```

O `dependent: :destroy` garante que, ao excluir um curso, todas as suas aulas também sejam removidas — sem SQL manual.

### Migrations

As migrations são arquivos Ruby que descrevem alterações no schema do banco de forma versionada e reversível. Geradas com `rails generate model`, permitem que qualquer desenvolvedor reconstrua o banco com `rails db:migrate`.

### Validações no Model

As regras de negócio ficam no model, não no controller:

```ruby
validates :name, presence: true, length: { minimum: 3 }
validates :status, inclusion: { in: %w[draft published] }
validate :end_date_after_start_date  # validação customizada
```

Isso garante integridade dos dados independentemente de onde o model for chamado.

### `has_secure_password`

Uma única linha no model `User` ativa toda a lógica de senha segura via bcrypt: salva o hash em `password_digest`, expõe o método `authenticate(senha)` e adiciona validações de presença e confirmação automaticamente.

### Callbacks (`before_save`, `before_action`)

- **Model callback** (`before_save :downcase_email`): executa lógica automaticamente antes de persistir no banco.
- **Controller filter** (`before_action :authenticate_request!`): o Rails executa os filtros em ordem antes de cada action, permitindo montar uma pipeline de autorização declarativa.

```ruby
before_action :authenticate_request!
before_action :set_course
before_action :authorize_creator!
```

### Strong Parameters

O Rails rejeita qualquer parâmetro que não seja explicitamente permitido, protegendo contra mass assignment:

```ruby
def course_params
  params.require(:course).permit(:name, :description, :start_date, :end_date)
end
```

Um usuário não pode enviar `creator_id: outro_usuario` porque esse campo não está na lista.

### Rotas RESTful e Recursos Aninhados

O helper `resources` gera automaticamente as 5 rotas CRUD com os verbos HTTP corretos. O aninhamento com `do...end` cria rotas com escopo de pai:

```ruby
resources :courses, only: [:index, :create, :show, :update, :destroy] do
  resources :lessons, only: [:create, :update, :destroy]
end
# Gera: POST /courses/:course_id/lessons, etc.
```

### Service Object

A classe `JsonWebToken` em `app/services/` encapsula lógica que não pertence a model nem a controller — um padrão comum para manter os controllers limpos. O Rails autocarrega qualquer classe dentro de `app/` sem necessidade de `require`.

### Eager Loading (`includes`)

```ruby
Course.includes(:creator).all
```

Sem o `includes`, ao acessar `course.creator.name` para cada curso, o Rails faria uma query SQL por item (problema N+1). O `includes` resolve tudo em duas queries independente do número de registros.

### `head :no_content`

Em ações de exclusão, o Rails retorna `204 No Content` com `head :no_content` — sem corpo de resposta, apenas o status HTTP indicando sucesso. Isso segue a semântica correta do protocolo HTTP para operações DELETE.
