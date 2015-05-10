class AddAssociationBetweenRoomsAndParticipants < ActiveRecord::Migration
  def change
    create_table :talking_stick_room_memberships do |t|
      t.belongs_to :room, index: true
      t.belongs_to :participant, index: true
      t.timestamps null: false
    end
  end
end
