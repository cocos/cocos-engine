/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
const dependUtil = require('./depend-util');
const Cache = require('./cache');
require('../assets/CCAsset');
const { assets } = require('./shared');
const { callInNextTick } = require('../platform/utils');

function visitAsset (asset, deps) {
    // Skip assets generated programmatically or by user (e.g. label texture)
    if (!asset._uuid) {
        return;
    }
    deps.push(asset._uuid);
}

function visitComponent (comp, deps) {
    var props = Object.getOwnPropertyNames(comp);
    for (let i = 0; i < props.length; i++) {
        var propName = props[i];
        if (propName === 'node' || propName === '__eventTargets') continue;
        var value = comp[propName];
        if (typeof value === 'object' && value) {
            if (Array.isArray(value)) {
                for (let j = 0; j < value.length; j++) {
                    let val = value[j];
                    if (val instanceof cc.Asset) {
                        visitAsset(val, deps);
                    }
                }
            }
            else if (!value.constructor || value.constructor === Object) {
                let keys = Object.getOwnPropertyNames(value);
                for (let j = 0; j < keys.length; j++) {
                    let val = value[keys[j]];
                    if (val instanceof cc.Asset) {
                        visitAsset(val, deps);
                    }
                }
            }
            else if (value instanceof cc.Asset) {
                visitAsset(value, deps);
            }
        }
    }
}

let _temp = [];

function visitNode (node, deps) {
    for (let i = 0; i < node._components.length; i++) {
        visitComponent(node._components[i], deps);
    }
    for (let i = 0; i < node._children.length; i++) {
        visitNode(node._children[i], deps);
    }
}

function descendOpRef (asset, refs, exclude, op) {
    exclude.push(asset._uuid);
    var depends = dependUtil.getDeps(asset._uuid);
    for (let i = 0, l = depends.length; i < l; i++) {
        var dependAsset = assets.get(depends[i]);
        if (dependAsset) {
            let uuid = dependAsset._uuid;
            if (!(uuid in refs)) { 
                refs[uuid] = dependAsset.refCount + op;
            }
            else {
                refs[uuid] += op;
            }
            if (exclude.includes(uuid)) continue; 
            descendOpRef(dependAsset, refs, exclude, op);
        }
    }
}

function checkCircularReference (asset) {
    // check circular reference
    var refs = Object.create(null);
    refs[asset._uuid] = asset.refCount;
    descendOpRef(asset, refs, _temp, -1);
    _temp.length = 0;
    if (refs[asset._uuid] !== 0) return refs[asset._uuid];

    for (let uuid in refs) {
        if (refs[uuid] !== 0) {
            descendOpRef(assets.get(uuid), refs, _temp, 1);
        }
    }
    _temp.length = 0;

    return refs[asset._uuid];
}

var _persistNodeDeps = new Cache();
var _toDelete = new Cache();
var eventListener = false;

function freeAssets () {
    eventListener = false;
    _toDelete.forEach(function (asset) {
        releaseManager._free(asset);
    });
    _toDelete.clear();
}

var releaseManager = {
    init () {
        _persistNodeDeps.clear();
        _toDelete.clear();
    },

    _addPersistNodeRef (node) {
        var deps = [];
        visitNode(node, deps);
        for (let i = 0, l = deps.length; i < l; i++) {
            var dependAsset = assets.get(deps[i]);
            if (dependAsset) {
                dependAsset.addRef();
            }
        }
        _persistNodeDeps.add(node.uuid, deps);
    },

    _removePersistNodeRef (node) {
        if (_persistNodeDeps.has(node.uuid)) {
            var deps = _persistNodeDeps.get(node.uuid);
            for (let i = 0, l = deps.length; i < l; i++) {
                var dependAsset = assets.get(deps[i]);
                if (dependAsset) {
                    dependAsset.decRef();
                }
            }
            _persistNodeDeps.remove(node.uuid);
        }
    },

    // do auto release
    _autoRelease (oldScene, newScene, persistNodes) { 

        if (oldScene) {
            var childs = dependUtil.getDeps(oldScene._id);
            for (let i = 0, l = childs.length; i < l; i++) {
                let asset = assets.get(childs[i]);
                asset && asset.decRef(CC_TEST || oldScene.autoReleaseAssets);
            }
            var dependencies = dependUtil._depends.get(oldScene._id);
            if (dependencies && dependencies.persistDeps) {
                var persistDeps = dependencies.persistDeps;
                for (let i = 0, l = persistDeps.length; i < l; i++) {
                    let asset = assets.get(persistDeps[i]);
                    asset && asset.decRef(CC_TEST || oldScene.autoReleaseAssets);
                }
            }
            oldScene._id !== newScene._id && dependUtil.remove(oldScene._id);
        }

        var sceneDeps = dependUtil._depends.get(newScene._id);
        sceneDeps && (sceneDeps.persistDeps = []);
        // transfer refs from persist nodes to new scene
        for (let key in persistNodes) {
            var node = persistNodes[key];
            var deps = _persistNodeDeps.get(node.uuid);
            for (let i = 0, l = deps.length; i < l; i++) {
                var dependAsset = assets.get(deps[i]);
                if (dependAsset) {
                    dependAsset.addRef();
                }
            }
            if (sceneDeps) {
                sceneDeps.persistDeps.push.apply(sceneDeps.persistDeps, deps);
            }
        }
    },

    _free (asset, force) {
        _toDelete.remove(asset._uuid);

        if (!cc.isValid(asset, true)) return;

        if (!force) {
            if (asset.refCount > 0) {
                if (checkCircularReference(asset) > 0) return; 
            }
        }
    
        // remove from cache
        assets.remove(asset._uuid);
        var depends = dependUtil.getDeps(asset._uuid);
        for (let i = 0, l = depends.length; i < l; i++) {
            var dependAsset = assets.get(depends[i]);
            if (dependAsset) {
                dependAsset.decRef(false);
                releaseManager._free(dependAsset, false);
            }
        }
        asset.destroy();
        dependUtil.remove(asset._uuid);
    },

    tryRelease (asset, force) {
        if (!(asset instanceof cc.Asset)) return;
        if (force) {
            releaseManager._free(asset, force);
        }
        else {
            _toDelete.add(asset._uuid, asset);
            if (!eventListener) {
                eventListener = true;
                callInNextTick(freeAssets);
            }
        }
    }
};

module.exports = releaseManager;