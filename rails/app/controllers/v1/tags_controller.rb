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
    task = Task.find(id: task_id).specific
    samples = Sample.where(task_id: task_id).map(&:specific)
    base_tag_params(task).merge(samples: samples)
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
    when 'BoundingBoxTask', 'LocatorTask'
      tag = tag_for_basic(task)
    when 'DiscreteAttributeTask'
      tag = tag_for_discrete_attribute(task)
    when 'DichotomyTask'
      tag = tag_for_dichotomy(task)
    when 'MetadataTask'
      tag = tag_for_metadata(task)
    else
      return json_error(message: 'unknown task type')
    end
    base_tag_params(task).merge(tag: tag)
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
    metadata_task = Task.where(actable_type: 'MetadataTask', parent_id: task.id).first
    { metadata: tag_for_metadata(metadata_task) }
  end

  def tag_for_metadata(task)
    da_tasks = Task.where(actable_type: 'DiscreteAttributeTask', parent_id: task.id)
    da_tasks.map { |da_task| tag_for_discrete_attribute(da_task) }
  end

  def tag_for_discrete_attribute(task)
    d = task.specific
    s = Sample.find_by(task_id: task.id, is_tag: true).specific
    {
      bounding_box: { min_x: d.min_x, min_y: d.min_y, max_x: d.max_x, max_y: d.max_y },
      category: d.category,
      attribute_type: d.attribute_type,
      option: s.option
    }
  end
end
