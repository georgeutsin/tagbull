class AddProjectPausedAttribute < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :paused, :boolean, default: true
  end
end
