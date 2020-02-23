# frozen_string_literal: true

require 'test_helper'

class LocatorGeneratorTest < ActiveSupport::TestCase
  test 'compare points lists' do
    threshold = 0.03
    s1 = LocatorSample.new(points: [{ x: 0.1, y: 0.2 }, { x: 0.3, y: 0.4 }].to_json)
    s2 = LocatorSample.new(points: [{ x: 0.5, y: 0.6 }].to_json)

    assert LocatorGenerator.compare_points_lists(s1, s1, threshold)
    assert_not LocatorGenerator.compare_points_lists(s1, s2, threshold)
  end

  test 'average points lists' do
    s1 = LocatorSample.new(points: [{ x: 0.1, y: 0.2 }, { x: 0.3, y: 0.4 }].to_json)
    s2 = LocatorSample.new(points: [{ x: 0.5, y: 0.6 }, { x: 0.5, y: 0.6 }].to_json)

    avg = LocatorGenerator.average_points_lists(JSON.parse(s1.points), JSON.parse(s2.points))
    assert avg == [{ x: 0.3, y: 0.4 }, { x: 0.4, y: 0.5 }]
  end

  test 'merge points lists' do
    s1 = LocatorSample.new(points: [{ x: 0.3, y: 0.4 }, { x: 0.1, y: 0.2 }].to_json)
    s2 = LocatorSample.new(points: [{ x: 0.5, y: 0.6 }, { x: 0.1, y: 0.2 }].to_json)

    res = LocatorGenerator.merge_points_lists([s1, s2])
    assert res == [{ x: 0.1, y: 0.2 }, { x: 0.4, y: 0.5 }]
  end
end
