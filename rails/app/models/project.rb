# frozen_string_literal: true

# Project is a collection of work a dataset owner needs done. It has media, tasks and labels.
class Project < ApplicationRecord
  attribute :num_tasks
  attribute :completed_tasks

  def num_tasks
    Task.where(project_id: id).count
  end

  def completed_tasks
    Task.left_joins(:sample).where('project_id = ? AND samples.is_tag', id).count
  end
end
