# frozen_string_literal: true

# Job to advance the state machine of the task by either resetting it or
class GenerateTagJob < ApplicationJob
  queue_as :default

  def perform(task)
    TagGenerator.generate(task)
  end
end
