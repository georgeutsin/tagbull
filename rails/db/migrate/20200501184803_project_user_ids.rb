class ProjectUserIds < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :user_id, :bigint, foreign_key: true
  end
end
