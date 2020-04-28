# frozen_string_literal: true

# Tasks controller for creating new tasks
class V1::TasksController < ApplicationController
  def create
    project = Project.find_by(id: params[:project_id])
    return json_error(message: 'invalid project id') if project.nil?

    case params[:task_type]
    when 'DichotomyTask'
      create_tasks(project, method(:create_dichotomy_task), params)
    when 'LocatorTask'
      create_tasks(project, method(:create_locator_task), params)
    else
      json_error(message: 'unknown task type')
    end
  end

  private

  def create_tasks(project, create_fn, config)
    results = []
    ActiveRecord::Base.transaction do
      params[:media].each do |m|
        medium = Medium.create!(name: m[:name], url: m[:url])
        task = create_fn.call(project, medium, config)
        results.append(task.acting_as.id)
      end
    end
    json_response(results)
  end

  def create_dichotomy_task(project, medium, config)
    DichotomyTask.create!(
      project_id: project.id,
      first: config[:first],
      second: config[:second],
      parent_category: config[:parent_category],
      media_id: medium.id
    )
  end

  def create_locator_task(project, medium, config)
    LocatorTask.create!(
      project_id: project.id,
      media_id: medium.id,
      category: config[:category]
    )
  end
end
