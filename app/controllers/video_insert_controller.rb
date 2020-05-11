class VideoInsertController < ApplicationController
  def insert
    @count = 1
    while @count < 4
      fileCount  = @count.to_s
      fileLocation = "app/assets/transcripts/transcript_" + fileCount + ".json"
      @f = File.open(fileLocation, "rb")
      @transcript = @f.read
      title = "ted_video_" + fileCount + ".mp4"
      @object = Video.new(
          title: title,
          transcript: @transcript,
          s3url:'s3 url2',
          folder_path: title
      )
      @object.save
      @f.close
      @count += 1
    end
  end
end