require 'rails_helper'

RSpec.describe GroupsMessagesController, type: :request do
  subject { post "/groups/#{group.id}/groups_messages", params: params, headers: headers }
  let(:group) { create(:group, owner: user) }
  let(:user) { create(:user) }
  let(:token) { "mock_token" }
  let(:headers) { { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' } }
  let(:params) do
    {
      groups_messages: {
        content: "test"
      }
    }
  end

  before do
    allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ "email" => user.email }])
    allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(user)
    allow(FirebaseService).to receive(:fetch_firebase_public_keys).and_return({ "mock_key" => "mock_key_value" })
    allow(JWT).to receive(:decode).and_return([{ "email" => user.email }, { "kid" => "mock_key" }])
  end

  describe 'POST /groups/:group_id/groups_messages' do
    context 'メッセージの作成が成功する場合' do
      it 'メッセージを作成する' do
        expect {
          subject
        }.to change(GroupsMessage, :count).by(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'メッセージの作成に失敗する場合' do
      let(:params) do
        {
          groups_messages: {
            content: ""
          }
        }
      end

      it 'メッセージの作成に失敗する' do
        expect {
          subject
        }.not_to change(GroupsMessage, :count)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to have_key('errors')
      end

      it 'エラーメッセージを返す' do
        subject
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)["errors"]).to include("Content can't be blank")
      end
    end

    context 'グループが存在しない場合' do
      subject { post "/groups/0/groups_messages", params: params, headers: headers }

      it 'メッセージの作成に失敗する' do
        expect {
          subject
        }.not_to change(GroupsMessage, :count)
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'トークンが存在しない場合' do
      let(:headers) { { 'Accept' => 'application/json' } }

      it 'メッセージの作成に失敗する' do
        expect {
          subject
        }.not_to change(GroupsMessage, :count)
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
