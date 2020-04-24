# frozen_string_literal: true

# Controller for listing and editing projects
class V1::ProjectsController < ApplicationController
  # GET /projects
  def index
    projects = Project.all
    json_response(projects)
  end

  # GET /projects/id
  def show
    json_response(Project.find(params[:id]))
  end

  def create
    json_response(Project.create!(name: params[:name]))
  end

  # PATCH /projects/id
  # rubocop:disable Metrics/AbcSize
  def update
    p = Project.find(params[:id])
    p.paused = params[:paused] unless params[:paused].nil?
    p.is_private = params[:is_private] unless params[:is_private].nil?
    p.save
    json_response(p)
  end
  # rubocop:enable Metrics/AbcSize
end
