class Course < ApplicationRecord

  belongs_to :creator, class_name: "User" # Nome da associaçao e qual model o Rails deve usar
  # Se o curso for deletado, as lições dele também serão.
  has_many :lessons, dependent: :destroy

  validates :name, presence: true, length: { minimum: 3 }
  validates :start_date, presence: true
  validates :end_date, presence: true
  validate :end_date_after_start_date # Validação específica.

  private

  # Método privado para validação para garantir que ninguém crie um curso que começa depois de terminar.
  def end_date_after_start_date
    return if start_date.blank? || end_date.blank?

    errors.add(:end_date, "deve ser maior ou igual à data de início") if end_date < start_date
  end
end
