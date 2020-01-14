class CreateBasicTaskEvents < ActiveRecord::Migration[6.0]
  def change
    create_table :basic_task_events do |t|
      t.belongs_to :task, null: false, foreign_key: true
      t.text :event

      t.timestamps
    end
  end
end
