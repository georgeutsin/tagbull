# frozen_string_literal: true

# Application controller
class ApplicationController < ActionController::API
  include Response
  before_action :authenticate_request
  attr_reader :current_user

  private

  def authenticate_request
    @current_user = AuthorizeApiRequest.call(request.headers).result
    json_error({ message: 'unauthorized' }, :unauthorized) unless @current_user
  end
end
