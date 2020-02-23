class CreateLocatorTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :locator_tasks do |t|
      t.string :category
      t.timestamps
    end
  end
end
