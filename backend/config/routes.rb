Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check 

  # Definição das rotas----------
  post "signup", to: "auth#signup"
  post "login",  to: "auth#login"
  get  "me",     to: "me#show"
end
