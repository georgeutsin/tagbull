# frozen_string_literal: true

# Activities controller
class V1::ActivitiesController < ApplicationController
  # GET /activities?project_id=1234
  def show
    activity = Activity.new(actor_sig: params[:actor_sig], project_id: params[:project_id])
    json_response(activity)
  end

  # GET /activities/available
  def available
    json_response(!Activity.next_task(0).nil?)
  end
end
