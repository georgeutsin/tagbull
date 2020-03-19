# frozen_string_literal: true

# Response formatting helpers
module Response
  def json_response(object, status = :ok, base: {})
    render json: base.merge({ data: object }), status: status
  end

  def json_error(object, status = :error)
    render json: { error: object }, status: status
  end
end
