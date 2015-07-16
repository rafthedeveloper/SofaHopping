# == Schema Information
#
# Table name: references
#
#  id           :integer          not null, primary key
#  referencer   :integer          not null
#  referencee   :integer          not null
#  relationship :string           not null
#  experience   :string           not null
#  description  :text             not null
#  created_at   :datetime
#  updated_at   :datetime
#

class Reference < ActiveRecord::Base
  validates :referencer_id, :referencee_id, :relationship, :experience,
            :description, presence: true

  belongs_to :referencee,
    class_name: "User",
    foreign_key: :referencee_id,
    primary_key: :id
end