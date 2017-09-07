class CreateTalkingStickSignals < ActiveRecord::Migration[5.1]
  def change
    create_table :talking_stick_signals do |t|
      t.belongs_to :room
      t.belongs_to :sender, class_name: "TalkingStick::Participant", index: true
      t.belongs_to :recipient, class_name: "TalkingStick::Participant", index: true
      t.string :signal_type
      t.text :data
      t.timestamps null: false
    end
  end
end
