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

      context 'emailが既に存在する場合' do
        before { create(:user, email: email) }

        it 'エラーが返る' do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context 'passwordが空の場合' do
        let(:password) { '' }

        it 'エラーが返る' do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context 'nameが空の場合' do
        let(:name) { '' }

        it 'エラーが返る' do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context 'custom_idが空の場合' do
        let(:custom_id) { '' }

        it 'エラーが返る' do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
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

  describe "POST /users/sign_in" do
    subject { post '/users/sign_in', params: params}

    let(:params) do
      {
        user: {
          email: email,
          password: password
        }
      }
    end

    let(:sign_in_service) { instance_double(FirebaseService::SignIn) }

    before do
      allow(FirebaseService::SignIn).to receive(:new).with(email, password).and_return(sign_in_service)
      allow(sign_in_service).to receive(:call).and_return({ "idToken" => "mock_token" })
    end
    let(:email) { "nosiriee@example.com" }
    let(:password) { "password" }

    context "正常系" do
      before { create(:user, email: email, password: password) }

      it "ログインできる" do
        subject
        expect(response).to have_http_status(:ok)
      end

      it "トークンが返る" do
        subject
        expect(response.body).to include("mock_token")
      end
    end

    context "異常系" do
      context "emailが存在しない場合" do
        before  do
          allow(FirebaseService::SignIn).to receive(:new).with(email, password).and_return(sign_in_service)
          allow(sign_in_service).to receive(:call).and_return({ "error" => { "message" => "error" } })
        end
        it "エラーが返る" do
          subject
          expect(response).to have_http_status(:unauthorized)
        end
      end

      context "passwordが間違っている場合" do
        before do
          allow(FirebaseService::SignIn).to receive(:new).with(email, password).and_return(sign_in_service)
          allow(sign_in_service).to receive(:call).and_return({ "error" => { "message" => "error" } })
        end

        it "エラーが返る" do
          subject
          expect(response).to have_http_status(:unauthorized)
        end
      end

      context "Firebaseのレスポンスがエラーの場合" do
        before do
          allow(sign_in_service).to receive(:call).and_return({ "error" => { "message" => "error" } })
        end

        it "エラーが返る" do
          subject
          expect(response).to have_http_status(:unauthorized)
          expect(response.body).to include("error")
        end
      end
    end
  end
  describe  "POST /users/sign_out" do
    subject { post '/users/sign_out'}

    context "正常系" do
      it "ログアウトできる" do
        subject
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET /" do

  end
end
