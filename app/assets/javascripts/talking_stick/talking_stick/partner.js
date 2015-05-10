TalkingStick.Partner = function(options) {
  var _options = {
    videoEl: undefined, // Set this to the DOM element where video should be rendered
  };
  for (var attr in options) { self._options[attr] = options[attr]; }
  this.peerConnection = new RTCPeerConnection();
}

TalkingStick.Partner.prototype.setDescription = function(answer) {
  this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

TalkingStick.Partner.prototype.handleIceCandidate = function(candidate) {
  this.peerConnection.addIceCandidate(new RTCIceCandidate({candidate: candidate}));
};
