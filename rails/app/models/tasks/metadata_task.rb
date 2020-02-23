# frozen_string_literal: true

# Top-level task for identifying metadata given a bounding box
class MetadataTask < ApplicationRecord
  acts_as :task
  after_create :initalize_task

  def self.initalize_task
    create_label_name_task
  end

  def self.discrete_attribute_completed(discrete_tag)
    if discrete_tag.attribute_type == 'LabelName'
      create_aux_discrete_attribute_tasks(discrete_tag)
      return
    end

    return unless all_discrete_attribute_task_complete

    complete_metadata_tag
  end

  def self.all_discrete_attribute_task_complete
    d_a_tasks = Task.where(parent_id: id, actable_type: 'DiscreteAttribute')
    tasks_complete = true
    d_a_tasks.each do |d_a_task|
      tasks_complete ||= d_a_task.state == 'complete'
    end

    tasks_complete
  end

  def self.create_aux_discrete_attribute_tasks(discrete_tag)
    create_occluded_task(discrete_tag)
    create_truncated_task(discrete_tag)
    create_depiction_task(discrete_tag)
    create_inside_task(discrete_tag)
  end

  def self.base_arguments
    bounding_box_tag = Sample.find(bounding_box_tag_id).specific
    {
      parent_id: acting_as.id,
      project_id: project_id,
      media_id: media_id,
      min_x: bounding_box_tag.min_x,
      min_y: bounding_box_tag.min_y,
      max_x: bounding_box_tag.max_x,
      max_y: bounding_box_tag.max_y
    }
  end

  def self.create_label_name_task
    DiscreteAttributeTask.create!(
      base_arguments.merge({
                             category: parent_category,
                             options: [first, second, 'neither'],
                             attribute_type: 'LabelName'
                           })
    )
  end

  def self.create_occluded_task(discrete_tag)
    DiscreteAttributeTask.create!(
      base_arguments.merge({
                             category: discrete_tag.option,
                             options: %w[yes no],
                             attribute_type: 'IsOccluded'
                           })
    )
  end

  def self.create_truncated_task(discrete_tag)
    DiscreteAttributeTask.create!(
      base_arguments.merge({
                             category: discrete_tag.option,
                             options: %w[yes no],
                             attribute_type: 'IsTruncated'
                           })
    )
  end

  def self.create_depiction_task(discrete_tag)
    DiscreteAttributeTask.create!(
      base_arguments.merge({
                             category: discrete_tag.option,
                             options: %w[yes no],
                             attribute_type: 'IsDepiction'
                           })
    )
  end

  def self.create_inside_task(discrete_tag)
    DiscreteAttributeTask.create!(
      base_arguments.merge({
                             category: discrete_tag.option,
                             options: %w[yes no],
                             attribute_type: 'IsInside'
                           })
    )
  end

  def self.create_metadata_tag
    tag = Sample.create!(
      task_id: acting_as.id,
      is_tag: true,
      actor_id: 0,
      actable_type: 'MetadataTask',
      actable_id: id
    )
    return if parent_id.null?

    parent_task = Task.find(parent_id).specific
    parent_task.metadata_completed(tag)
  end
end
