# frozen_string_literal: true

# Controller for listing and editing projects
class V1::ProjectsController < ApplicationController
  include Pagination
  def items_per_page
    50
  end

  # GET /projects
  def index
    timestamp = pagination_timestamp
    projects = projects_for(timestamp)
    count = projects_count(timestamp)
    paged_json_response(projects, timestamp, count: count)
  end

  # GET /projects/id
  def show
    json_response(Project.find(params[:id]))
  end

  def create
    p = Project.create!(name: params[:project['name']])
    CreateTasksJob.perform_later(p, params[:task], params[:media])
    json_response(p)
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

  private

  def projects_base_query(timestamp)
    Project.all
           .where(Project.arel_table[:created_at].lt(timestamp))
  end

  def projects_for(timestamp)
    projects_base_query(timestamp)
      .order('projects.created_at DESC')
      .offset(pagination_offset)
      .limit(pagination_limit)
  end

  def projects_count(timestamp)
    projects_base_query(timestamp).count
  end
end
