class AddUserIdToImages < ActiveRecord::Migration[6.0]
  def change
    add_column :media, :user_id, :bigint
  end
end
