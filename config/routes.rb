Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/', to: 'video_search#home'
  get '/video/insert', to: 'video_insert#insert'
  get '/video/search/:vid_id', to: 'video_search#video_details'
  get '/video/search', to: 'video_search#video_details_by_search'
end
