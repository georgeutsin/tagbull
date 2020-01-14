class CreateBoundingBoxSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :bounding_box_samples do |t|
      t.float :min_x
      t.float :max_x
      t.float :min_y
      t.float :max_y

      t.timestamps
    end

    remove_column :samples, :type

    change_table :samples do |t|
      t.actable
    end
  end
end
