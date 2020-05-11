require 'json'

class VideoInsertController < ApplicationController
  def insert
    @count = 1
    while @count < 4
      fileCount  = @count.to_s
      fileLocation = "app/assets/transcripts/transcript_" + fileCount + ".json"
      file = File.open(fileLocation, "rb")
      @transcript = file.read
      parsed_file = JSON.parse(@transcript)

      title = "ted_video_" + fileCount + ".mp4"
      @object = Video.new(
          title: title,
          transcript: parsed_file["results"]["transcripts"][0]["transcript"],
          full_transcript: @transcript,
          s3url:'s3 url2',
          folder_path: title
      )
      @object.save
      file.close
      @count += 1
    end
  end
end