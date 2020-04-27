# frozen_string_literal: true

# Actor model
class Actor < ApplicationRecord
  has_many :sample
  attribute :total_samples
  attribute :correct_samples
  attribute :project_id

  def total_samples
    Sample.where(actor_id: id).count
  end

  def correct_samples
    Sample.where(actor_id: id, is_active: true).count
  end

  def stats(project_id = nil)
    return { project_total_samples: 0, project_correct_samples: 0 } if project_id.nil?

    query = Sample.joins(:task).where(actor_id: id).where(tasks: { project_id: project_id })
    {
      project_total_samples: query.count,
      project_correct_samples: query.where(is_active: true).count
    }
  end
end
