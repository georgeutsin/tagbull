class CreateSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :samples, options: 'ENGINE=INNODB' do |t|
      t.string :type
      t.belongs_to :task, null: false, foreign_key: true
      t.boolean :is_tag, default: false
      t.boolean :is_active, default: true
      t.belongs_to :actor, null: false, foreign_key: true

      t.timestamps
    end
  end
end
