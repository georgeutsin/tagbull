class AddPointToBoundingBoxTask < ActiveRecord::Migration[6.0]
  def change
    add_column :bounding_box_tasks, :x, :float
    add_column :bounding_box_tasks, :y, :float
  end
end
