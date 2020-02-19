class CreateDichotomy < ActiveRecord::Migration[6.0]
  def change
    create_table :dichotomies do |t|
      t.string :first
      t.string :second
    end
  end
end
