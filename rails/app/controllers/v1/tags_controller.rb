# frozen_string_literal: true

# Tags controller
class V1::TagsController < ApplicationController
  def index
    tags = tags_for(params[:project_id])
    json_response(tags)
  end

  def show
    samples = samples_for(params[:project_id], params[:id])
    json_response(samples)
  end

  private

  def tags_for(project_id)
    Task.joins(:sample)
        .where(tags_filter, project_id)
        .order(tasks_ordering)
        .map do |task|
          type = task.actable_type
          task = task.specific
          sample = Sample.where(task_id: task.id, is_tag: true).first.specific
          media = Medium.find(task.media_id)
          { type: type, task: task, tag: sample, media: media }
        end
  end

  def samples_for(_project_id, task_id)
    task = Task.where(id: task_id).first.specific
    type = task.acting_as.actable_type

    samples = Sample.where(task_id: task_id)
    samples = samples.map(&:specific)
    media = Medium.find(task.media_id)
    { type: type, task: task, samples: samples, media: media }
  end

  def tags_filter
    <<-SQL
      tasks.project_id = ?
      AND samples.is_tag
    SQL
  end

  def tasks_ordering
    <<-SQL
      tasks.created_at ASC
    SQL
  end
end
