/**
* @module kad/examples/webrtc-browser-e2e/SignalClient
*/

'use strict';

import {EventEmitter} from 'events';
import webSocket from './web-socket';
import {inherits} from 'util';

inherits(SignalClient, EventEmitter);

/**
* A client for talking to the signal server.
* @param {string} nick
* @constructor
*/
export default function SignalClient(nick) {
  var signalClient = this;

  webSocket.on('open', function() {
    webSocket.send(JSON.stringify({ announceNick: nick }));
  });

  webSocket.on('message', function(message) {
    var parsed = JSON.parse(message);
    if(nick === parsed.recipient) {
      EventEmitter.prototype.emit.call(signalClient, nick, parsed.message);
    }
  });
}

/**
* Send a signal to the signal server to perform a WebRTC handshake
* @param {string} recipient
* @param {string} message
*/
SignalClient.prototype.emit = function(recipient, message) {
  webSocket.send(JSON.stringify({ recipient: recipient, message: message }));
};
