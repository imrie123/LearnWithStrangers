require 'rest-client'

module FirebaseService
  class UpdateImage
    def initialize(image)
      @image = image
    end

    def call
      begin
        bucket = FirebaseService::Storage.new.bucket
        file = bucket.create_file(image.tempfile, "images/#{image.original_filename}")
        file.public_url
      rescue RestClient::ExceptionWithResponse => e
        e.response
      end
    end

    private

    attr_reader :image
  end
end