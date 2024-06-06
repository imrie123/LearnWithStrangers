FactoryBot.define do
  factory :user do
    sequence(:id) { |n| n }
    email { Faker::Internet.unique.email }
    password { Faker::Internet.password(min_length: 8) }
    name { Faker::Name.name }
    sequence(:custom_id) { |n| "custom_id_#{n}" }
    birthday { Faker::Date.birthday(min_age: 18, max_age: 65) }
  end

  factory :current_user, class: User do
    email { Faker::Internet.unique.email }
    password { Faker::Internet.password(min_length: 8) }
    name { Faker::Name.name }
    sequence(:custom_id) { |n| "custom_id_#{n}" }
    birthday { Faker::Date.birthday(min_age: 18, max_age: 65) }
  end
end