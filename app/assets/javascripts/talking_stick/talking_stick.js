var TalkingStick = (function(self) {
  self._options = {
    media: { audio: true, video: true },
    localVideo: undefined, // Set this to the DOM element where video should be rendered
  };

  self.init = function(options) {
    for (var attr in options) { self._options[attr] = options[attr]; }

    self.partners = [];

    // Ensure video streams play as soon as they are attached
    self._options.localVideo.setAttribute('autoplay', true);

    // Prevent local audio feedback
    self._options.localVideo.setAttribute('muted', true);

    navigator.getUserMedia(self._options.media, function(stream) {
      attachMediaStream(self._options.localVideo, stream)
    }, self.errorCallback);
  };
  
  self.errorCallback = function(error) {
    console.error(error);
  };
  
  self.addPartner = function(options) {
    partner = new TalkingStick.Partner(options);
    partners.push(partner);
    return partner;
  };

  return self;
}(TalkingStick || {}));
