class VideoSearchController < ApplicationController
  def home
    # last 25 videos for home page
    @videos  = Video.last(25).reverse
  end

  def search
  end

  def video_details
    params = request.query_parameters
    puts params #(for getting the query string on the q parameter)
  end
end