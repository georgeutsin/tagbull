# README

You're gonna need the right ruby, rails, and postgres version for this bad boi.

* Ruby version
```
2.5.5
```
Rails version:
```
6.0.0
```

* Installation
```
brew install rbenv ruby-build

# IF USING BASH
echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.bash_profile
source ~/.bash_profile

# IF USING ZSH
echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.zshrc
source ~/.zshrc

rbenv install 2.5.5
rbenv global 2.5.5
```

* Configuration
Install Postgres.app (https://postgresapp.com/downloads.html), with Postgres 11
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

load the local sample data into your postgres database
```
psql -d tagbull_rails_development -a -f sample_data.sql
```

CloudSQL migration (https://cloud.google.com/ruby/rails/using-cloudsql-postgres)
```
bundle exec rake appengine:exec -- bundle exec rake db:migrate
```
* Database initialization

* How to run the test suite
Run rubocop (linting)
```
gem install rubocop
rubocop -a
```

In the root directory of the tagbull project, run 

```
echo 'rubocop -a' >> .git/hooks/pre-commit
```

to setup automatic pre-commit hooks.

* Deployment instructions
```
gcloud app deploy
```
