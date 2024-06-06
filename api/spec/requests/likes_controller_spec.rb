require 'rails_helper'

RSpec.describe LikesController, type: :request do
  subject { post "/users/#{user.custom_id}/posts/#{post_record.id}/likes", params: params, headers: headers }
  let(:user) { create(:user, custom_id: "testuser") }
  let(:post_record) { create(:post, user: user) }
  let(:token) { "mock_token" }
  let(:headers) { { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' } }
  let(:params) do
    {
      like: {
        user_id: user.id,
        post_id: post_record.id
      }
    }
  end

  before do
    allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ "email" => user.email }])
    allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
    allow(FirebaseService).to receive(:fetch_firebase_public_keys).and_return({ "mock_key" => "mock_key_value" })
    allow(JWT).to receive(:decode).and_return([{ "email" => user.email }, { "kid" => "mock_key" }])
  end

  describe 'POST /users/:custom_id/posts/:post_id/likes' do
    it 'いいねを作成する' do
      expect {
        subject
      }.to change(Like, :count).by(1)
      expect(response).to have_http_status(:created)
    end

context '投稿が見つからない時' do
      it 'not foundを返す' do
        post "/users/#{user.custom_id}/posts/0/likes", params: params, headers: headers
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq("Post not found")
      end
end
  end

  describe 'DELETE /users/:custom_id/posts/:post_id/likes/:id' do
    context 'いいねが見つからない場合' do
      it 'not foundを返す' do
        delete "/users/#{user.custom_id}/posts/#{post_record.id}/likes/0", headers: headers
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq("Like not found")
      end

      it 'いいねを削除する' do
        like = create(:like, user: user, post: post_record)
        expect {
          delete "/users/#{user.custom_id}/posts/#{post_record.id}/likes/#{like.id}", headers: headers
        }.to change(Like, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
