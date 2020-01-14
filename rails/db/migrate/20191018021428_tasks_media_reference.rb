class TasksMediaReference < ActiveRecord::Migration[6.0]
  def change
    add_reference :tasks, :media, index: true
  end
end
