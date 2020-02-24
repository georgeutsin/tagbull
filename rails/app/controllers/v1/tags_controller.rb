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
        .order(created_at: :asc)
        .map do |task|
          tag_for(task)
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
      AND tasks.parent_id IS NULL
      AND samples.is_tag
    SQL
  end

  # rubocop:disable Metrics/MethodLength
  def tag_for(task)
    tag = nil
    case task.actable_type
    when 'BoundingBoxTask', 'LocatorTask', 'DiscreteAttributeTask'
      tag = tag_for_basic(task)
    when 'DichotomyTask'
      tag = tag_for_dichotomy(task)
    when 'MetadataTask'
      tag = tag_for_metadata(task)
    else
      return json_error(message: 'unknown task type')
    end
    base_tag_params(task).merge({ tag: tag })
  end
  # rubocop:enable Metrics/MethodLength

  def base_tag_params(task)
    type = task.actable_type
    task = task.specific
    media = Medium.find(task.media_id)
    { type: type, task: task, media: media }
  end

  def tag_for_basic(task)
    Sample.find_by(task_id: task.id, is_tag: true).specific
  end

  def tag_for_dichotomy(task)
    bb_task = Task.find(actable_type: 'BoundingBoxTask', parent_id: task.id)
    metadata_task = Task.find(actable_type: 'MetadataTask', parent_id: task.id)
    { bounding_box: tag_for_basic(bb_task), metadata: tag_for_metadata(metadata_task) }
  end

  def tag_for_metadata(task)
    da_tasks = Task.where(actable_type: 'DiscreteAttributeTask', parent_id: task.id)
    Sample.find_by(task_id: da_tasks.map(&:id), is_tag: true)
  end
end
