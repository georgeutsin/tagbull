class CreateBoundingBoxesTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :bounding_boxes_tasks, options: 'ENGINE=INNODB' do |t|
      t.string :category
      t.timestamps
    end
  end
end
