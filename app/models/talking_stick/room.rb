module TalkingStick
  class Room < ActiveRecord::Base
    has_many :participants
  end
end
