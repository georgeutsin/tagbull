# frozen_string_literal: true

require 'test_helper'

class BoundingBoxGeneratorTest < ActiveSupport::TestCase
  test 'compare bounding boxes' do
    delta = 0.03
    bb1 = BoundingBoxSample.new(min_x: 0.1, min_y: 0.2, max_x: 0.5, max_y: 0.6)
    bb2 = BoundingBoxSample.new(min_x: 0, min_y: 0, max_x: 1, max_y: 1)

    assert BoundingBoxGenerator.compare_bounding_boxes(bb1, bb1, delta)
    assert_not BoundingBoxGenerator.compare_bounding_boxes(bb1, bb2, delta)
  end

  test 'bounding box pair exists' do
    delta = 0.03
    bb1 = BoundingBoxSample.new(min_x: 0.1, min_y: 0.2, max_x: 0.5, max_y: 0.6)
    bb2 = BoundingBoxSample.new(min_x: 0.12, min_y: 0.22, max_x: 0.52, max_y: 0.62)

    comparison_func = ->(s1, s2, d) { BoundingBoxGenerator.compare_bounding_boxes(s1, s2, d) }

    assert ComparisonUtils.sample_pair_exists([bb1, bb2], comparison_func, delta)
  end

  test 'bounding box pair does not exist' do
    delta = 0.03
    bb1 = BoundingBoxSample.new(min_x: 0.1, min_y: 0.2, max_x: 0.5, max_y: 0.6)
    bb2 = BoundingBoxSample.new(min_x: 0.2, min_y: 0.3, max_x: 0.6, max_y: 0.7)

    comparison_func = ->(s1, s2, d) { BoundingBoxGenerator.compare_bounding_boxes(s1, s2, d) }

    assert_not ComparisonUtils.sample_pair_exists([bb1, bb2], comparison_func, delta)
  end
end
