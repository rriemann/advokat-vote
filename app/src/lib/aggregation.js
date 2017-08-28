'use strict';

import Aggregate from './aggregate';

// kademlia + transport
var kademlia = require('kad');
var EventEmitter = require('events').EventEmitter;
var WebRTC = require('./transport');

// advokat
var Aggregator = require('./advokat/aggregator');
var akConstants = require('./advokat/constants');
kademlia.constants.T_RESPONSETIMEOUT = 5*1000; // in ms
kademlia.constants.MESSAGE_TYPES.push(...akConstants.MESSAGE_TYPES);

var signaller;
var node;
var aggregator;
var result;
var participantCount;

// requires start time (Date object) of the aggregation
export function setupAggregationStart(start) {
  var timeout = (start.getTime() - (new Date()).getTime());
  if (timeout < 0) timeout = 0;

  setTimeout(function() {
    startAggregation();
  }, timeout);
}

export function createNode(email, peer, host) {
  var id = email;

  var webSocket = require('./web-socket');
  var SignalClient = require('./signal-client');

  signaller = new SignalClient(id);
  console.log('createNode with id', id);
  webSocket.on('open', function() {
    node = new kademlia.Node({
      transport: new WebRTC(new WebRTC.Contact({
        nick: id
      }), { signaller: signaller }),
      storage: new kademlia.storage.LocalStorage(id)
    });

    node.on('connect', function() {
      console.info("Connection established!");
    });

    // connect to other peer if guest and not host
    if(!host) {
      $scope.node.connect({ nick: peer }, function(err) {
        if(err) {
          alert(err);
          return;
        }
        console.info("Connected!");
        setupAggregationStart();
      });
    } else {
      console.info("ommit connect");
      setupAggregationStart();
    }
  });
}

export function startAggregation() {
  var initialAggregate = new Aggregate(aggregate);

  console.info("startAggregation");
  aggregator = new Aggregator(node, node._self, initialAggregate);
  aggregator.processAggregation(function () {
    result = aggregator.resultContainer;
    participantCount = aggregator.resultContainer.counter;
  });
}
