# Utilitároio para criar e decodificar JWT para autenticação.
class JsonWebToken

  # Garante que ninguém consiga forjar um token sem ter acesso ao seu servidor.
  SECRET_KEY = Rails.application.secret_key_base

  # Define um tempo de expiração padrão de 24 horas.
  DEFAULT_EXP = 24.hours.from_now

  # Método para transformar dados (como o ID do usuário) em uma string criptografada (Token).
  def self.encode(payload, exp = DEFAULT_EXP)
    payload[:exp] = exp.to_i # # Adiciona a data de expiração ao corpo do token.
    JWT.encode(payload, SECRET_KEY)
  end

  # Método para ler o Token e devolver os dados originais.
  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY).first
    HashWithIndifferentAccess.new(decoded) # Permite acessar os dados tanto por string ["user_id"] quanto por símbolo [:user_id].
  rescue JWT::DecodeError
    # Se o token estiver expirado, corrompido ou for falso, pega o erro aqui.
    nil # nil indica que falhou.
  end
end
