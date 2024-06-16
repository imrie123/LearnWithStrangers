require 'rails_helper'

RSpec.describe MessagesController, type: :request do
  let(:user) { create(:user) }
  let(:room) { create(:room, name: "Test Room") }
  let(:token) { "mock_token" }

  before do
    allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ "email" => user.email }])
    allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
    allow(FirebaseService).to receive(:fetch_firebase_public_keys).and_return({ "mock_key" => "mock_key_value" })
    allow(JWT).to receive(:decode).and_return([{ "email" => user.email }, { "kid" => "mock_key" }])
  end

  describe 'POST /rooms/:room_id/messages' do
    let(:valid_params) { { message: { content: 'Hello, world!' } } }
    let(:invalid_params) { { message: { content: '' } } }

    context '正常系' do
      it 'メッセージが作成される' do
        expect {
          post room_messages_path(room_id: room.id), params: valid_params, headers: { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' }
        }.to change(Message, :count).by(1)
        expect(response).to have_http_status(:created)
      end

      it '作成されたメッセージを返す' do
        post room_messages_path(room_id: room.id), params: valid_params, headers: { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' }
        response_body = JSON.parse(response.body)

        expect(response_body['content']).to eq('Hello, world!')
        expect(response_body['user']['id']).to eq(user.id)
        expect(response_body['user']['name']).to eq(user.name)
      end
    end

    context '異常系' do
      it 'メッセージを作成できなかった場合' do
        expect {
          post room_messages_path(room_id: room.id), params: invalid_params, headers: { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' }
        }.not_to change(Message, :count)
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'エラーを返す' do
        post room_messages_path(room_id: room.id), params: invalid_params, headers: { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' }
        response_body = JSON.parse(response.body)
        expect(response_body).to include("content")
      end
    end

    context 'ルームが存在しない場合' do
      it 'not foundを返す' do
        post room_messages_path(room_id: 'non_existent'), params: valid_params, headers: { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' }
        expect(response).to have_http_status(:not_found)
        expect(response.body).to include("Room not found")
      end
    end
  end
end