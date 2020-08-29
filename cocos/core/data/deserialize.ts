/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com

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

import { BUILD, PREVIEW } from 'internal:constants';
import { legacyCC } from '../global-exports';

import { default as deserializeCompiled } from './deserialize-compiled';
import { default as deserializeDynamic } from './deserialize-dynamic';

if (BUILD) {
    legacyCC.deserialize = deserializeCompiled;
}
else {
    function deserialize (data, details, options) {
        if (typeof data === 'string') {
            data = JSON.parse(data);
        }
        if (PREVIEW && deserializeCompiled.isCompiledJson(data)) {
            // support for loading Asset Bundle from server
            return deserializeCompiled(data, details, options);
        }
        else {
            return deserializeDynamic(data, details, options);
        }
    }
    legacyCC.deserialize = deserialize;
    (deserialize as any).reportMissingClass = deserializeDynamic.reportMissingClass;
    (deserialize as any).Details = (deserializeDynamic as any).Details;
}

export default legacyCC.deserialize;
