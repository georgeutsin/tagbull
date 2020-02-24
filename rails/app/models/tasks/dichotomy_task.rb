# frozen_string_literal: true

# Top-level task for identifying which of two things an image contains
class DichotomyTask < ApplicationRecord
  acts_as :task

  after_create :initialize_task
  # STATE MACHINE DESCRIPTION
  # Dichotomy task
  # -> locator task (points)
  # for each (points)
  #   -> bounding box task (bounding_box)
  #   -> metadata task
  #     -> discrete attribute task/LabelName (category)
  #       -> discrete attribute task/isOccluded
  #       -> discrete attribute task/isTruncated
  #       -> discrete attribute task/isDepiction
  #       -> discrete attribute task/isInside

  def self.initialize_task
    create_locator_task
  end

  def self.locator_completed(locator_tag)
    points = JSON.parse(locator_tag.points)

    return if points.length >= 5

    create_bounding_box_tasks(points)
  end

  def self.bounding_box_completed(bounding_box_tag)
    create_metadata_task(bounding_box_tag)
  end

  def self.metadata_completed(_metadata_tag)
    return unless all_subtasks_finished

    create_dichotomy_tag
  end

  def self.create_locator_task
    LocatorTask.create!(
      parent_id: acting_as.id,
      project_id: project_id,
      media_id: media_id,
      category: parent_category
    )
  end

  def self.create_bounding_box_tasks(points)
    points.each do |point|
      BoundingBoxTask.create!(
        parent_id: acting_as.id,
        project_id: project_id,
        media_id: media_id,
        category: parent_category,
        x: point['x'],
        y: point['y']
      )
    end
  end

  def self.create_metadata_task(bounding_box_tag)
    MetadataTask.create!(
      parent_id: acting_as.id,
      project_id: project_id,
      media_id: media_id,
      parent_category: parent_category,
      first: first,
      second: second,
      bounding_box_tag_id: bounding_box_tag.acting_as.id
    )
  end

  def self.create_dichotomy_tag
    tag = Sample.create!(
      task_id: acting_as.id,
      is_tag: true,
      actor_id: 0,
      actable_type: 'DichotomyTask',
      actable_id: id
    )
    return if parent_id.null?

    parent_task = Task.find(parent_id).specific
    parent_task.dichotomy_completed(tag)
  end

  def self.all_subtasks_finished
    locator_tag = LocatorSample.find(parent_id: acting_as.id)
    return false unless locator_tag

    points = JSON.parse(locator_tag.points)
    bounding_box_and_metadata_finished(points.length)
  end

  def self.bounding_box_and_metadata_finished(target_count)
    bounding_box_tags = BoundingBoxSample.where(parent_id: acting_as.id, is_tag: true)
    metadata_tags = Sample.where(parent_id: acting_as.id, actable_type: 'MetadataTask', is_tag: true)

    bounding_box_tags.length == target_count && metadata_tags.length == target_count
  end
end
