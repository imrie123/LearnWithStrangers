require 'rails_helper'

RSpec.describe PostsController, type: :request do
  describe "POST /posts" do
    subject { post '/posts', params: params, headers: headers }
    let(:token) { "mock_token" }
    let(:headers) { { "Authorization" => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }
    let(:image_path) { Rails.root.join('spec', 'fixtures', 'files', 'test_image.jpg') }
    let(:image_file) { fixture_file_upload(image_path, 'image/jpeg') }
    let(:params) do
      {
        post: {
          content: content,
          image: image
        }
      }
    end

    before do
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(current_user)
      allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ 'email' => current_user.email }])
    end

    context "正常系" do
      let(:content) { "post_content" }

      context "with image" do
        let(:image) { image_file }

        it "投稿が作成される" do
          expect { subject }.to change { Post.count }.by(1)
          expect(response).to have_http_status(:ok)
          expect(response_body).to include(
                                     'id' => current_user.id,
                                     'post_id' => Post.last.id,
                                     'content' => 'post_content',
                                     'image_url' => Post.last.image_url
                                   )
        end

        it "画像がアタッチされている" do
          subject
          expect(Post.last.image).to be_attached
        end
      end

      context "画像が添付されていない場合" do
        let(:image) { nil }

        it "投稿が作成される" do
          expect { subject }.to change { Post.count }.by(1)
          expect(response).to have_http_status(:ok)
          expect(response_body).to include(
                                     'id' => current_user.id,
                                     'post_id' => Post.last.id,
                                     'content' => 'post_content'
                                   )
        end
      end
    end

    context "異常系" do
      let(:image) { image_file }

      context "投稿が作成できない場合" do
        let(:content) { "post_content" }

        before do
          allow_any_instance_of(Post).to receive(:save).and_return(false)
          allow_any_instance_of(Post).to receive(:errors).and_return(errors_object)
        end

        let(:errors_object) { instance_double(ActiveModel::Errors, full_messages: ["Post creation failed"]) }

        it "エラーが返る" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response_body['errors']).to include("Post creation failed")
        end
      end

      context "認証エラーの場合" do
        let(:headers) { { 'Accept' => 'application/json' } }
        let(:content) { "post_content" }

        before do
          allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(nil)
        end

        it "エラーが返る" do
          expect { subject }.not_to change { Post.count }
          expect(response).to have_http_status(:unauthorized)
          expect(response_body).to include("error" => "Unauthorized")
        end
      end

      context "contentがない場合" do
        let(:content) { nil }

        it "エラーが返る" do
          expect { subject }.not_to change { Post.count }
          expect(response).to have_http_status(:unprocessable_entity)
          expect(response_body['errors']).to include("Content can't be blank")
        end
      end
    end
  end

  describe "GET /posts" do
    subject { get '/posts', headers: headers }
    let(:token) { "mock_token" }
    let(:headers) { { "Authorization" => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }

    before do
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(current_user)
      allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ 'email' => current_user.email }])
      create_list(:post, 3, user: current_user)
    end

    it "ユーザーの投稿が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(response_body['posts'].size).to eq(3)
    end

    context "認証エラーの場合" do
      let(:headers) { { 'Accept' => 'application/json' } }

      before do
        allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(nil)
      end

      it "エラーが返る" do
        subject
        expect(response).to have_http_status(:unauthorized)
        expect(response_body).to include("error" => "Unauthorized")
      end
    end
  end

  describe "DELETE /posts/:id" do
    subject { delete "/posts/#{post_id}", headers: headers }
    let(:token) { "mock_token" }
    let(:headers) { { "Authorization" => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }
    let!(:post) { create(:post, user: current_user) }
    let(:post_id) { post.id }

    before do
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(current_user)
      allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ 'email' => current_user.email }])
    end

    it "投稿が削除される" do
      expect { subject }.to change { Post.count }.by(-1)
      expect(response).to have_http_status(:ok)
      expect(response_body).to include("message" => "Post deleted")
    end

    context "投稿が見つからない場合" do
      let(:post_id) { -1 }

      it "エラーが返る" do
        expect { subject }.not_to change { Post.count }
        expect(response).to have_http_status(:not_found)
        expect(response_body).to include("error" => "Post not found")
      end
    end

    context "認証エラーの場合" do
      let(:headers) { { 'Accept' => 'application/json' } }

      before do
        allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(nil)
      end

      it "エラーが返る" do
        expect { subject }.not_to change { Post.count }
        expect(response).to have_http_status(:unauthorized)
        expect(response_body).to include("error" => "Unauthorized")
      end
    end
  end

  describe "GET /users/:custom_id/posts" do
    subject { get "/users/#{user.custom_id}/posts", headers: headers }
    let(:token) { "mock_token" }
    let(:headers) { { "Authorization" => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }
    let(:user) { create(:user) }

    before do
      create_list(:post, 2, user: user)
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(current_user)
      allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ 'email' => current_user.email }])
    end

    it "指定したユーザーの投稿が返る" do
      subject
      expect(response).to have_http_status(:ok)
      expect(response_body['posts'].size).to eq(2)
    end

    context "ユーザーが見つからない場合" do
      before { user.destroy }

      it "エラーが返る" do
        subject
        expect(response).to have_http_status(:not_found)
        expect(response_body).to include("error" => "User not found")
      end
    end
  end

  def response_body
    JSON.parse(response.body)
  end
end