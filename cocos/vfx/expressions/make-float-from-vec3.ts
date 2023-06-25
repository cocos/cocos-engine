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
import { Enum, Vec3 } from '../../core';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { VFXModule } from '../vfx-module';
import { VFXParameterRegistry } from '../vfx-parameter';
import { VFXParameterMap } from '../vfx-parameter-map';
import { ConstantVec3Expression } from './constant-vec3';
import { FloatExpression } from './float';
import { Vec3Expression } from './vec3';

const temp = new Vec3();

export enum Vec3Channel {
    X,
    Y,
    Z,
}

@ccclass('cc.MakeFloatFromVec3Expression')
export class MakeFloatFromVec3Expression extends FloatExpression {
    @type(Vec3Expression)
    public get vec3 () {
        if (!this._vec3) {
            this._vec3 = new ConstantVec3Expression();
        }
        return this._vec3;
    }

    public set vec3 (val) {
        this._vec3 = val;
        this.requireRecompile();
    }

    @type(Enum(Vec3Channel))
    public get channel () {
        return this._channel;
    }

    public set channel (val) {
        this._channel = val;
        this.requireRecompile();
    }

    public get isConstant (): boolean {
        return this.vec3.isConstant;
    }

    private _getChannel = this._getX;

    private _getX (vec3: Vec3) {
        return vec3.x;
    }

    private _getY (vec3: Vec3) {
        return vec3.y;
    }

    private _getZ (vec3: Vec3) {
        return vec3.z;
    }

    @serializable
    private _channel = Vec3Channel.X;
    @serializable
    private _vec3: Vec3Expression | null = null;

    public compile (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry, owner: VFXModule) {
        let compileResult = super.compile(parameterMap, parameterRegistry, owner);
        compileResult &&= this.vec3.compile(parameterMap, parameterRegistry, owner);
        switch (this.channel) {
        case Vec3Channel.X: this._getChannel = this._getX; break;
        case Vec3Channel.Y: this._getChannel = this._getY; break;
        case Vec3Channel.Z: this._getChannel = this._getZ; break;
        default: this._getChannel = this._getX; break;
        }
        return compileResult;
    }

    public bind (parameterMap: VFXParameterMap) {
        this._vec3!.bind(parameterMap);
    }

    public evaluate (index: number): number {
        this._vec3!.evaluate(index, temp);
        return this._getChannel(temp);
    }
}
