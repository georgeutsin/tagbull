# frozen_string_literal: true

# Default api root controller
class WelcomeController < ApplicationController
  def index
    render json: {}
  end
end
