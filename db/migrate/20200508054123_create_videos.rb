class CreateVideos < ActiveRecord::Migration[6.0]
  def change
    create_table :videos do |t|
      t.string :title
      t.text :transcript
      t.string :s3url
      t.string :folder_path

      t.timestamps
    end
  end
end
