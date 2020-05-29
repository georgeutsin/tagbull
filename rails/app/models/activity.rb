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
      task = Activity.next_task(actor.id, opts[:project_id])
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
        },
        max_box: {
          max_x: bb.max_x,
          max_y: bb.max_y,
          min_x: bb.min_x,
          min_y: bb.min_y
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

  def self.next_task(actor_id, project_id = nil)
    result = Task.joins(:project)
                 .select('tasks.*, (SELECT COUNT(1) FROM samples WHERE samples.task_id = tasks.id) as sample_counts')
    result = if project_id
               result.where(project_id: project_id)
             else
               result.where('projects.is_private is ? or projects.is_private is ?', false, nil)
             end

    result.where(tasks_filter, actor_id)
          .order(tasks_ordering)
          .first
  end

  def self.tasks_filter
    <<-SQL
      projects.paused = FALSE AND
      (tasks.actable_type = 'BoundingBoxTask'
        OR tasks.actable_type = 'LocatorTask'
        OR tasks.actable_type = 'DiscreteAttributeTask')
      AND NOT EXISTS(SELECT 1 FROM samples WHERE samples.is_tag = TRUE AND samples.task_id = tasks.id)
      AND (tasks.pending_timestamp IS NULL OR NOW() > tasks.pending_timestamp + INTERVAL 1 MINUTE )
      AND NOT EXISTS(SELECT 1 FROM samples WHERE samples.actor_id = ? AND samples.task_id = tasks.id)
    SQL
  end

  def self.tasks_ordering
    <<-SQL
      tasks.level DESC,
      sample_counts DESC,
      tasks.created_at ASC
    SQL
  end
end
