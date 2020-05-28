# frozen_string_literal: true

# Locator generator utility.
class LocatorGenerator
  def self.matching_samples(task)
    samples = LocatorSample.where(task_id: task.id).order(created_at: :DESC)
    return false if samples.count < 2

    threshold = 0.03 * (samples.count - 1)
    comparison_func = ->(s1, s2, t) { compare_points_lists(s1, s2, t) }
    ComparisonUtils.sample_pair_exists(samples, comparison_func, threshold)
  end

  def self.generate_tag(task, samples)
    threshold = 1 # pair guaranteed to be within threshold from previous step
    tag = generate_points(task, samples, threshold)

    return if task.parent_id.nil?

    parent_task = Task.find(task.parent_id).specific
    parent_task.locator_completed(tag)
  end

  def self.compare_points_lists(sample1, sample2, threshold)
    return sample1.points if sample1.too_many && sample2.too_many
    return sample1.points if sample1.points.length >= 5 && sample2.points.length >= 5
    return false unless sample1.points.length == sample2.points.length

    pairs = points_pairs(sample1, sample2, threshold)
    pairs.length == sample1.points.length
  end

  def self.points_pairs(sample1, sample2, threshold)
    dists = samples_to_distance_pairs(sample1, sample2, threshold)

    pairs = []
    dists.sort_by { |_k, v| v }.each do |k, _v|
      f = pairs.flatten
      pairs.push([k[:p1], k[:p2]]) if !f.include?(k[:p1]) && !f.include?(k[:p2])
    end
    pairs
  end

  def self.samples_to_distance_pairs(sample1, sample2, threshold)
    dists = {}
    sample1.points.each do |p1|
      sample2.points.each do |p2|
        d = distance(p1, p2)
        dists[{ p1: p1, p2: p2 }] = d if d < threshold
      end
    end
    dists
  end

  def self.distance(point1, point2)
    (point1['x'] - point2['x'])**2 + (point1['y'] - point2['y'])**2
  end

  def self.generate_points(task, samples, threshold)
    pairs = points_pairs(samples[0], samples[1], threshold)
    points = merge_points_lists(pairs)
    LocatorSample.create!({
      points: points
    }.merge(TagGenerator.generated_sample_params(task)))
  end

  def self.merge_points_lists(pairs)
    pairs.map do |pair|
      average_points(pair[0], pair[1])
    end
  end

  def self.average_points(point1, point2)
    {
      x: AttrUtils.average_hash('x', point1, point2),
      y: AttrUtils.average_hash('y', point1, point2)
    }
  end
end
