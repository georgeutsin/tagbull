# frozen_string_literal: true

# Activities controller
class V1::ActivitiesController < ApplicationController
  # GET /activities
  def show
    activity = Activity.new(actor_sig: params[:actor_sig])
    json_response(activity)
  end

  # GET /activities/available
  def available
    json_response(Rails.cache.read('available'))
  end

  # GET /activities/enable
  def enable
    Rails.cache.write('available', true)
    json_response(Rails.cache.read('available'))
  end

  # GET /activities/disable
  def disable
    Rails.cache.write('available', false)
    json_response(Rails.cache.read('available'))
  end
end
