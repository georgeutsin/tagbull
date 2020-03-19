# frozen_string_literal: true

# Comparison utilities.
class ComparisonUtils
  def self.sample_pair_exists(samples, comparison_func, threshold)
    samples.each_with_index do |sample1, i1|
      samples[i1 + 1..-1].each do |sample2|
        return [sample1, sample2] if comparison_func.call(sample1, sample2, threshold)
      end
    end

    false
  end
end
