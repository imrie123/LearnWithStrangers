# app/serializers/post_serializer.rb

class PostSerializer < ActiveModel::Serializer
  attributes :id, :content, :image_url

  def image_url
    if object.image.attached?
      Rails.application.routes.url_helpers.rails_blob_url(object.image)
    end
  end
end
