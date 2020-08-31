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

const helper = require('./helper');
const MissingClass = CC_EDITOR && Editor.require('app://editor/page/scene-utils/missing-class-reporter').MissingClass;
require('../platform/deserialize');

function deserialize (json, options) {
    var classFinder, missingClass;
    if (CC_EDITOR) {
        missingClass = MissingClass;
        classFinder = function (type, data, owner, propName) {
            var res = missingClass.classFinder(type, data, owner, propName);
            if (res) {
                return res;
            }
            return cc._MissingScript;
        };
        classFinder.onDereferenced = missingClass.classFinder.onDereferenced;
    }
    else {
        classFinder = cc._MissingScript.safeFindClass;
    }

    let pool = null;
    if (!CC_PREVIEW) {
        pool = cc.deserialize.Details.pool;
    }
    else {
        let { default: deserializeForCompiled } = require('../platform/deserialize-compiled');
        let deserializeForEditor = require('../platform/deserialize-editor');
        if (deserializeForCompiled.isCompiledJson(json)) {
            pool = deserializeForCompiled.Details.pool;
        }
        else {
            pool = deserializeForEditor.Details.pool;
        }
    }
    var tdInfo = pool.get();

    var asset;
    try {
        asset = cc.deserialize(json, tdInfo, {
            classFinder: classFinder,
            customEnv: options
        });
    }
    catch (e) {
        pool.put(tdInfo);
        throw e;
    }

    if (CC_EDITOR && missingClass) {
        missingClass.reportMissingClass(asset);
        missingClass.reset();
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
    pool.put(tdInfo);
    return asset;

}

module.exports = deserialize;
