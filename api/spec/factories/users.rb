FactoryBot.define do
  factory :user do
    id { |n| n }
    email { |n| Faker::Internet.email }
    password { |n| Faker::Internet.password(min_length: 8)}
    name { |n| Faker::Name.name}
    custom_id { |n| Faker::Name.name}
    birthday { |n| Faker::Date.birthday(min_age: 18, max_age: 65) }
  end
end