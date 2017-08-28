/**
* @module advokat/AggregateContainerBucket
*/

'use strict';

var crypto = require('crypto');
var constants = require('kad').constants;
var akConstants = require('./constants');
var akUtils = require('./utils');
var _ = require('lodash');
var assert = require('assert');
var AggregateContainer = require('./aggregateContainer');

class AggregateContainerBucket {
  constructor(options) {
    this.branchDepth = options.branchDepth;
    this.branchID = options.branchID;
    this.recentTrustedContainer = options.recentTrustedContainer ? new AggregateContainer(options.recentTrustedContainer) : undefined;
    this.resultContainer = options.resultContainer ? new AggregateContainer(options.resultContainer) : undefined;

    this.trustedAggregateContainers = options.trustedAggregateContainers ? options.trustedAggregateContainers : {}
    for(iD in this.trustedAggregateContainers) {
      this.aggregateContainers[iD] = new AggregateContainer(this.aggregateContainers[iD]);
    }

    this.otherAggregateContainers = options.otherAggregateContainers ? options.otherAggregateContainers : {}
    for(iD in this.otherAggregateContainers) {
      this.aggregateContainers[iD] = new AggregateContainer(this.aggregateContainers[iD]);
    }

    this.queries = [];
  }

  sortOther() {}
  sortTrusted() {}

  add(newAggregateContainer, contact, trusted) {
    var requireUpdate = false;
    // find first in other
    var container = _.find(this.otherAggregateContainers, ['iD', newAggregateContainer.iD]);
    if(container) {
      if(!_.includes(container.sources, contact.nodeID)) {
        container.sources.push(contact.nodeID);
        requireUpdate = true;
      }
      // normally would sort here, but objects are not sortable: sort later
      // move to reproducable list if reproducable
      if(trusted) {
        delete this.otherAggregateContainers[container.nodeID];
        this.trustedAggregateContainers[container.nodeID] = container;
        this.sortTrusted();
        requireUpdate = true;
      } else {
        if (requireUpdate) {
          this.sortOther();
        }
      }
    } else {
      container = _.find(this.trustedAggregateContainers, ['iD', newAggregateContainer.iD]);
      if(container) {
        if(!_.includes(container.sources, contact.nodeID)) {
          container.sources.push(contact.nodeID);
          this.sortOther();
          requireUpdate = true;
        }
        if(trusted && !(!!this.recentTrustedContainer && this.recentTrustedContainer.iD === newAggregateContainer.iD)) {
          this.recentTrustedContainer = newAggregateContainer;
          requireUpdate = true;
        }
      } else {
        if(trusted) {
          this.trustedAggregateContainers[newAggregateContainer.iD] = newAggregateContainer;
          this.sortTrusted();
          this.recentTrustedContainer = newAggregateContainer;
        } else {
          this.otherAggregateContainers[newAggregateContainer.iD] = newAggregateContainer;
          this.sortOther();
        }
        requireUpdate = true;
      }
    }

    if(requireUpdate) {
      return this.updateAttributes();
    }

    return false;
  }

  updateAttributes() {
    // for the time being, we just select the last trusted and one from others with many counts and many signatures
    var aggregates = [this.recentTrustedContainer];
    if(Object.keys(this.otherAggregateContainers).length > 0) {
      var list = _.sortBy(_.values(this.otherAggregateContainers), [function(c) {return -c.counter;}, function(c) {return -c.sources.length;}]);
      aggregates.push(list[0]);
    }
    var newResultContainer = AggregateContainer.join(aggregates);

    if(newResultContainer.iD === this.resultContainer) {
      return false;
    }

    this.resultContainer = newResultContainer;
    return true;
  }

  /* gives most trusted and correct container from this bucket as object
   *
   * @return Object
   */
  getSharable() {
    return this.recentTrustedContainer.toSharable();
  }

  toObject() {
    return {
      branchDepth: this.branchDepth,
      branchID: this.branchID,
      otherAggregateContainers: this.otherAggregateContainers,
      trustedAggregateContainers: this.trustedAggregateContainers,
      recentTrustedContainer: this.recentTrustedContainer
    }
  }
}

module.exports = AggregateContainerBucket;
