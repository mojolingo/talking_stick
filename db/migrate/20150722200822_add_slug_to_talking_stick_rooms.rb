class AddSlugToTalkingStickRooms < ActiveRecord::Migration
  def up
    add_column :talking_stick_rooms, :slug, :string
    # Add slugs to the existing rooms
    TalkingStick::Room.all.map &:save
  end

  def down
    remove_column :talking_stick_rooms, :slug
  end
end
