# frozen_string_literal: true

# Concrete sample for identifying object locations
class LocatorSample < ApplicationRecord
  # Validator for list of points
  class PointListValidator < ActiveModel::Validator
    def validate(record)
      return unless check_points_presence(record)

      points = check_points_array(record)
      return unless points

      check_points_in_range(record, points)
    end

    def check_points_presence(record)
      if record.points.nil?
        record.errors[:points] << 'Points need to be an array'
        return false
      end

      true
    end

    def check_points_array(record)
      unless record.points.is_a?(Array)
        record.errors[:points] << 'Points need to be an array'
        return false
      end

      record.points
    end

    def check_points_in_range(record, points)
      points.each do |point|
        x = point['x'].to_f
        y = point['y'].to_f
        unless x >= 0 && x <= 1 && y >= 0 && y <= 1
          record.errors[:points] << 'Point coordinates need to be between 0 and 1'
        end
      end
    end
  end

  acts_as :sample

  validates_with PointListValidator
end
