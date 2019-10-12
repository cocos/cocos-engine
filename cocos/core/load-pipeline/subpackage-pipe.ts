/*
 Copyright (c) 2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
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
*/
/**
 * @hidden
 */

import decodeUuid from '../utils/decode-uuid';
import { Pipeline, IPipe } from './pipeline';

const ID = 'SubPackPipe';
const UuidRegex = /.*[/\\][0-9a-fA-F]{2}[/\\]([0-9a-fA-F-@]{8,}).*/;

function getUuidFromURL(url) {
    let matches = url.match(UuidRegex);
    if (matches) {
        return matches[1];
    }
    return "";
}

let _uuidToSubPack = Object.create(null);

export class SubPackPipe implements IPipe {
    static ID = ID;
    public id = ID;
    public async = false;
    public pipeline = null;
    constructor (subpackage) {
        for (let packName in subpackage) {
            let pack = subpackage[packName];
            pack.uuids && pack.uuids.forEach(function (val) {
                let uuid = decodeUuid(val);
                const uuids = uuid.split('@').map((name) => {
                    return encodeURIComponent(name);
                });
                uuid = uuids.join('@');
                _uuidToSubPack[uuid] = pack.path;
            });
        }
    }

    handle (item) {
        item.url = this.transformURL(item.url);
        return null;
    }

    transformURL (url) {
        let uuid = getUuidFromURL(url);
        if (uuid) {
            let subpackage = _uuidToSubPack[uuid];
            if (subpackage) {
                // only replace url of native assets
                return url.replace('res/raw-assets/', subpackage + 'raw-assets/');
            }
        }
        return url;
    }
}

// @ts-ignore
Pipeline.SubPackPipe = SubPackPipe;
