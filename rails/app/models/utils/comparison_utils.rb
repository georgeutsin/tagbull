# frozen_string_literal: true

# Comparison utilities.
class ComparisonUtils
  def self.sample_pair_exists(samples, comparison_func, threshold)
    samples.each_with_index do |sample1, i1|
      res = elem_in_list?(sample1, samples[i1 + 1..-1], comparison_func, threshold)
      return res if res
    end

    false
  end

  def self.elem_in_list?(elem, elem_list, comparison_func, threshold)
    elem_list.each do |other_elem|
      return [elem, other_elem] if comparison_func.call(elem, other_elem, threshold)
    end

    false
  end

  # rubocop:disable Metrics/MethodLength
  def self.n_wise_match_exists(samples, min_n, comparison_func, threshold)
    matches_list = []
    samples.each_with_index do |sample1, i1|
      matches = [sample1]
      samples.each_with_index do |sample2, i2|
        next if i1 == i2

        matches << sample2 if comparison_func.call(sample1, sample2, threshold)
      end
      matches_list << matches if matches.length >= min_n
    end

    return false if matches_list.empty?

    matches_list.max_by(&:length)
  end
  # rubocop:enable Metrics/MethodLength
end
