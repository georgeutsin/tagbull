# frozen_string_literal: true

# Controller for listing and editing projects
class V1::ProjectsController < ApplicationController
  # GET /projects
  def index
    projects = Project.all
    json_response(projects)
  end

  def show
    json_response(Project.find(params[:id]))
  end
end
