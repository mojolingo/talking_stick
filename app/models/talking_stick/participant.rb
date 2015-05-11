module TalkingStick
  class Participant < ActiveRecord::Base
    belongs_to :room

    class << self
      def remove_stale!(room)
        self.where(room_id: room.id).where('last_seen < ?', Time.now - 5.minutes)
      end
    end
  end
end
