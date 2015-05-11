var TalkingStick = (function(self) {
  self.GUID = undefined;
  self._options = {
    media: { audio: true, video: true },
    localVideo: undefined, // Set this to the DOM element where video should be rendered
  };

  self.init = function(options) {
    for (var attr in options) { self._options[attr] = options[attr]; }

    self.GUID = self.generateGUID();
    self.partners = [];

    var localVideo = $(self._options.localVideo);

    // Ensure video streams play as soon as they are attached
    localVideo.attr('autoplay', true);

    // Prevent local audio feedback
    localVideo.attr('muted', true);

    navigator.getUserMedia(self._options.media, function(stream) {
      // The JS API requires the raw DOM element, not a jQuery wrapper
      attachMediaStream(localVideo[0], stream)
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

  self.generateGUID = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }

  return self;
}(TalkingStick || {}));
