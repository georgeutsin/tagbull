class CreateDiscreteAttributeSamples < ActiveRecord::Migration[6.0]
  def change
    create_table :discrete_attribute_samples, options: 'ENGINE=INNODB' do |t|
      t.string :option
      t.timestamps
    end
  end
end
