TalkingStick.Partner = function() {
  this.peerConnection = new RTCPeerConnection();
}

TalkingStick.Partner.prototype.setDescription = function(answer) {
  this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

TalkingStick.Partner.prototype.handleIceCandidate = function(candidate) {
  this.peerConnection.addIceCandidate(new RTCIceCandidate({candidate: candidate}));
};
