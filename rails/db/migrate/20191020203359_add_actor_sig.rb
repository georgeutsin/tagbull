class AddActorSig < ActiveRecord::Migration[6.0]
  def change
    change_table :actors do |t|
      t.string :actor_sig
    end
  end
end
