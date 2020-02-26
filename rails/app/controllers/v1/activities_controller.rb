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
    json_response(!Activity.next_task(0).nil?)
  end
end
