/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass, string, override, serializable } from 'cc.decorator';
import { path, cclegacy } from '../../core';
import { Font } from './font';

/**
 * @en Class for TTFFont asset.
 * @zh TTF 字体资源类。
 */
@ccclass('cc.TTFFont')
export class TTFFont extends Font {
    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @serializable
    public _fontFamily: string | null = null;

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @override
    @string
    get _nativeAsset (): string | null {
        return this._fontFamily;
    }
    set _nativeAsset (value) {
        this._fontFamily = value || 'Arial';
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    @override
    get _nativeDep (): {
        uuid: string;
        __nativeName__: string;
        ext: string;
        __isNative__: boolean;
    } {
        return { uuid: this._uuid, __nativeName__: this._native, ext: path.extname(this._native), __isNative__: true };
    }

    /**
     * @en default init.
     * @zh 默认初始化。
     * @param uuid @en Asset uuid. @zh 资源 uuid。
     * @deprecated since v3.7.0, this is an engine private interface that will be removed in the future.
     */
    public initDefault (uuid?: string): void {
        this._fontFamily = 'Arial';
        super.initDefault(uuid);
    }
}

cclegacy.TTFFont = TTFFont;
