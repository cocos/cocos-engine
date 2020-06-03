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

import { errorID } from "../platform/debug";
import { js } from "../utils/js";
import { Texture2D } from "../assets/texture-2d";

export class JsonUnpacker {
    public jsons = {};

    /*
     * @param {String[]} indices
     * @param {Object[]} packedJson
     */
    load (indices, packedJson) {
        if (packedJson.length !== indices.length) {
            errorID(4915);
        }
        for (let i = 0; i < indices.length; i++) {
            let key = indices[i];
            let json = packedJson[i];
            this.jsons[key] = json;
        }
    }

    retrieve (key) {
        return this.jsons[key] || null;
    }
}


export class TextureUnpacker {
    public contents = {};

    /*
     * @param {String[]} indices
     * @param {Object[]} packedJson
     */
    load (indices, packedJson) {
        let datas = packedJson.data;
        if (datas.length !== indices.length) {
            errorID(4915);
        }
        for (let i = 0; i < indices.length; i++) {
            this.contents[indices[i]] = {base: datas[i][0], mipmaps: datas[i][1]};
        }
    }

    retrieve (key) {
        let content = this.contents[key];
        if (content) {
            return {
                __type__: js._getClassId(Texture2D),
                content: content
            };
        }
        else {
            return null;
        }
    }
}