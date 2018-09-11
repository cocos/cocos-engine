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

import Asset from './CCAsset';
import _decorator from '../core/data/class-decorator';
const {ccclass, property} = _decorator;

/**
 * !#en Class for text file.
 * !#zh 文本资源类。
 * @class TextAsset
 * @extends Asset
 */
@ccclass
export default class TextAsset extends Asset {
    get name () { return 'TextAsset'; }

    /**
     * @property {String} text - The text contents of the resource.
     */
    @property()
    text = "";

    /**
     * Returns the text content of the asset.
     *
     * JavaScript calls the toString() method automatically when an asset is to be represented as a text value or when a texture is referred to in a string concatenation.
     *
     * @method toString
     * @return {String}
     */
    toString () {
        return this.text;
    }
}

cc.TextAsset = TextAsset;