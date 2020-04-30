# frozen_string_literal: true

# A user account for the portal
class User < ApplicationRecord
  has_secure_password
end
