# frozen_string_literal: true

# Job to create new tasks on project creation
class CreateTasksJob < ApplicationJob
  queue_as :default

  def perform(project, task_config, media, user_id)
    TaskCreator.create(project, task_config, media, user_id)
  end
end
