TalkingStick.RailsSignaling = function(options) {
  this.options = options;
  this.guid = options.myGuid;
  this.roomUrl = options.url;
  this.signalingUrl = options.url + '/participants/' + options.myGuid + '/signaling';
}

TalkingStick.RailsSignaling.prototype.connected = function() {
  // Check now, then schedule a timer to check for new participants
  this._checkForParticipants();
  var signaling = this;
  setInterval(function() {
    signaling._checkForParticipants.apply(signaling);
  }, 3000);
}

TalkingStick.RailsSignaling.prototype.sendICECandidate = function(to, candidate) {
  // Noop - wait for all candidates to be gathered and send at once
  // This is slower for the user, but reduces traffic on the API
}

TalkingStick.RailsSignaling.prototype.iceCandidateGatheringComplete = function(to, candidates) {
  var data = {
    signal_type: 'candidates',
    recipient: to,
    data: JSON.stringify(candidates),
  }
  this._sendData('ICE Candidates', data);
}

TalkingStick.RailsSignaling.prototype.sendOffer = function(to, offer) {
  var data = {
    signal_type: 'offer',
    recipient: to,
    data: JSON.stringify(offer),
  }
  this._sendData('Offer', data);
}

TalkingStick.RailsSignaling.prototype.sendAnswer = function(to, answer) {
  var data = {
    signal_type: 'answer',
    recipient: to,
    data: JSON.stringify(answer),
  }
  this._sendData('Answer', data);
}

TalkingStick.RailsSignaling.prototype._sendData = function(descr, data) {
  $.post(this.signalingUrl, data)
  .success(function() { TalkingStick.log('trace', descr + ' sent to API'); })
  .fail(function(jqXHR, textStatus, error) { TalkingStick.log('error', 'Error sending ' + descr + ' to API:', error) });
}

TalkingStick.RailsSignaling.prototype._checkForParticipants = function() {
  TalkingStick.log('trace', 'Getting room updates');
  var options = {
    data: { guid: this.guid },
  }

  var signaling = this;
  $.ajax(this.roomUrl + '.json', options)
  .success(function() { signaling._handleRoomUpdate.apply(signaling, arguments); })
  .fail(function() { TalkingStick.ajaxErrorLog('Error checking for participants', arguments) });
};

TalkingStick.RailsSignaling.prototype._updateParticipants = function(participants) {
  $.each(participants, function(i, participant) {
    if (participant.guid === TalkingStick.guid) {
      // Don't try to set up a connection to ourself
      //TalkingStick.log('trace', 'Skipping own GUID', participant.guid);
      return;
    }

    if (TalkingStick.partners[participant.guid]) {
      // We already have a connection to this participant
      //TalkingStick.log('trace', 'Skipping participant since we already have a connection', participant.guid);
      return;
    }
    TalkingStick.log('trace', 'Handling new partner', participant.guid);

    TalkingStick.addPartner(participant);
  });
};

TalkingStick.RailsSignaling.prototype._processSignals = function(signals) {
  $.each(signals, function(i, signal) {
    TalkingStick.log('trace', 'Received signal', signal);
    signal_data = JSON.parse(signal.data);

    var partner = TalkingStick.partners[signal.sender_guid];
    if (partner === undefined) {
      TalkingStick.log('warning', 'Received signal from unknown partner ' + signal.sender_guid + '; ignoring.');
      return;
    }

    switch(signal.signal_type) {
    case 'offer':
      partner.handleOffer(signal_data);
      break;
    case 'answer':
      partner.handleAnswer(signal_data);
      break;
    case 'candidates':
      $.each(signal_data, function(i, candidate) {

        partner.handleRemoteICECandidate(candidate);
      });
      break;
    default:
      TalkingStick.log('warning', 'Unknown signal type "' + signal.signal_type + '" received.', signal);
      break;
    };
  });
};

TalkingStick.RailsSignaling.prototype._handleRoomUpdate = function(data, textStatus, jqXHR) {
  this._updateParticipants(data.participants);
  this._processSignals(data.signals);
};

