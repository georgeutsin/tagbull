class TooManyLocatorPoints < ActiveRecord::Migration[6.0]
  def change
    add_column :locator_samples, :too_many, :boolean, default: false
  end
end
