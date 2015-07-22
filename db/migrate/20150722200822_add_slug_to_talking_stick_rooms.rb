class AddSlugToTalkingStickRooms < ActiveRecord::Migration
  def change
    add_column :talking_stick_rooms, :slug, :string
  end
end
