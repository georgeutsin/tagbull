# frozen_string_literal: true

# A task represents a unit of work. Recursively defined.
class Task < ApplicationRecord
  actable

  belongs_to :project
  has_many :sample
  has_one :medium

  def state
    tc = Sample.where(task_id: id, is_tag: true).count
    return 'complete' if tc > 0

    c = Sample.where(task_id: id).count
    return 'start' if c === 0
    'sampling'
  end
end
