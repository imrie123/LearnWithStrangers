FactoryBot.define do
  factory :post do
    sequence(:content) { |n| "MyText #{n}" }
    association :user

    trait :with_image do
      after(:build) do |post|
        post.image.attach(
          io: File.open(Rails.root.join('spec', 'files', 'test_image.jpg')),
          filename: 'test_image.jpg',
          content_type: 'image/jpeg'
        )
      end
    end
  end
end