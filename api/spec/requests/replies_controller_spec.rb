require 'rails_helper'

RSpec.describe RepliesController, type: :request do
  describe "POST /bulletin/:bulletin_id/replies" do
    subject { post "/bulletin/#{bulletin_id}/replies", params: params, headers: headers }
    let(:token) { "mock_token" }
    let(:headers) { { "Authorization" => "Bearer #{token}", 'Accept' => 'application/json' } }
    let(:current_user) { create(:user) }
    let(:bulletin) { create(:bulletin) }
    let(:bulletin_id) { bulletin.id }
    let(:params) do
      {
        reply: {
          content: content,
          bulletin_id: bulletin_id
        }
      }
    end
    let(:content) { "reply_content" }

    before do
      allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(current_user)
      allow_any_instance_of(ApplicationController).to receive(:verify_firebase_token).and_return([{ 'email' => current_user.email }])
    end

    context "正常系" do
      it "リプライが作成される" do
        expect { subject }.to change { Reply.count }.by(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context "異常系" do
      context "リプライが作成できない場合" do
        before do
          allow_any_instance_of(Reply).to receive(:save).and_return(false)
          allow_any_instance_of(Reply).to receive(:errors).and_return(errors_object)
        end

        let(:errors_object) { instance_double(ActiveModel::Errors, full_messages: ["Reply creation failed"]) }

        it "エラーが返る" do
          subject
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end
end