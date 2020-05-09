# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version
2.6.6 -- via file ./.ruby-version

## App Installation (do on wifi with sso disconnection)

- rvm install "ruby-2.6.6"
- gem install bundler:2.1.4
- bundle install
- brew install yarn
- nvm use erbium (this is important -- won't work with node 13 - erbium is latest on node 12)
- yarn install --check-files

If the yarn issue persists,
go to config/environments/development.rb
and add this line in this file 
config.webpacker.check_yarn_integrity = false

Realtime updates for frontend
- run `bin/webpack-dev-server` in a separate terminal tab to catch changes to views and css/js etc


After setting up, do
rake db:migrate
to run all migrations

## ElasticSearch Installation

- `brew cask install homebrew/cask-versions/adoptopenjdk8`
- `brew install elasticsearch`

## ElasticSearch Seeding
in rails console for dev environment do
- `Video.reindex` after seeding the sqlite db

## Running the App
- `foreman start` in terminal

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