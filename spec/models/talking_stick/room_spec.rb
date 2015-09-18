require 'spec_helper'

module TalkingStick
  RSpec.describe Room, type: :model do
    describe "#validation" do
      subject { described_class.new(name: "Test") }

      it "automatically sluggifys the room name" do
        expect {
          subject.valid?
        }.to change{ subject.slug }.from(nil).to("test")
      end

      it "allows the slug to be set by manually" do
        subject.slug = "dont_touch"
        expect {
          subject.valid?
        }.to_not change{ subject.slug }.from("dont_touch")
      end
    end

    describe ".find_or_create" do
      it "uses a room if it already exists" do
        existing = described_class.create(name: "Test")

        expect(described_class.find_or_create(slug: "test")).to eq existing
        expect(described_class.count).to eq 1
      end

      it "creates a room if the slug doesn't exist" do
        expect {
          described_class.find_or_create(slug: "Test")
        }.to change(described_class, :count).by(1)
      end
    end
  end
end
