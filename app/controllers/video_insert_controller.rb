require 'json'

class VideoInsertController < ApplicationController
  def insert
    @titles = ["Davos 2020: Larry Fink","Larry Fink: Preparing for a crisis","Neeraj Seth - Bloomberg","BlackRock Bottom Line: Sustainable investing: Resilience amid uncertainty"]
    @count = 1
    while @count < 5
      fileCount  = @count.to_s
      fileLocation = "app/assets/transcripts/transcript_" + fileCount + ".json"
      file = File.open(fileLocation, "rb")
      @transcript = file.read
      parsed_file = JSON.parse(@transcript)
      title = @titles.at(@count-1)
      video_location = "video_" + @count.to_s + ".mp4"
      @object = Video.new(
          title: title,
          transcript: parsed_file["results"]["transcripts"][0]["transcript"],
          full_transcript: @transcript,
          s3url:'s3 url2',
          folder_path: video_location
      )
      @object.save
      file.close
      @count += 1
    end
  end
end