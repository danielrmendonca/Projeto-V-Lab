class ApplicationController < ActionController::API
  attr_reader :current_user # Expõe o usuário logado para que outros controllers possam usá-lo

  # Método de segurança que será chamado antes das ações que exigem login
  def authenticate_request!
    header = request.headers["Authorization"]
    # Pega o JWT da string "Bearer <token>"
    token = header.to_s.split(" ").last
    decoded = JsonWebToken.decode(token)

    # Busca o usuário apenas se o token for válido. 
    # If na mesma linha para melhor organização do código, evitando aninhamento desnecessário.
    @current_user = User.find_by(id: decoded[:user_id]) if decoded

    # Se @current_user for nulo, barra a requisição retornando erro 401 Unauthorized.
    render json: { error: "Não autorizado" }, status: :unauthorized unless @current_user
  end
end
