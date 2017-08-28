/**
* @module advokat/Statistics
*/

'use strict';

var crypto = require('crypto');
var akConstants = require('./constants');
var kademlia = require('kad')
var constants = kademlia.constants;
var akUtils = require('./utils');
var _ = require('lodash');
var assert = require('assert');
var AggregateContainer = require('./aggregateContainer');
var AggregateContainerBucket = require('./aggregateContainerBucket');
var async = require('async');

class Statistics {
  constructor() {
    this.leakedInformation = 0;
    this.receivedInformation = 0;
    this.inbox = 0;
    this.outbox = 0;
  }

  sharedMessage(contact, aggregateContainer) {
    this.leakedInformation += 1.0/aggregateContainer.counter;
    this.outbox += 1;
  }

  receivedMessage(contact, aggregateContainer) {
    this.receivedInformation += 1.0/aggregateContainer.counter;
    this.inbox += 1;
  }

  toObject() {
    return {
      leakedInformation: this.leakedInformation,
      receivedInformation: this.receivedInformation,
      inbox: this.inbox,
      outbox: this.outbox
    }
  }
}

module.exports = Statistics;
