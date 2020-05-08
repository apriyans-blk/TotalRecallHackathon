class VideoSearchController < ApplicationController
  def home
    # last 25 videos for home page
    @videos  = Video.last(25).reverse
  end

  # Get the details of video for requested id.
  def video_details
    params = request.path_parameters
    @video = Video.find_by_id(params[:vid_id])
  end

  # Videos details will be returned by searching the transcript
  # for the mentioned keyword using searchkick.
  # Suppy the keyword as query params.
  # example url to be constructed -> /video/search?search_keyword=technology
  def video_details_by_search
    params = request.query_parameters
    @search_keyword = params[:search_keyword]
  end
end