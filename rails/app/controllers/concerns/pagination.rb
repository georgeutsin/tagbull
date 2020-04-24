# frozen_string_literal: true

# Pagination helpers
module Pagination
  include Response
  def paged_json_response(object, timestamp, status = :ok, count: -1, base: {})
    pagination_meta = {
      meta: {
        timestamp: timestamp.to_i,
        offset: pagination_offset + object.length,
        total_count: count
      }
    }
    json_response(object, status, base: base.merge(pagination_meta))
  end

  def pagination_timestamp
    params[:timestamp] ? DateTime.strptime(params[:timestamp], '%s') : Time.now.utc
  end

  def pagination_offset
    params[:offset] ? params[:offset].to_i : 0
  end

  def items_per_page
    10
  end

  def pagination_limit
    params[:limit] ? params[:limit].to_i : items_per_page
  end
end
