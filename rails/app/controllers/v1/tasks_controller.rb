# frozen_string_literal: true

# Tasks controller for creating new tasks
class V1::TasksController < ApplicationController
  def create
    project = Project.find_by(id: params[:project_id])
    return json_error(message: 'invalid project id') if project.nil?

    case params[:task_type]
    when 'DichotomyTask'
      create_dichotomy_tasks(project)
    else
      json_error(message: 'unknown task type')
    end
  end

  private

  def create_dichotomy_tasks(project)
    results = []
    ActiveRecord::Base.transaction do
      params[:media].each do |m|
        medium = Medium.create!(name: m[:name], url: m[:url])
        task = create_dichotomy_task(project, medium)
        results.append(task.acting_as.id)
      end
    end
    json_response(results)
  end

  def create_dichotomy_task(project, medium)
    DichotomyTask.create!(
      project_id: project.id,
      first: params[:first],
      second: params[:second],
      parent_category: params[:parent_category],
      media_id: medium.id
    )
  end
end
