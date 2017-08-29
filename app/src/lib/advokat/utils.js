/**
* @module advokat/utils
*/

'use strict';

import assert from 'assert';
import {constants, utils} from 'kad';
import _ from 'lodash';

import {hash} from 'src/lib/utils';

/**
 * Validate a key
 * @param {String} key - Key to test
 * @returns {Boolean}
 */
export function testFunction(key) {
  return !!key && key.length === constants.B / 4;
};

/**
 * Generate a SHA1 hash from a data object
 * @param {Object} data - data to hash
 * @returns {String}
 */
export function getHash(data) {
  return hash(data);
};

/**
 * Generate a branchId from a nodeID
 *
 * A branchID is a prefix of a nodeID to address a subset of the Kademlia tree
 * @param {String} nodeID - nodeID in hex
 * @param {Number} depth
 * @return {String}
 */
export function getBranchID(nodeID, depth) {
    assert(_.isString(nodeID), 'nodeID must be a String');
    var buffer = utils.hexToBuffer(nodeID);
    var fullBytes = Math.floor((depth+7)/8);
    var branchID = buffer.slice(0, fullBytes)
    // optionally blank some bits
    var diff = fullBytes*8 - depth;
    branchID[fullBytes-1] = (branchID[fullBytes-1]) >>> diff << diff
    return branchID.toString('hex')
}
