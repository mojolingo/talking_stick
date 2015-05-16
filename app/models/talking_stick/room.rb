module TalkingStick
  class Room < ActiveRecord::Base
    has_many :participants, dependent: :destroy
    has_many :signals, dependent: :destroy
  end
end
