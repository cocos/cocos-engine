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

var JS = require('../platform/js');
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

function loadDepends (pipeline, item, asset, tdInfo, deferredLoadRawAssetsInRuntime, callback) {
    var uuidList = tdInfo.uuidList;
    var objList, propList, depends;
    var i, dependUuid;
    // cache dependencies for auto release
    var dependKeys = item.dependKeys = [];

    if (deferredLoadRawAssetsInRuntime) {
        objList = [];
        propList = [];
        depends = [];
        // parse depends assets
        for (i = 0; i < uuidList.length; i++) {
            dependUuid = uuidList[i];
            var obj = tdInfo.uuidObjList[i];
            var prop = tdInfo.uuidPropList[i];
            var info = cc.AssetLibrary._getAssetInfoInRuntime(dependUuid);
            if (info.raw) {
                // skip preloading raw assets
                var url = info.url;
                obj[prop] = url;
                dependKeys.push(url);
            }
            else {
                objList.push(obj);
                propList.push(prop);
                // declare depends assets
                depends.push({
                    type: 'uuid',
                    uuid: dependUuid,
                    deferredLoadRaw: true,
                });
            }
        }
    }
    else {
        objList = tdInfo.uuidObjList;
        propList = tdInfo.uuidPropList;
        depends = new Array(uuidList.length);
        // declare depends assets
        for (i = 0; i < uuidList.length; i++) {
            dependUuid = uuidList[i];
            depends[i] = {
                type: 'uuid',
                uuid: dependUuid
            };
        }
    }
    // declare raw
    if (tdInfo.rawProp) {
        objList.push(asset);
        propList.push(tdInfo.rawProp);
        depends.push(item.url);
    }
    // preload raw files
    if (asset._preloadRawFiles) {
        var finalCallback = callback;
        callback = function () {
            asset._preloadRawFiles(function (err) {
                finalCallback(err || null, asset);
            });
        };
    }
    // fast path
    if (depends.length === 0) {
        cc.deserialize.Details.pool.put(tdInfo);
        return callback(null, asset);
    }

    // Predefine content for dependencies usage
    item.content = asset;
    pipeline.flowInDeps(item, depends, function (errors, items) {
        var item, missingAssetReporter;
        for (var src in items.map) {
            item = items.map[src];
            if (item.uuid && item.content) {
                item.content._uuid = item.uuid;
            }
        }
        for (var i = 0; i < depends.length; i++) {
            var dependSrc = depends[i].uuid;
            var dependUrl = depends[i].url;
            var dependObj = objList[i];
            var dependProp = propList[i];
            item = items.map[dependUrl];
            if (item) {
                var thisOfLoadCallback = {
                    obj: dependObj,
                    prop: dependProp
                };
                function loadCallback (item) {
                    var value = item.isRawAsset ? item.url : item.content;
                    this.obj[this.prop] = value;
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
        cc.deserialize.Details.pool.put(tdInfo);
        callback(null, asset);
    });
}

// can deferred load raw assets in runtime
function canDeferredLoad (asset, item, isScene) {
    if (CC_EDITOR || CC_JSB) {
        return false;
    }
    var res = item.deferredLoadRaw;
    if (res) {
        // check if asset support deferred
        if (asset instanceof cc.Asset && asset.constructor.preventDeferredLoadDependents) {
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
            return new Error('Uuid Loader: Parse asset [' + item.id + '] failed : ' + e.stack);
        }
    }
    else if (typeof item.content === 'object') {
        json = item.content;
    }
    else {
        return new Error('JSON Loader: Input item doesn\'t contain string content');
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
            var cls = JS._getClassById(id);
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
        return new Error('Uuid Loader: Deserialize asset [' + item.id + '] failed : ' + err);
    }

    asset._uuid = item.uuid;

    if (CC_EDITOR && isScene && MissingClass.hasMissingClass) {
        MissingClass.reportMissingClass(asset);
    }

    var deferredLoad = canDeferredLoad(asset, item, isScene);
    loadDepends(this.pipeline, item, asset, tdInfo, deferredLoad, callback);
}

module.exports = loadUuid;
loadUuid.isSceneObj = isSceneObj;
