/*
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
 */

/**
 * @hidden
 */

import * as js from '../utils/js';
import {_getClassById} from '../utils/js';
import { getError } from '../platform/debug';
import { LoadingItems } from './loading-items';
import { decompressJson } from './utils';
import { EDITOR, DEBUG, JSB } from 'internal:constants';
import { legacyCC } from '../global-exports';

export function isSceneObj (json) {
    let SCENE_ID = 'cc.Scene';
    let PREFAB_ID = 'cc.Prefab';
    return json && (
               (json[0] && json[0].__type__ === SCENE_ID) ||
               (json[1] && json[1].__type__ === SCENE_ID) ||
               (json[0] && json[0].__type__ === PREFAB_ID)
           );
}

function parseDepends (item, asset, tdInfo, deferredLoadRawAssetsInRuntime) {
    let uuidList = tdInfo.uuidList;
    let objList = tdInfo.uuidObjList;
    let propList = tdInfo.uuidPropList;
    let stillUseUrl = tdInfo._stillUseUrl;
    let depends;
    let i, dependUuid;
    // cache dependencies for auto release
    let dependKeys: Array<string> = item.dependKeys = [];

    if (deferredLoadRawAssetsInRuntime) {
        depends = [];
        // parse depends assets
        for (i = 0; i < uuidList.length; i++) {
            dependUuid = uuidList[i];
            let obj = objList[i];
            let prop = propList[i];
            let info = legacyCC.AssetLibrary._getAssetInfoInRuntime(dependUuid);
            if (info.raw) {
                // skip preloading raw assets
                let url = info.url;
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
    let dependKeys = item.dependKeys;
    pipeline.flowInDeps(item, depends, function (errors, items) {
        let item, missingAssetReporter;
        let itemsMap = items.map;
        for (let src in itemsMap) {
            item = itemsMap[src];
            if (item.uuid && item.content) {
                item.content._uuid = item.uuid;
            }
        }
        for (let i = 0; i < depends.length; i++) {
            let dep = depends[i];
            let dependSrc = dep.uuid;
            let dependUrl = dep.url;
            let dependObj = dep._owner;
            let dependProp = dep._ownerProp;
            item = itemsMap[dependUrl];
            if (!item) {
                continue;
            }

            let loadCallbackCtx = dep;
            // @ts-ignore
            function loadCallback (item) {
                let value = item.content;
                // @ts-ignore
                if (this._stillUseUrl) {
                    value = value ? value.nativeUrl : item.rawUrl;
                }
                // @ts-ignore
                this._owner[this._ownerProp] = value;
                if (item.uuid !== asset._uuid && dependKeys.indexOf(item.id) < 0) {
                    dependKeys.push(item.id);
                }
            }

            if (item.complete || item.content) {
                if (item.error) {
                    if (EDITOR && item.error.errorCode === 'db.NOTFOUND') {
                        if (!missingAssetReporter) {
                            missingAssetReporter = new EditorExtends.MissingReporter.object(asset);
                        }
                        missingAssetReporter.stashByOwner(dependObj, dependProp, EditorExtends.serialize.asAsset(dependSrc));
                    }
                    else {
                        legacyCC._throw(item.error);
                    }
                }
                else {
                    loadCallback.call(loadCallbackCtx, item);
                }
            }
            else {
                // item was removed from cache, but ready in pipeline actually
                let queue = LoadingItems.getQueue(item);
                if (queue) {
                    queue.addListener(dependSrc, loadCallback, loadCallbackCtx);
                }
            }
        }
        // Emit dependency errors in runtime, but not in editor,
        // because editor need to open the scene / prefab to let user fix missing asset issues
        if (EDITOR && missingAssetReporter) {
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
    if (EDITOR) {
        return false;
    }
    let res = item.deferredLoadRaw;
    if (res) {
        // check if asset support deferred
        if ((asset instanceof legacyCC.Asset) && asset.constructor.preventDeferredLoadDependents) {
            res = false;
        }
    }
    else if (isScene) {
        if (asset instanceof legacyCC.SceneAsset || asset instanceof legacyCC.Prefab) {
            res = asset.asyncLoadAssets;
            //if (res) {
            //    cc.log('deferred load raw assets for ' + item.id);
            //}
        }
    }
    return res;
}

let MissingClass;

export function loadUuid (item, callback) {
    if (EDITOR) {
        MissingClass = MissingClass || EditorExtends.MissingReporter.classInstance;
    }

    let json;
    if (typeof item.content === 'string') {
        try {
            json = JSON.parse(item.content);
            if (!DEBUG && json.keys && json.data) {
                let keys = json.keys;
                json = json.data;
                decompressJson(json, keys);
            }
        }
        catch (e) {
            return new Error(getError(4923, item.id, e.stack));
        }
    }
    else if (typeof item.content === 'object') {
        json = item.content;
    }
    else {
        return new Error(getError(4924));
    }

    if (json === undefined || json === null) {
        return new Error(getError(4923, item.id));
    }

    let classFinder;
    let isScene = isSceneObj(json);
    if (isScene) {
        if (EDITOR) {
            MissingClass.hasMissingClass = false;
            classFinder = function (type, data, owner, propName) {
                let res = MissingClass.classFinder(type, data, owner, propName);
                if (res) {
                    return res;
                }
                return legacyCC._MissingScript.getMissingWrapper(type, data);
            };
            classFinder.onDereferenced = MissingClass.classFinder.onDereferenced;
        }
        else {
            classFinder = legacyCC._MissingScript.safeFindClass;
        }
    }
    else {
        classFinder = function (id) {
            let cls = js._getClassById(id);
            if (cls) {
                return cls;
            }
            legacyCC.warnID(4903, id);
            return Object;
        };
    }

    let tdInfo = legacyCC.deserialize.Details.pool.get();

    let asset;
    try {
        asset = legacyCC.deserialize(json, tdInfo, {
            classFinder: classFinder,
            target: item.existingAsset,
            customEnv: item
        });
    }
    catch (e) {
        legacyCC.deserialize.Details.pool.put(tdInfo);
        console.error(e);
        return new Error(`Failed to load asset ${item.id}, exception occurs during deserialization: ${JSB ? (e + '\n' + e.stack) : e.stack}.`);
        // return new Error(debug.getError(4925, item.id, err));
    }

    asset._uuid = item.uuid;

    if (EDITOR && isScene && MissingClass.hasMissingClass) {
        MissingClass.reportMissingClass(asset);
    }

    let deferredLoad = canDeferredLoad(asset, item, isScene);
    let depends = parseDepends(item, asset, tdInfo, deferredLoad);

    legacyCC.deserialize.Details.pool.put(tdInfo);

    let wrappedCallback = function(err, asset) {
        if (!err && asset.onLoaded) {
            try {
                asset.onLoaded();
            } catch(error) {
                err = error;
            }
        }
        if (EDITOR && !isScene) {
            let dependListener = legacyCC.AssetLibrary.dependListener;
            let assetListener = legacyCC.AssetLibrary.assetListener;

            // @ts-ignore
            function propSetter (asset, obj, propName, oldAsset, newAsset) {
                if (oldAsset === newAsset || obj[propName] === newAsset) {
                    return;
                }
                if (asset instanceof legacyCC.Material && newAsset instanceof legacyCC.Texture2D) {
                    for (let i = 0, l = asset.passes.length; i < l; i++) {
                        if (asset.getProperty(propName, i) === oldAsset) {
                            asset.setProperty(propName, newAsset, i);
                        }
                    }
                } else {
                    obj[propName] = newAsset;
                    asset.onLoaded && asset.onLoaded();
                }

                dependListener.emit(asset._uuid, asset);
                assetListener.emit(asset._uuid, asset);
            };

            if (dependListener) {
                item.references = {};
                for (let i = 0, l = depends.length; i < l; i++) {
                    let dep = depends[i];
                    let dependSrc = dep.uuid;
                    if (dependSrc) {
                        let dependObj = dep._owner;
                        let dependProp = dep._ownerProp;
                        let onDirty = propSetter.bind(null, asset, dependObj, dependProp);
                        dependListener.on(dependSrc, onDirty);
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

    // @ts-ignore
    loadDepends(this.pipeline, item, asset, depends, wrappedCallback);
}

loadUuid.isSceneObj = isSceneObj;
