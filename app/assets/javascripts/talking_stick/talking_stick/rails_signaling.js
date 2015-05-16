TalkingStick.RailsSignaling = function(options) {
  this.options = options;
  this.url = options.url + '/participants/' + options.myGuid + '/signaling';
}

TalkingStick.RailsSignaling.prototype.sendICECandidate = function(to, candidate) {
  // Noop - wait for all candidates to be gathered and send at once
  // This is slower for the user, but reduces traffic on the API
}

TalkingStick.RailsSignaling.prototype.iceCandidateGatheringComplete = function(to, candidates) {
  var data = {
    signal_type: 'candidates',
    recipient: to,
    data: candidates,
  }
  this._sendData('ICE Candidates', data);
}

TalkingStick.RailsSignaling.prototype.sendOffer = function(to, offer) {
  var data = {
    signal_type: 'offer',
    recipient: to,
    data: offer,
  }
  this._sendData('Offer', data);
}

TalkingStick.RailsSignaling.prototype.sendAnswer = function(to, answer) {
  var data = {
    signal_type: 'answer',
    recipient: to,
    data: answer,
  }
  this._sendData('Answer', data);
}

TalkingStick.RailsSignaling.prototype._sendData = function(descr, data) {
  $.post(this.url, data)
  .success(function() { TalkingStick.log('trace', descr + ' sent to API'); })
  .fail(function(jqXHR, textStatus, error) { TalkingStick.log('error', 'Error sending ' + descr + ' to API:', error) });
}
