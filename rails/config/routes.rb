# frozen_string_literal: true

require 'api_constraints'

Rails.application.routes.draw do
  root 'welcome#index'
  get 'welcome/index' # needed to pass a test

  scope module: :v1, defaults: { format: :json }, constraints: ApiConstraints.new(version: 1, default: true) do
    resource :activities, only: %i[show] do
      get 'available', 'enable', 'disable'
    end
    resources :samples, only: %i[create]
    resources :projects, only: %i[index show update create delete] do
      resources :tasks, only: %i[create]
      resources :tags, only: %i[index show]
      resources :samples, only: %i[index]
    end
  end
end
