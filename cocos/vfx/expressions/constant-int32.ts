/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
import { CCInteger } from '../../core';
import { ccclass, serializable, type } from '../../core/data/class-decorator';
import { VFXParameterMap } from '../vfx-parameter-map';
import { Int32Expression } from './int32';

@ccclass('cc.ConstantInt32Expression')
export class ConstantInt32Expression extends Int32Expression {
    @type(CCInteger)
    public get value () {
        return this._value;
    }

    public set value (val) {
        this._value = val | 0;
    }

    public get isConstant () {
        return true;
    }

    @serializable
    private _value = 0;

    constructor (value = 0) {
        super();
        this.value = value;
    }

    public tick (parameterMap: VFXParameterMap) {}
    public bind (parameterMap: VFXParameterMap) {}

    public evaluate (index: number): number {
        return this.value;
    }

    public evaluateSingle (): number {
        return this.value;
    }
}
