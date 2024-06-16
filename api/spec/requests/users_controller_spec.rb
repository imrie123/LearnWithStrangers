require "rails_helper"

RSpec.describe UsersController, type: :request do
  before do
    allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ "email" => "nosiriee@example.com" }])
    allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(create(:user, email: "nosiriee@example.com"))
  end

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
    let(:email) { Faker::Internet.unique.email }
    let(:password) { "password" }
    let(:name) { "nosiriee" }
    let(:custom_id) { Faker::Internet.unique.username(specifier: 8) }
    let(:birthday) { "1990-01-01" }

    context "正常系" do
      it "ユーザーが作成される" do
        expect { subject }.to change { User.count }.by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context "異常系" do
      context "custom_idが重複している場合" do
        before { create(:user, custom_id: custom_id) }

        it "custom_idが重複している場合エラーが発生する" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response.body).to include("Custom id has already been taken")
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
    subject { post '/users/sign_in', params: params }
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
    let(:email) { Faker::Internet.unique.email }
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
        before do
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

  describe "POST /users/sign_out" do
    subject { post '/users/sign_out' }
    context "正常系" do
      it "ログアウトできる" do
        subject
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET /users/:custom_id" do
    subject { get "/users/#{custom_id}" }
    let(:custom_id) { "nosirie" }
    context "正常系" do
      before { create(:user, custom_id: custom_id) }
      it "ユーザー情報が取得できる" do
        subject
        expect(response).to have_http_status(:ok)
      end
    end
    context "異常系" do
      it "ユーザーが存在しない場合" do
        subject
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe "POST /users/update" do
    subject { post '/users/update', params: params, headers: headers }
    let(:token) { "mock_token" }
    let(:headers) { { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }
    let(:params) do
      {
        user: {
          name: "Updated Name",
          spoken_language: "Updated Spoken Language",
          learning_language: "Updated Learning Language",
          residence: "Updated Residence",
          introduction: "Updated Introduction",
        }
      }
    end
    context "正常系" do
      before do
        allow_any_instance_of(UsersController).to receive(:verify_firebase_token).and_return([{ "email" => current_user.email }])
      end
      it "ユーザー情報が更新できる" do
        expect { subject }.to change { current_user.reload.name }.to("Updated Name")
                                                                 .and change { current_user.reload.spoken_language }.to("Updated Spoken Language")
                                                                                                                    .and change { current_user.reload.learning_language }.to("Updated Learning Language")
                                                                                                                                                                         .and change { current_user.reload.introduction }.to("Updated Introduction")
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "POST /users/avatar" do
    subject { post '/users/avatar', params: params, headers: headers }
    let(:token) { "mock_token" }
    let(:headers) { { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }
    let(:params) do
      {
        user: {
          avatar: fixture_file_upload('files/avatar.jpg', 'image/jpg')
        }
      }
    end
    context "正常系" do
      before do
        allow_any_instance_of(UsersController).to receive(:verify_firebase_token).and_return([{ "email" => current_user.email }])
      end
      it "プロフィール画像が更新される" do
        expect { subject }.to change { current_user.reload.avatar.attached? }.from(false).to(true)
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "GET /users/me" do
    subject { get "/users/me", headers: headers }
    let(:token) { "mock_token" }
    let(:headers) { { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }

    describe "GET /users/me" do
      subject { get "/users/me", headers: headers }
      let(:token) { "mock_token" }
      let(:headers) { { 'Authorization' => "Bearer #{token}", 'Accept' => 'application/json' } }
      let(:current_user) { create(:user) }

      context "正常系" do
        before do
          allow_any_instance_of(UsersController).to receive(:verify_firebase_token).and_return([{ "email" => current_user.email }])
        end
        it "自分の情報が取得できる" do
          subject
          expect(response).to have_http_status(:ok)
        end
      end

      context "異常系" do
        it "トークンがない場合" do
          get "/users/me", headers: { 'Accept' => 'application/json' }
          expect(response).to have_http_status(:unauthorized)
          expect(response.body).to include("Token missing")
        end
      end
    end
  end

  describe "GET /users/random" do
    before do
      create_list(:user, 5)
    end
    it "returns a success response" do
      get '/users/random', as: :json
      expect(response).to have_http_status(:ok)
    end
    it "returns all users" do
      get '/users/random', as: :json
      json_response = JSON.parse(response.body)
      expect(json_response.size).to eq(User.count)
    end
  end

  describe "GET /users/search" do
    subject { get '/users/search', params: params }
    let(:params) { { query: query, criteria: criteria } }
    let(:criteria) { 'name' }
    context "正常系" do
      let(:query) { 'test' }
      before do
        create(:user, name: 'test')
        create(:user, name: 'test')
      end
      it "検索結果が返る" do
        subject
        expect(response).to have_http_status(:ok)
      end
    end
    context '異常系' do
      let(:query) { '' }
      it 'エラーが返る' do
        subject
        expect(response).to have_http_status(:not_found)
        expect(response.body).to include("Query parameter is missing")
      end
    end
  end
end
