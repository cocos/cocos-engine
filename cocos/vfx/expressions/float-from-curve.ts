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
import { RealCurve } from '../../core';
import { ccclass, serializable, type, visible } from '../../core/data/decorators';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';
import { BindingFloatExpression } from './binding-float';
import { E_NORMALIZED_LOOP_AGE } from '../define';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXModule } from '../vfx-module';

@ccclass('cc.FloatFromCurveExpression')
export class FloatFromCurveExpression extends FloatExpression {
    @type(RealCurve)
    public get curve () {
        return this._curve;
    }

    public set curve (val) {
        this._curve = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    @visible(true)
    public get scale () {
        if (!this._scale) {
            this._scale = new ConstantFloatExpression(1);
        }
        return this._scale;
    }

    public set scale (val) {
        this._scale = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    @visible(true)
    public get curveIndex () {
        if (!this._curveIndex) {
            this._curveIndex = new BindingFloatExpression(E_NORMALIZED_LOOP_AGE);
        }
        return this._curveIndex;
    }

    public set curveIndex (val) {
        this._curveIndex = val;
        this.requireRecompile();
    }

    public get isConstant (): boolean {
        return this.curveIndex.isConstant && this.scale.isConstant;
    }

    @serializable
    private _curveIndex: FloatExpression | null = null;
    @serializable
    private _scale: FloatExpression | null = null;
    @serializable
    private _curve = new RealCurve();

    constructor (curve?: RealCurve) {
        super();
        if (curve) {
            this.curve = curve;
        }
    }

    public compile (parameterMap: VFXParameterMap, owner: VFXModule) {
        super.compile(parameterMap, owner);
        this.scale.compile(parameterMap, owner);
        this.curveIndex.compile(parameterMap, owner);
    }

    public bind (parameterMap: VFXParameterMap) {
        this._curveIndex!.bind(parameterMap);
        this._scale!.bind(parameterMap);
    }

    public evaluate (index: number): number {
        return this.curve.evaluate(this._curveIndex!.evaluate(index)) * this._scale!.evaluate(index);
    }
}
