Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/', to: 'video_search#home'
  get '/search', to: 'video_search#search'
  get '/video_details/:vid_id', to: 'video_search#video_details'
end
