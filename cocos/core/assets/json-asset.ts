/*
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
*/

import { ccclass, serializable, editable } from 'cc.decorator';
import { Asset } from './asset';
import { legacyCC } from '../global-exports';

/**
 * @en Json asset, it will automatically parse the json to a JS object.
 * @zh Json 资源。
 * Json 资源加载后将直接解析为对象。如果你希望获得 JSON 的原始文本，你需要使用文本资源（使用文件名后缀“.txt”）。
 */
@ccclass('cc.JsonAsset')
export default class JsonAsset extends Asset {
    /**
     * @en The parsed JS object
     * @zh 解析后的对象。
     */
    @serializable
    @editable
    public json: object | null = null;
}

legacyCC.JsonAsset = JsonAsset;
