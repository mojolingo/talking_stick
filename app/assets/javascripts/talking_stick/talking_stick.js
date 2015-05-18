var TalkingStick = (function(self) {
  self.guid         = undefined;
  self.myStream     = undefined;
  self.joinedAt     = undefined;
  self._options = {
    media: { audio: true, video: true },
    localVideo: undefined, // Set this to the DOM element where video should be rendered
    logLevel: 'error',
    iceServers: [],
  };

  self.logLevels = [
    'trace',
    'debug',
    'notice',
    'warning',
    'error',
  ];

  self.init = function(options) {
    $.extend(self._options, options);

    self.logLevelIdx = self.logLevels.indexOf(self._options.logLevel);
    self.partners = {};
    self.guid = self._options.guid || self.generateGUID();
    self.localVideo = $(self._options.localVideo);
    self.signalingEngine = self._options.signalingEngine;
    self.setupLocalVideo();
    self.log('notice', 'TalkingStick initialized.');
  };

  self.log = function() {
    var level = arguments[0];
    var levelIdx = self.logLevels.indexOf(level);
    if (levelIdx >= self.logLevelIdx) {
      var args = Array.prototype.slice.call(arguments, 1);
      args.unshift('[' + level + ']');
      switch(levelIdx) {
      case 4:
        console.error.apply(console, args);
        break;
      case 3:
        console.warn.apply(console, args);
        break;
      default:
        console.log.apply(console, args);
        break;
      }
    }
  }

  self.trigger = function(name) {
    name = 'talking_stick.' + name;
    args = Array.prototype.slice.call(arguments, 1);
    // Syntactic sugar: make it easy to pass a list of args as the only argument
    // This is the "right way" per
    // http://stackoverflow.com/questions/4775722/check-if-object-is-array
    if (args.length == 1 && Object.prototype.toString.call(args[0]) === '[object Array]') {
      args = args[0];
    }
    self.localVideo.trigger(name, args);
  }

  self.setupLocalVideo = function() {
    self.prepareVideoElement(self.localVideo);

    self.log('debug', 'Requesting user consent to access to input devices');
    navigator.getUserMedia(self._options.media, function(stream) {
      self.log('debug', 'User has granted access to input devices');
      self.myStream = stream;

      // The JS API requires the raw DOM element, not a jQuery wrapper
      attachMediaStream(self.localVideo[0], stream);

      self.trigger('local_media_setup');
    }, self.errorCallback);
  };

  self.connect = function() {
    // Tell the server we're ready to start contacting the other participants
    var data = {
      participant: {
        guid: self.guid,
      }
    }
    $.post(self._options.roomUrl + '/participants.json', data)
    .success(function(data) {
      self.log('notice', 'TalkingStick connected to the room.');
      self.joinedAt = new Date(data.joined_at);
      self.trigger('connected');
    })
    .fail(function() { self.ajaxErrorLog('Error joining the room', arguments) });
  };


  self.errorCallback = function(error) {
    self.log('error', error);
  };

  /*
   * participant.guid
   * participant.joined_at
   */
  self.addPartner = function(participant) {
    self.log('debug', 'Adding new partner to this conversation', participant);
    var partnerVideo = document.createElement('video');
    self.prepareVideoElement(partnerVideo);
    $('#partnerVideos').append(partnerVideo);
    var options = {
      videoElement: partnerVideo,
      signalingEngine: self.signalingEngine,
      iceServers: self._options.iceServers,
    }

    partner = new TalkingStick.Partner(participant, options);
    self.partners[participant.guid] = partner;

    partner.connect(self.myStream);

    if (partner.joinedAt < TalkingStick.joinedAt) {
      self.log('trace', 'Sending Offer to', partner.guid);
      // Send Offers to partners who joined before us.
      // Expect partners who join after us to send us Offers.
      partner.sendOffer();
    }

    return partner;
  };

  self.prepareVideoElement = function(el) {
    el = $(el);

    // Ensure video streams play as soon as they are attached
    el.attr('autoplay', true);

    // Prevent local audio feedback
    el.attr('muted', true);
  };

  self.generateGUID = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  };

  self.ajaxErrorLog = function(message, ajaxFailArgs) {
    // ajaxFailArgs: 0: jqXHR; 1: textStatus; 2: errorThrown
    self.log('error', message + ':', ajaxFailArgs[2]);
  }

  return self;
}(TalkingStick || {}));
