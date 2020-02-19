class AddMediaTasksReference < ActiveRecord::Migration[6.0]
  def change
    add_reference :media, :task, foreign_key: true, null: false
  end
end
