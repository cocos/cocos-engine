/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var CCObject = require('../platform/CCObject');
/**
 * !#en
 * The base class for registering asset types.
 *
 * You may want to override:
 * - createNode (static)
 * !#zh
 * 注册用的资源基类。<br/>
 * 你可能要重写：<br/>
 * - createNode (static)
 *
 * @class RawAsset
 * @extends Object
 */
cc.RawAsset = cc.Class({
    name: 'cc.RawAsset', extends: CCObject,

    ctor: function () {
        /**
         * @property _uuid
         * @type {String}
         * @private
         */
        Object.defineProperty(this, '_uuid', {
            value: '',
            writable: true,
            // enumerable is false by default, to avoid uuid being assigned to empty string during destroy
        });
    },

    statics: {
        /**
         * !#en
         * Create a new node in the scene.<br/>
         * If this type of asset dont have its corresponding node type, this method should be null.
         * !#zh
         * 在场景中创建一个新节点。<br/>
         * 如果这类资源没有相应的节点类型，该方法应该是空的。
         * @method createNodeByInfo
         * @param {Object} Info
         * @param {Function} callback
         * @param {String} callback.error - null or the error info
         * @param {Object} callback.node - the created node or null
         * @static
         */
        createNodeByInfo: null,
    }
});

/**
 * @method isRawAssetType
 * @param {Function} ctor
 * @returns {Boolean}
 * @static
 * @private
 */
Object.defineProperty(cc.RawAsset, 'isRawAssetType', {
    value: function (ctor) {
        return cc.isChildClassOf(ctor, cc.RawAsset) && !cc.isChildClassOf(ctor, cc.Asset);
    }
    // enumerable is false by default
});

module.exports = cc.RawAsset;
