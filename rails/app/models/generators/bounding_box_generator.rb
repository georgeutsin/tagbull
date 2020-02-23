# frozen_string_literal: true

# Bounding box generator utility.
class BoundingBoxGenerator
  def self.generate_tag(task)
    samples = BoundingBoxSample.where(task_id: task.id).order(created_at: :DESC)
    boxes = bounding_box_pair_exists(samples)
    if boxes
      generate_bounding_box(task, boxes)
      BasicTaskEvent.create(task_id: task.id, event: 'similar')
      return
    end

    BasicTaskEvent.create(task_id: task.id, event: 'dissimilar')
  end

  def self.bounding_box_pair_exists(samples)
    threshold = 0.03 * (samples.count - 1)
    samples.each_with_index do |box1, i1|
      samples[i1 + 1..-1].each do |box2|
        return [box1, box2] if compare_bounding_boxes(box1, box2, threshold)
      end
    end

    false
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
