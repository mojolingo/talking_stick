TalkingStick.Partner = function(guid, peerConnection, options) {
  var _options = {
    videoEl: undefined, // Set this to the DOM element where video should be rendered
  };
  $.extend(self._options, options);
  this.guid           = guid;
  this.peerConnection = peerConnection;
}

TalkingStick.Partner.prototype.setDescription = function(answer) {
  this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

TalkingStick.Partner.prototype.handleIceCandidate = function(candidate) {
  this.peerConnection.addIceCandidate(new RTCIceCandidate({candidate: candidate}));
};
