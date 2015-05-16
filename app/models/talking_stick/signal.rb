module TalkingStick
  class Signal < ActiveRecord::Base
    belongs_to :room
    belongs_to :sender, class_name: "TalkingStick::Participant"
    belongs_to :recipient, class_name: "TalkingStick::Participant"
  end
end
