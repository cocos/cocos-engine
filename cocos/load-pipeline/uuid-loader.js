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

import * as js from '../core/utils/js';
import {_getClassById} from '../core/utils/js';
import * as debug from '../core/platform/CCDebug';
import deserialize from '../core/data/deserialize';
import LoadingItems from './loading-items';

export function isSceneObj (json) {
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

        // load native object (Image/Audio) as depends
        if (asset._native && !asset.constructor.preventPreloadNativeObject) {
            depends.push({
                url: asset.nativeUrl,
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
        var itemsMap = items.map;
        for (var src in itemsMap) {
            item = itemsMap[src];
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
            item = itemsMap[dependUrl];
            if (!item) {
                continue;
            }

            var loadCallbackCtx = dep;
            function loadCallback (item) {
                var value = item.content;
                if (this._stillUseUrl) {
                    value = value ? value.nativeUrl : item.rawUrl;
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
                    loadCallback.call(loadCallbackCtx, item);
                }
            }
            else {
                // item was removed from cache, but ready in pipeline actually
                var queue = LoadingItems.getQueue(item);
                // Hack to get a better behavior
                var list = queue._callbackTable[dependSrc];
                if (list) {
                    list.unshift(loadCallback, loadCallbackCtx);
                }
                else {
                    queue.addListener(dependSrc, loadCallback, loadCallbackCtx);
                }
            }
        }
        // Emit dependency errors in runtime, but not in editor,
        // because editor need to open the scene / prefab to let user fix missing asset issues
        if (CC_EDITOR && missingAssetReporter) {
            missingAssetReporter.reportByOwner();
            callback(null, asset);
        }
        else {
            callback(errors, asset);
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
        if ((asset instanceof cc.Asset) && asset.constructor.preventDeferredLoadDependents) {
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

export function loadUuid (item, callback) {
    if (CC_EDITOR) {
        MissingClass = MissingClass || Editor.require('app://editor/page/scene-utils/missing-class-reporter').MissingClass;
    }

    var json;
    if (typeof item.content === 'string') {
        try {
            json = JSON.parse(item.content);
        }
        catch (e) {
            return new Error(debug.getError(4923, item.id, e.stack));
        }
    }
    else if (typeof item.content === 'object') {
        json = item.content;
    }
    else {
        return new Error(debug.getError(4924));
    }

    if (json === undefined || json === null) {
        return new Error(debug.getError(4923, item.id));
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
        return new Error(`Failed to load asset ${item.id}, exception occurs during serialization: ${err}.`);
        // return new Error(debug.getError(4925, item.id, err));
    }

    asset._uuid = item.uuid;

    if (CC_EDITOR && isScene && MissingClass.hasMissingClass) {
        MissingClass.reportMissingClass(asset);
    }

    var deferredLoad = canDeferredLoad(asset, item, isScene);
    var depends = parseDepends(item, asset, tdInfo, deferredLoad);

    cc.deserialize.Details.pool.put(tdInfo);

    var wrappedCallback = function(err, asset) {
        if (!err && asset.onLoaded) {
            try {
                asset.onLoaded();
            } catch(error) {
                err = error;
            }
        }
        if (CC_EDITOR && !isScene) {
            var dependListener = cc.AssetLibrary.dependListener;
            var assetListener = cc.AssetLibrary.assetListener;

            function propSetter (asset, obj, propName, oldAsset, newAsset) {
                if (oldAsset === newAsset || obj[propName] === newAsset) {
                    return;
                }
                if (asset instanceof cc.Material && newAsset instanceof cc.Texture2D) {
                    for (let i = 0, l = asset.passes.length; i < l; i++) {
                        if (asset.getProperty(propName, i) === oldAsset) {
                            asset.setProperty(propName, newAsset, i);
                        }
                    }
                } else {
                    obj[propName] = newAsset;
                    asset.onLoaded && asset.onLoaded();
                }

                dependListener.invoke(asset._uuid, asset);
                assetListener.invoke(asset._uuid, asset);
            };

            if (dependListener) {
                item.references = {};
                for (var i = 0, l = depends.length; i < l; i++) {
                    var dep = depends[i];
                    var dependSrc = dep.uuid;
                    if (dependSrc) {
                        var dependObj = dep._owner;
                        var dependProp = dep._ownerProp;
                        var onDirty = propSetter.bind(null, asset, dependObj, dependProp);
                        dependListener.add(dependSrc, onDirty);
                        item.references[dependSrc] = onDirty;
                    }
                }
            }
        }
        callback(err, asset);
    };

    if (depends.length === 0) {
        return wrappedCallback(null, asset);
    }

    loadDepends(this.pipeline, item, asset, depends, wrappedCallback);
}

loadUuid.isSceneObj = isSceneObj;
