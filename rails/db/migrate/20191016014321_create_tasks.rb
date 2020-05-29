class CreateTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :tasks, options: 'ENGINE=INNODB' do |t|
      t.string :type
      t.timestamp :pending_timestamp
      t.belongs_to :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
