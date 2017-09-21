require "jquery-rails"

module TalkingStick
  class Engine < ::Rails::Engine
    engine_name "talking_stick"

    config.generators do |g|
      g.test_framework      :rspec,        :fixture => false
      g.fixture_replacement :factory_girl, :dir => 'spec/factories'
      g.assets true
      g.helper false
    end

    initializer "talking_stick.assets.precompile" do |app|
      app.config.assets.precompile += %w( application.js application.css )
    end
  end
end
