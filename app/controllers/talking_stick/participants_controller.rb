require_dependency "talking_stick/application_controller"

module TalkingStick
  class ParticipantsController < ApplicationController
    before_action :set_room
    before_action :set_participant, only: [:show, :edit, :update, :destroy]

    # GET /participants
    def index
      @participants = Participant.all
    end

    # GET /participants/1
    def show
    end

    # GET /participants/new
    def new
      @participant = Participant.new
    end

    # GET /participants/1/edit
    def edit
    end

    # POST /participants
    def create
      params = participant_params.merge ip: request.remote_ip
      @participant = Participant.new(params)
      @participant.room = @room

      respond_to do |format|
        if @participant.save
          format.html { redirect_to [@room, @participant], notice: 'Participant was successfully created.' }
          format.json { render json: @participant }
        else
          render :new
        end
      end
    end

    # PATCH/PUT /participants/1
    def update
      if @participant.update(participant_params)
        redirect_to [@room, @participant], notice: 'Participant was successfully updated.'
      else
        render :edit
      end
    end

    # DELETE /participants/1
    def destroy
      @participant.destroy
      redirect_to participants_url, notice: 'Participant was successfully destroyed.'
    end

    private
      def set_room
        @room = Room.find_or_create(slug: (params[:id] || params[:room_id]))
      end

      # Use callbacks to share common setup or constraints between actions.
      def set_participant
        @participant = Participant.find params[:id]
      end

      # Only allow a trusted parameter "white list" through.
      def participant_params
        params.require(:participant).permit(:name, :ip, :guid)
      end
  end
end
