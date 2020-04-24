# frozen_string_literal: true

require 'date'

# Tags controller
class V1::TagsController < ApplicationController
  include Pagination
  def index
    timestamp = pagination_timestamp
    tags = tags_for(params[:project_id], timestamp)
    paged_json_response(tags, timestamp)
  end

  def items_per_page
    10
  end

  def show
    samples = samples_for(params[:project_id], params[:id])
    json_response(samples)
  end

  private

  def tag_sort
    return Medium.arel_table[:name].asc if params[:sort] && params[:sort] == 'media_name'

    Task.arel_table[:created_at].asc
  end

  # rubocop:disable Metrics/AbcSize
  def tags_for(project_id, timestamp)
    Task.joins(:sample)
        .joins('INNER JOIN media ON media.id = tasks.media_id')
        .where(tags_filter, project_id)
        .order(tag_sort)
        .where(Sample.arel_table[:created_at].lt(timestamp))
        .offset(pagination_offset)
        .limit(pagination_limit)
        .map do |task|
      tag_for(task)
    end
  end
  # rubocop:enable Metrics/AbcSize

  def samples_for(project_id, task_id)
    task = Task.find(task_id)
    children = recursive_child_samples(task).flatten
    samples = Sample.joins(:task)
                    .where(tasks: { project_id: project_id, id: children })
                    .order('samples.created_at ASC')
                    .map(&:additional_info)
    base_tag_params(task).merge(samples: samples)
  end

  def recursive_child_samples(task)
    child_ids = Task.where(parent_id: task.id).map { |t| recursive_child_samples(t) }
    [task.id] + child_ids
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
    media = Medium.find(task.media_id)
    { type: type, task: task, media: media }
  end

  def tag_for_basic(task)
    Sample.find_by(task_id: task.id, is_tag: true).specific
  end

  def tag_for_dichotomy(task)
    metadata_tasks = Task.where(actable_type: 'MetadataTask', parent_id: task.id)
    { metadata: metadata_tasks.map { |t| tag_for_metadata(t) } }
  end

  def tag_for_metadata(task)
    da_tasks = Task.where(actable_type: 'DiscreteAttributeTask', parent_id: task.id)
    d = da_tasks.first.specific
    attributes = da_tasks.map { |t| lightweight_tag_for_discrete_attribute(t) }
    {
      bounding_box: { min_x: d.min_x, min_y: d.min_y, max_x: d.max_x, max_y: d.max_y },
      category: d.category,
      attributes: attributes
    }
  end

  def lightweight_tag_for_discrete_attribute(task)
    d = task.specific
    s = Sample.find_by(task_id: task.id, is_tag: true).specific
    {
      attribute_type: d.attribute_type,
      option: s.option
    }
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
