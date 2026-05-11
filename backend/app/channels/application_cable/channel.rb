module ApplicationCable
  # Classe base para todos os canais de comunicação em tempo real.
  # Assim como o ApplicationController gerencia HTTP, aqui gerencia WebSockets.
  # :: Acessa componentes definidos dentro de outra classe ou model
  class Channel < ActionCable::Channel::Base
  end
end
