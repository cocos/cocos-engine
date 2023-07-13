/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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

import { CCBoolean, CCFloat, CCInteger } from '../../../core';
import { ccclass, disallowMultiple, editable, executeInEditMode, help, menu, range,
    serializable, slide, tooltip, type, visible } from '../../../core/data/decorators';
import { PostProcessSetting } from './post-process-setting';

@ccclass('cc.HBAO')
@help('cc.HBAO')
@menu('PostProcess/HBAO')
@disallowMultiple
@executeInEditMode
export class HBAO extends PostProcessSetting {
    @serializable
    protected _radiusScale = 1.0;
    @serializable
    protected _angleBiasDegree = 10.0;
    @serializable
    protected _blurSharpness = 3;
    @serializable
    protected _aoSaturation = 1.0;
    @serializable
    protected _needBlur = true;

    @slide
    @tooltip('i18n:hbao.radiusScale')
    @range([0, 10, 0.01])
    @type(CCFloat)
    @editable
    set radiusScale (value: number) {
        this._radiusScale = value;
    }
    get radiusScale (): number {
        return this._radiusScale;
    }

    @visible(false)
    @slide
    @tooltip('i18n:hbao.angleBiasDegree')
    @range([0, 100, 0.1])
    @type(CCFloat)
    @editable
    set angleBiasDegree (value: number) {
        this._angleBiasDegree = value;
    }
    get angleBiasDegree (): number {
        return this._angleBiasDegree;
    }

    @visible(false)
    @slide
    @tooltip('i18n:hbao.blurSharpness')
    @range([0, 10, 1])
    @type(CCInteger)
    @editable
    set blurSharpness (value: number) {
        this._blurSharpness = value;
    }
    get blurSharpness (): number {
        return this._blurSharpness;
    }

    @slide
    @tooltip('i18n:hbao.aoSaturation')
    @range([0, 10, 0.01])
    @type(CCFloat)
    @editable
    set aoSaturation (value: number) {
        this._aoSaturation = value;
    }
    get aoSaturation (): number {
        return this._aoSaturation;
    }

    @tooltip('i18n:hbao.needBlur')
    @type(CCBoolean)
    @editable
    set needBlur (value: boolean) {
        this._needBlur = value;
    }
    get needBlur (): boolean {
        return this._needBlur;
    }
}
