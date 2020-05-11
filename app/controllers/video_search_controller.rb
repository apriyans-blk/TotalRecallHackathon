class VideoSearchController < ApplicationController
  def home
    # last 25 videos for home page
    @videos  = Video.last(25).reverse
  end

  # Get the details of video for requested id.
  def video_details
    unless params[:vid_id].blank?
      puts params[:vid_id]
      @video = Video.find(params[:vid_id])
    end
  end

  # Videos details will be returned by searching the transcript
  # for the mentioned keyword using searchkick.
  # Suppy the keyword as query params.
  # example url to be constructed -> /video/search?search_keyword=technology&page=1
  def search
    params = request.query_parameters
    @search_keyword = params[:search_keyword]
    @page = 1
    @page = params[:page] if params[:page]

    unless @search_keyword.blank?
      @results = Video.search @search_keyword, load: false, per_page: 12, page: @page, fields: ["title^10","transcript"]
    end
  end
end