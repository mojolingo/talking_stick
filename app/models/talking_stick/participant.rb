module TalkingStick
  class Participant < ActiveRecord::Base
    has_many :rooms, through: :room_memberships
  end
end
