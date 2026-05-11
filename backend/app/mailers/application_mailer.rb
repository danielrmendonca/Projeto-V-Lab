class ApplicationMailer < ActionMailer::Base
  # Configuração padrão de remetente para todos os e-mails do sistema
  default from: "from@example.com"
  layout "mailer"
end
