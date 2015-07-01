class TalkingStick::ViewsGenerator < Rails::Generators::Base
  source_root File.expand_path('../../../../../app/views/talking_stick', __FILE__)

  def generate_participant_views
    directory "participants", "#{paste_path}/participants"
  end

  def generate_room_views
    directory "rooms", "#{paste_path}/rooms"
  end

private

  def paste_path
    'app/views/talking_stick'
  end

end
