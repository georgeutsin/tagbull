# frozen_string_literal: true

require 'test_helper'

class LocatorSampleTest < ActiveSupport::TestCase
  test 'should not save locator sample without points' do
    sample = LocatorSample.new
    assert_not sample.save
    assert_not sample.errors[:points].empty?
  end

  test 'should not save locator sample with bad points' do
    sample = LocatorSample.new
    sample.points = [{ x: 1.5, y: 0.2 }].to_json
    assert_not sample.save
    assert_not sample.errors[:points].empty?
  end

  test 'should save locator sample with good points' do
    sample = LocatorSample.new
    sample.points = [{ x: 0.5, y: 0.2 }, { x: 0.3, y: 0.1 }].to_json
    sample.save
    assert sample.errors[:points].empty?
  end
end
