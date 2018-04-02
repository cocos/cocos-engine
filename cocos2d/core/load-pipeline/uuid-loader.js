/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
require('../platform/deserialize');
var LoadingItems = require('./loading-items');

function isSceneObj (json) {
    var SCENE_ID = 'cc.Scene';
    var PREFAB_ID = 'cc.Prefab';
    return json && (
               (json[0] && json[0].__type__ === SCENE_ID) ||
               (json[1] && json[1].__type__ === SCENE_ID) ||
               (json[0] && json[0].__type__ === PREFAB_ID)
           );
}

function parseDepends (item, asset, tdInfo, deferredLoadRawAssetsInRuntime) {
    var uuidList = tdInfo.uuidList;
    var objList = tdInfo.uuidObjList;
    var propList = tdInfo.uuidPropList;
    var stillUseUrl = tdInfo._stillUseUrl;
    var depends;
    var i, dependUuid;
    // cache dependencies for auto release
    var dependKeys = item.dependKeys = [];

    if (deferredLoadRawAssetsInRuntime) {
        depends = [];
        // parse depends assets
        for (i = 0; i < uuidList.length; i++) {
            dependUuid = uuidList[i];
            var obj = objList[i];
            var prop = propList[i];
            var info = cc.AssetLibrary._getAssetInfoInRuntime(dependUuid);
            if (info.raw) {
                // skip preloading raw assets
                // TODO - skip preloading native texture
                var url = info.url;
                obj[prop] = url;
                dependKeys.push(url);
            }
            else {
                // declare depends assets
                depends.push({
                    type: 'uuid',
                    uuid: dependUuid,
                    deferredLoadRaw: true,
                    _owner: obj,
                    _ownerProp: prop,
                    _stillUseUrl: stillUseUrl[i]
                });
            }
        }
    }
    else {
        depends = new Array(uuidList.length);

        // declare depends assets
        for (i = 0; i < uuidList.length; i++) {
            dependUuid = uuidList[i];
            depends[i] = {
                type: 'uuid',
                uuid: dependUuid,
                _owner: objList[i],
                _ownerProp: propList[i],
                _stillUseUrl: stillUseUrl[i]
            };
        }

        // parse native
        if (asset._native && !asset.constructor.preventPreloadNativeObject) {
            depends.push({
                url: asset.nativeUrl,
                // For image, we should skip loader otherwise it will load a new texture
                skips: [ 'Loader' ],
                _owner: asset,
                _ownerProp: '_nativeAsset',
            });
        }
    }

    return depends;
}

function loadDepends (pipeline, item, asset, depends, callback) {
    // Predefine content for dependencies usage
    item.content = asset;
    var dependKeys = item.dependKeys;
    pipeline.flowInDeps(item, depends, function (errors, items) {
        var item, missingAssetReporter;
        for (var src in items.map) {
            item = items.map[src];
            if (item.uuid && item.content) {
                item.content._uuid = item.uuid;
            }
        }
        for (var i = 0; i < depends.length; i++) {
            var dep = depends[i];
            var dependSrc = dep.uuid;
            var dependUrl = dep.url;
            var dependObj = dep._owner;
            var dependProp = dep._ownerProp;
            item = items.map[dependUrl];
            if (item) {
                var thisOfLoadCallback = dep;
                function loadCallback (item) {
                    var value;
                    if (this._stillUseUrl) {
                        value = (item.content instanceof cc.Texture2D) ? item.content.nativeUrl : item.rawUrl
                    }
                    else {
                        value = item.content;
                    }
                    this._owner[this._ownerProp] = value;
                    if (item.uuid !== asset._uuid && dependKeys.indexOf(item.id) < 0) {
                        dependKeys.push(item.id);
                    }
                }
                if (item.complete || item.content) {
                    if (item.error) {
                        if (CC_EDITOR && item.error.errorCode === 'db.NOTFOUND') {
                            if (!missingAssetReporter) {
                                var MissingObjectReporter = Editor.require('app://editor/page/scene-utils/missing-object-reporter');
                                missingAssetReporter = new MissingObjectReporter(asset);
                            }
                            missingAssetReporter.stashByOwner(dependObj, dependProp, Editor.serialize.asAsset(dependSrc));
                        }
                        else {
                            cc._throw(item.error);
                        }
                    }
                    else {
                        loadCallback.call(thisOfLoadCallback, item);
                    }
                }
                else {
                    // item was removed from cache, but ready in pipeline actually
                    var queue = LoadingItems.getQueue(item);
                    // Hack to get a better behavior
                    var list = queue._callbackTable[dependSrc];
                    if (list) {
                        list.unshift(loadCallback, thisOfLoadCallback);
                    }
                    else {
                        queue.addListener(dependSrc, loadCallback, thisOfLoadCallback);
                    }
                }
            }
        }
        if (CC_EDITOR && missingAssetReporter) {
            missingAssetReporter.reportByOwner();
        }
        callback(null, asset);
    });
}

