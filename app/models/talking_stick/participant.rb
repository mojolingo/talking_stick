module TalkingStick
  class Participant < ActiveRecord::Base
    belongs_to :room
    has_many :signals_sent, class_name: 'Signal', foreign_key: 'sender_id', dependent: :destroy
    has_many :signals_received, class_name: 'Signal', foreign_key: 'recipient_id', dependent: :destroy
    before_save :set_defaults

    def set_defaults
      self.joined_at ||= Time.now
      self.last_seen ||= self.joined_at
    end

    class << self
      def remove_stale!(room)
        self.where(room: room).where('last_seen < ?', Time.now - 1.minute).destroy_all
      end
    end
  end
end
