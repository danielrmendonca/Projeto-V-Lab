class Lesson < ApplicationRecord
  STATUSES = %w[draft published].freeze # %w cria um array de strings, draft e published.
  # Maiúsculo: Constante (Lesson::STATUSES) o .freeze garante

  belongs_to :course

  validates :title, presence: true, length: { minimum: 3 }
  validates :status, presence: true, inclusion: { in: STATUSES } # Garante que o status seja apenas um dos 2 definidos na constante STATUSES.
  # Validar se a URL do vídeo é um link HTTP/HTTPS válido.
  validates :video_url,
            format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]) },
            allow_blank: true
end
