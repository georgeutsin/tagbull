# frozen_string_literal: true

# Discrete Attribute generator utility.
class DiscreteAttributeGenerator
  def self.matching_samples(task)
    samples = DiscreteAttributeSample.where(task_id: task.id).order(created_at: :DESC)
    return false if samples.count < 2

    comparison_func = ->(s1, s2, _d) { compare_options(s1, s2) }
    # TODO: decide if pair is best approach for discrete attributes
    ComparisonUtils.sample_pair_exists(samples, comparison_func, 0)
  end

  def self.generate_tag(task, samples)
    tag = generate_discrete_attribute(task, samples.first.option)

    return if task.parent_id.nil?

    parent_task = Task.find(task.parent_id).specific
    parent_task.discrete_attribute_completed(tag)
  end

  def self.compare_options(sample1, sample2)
    sample1.option == sample2.option
  end

  def self.generate_discrete_attribute(task, option)
    DiscreteAttributeSample.create!({
      option: option
    }.merge(TagGenerator.generated_sample_params(task)))
  end
end
