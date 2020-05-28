class CreateActors < ActiveRecord::Migration[6.0]
  def change
    create_table :actors, options: 'ENGINE=INNODB' do |t|

      t.timestamps
    end
  end
end
