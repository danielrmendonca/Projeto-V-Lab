class User < ApplicationRecord
  has_secure_password # Ativa a criptografia de senha. (Requer a gem bcrypt)

  # Define que um usuário pode ter vários cursos. 
  # Como no Course usa 'creator', aqui precisamos dizer qual é a 'foreign_key'.
  has_many :courses, foreign_key: :creator_id, dependent: :destroy

  # Executa uma ação antes de salvar no banco.
  before_save :downcase_email

  validates :name, presence: true
  # Validação de e-mail
  validates :email,
            presence: true,
            uniqueness: { case_sensitive: false },
            format: { with: URI::MailTo::EMAIL_REGEXP }
  # allow_nil: true permite dar um update no usuário sem ter que enviar a senha de novo.
  validates :password, length: { minimum: 6 }, allow_nil: true

  private

  # Garante que o e-mail seja sempre salvo em minúsculo e sem espaços.
  def downcase_email
    self.email = email.downcase.strip if email.present?
  end
end
