module ApplicationHelper
  def image_path(video_title)
    id = video_title.split('.')[0].delete("^0-9")
    url = image_url 'thumbnail_'+id.to_s+'.png'
    image_url url
  end
end
