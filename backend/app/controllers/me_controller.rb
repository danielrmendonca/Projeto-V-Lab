class MeController < ApplicationController
  # Métodos serão definidos no routes,rb
  before_action :authenticate_request!  # Só funciona se o token for válido

  # GET /me
  def show
    # Como o current_user foi definido no ApplicationController, ele está disponível aqui
    render json: { id: current_user.id, name: current_user.name, email: current_user.email }
  end
end
