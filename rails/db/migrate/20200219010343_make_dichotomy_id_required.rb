class MakeDichotomyIdRequired < ActiveRecord::Migration[6.0]
  def change
    change_column_null :dichotomy_tasks, :dichotomy_id, false
  end
end
