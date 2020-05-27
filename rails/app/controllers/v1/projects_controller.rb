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
    return json_error(message: 'no access to project') unless @current_user.projects.include?(params[:id].to_i)

    json_response(Project.find(params[:id]))
  end

  def create
    ActionController::Parameters.permit_all_parameters = true # TODO: security
    p = Project.create!(name: params[:project][:name], user_id: @current_user.id)
    CreateTasksJob.perform_later(p, params[:task], params[:media], @current_user.id)
    json_response(p, 204)
  end

  def destroy
    project_id = params[:id].to_i
    return json_error(message: 'no access to project') unless @current_user.projects.include?(project_id)

    Sample.joins(:task)
          .where(tasks: { project_id: project_id })
          .delete_all
    Task.where(project_id: project_id)
        .delete_all
    Project.find(project_id).delete
    json_response({})
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
           .where(id: @current_user.projects)
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
