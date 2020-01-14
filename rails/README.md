# README

* Ruby version
```
2.5.5
```
Rails version: 6.0.0

* System dependencies
```
brew install rbenv ruby-build
echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.bash_profile
source ~/.bash_profile
rbenv install 2.5.5
rbenv global 2.5.5
```

* Configuration
Install Postgres.app, with postgres v11
```
gem install bundler
bundle config build.pg --with-pg-config=/Applications/Postgres.app/Contents/Versions/11/bin/pg_config
bundle install
```

* Database
PostgresQL database. Use PSequel as a GUI.
If you haven't already,
```
sudo gem install rails
```
Local migration
```
rails db:migrate
```
Reset the db with
```
rails db:migrate:reset
```

CloudSQL migration (https://cloud.google.com/ruby/rails/using-cloudsql-postgres)
```
bundle exec rake appengine:exec -- bundle exec rake db:migrate
```
* Database initialization

* How to run the test suite
Run rubocop (linting)
```
rubocop -a
```

* Deployment instructions
```
gcloud app deploy
```

TODO:

milestone: get tb ready for real player test
 - ✅ better tooling to understand tag lineage (5 hrs)
 - get time spent creating each sample (~2 hrs)
  - BE: add time_elapsed column, and set it too (30 mins to test)
  - FE: add time elapsed counter to activities (30 mins)
  - FE: stop player if time < 0.5 seconds (60 mins)
  - FE: show these times in the tooling (10 mins)
- new actor onboarding (~3.5 hrs)
  - BE: add to response meta object the new actor flag (30 mins)
  - FE: have a new actor onboarding flow (with predefined answers + animations) (180 mins)
- add ui improvements (4.5 hrs)
  - FE: animation icon describing which side of bb to drag (180 minutes)
    https://blog.thenounproject.com/how-to-create-animated-gif-with-icons-a9eb757948b3
  - FE: an actual help screen under the '?' button (60 minutes)
  - FE: don't allow impossibly small boxes (30 minutes)
- set up dataset (2 hrs)
  - DS: fuck open images extended, just relabel open images for now. load that up and dump it into the db (120 minutes)
- get game ready (8.5 hrs)
  - verify integration still work with psycho taxi (30 minutes)
  - change to the toon shader maybe? (120 minutes)
  - maybe make an iso-view version of it (300 minutes)
  - tap to jump? (60 minutes)

TOTAL: 20.5 hrs remaining


GET    /items        #=> index
GET    /items/1      #=> show
PUT    /items/1      #=> update
POST   /items        #=> create
DELETE /items/1      #=> destroy

read
http://apionrails.icalialabs.com/book/chapter_two
