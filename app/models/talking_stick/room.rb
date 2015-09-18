module TalkingStick
  class Room < ActiveRecord::Base
    has_many :participants, dependent: :destroy
    has_many :signals, dependent: :destroy

    before_validation :sluggify_name

    def self.find_or_create(slug:)
      slug = slug.parameterize
      find_by(slug: slug) || create(name: slug.titleize, slug: slug)
    end

    def to_param
      slug
    end

    private

    def sluggify_name
      self.slug = name.parameterize if !slug.present?
    end
  end
end
