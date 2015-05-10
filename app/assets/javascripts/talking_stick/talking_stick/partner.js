TalkingStick.Partner = (function(self) {
  var peerConnection;

  self.init = function() {
    self.peerConnection = new RTCPeerConnection();
  };

  self.setDescription = function(answer) {
    self.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  self.handleIceCandidate = function(candidate) {
    self.peerConnection.addIceCandidate(new RTCIceCandidate({candidate: candidate}));
  };

  return self;
})(TalkingStick.Partner || {});
