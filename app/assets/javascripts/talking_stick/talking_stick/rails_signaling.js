TalkingStick.RailsSignaling = function(options) {
  this.options = options;
  this.roomUrl = options.url;
  var self = this;
  $('#talking-stick-localvideo').on('talking_stick.connected', function() { self.connected.apply(self)} );
}

TalkingStick.RailsSignaling.prototype.connected = function() {
  // Check now, then schedule a timer to check for new participants
  this._updateRoom();
  var signaling = this;
  var pollingInterval = setInterval(function() {
    signaling._updateRoom.apply(signaling);
  }, 3000);
  $('#talking-stick-localvideo').on('talking_stick.disconnected', function() { clearInterval(pollingInterval); });
}

TalkingStick.RailsSignaling.prototype.sendICECandidate = function(to, candidate) {
  // Noop - wait for all candidates to be gathered and send at once
  // This is slower for the user, but reduces traffic on the API
}

TalkingStick.RailsSignaling.prototype.iceCandidateGatheringComplete = function(to, candidates) {
  var data = {
    signal_type: 'candidates',
    // IE doesn't like big objects, so filter down and
    // only keep the actual candidate information
    data: JSON.stringify(candidates, ['candidate', 'sdpMLineIndex', 'sdpMid']),
  }
  this._sendData('ICE Candidates', to, data);
}

TalkingStick.RailsSignaling.prototype.sendOffer = function(to, offer) {
  var data = {
    signal_type: 'offer',
    data: JSON.stringify(offer),
  }
  this._sendData('Offer', to, data);
}

TalkingStick.RailsSignaling.prototype.sendAnswer = function(to, answer) {
  var data = {
    signal_type: 'answer',
    data: JSON.stringify(answer),
  }
  this._sendData('Answer', to, data);
}

TalkingStick.RailsSignaling.prototype._sendData = function(descr, toGuid, data) {
  data.sender = TalkingStick.guid;
  var signalUrl = this.roomUrl + '/participants/' + toGuid + '/signals';
  $.post(signalUrl, data)
  .success(function() { TalkingStick.log('trace', descr + ' sent to API'); })
  .fail(function(jqXHR, textStatus, error) { TalkingStick.log('error', 'Error sending ' + descr + ' to API:', error) });
}

TalkingStick.RailsSignaling.prototype._updateRoom = function() {
  TalkingStick.log('trace', 'Getting room updates');
  var options = {
    data: { guid: TalkingStick.guid },
  }

  var signaling = this;
  $.ajax(this.roomUrl + '.json', options)
  .success(function() { signaling._handleRoomUpdate.apply(signaling, arguments); })
  .fail(function() { TalkingStick.ajaxErrorLog('Error checking for participants', arguments) });
};

TalkingStick.RailsSignaling.prototype._updateParticipants = function(participants) {
  $.each(TalkingStick.partners, function(i, partner) {
    // Mark each partner for cleanup
    partner.fresh = false;
  });

  $.each(participants, function(i, participant) {
    if (participant.guid === TalkingStick.guid) {
      // Don't try to set up a connection to ourself
      return;
    }

    var partner;
    if (partner = TalkingStick.partners[participant.guid]) {
      // We already have a connection to this participant
      // Mark it active so it doesn't get removed
      partner.fresh = true;
      return;
    }

    TalkingStick.log('trace', 'Handling new partner', participant.guid);
    partner = TalkingStick.addPartner(participant);
    partner.fresh = true;
  });

  $.each(TalkingStick.partners, function(i, partner) {
    if (partner.fresh) { return; }
    partner.cleanup();
    delete TalkingStick.partners[i];
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

