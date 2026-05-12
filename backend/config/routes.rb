Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  #----------Autenticação----------
  # Rotas manuais: não usam resources porque não seguem o padrão CRUD de um model.
  post "signup", to: "auth#signup"
  post "login",  to: "auth#login"
  get  "me",     to: "me#show"

  #----------Recursos REST----------
  # resources gera rotas RESTful automaticamente, mapeando verbos HTTP para ações do controller.
  # Por padrão geraria 7 rotas, mas only: filtra .
  # new e edit são omitidos pois servem apenas para renderizar formulários HTML.
  
  # GET    /courses          -> courses#index   (listar todos os cursos)
  # POST   /courses          -> courses#create  (criar um curso)
  # GET    /courses/:id      -> courses#show    (exibir um curso)
  # PATCH  /courses/:id      -> courses#update  (atualizar um curso)
  # DELETE /courses/:id      -> courses#destroy (excluir um curso)
  resources :courses, only: [:index, :create, :show, :update, :destroy] do
    # Aninhamento: lessons declarado dentro do bloco do-end de courses.
    # O Rails prefixia o caminho com /courses/:course_id/.
    # Uma aula sempre pertence a um curso.
    
    # POST   /courses/:course_id/lessons     -> lessons#create
    # PATCH  /courses/:course_id/lessons/:id -> lessons#update
    # DELETE /courses/:course_id/lessons/:id -> lessons#destroy
    resources :lessons, only: [:create, :update, :destroy]
  end
end
