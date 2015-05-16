TalkingStick.Partner = function(participant, options) {
  this.gatheringCandidates = false;
  this.guid          = participant.guid;
  this.joinedAt      = new Date(participant.joined_at);
  this.iceCandidates = [];
  this._options      = {
    videoElement: undefined, // Set this to the DOM element where video should be rendered
  };
  $.extend(this._options, options);
  this.signalingEngine = this._options.signalingEngine;
}

TalkingStick.Partner.prototype.log = function() {
  var level = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1);
  args.unshift('[Partner ' + this.guid + ']');
  args.unshift(level);
  TalkingStick.log.apply(this, args);
}

TalkingStick.Partner.prototype.errorCallback = function() {
  // Convert arguments to a real array
  var args = Array.prototype.slice.call(arguments);
  args.unshift('error');
  this.log(args);
}

TalkingStick.Partner.prototype.setDescription = function(answer) {
  this.log('trace', 'Setting remote description to', answer);
  this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

TalkingStick.Partner.prototype.connect = function(stream) {
  this.log('trace', 'Creating new peer connection');
  this.peerConnection = new RTCPeerConnection();

  var partner = this;
  this.peerConnection.onicecandidate = function() {
    partner.handleICECandidate.apply(partner, arguments);
  }

  this.peerConnection.addStream(stream);
};

TalkingStick.Partner.prototype.sendOffer = function() {
  // Fix scope for "this" inside createOffer()
  var partner = this;
  this.peerConnection.createOffer(function(offer) {
    partner.log('trace', 'Created PeerConnection Offer; ICE candidate collection starting', offer);
    partner.gatheringCandidates = true;
    partner.peerConnection.setLocalDescription(offer);
    partner.signalingEngine.sendOffer(partner.guid, offer);
  }, this.errorCallback);
}

TalkingStick.Partner.prototype.handleICECandidate = function(event) {
  var candidate = event.candidate;
  if (candidate) {
    this.log('trace', 'Received ICE candidate', candidate);
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    // Store and transmit new ICE candidate
    this.iceCandidates.push(event.candidate);
    this.signalingEngine.sendICECandidate(this.guid, event.candidate);

  } else {
    this.gatheringCandidates = false;
    this.log('debug', 'ICE candidate collection complete');
    this.signalingEngine.iceCandidateGatheringComplete(this.guid, this.iceCandidates);
  }
};

