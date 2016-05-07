# TalkingStick

This gem provides easy [WebRTC](https://webrtc.org) communication in any Rails app.


## Goals

* Provide easy group-based (2 or more participants) audio/video communication
* Allow selecting audio or audio+video
* Pluggable signaling delivery technology
* Plug & Play functionality - works out of the box
* Focus on simplicity at the API level, while maximizing the possibilities of integrating communication into existing Rails apps

## Installation

Note that TalkingStick requires jQuery, and installs [jquery-rails gem](https://github.com/rails/jquery-rails) as a dependency.

TalkingStick is built as a Rails Engine, and so follows those conventions.

1. Add to Gemfile and update the bundle

    ```Ruby
    gem 'talking_stick'
    ```

    Now run `bundle install` to download and install the gem.
2. Mount the engine
    Add the following to your application's `config/routes.rb`:

    ```Ruby
    mount TalkingStick::Engine, at: '/talking_stick'
    ```
3. Install and Run migration
    To add the required models to your application, the migrations must be copied and run:
    ```
    $ rake railties:install:migrations db:migrate
    ```

4. Import Assets
    Add the following to your application's `assets/javascripts/application.js`:

    ```javascript
    //= require talking_stick/application
    ```

    And the following to your application's `assets/stylesheets/application.scss`:

    ```css
    *= require talking_stick/application
    ```

5. **[optional]** Generate the default `participant` and `room` views which are then available for customization.  From your app's root directory:

   ```
   $ rails generate talking_stick:views
   ```

6. Videconference!
    After booting Rails, point your browser to something like [http://localhost:3000/talking_stick/rooms](http://localhost:3000/talking_stick/rooms). From there you will be able to create and join rooms.

For a better experience, we recommend also using [Bootstrap](http://getbootstrap.com). Easy installation of Bootstrap into Rails is available via [twitter-bootstrap-rails](https://github.com/seyhunak/twitter-bootstrap-rails).

## How it works

* Each room is assigned a unique ID
* Rails app keeps track of participants in each room
* Rails app notifies all room participants when one joins or leaves
* Rails app proxies call setup between participants in each room

## Extending TalkingStick

### Providing your own signaling mechanism

One of the critical decisions made by the standards bodies behind WebRTC was a decision to leave the signaling of WebRTC up to the application. This means that an application may use any means it desires to give the endpoints the data necessary to communicate directly.

This plugin tries to be "batteries included", which means that we included a signaling mechanism that will work on any Rails server. As such, we could not rely on any particular push technology, such as Websockets or Server Sent Events. Thus, the default behavior is that the browser polls the Rails API for updates on connected peers. This works fine for small user bases, but obviously will not scale well.

### Want help designing and deploying an efficient, scalable signaling mechanism for your application?
[Contact Mojo Lingo](https://mojolingo.com/connect) today! As authors of this Gem, Mojo Lingo are experts in Real-Time Communications Applications. We can help you get the most value out of WebRTC by integrating communications into your application and business processes, and scale it to very large groups. [Learn more.](https://mojolingo.com)


### Building Your Own Signaling Engine

Alternatively, you can build your own by passing a "Signaling Engine" to the TalkingStick class.

The [reference Signaling Engine](https://github.com/mojolingo/talking_stick/blob/master/app/assets/javascripts/talking_stick/talking_stick/rails_signaling.js) periodically polls the Rails API for signals, but can be replaced with any API-compatible implementation, including Websockets, XMPP, or anything else you like.

The Signaling Engine must implement the following methods. For each method where `guid` is specified, it represents the ID of the remote participant to which the information must be sent.

* `connected`: Takes no parameters. Is called after the user's media is set up and the participant is registered to the room.
* `sendICECandidate(guid, candidate)`: The second parameter is the ICE candidate. Called each time a new local ICE candidate is discovered by the browser. This must be sent to the remote participant.
* `iceCandidateGatheringComplete(guid, candidates)`: Called when all ICE candidates have been gathered. This can be used in place of `sendICECandidate` to send all candidates at once, rather than trickling them in one-by-one (though trickling is generally a better user experience).
* `sendOffer(guid, offer)`: Called when the local browser wants to initiate an offer to a remote party.
* `sendAnswer(guid, answer)`: Called when the local browser wants to respond to a received offer.

The Signaling Engine will also need to use the following methods to add new Partners to the conversation:

* `TalkingStick.addPartner(partner)`

```javascript
var partner = {
  guid: 'GloballyUniqueIdentifierForThisParter-Session',
  joined_at: Date
}
```

The `guid` should be unique not only for the remote participant, but also his connection into this session. If a single participant were to join two different rooms on the same server (for example), he would need two separate GUIDs, one for each room.

The `joined_at` field signifies the date & time that the remote Participant joined the room. It is important that the `joined_at` Date object be provided by the remote party to avoid race conditions. The `joined_at` field is used internally by TalkingStick to manage the sequence of offers & answers.

This function returns an instance of `TalkingStick.Partner`.

* `TalkingStick.Partner.handleOffer(offer)` Pass in offer received from a Partner
* `TalkingStick.Partner.handleAnswer(answer)` Pass in an answer received from a Partner
* `TalkingStick.Partner.handleRemoteICECandidate(RTCIceCandidate)` Pass in ICE candidates received from remote Partners


### Additional Methods

* `TalkingStick.parters` The collection of `TalkingStick.Partners` to whom the local session is currently connected. Treat it as read-only.
* `TalkingStick.log(level, obj[, obj ...])` Allows messages to be conditionally logged to the console. Valid levels are strings, and may be one of `trace`, `debug`, `notice`, `warning`, or `error`.

### Events

* `talking_stick.local_media_setup`: (no arguments) Triggered after local media has been initialized and drawn to the configured element
* TODO: Document the rest of the events

## TODO

See the [Pivotal Tracker story board](https://www.pivotaltracker.com/n/projects/1343190).  Contributions welcome!

## The Name

The Talking Stick is a tradition among Native American (and other) cultures which specifies a simple yet effective way for facilitating group conversations. For more, see the [Wikipedia Article](https://en.wikipedia.org/wiki/Talking_stick), or this insightful blog post by [Rich Goidel](http://www.dangerouskitchen.com/shut-up-and-listen/).

## Credits & Copyright

* Original author: [Ben Klang](https://twitter.com/bklang), [Mojo Lingo LLC](https://mojolingo.com)

This project is licensed under the MIT License. This project incorporates [Adapter.js from the WebRTC.org team](https://github.com/webrtc/adapter), which is licensed under the Apache license.

Copyright 2015-2016 Mojo Lingo LLC

Portions copyright 2014-2016 The WebRTC project authors

[Flikr2005](https://www.flickr.com/photos/flikr/371850310/) loading image courtesy Flickr user [Flikr](https://www.flickr.com/photos/flikr/)
