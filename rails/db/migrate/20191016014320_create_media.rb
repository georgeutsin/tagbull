class CreateMedia < ActiveRecord::Migration[6.0]
  def change
    create_table :media, options: 'ENGINE=INNODB' do |t|
      t.text :name
      t.text :url

      t.timestamps
    end
  end
end
