# frozen_string_literal: true

# Tasks controller for creating new tasks
class V1::TasksController < ApplicationController
  def create
    return json_error(message: 'unauthorized') unless @current_user.projects.include?(params[:project_id].to_i)

    project = Project.find_by(id: params[:project_id])
    return json_error(message: 'invalid project id') if project.nil?

    json_response(TaskCreator.create(project, params[:task], params[:media], @current_user.id))
  end
end
