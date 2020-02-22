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

ActiveRecord::Schema.define(version: 2020_02_22_180400) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "actors", force: :cascade do |t|
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "actor_sig"
  end

  create_table "basic_task_events", force: :cascade do |t|
    t.bigint "task_id", null: false
    t.text "event"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["task_id"], name: "index_basic_task_events_on_task_id"
  end

  create_table "bounding_box_samples", force: :cascade do |t|
    t.float "min_x"
    t.float "max_x"
    t.float "min_y"
    t.float "max_y"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "bounding_box_tasks", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "dichotomy_tasks", force: :cascade do |t|
    t.string "first", null: false
    t.string "second", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "locator_tasks", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "media", force: :cascade do |t|
    t.text "name"
    t.text "url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "projects", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "samples", force: :cascade do |t|
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

  create_table "tasks", force: :cascade do |t|
    t.datetime "pending_timestamp"
    t.bigint "project_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "actable_type"
    t.bigint "actable_id"
    t.bigint "media_id"
    t.index ["actable_type", "actable_id"], name: "index_tasks_on_actable_type_and_actable_id"
    t.index ["media_id"], name: "index_tasks_on_media_id"
    t.index ["project_id"], name: "index_tasks_on_project_id"
  end

  add_foreign_key "basic_task_events", "tasks"
  add_foreign_key "samples", "actors"
  add_foreign_key "samples", "tasks"
  add_foreign_key "tasks", "projects"
end
