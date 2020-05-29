class CreateBoundingBoxTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :bounding_box_tasks, options: 'ENGINE=INNODB' do |t|
      t.string :category

      t.timestamps
    end

    remove_column :tasks, :type

    change_table :tasks do |t|
      t.actable
    end
  end
end
