var TalkingStick = (function(self) {
  self.guid         = undefined;
  self.myStream     = undefined;
  self.joinedAt     = undefined;
  self._options = {
    media: { audio: true, video: true },
    localVideo: undefined, // Set this to the DOM element where video should be rendered
    logLevel: 'error',
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

  self.setupLocalVideo = function() {
    var localVideo = $(self._options.localVideo);

    self.prepareVideoElement(localVideo);

    self.log('debug', 'Requesting user consent to access to input devices');
    navigator.getUserMedia(self._options.media, function(stream) {
      self.log('debug', 'User has granted access to input devices');
      self.myStream = stream;

      // The JS API requires the raw DOM element, not a jQuery wrapper
      attachMediaStream(localVideo[0], stream);

      // Tell the server we're ready to start contacting the other participants
      var data = {
        participant: {
          guid: self.guid,
        }
      }
      $.post(self._options.roomUrl + '/participants.json', data)
      .success(function(data) {
        self.joinedAt = new Date(data.joined_at);
        self.signalingEngine.connected();
      })
      .fail(function() { self.ajaxErrorLog('Error registering as a participant', arguments) });

    }, self.errorCallback);
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
    var options = {
      videoElement: partnerVideo,
      signalingEngine: self.signalingEngine,
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
