# frozen_string_literal: true

# Controller for viewing actor stats
class V1::ActorsController < ApplicationController
  # GET /actors?project_id=id
  def index
    if params[:project_id]
      actors = Actor.joins(sample: :task).where(tasks: { project_id: params[:project_id] })
      return json_response(actors)
    end
    actors = Actor.all
    json_response(actors)
  end

  # GET /actors/id?project_id=id
  def show
    # TODO: add actor stats model and call it here
    json_response(Actor.find(params[:id]))
  end
end
