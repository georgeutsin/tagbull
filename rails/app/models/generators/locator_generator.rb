# frozen_string_literal: true

# Locator generator utility.
class LocatorGenerator
  def self.generate_tag(task)
    samples = LocatorSample.where(task_id: task.id).order(created_at: :DESC)
    delta = 0.03
    comparison_func = ->(s1, s2, d) { compare_points_lists(s1, s2, d) }
    sample_pair = ComparisonUtils.sample_pair_exists(samples, comparison_func, delta)

    return BasicTaskEvent.create(task_id: task.id, event: 'dissimilar') unless sample_pair

    complete(task, sample_pair)
  end

  def self.complete(task, sample_pair)
    tag = generate_points(task, sample_pair)
    BasicTaskEvent.create(task_id: task.id, event: 'similar')

    return if task.parent_id.nil?

    parent_task = Task.find(task.parent_id).specific
    parent_task.locator_completed(tag)
  end

  def self.compare_points_lists(sample1, sample2, _threshold)
    # TODO: add complexity to points list comparison
    JSON.parse(sample1.points).length == JSON.parse(sample2.points).length
  end

  def self.generate_points(task, samples)
    points = merge_points_lists(samples)
    LocatorSample.create!({
      points: points.to_json
    }.merge(TagGenerator.generated_sample_params(task)))
  end

  def self.merge_points_lists(samples)
    points1 = JSON.parse(samples[0].points)
    points1 = sort_by_x_then_y(points1)

    points2 = JSON.parse(samples[1].points)
    points2 = sort_by_x_then_y(points2)

    average_points_lists(points1, points2)
  end

  def self.sort_by_x_then_y(points)
    points.sort_by { |e| [e['x'], e['y']] }
  end

  def self.average_points_lists(points1, points2)
    [points1, points2].transpose.map do |e|
      point1 = e[0]
      point2 = e[1]
      {
        x: AttrUtils.average_hash('x', point1, point2),
        y: AttrUtils.average_hash('y', point1, point2)
      }
    end
  end
end
