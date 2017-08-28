/**
* @module advokat/Aggregator
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
var Statistics = require('./statistics');

class Aggregator {
  constructor(node, contact) {
    this.rpc = node._rpc;
    this.buckets = node._router._buckets;
    this.router = node._router;
    this.log = node._log;
    this.contact = contact;

    this.queryMinDepth = constants.B;

    // set up bindings for incoming Messages
    this.rpc.on('QUERY', this.handleQuery.bind(this));

    this.containerBuckets = _.map(_.range(constants.B), function(index) {
      return new AggregateContainerBucket({
        branchDepth: constants.B-index, // index 0 is own nodeID
        branchID: akUtils.getBranchID(contact.nodeID, constants.B-index)
      });
    });

    this.initalAggregate = new AggregateContainer({
      counter: 1,
      branchDepth: constants.B,
      branchID: contact.nodeID,
      childIDs: []
    });

    var self = this;
    this.add(this.initalAggregate, contact, true);

    this.statistics = new Statistics();
  }

  processAggregation(next) {
    var self = this;

    async.whilst(function () {
      // self.log.info("now depth: %d", self.queryMinDepth);
      return self.queryMinDepth > 0;
    }, function(cb) {
      async.series([
        self.processAggregationDepth.bind(self),
        self.processAggregationQueries.bind(self)
      ], cb);
    }, function(err, results) {
      if (err) {
        // self.log.error('processAggregation failed, reason %s', err.message);
        return next(err);
      }
      // self.log.warn("result: %j (count: %d)", self.containerBuckets[159].resultContainer.iD, self.containerBuckets[159].resultContainer.counter);
      self.resultContainer = self.containerBuckets[159].resultContainer;
      return next(null, {resultContainer: self.containerBuckets[159].resultContainer, statistics: self.statistics});
    });
  }

  processAggregationDepth(cb) {
    // check if we have one contact for this depth
    var self = this;
    // self.log.info("in #processAggregationDepth");
    var depth = self.queryMinDepth;
    var bucket = self.buckets[constants.B-depth];
    var contacts = bucket && bucket._contacts;
    if(contacts && contacts.length > 0) {
      var expect = contacts.length;
      var contact = _.sample(contacts);
      var message = new kademlia.Message({
        method: 'QUERY',
        params: { depth: depth, contact: self.contact}
      });

      self.rpc.send(contact, message, function(err, response) {
        if (err) {
          self.log.error('query failed, reason %s', err.message);
          return cb(null);
        }
        // self.log.info("response: %j", response.result.aggregateContainer);
        var sender = self.rpc._createContact(response.result.contact);
        self.statistics.receivedMessage(sender, response.result.aggregateContainer);
        self.add(new AggregateContainer(response.result.aggregateContainer), sender, false);
        self.queryMinDepth = depth-1;
        return cb(null);
      });
    } else {
      self.queryMinDepth = depth-1;
      return cb(null);
    }
  }

  sendResponse(depth, query, done) {
    var self = this;
    var contact = query.contact;
    var message = new kademlia.Message({
      method: 'QUERY',
      id: query.id,
      result: {
        aggregateContainer: self.containerBuckets[constants.B-depth].getSharable(),
        contact: self.contact
      }
    });
    self.rpc.send(contact, message);

    self.statistics.sharedMessage(contact, message.result.aggregateContainer);
  }

  processAggregationQueries(cb) {
    var self = this;
    // self.log.info("in #processAggregationQueries");
    var depth = self.queryMinDepth+1;
    var bucket = self.containerBuckets[constants.B-depth];
    async.each(bucket.queries, function(query, done) {
      self.sendResponse(depth, query);
      done();
    }, function(err) {
      if (err) {
        self.log.error('Failed to process querries, reason:', err.message);
      }
      cb(null);
    });
    bucket.queries = [];
  }

  add(newAggregateContainer, contact, trusted, cb) {
    cb = cb || function() {};
    var self = this;
    var bucketChanged = self.containerBuckets[constants.B-newAggregateContainer.branchDepth].add(newAggregateContainer, contact, trusted);
    var parentContainer = self.containerBuckets[constants.B-newAggregateContainer.branchDepth].resultContainer;
    if(bucketChanged && parentContainer.branchDepth > 0) {
      self.add(parentContainer, self.contact, true, cb);
    } else {
      cb();
    }
  }

  handleQuery(message) {
    var contact = this.rpc._createContact(message.params.contact);
    var query = {id: message.id, contact: contact};
    // this.log.info("got new query for depth=%d (my minDepth=%d) from %s", message.params.depth, this.queryMinDepth, contact.nodeID);
    if(message.params.depth < this.queryMinDepth) {
      // store query for later; do not respond immediatly
      this.containerBuckets[constants.B-message.params.depth].queries.push(query);
    } else {
      // repond directly if we have finished aggregation up to this level
      this.sendResponse(message.params.depth, query, function(err) {
        if (err) {
          self.log.error('Failed to respond immediatly to query, reason:', err.message);
        }
      });
    }
  }

  /*
  refreshBucketsBeyondClosestBlocking(contacts, done) {
    var self = this;
    var bucketIndexes = Object.keys(self.router._buckets);
    var leastBucket = _.min(bucketIndexes);

    function bucketFilter(index) {
      return index > leastBucket;
    }

    var refreshBuckets = bucketIndexes.filter(bucketFilter);

    async.eachSeries(refreshBuckets, self.refreshBucket.bind(self), done);
  };
  */
}

module.exports = Aggregator;
