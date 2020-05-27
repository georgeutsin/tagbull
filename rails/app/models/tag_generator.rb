# frozen_string_literal: true

# Generates a tag.
class TagGenerator
  def self.generate(task)
    generator = generator_for(task)

    samples = generator&.matching_samples(task)
    return unless samples

    generator&.generate_tag(task, samples)
    activate(samples)
  end

  def self.generator_for(task)
    case task.specific
    when BoundingBoxTask
      BoundingBoxGenerator
    when LocatorTask
      LocatorGenerator
    when DiscreteAttributeTask
      DiscreteAttributeGenerator
    end
  end

  def self.generated_sample_params(task)
    {
      task_id: task.id,
      actor_id: 0, # 0 is the id of the 'GENERATED' actor
      is_tag: true,
      is_active: true
    }
  end

  def self.activate(samples)
    samples.each do |sample|
      sample.is_active = true
      sample.save
    end
  end
end
