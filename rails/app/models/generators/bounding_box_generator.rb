# frozen_string_literal: true

# Bounding box generator utility.
class BoundingBoxGenerator
  def self.generate_tag(task)
    samples = BoundingBoxSample.where(task_id: task.id).order(created_at: :DESC)
    delta = 0.03
    comparison_func = ->(s1, s2, d) { compare_bounding_boxes(s1, s2, d) }
    boxes = ComparisonUtils.sample_pair_exists(samples, comparison_func, delta)
    if boxes
      generate_bounding_box(task, boxes)
      BasicTaskEvent.create(task_id: task.id, event: 'similar')
      return
    end

    BasicTaskEvent.create(task_id: task.id, event: 'dissimilar')
  end

  def self.compare_bounding_boxes(box1, box2, threshold)
    AttrUtils.abs_diff_attr(:min_x, box1, box2) < threshold &&
      AttrUtils.abs_diff_attr(:min_y, box1, box2) < threshold &&
      AttrUtils.abs_diff_attr(:max_x, box1, box2) < threshold &&
      AttrUtils.abs_diff_attr(:max_y, box1, box2) < threshold
  end

  def self.generate_bounding_box(task, boxes)
    BoundingBoxSample.create!({
      min_x: AttrUtils.average_attr(:min_x, boxes[0], boxes[1]),
      min_y: AttrUtils.average_attr(:min_y, boxes[0], boxes[1]),
      max_x: AttrUtils.average_attr(:max_x, boxes[0], boxes[1]),
      max_y: AttrUtils.average_attr(:max_y, boxes[0], boxes[1])
    }.merge(TagGenerator.generated_sample_params(task)))
  end
end
