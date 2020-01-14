# frozen_string_literal: true

# A task represents a unit of work. Recursively defined.
class Task < ApplicationRecord
  actable

  belongs_to :project
  has_many :sample
  has_one :medium

  def state
    binds = [ActiveRecord::Relation::QueryAttribute.new(
      'id', id, ActiveRecord::Type::Integer.new
    )]
    query = 'SELECT state FROM basic_task_states WHERE id = $1'
    records = ActiveRecord::Base.connection.exec_query(query, 'state_query', binds)

    return unless records.present?

    return unless records.first

    records.first['state']
  end
end
