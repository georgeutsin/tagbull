# frozen_string_literal: true

require 'test_helper'

class ComparisonUtilTest < ActiveSupport::TestCase
  test '2-wise match test' do
    samples = [{ a: 1 }, { a: 2 }, { a: 1 }]
    n = 2
    comparison_func = ->(s1, s2, _d) { s1[:a] == s2[:a] }
    threshold = 0

    res = ComparisonUtils.n_wise_match_exists(samples, n, comparison_func, threshold)
    assert res != false
    assert res == [{ a: 1 }, { a: 1 }]
  end

  test '2-wise mismatch test' do
    samples = [{ a: 1 }, { a: 2 }, { a: 3 }]
    n = 2
    comparison_func = ->(s1, s2, _d) { s1[:a] == s2[:a] }
    threshold = 0

    res = ComparisonUtils.n_wise_match_exists(samples, n, comparison_func, threshold)
    assert res == false
  end

  test '3-wise match test' do
    samples = [{ a: 1 }, { a: 2 }, { a: 1 }, { a: 1 }]
    n = 3
    comparison_func = ->(s1, s2, _d) { s1[:a] == s2[:a] }
    threshold = 0

    res = ComparisonUtils.n_wise_match_exists(samples, n, comparison_func, threshold)
    assert res != false
    assert res == [{ a: 1 }, { a: 1 }, { a: 1 }]
  end

  test '3-wise mismatch test' do
    samples = [{ a: 1 }, { a: 2 }, { a: 1 }]
    n = 3
    comparison_func = ->(s1, s2, _d) { s1[:a] == s2[:a] }
    threshold = 0

    res = ComparisonUtils.n_wise_match_exists(samples, n, comparison_func, threshold)
    assert res == false
  end
end
