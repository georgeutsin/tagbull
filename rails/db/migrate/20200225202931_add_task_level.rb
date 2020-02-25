class AddTaskLevel < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :level, :int, default: 1
  end
end
