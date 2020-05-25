# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_05_12_230545) do

  create_table "actors", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "actor_sig"
  end

  create_table "basic_task_events", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.bigint "task_id", null: false
    t.text "event"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["task_id"], name: "index_basic_task_events_on_task_id"
  end

  create_table "bounding_box_samples", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.float "min_x"
    t.float "max_x"
    t.float "min_y"
    t.float "max_y"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "bounding_box_tasks", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.float "x"
    t.float "y"
    t.float "min_x", default: 0.0
    t.float "max_x", default: 1.0
    t.float "min_y", default: 0.0
    t.float "max_y", default: 1.0
  end

  create_table "dichotomy_tasks", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.string "first", null: false
    t.string "second", null: false
    t.string "parent_category", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "discrete_attribute_samples", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.string "option"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "discrete_attribute_tasks", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.string "attribute_type"
    t.string "category"
    t.string "options"
    t.float "min_x"
    t.float "max_x"
    t.float "min_y"
    t.float "max_y"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "locator_samples", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.text "points", size: :long, collation: "utf8mb4_bin"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "too_many", default: false
  end

  create_table "locator_tasks", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "media", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.text "name"
    t.text "url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "user_id"
  end

  create_table "metadata_tasks", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.string "parent_category"
    t.string "second"
    t.string "first"
    t.bigint "bounding_box_tag_id"
  end

  create_table "projects", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "paused", default: true
    t.boolean "is_private"
    t.bigint "user_id"
  end

  create_table "samples", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.bigint "task_id", null: false
    t.boolean "is_tag", default: false
    t.boolean "is_active", default: true
    t.bigint "actor_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "actable_type"
    t.bigint "actable_id"
    t.integer "time_elapsed"
    t.index ["actable_type", "actable_id"], name: "index_samples_on_actable_type_and_actable_id"
    t.index ["actor_id"], name: "index_samples_on_actor_id"
    t.index ["task_id"], name: "index_samples_on_task_id"
  end

  create_table "tasks", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.timestamp "pending_timestamp"
    t.bigint "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "actable_type"
    t.bigint "actable_id"
    t.bigint "media_id"
    t.bigint "parent_id"
    t.integer "level", default: 1
    t.index ["actable_type", "actable_id"], name: "index_tasks_on_actable_type_and_actable_id"
    t.index ["media_id"], name: "index_tasks_on_media_id"
    t.index ["project_id"], name: "index_tasks_on_project_id"
  end

  create_table "users", options: "ENGINE=MyISAM DEFAULT CHARSET=latin1", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
