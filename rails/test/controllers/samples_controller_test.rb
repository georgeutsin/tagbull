# frozen_string_literal: true

require 'test_helper'

class SamplesControllerTest < ActionDispatch::IntegrationTest
  test 'should create bounding box sample' do
    p = Project.create!
    t = BoundingBoxTask.create!(project: p)
    V1::SamplesController.any_instance.stubs(:maybe_generate_tag).returns(false)

    assert_difference('BoundingBoxSample.count') do
      post samples_url,
           params: {
             task_id: t.acting_as.id,
             project_id: p.id,
             actor_sig: '123',
             time_elapsed: 2000,
             data: {
               min_x: 0.1,
               min_y: 0.2,
               max_x: 0.3,
               max_y: 0.4
             }
           }
    end
  end

  test 'should create locator sample' do
    p = Project.create!
    t = LocatorTask.create!(project: p)
    V1::SamplesController.any_instance.stubs(:maybe_generate_tag).returns(false)

    assert_difference('LocatorSample.count') do
      post samples_url,
           params: {
             task_id: t.acting_as.id,
             project_id: p.id,
             actor_sig: '123',
             time_elapsed: 2000,
             data: {
               points: [{ x: 0.1, y: 0.2 }].to_json
             }
           }
    end
  end
end
