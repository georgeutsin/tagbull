class CreateDichotomyTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :dichotomy_tasks do |t|
      t.string :first, null: false
      t.string :second, null: false
      t.timestamps
    end
  end
end
