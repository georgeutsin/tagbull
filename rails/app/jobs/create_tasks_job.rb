# frozen_string_literal: true

# Job to create new tasks on project creation
class CreateTasksJob < ApplicationJob
  queue_as :default

  def perform(project, task_config, media)
    TaskCreator.create(project, task_config, media)
  end
end
