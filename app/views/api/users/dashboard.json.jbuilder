json.extract! @user, :fname, :lname, :location, :hosting_status, :gender, :birthday, :created_at, :username, :id
json.trips @user.trips, :location, :description, :arrival_date, :departure_date, :num_guests, :id
json.pending_friends @user.pending_friends