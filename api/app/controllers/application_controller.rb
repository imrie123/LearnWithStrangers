require_relative '../../lib/firebase/auth/sign_up'
require_relative '../../lib/firebase/auth/sign_in'
require_relative '../../lib/firebase/auth/sign_out'
class ApplicationController < ActionController::API
  # include FirebaseAdmin::Auth::VerifyIdToken

  # private

  # def authenticate_user!
  #   token = request.headers['Authorization']&.split&.last
  #   begin
  #     decoded_token = verify_id_token(token)
  #     @current_user = User.find_by(uid: decoded_token['uid'])
  #     raise 'User not found' unless @current_user
  #   rescue => e
  #     render json: { error: e.message }, status: :unauthorized
  #
  #   end
  # end

end
