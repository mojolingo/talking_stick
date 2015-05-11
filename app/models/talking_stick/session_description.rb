module TalkingStick
  class SessionDescription < ActiveRecord::Base
    belongs_to :sender, class_name: "TalkingStick::Participant"
    belongs_to :recipient, class_name: "TalkingStick::Participant"
  end
end
