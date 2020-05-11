require 'json'

class VideoInsertController < ApplicationController
  def insert
    @count = 1
    while @count < 4
      fileCount  = @count.to_s
      fileLocation = "app/assets/transcripts/transcript_" + fileCount + ".json"
      file = File.open(fileLocation, "rb")
      transcript_hash = JSON.load file
      transcript = transcript_hash["results"]["transcripts"][0]
      title = "ted_video_" + fileCount + "/mp4"
      @object = Video.new(
          title: title,
          transcript: transcript,
          full_transcript: transcript_hash.to_s,
          s3url:'s3 url2',
          folder_path: '/folder2/path'
      )
      @object.save
      file.close
      @count += 1
    end
  end
end