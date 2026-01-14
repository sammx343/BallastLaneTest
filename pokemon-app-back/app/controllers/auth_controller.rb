class AuthController < ApplicationController
  def login
    username = params[:username]
    password = params[:password]

    if username == 'admin' && password == 'admin'
      # En un escenario real devolveríamos un JWT.
      # Para este ejercicio, un token simulado es suficiente.
      render json: { 
        message: 'Login successful', 
        token: 'mock-secure-token-12345',
        user: { username: 'admin' }
      }, status: :ok
    else
      render json: { error: 'Invalid credentials' }, status: :unauthorized
    end
  end
end