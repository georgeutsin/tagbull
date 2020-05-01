# frozen_string_literal: true

# Controller for authenticating users
class V1::AuthenticationController < ApplicationController
  skip_before_action :authenticate_request

  def authenticate
    command = AuthenticateUser.call(params[:email], params[:password])

    if command.success?
      json_response(auth_token: command.result)
    else
      json_error({ error: command.errors }, status: :unauthorized)
    end
  end

  def register
    User.create!(email: params[:email], password: params[:password])
    authenticate
  end
end
