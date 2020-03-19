class AddMaxBoxFieldToBoundingBoxTasks < ActiveRecord::Migration[6.0]
  def change
    add_column :bounding_box_tasks, :min_x, :float, default: 0
    add_column :bounding_box_tasks, :max_x, :float, default: 1
    add_column :bounding_box_tasks, :min_y, :float, default: 0
    add_column :bounding_box_tasks, :max_y, :float, default: 1
  end
end
