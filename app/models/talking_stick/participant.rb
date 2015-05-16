module TalkingStick
  class Participant < ActiveRecord::Base
    belongs_to :room

    class << self
      def remove_stale!(room)
        self.where(room: room).where('last_seen < ?', Time.now - 5.minutes).delete_all
      end
    end
  end
end
