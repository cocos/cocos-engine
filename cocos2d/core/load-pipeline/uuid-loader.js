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

var SCENE_ID = 'cc.Scene';

function loadUuid (item, callback) {
    var json, 
        uuid = item.src,
        url = item.url;
    if (typeof item.content === 'string') {
        try {
            json = JSON.parse(item.content);
        }
        catch (e) {
            callback( new Error('Uuid Loader: Parse asset [' + item.src + '] failed : ' + e) );
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

    var isScene = json && (
                              (json[0] && json[0].__type__ === SCENE_ID) ||
                              (json[1] && json[1].__type__ === SCENE_ID)
                          );
    var classFinder = isScene ? cc._MissingScript.safeFindClass : function (id) {
        var cls = JS._getClassById(id);
        if (cls) {
            return cls;
        }
        cc.warn('Can not get class "%s"', id);
        return Object;
    };

    var tdInfo = cc.sys.isNative ? new cc.deserialize.Details() : (item.deserializeInfo || _tdInfo);

    var asset = cc.deserialize(json, tdInfo, {
        classFinder: classFinder,
        target: item.existingAsset
    });

    var dependsSrcs = JS.array.copy(tdInfo.uuidList);
    var ownerList = JS.array.copy(tdInfo.uuidObjList);
    var propList = JS.array.copy(tdInfo.uuidPropList);

    var depends = new Array(dependsSrcs.length);
    // load depends assets
    for (var i = 0; i < dependsSrcs.length; i++) {
        var dependSrc = dependsSrcs[i];
        depends[i] = {
            src: dependSrc,
            type: 'uuid',
            uuid: dependSrc
        };
    }
    // load raw
    if (tdInfo.rawProp) {
        dependsSrcs.push(url);
        ownerList.push(asset);
        propList.push(tdInfo.rawProp);
        depends.push(url);
    }
    var pipeline = this.pipeline;
    if (depends.length > 0) {
        pipeline.flowInDeps(depends, function (items) {
            var item;
            for (var src in items) {
                item = items[src];
                if (item.uuid && item.content) {
                    item.content._uuid = item.uuid;
                }
            }
            for (var i = 0; i < dependsSrcs.length; i++) {
                var dependSrc = dependsSrcs[i];
                var obj = ownerList[i];
                var dependProp = propList[i];
                item = items[dependSrc];
                if (item) {
                    if (item.complete) {
                        var value = item.isRawAsset ? (item.url || item.src) : item.content;
                        obj[dependProp] = value;
                    }
                    else {
                        var loadCallback = function (item) {
                            var value = item.isRawAsset ? (item.url || item.src) : item.content;
                            this.obj[this.prop] = value;
                        };
                        var target = {
                            obj: obj,
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
            callback(null, asset);
        });
    }
    else {
        callback(null, asset);
    }
    asset._uuid = uuid;

    // tdInfo 是用来重用的临时对象，每次使用后都要重设，这样才对 GC 友好。
    tdInfo.reset();
}

module.exports = loadUuid;