# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version
2.6.6 -- via file ./.ruby-version

Installation (do on wifi with sso disconnection)

- rvm install "ruby-2.6.6"
- gem install bundler:2.1.4
- bundle install
- brew install yarn
- nvm install 12.6.0
- nvm use 12
- yarn install --check-files

If the yarn issue persists,
go to config/environments/development.rb
and add this line in this file 
config.webpacker.check_yarn_integrity = false


After setting up, do
rake db:migrate
to run all migrations

## ToDo

- SQL setup for ActiveRecord
- ElasticSearch config
- Models
- Controllers (sambit)
- Routes
- Views
- Upload functionality

## Commands
To migrate the data into the database

`rake db:migrate`

To populate the data in sqlite database run

`rake db:seed`