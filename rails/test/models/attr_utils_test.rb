# frozen_string_literal: true

require 'test_helper'

class AttrUtilTest < ActiveSupport::TestCase
  class Foo
    attr_accessor :bar
    def initialize(bar:)
      @bar = bar
    end
  end

  test 'attribute average test' do
    item1 = Foo.new(bar: 0.1)
    item2 = Foo.new(bar: 0.2)

    assert_in_delta 0.15, AttrUtils.average_attr(:bar, item1, item2), 0.00001
  end

  test 'attribute absolute diff' do
    item1 = Foo.new(bar: 0.1)
    item2 = Foo.new(bar: 0.101)

    assert_in_delta 0.001, AttrUtils.abs_diff_attr(:bar, item1, item2), 0.00001
    assert_in_delta 0.001, AttrUtils.abs_diff_attr(:bar, item2, item1), 0.00001
  end
end
