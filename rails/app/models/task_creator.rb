# frozen_string_literal: true

# Generates a tag.
class TaskCreator
  def self.create(project, task, media)
    case task[:type]
    when 'DichotomyTask'
      create_tasks(project, method(:create_dichotomy_task), task, media)
    when 'LocatorTask'
      create_tasks(project, method(:create_locator_task), task, media)
    else
      json_error(message: 'unknown task type')
    end
  end

  def self.create_tasks(project, create_fn, task, media)
    results = []
    ActiveRecord::Base.transaction do
      media.each do |m|
        name = m[:name] || RandUtils.rand_medium_name
        medium = Medium.create!(name: name, url: m[:url])
        task = create_fn.call(project, medium, task[:config])
        results.append(task.acting_as.id)
      end
    end
    json_response(results)
  end

  def self.create_dichotomy_task(project, medium, config)
    DichotomyTask.create!(
      project_id: project.id,
      first: config[:first],
      second: config[:second],
      parent_category: config[:parent_category],
      media_id: medium.id
    )
  end

  def self.create_locator_task(project, medium, config)
    LocatorTask.create!(
      project_id: project.id,
      media_id: medium.id,
      category: config[:category]
    )
  end
end
