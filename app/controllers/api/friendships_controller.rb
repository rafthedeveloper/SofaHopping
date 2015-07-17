class Api::TripsController < ApplicationController
  def create
    @friendship = current_user.requested_friendships.new(friend_params)

    if @friendship.save
      render json: @friendship
    else
      render json: @friendship.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    @friendship = Friendship.find(params[:id])
    @friendship.destroy!
  end

  private

  def friend_params
    params.require(:friendship).permit(:requestee_id);
  end
end