// can deferred load raw assets in runtime
function canDeferredLoad (asset, item, isScene) {
    if (CC_EDITOR) {
        return false;
    }
    var res = item.deferredLoadRaw;
    if (res) {
        // check if asset support deferred
        if (cc.Class.isInstanceOf(asset, cc.Asset) && asset.constructor.preventDeferredLoadDependents) {
            res = false;
        }
    }
    else if (isScene) {
        if (asset instanceof cc.SceneAsset || asset instanceof cc.Prefab) {
            res = asset.asyncLoadAssets;
            //if (res) {
            //    cc.log('deferred load raw assets for ' + item.id);
            //}
        }
    }
    return res;
}

var MissingClass;

function loadUuid (item, callback) {
    if (CC_EDITOR) {
        MissingClass = MissingClass || Editor.require('app://editor/page/scene-utils/missing-class-reporter').MissingClass;
    }

    var json;
    if (typeof item.content === 'string') {
        try {
            json = JSON.parse(item.content);
        }
        catch (e) {
            return new Error(cc._getError(4923, item.id, e.stack));
        }
    }
    else if (typeof item.content === 'object') {
        json = item.content;
    }
    else {
        return new Error(cc._getError(4924));
    }

    var classFinder;
    var isScene = isSceneObj(json);
    if (isScene) {
        if (CC_EDITOR) {
            MissingClass.hasMissingClass = false;
            classFinder = function (type, data, owner, propName) {
                var res = MissingClass.classFinder(type, data, owner, propName);
                if (res) {
                    return res;
                }
                return cc._MissingScript.getMissingWrapper(type, data);
            };
            classFinder.onDereferenced = MissingClass.classFinder.onDereferenced;
        }
        else {
            classFinder = cc._MissingScript.safeFindClass;
        }
    }
    else {
        classFinder = function (id) {
            var cls = js._getClassById(id);
            if (cls) {
                return cls;
            }
            cc.warnID(4903, id);
            return Object;
        };
    }

    var tdInfo = cc.deserialize.Details.pool.get();

    var asset;
    try {
        asset = cc.deserialize(json, tdInfo, {
            classFinder: classFinder,
            target: item.existingAsset,
            customEnv: item
        });
    }
    catch (e) {
        cc.deserialize.Details.pool.put(tdInfo);
        var err = CC_JSB ? (e + '\n' + e.stack) : e.stack;
        return new Error(cc._getError(4925, item.id, err));
    }

    asset._uuid = item.uuid;

    if (CC_EDITOR && isScene && MissingClass.hasMissingClass) {
        MissingClass.reportMissingClass(asset);
    }

    var deferredLoad = canDeferredLoad(asset, item, isScene);
    var depends = parseDepends(item, asset, tdInfo, deferredLoad);

    cc.deserialize.Details.pool.put(tdInfo);

    if (depends.length === 0) {
        return callback(null, asset);
    }
    loadDepends(this.pipeline, item, asset, depends, callback);
}

module.exports = loadUuid;
loadUuid.isSceneObj = isSceneObj;
