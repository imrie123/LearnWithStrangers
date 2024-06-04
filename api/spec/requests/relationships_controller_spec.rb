require 'rails_helper'

RSpec.describe RelationshipsController, type: :request do
  describe "POST /users/:custom_id/relationships" do
    subject { post "/users/#{custom_id}/relationships", headers: headers, params: params }
    let(:token) { "mock_token" }
    let(:headers) { { "Authorization" => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }
    let(:user_to_follow) { create(:user) }
    let(:custom_id) { user_to_follow.custom_id }
    let(:params) { { custom_id: custom_id } }

    before do
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(current_user)
      allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ 'email' => current_user.email }])
      allow_any_instance_of(ApplicationController).to receive(:verify_token).and_return(true)
    end

    context "ユーザーがまだフォローしていない場合" do
      before { allow(current_user).to receive(:following?).with(user_to_follow).and_return(false) }

      it "ユーザーをフォローし、ステータスを :created で返す" do
        expect(current_user).to receive(:follow).with(user_to_follow)
        subject
        expect(response).to have_http_status(:created)
      end
    end

    context "ユーザーがすでにフォローしている場合" do
      before { allow(current_user).to receive(:following?).with(user_to_follow).and_return(true) }

      it "ユーザーをフォローせず、ステータスを :not_found で返す" do
        expect(current_user).not_to receive(:follow)
        subject
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "DELETE /users/:custom_id/relationships" do
    subject { delete "/users/#{custom_id}/relationships", headers: headers, params: params }
    let(:token) { "mock_token" }
    let(:headers) { { "Authorization" => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }
    let(:user_to_unfollow) { create(:user) }
    let(:custom_id) { user_to_unfollow.custom_id }
    let(:params) { { custom_id: custom_id } }

    before do
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(current_user)
      allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ 'email' => current_user.email }])
      allow_any_instance_of(ApplicationController).to receive(:verify_token).and_return(true)
    end

    context "ユーザーがフォローしている場合" do
      before { allow(current_user).to receive(:following?).with(user_to_unfollow).and_return(true) }

      it "ユーザーのフォローを解除し、ステータスを :ok で返す" do
        expect(current_user).to receive(:unfollow).with(user_to_unfollow)
        subject
        expect(response).to have_http_status(:ok)
      end
    end

    context "ユーザーがフォローしていない場合" do
      before { allow(current_user).to receive(:following?).with(user_to_unfollow).and_return(false) }

      it "ユーザーのフォローを解除せず、ステータスを :not_found で返す" do
        expect(current_user).not_to receive(:unfollow)
        subject
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
