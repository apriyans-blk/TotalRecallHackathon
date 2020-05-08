class VideoInsertController < ApplicationController
  def insert
    @object = Video.new(
        title: 'Video 2',
        transcript: 'This is transcript2',
        s3url:'s3 url2',
        folder_path: '/folder2/path'
    )
    @object.save
  end
end
