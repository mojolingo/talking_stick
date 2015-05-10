$:.push File.expand_path('../lib', __FILE__)

# Maintain your gem's version:
require 'talking_stick/version'

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = 'talking_stick'
  s.version     = TalkingStick::VERSION
  s.authors     = ['Ben Klang']
  s.email       = ['bklang@mojolingo.com']
  s.homepage    = 'TODO'
  s.summary     = 'TODO: Summary of TalkingStick.'
  s.description = 'TODO: Description of TalkingStick.'
  s.license     = 'MIT'

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")

  s.add_dependency 'rails', '~> 4.2.1'

  s.add_development_dependency 'sqlite3'
  s.add_development_dependency 'rspec-rails'
  s.add_development_dependency 'capybara'
  s.add_development_dependency 'factory_girl_rails'
end
