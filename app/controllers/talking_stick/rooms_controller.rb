require_dependency "talking_stick/application_controller"

module TalkingStick
  class RoomsController < ApplicationController
    before_filter :set_room, only: [:show, :edit, :update, :destroy, :signal]
    before_filter :set_participant, only: [:signal]

    # GET /rooms
    def index
      @rooms = Room.all
    end

    # GET /rooms/1
    def show
      @room.last_used = Time.now
      @room.save

      if params[:guid]
        if @participant = Participant.where(guid: params[:guid]).first
          @participant.last_seen = Time.now
          @participant.save
        end
      end

      Participant.remove_stale! @room

      response = {
        room: @room,
        participants: @room.participants,
        signals: deliver_signals!,
      }

      respond_to do |format|
        format.html
        format.json { render json: response }
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

    def signal
      signal = signal_params
      signal[:room] = @room
      signal[:sender] = Participant.where(guid: signal[:sender]).first
      signal[:recipient] = @participant
      TalkingStick::Signal.create! signal
      head 204
    end

    def deliver_signals!
      return unless @participant
      data = TalkingStick::Signal.where recipient_id: @participant.id

      # Destroy the signals as we return them, since they have been delivered
      result = []
      data.each do |signal|
        result << {
          signal_type: signal.signal_type,
          sender_guid: signal.sender_guid,
          recipient_guid: signal.recipient_guid,
          data: signal.data,
          room_id: signal.room_id,
          timestamp: signal.created_at,
        }
      end
      data.delete_all
      result
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def set_room
        @room = Room.find_or_create(slug: (params[:id] || params[:room_id]))
      end

      def set_participant
        @participant = Participant.find(params[:participant_id])
      rescue ActiveRecord::RecordNotFound
        # Retry with ID as GUID
        @participant = Participant.where(guid: params[:participant_id]).first
        raise unless @participant
      end

      # Only allow a trusted parameter "white list" through.
      def room_params
        params.require(:room).permit(:name, :last_used)
      end

      def signal_params
        params.permit(:sender, :signal_type, :data)
      end
  end
end
