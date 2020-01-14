# frozen_string_literal: true

# BasicTaskEvent is the model for the event, ie any action taken on a task that is modelled as a "basic task"
class BasicTaskEvent < ApplicationRecord
  belongs_to :task
end
