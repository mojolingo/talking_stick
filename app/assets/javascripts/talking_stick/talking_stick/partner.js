TalkingStick.Partner = function(guid, peerConnection, options) {
  var _options = {
    videoEl: undefined, // Set this to the DOM element where video should be rendered
  };
  $.extend(self._options, options);
  this.guid           = guid;
  this.peerConnection = peerConnection;
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
};
