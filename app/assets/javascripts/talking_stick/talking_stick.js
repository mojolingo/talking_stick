var TalkingStick = (function(self) {
  self.GUID     = undefined;
  self.myStream = undefined;
  self._options = {
    media: { audio: true, video: true },
    localVideo: undefined, // Set this to the DOM element where video should be rendered
  };

  self.init = function(options) {
    for (var attr in options) { self._options[attr] = options[attr]; }

    self.GUID = self.generateGUID();
    self.partners = {};
    setInterval(self.checkForParticipants, 3000);

    self.setupLocalVideo();
  };

  self.updateParticipants = function(data, textStatus, jqXHR) {
    $.each(data.participants, function(i, participant) {
      if (participant.guid == self.GUID) {
        // Don't try to set up a connection to ourself
        return;
      }

      if (self.partners[participant.guid]) {
        // We already have a connection to this participant
        return;
      }

      var pc = self.newPeerConnection();
      var partner = self.addPartner(guid, pc);

    });

  };

  self.setupLocalVideo = function() {
    var localVideo = $(self._options.localVideo);

    // Ensure video streams play as soon as they are attached
    localVideo.attr('autoplay', true);

    // Prevent local audio feedback
    localVideo.attr('muted', true);

    navigator.getUserMedia(self._options.media, function(stream) {
      self.myStream = stream;

      // The JS API requires the raw DOM element, not a jQuery wrapper
      attachMediaStream(localVideo[0], stream);

      // Tell the server we're ready to start contacting the other participants
      var data = {
        participant: {
          guid: self.GUID,
        }
      }
      $.post(self._options.roomurl + '/participants.json', data)
    }, self.errorCallback);
  };

  self.checkForParticipants = function() {
    var options = {
      data: { guid: self.GUID },
      success: self.updateParticipants,
      error: self.errorCallback
    }
    $.ajax(self._options.roomurl + '.json', options);
  };
  
  self.errorCallback = function(error) {
    console.error(error);
  };
  
  self.addPartner = function(guid, pc, options) {
    partner = new TalkingStick.Partner(guid, pc, options);
    self.partners[guid] = (partner);
    return partner;
  };

  self.newPeerConnection = function() {
    var pc = new RTCPeerConnection();
    pc.onicecandidate = function(event) {
      // TODO: Need to transmite candidates
    };

    pc.addStream(self.myStream);
    // TODO: Finish this!
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

  return self;
}(TalkingStick || {}));
