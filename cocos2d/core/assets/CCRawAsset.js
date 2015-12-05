var CCObject = require('../platform/CCObject');
/**
 * The base class for registering asset types.
 *
 * You may want to override:
 * - createNode (static)
 *
 * @class RawAsset
 * @extends CCObject
 * @static
 */
cc.RawAsset = cc.Class({
    name: 'cc.RawAsset', extends: CCObject,

    statics: {
        /**
         * Create a new node in the scene.
         * If this type of asset dont have its corresponding node type, this method should be null.
         *
         * @method createNodeByInfo
         * @param {Object} Info
         * @param {Function} callback
         * @param {String} callback.error - null or the error info
         * @param {Object} callback.node - the created node or null
         */
        createNodeByInfo: null,
    }
});

module.exports = cc.RawAsset;
