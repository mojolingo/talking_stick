# TalkingStick

This gem provides basic [WebRTC](https://webrtc.org) communication in any Rails app.


## Goals

* Provide easy group-based (2 or more participants) audio/video communication
* Allow selecting audio or audio+video
* Pluggable signaling delivery technology
* Plug & Play functionality - works out of the box

## Limitations

1. Only works with a single Rails process
This is due to the default push technology of Server Sent Events. Each client is connected to the Rails server persistently and is listening for events about the room to which it is subscribed. If you have two Rails servers, there's no way to know which server has a given client's SSE connection. To work around this limitation, you will need to replace the default push mechanism with something that scales better.


## How it works

* Each group is assigned a unique ID
* Rails app keeps track of participants in each room
* Rails app notifies all room participants when one joins or leaves
* Rails app proxies call setup between participants in each room

## The Name

The [Talking Stick] is a tradition among Native American (and other) cultures which specifies a simple yet effective way for facilitating group conversations. For more, see the [Wikipedia Article](https://en.wikipedia.org/wiki/Talking_stick), or this insightful blog post by [Rich Goidel](http://www.dangerouskitchen.com/shut-up-and-listen/).

## Credits & Copyright

* Original author: [Ben Klang](https://twitter.com/bklang), [Mojo Lingo LLC](https://mojolingo.com)

This project is licensed under the MIT License. This project incorporates [Adapter.js from the WebRTC.org team](https://github.com/webrtc/adapter), which is licensed under the Apache license.

Copyright 2015 Mojo Lingo LLC
Portions copyright 2014 The WebRTC project authors
