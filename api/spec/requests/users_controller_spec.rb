require "rails_helper"

RSpec.describe UsersController, type: :request do
  describe "POST /users" do
    subject { post '/users', params: params }

    let(:params) do
      {
        user: {
          email: email,
          password: password,
          name: name,
          custom_id: custom_id,
          birthday: birthday,
        }
      }
    end

    let(:sign_up_service) { instance_double(FirebaseService::SignUp) }

    before do
      allow(FirebaseService::SignUp).to receive(:new).with(email, password).and_return(sign_up_service)
      allow(sign_up_service).to receive(:call).and_return({ "idToken" => "mock_token" })
    end

    let(:email) { "nosiriee@example.com" }
    let(:password) { "password" }
    let(:name) { "nosiriee" }
    let(:custom_id) { "nosirie" }
    let(:birthday) { "1990-01-01" }

    context "正常系" do
      it "ユーザーが作成される" do
        expect { subject }.to change { User.count }.by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context "異常系" do
      context "Custom IDが既に存在する場合" do
        before { create(:user, custom_id: custom_id) }

        it "エラーが返る" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context "Firebaseのレスポンスがエラーの場合" do
        before do
          allow(sign_up_service).to receive(:call).and_return({ "error" => { "message" => "error" } })
        end

        it "エラーが返る" do
          subject
          expect(response).to have_http_status(:unauthorized)
          expect(response.body).to include("error")
        end
      end
    end
  end
end
