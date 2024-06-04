FactoryBot.define do
  factory :bulletin do

    title { "Sample Title" }
    content { "Sample Content" }
    association :user, factory: :user
  end
end