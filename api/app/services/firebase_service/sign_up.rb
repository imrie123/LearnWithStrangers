require 'rest-client'

module FirebaseService
  class SignUp
    def initialize(email, password)
      @email = email
      @password = password
    end

    def call
      begin
        response = RestClient.post "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=#{ENV['FIREBASE_API_KEY']}", { email: email, password: password, returnSecureToken: true }.to_json, { content_type: :json }

        puts JSON.parse(response)
        JSON.parse(response)


      rescue RestClient::ExceptionWithResponse => e
        e.response
      end
    end

    private

    attr_reader :email, :password
  end
end