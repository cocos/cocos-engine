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
import { Vec3, serializable } from '../../core';
import { ccclass, type } from '../../core/data/class-decorator';
import { VFXModule } from '../vfx-module';
import { VFXParameterRegistry } from '../vfx-parameter';
import { VFXParameterMap } from '../vfx-parameter-map';
import { ConstantFloatExpression } from './constant-float';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

@ccclass('cc.MakeVec3Expression')
export class MakeVec3Expression extends Vec3Expression {
    @type(FloatExpression)
    public get x () {
        if (!this._x) {
            this._x = new ConstantFloatExpression();
        }
        return this._x;
    }

    public set x (val) {
        this._x = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    public get y () {
        if (!this._y) {
            this._y = new ConstantFloatExpression();
        }
        return this._y;
    }

    public set y (val) {
        this._y = val;
        this.requireRecompile();
    }

    @type(FloatExpression)
    public get z () {
        if (!this._z) {
            this._z = new ConstantFloatExpression();
        }
        return this._z;
    }

    public set z (val) {
        this._z = val;
        this.requireRecompile();
    }

    @serializable
    private _x: FloatExpression | null = null;
    @serializable
    private _y: FloatExpression | null = null;
    @serializable
    private _z: FloatExpression | null = null;

    public get isConstant (): boolean {
        return this.x.isConstant && this.y.isConstant && this.z.isConstant;
    }

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXModule) {
        super.compile(parameterMap, parameterRegistry, owner);
        this.x.compile(parameterMap, parameterRegistry, owner);
        this.y.compile(parameterMap, parameterRegistry, owner);
        this.z.compile(parameterMap, parameterRegistry, owner);
    }
    public bind (parameterMap: VFXParameterMap) {
        this._x!.bind(parameterMap);
        this._y!.bind(parameterMap);
        this._z!.bind(parameterMap);
    }

    public evaluate (index: number, out: Vec3) {
        out.x = this._x!.evaluate(index);
        out.y = this._y!.evaluate(index);
        out.z = this._z!.evaluate(index);
        return out;
    }
}
