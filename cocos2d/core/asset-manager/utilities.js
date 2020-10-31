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
const { isScene, decodeUuid } = require('./helper');
const { assets } = require('./shared');
const { callInNextTick } = require('../platform/utils');
const MissingObjectReporter = CC_EDITOR && Editor.require('app://editor/page/scene-utils/missing-object-reporter');
require('../assets/CCAsset');

var utils = {

    processOptions (options) {
        if (CC_EDITOR) return;
        var uuids = options.uuids;
        var paths = options.paths;
        var types = options.types;
        var bundles = options.deps;
        var realEntries = options.paths = Object.create(null);

        if (options.debug === false) {
            for (let i = 0, l = uuids.length; i < l; i++) {
                uuids[i] = decodeUuid(uuids[i]);
            }

            for (let id in paths) {
                let entry = paths[id];
                let type = entry[1];
                entry[1] = types[type];
            }
        }
        else {
            var out = Object.create(null);
            for (let i = 0, l = uuids.length; i < l; i++) {
                let uuid = uuids[i];
                uuids[i] = out[uuid] = decodeUuid(uuid);
            }
            uuids = out;
        }

        for (let id in paths) {
            let entry = paths[id];
            realEntries[uuids[id]] = entry;
        }

        var scenes = options.scenes;
        for (let name in scenes) {
            let uuid = scenes[name];
            scenes[name] = uuids[uuid];
        }

        var packs = options.packs;
        for (let packId in packs) {
            let packedIds = packs[packId];
            for (let j = 0; j < packedIds.length; ++j) {
                packedIds[j] = uuids[packedIds[j]];
            }
        }

        var versions = options.versions;
        if (versions) {
            for (let folder in versions) {
                var entries = versions[folder];
                for (let i = 0; i < entries.length; i += 2) {
                    let uuid = entries[i];
                    entries[i] = uuids[uuid] || uuid;
                }
            }
        }

        var redirect = options.redirect;
        if (redirect) {
            for (let i = 0; i < redirect.length; i += 2) {
                redirect[i] = uuids[redirect[i]];
                redirect[i + 1] = bundles[redirect[i + 1]];
            }
        }

    },

    clear (task, clearRef) {
        for (var i = 0, l = task.input.length; i < l; i++) {
            var item = task.input[i];
            if (clearRef) {
                !item.isNative && item.content && item.content.decRef && item.content.decRef(false);
            }
            item.recycle();
        }
        task.input = null;
    },

    urlAppendTimestamp (url) {
        if (cc.assetManager.downloader.appendTimeStamp && typeof url === 'string') {
            if (/\?/.test(url))
                return url + '&_t=' + (new Date() - 0);
            else
                return url + '?_t=' + (new Date() - 0);
        }
        return url;
    },

    retry (process, times, wait, onComplete, index) {
        index = index || 0;
        process(index, function (err, result) {
            index++;
            if (!err || index > times) {
                onComplete && onComplete(err, result);
            }
            else {
                setTimeout(function () {
                    utils.retry(process, times, wait, onComplete, index);
                }, wait);
            }
        });
    },

    getDepends (uuid, data, exclude, depends, preload, asyncLoadAssets, config) {
        try {
            var info = dependUtil.parse(uuid, data);
            var includeNative = true;
            if (data instanceof cc.Asset && (!data.__nativeDepend__ || data._nativeAsset)) includeNative = false; 
            if (!preload) {
                asyncLoadAssets = !CC_EDITOR && (!!data.asyncLoadAssets || (asyncLoadAssets && !info.preventDeferredLoadDependents));
                for (let i = 0, l = info.deps.length; i < l; i++) {
                    let dep = info.deps[i];
                    if (!(dep in exclude)) {
                        exclude[dep] = true;
                        depends.push({uuid: dep, __asyncLoadAssets__: asyncLoadAssets, bundle: config && config.name});
                    }
                }

                if (includeNative && !asyncLoadAssets && !info.preventPreloadNativeObject && info.nativeDep) {
                    config && (info.nativeDep.bundle = config.name);
                    depends.push(Object.assign({}, info.nativeDep));
                }
                
            } else {
                for (let i = 0, l = info.deps.length; i < l; i++) {
                    let dep = info.deps[i];
                    if (!(dep in exclude)) {
                        exclude[dep] = true;
                        depends.push({uuid: dep, bundle: config && config.name});
                    }
                }
                if (includeNative && info.nativeDep) {
                    config && (info.nativeDep.bundle = config.name);
                    depends.push(Object.assign({}, info.nativeDep));
                }
            }
        }
        catch (e) {
            cc.error(e.message, e.stack);
        }
    },
    
    cache (id, asset, cacheAsset) {
        if (!asset) return;
        var _isScene = isScene(asset);
        if (!_isScene && cacheAsset) {
            assets.add(id, asset);
        }
        if (_isScene) {
            if (CC_EDITOR && !asset.scene) {
                Editor.error('Sorry, the scene data of "%s" is corrupted!', asset._uuid);
            }
        }
    },

    setProperties (uuid, asset, assetsMap) {

        var missingAsset = false;
        let depends = asset.__depends__;
        if (depends) {
            var missingAssetReporter = null;
            for (var i = 0, l = depends.length; i < l; i++) {
                var depend = depends[i];
                var dependAsset = assetsMap[depend.uuid + '@import'];
                if (!dependAsset) {
                    if (CC_EDITOR) {
                        !missingAssetReporter && (missingAssetReporter = new MissingObjectReporter(asset));
                        missingAssetReporter.stashByOwner(depend.owner, depend.prop, Editor.serialize.asAsset(depend.uuid));
                    }
                    else {
                        cc.error('The asset ' + depend.uuid + ' is missing!');
                    }
                    missingAsset = true;
                }
                else {
                    depend.owner[depend.prop] = dependAsset.addRef();
                }
            }

            missingAssetReporter && missingAssetReporter.reportByOwner();
            asset.__depends__ = undefined;
        }
        
        if (asset.__nativeDepend__) {
            if (!asset._nativeAsset) {
                if (assetsMap[uuid + '@native']) {
                    asset._nativeAsset = assetsMap[uuid + '@native'];
                }
                else {
                    missingAsset = true;
                    if (CC_EDITOR) {
                        console.error(`the native asset of ${uuid} is missing!`);
                    }
                }
            }
            asset.__nativeDepend__ = undefined;
        }
        return missingAsset;
    },

    gatherAsset (task) {
        let source = task.source;
        if (!task.options.__outputAsArray__ && source.length === 1) {
            task.output = source[0].content;
        }
        else {
            let output = task.output = [];
            for (var i = 0, l = source.length; i < l; i++) {
                output.push(source[i].content);
            }
        }
    },

    forEach (array, process, onComplete) {
        var count = 0;
        var errs = [];
        if (array.length === 0) onComplete && onComplete(errs);
        for (var i = 0, l = array.length; i < l; i++) {
            process(array[i], function (err) {
                if (err) {
                    errs.push(err);
                }
                count ++;
                if (count === l) {
                    onComplete && onComplete(errs);
                }
            });
        }
    },

    parseParameters (options, onProgress, onComplete) {
        if (onComplete === undefined) {
            var isCallback = typeof options === 'function';
            if (onProgress) {
                onComplete = onProgress;
                if (!isCallback) {
                    onProgress = null;
                }
            }
            else if (onProgress === undefined && isCallback) {
                onComplete = options;
                options = null;
                onProgress = null;
            }
            if (onProgress !== undefined && isCallback) {
                onProgress = options;
                options = null;
            }
        }
        options = options || Object.create(null);
        return { options, onProgress, onComplete };
    },

    parseLoadResArgs (type, onProgress, onComplete) {
        if (onComplete === undefined) {
            var isValidType = cc.js.isChildClassOf(type, cc.Asset);
            if (onProgress) {
                onComplete = onProgress;
                if (isValidType) {
                    onProgress = null;
                }
            }
            else if (onProgress === undefined && !isValidType) {
                onComplete = type;
                onProgress = null;
                type = null;
            }
            if (onProgress !== undefined && !isValidType) {
                onProgress = type;
                type = null;
            }
        }
        return { type, onProgress, onComplete };
    },

    checkCircleReference (owner, uuid, map, checked) {
        if (!checked) { 
            checked = Object.create(null);
        }
        let item = map[uuid];
        if (!item || checked[uuid]) {
            return false;
        }
        checked[uuid] = true;
        var result = false;
        var deps = dependUtil.getDeps(uuid);
        if (deps) {
            for (var i = 0, l = deps.length; i < l; i++) {
                var dep = deps[i];
                if (dep === owner || utils.checkCircleReference(owner, dep, map, checked)) {
                    result = true;
                    break;
                }
            }
        }
        return result;
    },

    asyncify (cb) {
        return function (p1, p2) {
            if (!cb) return;
            let refs = [];
            if (Array.isArray(p2)) {
                p2.forEach(x => x instanceof cc.Asset && refs.push(x.addRef()));
            } else {
                p2 instanceof cc.Asset && refs.push(p2.addRef());
            }
            callInNextTick(() => {
                refs.forEach(x => x.decRef(false));
                cb(p1, p2);
            }); 
        }
    }
};

module.exports = utils;