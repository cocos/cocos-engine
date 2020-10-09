/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import deserializeForCompiled from './deserialize-compiled';

deserializeForCompiled.reportMissingClass = function (id) {
    if (CC_EDITOR && Editor.Utils.UuidUtils.isUuid(id)) {
        id = Editor.Utils.UuidUtils.decompressUuid(id);
        cc.warnID(5301, id);
    }
    else {
        cc.warnID(5302, id);
    }
};

if (CC_BUILD) {
    cc.deserialize = deserializeForCompiled;
}
else {
    let deserializeForEditor = require('./deserialize-editor');

    cc.deserialize = function (data, details, options) {
        if (CC_EDITOR && Buffer.isBuffer(data)) {
            data = data.toString();
        }
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (CC_PREVIEW) {
            // support for loading Asset Bundle from server
            if (deserializeForCompiled.isCompiledJson(data)) {
                return deserializeForCompiled(data, details, options);
            }
        }
        return deserializeForEditor(data, details, options);
    };
    cc.deserialize.reportMissingClass = deserializeForCompiled.reportMissingClass;
    cc.deserialize.Details = deserializeForEditor.Details;
}
