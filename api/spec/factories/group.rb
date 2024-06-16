FactoryBot.define do
  factory :group do
    name { "MyString" }
    introduction { "MyText" }
    owner { association :user }
  end
end