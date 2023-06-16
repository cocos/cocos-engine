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
import { RealCurve, Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { E_NORMALIZED_LOOP_AGE } from '../define';
import { VFXModule } from '../vfx-module';
import { VFXParameterMap } from '../vfx-parameter-map';
import { BindingFloatExpression } from './binding-float';
import { ConstantVec3Expression } from './constant-vec3';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

const ratio = new Vec3();

@ccclass('cc.Vec3FromCurveExpression')
export class Vec3FromCurveExpression extends Vec3Expression {
    @type(RealCurve)
    public get x () {
        return this._x;
    }

    public set x (val) {
        this._x = val;
        this.requireRecompile();
    }

    @type(RealCurve)
    public get y () {
        return this._y;
    }

    public set y (val) {
        this._y = val;
        this.requireRecompile();
    }

    @type(RealCurve)
    public get z () {
        return this._z;
    }

    public set z (val) {
        this._z = val;
        this.requireRecompile();
    }

    @type(Vec3Expression)
    public get scale () {
        if (!this._scale) {
            this._scale = new ConstantVec3Expression(1, 1, 1);
        }
        return this._scale;
    }

    public set scale (val) {
        this._scale = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
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

    @serializable
    private _x = new RealCurve();
    @serializable
    private _y = new RealCurve();
    @serializable
    private _z = new RealCurve();
    @serializable
    private _curveIndex: FloatExpression | null = null;
    @serializable
    private _scale: Vec3Expression | null = null;

    public get isConstant (): boolean {
        return false;
    }

    constructor (x?: RealCurve, y?: RealCurve, z?: RealCurve) {
        super();
        if (x) {
            this.x = x;
        }
        if (y) {
            this.y = y;
        }
        if (z) {
            this.z = z;
        }
    }

    public compile (parameterMap: VFXParameterMap, owner: VFXModule) {
        super.compile(parameterMap, owner);
        this.curveIndex.compile(parameterMap, owner);
        this.scale.compile(parameterMap, owner);
    }

    public bind (parameterMap: VFXParameterMap) {
        this._curveIndex!.bind(parameterMap);
        this._scale!.bind(parameterMap);
    }

    public evaluate (index: number, out: Vec3) {
        this._scale!.evaluate(index, ratio);
        const time = this._curveIndex!.evaluate(index);
        out.x = this._x.evaluate(time) * ratio.x;
        out.y = this._y.evaluate(time) * ratio.y;
        out.z = this._z.evaluate(time) * ratio.z;
        return out;
    }
}
