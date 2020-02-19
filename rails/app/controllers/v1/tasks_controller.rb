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
      dichotomy = Dichotomy.find_or_create_by!(first: params[:first], second: params[:second])

      params[:media].each do |m|
        task = DichotomyTask.create!(project_id: project.id, dichotomy_id: dichotomy.id)
        # the media item belongs to task, so it needs to be created after the task
        medium = task.acting_as.create_medium!(name: m[:name], url: m[:url])

        task.acting_as.media_id = medium.id
        task.acting_as.save!

        results.append(task.acting_as.id)
      end
    end

    json_response(results)

  end
end
