'use strict';

import {API_WEBSOCKET} from 'src/app.config';

import {EventEmitter} from 'events';
var emitter = new EventEmitter();
var socket = new WebSocket(API_WEBSOCKET);

/**
* Handle socket errors
* @param {object} error
* @param {function} callback
*/
socket.onerror = function(error) {
  console.log('onerror', error);
};

/**
* Handle socket close
*/
socket.onclose = function() {
  console.log('onclose');
};

/**
* Handle socket open and propagate the event
*/
socket.onopen = function() {
  emitter.emit('open');
};

/**
* Handle socket message and propagate the event
*/
socket.onmessage = function(message) {
  emitter.emit('message', message.data);
};

/**
* Send the message over the socket
* @param {string} message
*/
emitter.send = function(message) {
  socket.send(message);
};

export default emitter;
