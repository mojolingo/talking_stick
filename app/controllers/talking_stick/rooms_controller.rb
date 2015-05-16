require_dependency "talking_stick/application_controller"

module TalkingStick
  class RoomsController < ApplicationController
    before_action :set_room, only: [:show, :edit, :update, :destroy]
    before_action :set_participant, only: [:signaling]

    # GET /rooms
    def index
      @rooms = Room.all
    end

    # GET /rooms/1
    def show
      if params[:guid]
        if participant = Participant.where(guid: params[:guid]).first
          participant.last_seen = Time.now
          participant.save
        end
      end

      Participant.remove_stale! @room

      respond_to do |format|
        format.html
        format.json { render json: @room, include: :participants }
      end
    end

    # GET /rooms/new
    def new
      @room = Room.new
    end

    # GET /rooms/1/edit
    def edit
    end

    # POST /rooms
    def create
      @room = Room.new(room_params)

      if @room.save
        redirect_to @room, notice: 'Room was successfully created.'
      else
        render :new
      end
    end

    # PATCH/PUT /rooms/1
    def update
      if @room.update(room_params)
        redirect_to @room, notice: 'Room was successfully updated.'
      else
        render :edit
      end
    end

    # DELETE /rooms/1
    def destroy
      @room.destroy
      redirect_to rooms_url, notice: 'Room was successfully destroyed.'
    end

    def get_session_descriptions
    end

    # POST /rooms/1/session_description
    # This is how a participant sends a media description to another participant
    def post_session_description
      @sender    = Participant.where(sender_guid: params[:sender_guid]).first
      @recipient = Participant.where(recipient_guid: params[:recipient_guid]).first
      unless @sender && @recipient
        head 400
        return
      end

      # Check to see if there is an existing session to update
      @descr = SessionDescription.where(room_id: @room.id, sender_id: @sender.id, recipient_id: @recipient.id).first
      @descr ||= SessionDescription.new

      @descr.description = params[:description]

      @descr.save!

      head 204
    end

    def signaling
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_room
        @room = Room.find(params[:id])
      end

      def set_participant
        @participant = Participant.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        # Retry with ID as GUID
        @participant = Participant.where(guid: params[:id]).first
        raise unless @participant
      end

      # Only allow a trusted parameter "white list" through.
      def room_params
        params.require(:room).permit(:name, :last_used)
      end
  end
end
