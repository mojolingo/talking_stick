module TalkingStick
  class Signal < ActiveRecord::Base
    belongs_to :room
    belongs_to :sender, class_name: "TalkingStick::Participant"
    belongs_to :recipient, class_name: "TalkingStick::Participant"
    validates :room, :sender, :recipient, presence: true

    # The normal delegate method seems to not be working for an unknown reason
    def sender_guid
      self.sender.guid
    end

    def recipient_guid
      self.recipient.guid
    end
  end
end
