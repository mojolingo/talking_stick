module TalkingStick
  class Participant < ActiveRecord::Base
    belongs_to :room
  end
end
