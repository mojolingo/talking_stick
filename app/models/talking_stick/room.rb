module TalkingStick
  class Room < ActiveRecord::Base
    has_many :participants, through: :room_memberships
  end
end
