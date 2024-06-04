require 'rails_helper'

RSpec.describe RoomsController, type: :request do
  describe "POST /users/:custom_id/rooms" do
    subject { post "/users/#{custom_id}/rooms", headers: headers }
    let(:token) { "mock_token" }
    let(:headers) { { "Authorization" => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }
    let(:user) { create(:user, custom_id: 'test_custom_id') }
    let(:custom_id) { user.custom_id }

    before do
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(current_user)
      allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ 'email' => current_user.email }])
    end

    context "正常系" do
      let!(:existing_room) { create(:room, name: 'Existing_room') }

      before do
        allow(current_user).to receive(:common_room_with).with(user).and_return(existing_room)
      end

      it "既存のルームが返る" do
        subject
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)["id"]).to eq existing_room.id
      end
    end

    context "異常系" do
      context "ユーザーが存在しない場合" do
        let(:custom_id) { "not_found" }

        it "エラーが返る" do
          subject
          expect(response).to have_http_status(:not_found)
        end
      end

      context "新しいルームが作成できない場合" do
        before do
          allow_any_instance_of(Room).to receive(:save).and_return(false)
          allow_any_instance_of(Room).to receive(:errors).and_return(errors_object)
        end

        let(:errors_object) { instance_double(ActiveModel::Errors, full_messages: ["Room creation failed"]) }

        it "エラーが返る" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end
end
