class ProjectNameNotNull < ActiveRecord::Migration[6.0]
  def change
    change_column_null :projects, :name, false
  end
end
