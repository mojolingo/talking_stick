var TalkingStick = (function(self) {
  var options;

  self.init = function(options) {
    // TODO: Validate all required options are present
    self.options = options;
    self.partners = [];
  };
  
  self.errorCallback = function(error) {
    console.error(error);
  };
  
  self.start = function() {
    navigator.getUserMedia(this.options.requestMedia, function(stream) {
      attachMediaStream(this.options.localVideo, stream)
    }, self.errorCallback);
  
  };
  
  self.addPeer = function() {
    partner = new TalkingStick.Partner();
    partner.init();
    partners.push(partner);
  };

  return self;
}(TalkingStick || {}));
