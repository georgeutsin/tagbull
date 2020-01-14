# frozen_string_literal: true

# Response formatting helperss
module Response
  def json_response(object, status = :ok)
    render json: { data: object }, status: status
  end

  def json_error(object, status = :error)
    render json: { error: object }, status: status
  end
end
