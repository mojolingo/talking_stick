# TalkingStick

This gem provides basic [WebRTC](https://webrtc.org) communication in any Rails app.


## Goals

* Provide easy group-based (2 or more participants) audio/video communication
* Allow selecting audio or audio+video
* Pluggable signaling delivery technology
* Plug & Play functionality - works out of the box
* Focus on simplicity at the API level, while maximizing the possibilites of integrating communication into existing Rails apps

## Installation

Note that TalkingStick requires jQuery, and installs [jquery-rails gem](https://github.com/rails/jquery-rails) as a dependency.

TalkingStick is built as a Rails Engine, and so follows those conventions.

1. Add to Gemfile and update bundle
```Ruby
gem 'talking_stick'
```

Now run `bundle install` to download the gem.

2. Mount the engine
Add the following to your application's `config/routes.rb`:
```Ruby
mount TalkingStick::Engine, at: '/talking_stick'
```

3. Install and Run migrations
To add the required models to your application, the migrations must be copied and run:
```
$ rake railties:install:migrations db:migrate
```

## How it works

* Each group is assigned a unique ID
* Rails app keeps track of participants in each room
* Rails app notifies all room participants when one joins or leaves
* Rails app proxies call setup between participants in each room

## TODO

* Add rake task to copy view files to app for easy overriding

## The Name

The [Talking Stick] is a tradition among Native American (and other) cultures which specifies a simple yet effective way for facilitating group conversations. For more, see the [Wikipedia Article](https://en.wikipedia.org/wiki/Talking_stick), or this insightful blog post by [Rich Goidel](http://www.dangerouskitchen.com/shut-up-and-listen/).

## Credits & Copyright

* Original author: [Ben Klang](https://twitter.com/bklang), [Mojo Lingo LLC](https://mojolingo.com)

This project is licensed under the MIT License. This project incorporates [Adapter.js from the WebRTC.org team](https://github.com/webrtc/adapter), which is licensed under the Apache license.

Copyright 2015 Mojo Lingo LLC
Portions copyright 2014 The WebRTC project authors
