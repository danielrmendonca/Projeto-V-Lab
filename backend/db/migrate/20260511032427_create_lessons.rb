class CreateLessons < ActiveRecord::Migration[7.2]
  def change
    create_table :lessons do |t|
      t.string :title, null: false
      t.string :status, null: false, default: "draft"
      t.string :video_url
      t.references :course, null: false, foreign_key: true

      t.timestamps
    end
  end
end
