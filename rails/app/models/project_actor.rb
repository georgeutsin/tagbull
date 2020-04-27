# frozen_string_literal: true

# Actor model
class ProjectActor < Actor
  attribute :project_id
  def base_query
    Sample.joins(:task).where(actor_id: id).where(tasks: { project_id: project_id })
  end

  def total_samples
    base_query.count
  end

  def correct_samples
    base_query.where(is_active: true).count
  end
end
