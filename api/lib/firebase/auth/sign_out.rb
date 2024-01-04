require 'rest-client'

module Firebase
  class SignOut
    def initialize(id_token)
      @id_token = id_token
    end

    def call
      begin
        response = RestClient.post "https://identitytoolkit.googleapis.com/v1/accounts:signOut?key=#{ENV['FIREBASE_API_KEY']}", { idToken: id_token }.to_json, { content_type: :json }
        JSON.parse(response)
      rescue RestClient::ExceptionWithResponse => e
        e.response
      end
    end

    private

    attr_reader :id_token
  end
end