class AddGenerateActor < ActiveRecord::Migration[6.0]
  def change
    Actor.create(id: 0, actor_sig: 'GENERATED', created_at: DateTime.now, updated_at: DateTime.now)
  end
end
