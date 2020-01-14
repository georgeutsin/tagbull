# frozen_string_literal: true

require 'test_helper'

class TagGeneratorTest < ActiveSupport::TestCase
  class Foo
    attr_accessor :bar
    def initialize(bar:)
      @bar = bar
    end
  end

  test 'attribute average test' do
    item1 = Foo.new(bar: 0.1)
    item2 = Foo.new(bar: 0.2)

    assert_in_delta 0.15, TagGenerator.average_attr(:bar, item1, item2), 0.00001
  end

  test 'attribute absolute diff' do
    item1 = Foo.new(bar: 0.1)
    item2 = Foo.new(bar: 0.101)

    assert_in_delta 0.001, TagGenerator.abs_diff_attr(:bar, item1, item2), 0.00001
    assert_in_delta 0.001, TagGenerator.abs_diff_attr(:bar, item2, item1), 0.00001
  end

  test 'compare bounding boxes' do
    threshold = 0.03
    bb1 = BoundingBoxSample.new(min_x: 0.1, min_y: 0.2, max_x: 0.5, max_y: 0.6)
    bb2 = BoundingBoxSample.new(min_x: 0, min_y: 0, max_x: 1, max_y: 1)

    assert TagGenerator.compare_bounding_boxes(bb1, bb1, threshold)
    assert_not TagGenerator.compare_bounding_boxes(bb1, bb2, threshold)
  end

  test 'bounding box pair exists' do
    bb1 = BoundingBoxSample.new(min_x: 0.1, min_y: 0.2, max_x: 0.5, max_y: 0.6)
    bb2 = BoundingBoxSample.new(min_x: 0.12, min_y: 0.22, max_x: 0.52, max_y: 0.62)

    assert TagGenerator.bounding_box_pair_exists([bb1, bb2])
  end

  test 'bounding box pair does not exist' do
    bb1 = BoundingBoxSample.new(min_x: 0.1, min_y: 0.2, max_x: 0.5, max_y: 0.6)
    bb2 = BoundingBoxSample.new(min_x: 0.2, min_y: 0.3, max_x: 0.6, max_y: 0.7)

    assert_not TagGenerator.bounding_box_pair_exists([bb1, bb2])
  end
end
