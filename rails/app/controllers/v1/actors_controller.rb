# frozen_string_literal: true

# Controller for viewing actor stats
class V1::ActorsController < ApplicationController
  include Pagination
  def items_per_page
    50
  end

  # GET /actors?project_id=id
  def index
    timestamp = pagination_timestamp
    actors = actors_for(params[:project_id], timestamp)
    count = actors_count(params[:project_id], timestamp)
    paged_json_response(actors, timestamp, count: count)
  end

  # GET /actors/id?project_id=id
  def show
    actor = if params[:project_id].nil?
              Actor.find(params[:id])
            else
              a = ProjectActor.find(params[:id])
              a.project_id = params[:project_id]
              a
            end
    json_response(actor)
  end

  private

  def actors_base_query(project_id, timestamp)
    q = if project_id.nil?
          Actor.all
        else
          ProjectActor.where(tasks: { project_id: project_id })
        end

    q.where(Actor.arel_table[:created_at].lt(timestamp))
     .joins(sample: :task)
     .where(tasks: { project_id: @current_user.projects })
     .distinct
  end

  def actors_for(project_id, timestamp)
    actors_base_query(project_id, timestamp)
      .order('actors.created_at DESC')
      .offset(pagination_offset)
      .limit(pagination_limit)
      .each do |p|
        p.project_id = project_id
      end
  end

  def actors_count(project_id, timestamp)
    actors_base_query(project_id, timestamp).count
  end
end
