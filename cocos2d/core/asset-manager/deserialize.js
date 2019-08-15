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

const js = require('../platform/js');
const helper = require('./helper');
require('../platform/deserialize');

var MissingClass;

function deserialize (json, options) {
    if (!json) return new Error('empty json');
    if (CC_EDITOR) {
        MissingClass = MissingClass || Editor.require('app://editor/page/scene-utils/missing-class-reporter').MissingClass;
    }
    var classFinder;
    var isScene = helper.isSceneObj(json);
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
            customEnv: options
        });
    }
    catch (e) {
        cc.deserialize.Details.pool.put(tdInfo);
        return e;
    }

    if (CC_EDITOR && isScene && MissingClass.hasMissingClass) {
        MissingClass.reportMissingClass(asset);
    }

    var uuidList = tdInfo.uuidList;
    var objList = tdInfo.uuidObjList;
    var propList = tdInfo.uuidPropList;
    var depends = [];

    for (var i = 0; i < uuidList.length; i++) {
        var dependUuid = uuidList[i];
        depends[i] = {
            uuid: helper.decodeUuid(dependUuid),
            owner: objList[i],
            prop: propList[i]
        };
    }

    // non-native deps
    asset.__depends__ = depends;
    // native dep
    asset._native && (asset.__nativeDepend__ = true);
    cc.deserialize.Details.pool.put(tdInfo);
    return asset;

}

module.exports = deserialize;
