# frozen_string_literal: true

require 'active_record/validations'

# Model for the activity
class Activity
  attr_accessor :task_id, :type, :config, :new_actor

  def initialize(opts = {})
    task = nil
    actor = Actor.find_or_initialize_by(actor_sig: opts[:actor_sig])
    self.new_actor = actor.new_record?

    ActiveRecord::Base.transaction do
      task = Activity.next_task(actor.id)
      return unless task

      task.update!(pending_timestamp: DateTime.now)
    end

    configure_activity(task)
  end

  def configure_activity(task)
    self.task_id = task.id
    self.type = task.actable_type
    configure_task_specific_data(task)
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def configure_task_specific_data(task)
    case task.specific
    when BoundingBoxTask
      bb = task.specific

      self.config = {
        media_url: Medium.find(task.media_id).url,
        category: bb.category,
        target_point: {
          x: bb.x,
          y: bb.y
        }
      }
    when LocatorTask
      locator = task.specific

      self.config = {
        media_url: Medium.find(task.media_id).url,
        category: locator.category
      }
    when DiscreteAttributeTask
      discrete_attr = task.specific

      self.config = {
        media_url: Medium.find(task.media_id).url,
        attribute_type: discrete_attr.attribute_type,
        category: discrete_attr.category,
        options: discrete_attr.options,
        bounding_box: {
          min_x: discrete_attr.min_x,
          max_x: discrete_attr.max_x,
          min_y: discrete_attr.min_y,
          max_y: discrete_attr.max_y
        }
      }
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def self.next_task(actor_id)
    Task.joins('INNER JOIN basic_task_states ON basic_task_states.id = tasks.id', :project)
        .where(tasks_filter, actor_id)
        .order(tasks_ordering)
        .first
  end

  def self.tasks_filter
    <<-SQL
      projects.paused = FALSE AND
      (tasks.actable_type = 'BoundingBoxTask'
        OR tasks.actable_type = 'LocatorTask'
        OR tasks.actable_type = 'DiscreteAttributeTask')
      AND (basic_task_states.state = 'start' OR basic_task_states.state = 'sampling')
      AND (tasks.pending_timestamp IS NULL OR NOW() > tasks.pending_timestamp + (1 * INTERVAL '1 minute') )
      AND NOT EXISTS(SELECT 1 FROM samples WHERE samples.actor_id = ? AND samples.task_id = tasks.id)
    SQL
  end

  def self.tasks_ordering
    <<-SQL
      tasks.level DESC,
      CASE
        WHEN basic_task_states.state = 'start' THEN 0
        WHEN basic_task_states.state = 'sampling' THEN 1
        ELSE -1
      END DESC, tasks.created_at ASC
    SQL
  end
end
