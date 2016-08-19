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

// temp deserialize info
var _tdInfo = new cc.deserialize.Details();

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
    var uuid = item.id, uuidList = tdInfo.uuidList;
    var objList, propList, depends;
    var i, dependUuid;
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
            }
            else {
                objList.push(obj);
                propList.push(prop);
                // declare depends assets
                depends.push({
                    id: dependUuid,
                    type: 'uuid',
                    uuid: dependUuid,
                    deferredLoadRaw: true,
                });
            }
        }
    }
    else {
        objList = JS.array.copy(tdInfo.uuidObjList);
        propList = JS.array.copy(tdInfo.uuidPropList);
        depends = new Array(uuidList.length);
        // declare depends assets
        for (i = 0; i < uuidList.length; i++) {
            dependUuid = uuidList[i];
            depends[i] = {
                id: dependUuid,
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
    // fast path
    if (depends.length === 0) {
        asset._uuid = uuid;
        return callback(null, asset);
    }

    // cache dependencies for auto release
    var dependKeys = item.dependKeys = [];

    pipeline.flowInDeps(depends, function (items) {
        var item;
        for (var src in items) {
            item = items[src];
            if (item.uuid && item.content) {
                item.content._uuid = item.uuid;
            }
        }
        for (var i = 0; i < depends.length; i++) {
            var dependSrc = depends[i].uuid;
            var dependObj = objList[i];
            var dependProp = propList[i];
            item = items[dependSrc];
            if (item) {
                if (item.complete) {
                    var value = item.isRawAsset ? item.url : item.content;
                    dependObj[dependProp] = value;
                    dependKeys.push(item.isRawAsset ? item.url : dependSrc);
                }
                else {
                    // item was removed from cache, but ready in pipeline actually
                    var loadCallback = function (item) {
                        var value = item.isRawAsset ? item.url : item.content;
                        this.obj[this.prop] = value;
                        dependKeys.push(item.isRawAsset ? item.url : item.uuid);
                    };
                    var target = {
                        obj: dependObj,
                        prop: dependProp
                    };
                    // Hack to get a better behavior
                    var list = pipeline.getItems()._callbackTable[dependSrc];
                    if (list) {
                        list.unshift(loadCallback, target);
                    }
                    else {
                        pipeline.getItems().add(dependSrc, loadCallback, target);
                    }
                }
            }
        }
        asset._uuid = uuid;
        callback(null, asset);
        if (CC_EDITOR) {
            cc.loader.removeItem(uuid);
        }
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
        if (asset instanceof cc.Asset && asset.constructor.preventDeferredLoadDependents) {
            res = false;
        }
    }
    else if (isScene) {
        if (asset instanceof cc.SceneAsset) {
            res = asset.asyncLoadAssets;
            //if (res) {
            //    cc.log('deferred load raw assets for ' + item.id);
            //}
        }
        //else if (asset instanceof cc.Scene) {
        //    deferredLoadRawAssetsInRuntime = asset._asyncLoadAssets;
        //}
    }
    return res;
}

function loadUuid (item, callback) {
    var json;
    if (typeof item.content === 'string') {
        try {
            json = JSON.parse(item.content);
        }
        catch (e) {
            callback( new Error('Uuid Loader: Parse asset [' + item.id + '] failed : ' + e.stack) );
            return;
        }
    }
    else if (typeof item.content === 'object') {
        json = item.content;
    }
    else {
        callback( new Error('JSON Loader: Input item doesn\'t contain string content') );
        return;
    }

    var isScene = isSceneObj(json);
    var classFinder = isScene ? cc._MissingScript.safeFindClass : function (id) {
        var cls = JS._getClassById(id);
        if (cls) {
            return cls;
        }
        cc.warn('Can not get class "%s"', id);
        return Object;
    };

    var tdInfo = CC_JSB ? new cc.deserialize.Details() : (item.deserializeInfo || _tdInfo);

    var asset;
    try {
        asset = cc.deserialize(json, tdInfo, {
            classFinder: classFinder,
            target: item.existingAsset,
            customEnv: item
        });
    }
    catch (e) {
        var err = CC_JSB ? (e + '\n' + e.stack) : e.stack;
        callback( new Error('Uuid Loader: Deserialize asset [' + item.id + '] failed : ' + err) );
        return;
    }

    var deferredLoad = canDeferredLoad(asset, item, isScene);
    loadDepends(this.pipeline, item, asset, tdInfo, deferredLoad, callback);

    // tdInfo 是用来重用的临时对象，每次使用后都要重设，这样才对 GC 友好。
    tdInfo.reset();
}

module.exports = loadUuid;
loadUuid.isSceneObj = isSceneObj;
