# frozen_string_literal: true

# Discrete Attribute generator utility.
class DiscreteAttributeGenerator
  def self.generate_tag(task)
    samples = DiscreteAttributeSample.where(task_id: task.id).order(created_at: :DESC)

    comparison_func = ->(s1, s2, _d) { compare_options(s1, s2) }
    # TODO: decide if pair is best approach for discrete attributes
    sample_pair = ComparisonUtils.sample_pair_exists(samples, comparison_func, delta)
    if sample_pair
      generate_discrete_attribute(task, sample_pair)
      BasicTaskEvent.create(task_id: task.id, event: 'similar')
      return
    end

    BasicTaskEvent.create(task_id: task.id, event: 'dissimilar')
  end

  def self.compare_options(sample1, sample2)
    sample1.option == sample2.option
  end

  def self.generate_discrete_attribute(task, samples)
    option = samples.first.option
    DiscreteAttributeSample.create!({
      option: option
    }.merge(TagGenerator.generated_sample_params(task)))

    # TODO: insert next tasks here if task attribute_type is LabelName
  end
end
