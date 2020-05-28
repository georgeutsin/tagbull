class CreateDiscreteAttributeTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :discrete_attribute_tasks, options: 'ENGINE=INNODB' do |t|
      t.string :attribute_type
      t.string :category
      t.string :options, array: true
      t.float :min_x
      t.float :max_x
      t.float :min_y
      t.float :max_y
      t.timestamps
    end
  end
end
