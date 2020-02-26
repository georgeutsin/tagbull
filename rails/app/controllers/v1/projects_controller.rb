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

  def create
    json_response(Project.create!(name: params[:name]))
  end

  def pause
    project = Project.find(params[:project_id])
    project.paused = true
    project.save
    json_response(project)
  end

  def resume
    project = Project.find(params[:project_id])
    project.paused = false
    project.save
    json_response(project)
  end
end
