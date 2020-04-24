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
    actor = Actor.find(params[:id])
    json_response(actor, base: {
                    stats: actor.stats(params[:project_id])
                  })
  end

  private

  def actors_base_query(project_id, timestamp)
    return Actor.all.where(Actor.arel_table[:created_at].lt(timestamp)) if project_id.nil?

    Actor.joins(sample: :task)
         .where(Actor.arel_table[:created_at].lt(timestamp))
         .where(tasks: { project_id: project_id })
  end

  def actors_for(project_id, timestamp)
    actors_base_query(project_id, timestamp)
      .order('actors.created_at DESC')
      .offset(pagination_offset)
      .limit(pagination_limit)
  end

  def actors_count(project_id, timestamp)
    actors_base_query(project_id, timestamp).count
  end
end
