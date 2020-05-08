class VideoSearchController < ApplicationController
  def home
    # last 25 videos for home page
    @videos  = Video.last(25).reverse
  end

  def search
  end

  def video_details
  end
end