# frozen_string_literal: true

require 'test_helper'

class LocatorGeneratorTest < ActiveSupport::TestCase
  test 'compare points lists' do
    threshold = 0.03
    s1 = LocatorSample.new(points: [{ x: 0.1, y: 0.2 }, { x: 0.3, y: 0.4 }])
    s2 = LocatorSample.new(points: [{ x: 0.5, y: 0.6 }])

    assert LocatorGenerator.compare_points_lists(s1, s1, threshold)
    assert_not LocatorGenerator.compare_points_lists(s1, s2, threshold)
  end

  test 'average points lists' do
    s1 = LocatorSample.new(points: [{ x: 0.1, y: 0.2 }, { x: 0.3, y: 0.4 }])
    s2 = LocatorSample.new(points: [{ x: 0.5, y: 0.6 }, { x: 0.5, y: 0.6 }])

    avg = LocatorGenerator.average_points(s1.points[0], s2.points[0])
    assert avg == { x: 0.3, y: 0.4 }
  end

  test 'merge points lists' do
    s1 = LocatorSample.new(points: [{ x: 0.3, y: 0.4 }, { x: 0.1, y: 0.2 }])
    s2 = LocatorSample.new(points: [{ x: 0.5, y: 0.6 }, { x: 0.1, y: 0.2 }])
    pairs = LocatorGenerator.points_pairs(s1, s2, 0.25)

    res = LocatorGenerator.merge_points_lists(pairs)
    assert res == [{ x: 0.1, y: 0.2 }, { x: 0.4, y: 0.5 }]
  end
end
