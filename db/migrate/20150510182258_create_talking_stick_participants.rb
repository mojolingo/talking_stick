class CreateTalkingStickParticipants < ActiveRecord::Migration
  def change
    create_table :talking_stick_participants do |t|
      t.string :name
      t.string :ip
      t.string :guid
      t.belongs_to :room, index: true

      t.timestamps null: false
    end
  end
end
