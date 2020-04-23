# frozen_string_literal: true

class Actor < ApplicationRecord
  has_many :sample
  attribute :num_samples
  attribute :correct_samples

  def num_samples
    Sample.where(actor_id: id).count
  end

  def correct_samples
    Sample.where(actor_id: id, is_active: true).count
  end

  def stats(project_id = nil)
    samples_for_project = Sample.joins(:task).where(actor_id: id)
    correct_samples_for_project = samples_for_project.where(is_active: true)

    if project_id != nil
      samples_for_project = samples_for_project.where(tasks: {project_id: project_id})
      correct_samples_for_project = correct_samples_for_project.where(tasks: {project_id: project_id})
    end
    {
      num_samples_for_project: samples_for_project.count,
      correct_samples_for_project: correct_samples_for_project.count
    }
  end
end
