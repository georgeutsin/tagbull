class AddPrivateFlagToProjects < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :is_private, :bool
  end
end
