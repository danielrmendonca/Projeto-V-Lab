# Be sure to restart your server when you modify this file.

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:5173" # Libera o endereço do front

    resource "*",
      headers: :any,
      expose: ["Authorization"], # expose permite que o front acesse o Authorization, onde o token JWT será enviado.
      methods: [:get, :post, :put, :patch, :delete, :options, :head] # HTTP
  end
end
