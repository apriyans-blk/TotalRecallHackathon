class AddFullTranscriptToVideos < ActiveRecord::Migration[6.0]
  def change
    add_column :videos, :full_transcript, :text
  end
end
