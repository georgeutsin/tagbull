# frozen_string_literal: true

# Random utilities
class RandUtils
  def self.rand_medium_name
    (0...8).map { rand(65..90).chr }.join
  end
end
