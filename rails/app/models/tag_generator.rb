# frozen_string_literal: true

# Generates a tag.
class TagGenerator
  def self.generate(task)
    generator = nil
    case task.specific
    when BoundingBoxTask
      generator = BoundingBoxGenerator
    when LocatorTask
      generator = LocatorGenerator
    when DiscreteAttributeTask
      generator = DiscreteAttributeGenerator
    end

    samples = generator&.matching_samples(task)
    return BasicTaskEvent.create(task_id: task.id, event: 'dissimilar') unless samples
    generator&.generate_tag(task, samples)
    BasicTaskEvent.create(task_id: task.id, event: 'similar')
  end

  def self.generated_sample_params(task)
    {
      task_id: task.id,
      actor_id: 0, # 0 is the id of the 'GENERATED' actor
      is_tag: true,
      is_active: true
    }
  end
end
