require "talking_stick/engine"

module TalkingStick
  # Used to isolate Engine models by namespacing them
  def self.table_name_prefix
    "#{Engine.engine_name}_"
  end
end
