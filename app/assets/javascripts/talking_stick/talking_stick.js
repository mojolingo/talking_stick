var TalkingStick = (function(self) {
  var options;
  var init = false;

  self.init = function(force) {
    if (!self.init || force === true) {
      self.partners = [];
      self.init = true;
    }
  };
  
  self.errorCallback = function(error) {
    console.error(error);
  };
  
  self.start = function() {
    self.init();
    navigator.getUserMedia(this.options.requestMedia, function(stream) {
      attachMediaStream(this.options.localVideo, stream)
    }, self.errorCallback);
  
  };
  
  self.addPeer = function() {
    partner = new TalkingStick.Partner();
    partners.push(partner);
    return partner;
  };

  return self;
}(TalkingStick || {}));
