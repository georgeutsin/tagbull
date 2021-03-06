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

  def initialize_task
    create_locator_task
  end

  def locator_completed(locator_tag)
    return if locator_tag.points.length >= 5
    return create_dichotomy_tag if locator_tag.points.empty?

    create_bounding_box_tasks(locator_tag.points)
  end

  def bounding_box_completed(bounding_box_tag)
    create_metadata_task(bounding_box_tag)
  end

  def metadata_completed(_metadata_tag)
    return unless all_subtasks_finished

    create_dichotomy_tag
  end

  def create_locator_task
    LocatorTask.create!(
      parent_id: acting_as.id,
      project_id: project_id,
      media_id: media_id,
      category: first.pluralize + ' and ' + second.pluralize
    )
  end

  # the max box is used to eliminate any
  # submitted bounding boxes that cover all locator points
  def self.compute_max_box(points)
    return { max_x: 1.0, min_x: 0.0, max_y: 1.0, min_y: 0.0 } if points.size <= 1

    min_x = points.min_by { |point| point[:x].to_f }
    min_y = points.min_by { |point| point[:y].to_f }
    max_x = points.max_by { |point| point[:x].to_f }
    max_y = points.max_by { |point| point[:y].to_f }
    { max_x: max_x, min_x: min_x, max_y: max_y, min_y: min_y }
  end

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/MethodLength
  def create_bounding_box_tasks(points)
    max_box = DichotomyTask.compute_max_box(points)
    points.each do |point|
      BoundingBoxTask.create!(
        parent_id: acting_as.id,
        project_id: project_id,
        media_id: media_id,
        category: parent_category,
        x: point[:x].to_f,
        y: point[:y].to_f,
        max_x: max_box[:max_x],
        min_x: max_box[:min_x],
        max_y: max_box[:max_y],
        min_y: max_box[:min_y],
        level: level + 1
      )
    end
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength

  def create_metadata_task(bounding_box_tag)
    MetadataTask.create!(
      parent_id: acting_as.id,
      project_id: project_id,
      media_id: media_id,
      parent_category: parent_category,
      first: first,
      second: second,
      bounding_box_tag_id: bounding_box_tag.acting_as.id,
      level: level + 2
    )
  end

  def create_dichotomy_tag
    tag = Sample.create!(
      task_id: acting_as.id,
      is_tag: true,
      actor_id: 0,
      actable_type: 'DichotomyTask',
      actable_id: id
    )
    return if parent_id.nil?

    parent_task = Task.find(parent_id).specific
    parent_task.dichotomy_completed(tag)
  end

  def all_subtasks_finished
    locator_task = Task.where(parent_id: acting_as.id, actable_type: 'LocatorTask').first
    locator_tag = LocatorSample.where(task_id: locator_task.id, is_tag: true).first
    return false unless locator_tag

    bounding_box_and_metadata_finished(locator_tag.points.length)
  end

  def bounding_box_and_metadata_finished(target_count)
    bounding_box_tasks = Task.where(parent_id: acting_as.id, actable_type: 'BoundingBoxTask')
    bounding_box_tags = BoundingBoxSample.where(task_id: bounding_box_tasks.map(&:id), is_tag: true)
    metadata_tasks = Task.where(parent_id: acting_as.id, actable_type: 'MetadataTask')
    metadata_tags = Sample.where(task_id: metadata_tasks.map(&:id), is_tag: true, actable_type: 'MetadataTask')

    bounding_box_tags.length == target_count && metadata_tags.length == target_count
  end
end
