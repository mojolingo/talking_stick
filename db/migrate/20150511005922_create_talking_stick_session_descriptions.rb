class CreateTalkingStickSessionDescriptions < ActiveRecord::Migration
  def change
    create_table :talking_stick_session_descriptions do |t|
      t.belongs_to :room
      t.belongs_to :sender, class_name: "TalkingStick::Participant"
      t.belongs_to :recipient, class_name: "TalkingStick::Participant"
      t.text :description
      t.timestamps null: false
    end
  end
end
