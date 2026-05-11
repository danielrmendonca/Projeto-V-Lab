class AuthController < ApplicationController
  # O controller é neutro quanto ao HTTP, mas vou definir no routes.rb que as funções daqui são POST
  # POST /signup
  def signup
    user = User.new(signup_params)

    if user.save
      # Retorna o payload customizado e o token JWT criado na hora
      render json: { user: user_payload(user), token: issue_token(user) }, status: :created
    else
      # Se falhar na validação do Model (ex. e-mail repetido), o Rails já traz os erros prontos
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /login
  def login
    # Limpa e padroniza o e-mail antes da busca (Boas práticas de dados)
    user = User.find_by(email: login_params[:email].to_s.downcase.strip)

    # O operador &. (Safe Navigation) evita erro se o user for nulo
    # authenticate é um método do Rails (da gem bcrypt, descomentado) que checa a senha
    if user&.authenticate(login_params[:password])
      render json: { user: user_payload(user), token: issue_token(user) }, status: :ok
    else
      render json: { error: "E-mail ou senha inválidos" }, status: :unauthorized
    end
  end

  private

  # Define quais campos o usuário pode enviar. 
  # Impede que alguém envie admin: true.
  def signup_params
    params.require(:user).permit(:name, :email, :password)
  end

  def login_params
    params.require(:user).permit(:email, :password)
  end

  # Gera o JWT
  def issue_token(user)
    JsonWebToken.encode(user_id: user.id)
  end

  # Hash simples
  def user_payload(user)
    { id: user.id, name: user.name, email: user.email }
  end
end
