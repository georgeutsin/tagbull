# frozen_string_literal: true

# Samples controller
class V1::SamplesController < ApplicationController
  include Pagination
  def create
    return json_error(message: 'incorrect actor sig') if params[:actor_sig] == 'GENERATED'

    task = Task.find(params[:task_id])

    return json_error(message: 'incorrect task id') unless task

    handle_specific_sample(task)
    handle_general_sample(task)

    json_response({})
  end

  # GET /projects/{id}/samples
  def index
    timestamp = pagination_timestamp
    samples = samples_for(params[:project_id], timestamp)
    paged_json_response(samples, timestamp)
  end

  def items_per_page
    50
  end

  private

  def base_sample_params(task_id)
    {
      task_id: task_id,
      actor_id: Actor.find_or_create_by(actor_sig: params[:actor_sig]).id,
      is_tag: false,
      is_active: true,
      time_elapsed: params[:time_elapsed]
    }
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def handle_specific_sample(task)
    case task.specific
    when BoundingBoxTask
      BoundingBoxSample.create!(bounding_box_sample_from_params(task.id))
      BasicTaskEvent.create(task_id: task.id, event: 'sample')
    when LocatorTask
      LocatorSample.create!(locator_sample_from_params(task.id))
      BasicTaskEvent.create(task_id: task.id, event: 'sample')
    when DiscreteAttributeTask
      DiscreteAttributeSample.create!(discrete_attr_sample_from_params(task.id))
      BasicTaskEvent.create(task_id: task.id, event: 'sample')
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def handle_general_sample(task)
    task.update(pending_timestamp: nil)

    maybe_generate_tag(task)
  end

  def bounding_box_sample_from_params(task_id)
    base_sample_params(task_id).merge(bounding_box_params_data_to_hash)
  end

  def locator_sample_from_params(task_id)
    base_sample_params(task_id).merge(locator_params_data_to_hash)
  end

  def discrete_attr_sample_from_params(task_id)
    base_sample_params(task_id).merge(discrete_attr_params_data_to_hash)
  end

  def bounding_box_params_data_to_hash
    data = params[:data]
    {
      min_x: data[:min_x],
      min_y: data[:min_y],
      max_x: data[:max_x],
      max_y: data[:max_y]
    }
  end

  def locator_params_data_to_hash
    data = params[:data]
    {
      points: data[:points]
    }
  end

  def discrete_attr_params_data_to_hash
    data = params[:data]
    {
      option: data[:option]
    }
  end

  def maybe_generate_tag(task)
    return unless task.state == 'comparing'

    GenerateTagJob.perform_later(task)
  end

  def samples_for(project_id, timestamp)
    Sample.joins(:task)
          .where('tasks.project_id = ?', project_id)
          .order('samples.created_at DESC')
          .where(Sample.arel_table[:created_at].lt(timestamp))
          .offset(pagination_offset)
          .limit(pagination_limit)
          .map(&:additional_info)
  end
end
