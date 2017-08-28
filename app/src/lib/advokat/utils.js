/**
* @module advokat/utils
*/

'use strict';

var assert = require('assert');
var crypto = require('crypto');
var constants = require('kad').constants;
var utils = require('kad').utils
var _ = require('lodash');

/**
 * Validate a key
 * @param {String} key - Key to test
 * @returns {Boolean}
 */
exports.testFunction = function(key) {
  return !!key && key.length === constants.B / 4;
};

/**
 * Generate a SHA1 hash from a data object
 * @param {Object} data - data to hash
 * @returns {String}
 */
exports.getHash = function(data) {
  var json = JSON.stringify(data);
  return crypto.createHash('sha1').update(json).digest('hex');
};

/**
 * Generate a branchId from a nodeID
 *
 * A branchID is a prefix of a nodeID to address a subset of the Kademlia tree
 * @param {String} nodeID - nodeID in hex
 * @param {Number} depth
 * @return {String}
 */
exports.getBranchID = function(nodeID, depth) {
    assert(_.isString(nodeID), 'nodeID must be a String');
    var buffer = utils.hexToBuffer(nodeID);
    var fullBytes = Math.floor((depth+7)/8);
    var branchID = buffer.slice(0, fullBytes)
    // optionally blank some bits
    var diff = fullBytes*8 - depth;
    branchID[fullBytes-1] = (branchID[fullBytes-1]) >>> diff << diff
    return branchID.toString('hex')
}
