TalkingStick.Partner = function(guid, options) {
  this.guid          = guid;
  this._options      = {
    videoElement: undefined, // Set this to the DOM element where video should be rendered
  };
  $.extend(this._options, options);
}

TalkingStick.Partner.prototype.log = function() {
  var level = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift('[Partner ' + this.guid + ']');
  args.unshift(level);
  TalkingStick.log.apply(this, args);
}

TalkingStick.Partner.prototype.setDescription = function(answer) {
  this.log('trace', 'Setting remote description to', answer);
  this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

TalkingStick.Partner.prototype.handleIceCandidate = function(candidate) {
  this.peerConnection.addIceCandidate(new RTCIceCandidate({candidate: candidate}));
TalkingStick.Partner.prototype.connect = function(stream) {
  this.log('trace', 'Creating new peer connection');
  this.peerConnection = new RTCPeerConnection();
  this.peerConnection.onicecandidate = this.handleICECandidate;

  this.peerConnection.addStream(stream);
  // TODO: Finish this!
};
