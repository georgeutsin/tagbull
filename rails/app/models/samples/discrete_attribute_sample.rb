# frozen_string_literal: true

# Concrete sample for discrete attribute samples
class DiscreteAttributeSample < ApplicationRecord
  acts_as :sample

  validates :option, presence: true
end
