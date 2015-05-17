TalkingStick.Partner = function(participant, options) {
  this.gatheringCandidates = false;
  this.guid          = participant.guid;
  this.joinedAt      = new Date(participant.joined_at);
  this.localICECandidates = [];
  this._options      = {
    videoElement: undefined, // Set this to the DOM element where video should be rendered
  };
  $.extend(this._options, options);
  this.signalingEngine = this._options.signalingEngine;
  this.videoElement    = this._options.videoElement;
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
  var configuration = {
    iceServers: this._options.iceServers,
  };
  this.log('trace', 'Creating new peer connection with configuration', configuration);
  this.peerConnection = new RTCPeerConnection(configuration);

  var partner = this;
  this.peerConnection.onicecandidate = function() {
    partner.handleLocalICECandidate.apply(partner, arguments);
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
};

TalkingStick.Partner.prototype.handleOffer = function(offer) {
  this.log('debug', 'Processing Offer received from', this.guid);
  this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
  var partner = this;

  this.peerConnection.onaddstream = function(event) {
    attachMediaStream($(partner.videoElement)[0], event.stream);
  };
  this.peerConnection.createAnswer(function(answer) {
    partner.peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    partner.log('debug', 'Sending Answer to', partner.guid);
    partner.signalingEngine.sendAnswer(partner.guid, answer);
  });
};

TalkingStick.Partner.prototype.handleAnswer = function(answer) {
  this.log('debug', 'Processing Answer received from', this.guid);
  var partner = this;
  this.peerConnection.onaddstream = function(event) {
    attachMediaStream($(partner.videoElement)[0], event.stream);
  };
  this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

TalkingStick.Partner.prototype.handleRemoteICECandidate = function(candidate) {
  this.log('trace', 'Adding remote ICE candidate', candidate);
  this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

TalkingStick.Partner.prototype.handleLocalICECandidate = function(event) {
  var candidate = event.candidate;
  if (candidate) {
    this.log('trace', 'Discovered local ICE candidate', candidate);
    // Store and transmit new ICE candidate
    this.localICECandidates.push(event.candidate);
    this.signalingEngine.sendICECandidate(this.guid, event.candidate);

  } else {
    this.gatheringCandidates = false;
    this.log('debug', 'ICE candidate collection complete');
    this.signalingEngine.iceCandidateGatheringComplete(this.guid, this.localICECandidates);
  }
};

