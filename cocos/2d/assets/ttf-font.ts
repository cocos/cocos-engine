/*
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
*/

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass, string, override, serializable } from 'cc.decorator';
import { extname } from '../../core/utils/path';
import { Font } from './font';
import { legacyCC } from '../../core/global-exports';

/**
 * @en Class for TTFFont asset.
 * @zh TTF 字体资源类。
 */
@ccclass('cc.TTFFont')
export class TTFFont extends Font {
    /**
     * @legacyPublic
     */
    @serializable
    public _fontFamily: string | null = null;

    /**
     * @legacyPublic
     */
    @override
    @string
    get _nativeAsset () {
        return this._fontFamily;
    }
    set _nativeAsset (value) {
        this._fontFamily = value || 'Arial';
    }

    /**
     * @legacyPublic
     */
    @override
    get _nativeDep () {
        return { uuid: this._uuid, __nativeName__: this._native, ext: extname(this._native), __isNative__: true };
    }

    public initDefault (uuid?: string) {
        this._fontFamily = 'Arial';
        super.initDefault(uuid);
    }
}

legacyCC.TTFFont = TTFFont;
