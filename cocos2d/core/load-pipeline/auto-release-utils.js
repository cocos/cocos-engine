/****************************************************************************
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var js = require('../platform/js');

function parseDepends (key, parsed) {
    var item = cc.loader.getItem(key);
    if (item) {
        var depends = item.dependKeys;
        if (depends) {
            for (var i = 0; i < depends.length; i++) {
                var depend = depends[i];
                if ( !parsed[depend] ) {
                    parsed[depend] = true;
                    parseDepends(depend, parsed);
                }
            }
        }
    }
}

function visitAsset (asset, excludeMap) {
    // Skip assets generated programmatically or by user (e.g. label texture)
    if (!asset._uuid) {
        return;
    }
    var key = cc.loader._getReferenceKey(asset);
    if ( !excludeMap[key] ) {
        excludeMap[key] = true;
        parseDepends(key, excludeMap);
    }
}

function visitComponent (comp, excludeMap) {
    var props = Object.getOwnPropertyNames(comp);
    for (var i = 0; i < props.length; i++) {
        var value = comp[props[i]];
        if (typeof value === 'object' && value) {
            if (Array.isArray(value)) {
                for (let j = 0; j < value.length; j++) {
                    let val = value[j];
                    if (val instanceof cc.RawAsset) {
                        visitAsset(val, excludeMap);
                    }
                }
            }
            else if (!value.constructor || value.constructor === Object) {
                let keys = Object.getOwnPropertyNames(value);
                for (let j = 0; j < keys.length; j++) {
                    let val = value[keys[j]];
                    if (val instanceof cc.RawAsset) {
                        visitAsset(val, excludeMap);
                    }
                }
            }
            else if (value instanceof cc.RawAsset) {
                visitAsset(value, excludeMap);
            }
        }
    }
}

function visitNode (node, excludeMap) {
    for (let i = 0; i < node._components.length; i++) {
        visitComponent(node._components[i], excludeMap);
    }
    for (let i = 0; i < node._children.length; i++) {
        visitNode(node._children[i], excludeMap);
    }
}

module.exports = {
    // do auto release
    autoRelease: function (oldSceneAssets, nextSceneAssets, persistNodes) {
        var releaseSettings = cc.loader._autoReleaseSetting;
        var excludeMap = js.createMap();

        // collect next scene assets
        if (nextSceneAssets) {
            for (let i = 0; i < nextSceneAssets.length; i++) {
                excludeMap[nextSceneAssets[i]] = true;
            }
        }

        // collect assets used by persist nodes
        for (let i = 0; i < persistNodes.length; i++) {
            visitNode(persistNodes[i], excludeMap)
        }

        // remove ununsed scene assets
        if (oldSceneAssets) {
            for (let i = 0; i < oldSceneAssets.length; i++) {
                let key = oldSceneAssets[i];
                if (releaseSettings[key] !== false && !excludeMap[key]) {
                    cc.loader.release(key);
                }
            }
        }

        // remove auto release assets
        // (releasing asset will change _autoReleaseSetting, so don't use for-in)
        var keys = Object.keys(releaseSettings);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (releaseSettings[key] === true && !excludeMap[key]) {
                cc.loader.release(key);
            }
        }
    },

    // get dependencies not including self
    getDependsRecursively: function (key) {
        var depends = {};
        parseDepends(key, depends);
        return Object.keys(depends);
    }
};
