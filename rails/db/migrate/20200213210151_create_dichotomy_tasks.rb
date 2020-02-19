class CreateDichotomyTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :dichotomy_tasks do |t|
      t.timestamps
    end
    add_reference :dichotomy_tasks, :dichotomy, index:true
    add_foreign_key :dichotomy_tasks, :dichotomies
  end
end
