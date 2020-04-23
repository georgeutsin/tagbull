# frozen_string_literal: true

class Actor < ApplicationRecord
  has_many :sample
  attribute :num_samples
  attribute :correct_samples

  def num_samples
    Sample.where(actor_id: id).count
  end

  def correct_samples
    Sample.where(actor_id: id, is_active: true).count
  end
end
