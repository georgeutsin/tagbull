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
      task = next_task(actor.id)
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

  def configure_task_specific_data(task)
    case task.specific
    when BoundingBoxTask
      bb = task.specific

      self.config = {
        media_url: Medium.find(task.media_id).url,
        category: bb.category
      }
    when LocatorTask
      locator = task.specific

      self.config = {
        media_url: Medium.find(task.media_id).url,
        category: locator.category
      }
    end
  end

  def next_task(actor_id)
    Task.joins('INNER JOIN basic_task_states ON basic_task_states.id = tasks.id', :project)
        .where(tasks_filter, actor_id)
        .order(tasks_ordering)
        .first
  end

  def tasks_filter
    <<-SQL
      (basic_task_states.state = 'start' OR basic_task_states.state = 'sampling')
      AND (tasks.pending_timestamp IS NULL OR NOW() > tasks.pending_timestamp + (1 * INTERVAL '1 minute') )
      AND NOT EXISTS(SELECT 1 FROM samples WHERE samples.actor_id = ? AND samples.task_id = tasks.id)
    SQL
  end

  def tasks_ordering
    <<-SQL
      CASE
        WHEN basic_task_states.state = 'start' THEN 0
        WHEN basic_task_states.state = 'sampling' THEN 1
        ELSE -1
      END DESC, tasks.created_at ASC
    SQL
  end
end
