# frozen_string_literal: true

# Concrete sample for bounding box samples
class BoundingBoxSample < ApplicationRecord
  acts_as :sample

  validates :min_x, :max_x, :min_y, :max_y, numericality: { in: 0..1 }

  before_validation :normalize

  protected

  def normalize
    assign_attributes(
      min_x: [min_x, max_x].min,
      min_y: [min_y, max_y].min,
      max_x: [min_x, max_x].max,
      max_y: [min_y, max_y].max
    )
  end
end
