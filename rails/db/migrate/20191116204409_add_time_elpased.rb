class AddTimeElpased < ActiveRecord::Migration[6.0]
  def change
    change_table :samples, options: 'ENGINE=INNODB' do |t|
      t.integer :time_elapsed
    end
  end
end
