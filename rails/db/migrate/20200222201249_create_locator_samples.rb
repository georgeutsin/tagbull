class CreateLocatorSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :locator_samples, options: 'ENGINE=INNODB' do |t|
      t.json :points
      t.timestamps
    end
  end
end
