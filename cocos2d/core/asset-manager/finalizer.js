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
                    if (val instanceof cc.RawAsset) {
                        visitAsset(val, deps);
                    }
                }
            }
            else if (!value.constructor || value.constructor === Object) {
                let keys = Object.getOwnPropertyNames(value);
                for (let j = 0; j < keys.length; j++) {
                    let val = value[keys[j]];
                    if (val instanceof cc.RawAsset) {
                        visitAsset(val, deps);
                    }
                }
            }
            else if (value instanceof cc.RawAsset) {
                visitAsset(value, deps);
            }
        }
    }
}

function visitNode (node, deps) {
    for (let i = 0; i < node._components.length; i++) {
        visitComponent(node._components[i], deps);
    }
    for (let i = 0; i < node._children.length; i++) {
        visitNode(node._children[i], deps);
    }
}

var _lockedAsset = Object.create(null);
var _persistNodeDeps = new Cache();
var _toDelete = new Cache();
var eventListener = false;
Object.assign(cc.Asset.prototype, {
    get _ref () {
        return this.__ref__ || 0;
    },

    set _ref (val) {
        this.__ref__ = val;
    },

    _addRef () {
        this._ref++;
    },
    _removeRef () {
        this._ref--;
    }
});

/**
 * !#en
 * Control resource release, it's a singleton
 * 
 * !#zh
 * 控制资源释放，这是一个单例
 * 
 * @static
 */
var finalizer = {
    /**
     * !#en
     * Initialize
     * 
     * !#zh
     * 初始化
     * 
     * @method init
     * 
     * @typescript
     * init(): void
     */
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
                dependAsset._addRef();
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
                    dependAsset._removeRef();
                }
            }
            _persistNodeDeps.remove(node.uuid);
        }
    },

    // do auto release
    _autoRelease (oldScene, newScene, persistNodes) { 

        // transfer refs from persist nodes to new scene
        for (let i = 0, l = persistNodes.length; i < l; i++) {
            var node = persistNodes[i];
            var sceneDeps = dependUtil._depends.get(newScene._id);
            var deps = _persistNodeDeps.get(node.uuid);
            for (let i = 0, l = deps.length; i < l; i++) {
                var dependAsset = assets.get(deps[i]);
                if (dependAsset) {
                    dependAsset._addRef();
                }
            }
            if (sceneDeps) {
                !sceneDeps.persistDeps && (sceneDeps.persistDeps = []);
                sceneDeps.persistDeps.push.apply(sceneDeps.persistDeps, deps);
            }
        }

        if (oldScene) {
            var childs = dependUtil.getDeps(oldScene._id);
            for (let i = 0, l = childs.length; i < l; i++) {
                let asset = assets.get(childs[i]);
                asset && asset._removeRef();
                if (CC_TEST || oldScene.autoReleaseAssets) this.release(asset);
            }
            var dependencies = dependUtil._depends.get(oldScene._id);
            if (dependencies && dependencies.persistDeps) {
                var persistDeps = dependencies.persistDeps;
                for (let i = 0, l = persistDeps.length; i < l; i++) {
                    let asset = assets.get(persistDeps[i]);
                    asset && asset._removeRef();
                    if (CC_TEST || oldScene.autoReleaseAssets) this.release(asset);
                }
            }
            dependUtil.remove(oldScene._id);
        }
    },

    /**
     * !#en
     * Lock this asset, this asset can not be released unless unlock it
     * 
     * !#zh
     * 锁上此资源，除非解锁，否则此资源不能被释放
     * 
     * @method lock
     * @param {Asset} asset - The asset to be locked
     * 
     * @typescript
     * lock(asset: cc.Asset): void
     */
    lock (asset) {
        if (asset instanceof cc.Asset) {
            _lockedAsset[asset._uuid] = true;
        }
    },

    /**
     * !#en
     * Unlock this asset, this asset can be released normally
     * 
     * !#zh
     * 解锁此资源，此资源能被正常释放
     * 
     * @method unlock
     * @param {Asset} asset - The asset to be unlocked
     * 
     * @typescript
     * unlock(asset: cc.Asset): void
     */
    unlock (asset) {
        if (asset instanceof cc.Asset) {
            delete _lockedAsset[asset._uuid];
        }
    },

    /**
     * !#en
     * Indicates whether or not this asset is locked
     * 
     * !#zh
     * 表明此资源是否被加锁
     * 
     * @method isLocked
     * @param {Asset} asset - The asset
     * 
     * @typescript
     * isLocked(asset: cc.Asset): boolean
     */
    isLocked (asset) {
        if (asset instanceof cc.Asset) {
            return asset._uuid in _lockedAsset;
        }
        return null;
    },

    _free (asset, force) {
        if (!force) {
            var glTexture = null;
            if (asset instanceof cc.Texture2D) {
                glTexture = asset._texture;
            }
            else if (asset instanceof cc.SpriteFrame && asset._texture) {
                glTexture = asset._texture._texture;
            }
    
            if (glTexture && glTexture._glID != -1) {
                var textureUnits = cc.renderer.device._current.textureUnits;
                for (var i = 0; i < textureUnits.length; i++) {
                    if (glTexture === textureUnits[i]) {
                        console.error(`this texture ${asset._uuid} is being used`);
                        return;
                    }
                }
            }

            if (asset._ref !== 0) {
                // check circular reference
                var refs = Object.create(null);
                refs[asset._uuid] = asset._ref;

                (function checkCircularReference (asset, refs) {
                    var depends = dependUtil.getDeps(asset._uuid);
                    for (let i = 0, l = depends.length; i < l; i++) {
                        var dependAsset = assets.get(depends[i]);
                        if (dependAsset) {
                            if (!(dependAsset._uuid in refs)) { 
                                refs[dependAsset._uuid] = dependAsset._ref - 1;
                                if (refs[dependAsset._uuid] === 0) {
                                    checkCircularReference(dependAsset, refs);
                                }
                            }
                            else {
                                refs[dependAsset._uuid]--;
                            } 
                        }
                    }
                })(asset, refs);

                if (refs[asset._uuid] !== 0) return; 
            }
        }
    
        // remove from cache
        assets.remove(asset._uuid);
        var depends = dependUtil.getDeps(asset._uuid);
        for (let i = 0, l = depends.length; i < l; i++) {
            var dependAsset = assets.get(depends[i]);
            if (dependAsset) {
                dependAsset._removeRef();
                finalizer._free(dependAsset, force);
            }
        }
        asset.destroy();
        dependUtil.remove(asset._uuid);
    },

    /**
     * !#en
     * Refer to {{#crossLink "assetManager/release:method"}}{{/crossLink}} for detailed informations
     * 
     * !#zh
     * 详细信息请参考 {{#crossLink "assetManager/release:method"}}{{/crossLink}}
     * 
     * @method release
     * @param {Asset|RawAsset} asset - The asset to be released
     * @param {boolean} [force] - Indicates whether or not release this asset forcely
     *
     * @typescript
     * release(asset: cc.Asset, force?: boolean): void
     */
    release (asset, force) {
        if (!(asset instanceof cc.Asset)) return;
        if (finalizer.isLocked(asset)) return;
        if (force) {
            finalizer._free(asset, force);
        }
        else {
            _toDelete.add(asset._uuid, asset);
            if (!eventListener) {
                eventListener = true;
                cc.director.once(cc.Director.EVENT_AFTER_DRAW, function () {
                    eventListener = false;
                    _toDelete.forEach(function (asset) {
                        finalizer._free(asset);
                    });
                    _toDelete.clear();
                });
            }
        }
    }
};


module.exports = finalizer;