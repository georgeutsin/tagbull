class CreateMetadataTasks < ActiveRecord::Migration[6.0]
  def change
    create_table :metadata_tasks, options: 'ENGINE=INNODB' do |t|
      t.string :parent_category
      t.string :second
      t.string :first
      t.bigint :bounding_box_tag_id
    end
  end
end
