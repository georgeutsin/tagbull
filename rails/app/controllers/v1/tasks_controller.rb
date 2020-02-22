# frozen_string_literal: true

# Tasks controller for creating new tasks
class V1::TasksController < ApplicationController
  def create
    case params[:task_type]
    when 'DichotomyTask'
      create_dichotomy_tasks
    else
      json_error(message: 'unknown task type')
    end
  end

  private

  def create_dichotomy_tasks
    project = Project.find_by(id: params[:project_id])
    if project == nil
      return json_error(message: 'invalid project id')
    end

    results = []
    ActiveRecord::Base.transaction do
      params[:media].each do |m|
        medium = Medium.create!(name: m[:name], url: m[:url])
        task = DichotomyTask.create!(
          project_id: project.id,
          first: params[:first],
          second: params[:second],
          media_id: medium.id
        )
        results.append(task.acting_as.id)
      end
    end
    json_response(results)
  end
end
