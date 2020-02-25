# frozen_string_literal: true

# Attribute utilities.
class AttrUtils
  def self.average_attr(attr, item1, item2)
    (item1.send(attr) + item2.send(attr)) / 2
  end

  def self.abs_diff_attr(attr, item1, item2)
    (item1.send(attr) - item2.send(attr)).abs
  end

  def self.average_hash(attr, item1, item2)
    (item1[attr].to_f + item2[attr].to_f) / 2
  end

  def self.abs_diff_hash(attr, item1, item2)
    (item1[attr].to_f - item2[attr].to_f).abs
  end
end
