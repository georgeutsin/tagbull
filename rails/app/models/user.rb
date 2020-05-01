# frozen_string_literal: true

# A user account for the portal
class User < ApplicationRecord
  has_secure_password
  
  attribute :projects

  def projects
    Project.where(user_id: id).pluck(:id)
  end
end
