class CreateTalkingStickParticipants < ActiveRecord::Migration
  def change
    create_table :talking_stick_participants do |t|
      t.string :name
      t.string :ip
      t.string :guid, index: true
      t.timestamp :last_seen
      t.belongs_to :room, index: true

      t.timestamps null: false
    end
  end
end
