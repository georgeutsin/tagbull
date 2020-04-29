# frozen_string_literal: true

# Tasks controller for creating new tasks
class V1::TasksController < ApplicationController
  def create
    project = Project.find_by(id: params[:project_id])
    return json_error(message: 'invalid project id') if project.nil?

    TaskCreator.create(project, params[:task], params[:media])
  end
end
