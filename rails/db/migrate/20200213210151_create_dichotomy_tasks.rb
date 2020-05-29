class CreateDichotomyTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :dichotomy_tasks, options: 'ENGINE=INNODB' do |t|
      t.string :first, null: false
      t.string :second, null: false
      t.string :parent_category, null: false
      t.timestamps
    end
  end
end
