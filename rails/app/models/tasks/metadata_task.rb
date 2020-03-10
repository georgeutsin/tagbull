# frozen_string_literal: true

# Top-level task for identifying metadata given a bounding box
class MetadataTask < ApplicationRecord
  acts_as :task
  after_create :initialize_task

  def initialize_task
    create_label_name_task
  end

  def discrete_attribute_completed(discrete_tag)
    task = Task.find(discrete_tag.task_id)
    if task.specific.attribute_type == 'LabelName'
      return create_metadata_tag if discrete_tag.specific.option == 'neither'

      create_aux_discrete_attribute_tasks(discrete_tag)
      return
    end

    return unless all_discrete_attribute_tasks_complete

    create_metadata_tag
  end

  def all_discrete_attribute_tasks_complete
    d_a_tasks = Task.where(parent_id: acting_as.id, actable_type: 'DiscreteAttributeTask')
    tasks_complete = true
    d_a_tasks.each do |d_a_task|
      tasks_complete &&= d_a_task.state == 'complete'
    end

    tasks_complete
  end

  def create_aux_discrete_attribute_tasks(discrete_tag)
    create_occluded_task(discrete_tag)
    create_truncated_task(discrete_tag)
    create_depiction_task(discrete_tag)
    # TODO: temporarily removing is_inside for the donuts/bagels dataset
    # create_inside_task(discrete_tag)
  end

  def base_arguments
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

  def create_label_name_task
    DiscreteAttributeTask.create!(
      base_arguments.merge(
        category: parent_category,
        options: [first, second, 'neither'],
        attribute_type: 'LabelName',
        level: level + 1
      )
    )
  end

  def create_occluded_task(discrete_tag)
    DiscreteAttributeTask.create!(
      base_arguments.merge(
        category: discrete_tag.specific.option,
        options: %w[yes no],
        attribute_type: 'IsOccluded',
        level: level + 2
      )
    )
  end

  def create_truncated_task(discrete_tag)
    base_args = base_arguments
    task = DiscreteAttributeTask.create!(
      base_args.merge(
        category: discrete_tag.specific.option,
        options: %w[yes no],
        attribute_type: 'IsTruncated',
        level: level + 2
      )
    )
    # If the provided bounding box is nowhere near the edge, we can skip this step and generate our own "samples" for it.
    if base_args[:min_x] > 0.05 && base_args[:max_x] < 0.95 && base_args[:min_y] > 0.05 && base_args[:max_y] < 0.95
      parent_task = task.acting_as
      DiscreteAttributeGenerator.generate_discrete_attribute(parent_task, "no")
      BasicTaskEvent.create!(task_id: parent_task.id, event: 'sample')
      DiscreteAttributeGenerator.generate_discrete_attribute(parent_task, "no")
      BasicTaskEvent.create!(task_id: parent_task.id, event: 'sample')
      DiscreteAttributeGenerator.generate_tag(parent_task)
    end
  end

  def create_depiction_task(discrete_tag)
    DiscreteAttributeTask.create!(
      base_arguments.merge(
        category: discrete_tag.specific.option,
        options: %w[yes no],
        attribute_type: 'IsDepiction',
        level: level + 2
      )
    )
  end

  def create_inside_task(discrete_tag)
    DiscreteAttributeTask.create!(
      base_arguments.merge(
        category: discrete_tag.specific.option,
        options: %w[yes no],
        attribute_type: 'IsInside',
        level: level + 2
      )
    )
  end

  def create_metadata_tag
    tag = Sample.create!(
      task_id: acting_as.id,
      is_tag: true,
      actor_id: 0,
      actable_type: 'MetadataTask',
      actable_id: id
    )
    return if parent_id.nil?

    parent_task = Task.find(parent_id).specific
    parent_task.metadata_completed(tag)
  end
end
