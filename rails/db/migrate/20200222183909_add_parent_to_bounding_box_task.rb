class AddParentToBoundingBoxTask < ActiveRecord::Migration[6.0]
  def change
    add_column :tasks, :parent_id, :bigint
  end
end
